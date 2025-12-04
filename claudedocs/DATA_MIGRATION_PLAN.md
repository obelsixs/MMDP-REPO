# 📊 GAR Data Migration Plan

**Date**: 2025-12-04
**Source**: GAR_Table_structure.xlsx (8 sheets)
**Target**: 4 template files in data-source/
**Total Records**: 1,449 mills + 3,939 transactions + 4,347 distances + 29 facilities

---

## 🎯 Executive Summary

**Goal**: Migrate real mill data from GAR_Table_structure.xlsx into the app's data structure.

**Source Data Analysis**:
- ✅ **1,449 mills** in mill_master sheet
- ✅ **29 GAR facilities** in gar_facility sheet
- ✅ **146 NBL (No Buy List)** entries
- ✅ **4,347 distance calculations** between mills and facilities
- ✅ **3,939 transaction records**
- ✅ **1 evaluation sample** (can be used as template)
- ✅ **Spatial & non-spatial analysis** data

**Target Templates**:
- `mills-template.xlsx` - 50 columns (most comprehensive)
- `facilities-template.xlsx` - 5 columns
- `mill-facility-distances-template.xlsx` - 4 columns
- `transactions-template.xlsx` - 5 columns

---

## 📋 Data Mapping Strategy

### 🏭 MILLS DATA MIGRATION

**Source**: GAR_Table_structure.xlsx → Sheet "mill_master" (1,449 rows)
**Target**: data-source/mills-template.xlsx

#### Direct Column Mappings (19 available in source):

| Source Column (mill_master) | Target Column (mills-template) | Notes |
|------------------------------|--------------------------------|-------|
| mill_id | mill_id | ✅ Direct match |
| mill_name | mill_name | ✅ Direct match |
| parent_group | parent_group | ✅ Direct match |
| group_engagement | group_engagement | ✅ Direct match |
| province_en | province_en | ✅ Direct match |
| island | island | ✅ Direct match |
| latitude | latitude | ✅ Direct match |
| longitude | longitude | ✅ Direct match |
| evaluation_status | evaluation_status | ✅ Direct match (mostly null) |
| current_evaluation_id | current_evaluation_id | ✅ Direct match (mostly null) |
| current_evaluation_doc_url | current_eval_doc_url | ✅ Direct match (mostly null) |
| current_asana_task_url | current_asana_task_url | ✅ Direct match (mostly null) |

#### Derived/Calculated Columns:

| Target Column | Calculation Strategy |
|---------------|---------------------|
| **region** | Use province_en as region (or map district to region) |
| **nbl_flag** | Lookup mill_id in NBL sheet → if found, set TRUE |
| **nbl_reason** | Get "Remark" from NBL sheet |
| **nbl_date_added** | Default to null (not in source) |
| **distance_to_nearest** | Min distance from distance_matrix sheet |
| **nearest_facility** | Facility name with ranking = 1 |
| **last_updated** | Set to current date for all mills |
| **sourcing_status** | Default to "Unknown" |
| **scenario_tags** | Default to empty array [] |

#### Enrichment from evaluation_result (1 sample row):

If we match mill_id with evaluation_result, we can populate:
- risk_level
- recommendation
- traceability_level
- ffb_source_own_pct, ffb_source_plasma_pct, ffb_source_independent_pct
- ffb_source_comment
- recommendation_notes
- ndpe_violation_found
- public_grievance_flag
- deforestation_alerts
- hotspot_alerts
- peat_presence
- approval_by, approved_date
- asana_task_id
- eligibility_status
- attachment_url

**Note**: Only 1 evaluation record exists, so most mills will have null for these fields.

#### Fields Not Available in Source (will be null/default):

- capacity_ton_per_hour
- sourcing_status_last_updated
- competitor_flag
- competitor_buyer
- asana_assigned_to
- asana_status
- asana_current_stage
- asana_current_stage_name
- asana_request_date
- asana_expected_completion
- asana_progress_pct

---

### 🏢 FACILITIES DATA MIGRATION

**Source**: GAR_Table_structure.xlsx → Sheet "gar_facility" (29 rows)
**Target**: data-source/facilities-template.xlsx

#### Column Mappings:

