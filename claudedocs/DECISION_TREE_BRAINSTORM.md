# KPI Scenario Decision Trees - Brainstorming & Analysis

## Overview

This document explains the logic behind each KPI scenario button and explores whether ranking/scoring systems should be added.

---

## 1. 🏭 Facility-Driven Scenario

### Current Implementation

**When Clicked**:
1. User selects a facility from dropdown
2. System filters mills that have distance data to that facility
3. Mills are sorted by **distance (nearest first)**
4. Shows only mills with distance data

**Current Sorting Logic**:
```javascript
// Line 1118
.sort((a, b) => distanceToSelectedFacility ASC)
// Nearest mills appear first
```

**What's Shown in Table**:
- FACILITY column: Shows selected facility name
- DISTANCE column: Shows actual distance to selected facility
- All other columns: Normal data

---

### 🤔 Brainstorm: Should We Add Ranking?

#### Option A: Keep As-Is (Distance Only) ✅ **RECOMMENDED**

**Pros**:
- ✅ Simple and clear: "Show me nearest mills"
- ✅ User can see exact distances
- ✅ Logistics use case is straightforward
- ✅ No complex calculations needed

**Cons**:
- ❌ Doesn't consider mill quality/risk
- ❌ Nearest mill might be high-risk or low-capacity

**Best For**:
- Quick logistics planning
- Finding mills within X km
- Geographic analysis

---

#### Option B: Add Multi-Factor Ranking Score 🎯

**Ranking Formula Example**:
```
Score = (Distance Weight × Distance Score) +
        (Risk Weight × Risk Score) +
        (Capacity Weight × Capacity Score) +
        (Status Weight × Status Score)

Example Weights:
- Distance: 40%
- Risk: 30%
- Capacity: 20%
- IRF Status: 10%
```

**Scoring Logic**:
```javascript
Distance Score:
  < 50 km    = 100 points
  50-100 km  = 75 points
  100-200 km = 50 points
  > 200 km   = 25 points

Risk Score:
  Low Risk    = 100 points
  Medium Risk = 50 points
  High Risk   = 0 points

Capacity Score:
  > 60 T/H   = 100 points
  40-60 T/H  = 75 points
  20-40 T/H  = 50 points
  < 20 T/H   = 25 points

IRF Status Score:
  Delivering  = 100 points
  Progressing = 75 points
  Commitment  = 50 points
  Starting    = 25 points
  Awareness   = 10 points
  Unknown     = 0 points
```

**Pros**:
- ✅ Considers multiple factors
- ✅ Helps prioritize "best fit" mills
- ✅ Reduces manual analysis
- ✅ Can adjust weights per business needs

