# IRF Status Field - Correct Values

## ⚠️ IMPORTANT: Exact Values Required

The `irf_status` column in your Excel file **must use these exact values** (case-sensitive):

### ✅ Valid IRF Status Values

| Value | Description | Filter Color |
|-------|-------------|--------------|
| `Delivering` | Highest performance level | 🟢 Green |
| `Progressing` | Making progress | 🔵 Blue |
| `Commitment` | Committed to action | 🟠 Orange |
| `Starting` | Just beginning | 🟣 Purple |
| `Awareness` | Aware but not started | 🟡 Yellow |
| `Unknown` | Status not known | ⚪ White |

### ❌ Common Mistakes

**Wrong Values** (will NOT work):
- ❌ `"commitment and starting action"` - lowercase + extra text
- ❌ `"commitment"` - lowercase
- ❌ `"COMMITMENT"` - all caps
- ❌ `"Committing"` - different word
- ❌ `"starting"` - lowercase
- ❌ `"Deliver"` - wrong tense

**Correct Values**:
- ✅ `"Commitment"` - exact match
- ✅ `"Starting"` - exact match
- ✅ `"Delivering"` - exact match

## How to Fix Your Excel File

### Step 1: Open Excel File

Open `data-source/mills-template.xlsx`

### Step 2: Find the `irf_status` Column

Look for the column header `irf_status` (usually column AH or AI)

### Step 3: Fix Invalid Values

**Find and Replace**:

1. Select the entire `irf_status` column
2. Use Find & Replace (Ctrl+H):

```
Find: "commitment and starting action"
Replace with: "Commitment"
```

Or manually change each cell to one of the valid values above.

### Step 4: Save and Refresh

1. Save the Excel file
2. Run: `node scripts/excel-to-json.js`
3. Click "Refresh Data" in the app

## Example: Correct Excel Data

Your `irf_status` column should look like this:

| mill_id | mill_name | irf_status |
|---------|-----------|------------|
| M001 | Mill Alpha | Delivering |
| M002 | Mill Beta | Progressing |
| M003 | Mill Gamma | Commitment |
| M004 | Mill Delta | Starting |
| M005 | Mill Epsilon | Awareness |
| M006 | Mill Zeta | Unknown |

**NOT like this**:

| mill_id | mill_name | irf_status |
|---------|-----------|------------|
| M001 | Mill Alpha | delivering ❌ |
| M002 | Mill Beta | progress ❌ |
| M003 | Mill Gamma | commitment and starting action ❌ |
| M004 | Mill Delta | start ❌ |

## Why Exact Matching?

The app uses **strict equality** (`===`) to filter data:

```javascript
// This checks exact match
if (filters.irfStatus !== 'all') {
    result = result.filter(mill => mill.irf_status === filters.irfStatus);
}
```

So:
- `"Commitment"` === `"Commitment"` ✅ Match!
- `"commitment"` === `"Commitment"` ❌ No match
- `"commitment and starting action"` === `"Commitment"` ❌ No match

## Quick Check

After fixing, verify your data:

```bash
# Convert to JSON
node scripts/excel-to-json.js

# Check the JSON file (should see exact values)
# Windows:
notepad public/data/mills.json

# Or search for irf_status in the file
findstr "irf_status" public/data/mills.json
```

Look for lines like:
```json
"irf_status": "Commitment",
"irf_status": "Starting",
"irf_status": "Delivering",
```

**NOT**:
```json
"irf_status": "commitment and starting action",  ❌
```

## Summary

✅ **Use exact values**: `Delivering`, `Progressing`, `Commitment`, `Starting`, `Awareness`, `Unknown`

❌ **Don't use**: lowercase, extra words, different spellings

Then: Save → Convert → Refresh Data → Filters will work! 🎉