| Source Column | Target Column | Transformation |
|---------------|---------------|----------------|
| facility_name | facility_name | ✅ Direct match |
| facility_name | facility_id | Generate ID: "FAC001", "FAC002"... |
| facility_type | type | ✅ Direct match |
| owner | region | Use owner as region (or derive from location) |
| N/A | code | Generate 3-letter codes from names |

**Code Generation Strategy**:
- Palaran → PAL
- Kumai → KUM
- Sampit → SAM
- etc.

---

### 📏 DISTANCE MATRIX MIGRATION

**Source**: GAR_Table_structure.xlsx → Sheet "distance_matrix" (4,347 rows)
**Target**: data-source/mill-facility-distances-template.xlsx

#### Perfect Match! All columns align:

| Source Column | Target Column | Notes |
|---------------|---------------|-------|
| mill_id | mill_id | ✅ Direct match |
| facility_name | facility_name | ✅ Direct match |
| distance_km | distance_km | ⚠️ Currently string, convert to number |
| ranking | ranking | ✅ Direct match |

**Data Cleaning Required**:
- Convert distance_km from string to number

---

### 💰 TRANSACTIONS DATA MIGRATION

**Source**: GAR_Table_structure.xlsx → Sheet "mill_transaction" (3,939 rows)
**Target**: data-source/transactions-template.xlsx

#### Column Mappings:

| Source Column | Target Column | Transformation |
|---------------|---------------|----------------|
| mill_id | mill_id | ✅ Direct match |
| buyer_entity | buyer_entity | ✅ Direct match |
| product_type | product_type | ✅ Direct match (CPO/PK) |
| last_verified | last_verified | ✅ Direct match |
| N/A | buyer_type | **NEEDS MAPPING** |

**Critical Decision Required**: `buyer_type` field

The target expects: `'gar' | 'competitor'`

**Options**:
1. **Map by buyer_entity name** - if buyer contains "GAR" → 'gar', else → 'competitor'
2. **Default all to 'gar'** - assume all transactions are GAR
3. **User provides mapping** - you tell me which buyers are GAR vs competitor

**Sample buyers from data**: APC, PHG, etc.

---

## 🔧 Implementation Steps

### Phase 1: Data Preparation Script ⏱️ 2 hours

Create `scripts/migrate-gar-data.js` to:

1. **Read GAR_Table_structure.xlsx**
2. **Process Mills**:
   - Load mill_master (1,449 rows)
   - Enrich with NBL data
   - Calculate distance_to_nearest from distance_matrix
   - Lookup evaluation data (limited to 1 sample)
   - Set defaults for missing fields
3. **Process Facilities**:
   - Load gar_facility (29 rows)
   - Generate facility_id and code
4. **Process Distances**:
   - Load distance_matrix (4,347 rows)
   - Convert distance_km to number
5. **Process Transactions**:
   - Load mill_transaction (3,939 rows)
   - Apply buyer_type mapping logic
6. **Write to Templates**:
   - Overwrite mills-template.xlsx
   - Overwrite facilities-template.xlsx
   - Overwrite mill-facility-distances-template.xlsx
   - Overwrite transactions-template.xlsx

### Phase 2: Data Validation ⏱️ 30 minutes

1. Verify row counts match
2. Check for missing required fields
3. Validate data types
4. Check referential integrity (mill_ids exist in all related tables)

### Phase 3: App Integration ⏱️ 1 hour

1. Modify App.tsx to add `group` and `company` fields
2. Update interface if needed
3. Run conversion script (Step 2 of PLAN.md)
4. Test data loading

### Phase 4: Testing ⏱️ 1 hour

1. Load app with real data
2. Verify 1,449 mills display
3. Test search/filter with real data
4. Check NBL flags work correctly
5. Verify distance calculations
6. Test transaction data integration

---

## ⚠️ Critical Decisions Needed

### 1. Missing `group` and `company` Fields

The App.tsx interface has:
```typescript
group?: string;
company?: string;
```

But GAR_Table_structure.xlsx doesn't have these columns.

**Options**:
- A) Remove from interface (not recommended - data loss)
- B) Use `entity` field as `company`
- C) Use `parent_group` as both `group` and `company`
- D) Leave as null

