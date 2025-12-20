# Potential Supplier Priority Sorting Logic
**Date**: 2025-12-06
**Feature**: Smart prioritization for Potential Supplier scenario

---

## 🎯 Business Requirement

When viewing **Potential Supplier** scenario, mills should be sorted by strategic priority:

### **High Priority** (Top of table)
✅ Mills with **NO transactions** (completely new)
✅ Mills with **only small competitor transactions** (easier to acquire)

### **Low Priority** (Bottom of table)
⬇️ Mills owned by **major competitors**:
- **Wilmar International**
- **Musim Mas**
- **Asian Agri**

---

## 📊 Why This Matters

**Strategic Rationale**:
1. **New Mills** (no transactions) → Easier to onboard, no existing relationships
2. **Small Competitor Mills** → Less entrenched, more flexible
3. **Major Competitor Mills** → Harder to acquire, less priority (but kept visible for monitoring)

**Business Impact**:
- Focus sales/procurement team on **high-value targets**
- Don't waste effort on **difficult acquisitions**
- Keep major competitors **visible but deprioritized**

---

## 🔧 Technical Implementation

### **Step 1: Define Low Priority Competitors**
```javascript
const LOW_PRIORITY_COMPETITORS = [
  'Wilmar International',
  'Musim Mas',
  'Asian Agri'
];
```

### **Step 2: Filter for Potential Suppliers**
```javascript
// Potential Supplier = No GAR transactions
if (activeScenario === 'potential-supplier') {
  result = result.filter(mill => {
    const garTransactions = mill.transactions.filter(t => t.buyer_type === 'gar');
    return garTransactions.length === 0; // Only mills with no GAR history
  });
}
```

### **Step 3: Apply Priority Sorting**
```javascript
// Sort within Potential Supplier scenario
if (activeScenario === 'potential-supplier') {
  result.sort((a, b) => {
    const aIsLowPriority = LOW_PRIORITY_COMPETITORS.includes(a.parent_group);
    const bIsLowPriority = LOW_PRIORITY_COMPETITORS.includes(b.parent_group);

    // Low priority mills sink to bottom
    if (aIsLowPriority && !bIsLowPriority) return 1;  // a goes down
    if (!aIsLowPriority && bIsLowPriority) return -1; // b goes down

    // Same priority level → maintain existing order
    return 0;
  });
}
```

---

## 📋 Example Scenarios

### **Scenario 1: Mill with No Transactions**
```javascript
mill = {
  mill_name: "Independent Palm Mill",
  parent_group: "Local Palm Group",
  transactions: [] // No transactions
}
```
**Priority**: ⭐⭐⭐ **HIGH** → Appears at **TOP** of table

---

### **Scenario 2: Mill with Small Competitor Transaction**
```javascript
mill = {
  mill_name: "Regional Palm Mill",
  parent_group: "Regional Palm Co",
  transactions: [
    { buyer_entity: "Small Local Buyer", buyer_type: "competitor" }
  ]
}
```
**Priority**: ⭐⭐⭐ **HIGH** → Appears at **TOP** of table

---

### **Scenario 3: Mill Owned by Wilmar**
```javascript
mill = {
  mill_name: "Wilmar Palm Mill",
  parent_group: "Wilmar International",
  transactions: [
    { buyer_entity: "Wilmar International", buyer_type: "competitor" }
  ]
}
```
**Priority**: ⬇️ **LOW** → Appears at **BOTTOM** of table

---

### **Scenario 4: Mill with GAR Transaction**
```javascript
mill = {
  mill_name: "Existing GAR Mill",
  parent_group: "Any Group",
  transactions: [
    { buyer_entity: "GAR Trading", buyer_type: "gar" }
  ]
}
```
**Result**: ❌ **NOT SHOWN** in Potential Supplier scenario (filtered out)

---

## 🎨 UI Visualization

When user clicks **"Potential Supplier"** KPI card:

```
┌─────────────────────────────────────────────────┐
│  POTENTIAL SUPPLIER MILLS                       │
├─────────────────────────────────────────────────┤
│  ⭐ HIGH PRIORITY (Top Section)                  │
│  ├─ Independent Palm Mill (No transactions)     │
│  ├─ Regional Palm Mill (Small competitor)       │
│  ├─ Local Palm Mill (No transactions)           │
│  └─ ...                                         │
│                                                 │
│  ⬇️ LOW PRIORITY (Bottom Section)                │
│  ├─ Wilmar Palm Mill A (Wilmar International)  │
│  ├─ Musim Mas Palm Mill (Musim Mas)            │
│  └─ Asian Agri Mill (Asian Agri)               │
└─────────────────────────────────────────────────┘
```

