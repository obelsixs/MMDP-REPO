import XLSX from 'xlsx';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📋 Template Files Analysis\n');
console.log('═'.repeat(80));

const dataSourcePath = join(__dirname, '..', 'data-source');
const files = readdirSync(dataSourcePath).filter(f => f.endsWith('.xlsx'));

console.log(`\n📁 Directory: ${dataSourcePath}`);
console.log(`📑 Template Files: ${files.length}\n`);

files.forEach((file, index) => {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`📄 FILE ${index + 1}: ${file}`);
  console.log(`${'─'.repeat(80)}\n`);

  const filePath = join(dataSourcePath, file);
  const workbook = XLSX.readFile(filePath);

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    console.log(`📋 Sheet: "${sheetName}"`);

    if (jsonData.length === 0) {
      console.log('⚠️  Empty sheet\n');
      return;
    }

    const headers = Object.keys(jsonData[0]);
    console.log(`📊 Columns (${headers.length} total):`);
    headers.forEach((header, i) => {
      console.log(`   ${i + 1}. ${header}`);
    });

    console.log(`\n📈 Sample Rows: ${jsonData.length}\n`);
  });
});

console.log(`\n${'═'.repeat(80)}`);
console.log('✅ Template analysis complete!\n');