**Recommendation**: Option B
- `company` ← `entity` (PT Abdi Budi Mulia, etc.)
- `group` ← `parent_group` (Aathi Bagawathi Manufacturing Sdn Bhd, etc.)

### 2. Transaction `buyer_type` Mapping

**Need your input**: Which buyers are GAR vs competitors?

**Sample buyer_entity values**: APC, PHG, (need to see more in detail)

**Proposed Auto-Detection**:
```javascript
const GAR_BUYERS = ['GAR', 'Golden Agri', 'APC', 'PHG', /* add more */];
const isGAR = GAR_BUYERS.some(b => buyer_entity.includes(b));
buyer_type = isGAR ? 'gar' : 'competitor';
```

### 3. Region Field Mapping

Template expects `region` but source has `province_id` and `province_en`.

**Options**:
- A) Use `province_en` as `region`
- B) Map provinces to regions (e.g., "North Sumatra" → "Sumatra Region 1")
- C) Use `island` as `region`

**Recommendation**: Option A (simplest, preserves data)

### 4. Facility Code Generation

Need 3-letter codes for facilities.

**Auto-generation strategy**:
- Take first 3 letters of facility_name
- If duplicate, add number
- Palaran → PAL
- Kumai → KUM

---

## 📊 Data Quality Assessment

### ✅ Strengths:
- **Large dataset**: 1,449 mills with geographic data
- **Good structure**: Clear separation of concerns (mills, facilities, distances)
- **Rich transactions**: 3,939 transaction records
- **NBL tracking**: 146 mills flagged
- **Distance calculations**: Pre-calculated distances to all facilities

### ⚠️ Limitations:
- **Limited evaluation data**: Only 1 evaluation record (most mills will have null risk/assessment data)
- **Missing operational data**: No capacity, competitor flags, asana workflow data
- **Minimal metadata**: Most evaluation_status, current_evaluation_id are null
- **Type inconsistency**: distance_km stored as string instead of number

### 🎯 Impact:
- App will display 1,449 real mills
- Most mills will show "Not Evaluated" status
- Risk assessment features will have limited data initially
- Distance calculations will work perfectly
- Transaction tracking fully functional
- NBL filtering will work

---

## 📈 Expected Outcomes

After migration:

| Metric | Before | After |
|--------|--------|-------|
| Mills in system | 14 (demo) | 1,449 (real) |
| Facilities | 5 (demo) | 29 (real) |
| Transactions | ~30 (demo) | 3,939 (real) |
| Distance data | ~50 (demo) | 4,347 (real) |
| NBL tracking | Demo | 146 real mills |
| Geographic coverage | Limited | Full Indonesia palm oil |

---

## 🚀 Recommended Execution Order

### Option A: Automated Migration (Recommended) ⏱️ ~3 hours total

1. ✅ Create migration script
2. ✅ Run migration with confirmation prompts
3. ✅ Validate output
4. ✅ Test in app
5. ✅ Commit changes

### Option B: Manual Review (Safer, Slower) ⏱️ ~6 hours total

1. Export each sheet to CSV
2. Manually review in Excel
3. Apply mappings in Excel
4. Import to templates
5. Validate
6. Test

**Recommendation**: Option A with validation gates

---

## 📋 Pre-Migration Checklist

Before I proceed with creating the migration script:

- [ ] **Decision 1**: Confirm group/company mapping (entity → company, parent_group → group)
- [ ] **Decision 2**: Provide buyer_type mapping or approve auto-detection
- [ ] **Decision 3**: Confirm province_en → region mapping
- [ ] **Decision 4**: Approve auto-generation of facility codes
- [ ] **Decision 5**: Confirm you want to overwrite existing templates (backup exists in GAR_Table_structure.xlsx)

---

## 🎯 Next Steps

**I'm ready to create the migration script once you approve:**

1. Review this plan
2. Make decisions on the 5 critical questions above
3. Approve to proceed
4. I'll create `scripts/migrate-gar-data.js`
5. Run migration with your supervision
6. Validate results
7. Integrate into app

**Estimated Total Time**: 4-5 hours for complete migration and testing

**Questions?** Let me know what needs clarification!
