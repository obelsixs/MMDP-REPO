# Data Refresh Feature Documentation

## Overview

Added a seamless "Refresh Data" button to the GAR Mill Procurement Intelligence app that allows users to reload data from Excel files without restarting the dev server or refreshing the page.

## Feature Details

### User Interface

**Location**: Top-right header, between "Add Mill" and "Settings" buttons

**Button States**:
- **Normal**: Green border, "Refresh Data" text with refresh icon
- **Loading**: Gray border, "Refreshing..." text with spinning icon, disabled state

### How It Works

1. **User clicks "Refresh Data"** button in the header
2. Button shows **loading state** (spinning icon, disabled)
3. App **re-fetches all JSON files** from `/public/data/` with cache-busting
4. Data updates **instantly without page reload**
5. Toast notification confirms success
6. All filters, views, and state are preserved

## Usage Workflow

### When to Use Refresh Button

Use the **Refresh Data** button whenever you update data in Excel files:

1. Edit Excel files in `data-source/` folder:
   - `mills-template.xlsx`
   - `facilities-template.xlsx`
   - `mill-facility-distances-template.xlsx`
   - `transactions-template.xlsx`

2. Run conversion script in terminal:
   ```bash
   node scripts/excel-to-json.js
   ```

3. Click **"Refresh Data"** button in the app
4. See updated data instantly!

### Example Workflow

```bash
# 1. Update Excel file
# Edit: data-source/mills-template.xlsx
# (Add new mill or update existing data)

# 2. Convert to JSON
node scripts/excel-to-json.js

# Output:
# ✅ mills.json (1450 records)  <- Note: 1 more record
# ✅ facilities.json (29 records)
# ✅ distances.json (4347 records)
# ✅ transactions.json (3939 records)

# 3. Click "Refresh Data" in app
# See the new mill appear instantly!
```

## Technical Implementation

### Files Modified

**App.tsx** (3 changes):
1. Added `refreshing` state variable
2. Created `handleRefreshData()` function
3. Added refresh button to header

### Code Changes

#### State Management
```typescript
const [refreshing, setRefreshing] = useState(false);
```

#### Refresh Function
```typescript
const handleRefreshData = async () => {
  try {
    setRefreshing(true);
    showToast('Refreshing data from Excel files...', 'success');

    // Cache-busting to force fresh data
    const timestamp = Date.now();
    const [millsRes, facilitiesRes, transactionsRes, distancesRes] = await Promise.all([
      fetch(`/data/mills.json?t=${timestamp}`),
      fetch(`/data/facilities.json?t=${timestamp}`),
      fetch(`/data/transactions.json?t=${timestamp}`),
      fetch(`/data/distances.json?t=${timestamp}`)
    ]);

    // Update all state
    setMills(await millsRes.json());
    setFacilities(await facilitiesRes.json());
    setTransactions(await transactionsRes.json());
    setDistances(await distancesRes.json());

    showToast('Data refreshed successfully!', 'success');
  } catch (error) {
    showToast('Failed to refresh data.', 'error');
  } finally {
    setRefreshing(false);
  }
};
```

#### UI Button
```tsx
<button
  onClick={handleRefreshData}
  disabled={refreshing}
  className={`inline-flex items-center px-3 py-1.5 text-xs border rounded-md ${
    refreshing
      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
      : 'border-green-300 text-green-700 hover:bg-green-50'
  }`}
  title="Refresh data from Excel files"
>
  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
  {refreshing ? 'Refreshing...' : 'Refresh Data'}
</button>
```

## Key Features

✅ **Seamless UX**: No page reload, preserves all state
✅ **Visual Feedback**: Loading spinner and toast notifications
✅ **Cache Busting**: Timestamp query param ensures fresh data
✅ **Error Handling**: Clear error messages if refresh fails
✅ **Disabled State**: Button disabled during refresh to prevent double-clicks
✅ **Non-Intrusive**: Button blends with existing header design

## Automatic vs Manual Updates

### ❌ NOT Automatic
- Changes to Excel files do NOT automatically appear in the app
- You must manually run the conversion script

### ✅ Manual Process Required
1. Edit Excel files
2. Run `node scripts/excel-to-json.js`
3. Click "Refresh Data" button

### Why Not Automatic?

**Current Design Philosophy**:
- Explicit control over when data updates
- Prevents unexpected data changes during analysis
- Clear workflow: Edit → Convert → Refresh
- No file watchers or background processes needed

### Future Enhancement (Optional)

If you want **automatic refresh** when Excel files change:

```javascript
// Could add file watcher to vite.config.ts
import { watch } from 'chokidar';

const watcher = watch('data-source/*.xlsx');
watcher.on('change', () => {
  exec('node scripts/excel-to-json.js');
});
```

But for now, **manual is simpler and more predictable**.

## Benefits Over Page Refresh

| Feature | Page Refresh (F5) | Refresh Button |
|---------|-------------------|----------------|
| Preserves filters | ❌ No | ✅ Yes |
| Preserves scroll position | ❌ No | ✅ Yes |
| Preserves active tab | ❌ No | ✅ Yes |
| Loading indicator | ❌ No | ✅ Yes |
| Toast notification | ❌ No | ✅ Yes |
| Speed | Slow | Fast |

## Troubleshooting

### "Failed to refresh data" Error

**Cause**: JSON files don't exist or are invalid

**Solution**:
```bash
# Run conversion script first
node scripts/excel-to-json.js

# Then click Refresh Data button
```

### Data Not Updating

**Check**:
1. Did you run `node scripts/excel-to-json.js`?
2. Check terminal output for conversion success
3. Check `public/data/` folder for updated JSON files
4. Check browser console for errors

### Button Stuck in Loading State

**Solution**:
- Refresh the page (F5)
- Check browser console for errors
- Verify dev server is still running

## Development Notes

### Design Decisions

1. **Client-side only**: No backend API needed for dev mode
2. **Cache busting**: Timestamp query params bypass browser cache
3. **Green styling**: Matches "success" action theme
4. **Placement**: Header for easy access from any view
5. **Toast feedback**: Clear success/error communication

### Testing Checklist

✅ Button appears in header
✅ Button disabled during refresh
✅ Spinner animates during refresh
✅ Toast shows during refresh
✅ Data updates without page reload
✅ Filters preserved after refresh
✅ Error handling works

## Summary

The **Refresh Data** button provides a seamless way to update data from Excel files without disrupting the user's workflow. It maintains the app's state while loading fresh data from the JSON files.

**Simple workflow**: Edit Excel → Run script → Click button → See updates! 🚀
