# How to Update Data in the App

## Quick Start Guide

### Step-by-Step Process

#### 1. **Edit Your Excel Files**

Navigate to the `data-source/` folder and edit any of these files:

```
data-source/
├── mills-template.xlsx                      (Mill information)
├── facilities-template.xlsx                 (Facility data)
├── mill-facility-distances-template.xlsx    (Distance calculations)
└── transactions-template.xlsx               (Buyer transactions)
```

**Example**: Add a new mill to `mills-template.xlsx`

#### 2. **Convert Excel to JSON**

Open terminal in the project folder and run:

```bash
node scripts/excel-to-json.js
```

**Expected Output**:
```
🔄 Excel to JSON Conversion
════════════════════════════════════════════════════════════════════════════════
📂 Reading Excel files from data-source/

🔄 Converting to JSON format

🧹 Cleaning and transforming data

💾 Writing JSON files to public/data/

   ✅ mills.json (1449 records)
   ✅ facilities.json (29 records)
   ✅ distances.json (4347 records)
   ✅ transactions.json (3939 records)

════════════════════════════════════════════════════════════════════════════════
✅ Excel to JSON conversion complete!
```

#### 3. **Refresh in the App**

**Option A**: Use the Refresh Button (Recommended ⭐)
- Click the **"Refresh Data"** button in the top-right corner of the app
- Wait for the green toast notification: "Data refreshed successfully!"
- Your changes appear instantly!

**Option B**: Reload the Page
- Press `F5` or `Ctrl+R` to reload the browser
- ⚠️ Warning: This resets all filters and scroll position

## Visual Guide

```
┌─────────────────────────────────────────────────────────────┐
│  GAR Mill Procurement Intelligence                          │
│  1449 mills • Demo Version                                  │
│                                                              │
│  [Upload Evaluation] [Add Mill] [Refresh Data] [Settings]  │ <- Click here!
└─────────────────────────────────────────────────────────────┘
```

## Common Scenarios

### Scenario 1: Add New Mill

1. Open `data-source/mills-template.xlsx`
2. Add new row with mill data
3. Save Excel file
4. Run: `node scripts/excel-to-json.js`
5. Click **"Refresh Data"** in app
6. See new mill in the list!

### Scenario 2: Update Mill Risk Level

1. Open `data-source/mills-template.xlsx`
2. Find mill and update `risk_level` column
3. Save Excel file
4. Run: `node scripts/excel-to-json.js`
5. Click **"Refresh Data"** in app
6. See updated risk level with new color badge!

### Scenario 3: Update Multiple Files

1. Edit multiple Excel files (mills + facilities)
2. Save all files
3. Run: `node scripts/excel-to-json.js` (converts ALL files)
4. Click **"Refresh Data"** in app
5. See all changes at once!

## What Gets Preserved

When using the **Refresh Data** button (not page reload):

✅ **Preserved**:
- Current filters
- Active tab
- Scroll position
- Search query
- Selected scenario
- Modal state (if open)

❌ **Not Preserved**:
- Selected mill details (will show updated data)

## Troubleshooting

### Problem: Changes Not Showing

**Checklist**:
1. ✅ Did you save the Excel file?
2. ✅ Did you run `node scripts/excel-to-json.js`?
3. ✅ Did you see "✅ Conversion complete!" message?
4. ✅ Did you click "Refresh Data" button?

**Solution**: Follow all 4 steps above

### Problem: "Failed to refresh data" Error

**Cause**: JSON files missing or invalid

**Solution**:
```bash
# Re-run conversion script
node scripts/excel-to-json.js

# Check for errors in output
# Then try Refresh Data button again
```

### Problem: Excel Conversion Error

**Common Causes**:
- Excel file is open (close it first)
- Invalid data format
- Missing required columns

**Solution**:
```bash
# Check error message in terminal
# Fix the Excel file issue
# Try conversion again
```

## Advanced Tips

### Tip 1: Check JSON Files Directly

After conversion, verify changes in JSON files:

```bash
# Windows
notepad public/data/mills.json

# Or use VS Code
code public/data/mills.json
```

### Tip 2: Batch Update Workflow

Working on multiple changes?

1. Make ALL Excel edits first
2. Run conversion ONCE: `node scripts/excel-to-json.js`
3. Click Refresh Data ONCE
4. Review all changes together

### Tip 3: Keep Terminal Open

For frequent updates:

```bash
# Terminal 1: Keep dev server running
npm run dev

# Terminal 2: Use for Excel conversion
node scripts/excel-to-json.js
```

## Comparison: Auto vs Manual Refresh

### Current System: Manual Refresh

**Workflow**:
1. Edit Excel
2. Run script
3. Click button

**Pros**:
- ✅ Full control
- ✅ No surprises
- ✅ Clear workflow
- ✅ Simple setup

**Cons**:
- ❌ Extra step required

### Future: Automatic Refresh

**Not currently implemented**, but could add:
- File watcher on Excel files
- Auto-run conversion on change
- Auto-refresh in browser

**Trade-offs**:
- ✅ Fewer steps
- ❌ More complex
- ❌ Unexpected updates
- ❌ Harder to debug

**Current recommendation**: Stick with manual refresh for clarity and control.

## Summary

### The 3-Step Workflow

```
1. Edit Excel files
   └─> data-source/*.xlsx

2. Convert to JSON
   └─> node scripts/excel-to-json.js

3. Refresh in app
   └─> Click "Refresh Data" button
```

**That's it!** Your changes appear instantly without losing your place in the app. 🎉

## 🆕 Dynamic Filters Feature

### ✅ Filters Now Auto-Update from Your Data

All filter dropdowns now **automatically show values from your Excel data**!

**Example: IRF Status Filter**

If your Excel has:
```
Delivering
Progressing
commitment and starting action
My Custom Status
```

The filter dropdown will show ALL these values automatically! No code changes needed.

### What's Dynamic:
- ✅ Regions
- ✅ Groups
- ✅ Buyers
- ✅ Products
- ✅ Risk Levels
- ✅ IRF Status
- ✅ Evaluation Status
- ✅ Eligibility Status

### Benefits:
- 🎯 Use ANY values in your Excel files
- 🔄 Filters update automatically when you refresh
- 📊 Sorted alphabetically for easy browsing
- ✨ Only shows values that actually exist

**Read more**: [DYNAMIC_FILTERS.md](DYNAMIC_FILTERS.md)

## Quick Reference Card

| Action | Command/Location |
|--------|------------------|
| Edit data | `data-source/*.xlsx` |
| Convert to JSON | `node scripts/excel-to-json.js` |
| Refresh app | Click "Refresh Data" button (top-right) |
| Full reload | `F5` or `Ctrl+R` |
| Check JSON | `public/data/*.json` |
| Start dev server | `npm run dev` |

## Need Help?

1. Check terminal output for errors
2. Verify Excel file format matches template
3. Ensure all required columns are present
4. Check browser console for JavaScript errors
5. Restart dev server if needed: `Ctrl+C` then `npm run dev`
