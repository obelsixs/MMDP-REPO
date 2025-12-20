# Dynamic Filters Feature

## Overview

All filter dropdowns now **automatically populate** based on actual data in your Excel files. No more hardcoded values - the filters adapt to whatever data you have!

## ✅ What Changed

### Before (Static/Hardcoded):
```typescript
// Old way - hardcoded values
<select>
  <option value="Delivering">🟢 Delivering</option>
  <option value="Progressing">🔵 Progressing</option>
  <option value="Commitment">🟠 Commitment</option>
  // ... etc
</select>
```

❌ **Problem**: If your Excel has different values (like "commitment and starting action"), they won't appear in the filter

### After (Dynamic):
```typescript
// New way - extracted from data
{filterOptions.irfStatuses.map(status => (
  <option key={status} value={status}>{icon} {status}</option>
))}
```

✅ **Solution**: Filter automatically shows ALL unique values from your Excel data

## Dynamic Filters List

All these filters now pull values from your data:

| Filter | Source Data | Excel Column |
|--------|-------------|--------------|
| **Regions** | Unique `region` values | `region` |
| **Groups** | Unique `parent_group` values | `parent_group` |
| **Buyers** | Unique buyer entities from transactions | `buyer_entity` (transactions) |
| **Products** | Unique product types from transactions | `product_type` (transactions) |
| **Risk Levels** | Unique `risk_level` values | `risk_level` |
| **IRF Status** | Unique `irf_status` values | `irf_status` |
| **Evaluation Status** | Unique `evaluation_status` values | `evaluation_status` |
| **Eligibility Status** | Unique `eligibility_status` values | `eligibility_status` |

## How It Works

### 1. Data Extraction
When the app loads, it automatically extracts unique values from all mills:

```typescript
const filterOptions = useMemo(() => {
  const irfStatuses = [...new Set(enrichedMills.map(m => m.irf_status).filter(Boolean))].sort();
  // Same for regions, groups, buyers, products, etc.
  return { irfStatuses, regions, groups, ... };
}, [enrichedMills]);
```

### 2. Dynamic Rendering
Filter dropdowns render options based on extracted values:

```typescript
{filterOptions.irfStatuses.map(status => (
  <option key={status} value={status}>{icon} {status}</option>
))}
```

### 3. Auto-Update on Refresh
When you click "Refresh Data", filters automatically update to show new values!

## Benefits

### ✅ Flexibility
- Use **any value** in your Excel files
- No need to match hardcoded lists
- Add new statuses/regions anytime

### ✅ Automatic Discovery
- New values appear automatically
- No code changes needed
- Filters always match your data

### ✅ Clean Filtering
- Only shows values that actually exist in data
- No empty filter options
- Sorted alphabetically

## Examples

### Example 1: Custom IRF Status Values

**Your Excel has**:
```
irf_status
-----------------
Delivering
Progressing
commitment and starting action
New Custom Status
```

**Filter dropdown will show**:
```
All IRF Status
🟢 Delivering
⚪ New Custom Status
🔵 Progressing
⚪ commitment and starting action
```

✅ All values from your Excel appear!

### Example 2: Adding New Region

**Your Excel has**:
```
region
-----------------
Riau
Jambi
Papua (NEW!)
```

**Filter dropdown will show**:
```
All Regions
Jambi
Papua  ← Automatically added!
Riau
```

### Example 3: Custom Buyer Names

**Your transactions have**:
```
buyer_entity
-----------------
GAR Trading
APC
My Custom Company
Another Buyer Ltd
```

**Filter dropdown will show**:
```
All Buyers
🟢 GAR Entities Only
🔴 Has Competitor
No Transactions
──────────
APC
Another Buyer Ltd
GAR Trading
My Custom Company  ← All buyers from your data!
```

## Important Notes

### Case Sensitivity
Filters still use **exact matching**, so:

❌ `"commitment"` ≠ `"Commitment"` (different case)
❌ `"commitment and starting action"` ≠ `"Commitment"` (different text)

**Best Practice**: Be consistent with capitalization in your Excel files

### Empty Values
- Empty/null values are automatically filtered out
- Only non-empty values appear in dropdowns

### Sorting
- All filter options are **sorted alphabetically**
- Makes it easy to find values in long lists

### Icons
Icons are automatically assigned based on value:

**IRF Status Icons**:
- `Delivering` → 🟢
- `Progressing` → 🔵
- `Commitment` → 🟠
- `Starting` → 🟣
- `Awareness` → 🟡
- Everything else → ⚪

**Evaluation Status Icons**:
- `Evaluated` → ✅
- `Under Evaluation` → 🔄
- Everything else → ⚪

