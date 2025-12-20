import XLSX from 'xlsx';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Fixing Status Columns\n');
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

  // Show current distribution
  const currentEligDist = {};
  const currentEvalDist = {};
  data.forEach(mill => {
    currentEligDist[mill.eligibility_status] = (currentEligDist[mill.eligibility_status] || 0) + 1;
    currentEvalDist[mill.evaluation_status] = (currentEvalDist[mill.evaluation_status] || 0) + 1;
  });

  console.log('📊 Current Distribution:');
  console.log('\n  eligibility_status:');
  Object.entries(currentEligDist).forEach(([status, count]) => {
    console.log(`    ${status || 'undefined'}: ${count}`);
  });
  console.log('\n  evaluation_status:');
  Object.entries(currentEvalDist).forEach(([status, count]) => {
    console.log(`    ${status || 'undefined'}: ${count}`);
  });

  console.log('\n🔄 Applying fixes:\n');
  console.log('  eligibility_status rules:');
  console.log('    - "Not Eligible (NBL)" → "Not Eligible"');
  console.log('    - "Eligible" → keep as is');
  console.log('    - undefined → keep as undefined\n');

  console.log('  evaluation_status rules:');
  console.log('    - "Not Eligible (NBL)" → "Not Evaluated" (for NBL mills)');
  console.log('    - "Evaluated" → keep as is');
  console.log('    - "Not Evaluated" → keep as is');
  console.log('    - Add some "Under Evaluation" for testing\n');

  let eligFixCount = 0;
  let evalFixCount = 0;
  let underEvalCount = 0;

  const updatedData = data.map((mill, index) => {
    const updated = { ...mill };

    // Fix eligibility_status: "Not Eligible (NBL)" → "Not Eligible"
    if (mill.eligibility_status === 'Not Eligible (NBL)') {
      updated.eligibility_status = 'Not Eligible';
      eligFixCount++;
    }

    // Fix evaluation_status: "Not Eligible (NBL)" → "Not Evaluated"
    if (mill.evaluation_status === 'Not Eligible (NBL)') {
      updated.evaluation_status = 'Not Evaluated';
      evalFixCount++;
    }

    // Add some "Under Evaluation" for testing (10% of mills with undefined eligibility)
    if (!mill.eligibility_status && Math.random() < 0.4) {
      updated.evaluation_status = 'Under Evaluation';
      underEvalCount++;
    }

    return updated;
  });

  // Show new distribution
  const newEligDist = {};
  const newEvalDist = {};
  updatedData.forEach(mill => {
    newEligDist[mill.eligibility_status] = (newEligDist[mill.eligibility_status] || 0) + 1;
    newEvalDist[mill.evaluation_status] = (newEvalDist[mill.evaluation_status] || 0) + 1;
  });

  console.log('📊 New Distribution:');
  console.log('\n  eligibility_status:');
  Object.entries(newEligDist).forEach(([status, count]) => {
    console.log(`    ${status || 'undefined'}: ${count}`);
  });
  console.log('\n  evaluation_status:');
  Object.entries(newEvalDist).forEach(([status, count]) => {
    console.log(`    ${status || 'undefined'}: ${count}`);
  });

  console.log(`\n✅ Fixed ${eligFixCount} eligibility_status entries`);
  console.log(`✅ Fixed ${evalFixCount} evaluation_status entries`);
  console.log(`✅ Added ${underEvalCount} "Under Evaluation" entries`);

  // Convert back to worksheet
  const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
  workbook.Sheets['Mills'] = newWorksheet;

  // Write back to Excel
  console.log('\n💾 Writing updated mills-template.xlsx...\n');
  XLSX.writeFile(workbook, millsPath);

  console.log('═'.repeat(80));
  console.log('✅ Status columns fixed successfully!\n');
  console.log('📝 Summary:');
  console.log(`   ✓ eligibility_status values: Eligible, Not Eligible, undefined`);
  console.log(`   ✓ evaluation_status values: Evaluated, Not Evaluated, Under Evaluation\n`);
  console.log('💡 Next: Restart dev server to regenerate JSON files');
  console.log('═'.repeat(80));

} catch (error) {
  console.error('❌ Error fixing status columns:', error.message);
  process.exit(1);
}