---

## 🧪 Testing Checklist

### Filter Tests
- [ ] Potential Supplier shows only mills with **no GAR transactions**
- [ ] Mills with GAR transactions are **excluded**
- [ ] Mills with only competitor transactions are **included**
- [ ] Mills with no transactions are **included**

### Priority Sorting Tests
- [ ] Wilmar International mills appear at **bottom**
- [ ] Musim Mas mills appear at **bottom**
- [ ] Asian Agri mills appear at **bottom**
- [ ] Other mills appear at **top**
- [ ] Within same priority, order is **stable**

### Edge Cases
- [ ] Mill owned by Wilmar but no transactions → Low priority
- [ ] Mill owned by small group with Wilmar transaction → Filtered out (has competitor transaction)
- [ ] Mill owned by Wilmar with GAR transaction → Filtered out (has GAR transaction)

---

## 📊 Data Validation

### Check Parent Groups in Database
```javascript
// Verify exact naming in data
const checkParentGroups = (mills) => {
  const uniqueGroups = [...new Set(mills.map(m => m.parent_group))];
  console.log('Parent Groups:', uniqueGroups);

  // Check for variations
  const wilmarVariations = uniqueGroups.filter(g => g.includes('Wilmar'));
  const musimVariations = uniqueGroups.filter(g => g.includes('Musim'));
  const asianVariations = uniqueGroups.filter(g => g.includes('Asian'));

  return { wilmarVariations, musimVariations, asianVariations };
};
```

### Handle Name Variations
If parent groups have variations, update the array:
```javascript
const LOW_PRIORITY_COMPETITORS = [
  'Wilmar International',
  'Wilmar Group',           // Add if found
  'PT Wilmar',              // Add if found
  'Musim Mas',
  'Musim Mas Group',        // Add if found
  'Asian Agri',
  'Asian Agri Group',       // Add if found
  'PT Asian Agri'           // Add if found
];
```

---

## 🔄 Integration with Other Features

### Works with Distance Filter
```javascript
// Priority sorting applies AFTER distance filter
1. Filter by scenario (Potential Supplier)
2. Filter by distance range (if selected)
3. Apply priority sorting (major competitors to bottom)
4. Display results
```

### Works with Region Filter
```javascript
// Priority sorting applies AFTER region filter
1. Filter by scenario (Potential Supplier)
2. Filter by region (if selected)
3. Apply priority sorting
4. Display results
```

### Works with Search
```javascript
// Priority sorting applies AFTER search
1. Filter by scenario (Potential Supplier)
2. Apply search query
3. Apply priority sorting
4. Display results
```

---

## ⚙️ Configuration Options (Future)

Consider making priority list **configurable**:

```javascript
// Future: Admin panel to manage priority list
const PRIORITY_CONFIG = {
  lowPriorityGroups: [
    { name: 'Wilmar International', reason: 'Major competitor - difficult acquisition' },
    { name: 'Musim Mas', reason: 'Major competitor - entrenched relationships' },
    { name: 'Asian Agri', reason: 'Major competitor - strong market position' }
  ]
};
```

---

## 📝 Business Rules Summary

| Mill Type | GAR Transaction? | Parent Group | Priority | Displayed? |
|-----------|------------------|--------------|----------|------------|
| New Mill | ❌ No | Any (not major competitor) | ⭐⭐⭐ HIGH | ✅ Yes (Top) |
| New Mill | ❌ No | Wilmar/Musim/Asian | ⬇️ LOW | ✅ Yes (Bottom) |
| Competitor Mill | ❌ No | Small competitor | ⭐⭐⭐ HIGH | ✅ Yes (Top) |
| Competitor Mill | ❌ No | Wilmar/Musim/Asian | ⬇️ LOW | ✅ Yes (Bottom) |
| GAR Mill | ✅ Yes | Any | N/A | ❌ No (Filtered) |

---

**Document Version**: 1.0
**Last Updated**: 2025-12-06
**Status**: Ready for implementation
