# MMDP Enhancement Plan
**Date**: 2025-12-06
**Status**: 🟡 Ready for Implementation

---

## 📋 Enhancement Requirements Summary

Based on user feedback, the following enhancements are required for the GAR Mill Procurement Intelligence App:

### 1. **Facility-Driven Distance Display Issue**
**Problem**: Distance shows "Infinity" when facility filter is selected
**Root Cause**: Database/data source issue in facility distance calculations
**Required Fix**:
- Check and validate distance data in `DEMO_MILL_FACILITY_DISTANCES`
- Ensure proper distance calculation for all mills when facility filter is active
- Display actual distance values instead of Infinity

### 2. **Facility Filter UI Text Updates**
**Current Text**:
- "Select Facility to see 3 nearest mills"
- "Showing 3 nearest mills to [FACILITY] facility, sorted by distance"

**Required Changes**:
- Remove the "3" limit reference completely
- Change to: "Select Facility to see nearest mills"
- When facility selected: "Showing nearest mills to [FACILITY] facility, sorted by distance"
- Show ALL mills sorted by distance, not just top 3

### 3. **Capacity Data Population**
**Problem**: Capacity field shows "N/A" in table
**Root Cause**: Mills missing `capacity_ton_per_hour` values in data source
**Required Fix**:
- Update `mills-template.xlsx` to ensure all mills have capacity values
- Verify capacity data exists in demo data (DEMO_MILLS)
- Ensure capacity displays properly in table view

### 4. **Add Distance Filter Column**
**Requirement**: Add Distance as a filterable column in the main table
**Implementation**:
- Add Distance column with filter dropdown (like Region, Buyer, etc.)
- Distance filter options: < 50km, 50-100km, 100-200km, > 200km
- Integrate with existing filter system
- Show distance values in table

### 5. **Rename "New Supplier" → "Potential Supplier" with Priority Sorting**
**Current Behavior**: "New Supplier" scenario tag
**Required Changes**:
- Rename to "Potential Supplier" throughout application
- Filter logic: Show only mills with NO GAR transactions
- **Priority Sorting**: Deprioritize major competitor-owned mills
- **Low Priority Groups**: Wilmar International, Musim Mas, Asian Agri (placed at bottom)
- All mills stay in table, just sorted by priority

**Filter & Priority Logic**:
```javascript
const LOW_PRIORITY_COMPETITORS = ['Wilmar International', 'Musim Mas', 'Asian Agri'];

// Filter: No GAR transactions
const potentialSuppliers = mills.filter(mill => {
  const garTransactions = mill.transactions.filter(t => t.buyer_type === 'gar');
  return garTransactions.length === 0;
});

// Sort: Low priority (major competitors) to bottom
potentialSuppliers.sort((a, b) => {
  const aIsLowPriority = LOW_PRIORITY_COMPETITORS.includes(a.parent_group);
  const bIsLowPriority = LOW_PRIORITY_COMPETITORS.includes(b.parent_group);
  if (aIsLowPriority && !bIsLowPriority) return 1;  // a to bottom
  if (!aIsLowPriority && bIsLowPriority) return -1; // b to bottom
  return 0;
});
```

### 6. **Update Buyer Entity Type Mapping**
**Problem**: Non-GAR entities incorrectly classified
**Current**: APC, PHG marked as 'gar' type
**Required Change**: Map ALL non-GAR entities to 'competitor' type

**Affected Entities**:
- **APC** → Change from 'gar' to 'competitor'
- **PHG** → Change from 'gar' to 'competitor'
- Any other non-GAR entities → 'competitor'

**Only GAR Entities** (buyer_type: 'gar'):
- GAR Trading
- GAR Trading Pte Ltd
- (other official GAR entities only)

**Implementation**:
- Update `DEMO_TRANSACTIONS` data
- Update transaction type validation logic
- Ensure filter consistency

---

## 🎯 Implementation Roadmap

### Phase 1: Data Fixes (Priority: 🔴 Critical)
**Duration**: 30-45 minutes

#### Task 1.1: Fix Distance Data
- [ ] Review `DEMO_MILL_FACILITY_DISTANCES` for infinity values
- [ ] Validate all mills have proper distance entries
- [ ] Test facility filter with corrected data

#### Task 1.2: Populate Capacity Data
- [ ] Update all mills in `DEMO_MILLS` with capacity values
- [ ] Ensure `capacity_ton_per_hour` field is populated
- [ ] Verify template has capacity defaults

#### Task 1.3: Update Transaction Buyer Types
- [ ] Change APC transactions: `buyer_type: 'gar'` → `'competitor'`
- [ ] Change PHG transactions: `buyer_type: 'gar'` → `'competitor'`
- [ ] Validate only official GAR entities use 'gar' type
- [ ] Test buyer filter after changes

