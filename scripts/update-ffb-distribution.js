import XLSX from 'xlsx';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🌾 Updating FFB Source Distribution for Evaluated Mills\n');
console.log('═'.repeat(80));

try {
  // Read the Excel file
  const millsPath = join(__dirname, '..', 'data-source', 'mills-template.xlsx');
  const workbook = XLSX.readFile(millsPath);
  const sheet = workbook.Sheets['Mills'];

  // Convert to JSON
  const mills = XLSX.utils.sheet_to_json(sheet);

  console.log(`📊 Found ${mills.length} mills\n`);

  // Count evaluated mills
  const evaluatedMills = mills.filter(m => m.evaluation_status === 'Evaluated');
  console.log(`📋 Evaluated mills: ${evaluatedMills.length}\n`);

  // Update FFB distribution for all mills
  const updatedMills = mills.map(mill => {
    // Generate FFB distribution for evaluated mills
    let ownPct = null;
    let plasmaPct = null;
    let independentPct = null;

    if (mill.evaluation_status === 'Evaluated') {
      // Different distribution patterns based on mill characteristics
      // Pattern 1: Predominantly own estate (60-80% own)
      // Pattern 2: Balanced mix (40-50% own, 30-40% plasma, 10-20% independent)
      // Pattern 3: High plasma (30-50% own, 40-60% plasma, 5-15% independent)

      const pattern = Math.random();

      if (pattern < 0.4) {
        // Pattern 1: Predominantly own estate (40% of mills)
        ownPct = Math.floor(Math.random() * 21) + 60;  // 60-80%
        plasmaPct = Math.floor(Math.random() * (100 - ownPct - 5));  // Leave at least 5% for independent
        independentPct = 100 - ownPct - plasmaPct;
      } else if (pattern < 0.7) {
        // Pattern 2: Balanced mix (30% of mills)
        ownPct = Math.floor(Math.random() * 11) + 40;  // 40-50%
        plasmaPct = Math.floor(Math.random() * 11) + 30;  // 30-40%
        independentPct = 100 - ownPct - plasmaPct;
      } else {
        // Pattern 3: High plasma (30% of mills)
        ownPct = Math.floor(Math.random() * 21) + 30;  // 30-50%
        plasmaPct = Math.floor(Math.random() * 21) + 40;  // 40-60%
        independentPct = 100 - ownPct - plasmaPct;
      }

      // Ensure percentages are valid and total 100%
      if (independentPct < 0) {
        independentPct = 5;
        plasmaPct = 100 - ownPct - independentPct;
      }
    }

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
      ffb_source_own_pct: ownPct,
      ffb_source_plasma_pct: plasmaPct,
      ffb_source_independent_pct: independentPct,
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
      vdf: mill.vdf
    };
  });

  // Create new worksheet with updated data
  const newSheet = XLSX.utils.json_to_sheet(updatedMills);

  // Replace the old sheet
  workbook.Sheets['Mills'] = newSheet;

  // Write back to Excel
  XLSX.writeFile(workbook, millsPath);

  console.log('✅ Successfully updated FFB source distribution!\n');
  console.log('📊 Sample data for evaluated mills:\n');
  console.log('   Mill Name                          | Own% | Plasma% | Indep% | Total');
  console.log('   ' + '─'.repeat(85));

  // Show first 10 evaluated mills as sample
  const evaluatedSamples = updatedMills.filter(m => m.evaluation_status === 'Evaluated').slice(0, 10);
  evaluatedSamples.forEach(mill => {
    const name = (mill.mill_name || 'Unknown').padEnd(35);
    const own = String(mill.ffb_source_own_pct || 0).padStart(4);
    const plasma = String(mill.ffb_source_plasma_pct || 0).padStart(7);
    const indep = String(mill.ffb_source_independent_pct || 0).padStart(6);
    const total = mill.ffb_source_own_pct + mill.ffb_source_plasma_pct + mill.ffb_source_independent_pct;
    const totalStr = String(total).padStart(5);
    console.log(`   ${name} | ${own} | ${plasma} | ${indep} | ${totalStr}`);
  });

  // Distribution statistics
  const ownHeavy = updatedMills.filter(m => m.evaluation_status === 'Evaluated' && m.ffb_source_own_pct >= 60).length;
  const balanced = updatedMills.filter(m => m.evaluation_status === 'Evaluated' && m.ffb_source_own_pct >= 40 && m.ffb_source_own_pct < 60 && m.ffb_source_plasma_pct >= 30).length;
  const plasmaHeavy = updatedMills.filter(m => m.evaluation_status === 'Evaluated' && m.ffb_source_plasma_pct >= 40).length;

  console.log('\n📈 Distribution Patterns:');
  console.log(`   Predominantly Own Estate (60-80% own):  ${ownHeavy} mills`);
  console.log(`   Balanced Mix (40-50% own, 30-40% plasma): ${balanced} mills`);
  console.log(`   High Plasma (40-60% plasma):             ${plasmaHeavy} mills`);

  console.log('\n' + '═'.repeat(80));
  console.log('✅ Done! Now run the conversion script to update JSON files:');
  console.log('   node scripts/excel-to-json.js');
  console.log('═'.repeat(80));

} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
