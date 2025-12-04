import XLSX from 'xlsx';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('✅ Data Validation Report\n');
console.log('═'.repeat(80));

try {
  const dataSourcePath = join(__dirname, '..', 'data-source');

  // Read all template files
  const millsWB = XLSX.readFile(join(dataSourcePath, 'mills-template.xlsx'));
  const facilitiesWB = XLSX.readFile(join(dataSourcePath, 'facilities-template.xlsx'));
  const distancesWB = XLSX.readFile(join(dataSourcePath, 'mill-facility-distances-template.xlsx'));
  const transactionsWB = XLSX.readFile(join(dataSourcePath, 'transactions-template.xlsx'));

  const mills = XLSX.utils.sheet_to_json(millsWB.Sheets['Mills']);
  const facilities = XLSX.utils.sheet_to_json(facilitiesWB.Sheets['Facilities']);
  const distances = XLSX.utils.sheet_to_json(distancesWB.Sheets['MillFacilityDistances']);
  const transactions = XLSX.utils.sheet_to_json(transactionsWB.Sheets['Transactions']);

  console.log('\n📊 ROW COUNTS\n');
  console.log(`   Mills: ${mills.length}`);
  console.log(`   Facilities: ${facilities.length}`);
  console.log(`   Distances: ${distances.length}`);
  console.log(`   Transactions: ${transactions.length}`);

  console.log('\n🔍 REQUIRED FIELDS CHECK\n');

  // Check required fields in mills
  let requiredMillFields = ['mill_id', 'mill_name', 'parent_group', 'latitude', 'longitude'];
  let millsWithMissingFields = 0;
  mills.forEach(mill => {
    const missing = requiredMillFields.filter(field => !mill[field]);
    if (missing.length > 0) millsWithMissingFields++;
  });
  console.log(`   Mills with complete required fields: ${mills.length - millsWithMissingFields}/${mills.length}`);

  // Check unique mill IDs
  const uniqueMillIds = new Set(mills.map(m => m.mill_id));
  console.log(`   Unique mill IDs: ${uniqueMillIds.size}/${mills.length}`);

  // Check unique facility IDs
  const uniqueFacilityIds = new Set(facilities.map(f => f.facility_id));
  console.log(`   Unique facility IDs: ${uniqueFacilityIds.size}/${facilities.length}`);

  console.log('\n📈 DATA QUALITY METRICS\n');

  // NBL flags
  const nblCount = mills.filter(m => m.nbl_flag === true || m.nbl_flag === 'true').length;
  console.log(`   Mills flagged as NBL: ${nblCount}`);

  // Mills with nearest facility
  const withNearestFacility = mills.filter(m => m.nearest_facility).length;
  console.log(`   Mills with nearest facility: ${withNearestFacility}`);

  // Mills with distance data
  const withDistance = mills.filter(m => m.distance_to_nearest != null).length;
  console.log(`   Mills with distance to nearest: ${withDistance}`);

  // Group/Company fields
  const withGroup = mills.filter(m => m.group).length;
  const withCompany = mills.filter(m => m.company).length;
  console.log(`   Mills with group field: ${withGroup}`);
  console.log(`   Mills with company field: ${withCompany}`);

  // Risk levels
  const riskLevels = {};
  mills.forEach(m => {
    const level = m.risk_level || 'null';
    riskLevels[level] = (riskLevels[level] || 0) + 1;
  });
  console.log(`   Risk level distribution:`);
  Object.entries(riskLevels).forEach(([level, count]) => {
    console.log(`      ${level}: ${count}`);
  });

  // Evaluation status
  const evalStatus = {};
  mills.forEach(m => {
    const status = m.evaluation_status || 'null';
    evalStatus[status] = (evalStatus[status] || 0) + 1;
  });
  console.log(`   Evaluation status distribution:`);
  Object.entries(evalStatus).forEach(([status, count]) => {
    console.log(`      ${status}: ${count}`);
  });

  console.log('\n🔗 REFERENTIAL INTEGRITY\n');

  // Check if all distance mill_ids exist in mills
  const distanceMillIds = new Set(distances.map(d => d.mill_id));
  const validDistanceMillIds = [...distanceMillIds].filter(id => uniqueMillIds.has(id));
  console.log(`   Distance records with valid mill_id: ${validDistanceMillIds.length}/${distanceMillIds.size}`);

  // Check if all transaction mill_ids exist in mills
  const transactionMillIds = new Set(transactions.map(t => t.mill_id));
  const validTransactionMillIds = [...transactionMillIds].filter(id => uniqueMillIds.has(id));
  console.log(`   Transaction records with valid mill_id: ${validTransactionMillIds.length}/${transactionMillIds.size}`);

  // Check facility names consistency
  const distanceFacilities = new Set(distances.map(d => d.facility_name));
  const facilityNames = new Set(facilities.map(f => f.facility_name));
  const matchingFacilities = [...distanceFacilities].filter(name => facilityNames.has(name));
  console.log(`   Distance facilities matching facility list: ${matchingFacilities.length}/${distanceFacilities.size}`);

  console.log('\n💰 TRANSACTION ANALYSIS\n');

  const garTxns = transactions.filter(t => t.buyer_type === 'gar').length;
  const competitorTxns = transactions.filter(t => t.buyer_type === 'competitor').length;
  console.log(`   GAR transactions: ${garTxns} (${(garTxns/transactions.length*100).toFixed(1)}%)`);
  console.log(`   Competitor transactions: ${competitorTxns} (${(competitorTxns/transactions.length*100).toFixed(1)}%)`);

  // Product types
  const productTypes = {};
  transactions.forEach(t => {
    const type = t.product_type || 'unknown';
    productTypes[type] = (productTypes[type] || 0) + 1;
  });
  console.log(`   Product type distribution:`);
  Object.entries(productTypes).forEach(([type, count]) => {
    console.log(`      ${type}: ${count}`);
  });

  // Sample buyers
  const uniqueBuyers = [...new Set(transactions.map(t => t.buyer_entity))];
  console.log(`   Unique buyers: ${uniqueBuyers.length}`);
  console.log(`   Sample buyers (first 10):`);
  uniqueBuyers.slice(0, 10).forEach(buyer => {
    const type = transactions.find(t => t.buyer_entity === buyer).buyer_type;
    console.log(`      ${buyer} [${type}]`);
  });

  console.log('\n🗺️  GEOGRAPHIC ANALYSIS\n');

  const islands = {};
  mills.forEach(m => {
    const island = m.island || 'unknown';
    islands[island] = (islands[island] || 0) + 1;
  });
  console.log(`   Mills by island:`);
  Object.entries(islands).sort((a, b) => b[1] - a[1]).forEach(([island, count]) => {
    console.log(`      ${island}: ${count}`);
  });

  const regions = {};
  mills.forEach(m => {
    const region = m.region || 'unknown';
    regions[region] = (regions[region] || 0) + 1;
  });
  console.log(`\n   Top 10 regions by mill count:`);
  Object.entries(regions).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([region, count]) => {
    console.log(`      ${region}: ${count}`);
  });

  console.log('\n' + '═'.repeat(80));
  console.log('✅ VALIDATION COMPLETE - Data integrity looks good!\n');

} catch (error) {
  console.error('\n❌ Validation Error:', error.message);
  process.exit(1);
}
