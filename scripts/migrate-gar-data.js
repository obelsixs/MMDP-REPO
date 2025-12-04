import XLSX from 'xlsx';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 GAR Data Migration Script\n');
console.log('═'.repeat(80));

// GAR buyer entities for classification
const GAR_BUYERS = ['GAR', 'Golden Agri', 'APC', 'APJ', 'PHG', 'PTK', 'PSR', 'PAS'];

// Helper function to generate facility code
function generateFacilityCode(name, existingCodes) {
  let code = name.substring(0, 3).toUpperCase();
  let counter = 1;
  let finalCode = code;

  while (existingCodes.has(finalCode)) {
    finalCode = code + counter;
    counter++;
  }

  existingCodes.add(finalCode);
  return finalCode;
}

// Helper function to determine buyer type
function determineBuyerType(buyerEntity) {
  const upper = buyerEntity.toUpperCase();
  return GAR_BUYERS.some(buyer => upper.includes(buyer.toUpperCase())) ? 'gar' : 'competitor';
}

// Helper function to safely convert to number
function toNumber(value) {
  if (value === null || value === undefined) return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

try {
  // ═══════════════════════════════════════════════════════════════
  // STEP 1: Read source data
  // ═══════════════════════════════════════════════════════════════
  console.log('\n📂 STEP 1: Reading source data from GAR_Table_structure.xlsx\n');

  const sourcePath = join(__dirname, '..', 'GAR_Table_structure.xlsx');
  const sourceWorkbook = XLSX.readFile(sourcePath);

  const millMaster = XLSX.utils.sheet_to_json(sourceWorkbook.Sheets['mill_master'], { defval: null });
  const garFacility = XLSX.utils.sheet_to_json(sourceWorkbook.Sheets['gar_facility'], { defval: null });
  const nblData = XLSX.utils.sheet_to_json(sourceWorkbook.Sheets['NBL'], { defval: null });
  const distanceMatrix = XLSX.utils.sheet_to_json(sourceWorkbook.Sheets['distance_matrix'], { defval: null });
  const millTransaction = XLSX.utils.sheet_to_json(sourceWorkbook.Sheets['mill_transaction'], { defval: null });
  const evaluationResult = XLSX.utils.sheet_to_json(sourceWorkbook.Sheets['evaluation_result'], { defval: null });

  console.log(`   ✅ Mill Master: ${millMaster.length} rows`);
  console.log(`   ✅ GAR Facility: ${garFacility.length} rows`);
  console.log(`   ✅ NBL: ${nblData.length} rows`);
  console.log(`   ✅ Distance Matrix: ${distanceMatrix.length} rows`);
  console.log(`   ✅ Mill Transaction: ${millTransaction.length} rows`);
  console.log(`   ✅ Evaluation Result: ${evaluationResult.length} rows`);

  // ═══════════════════════════════════════════════════════════════
  // STEP 2: Create lookup maps
  // ═══════════════════════════════════════════════════════════════
  console.log('\n🗺️  STEP 2: Creating lookup maps\n');

  // NBL lookup
  const nblMap = new Map();
  nblData.forEach(row => {
    if (row.NBL === 'Yes') {
      nblMap.set(row.mill_id, row.Remark || '');
    }
  });
  console.log(`   ✅ NBL Map: ${nblMap.size} mills flagged`);

  // Distance lookup (nearest facility for each mill)
  const nearestFacilityMap = new Map();
  distanceMatrix.forEach(row => {
    if (row.ranking === 1) {
      nearestFacilityMap.set(row.mill_id, {
        facility: row.facility_name,
        distance: toNumber(row.distance_km)
      });
    }
  });
  console.log(`   ✅ Nearest Facility Map: ${nearestFacilityMap.size} mills mapped`);

  // Evaluation lookup
  const evaluationMap = new Map();
  evaluationResult.forEach(row => {
    evaluationMap.set(row.mill_id, row);
  });
  console.log(`   ✅ Evaluation Map: ${evaluationMap.size} evaluations`);

  // ═══════════════════════════════════════════════════════════════
  // STEP 3: Process Mills Data
  // ═══════════════════════════════════════════════════════════════
  console.log('\n🏭 STEP 3: Processing Mills Data\n');

  const currentDate = new Date().toISOString().split('T')[0];
  const processedMills = millMaster.map(mill => {
    const nearest = nearestFacilityMap.get(mill.mill_id);
    const isNBL = nblMap.has(mill.mill_id);
    const evaluation = evaluationMap.get(mill.mill_id);

    return {
      // Core Identity
      mill_id: mill.mill_id,
      mill_name: mill.mill_name,
      group: mill.parent_group, // Recommendation: parent_group → group
      company: mill.entity, // Recommendation: entity → company
      parent_group: mill.parent_group,
      group_engagement: mill.group_engagement,

      // Location
      region: mill.province_en, // Recommendation: province_en → region
      province_en: mill.province_en,
      island: mill.island,
      latitude: mill.latitude,
      longitude: mill.longitude,

      // Evaluation Status
      evaluation_status: mill.evaluation_status || 'Not Evaluated',
      current_evaluation_id: mill[' current_evaluation_id'] || null, // Note: space in column name
      last_updated: currentDate,

      // Risk Assessment
      risk_level: evaluation?.risk_level || null,
      sourcing_status: 'Unknown', // Default as recommended
      sourcing_status_last_updated: null,

      // NBL
      nbl_flag: isNBL,
      nbl_reason: isNBL ? nblMap.get(mill.mill_id) : null,
      nbl_date_added: null,

      // Geographic
      distance_to_nearest: nearest?.distance || null,
      nearest_facility: nearest?.facility || null,
      scenario_tags: '[]', // Empty array as string for Excel

      // Capacity & Operations
      capacity_ton_per_hour: null,
      recommendation: evaluation?.recommendation || null,
      traceability_level: evaluation?.traceability_level || null,

      // FFB Source
      ffb_source_own_pct: evaluation?.ffb_source_own_pct || null,
      ffb_source_plasma_pct: evaluation?.ffb_source_plasma_pct || null,
      ffb_source_independent_pct: evaluation?.ffb_source_independent_pct || null,
      ffb_source_comment: evaluation?.ffb_source_comment || null,
      recommendation_notes: evaluation?.recommendation_notes || null,

      // Environmental & Social
      ndpe_violation_found: evaluation?.ndpe_violation_found || null,
      public_grievance_flag: evaluation?.public_grievance_flag || null,
      deforestation_alerts: evaluation?.deforestation_alerts || null,
      hotspot_alerts: evaluation?.hotspot_alerts || null,
      peat_presence: evaluation?.peat_presence || null,

      // Approval
      approval_by: evaluation?.approval_by || null,
      approved_date: evaluation?.approved_date || null,

      // Asana Integration
      asana_task_id: evaluation?.asana_task_id || null,
      eligibility_status: evaluation?.eligibility_status || null,
      current_asana_task_url: mill[' current_asana_task_url'] || null, // Note: space in column name
      current_eval_doc_url: mill[' current_evaluation_doc_url'] || null, // Note: space in column name
      attachment_url: evaluation?.attachment_url || null,

      // Competition
      competitor_flag: null,
      competitor_buyer: null,

      // Workflow Status
      asana_assigned_to: null,
      asana_status: null,
      asana_current_stage: null,
      asana_current_stage_name: null,
      asana_request_date: null,
      asana_expected_completion: null,
      asana_progress_pct: null
    };
  });

  console.log(`   ✅ Processed ${processedMills.length} mills`);
  console.log(`   📊 NBL flagged: ${processedMills.filter(m => m.nbl_flag).length}`);
  console.log(`   📊 With nearest facility: ${processedMills.filter(m => m.nearest_facility).length}`);

  // ═══════════════════════════════════════════════════════════════
  // STEP 4: Process Facilities Data
  // ═══════════════════════════════════════════════════════════════
  console.log('\n🏢 STEP 4: Processing Facilities Data\n');

  const facilityCodesUsed = new Set();
  const processedFacilities = garFacility.map((facility, index) => ({
    facility_id: `FAC${String(index + 1).padStart(3, '0')}`,
    facility_name: facility.facility_name,
    type: facility.facility_type,
    region: facility.owner, // Using owner as region per recommendation
    code: generateFacilityCode(facility.facility_name, facilityCodesUsed)
  }));

  console.log(`   ✅ Processed ${processedFacilities.length} facilities`);

  // ═══════════════════════════════════════════════════════════════
  // STEP 5: Process Distance Matrix
  // ═══════════════════════════════════════════════════════════════
  console.log('\n📏 STEP 5: Processing Distance Matrix\n');

  const processedDistances = distanceMatrix.map(row => ({
    mill_id: row.mill_id,
    facility_name: row.facility_name,
    distance_km: toNumber(row.distance_km), // Convert string to number
    ranking: row.ranking
  }));

  console.log(`   ✅ Processed ${processedDistances.length} distance records`);

  // ═══════════════════════════════════════════════════════════════
  // STEP 6: Process Transactions
  // ═══════════════════════════════════════════════════════════════
  console.log('\n💰 STEP 6: Processing Transactions\n');

  const processedTransactions = millTransaction.map(row => ({
    mill_id: row.mill_id,
    buyer_entity: row.buyer_entity,
    buyer_type: determineBuyerType(row.buyer_entity), // Auto-detect GAR vs competitor
    product_type: row.product_type,
    last_verified: row.last_verified
  }));

  const garTransactions = processedTransactions.filter(t => t.buyer_type === 'gar').length;
  const competitorTransactions = processedTransactions.filter(t => t.buyer_type === 'competitor').length;

  console.log(`   ✅ Processed ${processedTransactions.length} transactions`);
  console.log(`   📊 GAR transactions: ${garTransactions}`);
  console.log(`   📊 Competitor transactions: ${competitorTransactions}`);

  // ═══════════════════════════════════════════════════════════════
  // STEP 6.5: Create GAR Mills Map for Sourcing Status
  // ═══════════════════════════════════════════════════════════════
  console.log('\n📊 STEP 6.5: Mapping GAR Mills for Sourcing Status\n');

  // Create a Set of mill_ids that have GAR transactions
  const garMillIds = new Set(
    processedTransactions
      .filter(t => t.buyer_type === 'gar')
      .map(t => t.mill_id)
  );

  console.log(`   ✅ Found ${garMillIds.size} mills with GAR transactions`);

  // Update sourcing_status and evaluation_status for mills with GAR transactions
  processedMills.forEach(mill => {
    if (garMillIds.has(mill.mill_id)) {
      mill.sourcing_status = 'Delivering';
      mill.sourcing_status_last_updated = currentDate;
      mill.evaluation_status = 'Eligible';
    }
  });

  const deliveringCount = processedMills.filter(m => m.sourcing_status === 'Delivering').length;
  const eligibleCount = processedMills.filter(m => m.evaluation_status === 'Eligible').length;
  console.log(`   ✅ Updated ${deliveringCount} mills to "Delivering" status`);
  console.log(`   ✅ Updated ${eligibleCount} mills to "Eligible" status`);

  // ═══════════════════════════════════════════════════════════════
  // STEP 7: Write to Template Files
  // ═══════════════════════════════════════════════════════════════
  console.log('\n💾 STEP 7: Writing data to template files\n');

  const dataSourcePath = join(__dirname, '..', 'data-source');

  // Write Mills
  const millsWorkbook = XLSX.utils.book_new();
  const millsWorksheet = XLSX.utils.json_to_sheet(processedMills);
  XLSX.utils.book_append_sheet(millsWorkbook, millsWorksheet, 'Mills');
  XLSX.writeFile(millsWorkbook, join(dataSourcePath, 'mills-template.xlsx'));
  console.log(`   ✅ Written: mills-template.xlsx (${processedMills.length} rows)`);

  // Write Facilities
  const facilitiesWorkbook = XLSX.utils.book_new();
  const facilitiesWorksheet = XLSX.utils.json_to_sheet(processedFacilities);
  XLSX.utils.book_append_sheet(facilitiesWorkbook, facilitiesWorksheet, 'Facilities');
  XLSX.writeFile(facilitiesWorkbook, join(dataSourcePath, 'facilities-template.xlsx'));
  console.log(`   ✅ Written: facilities-template.xlsx (${processedFacilities.length} rows)`);

  // Write Distances
  const distancesWorkbook = XLSX.utils.book_new();
  const distancesWorksheet = XLSX.utils.json_to_sheet(processedDistances);
  XLSX.utils.book_append_sheet(distancesWorkbook, distancesWorksheet, 'MillFacilityDistances');
  XLSX.writeFile(distancesWorkbook, join(dataSourcePath, 'mill-facility-distances-template.xlsx'));
  console.log(`   ✅ Written: mill-facility-distances-template.xlsx (${processedDistances.length} rows)`);

  // Write Transactions
  const transactionsWorkbook = XLSX.utils.book_new();
  const transactionsWorksheet = XLSX.utils.json_to_sheet(processedTransactions);
  XLSX.utils.book_append_sheet(transactionsWorkbook, transactionsWorksheet, 'Transactions');
  XLSX.writeFile(transactionsWorkbook, join(dataSourcePath, 'transactions-template.xlsx'));
  console.log(`   ✅ Written: transactions-template.xlsx (${processedTransactions.length} rows)`);

  // ═══════════════════════════════════════════════════════════════
  // STEP 8: Summary Report
  // ═══════════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(80));
  console.log('✅ MIGRATION COMPLETE!\n');
  console.log('📊 Summary:');
  console.log(`   🏭 Mills: ${processedMills.length}`);
  console.log(`   🏢 Facilities: ${processedFacilities.length}`);
  console.log(`   📏 Distance Records: ${processedDistances.length}`);
  console.log(`   💰 Transactions: ${processedTransactions.length}`);
  console.log('\n📍 Applied Recommendations:');
  console.log('   ✅ company ← entity');
  console.log('   ✅ group ← parent_group');
  console.log('   ✅ region ← province_en');
  console.log('   ✅ Auto-generated facility codes');
  console.log('   ✅ Auto-detected GAR vs competitor buyers');
  console.log('   ✅ Converted distance_km to numbers');
  console.log('   ✅ Mapped NBL flags to mills');
  console.log('   ✅ Calculated nearest facilities');
  console.log(`   ✅ Set sourcing_status = "Delivering" for ${deliveringCount} GAR mills`);
  console.log(`   ✅ Set evaluation_status = "Eligible" for ${eligibleCount} GAR mills`);
  console.log('\n📁 Output Location: data-source/');
  console.log('═'.repeat(80));
  console.log('\n🎯 Next Steps:');
  console.log('   1. Review migrated data in data-source/ directory');
  console.log('   2. Run: npm run dev (to test data loading)');
  console.log('   3. Verify app displays 1,449 mills correctly\n');

} catch (error) {
  console.error('\n❌ ERROR during migration:', error.message);
  console.error('\nStack trace:', error.stack);
  process.exit(1);
}