---

### Phase 2: UI Text Updates (Priority: 🟡 Important)
**Duration**: 15-20 minutes

#### Task 2.1: Update Facility Filter Labels
- [ ] Remove "3" from facility selection placeholder text
- [ ] Update descriptive text when facility is selected
- [ ] Ensure text reflects "all nearest mills" not "3 nearest"

#### Task 2.2: Rename New Supplier → Potential Supplier
- [ ] Update scenario card title: "New Supplier" → "Potential Supplier"
- [ ] Update scenario tag: `'new-supplier'` → `'potential-supplier'`
- [ ] Update description: "Not evaluated mills for onboarding" → "Mills with no GAR transaction history"
- [ ] Update all references in code

---

### Phase 3: Feature Enhancements (Priority: 🟡 Important)
**Duration**: 45-60 minutes

#### Task 3.1: Add Distance Filter Column
**Requirements**:
- Add "Distance" filter dropdown alongside Region, Buyer, Product filters
- Filter options:
  - All Distances
  - < 50 km (Near)
  - 50-100 km (Medium)
  - 100-200 km (Far)
  - > 200 km (Very Far)

**Implementation**:
```typescript
// Add to Filters interface
interface Filters {
  region: string;
  owner: string;
  risk: string;
  buyer: string;
  product: string;
  sourcingStatus: string;
  distance: string; // NEW
}

// Add distance filtering logic
const applyDistanceFilter = (mills: EnrichedMill[], distanceFilter: string) => {
  if (distanceFilter === 'all') return mills;

  switch (distanceFilter) {
    case 'near': return mills.filter(m => m.nearestFacilityDistance < 50);
    case 'medium': return mills.filter(m => m.nearestFacilityDistance >= 50 && m.nearestFacilityDistance < 100);
    case 'far': return mills.filter(m => m.nearestFacilityDistance >= 100 && m.nearestFacilityDistance < 200);
    case 'very-far': return mills.filter(m => m.nearestFacilityDistance >= 200);
    default: return mills;
  }
};
```

#### Task 3.2: Update Potential Supplier Filter Logic with Priority Sorting
**Current Logic** (new-supplier scenario):
```javascript
activeScenario === 'new-supplier'
  ? result.filter(m => m.scenario_tags.includes('new-supplier'))
```

**New Logic** (potential-supplier scenario with priority sorting):
```javascript
// Define low priority competitor groups
const LOW_PRIORITY_COMPETITORS = [
  'Wilmar International',
  'Musim Mas',
  'Asian Agri'
];

// Filter: No GAR transactions
if (activeScenario === 'potential-supplier') {
  result = result.filter(m => {
    const garTransactions = m.transactions.filter(t => t.buyer_type === 'gar');
    return garTransactions.length === 0; // No GAR transactions
  });

  // Priority Sorting: Major competitors to bottom
  result.sort((a, b) => {
    const aIsLowPriority = LOW_PRIORITY_COMPETITORS.includes(a.parent_group);
    const bIsLowPriority = LOW_PRIORITY_COMPETITORS.includes(b.parent_group);

    if (aIsLowPriority && !bIsLowPriority) return 1;  // Move a to bottom
    if (!aIsLowPriority && bIsLowPriority) return -1; // Move b to bottom
    return 0; // Maintain existing order for same priority
  });
}
```

**Priority Logic Explanation**:
- **High Priority** (top of table): Mills with no transactions OR only non-major competitor transactions
- **Low Priority** (bottom of table): Mills owned by Wilmar International, Musim Mas, or Asian Agri
- All mills remain visible in the table, just sorted by priority

#### Task 3.3: Remove "3 Nearest" Limit
**Current Implementation**:
```javascript
if (activeScenario === 'facility-driven' && selectedFacility !== 'all') {
  result = result
    .map(mill => {...})
    .sort((a, b) => a.distanceToSelectedFacility - b.distanceToSelectedFacility)
    .slice(0, 3); // REMOVE THIS LINE
}
```

**Required Change**:
- Remove `.slice(0, 3)` to show all mills
- Keep sorting by distance

---

## 📊 Testing Checklist

### Functional Tests
- [ ] **Distance Display**: Facility filter shows real distance values (no Infinity)
- [ ] **Capacity Display**: All mills show capacity in T/H format (no N/A)
- [ ] **Distance Filter**: Dropdown filters mills correctly by distance ranges
- [ ] **Potential Supplier**: Shows only mills with no GAR transactions
- [ ] **Buyer Type Mapping**: APC and PHG transactions marked as 'competitor'
- [ ] **Facility Filter**: Shows ALL nearest mills when facility selected
- [ ] **UI Text**: Updated labels reflect new naming conventions

