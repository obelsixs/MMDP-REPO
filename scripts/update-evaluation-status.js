import XLSX from 'xlsx';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Updating Evaluation Status Values\n');
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

  // Count current status distribution
  const currentDistribution = data.reduce((acc, mill) => {
    acc[mill.evaluation_status] = (acc[mill.evaluation_status] || 0) + 1;
    return acc;
  }, {});

  console.log('📊 Current Evaluation Status Distribution:');
  Object.entries(currentDistribution).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`);
  });

  console.log('\n🔄 Updating evaluation_status values:\n');
  console.log('   "Eligible" → "Evaluated"');
  console.log('   Keeping: "Not Eligible (NBL)", "Under Evaluation", "Not Evaluated"\n');

  // Update evaluation_status values
  let updatedCount = 0;
  const updatedData = data.map(mill => {
    if (mill.evaluation_status === 'Eligible') {
      updatedCount++;
      return {
        ...mill,
        evaluation_status: 'Evaluated'
      };
    }
    return mill;
  });

  // Count new distribution
  const newDistribution = updatedData.reduce((acc, mill) => {
    acc[mill.evaluation_status] = (acc[mill.evaluation_status] || 0) + 1;
    return acc;
  }, {});

  console.log('📊 New Evaluation Status Distribution:');
  Object.entries(newDistribution).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`);
  });

  console.log(`\n✅ Updated ${updatedCount} mills from "Eligible" to "Evaluated"`);

  // Convert back to worksheet
  const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
  workbook.Sheets['Mills'] = newWorksheet;

  // Write back to Excel
  console.log('\n💾 Writing updated mills-template.xlsx...\n');
  XLSX.writeFile(workbook, millsPath);

  console.log('═'.repeat(80));
  console.log('✅ Evaluation status values updated successfully!\n');
  console.log('📝 Changes made:');
  console.log(`   ✓ Changed ${updatedCount} mills from "Eligible" to "Evaluated"`);
  console.log('   ✓ Possible values now: Evaluated, Not Eligible (NBL), Under Evaluation, Not Evaluated\n');
  console.log('💡 Next: Update TypeScript interface and restart dev server');
  console.log('═'.repeat(80));

} catch (error) {
  console.error('❌ Error updating evaluation status:', error.message);
  process.exit(1);
}
