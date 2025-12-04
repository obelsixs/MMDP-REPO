const XLSX = require('xlsx');
const path = require('path');

// Create Excel templates for data input
console.log('🔨 Creating Excel templates...\n');

// ============================================
// MILLS TEMPLATE
// ============================================
const millsData = [
  // Header row with all 42 fields
  [
    'mill_id', 'mill_name', 'parent_group', 'group_engagement', 'region', 'province_en', 'island',
    'latitude', 'longitude', 'evaluation_status', 'current_evaluation_id', 'last_updated',
    'risk_level', 'sourcing_status', 'sourcing_status_last_updated', 'nbl_flag', 'nbl_reason',
    'nbl_date_added', 'distance_to_nearest', 'nearest_facility', 'scenario_tags',
    'capacity_ton_per_hour', 'recommendation', 'traceability_level', 'ffb_source_own_pct',
    'ffb_source_plasma_pct', 'ffb_source_independent_pct', 'ffb_source_comment',
    'recommendation_notes', 'ndpe_violation_found', 'public_grievance_flag',
    'deforestation_alerts', 'hotspot_alerts', 'peat_presence', 'approval_by', 'approved_date',
    'asana_task_id', 'eligibility_status', 'current_asana_task_url', 'current_eval_doc_url',
    'attachment_url', 'competitor_flag', 'competitor_buyer', 'asana_assigned_to',
    'asana_status', 'asana_current_stage', 'asana_current_stage_name', 'asana_request_date',
    'asana_expected_completion', 'asana_progress_pct'
  ],
  // Sample row 1
  [
    'PO1000001', 'Forest Green Palm Mill', 'Sustainable Palm Industries', 'Active', 'Jambi', 'Jambi', 'Sumatra',
    -1.6101, 103.6131, 'Eligible', 'EVAL-2024-001', '2024-12-15',
    'Low', 'Delivering', '2024-12-10', false, '',
    '', 45.2, 'Dumai Refinery', 'High Capacity,Low Risk',
    60, 'Yes', 'Level 3', 70,
    20, 10, 'Majority from own plantations',
    'Strong track record, meets all NDPE requirements', false, false,
    0, 0, 'None', 'John Doe', '2024-11-01',
    'ASANA-123', 'Eligible', 'https://asana.com/task/123', 'https://docs.example.com/eval-001',
    'https://docs.example.com/attachment-001', false, '', 'Jane Smith',
    'Completed', 5, 'Final Approval', '2024-10-01',
    '2024-12-20', 95
  ],
  // Sample row 2
  [
    'PO1000002', 'Coastal Processing Mill', 'Eastern Palm Group', 'Limited', 'Riau', 'Riau', 'Sumatra',
    0.9071, 101.4478, 'Under Evaluation', 'EVAL-2024-045', '2024-12-20',
    'Medium', 'Progressing', '2024-12-18', false, '',
    '', 38.5, 'Pekanbaru Terminal', 'Medium Capacity',
    45, 'No', 'Level 2', 50,
    30, 20, 'Mixed sources with plasma scheme',
    'Requires additional monitoring', false, true,
    2, 5, 'Low', 'Assessment Team', '',
    'ASANA-456', '', 'https://asana.com/task/456', '',
    '', true, 'CompetitorCorp', 'Mike Johnson',
    'In Progress', 3, 'Risk Assessment', '2024-11-15',
    '2025-01-30', 60
  ],
  // Sample row 3 (NBL example)
  [
    'PO1000003', 'Highland Mills Ltd', 'Highland Resources', 'None', 'West Kalimantan', 'West Kalimantan', 'Kalimantan',
    -0.0263, 109.3425, 'Not Eligible (NBL)', '', '2024-10-05',
    'High', 'Known', '2024-10-01', true, 'Deforestation violation in protected area',
    '2024-09-15', 120.3, 'Pontianak Port', 'NBL,High Risk',
    30, 'No', 'Level 1', 40,
    10, 50, 'High percentage from independent smallholders',
    'Added to NBL due to environmental violations', true, true,
    15, 25, 'High', '', '',
    '', 'Not Eligible', '', '',
    '', false, '', '',
    'Blocked', 0, 'NBL Review', '2024-09-01',
    '', 0
  ]
];

const millsSheet = XLSX.utils.aoa_to_sheet(millsData);

// Set column widths for better readability
millsSheet['!cols'] = [
  { wch: 12 },  // mill_id
  { wch: 30 },  // mill_name
  { wch: 25 },  // parent_group
  { wch: 15 },  // group_engagement
  { wch: 15 },  // region
  { wch: 15 },  // province_en
  { wch: 12 },  // island
  { wch: 12 },  // latitude
  { wch: 12 },  // longitude
  { wch: 20 },  // evaluation_status
  { wch: 18 },  // current_evaluation_id
  { wch: 15 },  // last_updated
  { wch: 12 },  // risk_level
  { wch: 30 },  // sourcing_status
  { wch: 20 },  // sourcing_status_last_updated
  { wch: 10 },  // nbl_flag
  { wch: 40 },  // nbl_reason
  { wch: 15 },  // nbl_date_added
  { wch: 18 },  // distance_to_nearest
  { wch: 25 },  // nearest_facility
  { wch: 25 },  // scenario_tags
  { wch: 20 },  // capacity_ton_per_hour
  { wch: 15 },  // recommendation
  { wch: 20 },  // traceability_level
  { wch: 20 },  // ffb_source_own_pct
  { wch: 20 },  // ffb_source_plasma_pct
  { wch: 25 },  // ffb_source_independent_pct
  { wch: 40 },  // ffb_source_comment
  { wch: 40 },  // recommendation_notes
  { wch: 20 },  // ndpe_violation_found
  { wch: 20 },  // public_grievance_flag
  { wch: 20 },  // deforestation_alerts
  { wch: 15 },  // hotspot_alerts
  { wch: 15 },  // peat_presence
  { wch: 20 },  // approval_by
  { wch: 15 },  // approved_date
  { wch: 15 },  // asana_task_id
  { wch: 18 },  // eligibility_status
  { wch: 35 },  // current_asana_task_url
  { wch: 35 },  // current_eval_doc_url
  { wch: 35 },  // attachment_url
  { wch: 15 },  // competitor_flag
  { wch: 25 },  // competitor_buyer
  { wch: 20 },  // asana_assigned_to
  { wch: 15 },  // asana_status
  { wch: 20 },  // asana_current_stage
  { wch: 25 },  // asana_current_stage_name
  { wch: 20 },  // asana_request_date
  { wch: 25 },  // asana_expected_completion
  { wch: 20 }   // asana_progress_pct
];

