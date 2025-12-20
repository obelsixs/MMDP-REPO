import XLSX from 'xlsx';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Updating Mills Template: IRF Status + TTP Column\n');
console.log('═'.repeat(80));

try {
  const dataSourcePath = join(__dirname, '..', 'data-source');
  const millsPath = join(dataSourcePath, 'mills-template.xlsx');

  // Read the Excel file
  console.log('📂 Reading mills-template.xlsx...\n');
  const workbook = XLSX.readFile(millsPath);
  const worksheet = workbook.Sheets['Mills'];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log(`✅ Found ${data.length} mills\n`);

  // IRF Status values with distribution
  const irfStatuses = {
    'Delivering': 0.70,      // 70%
    'Progressing': 0.10,     // 10%
    'Unknown': 0.08,         // 8%
    'Awareness': 0.05,       // 5%
    'Commitment': 0.04,      // 4%
    'Starting': 0.03         // 3%
  };

  // Helper function to pick random IRF status based on distribution
  function getRandomIRFStatus() {
    const rand = Math.random();
    let cumulative = 0;

    for (const [status, probability] of Object.entries(irfStatuses)) {
      cumulative += probability;
      if (rand <= cumulative) {
        return status;
      }
    }
    return 'Delivering'; // Fallback
  }

  // Helper function to generate random TTP percentage (80-100%)
  function getRandomTTP() {
    return Math.floor(Math.random() * 21) + 80; // 80 to 100
  }

  console.log('🔄 Updating data:\n');
  console.log('   - Renaming sourcing_status → irf_status');
  console.log('   - Populating IRF status values (70% Delivering, 30% mixed)');
  console.log('   - Adding TTP column (80-100% random values)\n');

  // Update each mill record
  const updatedData = data.map(mill => {
    const { sourcing_status, sourcing_status_last_updated, ...rest } = mill;

    return {
      ...rest,
      irf_status: getRandomIRFStatus(),
      irf_status_last_updated: sourcing_status_last_updated || '2025-12-06',
      ttp: getRandomTTP()
    };
  });

  // Count distribution
  const distribution = updatedData.reduce((acc, mill) => {
    acc[mill.irf_status] = (acc[mill.irf_status] || 0) + 1;
    return acc;
  }, {});

  console.log('📊 IRF Status Distribution:');
  Object.entries(distribution).forEach(([status, count]) => {
    const percentage = ((count / updatedData.length) * 100).toFixed(1);
    console.log(`   ${status}: ${count} (${percentage}%)`);
  });

  // Calculate TTP stats
  const ttpValues = updatedData.map(m => m.ttp);
  const avgTTP = (ttpValues.reduce((a, b) => a + b, 0) / ttpValues.length).toFixed(1);
  const minTTP = Math.min(...ttpValues);
  const maxTTP = Math.max(...ttpValues);

  console.log(`\n📊 TTP Statistics:`);
  console.log(`   Average: ${avgTTP}%`);
  console.log(`   Range: ${minTTP}% - ${maxTTP}%`);

  // Convert back to worksheet
  const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
  workbook.Sheets['Mills'] = newWorksheet;

  // Write back to Excel
  console.log('\n💾 Writing updated mills-template.xlsx...\n');
  XLSX.writeFile(workbook, millsPath);

  console.log('═'.repeat(80));
  console.log('✅ Mills template updated successfully!\n');
  console.log('📝 Changes made:');
  console.log('   ✓ sourcing_status → irf_status');
  console.log('   ✓ Added ttp column (Traceability to Plantation)');
  console.log('   ✓ Updated 1449 mill records\n');
  console.log('💡 Next: Run npm run dev to regenerate JSON files');
  console.log('═'.repeat(80));

} catch (error) {
  console.error('❌ Error updating mills template:', error.message);
  process.exit(1);
}
