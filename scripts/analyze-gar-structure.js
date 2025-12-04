import XLSX from 'xlsx';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📊 GAR Table Structure Analysis\n');
console.log('═'.repeat(80));

try {
  // Read the Excel file
  const filePath = join(__dirname, '..', 'GAR_Table_structure.xlsx');
  const workbook = XLSX.readFile(filePath);

  console.log(`\n📁 File: GAR_Table_structure.xlsx`);
  console.log(`📑 Total Sheets: ${workbook.SheetNames.length}\n`);

  // Analyze each sheet
  workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`📋 SHEET ${index + 1}: "${sheetName}"`);
    console.log(`${'─'.repeat(80)}\n`);

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    if (jsonData.length === 0) {
      console.log('⚠️  Empty sheet\n');
      return;
    }

    // Get column headers
    const headers = Object.keys(jsonData[0]);
    console.log(`📊 Columns (${headers.length} total):`);
    headers.forEach((header, i) => {
      console.log(`   ${i + 1}. ${header}`);
    });

    console.log(`\n📈 Rows: ${jsonData.length} (excluding header)`);

    // Sample data (first 3 rows)
    console.log(`\n📝 Sample Data (first 3 rows):\n`);
    jsonData.slice(0, 3).forEach((row, i) => {
      console.log(`   Row ${i + 1}:`);
      Object.entries(row).forEach(([key, value]) => {
        const displayValue = value === null ? '(empty)' :
                           typeof value === 'string' && value.length > 50 ?
                           value.substring(0, 47) + '...' : value;
        console.log(`      ${key}: ${displayValue}`);
      });
      console.log('');
    });

    // Data type analysis
    console.log(`📊 Data Type Summary:`);
    const typeAnalysis = {};
    headers.forEach(header => {
      const types = new Set();
      jsonData.slice(0, 100).forEach(row => {
        const val = row[header];
        if (val === null || val === undefined) types.add('null');
        else if (typeof val === 'number') types.add('number');
        else if (typeof val === 'boolean') types.add('boolean');
        else if (typeof val === 'string') types.add('string');
        else types.add(typeof val);
      });
      typeAnalysis[header] = Array.from(types).join(' | ');
    });

    Object.entries(typeAnalysis).forEach(([col, types]) => {
      console.log(`   ${col}: ${types}`);
    });
  });

  console.log(`\n${'═'.repeat(80)}`);
  console.log('✅ Analysis complete!\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