**Eligibility Status Icons**:
- `Eligible` → ✅
- `Not Eligible` → ❌

## Usage Workflow

### Step 1: Add New Value to Excel

Edit `data-source/mills-template.xlsx`:
```
irf_status: "My New Status"
```

### Step 2: Convert to JSON

```bash
node scripts/excel-to-json.js
```

### Step 3: Refresh App

Click **"Refresh Data"** button

### Step 4: See New Filter Option

Filter dropdown now shows:
```
All IRF Status
🟢 Delivering
⚪ My New Status  ← NEW!
🔵 Progressing
```

## Performance

### Efficient Computation
- Uses `useMemo` hook for optimization
- Only recalculates when data changes
- Fast even with thousands of mills

### Memory Efficient
- Extracts unique values (no duplicates)
- Sorted arrays for binary search
- Minimal overhead

## Technical Details

### Implementation

**Location**: `App.tsx` line ~916-937

**Code**:
```typescript
const filterOptions = useMemo(() => {
  const regions = [...new Set(enrichedMills.map(m => m.region).filter(Boolean))].sort();
  const groups = [...new Set(enrichedMills.map(m => m.parent_group).filter(Boolean))].sort();
  const buyers = [...new Set(enrichedMills.flatMap(m => m.buyerDetails.map(b => b.buyer)).filter(Boolean))].sort();
  const products = [...new Set(enrichedMills.flatMap(m => m.transactions.map(t => t.product_type)).filter(Boolean))].sort();
  const irfStatuses = [...new Set(enrichedMills.map(m => m.irf_status).filter(Boolean))].sort();
  const riskLevels = [...new Set(enrichedMills.map(m => m.risk_level).filter(Boolean))].sort();
  const evaluationStatuses = [...new Set(enrichedMills.map(m => m.evaluation_status).filter(Boolean))].sort();
  const eligibilityStatuses = [...new Set(enrichedMills.map(m => m.eligibility_status).filter(Boolean))].sort();

  return {
    regions, groups, buyers, products,
    irfStatuses, riskLevels,
    evaluationStatuses, eligibilityStatuses
  };
}, [enrichedMills]);
```

### Filter Rendering Example

**IRF Status Dropdown**:
```typescript
<select value={filters.irfStatus} onChange={(e) => setFilters({...filters, irfStatus: e.target.value})}>
  <option value="all">All IRF Status</option>
  {filterOptions.irfStatuses.map(status => {
    const icon =
      status === 'Delivering' ? '🟢' :
      status === 'Progressing' ? '🔵' :
      status === 'Commitment' ? '🟠' :
      status === 'Starting' ? '🟣' :
      status === 'Awareness' ? '🟡' :
      '⚪';
    return (
      <option key={status} value={status}>{icon} {status}</option>
    );
  })}
</select>
```

## Troubleshooting

### Filter Option Not Showing

**Problem**: Added value to Excel but not in dropdown

**Checklist**:
1. ✅ Did you save the Excel file?
2. ✅ Did you run `node scripts/excel-to-json.js`?
3. ✅ Did you click "Refresh Data" in the app?
4. ✅ Is the value non-empty in Excel?
5. ✅ Check browser console for errors

### Too Many Filter Options

**Problem**: Filter dropdown is cluttered

**Solution**: Standardize your data in Excel
- Use consistent values
- Merge similar categories
- Remove unused values

### Filter Not Working

**Problem**: Selected filter doesn't show results

**Possible Causes**:
1. **Case mismatch**: Excel has `"commitment"` but filtering for `"Commitment"`
2. **Extra spaces**: `"Delivering "` (with space) ≠ `"Delivering"`
3. **Hidden characters**: Copy-paste issues in Excel

**Solution**: Clean your Excel data - remove extra spaces, standardize case

## Migration from Static Filters

### No Action Required!

If you were using the old static filters:
- ✅ Everything still works
- ✅ Existing values still appear
- ✅ No Excel changes needed

### Benefits You Get Automatically

1. **Future-proof**: Add any new values without code changes
2. **Self-documenting**: Filters show exactly what's in your data
3. **Always in sync**: Filters match data automatically

## Summary

🎉 **Dynamic filters make the app truly data-driven!**

**Key Points**:
- ✅ Filters automatically extract values from Excel data
- ✅ No hardcoded lists to maintain
- ✅ Add any custom values you want
- ✅ Filters update when you refresh data
- ✅ Sorted alphabetically for easy browsing
- ✅ Icons assigned intelligently

**Simple workflow**:
```
Edit Excel → Convert → Refresh → See new filter options!
```

Your app now adapts to YOUR data, not the other way around. 🚀