// ============================================
// FACILITIES TEMPLATE
// ============================================
const facilitiesData = [
  ['facility_id', 'facility_name', 'type', 'region', 'code'],
  ['FAC001', 'Dumai Refinery', 'Refinery', 'Riau', 'DMI'],
  ['FAC002', 'Pekanbaru Terminal', 'Terminal', 'Riau', 'PKU'],
  ['FAC003', 'Pontianak Port', 'Port', 'West Kalimantan', 'PTK'],
  ['FAC004', 'Palembang Processing', 'Processing Facility', 'South Sumatra', 'PLM'],
  ['FAC005', 'Jakarta Distribution Hub', 'Distribution', 'Jakarta', 'JKT']
];

const facilitiesSheet = XLSX.utils.aoa_to_sheet(facilitiesData);
facilitiesSheet['!cols'] = [
  { wch: 15 },  // facility_id
  { wch: 30 },  // facility_name
  { wch: 20 },  // type
  { wch: 20 },  // region
  { wch: 10 }   // code
];

// ============================================
// MILL-FACILITY DISTANCES TEMPLATE
// ============================================
const distancesData = [
  ['mill_id', 'facility_name', 'distance_km', 'ranking'],
  ['PO1000001', 'Dumai Refinery', 45.2, 1],
  ['PO1000001', 'Pekanbaru Terminal', 78.5, 2],
  ['PO1000001', 'Palembang Processing', 120.3, 3],
  ['PO1000002', 'Pekanbaru Terminal', 38.5, 1],
  ['PO1000002', 'Dumai Refinery', 52.1, 2],
  ['PO1000003', 'Pontianak Port', 120.3, 1],
  ['PO1000003', 'Palembang Processing', 185.7, 2]
];

const distancesSheet = XLSX.utils.aoa_to_sheet(distancesData);
distancesSheet['!cols'] = [
  { wch: 12 },  // mill_id
  { wch: 30 },  // facility_name
  { wch: 15 },  // distance_km
  { wch: 10 }   // ranking
];

// ============================================
// TRANSACTIONS TEMPLATE
// ============================================
const transactionsData = [
  ['mill_id', 'buyer_entity', 'buyer_type', 'product_type', 'last_verified'],
  ['PO1000001', 'GAR Trading Pte Ltd', 'gar', 'CPO', '2024-12-01'],
  ['PO1000001', 'GAR Indonesia', 'gar', 'PK', '2024-11-28'],
  ['PO1000002', 'GAR Trading Pte Ltd', 'gar', 'CPO', '2024-12-15'],
  ['PO1000002', 'CompetitorCorp', 'competitor', 'CPO', '2024-11-20'],
  ['PO1000003', 'Independent Buyer', 'competitor', 'CPO', '2024-10-01']
];

const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData);
transactionsSheet['!cols'] = [
  { wch: 12 },  // mill_id
  { wch: 30 },  // buyer_entity
  { wch: 15 },  // buyer_type
  { wch: 15 },  // product_type
  { wch: 15 }   // last_verified
];

// ============================================
// CREATE WORKBOOKS AND SAVE
// ============================================

const dataSourceDir = path.join(__dirname, '..', 'data-source');

// Mills template
const millsWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(millsWorkbook, millsSheet, 'Mills');
XLSX.writeFile(millsWorkbook, path.join(dataSourceDir, 'mills-template.xlsx'));
console.log('✅ Created: data-source/mills-template.xlsx (42 columns, 3 sample rows)');

// Facilities template
const facilitiesWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(facilitiesWorkbook, facilitiesSheet, 'Facilities');
XLSX.writeFile(facilitiesWorkbook, path.join(dataSourceDir, 'facilities-template.xlsx'));
console.log('✅ Created: data-source/facilities-template.xlsx (5 columns, 5 sample rows)');

// Distances template
const distancesWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(distancesWorkbook, distancesSheet, 'MillFacilityDistances');
XLSX.writeFile(distancesWorkbook, path.join(dataSourceDir, 'mill-facility-distances-template.xlsx'));
console.log('✅ Created: data-source/mill-facility-distances-template.xlsx (4 columns, 7 sample rows)');

// Transactions template
const transactionsWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(transactionsWorkbook, transactionsSheet, 'Transactions');
XLSX.writeFile(transactionsWorkbook, path.join(dataSourceDir, 'transactions-template.xlsx'));
console.log('✅ Created: data-source/transactions-template.xlsx (6 columns, 5 sample rows)');

console.log('\n🎉 All Excel templates created successfully!');
console.log('\n📋 Next Steps:');
console.log('1. Open the Excel files in data-source/ folder');
console.log('2. Review the structure and sample data');
console.log('3. Add your 1400 mills and related data');
console.log('4. Save the files (keep the same names)');
console.log('5. Run: npm run dev (to test) or npm run build (for production)');