**Cons**:
- ❌ More complex to explain
- ❌ Weights might not fit all scenarios
- ❌ User loses transparency (why is this mill ranked #1?)

**Best For**:
- Strategic mill selection
- When quality matters as much as distance
- Executive decision support

---

#### Option C: Show Top 3 Nearest + Highlight Best ⭐

**Hybrid Approach**:
1. Sort by distance (as now)
2. Within top 10 nearest, highlight "recommended" mills based on:
   - ✅ Low/Medium risk (not High)
   - ✅ Delivering/Progressing status
   - ✅ Capacity > 30 T/H
3. Add visual indicator (⭐ or green highlight)

**Pros**:
- ✅ Keeps distance priority
- ✅ Guides user to quality mills
- ✅ Transparent (can see why)
- ✅ Not too complex

**Cons**:
- ❌ Still requires some manual review

**Best For**:
- Balancing logistics and quality
- Users who want guidance but not automation

---

### 💡 My Recommendation for Facility-Driven

**Start with Option A (current implementation)**

**Why**:
1. ✅ Clear purpose: "Find nearest mills"
2. ✅ Users can filter further using existing filters
3. ✅ Logistics teams need distance, not scores
4. ✅ Keeps the tool flexible

**Consider adding later**:
- 📊 Visual indicators for quality (badges)
- 🎯 Optional "Smart Ranking" toggle
- 📈 Summary stats: "3 Low-Risk mills within 50km"

---

## 2. 📦 Potential Supplier Scenario

### Current Implementation

**When Clicked**:
1. Filters to show: `eligibility_status = "Eligible"` AND `NO GAR transactions`
2. Sorts with **low-priority competitors at bottom**:
   - Wilmar International → bottom
   - Musim Mas → bottom
   - Asian Agri → bottom
   - Everyone else → top

**Current Sorting Logic**:
```javascript
// Line 1124-1138
Low priority competitors sink to bottom
Others maintain order
```

---

### 🤔 Brainstorm: Should We Add Ranking?

#### Current Approach: Manual Priority (Basic) ✅ **CURRENT**

**Pros**:
- ✅ Simple competitor deprioritization
- ✅ Eligible mills are pre-filtered
- ✅ Clear business logic

**Cons**:
- ❌ No quality scoring within non-competitor group
- ❌ Doesn't highlight "best" potential suppliers

---

#### Enhanced Approach: Priority Tiers 🎯

**3-Tier System**:

**Tier 1 - High Priority** (Top):
- ✅ Eligible
- ✅ No GAR transactions
- ✅ NOT major competitor
- ✅ Low/Medium risk
- ✅ Delivering/Progressing status
- ✅ Capacity > 30 T/H

**Tier 2 - Medium Priority** (Middle):
- ✅ Eligible
- ✅ No GAR transactions
- ✅ NOT major competitor
- ⚠️ But: High risk OR low capacity OR poor IRF status

**Tier 3 - Low Priority** (Bottom):
- Major competitors (current logic)

**Pros**:
- ✅ Clear prioritization
- ✅ Highlights "ready to engage" mills
- ✅ Still transparent

**Cons**:
- ❌ Needs UI to show tiers
- ❌ More complex logic

---

#### Scoring Approach: Acquisition Readiness Score 📊

**Formula**:
```
Readiness Score =
  (Risk: 30%) +
  (IRF Status: 30%) +
  (Capacity: 20%) +
  (Distance to Nearest GAR Facility: 20%)

100 = Perfect acquisition target
0 = Not recommended
```

**Pros**:
- ✅ Quantifies "how ready" each mill is
- ✅ Can rank by score
- ✅ Helps prioritize outreach

**Cons**:
- ❌ Weights might vary by strategy
- ❌ Complex to explain

---

### 💡 My Recommendation for Potential Supplier

**Use Enhanced Tier System (Option 2)**

**Why**:
1. ✅ Clear business categories
2. ✅ Highlights "hot prospects" vs "maybe later"
3. ✅ Can show tier badges in UI
4. ✅ Transparent logic

**Implementation**:
- Show tier badge: 🥇 High Priority | 🥈 Medium Priority | 🥉 Low Priority
- Sort: Tier 1 → Tier 2 → Tier 3
- Within each tier, sort by capacity or distance

---

## 3. 👁️ Competitor Check Scenario

### Current Implementation

**When Clicked**:
1. Filters to: Mills with `buyer_type = 'competitor'` transactions
2. No special sorting

**Purpose**:
- See which mills competitors are buying from
- Identify potential acquisition targets
- Monitor competitive landscape

---

### 🤔 Brainstorm: Should We Add Ranking?

#### Current: Simple Filter (Basic) ✅ **CURRENT**

**Pros**:
- ✅ Clear: "Who's supplying competitors?"
- ✅ Shows all competitor mills

**Cons**:
- ❌ No prioritization
- ❌ Hard to know which mills to approach first

---

#### Enhanced: Competitive Threat Score 🎯

**Ranking by Competitive Intelligence**:

**High Priority** (Try to acquire):
- Large capacity (> 60 T/H)
- Delivering status
- Low risk
- Only supplies to 1 competitor (easier to flip)
- Close to GAR facilities

**Medium Priority**:
- Medium capacity
- Supplies to multiple competitors
- Medium risk

**Low Priority**:
- Small capacity
- High risk
- Far from GAR facilities
- Deeply embedded with competitor (hard to flip)

**Score Calculation**:
```javascript
Competitive Value =
  Capacity (40%) +
  Exclusivity (30%) - higher if only 1 competitor +
  Risk (20%) +
  Distance to GAR facility (10%)
```

**Pros**:
- ✅ Identifies "winnable" mills
- ✅ Strategic prioritization
- ✅ Helps focus competitive strategy

**Cons**:
- ❌ Complex business logic
- ❌ Needs competitive strategy input

---

### 💡 My Recommendation for Competitor Check

**Add Competitive Value Ranking**

**Why**:
1. ✅ This scenario is strategic (not just informational)
2. ✅ Helps prioritize which competitor mills to target
3. ✅ Shows "easy wins" vs "hard battles"

**Show in UI**:
- Priority badge: 🎯 High Value | ⚠️ Medium Value | 📊 Monitor
- Sort by priority by default
- Show competitor count in table

---

## 4. 🏛️ Regional Supply Potential Scenario

### Current Implementation

**When Clicked**:
1. Shows **Analytics View** (not table)
2. Groups mills by region
3. Shows aggregated stats per region:
   - Total capacity
   - Total mills
   - Status breakdown
   - Buyer distribution

**Purpose**:
- Regional supply planning
- Capacity analysis
- Strategic overview

---

### 🤔 Brainstorm: Should We Add Ranking?

#### Current: Regional Aggregation (Analytics) ✅ **CURRENT**

**Pros**:
- ✅ Perfect for regional analysis
- ✅ Shows big picture
- ✅ Helps strategic planning

**Cons**:
- ❌ No region prioritization
- ❌ Hard to compare regions

---

#### Enhanced: Regional Opportunity Score 📊

**Rank Regions by**:
```
Opportunity Score =
  Available Capacity (40%) +
  Mill Quality (30%) - avg risk, status +
  GAR Presence (20%) - how many already supply GAR +
  Competition Density (10%) - how many competitor mills
```

**Show Regions Ranked**:
1. 🥇 **High Opportunity**: Large capacity, low GAR presence, good quality
2. 🥈 **Medium Opportunity**: Mixed factors
3. 🥉 **Low Opportunity**: Small capacity or high competition

**Pros**:
- ✅ Guides regional expansion strategy
- ✅ Compares regions objectively
- ✅ Helps allocate resources

**Cons**:
- ❌ Regional strategy is complex (other factors matter)
- ❌ Might oversimplify

---

### 💡 My Recommendation for Regional Supply Potential

**Keep Current Analytics View, Add Optional Sorting**

**Why**:
1. ✅ Regional view is strategic (CEO/VP level)
2. ✅ Analytics are more useful than ranking
3. ✅ Users want to explore, not be told

**Enhancement**:
- Add sort dropdown: "Sort by Total Capacity" | "Sort by GAR Penetration" | "Sort by Mill Count"
- Highlight regions with growth opportunity

---

## Summary: Ranking Recommendations

| Scenario | Current | Recommended Enhancement | Priority |
|----------|---------|------------------------|----------|
| **Facility-Driven** | Distance sorting | Keep as-is, add quality badges later | 🟢 Low |
| **Potential Supplier** | Competitor deprioritization | **Add 3-tier priority system** | 🔴 High |
| **Competitor Check** | Simple filter | **Add competitive value ranking** | 🟡 Medium |
| **Regional Supply** | Analytics view | Add sort options | 🟢 Low |

---

## Next Steps

### Phase 1: Quick Wins (No Ranking)
✅ Current implementation is good enough for:
- Facility-Driven (distance is the key metric)
- Regional Supply (analytics are sufficient)

### Phase 2: Add Prioritization (Recommended)
🎯 Add ranking/tiers for:
1. **Potential Supplier** → 3-tier priority system
2. **Competitor Check** → Competitive value score

### Phase 3: Advanced Features (Future)
📊 Consider later:
- Smart ranking toggle (on/off)
- Custom weight configuration
- ML-based recommendations

---

## Questions for You

1. **Facility-Driven**: Do you want ranking, or is "nearest first" sufficient?
   - If ranking: What factors matter? (Distance, Risk, Capacity, Status?)

2. **Potential Supplier**: Should we add 3-tier priority?
   - What makes a mill "high priority" for acquisition?

3. **Competitor Check**: Should we rank by "winnable" or just show all?
   - What competitive factors matter most?

4. **Regional Supply**: Analytics-only or also show region rankings?

---

## My Recommendation

**Start Simple, Add Complexity Based on User Feedback**

**Phase 1** (Now):
- ✅ Keep Facility-Driven as-is (distance sorting)
- ✅ Keep Regional Supply as-is (analytics)

**Phase 2** (Next):
- 🎯 Add Potential Supplier tiers (High/Medium/Low Priority)
- 🎯 Add Competitor Check value score

**Why this approach**:
1. ✅ Facility-Driven is clear (logistics-focused)
2. ✅ Potential Supplier & Competitor Check need guidance (strategic decisions)
3. ✅ Can iterate based on real usage
4. ✅ Doesn't overcomplicate

**Let me know your thoughts and I can implement accordingly!** 🚀
