# Capacity TPY Column - Implementation Documentation

## Overview
Added a new `capacity_tpy` (Capacity in Tons Per Year) column to the mills data model and main table display.

## Changes Made

### 1. Excel Template Update
**File**: `C:\Users\rianf\Documents\MMDP\data-source\mills-template.xlsx`

- Added new column `capacity_tpy` after `mill_name` column
- Populated with random dummy data between 50,000 and 100,000 TPY for all 1,449 mills
- This column will now be included in all future data exports

### 2. Data Conversion Script
**File**: `C:\Users\rianf\Documents\MMDP\scripts\excel-to-json.js`

- ✅ **No changes needed** - Script automatically reads all columns from Excel
- The `capacity_tpy` field is automatically included in `public/data/mills.json`

### 3. TypeScript Interface
**File**: `C:\Users\rianf\Documents\MMDP\App.tsx` (Line 69)

```typescript
interface Mill {
    // ... existing fields
    capacity_tpy?: number; // Capacity in tons per year
    // ... other fields
}
```

### 4. Main Table Display
**File**: `C:\Users\rianf\Documents\MMDP\App.tsx`

#### Table Header (Lines 2973-2981)
```typescript
<th
  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
  onClick={() => setSortConfig(prev => ({
    key: 'capacity_tpy',
    direction: prev?.key === 'capacity_tpy' && prev.direction === 'asc' ? 'desc' : 'asc'
  }))}
>
  Capacity (TPY) {sortConfig?.key === 'capacity_tpy' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
</th>
```

#### Table Data Cell (Lines 3064-3066)
```typescript
<td className="px-4 py-3 text-sm text-gray-900 font-medium">
  {mill.capacity_tpy ? `${mill.capacity_tpy.toLocaleString()} TPY` : 'N/A'}
</td>
```

### 5. Sorting Logic
**File**: `C:\Users\rianf\Documents\MMDP\App.tsx` (Lines 1141-1161)

- ✅ **No changes needed** - Generic sorting already handles `capacity_tpy`
- Sorting works automatically for any numeric field through `(a as any)[sortConfig.key]`

## Features

### Display Format
- **Format**: Thousands separator with "TPY" suffix
- **Example**: `75,432 TPY`
- **Missing Data**: Shows "N/A" if capacity_tpy is not available

### Sortable Column
- Click column header to sort ascending/descending
- Shows ↑ or ↓ indicator when active
- Hover effect on header for better UX

### Data Range
- **Current dummy data**: 50,000 - 100,000 TPY
- **Actual data**: Will be updated by user later with real capacity values

## Usage Workflow

### For Users Updating Data

1. **Open Excel**: `C:\Users\rianf\Documents\MMDP\data-source\mills-template.xlsx`
2. **Edit capacity_tpy column**: Update values with real mill capacity data (in tons per year)
3. **Save Excel file**
4. **Method A - Manual conversion**: Run `node scripts/excel-to-json.js` in terminal
5. **Method B - In-app refresh**: Click "Refresh Data" button in the app header
6. **Verify**: Check main table to see updated capacity values

### For Ranking Systems (Future Enhancement)

The `capacity_tpy` field is now available for use in KPI scenario ranking logic:

**Potential Supplier Ranking Example**:
```typescript
// Multi-factor score calculation
const capacityScore = (mill.capacity_tpy / 100000) * 0.4; // 40% weight
const riskScore = (mill.risk_level === 'Low' ? 1 : 0) * 0.3; // 30% weight
const distanceScore = (1 - mill.distance / maxDistance) * 0.2; // 20% weight
const statusScore = (mill.irf_status === 'Delivering' ? 1 : 0) * 0.1; // 10% weight

const totalScore = capacityScore + riskScore + distanceScore + statusScore;
```

**Competitor Check Ranking Example**:
```typescript
// Competitive value calculation
const competitiveValue =
  (mill.capacity_tpy * 0.4) + // Larger mills = higher value
  (mill.exclusivity_score * 0.3) + // Less competition = higher value
  (mill.risk_score * 0.2) + // Lower risk = higher value
  (mill.proximity_score * 0.1); // Closer = higher value
```

## Related Files

### Scripts
- `scripts/add-capacity-column.js` - One-time script that added capacity_tpy to Excel (can be deleted)
- `scripts/excel-to-json.js` - Main conversion script (includes capacity_tpy automatically)

### Data Files
- `data-source/mills-template.xlsx` - Excel source with capacity_tpy column
- `public/data/mills.json` - JSON output with capacity_tpy field

### Documentation
- `claudedocs/DATA_REFRESH_FEATURE.md` - How refresh mechanism works
- `claudedocs/HOW_TO_UPDATE_DATA.md` - User guide for updating data
- `claudedocs/DECISION_TREE_BRAINSTORM.md` - KPI scenarios that could use capacity for ranking

## Table Column Order

The main table now has these columns (in order):

1. Mill Name (with badges)
2. Group
3. Company
4. Region
5. IRF Status
6. TTP
7. VDF
8. Buyer
9. Nearest Facility
10. Distance
11. Last Updated
12. Risk
13. **Capacity (T/H)** ← Existing hourly capacity
14. **Capacity (TPY)** ← NEW annual capacity
15. Actions

## Future Enhancements

### Phase 1 - Current ✅
- [x] Add capacity_tpy column to data model
- [x] Display in main table with sorting
- [x] Format with thousands separator
- [x] Make sortable by clicking header

### Phase 2 - Pending User Decision
- [ ] Add capacity_tpy to ranking algorithms
- [ ] Show capacity distribution in analytics
- [ ] Add capacity filters (e.g., >70K TPY, <80K TPY)
- [ ] Create capacity-based KPI scenario
- [ ] Add capacity heatmap visualization

### Phase 3 - Advanced
- [ ] Capacity utilization calculation (actual vs capacity)
- [ ] Capacity trend analysis over time
- [ ] Capacity-based sourcing recommendations
- [ ] Regional capacity aggregation views

## Testing Checklist

- [x] Excel template has capacity_tpy column
- [x] Dummy data populated (50K-100K range)
- [x] Excel to JSON conversion includes capacity_tpy
- [x] TypeScript interface updated
- [x] Main table displays capacity_tpy
- [x] Column header is sortable
- [x] Ascending sort works correctly
- [x] Descending sort works correctly
- [x] Number formatting with thousands separator
- [x] "N/A" displays for missing data
- [x] Refresh button updates capacity data

## Notes

- **Dummy Data**: Current values are random for testing
- **User Responsibility**: User will update with real capacity data later
- **Automatic Processing**: No code changes needed when user updates Excel
- **Backward Compatible**: Missing capacity_tpy values show as "N/A"
- **Performance**: Sorting is efficient (useMemo optimization)
