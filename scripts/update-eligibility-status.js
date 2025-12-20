import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🔄 Updating Eligibility Status Based on GAR Transactions\n');
console.log('════════════════════════════════════════════════════════════════════════════════');

// Load data
const millsPath = join(__dirname, '../public/data/mills.json');
const transactionsPath = join(__dirname, '../public/data/transactions.json');

const mills = JSON.parse(readFileSync(millsPath, 'utf8'));
const transactions = JSON.parse(readFileSync(transactionsPath, 'utf8'));

console.log(`📊 Loaded ${mills.length} mills and ${transactions.length} transactions\n`);

// Show current distribution
const currentDist = {};
mills.forEach(m => {
  const status = m.eligibility_status || 'undefined';
  currentDist[status] = (currentDist[status] || 0) + 1;
});

console.log('📋 Current eligibility_status distribution:');
Object.entries(currentDist).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
  console.log(`   ${status}: ${count}`);
});

// Create set of mill_ids that have GAR transactions
const garMillIds = new Set();
transactions.forEach(t => {
  if (t.buyer_type && t.buyer_type.toLowerCase() === 'gar') {
    garMillIds.add(t.mill_id);
  }
});

console.log(`\n✅ Found ${garMillIds.size} mills with GAR transactions\n`);

// Update eligibility_status
let updatedCount = 0;
let madeEligibleCount = 0;
let madeNotEligibleCount = 0;

mills.forEach(mill => {
  const hasGarTransaction = garMillIds.has(mill.mill_id);
  const nblFlagFalse = mill.nbl_flag === false;

  // Determine new eligibility status
  let newStatus;
  if (hasGarTransaction && nblFlagFalse) {
    newStatus = 'Eligible';
    if (mill.eligibility_status !== 'Eligible') {
      madeEligibleCount++;
      console.log(`   ✓ ${mill.mill_id} (${mill.mill_name}): ${mill.eligibility_status || 'undefined'} → Eligible`);
    }
  } else if (hasGarTransaction && !nblFlagFalse) {
    // Has GAR transaction but NBL flag is true
    newStatus = 'Not Eligible';
    if (mill.eligibility_status !== 'Not Eligible') {
      madeNotEligibleCount++;
      console.log(`   ✗ ${mill.mill_id} (${mill.mill_name}): ${mill.eligibility_status || 'undefined'} → Not Eligible (NBL)`);
    }
  } else if (!hasGarTransaction && nblFlagFalse) {
    // No GAR transaction but NBL flag is false
    newStatus = 'Not Eligible';
    if (mill.eligibility_status !== 'Not Eligible') {
      madeNotEligibleCount++;
    }
  } else {
    // No GAR transaction and NBL flag is true
    newStatus = 'Not Eligible';
    if (mill.eligibility_status !== 'Not Eligible') {
      madeNotEligibleCount++;
    }
  }

  if (mill.eligibility_status !== newStatus) {
    mill.eligibility_status = newStatus;
    updatedCount++;
  }
});

// Show new distribution
const newDist = {};
mills.forEach(m => {
  const status = m.eligibility_status || 'undefined';
  newDist[status] = (newDist[status] || 0) + 1;
});

console.log('\n📊 New eligibility_status distribution:');
Object.entries(newDist).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
  console.log(`   ${status}: ${count}`);
});

// Write updated data
writeFileSync(millsPath, JSON.stringify(mills, null, 2));

console.log('\n════════════════════════════════════════════════════════════════════════════════');
console.log('✅ Eligibility Status Update Complete!\n');
console.log(`📊 Summary:`);
console.log(`   Total mills: ${mills.length}`);
console.log(`   Mills with GAR transactions: ${garMillIds.size}`);
console.log(`   Updated: ${updatedCount} mills`);
console.log(`   Made Eligible: ${madeEligibleCount} mills (has GAR transaction + nbl_flag = false)`);
console.log(`   Made Not Eligible: ${madeNotEligibleCount} mills`);
console.log(`\n📁 Updated: ${millsPath}`);
console.log('════════════════════════════════════════════════════════════════════════════════\n');