### Data Validation Tests
- [ ] All mills have valid distance values
- [ ] All mills have capacity_ton_per_hour values
- [ ] Transaction buyer_type correctly mapped
- [ ] Filter combinations work correctly
- [ ] Sort order maintained across filters

### UI/UX Tests
- [ ] Distance filter integrates seamlessly with existing filters
- [ ] "Potential Supplier" scenario card displays correctly
- [ ] Facility filter text is clear and accurate
- [ ] No "3 nearest" references remain in UI
- [ ] Table displays all columns correctly

---

## 📁 Files to Modify

### 1. App.tsx
**Sections to Update**:
- `DEMO_TRANSACTIONS` - Update buyer_type for APC, PHG
- `DEMO_MILLS` - Ensure all capacity_ton_per_hour values populated
- `DEMO_MILL_FACILITY_DISTANCES` - Fix infinity distance issues
- `Filters interface` - Add distance filter
- `SCENARIOS` - Rename new-supplier → potential-supplier
- `filteredMills useMemo` - Add distance filtering logic
- `filteredMills useMemo` - Update potential supplier filter
- `filteredMills useMemo` - Remove .slice(0, 3) from facility-driven
- Filter UI section - Add distance filter dropdown
- Facility filter text - Update placeholder and description

### 2. mills-template.xlsx
**Updates Required**:
- Ensure capacity_ton_per_hour column has default values for all rows
- Validate distance data completeness

### 3. transactions-template.xlsx (if needed)
**Updates Required**:
- Document buyer_type classification rules
- Add validation for GAR vs competitor entities

---

## 🔄 Deployment Steps

1. **Local Development**:
   ```bash
   npm run dev
   # Test all enhancements
   ```

2. **Build & Test**:
   ```bash
   npm run build
   npm run preview
   # Verify production build
   ```

3. **Git Commit**:
   ```bash
   git add .
   git commit -m "feat: UI/UX enhancements and data fixes

   - Fix facility-driven distance display (remove infinity values)
   - Add distance filter column to main table
   - Update capacity data population (remove N/A)
   - Rename 'New Supplier' to 'Potential Supplier' with no-transaction filter
   - Fix buyer entity type mapping (APC, PHG → competitor)
   - Remove '3 nearest' limit from facility filter
   - Update facility filter description text

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"

   git push
   ```

4. **Vercel Deployment**:
   - Auto-deploys on push to main
   - Verify live site functionality

---

## 📝 Implementation Notes

### Distance Data Validation
```javascript
// Ensure all distances are valid numbers
const validateDistances = (distances: MillFacilityDistance[]) => {
  return distances.every(d =>
    typeof d.distance_km === 'number' &&
    !isNaN(d.distance_km) &&
    isFinite(d.distance_km)
  );
};
```

### Buyer Type Classification Logic
```javascript
const GAR_ENTITIES = [
  'GAR Trading',
  'GAR Trading Pte Ltd',
  // Add other official GAR entities
];

const classifyBuyerType = (buyerEntity: string): 'gar' | 'competitor' => {
  return GAR_ENTITIES.includes(buyerEntity) ? 'gar' : 'competitor';
};
```

### Potential Supplier Identification
```javascript
const isPotentialSupplier = (mill: EnrichedMill): boolean => {
  // No GAR transactions = Potential supplier
  const hasGarTransactions = mill.transactions.some(t => t.buyer_type === 'gar');
  return !hasGarTransactions;
};
```

---

## ✅ Success Criteria

**Enhancement Complete When**:
- ✅ Distance values display correctly (no Infinity)
- ✅ Capacity column shows actual values (no N/A)
- ✅ Distance filter column added and functional
- ✅ "Potential Supplier" renamed and filter works correctly
- ✅ APC and PHG correctly marked as 'competitor'
- ✅ Facility filter shows ALL mills, not just 3
- ✅ All UI text updated to reflect changes
- ✅ All tests pass successfully
- ✅ Production build deploys successfully

---

## 📞 Questions & Clarifications Needed

1. **Distance Data Source**: Should we validate distances against actual lat/long calculations?
2. **Capacity Defaults**: What default capacity should be used for mills without data?
3. **GAR Entity List**: Is there a complete list of official GAR buyer entities?
4. **Distance Filter Ranges**: Are the proposed ranges (< 50, 50-100, 100-200, > 200) appropriate?

---

**Document Version**: 1.0
**Last Updated**: 2025-12-06
**Status**: Ready for implementation approval
