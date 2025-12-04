import XLSX from 'xlsx';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Excel to JSON Conversion\n');
console.log('═'.repeat(80));

try {
  // ═══════════════════════════════════════════════════════════════
  // STEP 1: Setup paths
  // ═══════════════════════════════════════════════════════════════
  const dataSourcePath = join(__dirname, '..', 'data-source');
  const publicDataPath = join(__dirname, '..', 'public', 'data');

  // Create public/data directory if it doesn't exist
  if (!existsSync(publicDataPath)) {
    mkdirSync(publicDataPath, { recursive: true });
    console.log('✅ Created public/data directory\n');
  }

  // ═══════════════════════════════════════════════════════════════
  // STEP 2: Read Excel files
  // ═══════════════════════════════════════════════════════════════
  console.log('📂 Reading Excel files from data-source/\n');

  const millsWB = XLSX.readFile(join(dataSourcePath, 'mills-template.xlsx'));
  const facilitiesWB = XLSX.readFile(join(dataSourcePath, 'facilities-template.xlsx'));
  const distancesWB = XLSX.readFile(join(dataSourcePath, 'mill-facility-distances-template.xlsx'));
  const transactionsWB = XLSX.readFile(join(dataSourcePath, 'transactions-template.xlsx'));

  // ═══════════════════════════════════════════════════════════════
  // STEP 3: Convert to JSON
  // ═══════════════════════════════════════════════════════════════
  console.log('🔄 Converting to JSON format\n');

  const mills = XLSX.utils.sheet_to_json(millsWB.Sheets['Mills']);
  const facilities = XLSX.utils.sheet_to_json(facilitiesWB.Sheets['Facilities']);
  const distances = XLSX.utils.sheet_to_json(distancesWB.Sheets['MillFacilityDistances']);
  const transactions = XLSX.utils.sheet_to_json(transactionsWB.Sheets['Transactions']);

  // ═══════════════════════════════════════════════════════════════
  // STEP 4: Data transformation and cleaning
  // ═══════════════════════════════════════════════════════════════
  console.log('🧹 Cleaning and transforming data\n');

  // Transform mills: parse scenario_tags from string to array
  const cleanedMills = mills.map(mill => ({
    ...mill,
    scenario_tags: mill.scenario_tags ?
      (typeof mill.scenario_tags === 'string' ? JSON.parse(mill.scenario_tags) : mill.scenario_tags) :
      [],
    nbl_flag: mill.nbl_flag === true || mill.nbl_flag === 'true' || mill.nbl_flag === 1,
    ndpe_violation_found: mill.ndpe_violation_found === true || mill.ndpe_violation_found === 'true',
    public_grievance_flag: mill.public_grievance_flag === true || mill.public_grievance_flag === 'true',
    competitor_flag: mill.competitor_flag === true || mill.competitor_flag === 'true'
  }));

  // Validate distances are numbers
  const cleanedDistances = distances.map(d => ({
    ...d,
    distance_km: typeof d.distance_km === 'number' ? d.distance_km : parseFloat(d.distance_km)
  }));

  // ═══════════════════════════════════════════════════════════════
  // STEP 5: Write JSON files
  // ═══════════════════════════════════════════════════════════════
  console.log('💾 Writing JSON files to public/data/\n');

  writeFileSync(
    join(publicDataPath, 'mills.json'),
    JSON.stringify(cleanedMills, null, 2),
    'utf8'
  );
  console.log(`   ✅ mills.json (${cleanedMills.length} records)`);

  writeFileSync(
    join(publicDataPath, 'facilities.json'),
    JSON.stringify(facilities, null, 2),
    'utf8'
  );
  console.log(`   ✅ facilities.json (${facilities.length} records)`);

  writeFileSync(
    join(publicDataPath, 'distances.json'),
    JSON.stringify(cleanedDistances, null, 2),
    'utf8'
  );
  console.log(`   ✅ distances.json (${cleanedDistances.length} records)`);

  writeFileSync(
    join(publicDataPath, 'transactions.json'),
    JSON.stringify(transactions, null, 2),
    'utf8'
  );
  console.log(`   ✅ transactions.json (${transactions.length} records)`);

  // ═══════════════════════════════════════════════════════════════
  // STEP 6: Summary
  // ═══════════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(80));
  console.log('✅ Excel to JSON conversion complete!\n');
  console.log('📊 Summary:');
  console.log(`   🏭 Mills: ${cleanedMills.length}`);
  console.log(`   🏢 Facilities: ${facilities.length}`);
  console.log(`   📏 Distances: ${cleanedDistances.length}`);
  console.log(`   💰 Transactions: ${transactions.length}`);
  console.log('\n📁 Output: public/data/');
  console.log('═'.repeat(80));

} catch (error) {
  console.error('\n❌ Conversion Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
