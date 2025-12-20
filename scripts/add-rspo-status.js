import XLSX from 'xlsx';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🌴 Adding RSPO Status Column to Mills\n');
console.log('═'.repeat(80));

try {
  // Read the Excel file
  const millsPath = join(__dirname, '..', 'data-source', 'mills-template.xlsx');
  const workbook = XLSX.readFile(millsPath);
  const sheet = workbook.Sheets['Mills'];

  // Convert to JSON
  const mills = XLSX.utils.sheet_to_json(sheet);

  console.log(`📊 Found ${mills.length} mills\n`);

  // RSPO status options
  const rspoStatuses = ['IP', 'MB', 'IP, MB'];

  // Add rspo_status with random values
  const updatedMills = mills.map(mill => {
    // Randomly select RSPO status
    const randomRspoStatus = rspoStatuses[Math.floor(Math.random() * rspoStatuses.length)];

    return {
      mill_id: mill.mill_id,
      mill_name: mill.mill_name,
      capacity_ton_per_hour: mill.capacity_ton_per_hour,
      group: mill.group,
      company: mill.company,
      parent_group: mill.parent_group,
      group_engagement: mill.group_engagement,
      region: mill.region,
      province_en: mill.province_en,
      island: mill.island,
      latitude: mill.latitude,
      longitude: mill.longitude,
      evaluation_status: mill.evaluation_status,
      last_updated: mill.last_updated,
      risk_level: mill.risk_level,
      nbl_flag: mill.nbl_flag,
      nbl_reason: mill.nbl_reason,
      distance_to_nearest: mill.distance_to_nearest,
      nearest_facility: mill.nearest_facility,
      scenario_tags: mill.scenario_tags,
      recommendation: mill.recommendation,
      traceability_level: mill.traceability_level,
      ffb_source_own_pct: mill.ffb_source_own_pct,
      ffb_source_plasma_pct: mill.ffb_source_plasma_pct,
      ffb_source_independent_pct: mill.ffb_source_independent_pct,
      ffb_source_comment: mill.ffb_source_comment,
      recommendation_notes: mill.recommendation_notes,
      hotspot_alerts: mill.hotspot_alerts,
      peat_presence: mill.peat_presence,
      approval_by: mill.approval_by,
      approved_date: mill.approved_date,
      asana_task_id: mill.asana_task_id,
      eligibility_status: mill.eligibility_status,
      attachment_url: mill.attachment_url,
      irf_status: mill.irf_status,
      irf_status_last_updated: mill.irf_status_last_updated,
      ttp: mill.ttp,
      vdf: mill.vdf,
      rspo_status: randomRspoStatus // Add RSPO status column here
    };
  });

  // Create new worksheet with updated data
  const newSheet = XLSX.utils.json_to_sheet(updatedMills);

  // Replace the old sheet
  workbook.Sheets['Mills'] = newSheet;

  // Write back to Excel
  XLSX.writeFile(workbook, millsPath);

  console.log('✅ Successfully added rspo_status column!\n');
  console.log('📊 Sample data:');
  console.log('   Mill Name                          | RSPO Status');
  console.log('   ' + '─'.repeat(70));

  // Show first 10 mills as sample
  updatedMills.slice(0, 10).forEach(mill => {
    const name = (mill.mill_name || 'Unknown').padEnd(35);
    const rspo = (mill.rspo_status || 'N/A').padStart(10);
    console.log(`   ${name} | ${rspo}`);
  });

  // Distribution statistics
  const ipCount = updatedMills.filter(m => m.rspo_status === 'IP').length;
  const mbCount = updatedMills.filter(m => m.rspo_status === 'MB').length;
  const bothCount = updatedMills.filter(m => m.rspo_status === 'IP, MB').length;

  console.log('\n📈 RSPO Status Distribution:');
  console.log(`   IP only:     ${ipCount} mills (${Math.round(ipCount/mills.length*100)}%)`);
  console.log(`   MB only:     ${mbCount} mills (${Math.round(mbCount/mills.length*100)}%)`);
  console.log(`   IP, MB:      ${bothCount} mills (${Math.round(bothCount/mills.length*100)}%)`);

  console.log('\n' + '═'.repeat(80));
  console.log('✅ Done! Now run the conversion script to update JSON files:');
  console.log('   node scripts/excel-to-json.js');
  console.log('═'.repeat(80));

} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
