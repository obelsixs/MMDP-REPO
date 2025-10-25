
import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, XCircle, Calendar, Users, MapPin, FileText, ExternalLink, Upload, TrendingUp, Package, Navigation, Database, Activity, RefreshCw, Send, Clock, Award, Star, Bell, ArrowRight, CheckSquare, Factory, Droplet, Eye, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';

// ============================================
// CURATED DEMO DATA (12 Mills - Story-Driven)
// ============================================

const DEMO_MILLS = [
  // ✅ ELIGIBLE MILLS (3)
  {
    mill_id: "PO1000001",
    mill_name: "Forest Green Palm Mill",
    parent_group: "Sustainable Palm Industries",
    group_engagement: "Active",
    region: "Jambi",
    province_en: "Jambi",
    island: "Sumatra",
    latitude: -1.6101,
    longitude: 103.6131,
    evaluation_status: "Eligible",
    current_evaluation_id: "EVAL2024_001",
    last_eval_date: "2024-06-15",
    valid_until: "2027-06-15",
    status_validity: "Valid",
    risk_level: "Low",
    nbl_flag: false,
    distance_to_nearest: 12.4,
    nearest_facility: "GAR Jambi Refinery",
    scenario_tags: ["facility-driven"],
    recommendation: "Yes",
    traceability_level: "100% traceable to mill",
    ffb_source_own_pct: 60,
    ffb_source_plasma_pct: 30,
    ffb_source_independent_pct: 10,
    ffb_source_comment: "Dominantly own estate with small plasma contribution.",
    recommendation_notes: "Mill complies with NDPE; no peat or deforestation detected.",
    ndpe_violation_found: false,
    public_grievance_flag: false,
    deforestation_alerts: 0,
    hotspot_alerts: 0,
    peat_presence: "Low",
    approval_by: "Sustainability Head",
    approved_date: "2024-06-20",
    asana_task_id: "ASANA_12345",
    eligibility_status: "Eligible",
    current_asana_task_url: "https://app.asana.com/0/123/001",
    current_eval_doc_url: "https://docs.example.com/eval_001.pdf",
    attachment_url: "https://drive.google.com/sample_eval_form.pdf"
  },
  {
    mill_id: "PO1000003",
    mill_name: "Kalimantan Sustainable Mills",
    parent_group: "GAR Internal",
    group_engagement: "Active",
    region: "Kalimantan",
    province_en: "East Kalimantan",
    island: "Kalimantan",
    latitude: -0.5024,
    longitude: 117.1536,
    evaluation_status: "Eligible",
    current_evaluation_id: "EVAL2024_003",
    last_eval_date: "2024-09-10",
    valid_until: "2026-03-20",
    status_validity: "Valid",
    risk_level: "Low",
    nbl_flag: false,
    distance_to_nearest: 45.2,
    nearest_facility: "GAR Kalimantan Hub",
    scenario_tags: ["facility-driven", "renewal"],
    recommendation: "Yes",
    traceability_level: "100% traceable to plantation",
    ffb_source_own_pct: 85,
    ffb_source_plasma_pct: 15,
    ffb_source_independent_pct: 0,
    ffb_source_comment: "GAR internal operations with excellent control. All FFB from own estates and verified plasma.",
    recommendation_notes: "Excellent compliance record. Internal mill with full traceability. Zero deforestation risk.",
    ndpe_violation_found: false,
    public_grievance_flag: false,
    deforestation_alerts: 0,
    hotspot_alerts: 0,
    peat_presence: "None",
    approval_by: "SSP Head",
    approved_date: "2024-09-15",
    asana_task_id: "ASANA_12346",
    eligibility_status: "Eligible",
    current_asana_task_url: "https://app.asana.com/0/123/003",
    current_eval_doc_url: "https://docs.example.com/eval_003.pdf",
    attachment_url: "https://drive.google.com/eval_003.pdf"
  },
  {
    mill_id: "PO1000005",
    mill_name: "East Coast Palm Solutions",
    parent_group: "Sustainable Palm Industries",
    group_engagement: "Active",
    region: "Jambi",
    province_en: "Jambi",
    island: "Sumatra",
    latitude: -1.4852,
    longitude: 103.3838,
    evaluation_status: "Eligible",
    current_evaluation_id: "EVAL2024_005",
    last_eval_date: "2024-07-30",
    valid_until: "2026-08-15",
    status_validity: "Valid",
    risk_level: "Low",
    nbl_flag: false,
    distance_to_nearest: 28.7,
    nearest_facility: "GAR Jambi Refinery",
    scenario_tags: ["facility-driven"],
    recommendation: "Yes",
    traceability_level: "95% traceable to plantation",
    ffb_source_own_pct: 55,
    ffb_source_plasma_pct: 35,
    ffb_source_independent_pct: 10,
    ffb_source_comment: "Strong supplier relationships with verification systems in place.",
    recommendation_notes: "Good compliance track record. Robust monitoring system for independent suppliers.",
    ndpe_violation_found: false,
    public_grievance_flag: false,
    deforestation_alerts: 0,
    hotspot_alerts: 0,
    peat_presence: "Low",
    approval_by: "Supplier Compliance Head",
    approved_date: "2024-08-05",
    asana_task_id: "ASANA_12347",
    eligibility_status: "Eligible",
    current_asana_task_url: "https://app.asana.com/0/123/005",
    current_eval_doc_url: "https://docs.example.com/eval_005.pdf",
    attachment_url: "https://drive.google.com/eval_005.pdf"
  },

  // 🟥 NBL MILLS (2)
  {
    mill_id: "PO1000002",
    mill_name: "Sumatra Agri Mill",
    parent_group: "Wilmar Group",
    group_engagement: "Suspended",
    region: "Riau",
    province_en: "Riau",
    island: "Sumatra",
    latitude: 0.2933,
    longitude: 101.7068,
    evaluation_status: "Not Eligible (NBL)",
    current_evaluation_id: "EVAL2024_002",
    last_eval_date: "2024-11-20",
    valid_until: "2024-12-15",
    status_validity: "Expired",
    risk_level: "High",
    nbl_flag: true,
    nbl_reason: "NDPE Violation - Deforestation",
    nbl_date_added: "2024-11-20",
    distance_to_nearest: 18.9,
    nearest_facility: "GAR Riau Processing",
    scenario_tags: ["competitor-check"],
    recommendation: "No",
    traceability_level: "Limited traceability - 60% to plantation",
    ffb_source_own_pct: 40,
    ffb_source_plasma_pct: 20,
    ffb_source_independent_pct: 40,
    ffb_source_comment: "High independent sourcing with limited traceability. Multiple unverified suppliers.",
    recommendation_notes: "CRITICAL: Deforestation detected in supply shed. Public grievance case active. Mill fails NDPE requirements. NOT ELIGIBLE for procurement.",
    ndpe_violation_found: true,
    public_grievance_flag: true,
    deforestation_alerts: 5,
    hotspot_alerts: 3,
    peat_presence: "High",
    approval_by: "SSP Head",
    approved_date: "2024-11-22",
    asana_task_id: "ASANA_12348",
    eligibility_status: "Not Eligible",
    current_asana_task_url: "https://app.asana.com/0/123/002",
    current_eval_doc_url: "https://docs.example.com/eval_002.pdf",
    attachment_url: "https://drive.google.com/eval_002.pdf",
    competitor_flag: true
  },
  {
    mill_id: "PO1000006",
    mill_name: "Northern Territory Mill",
    parent_group: "Wilmar Group",
    group_engagement: "Suspended",
    region: "Riau",
    province_en: "Riau",
    island: "Sumatra",
    latitude: 1.0456,
    longitude: 101.4479,
    evaluation_status: "Not Eligible (NBL)",
    current_evaluation_id: "EVAL2024_006",
    last_eval_date: "2024-10-15",
    valid_until: "2024-11-30",
    risk_level: "High",
    nbl_flag: true,
    nbl_reason: "NDPE Violation - Peat Development",
    nbl_date_added: "2024-10-15",
    distance_to_nearest: 62.1,
    nearest_facility: "GAR Riau Processing",
    scenario_tags: ["competitor-check"],
    recommendation: "No",
    traceability_level: "Low",
    ffb_source_own_pct: 50,
    ffb_source_plasma_pct: 30,
    ffb_source_independent_pct: 20,
    ndpe_violation_found: true,
    public_grievance_flag: false,
    deforestation_alerts: 8,
    hotspot_alerts: 2,
    current_asana_task_url: "https://app.asana.com/0/123/006",
    current_eval_doc_url: "https://docs.example.com/eval_006.pdf",
    competitor_flag: true
  },

  // 🟨 EXPIRED / EXPIRING SOON (2)
  {
    mill_id: "PO1000009",
    mill_name: "Expired Mill Alpha",
    parent_group: "Independent Supplier",
    group_engagement: "Active",
    region: "Sumatra",
    province_en: "South Sumatra",
    island: "Sumatra",
    latitude: -2.3307,
    longitude: 99.8453,
    evaluation_status: "Expired",
    current_evaluation_id: "EVAL2023_009",
    last_eval_date: "2023-08-15",
    valid_until: "2024-08-15",
    risk_level: "Low",
    nbl_flag: false,
    distance_to_nearest: 189.4,
    nearest_facility: "GAR Jambi Refinery",
    scenario_tags: ["renewal"],
    recommendation: "Yes",
    traceability_level: "High",
    ffb_source_own_pct: 45,
    ffb_source_plasma_pct: 40,
    ffb_source_independent_pct: 15,
    ndpe_violation_found: false,
    public_grievance_flag: false,
    deforestation_alerts: 0,
    hotspot_alerts: 0,
    current_asana_task_url: null,
    current_eval_doc_url: "https://docs.example.com/eval_009.pdf"
  },
  {
    mill_id: "PO1000010",
    mill_name: "Expiring Soon Mill Beta",
    parent_group: "Sustainable Palm Industries",
    group_engagement: "Active",
    region: "Jambi",
    province_en: "Jambi",
    island: "Sumatra",
    latitude: -1.5200,
    longitude: 103.4500,
    evaluation_status: "Expiring Soon",
    current_evaluation_id: "EVAL2024_010",
    last_eval_date: "2024-11-20",
    valid_until: "2025-11-20",
    risk_level: "Low",
    nbl_flag: false,
    distance_to_nearest: 15.3,
    nearest_facility: "GAR Jambi Refinery",
    scenario_tags: ["renewal"],
    recommendation: "Yes",
    traceability_level: "High",
    ffb_source_own_pct: 50,
    ffb_source_plasma_pct: 35,
    ffb_source_independent_pct: 15,
    ndpe_violation_found: false,
    public_grievance_flag: false,
    deforestation_alerts: 0,
    hotspot_alerts: 0,
    current_asana_task_url: "https://app.asana.com/0/123/010",
    current_eval_doc_url: "https://docs.example.com/eval_010.pdf"
  },

  // 🟧 UNDER EVALUATION (2)
  {
    mill_id: "PO1000004",
    mill_name: "Palm Valley Processing",
    parent_group: "Independent Supplier",
    group_engagement: "New",
    region: "Sumatra",
    province_en: "West Sumatra",
    island: "Sumatra",
    latitude: -0.9471,
    longitude: 100.4172,
    evaluation_status: "Under Evaluation",
    current_evaluation_id: null,
    last_eval_date: null,
    valid_until: null,
    risk_level: null,
    nbl_flag: false,
    distance_to_nearest: 156.3,
    nearest_facility: "GAR Jambi Refinery",
    scenario_tags: ["new-supplier"],
    current_asana_task_url: "https://app.asana.com/0/123/004-progress",
    asana_task_id: "ASN-2024-004",
    asana_assigned_to: "Crescentiana P.S.",
    asana_status: "In Progress",
    asana_current_stage: 6,
    asana_current_stage_name: "Spatial Analysis by TRND",
    asana_request_date: "2024-10-05",
    asana_expected_completion: "2024-11-05",
    asana_progress_pct: 55
  },
  {
    mill_id: "PO1000011",
    mill_name: "Under Review Mill Gamma",
    parent_group: "Regional Cooperative",
    group_engagement: "New",
    region: "Kalimantan",
    province_en: "Central Kalimantan",
    island: "Kalimantan",
    latitude: -1.2379,
    longitude: 116.8529,
    evaluation_status: "Under Evaluation",
    current_evaluation_id: null,
    last_eval_date: null,
    valid_until: null,
    risk_level: null,
    nbl_flag: false,
    distance_to_nearest: 78.5,
    nearest_facility: "GAR Kalimantan Hub",
    scenario_tags: ["new-supplier"],
    current_asana_task_url: "https://app.asana.com/0/123/011-progress",
    asana_task_id: "ASN-2024-011",
    asana_assigned_to: "Ayuk Yuliastuti",
    asana_status: "In Progress",
    asana_current_stage: 3,
    asana_current_stage_name: "Sent to Vendor for Completion",
    asana_request_date: "2024-10-15",
    asana_expected_completion: "2024-11-15",
    asana_progress_pct: 27
  },

  // ⚪ NOT EVALUATED (3)
  {
    mill_id: "PO1000012",
    mill_name: "New Supplier Mill Delta",
    parent_group: "Emerging Palm Group",
    group_engagement: "New",
    region: "Riau",
    province_en: "Riau",
    island: "Sumatra",
    latitude: 0.5500,
    longitude: 101.5000,
    evaluation_status: "Not Evaluated",
    current_evaluation_id: null,
    last_eval_date: null,
    valid_until: null,
    risk_level: null,
    nbl_flag: false,
    distance_to_nearest: 45.7,
    nearest_facility: "GAR Riau Processing",
    scenario_tags: ["new-supplier"]
  },
  {
    mill_id: "PO1000013",
    mill_name: "Potential Mill Epsilon",
    parent_group: "Local Supplier Co.",
    group_engagement: "New",
    region: "Jambi",
    province_en: "Jambi",
    island: "Sumatra",
    latitude: -1.6500,
    longitude: 103.7000,
    evaluation_status: "Not Evaluated",
    current_evaluation_id: null,
    last_eval_date: null,
    valid_until: null,
    risk_level: null,
    nbl_flag: false,
    distance_to_nearest: 22.1,
    nearest_facility: "GAR Jambi Refinery",
    scenario_tags: ["new-supplier"]
  },
  {
    mill_id: "PO1000014",
    mill_name: "Competitor Supplier Mill",
    parent_group: "Independent Supplier",
    group_engagement: "Active",
    region: "Sumatra",
    province_en: "North Sumatra",
    island: "Sumatra",
    latitude: 2.1000,
    longitude: 99.5000,
    evaluation_status: "Not Evaluated",
    current_evaluation_id: null,
    last_eval_date: null,
    valid_until: null,
    risk_level: null,
    nbl_flag: false,
    distance_to_nearest: 134.2,
    nearest_facility: "GAR Riau Processing",
    scenario_tags: ["competitor-check"],
    competitor_flag: true,
    competitor_buyer: "Wilmar International"
  }
];

const DEMO_TRANSACTIONS = [
  // Forest Green Palm Mill - GAR + APC
  { mill_id: "PO1000001", buyer_entity: "GAR Trading", buyer_type: "gar", product_type: "CPO", last_verified: "2025-10-20" },
  { mill_id: "PO1000001", buyer_entity: "GAR Trading", buyer_type: "gar", product_type: "PK", last_verified: "2025-10-20" },
  { mill_id: "PO1000001", buyer_entity: "APC", buyer_type: "gar", product_type: "CPO", last_verified: "2025-10-23" },
  
  // Sumatra Agri Mill (NBL) - Wilmar competitor
  { mill_id: "PO1000002", buyer_entity: "Wilmar International", buyer_type: "competitor", product_type: "CPO", last_verified: "2025-09-20" },
  { mill_id: "PO1000002", buyer_entity: "Musim Mas", buyer_type: "competitor", product_type: "PK", last_verified: "2025-09-15" },
  
  // Kalimantan Sustainable Mills - GAR internal
  { mill_id: "PO1000003", buyer_entity: "GAR Trading", buyer_type: "gar", product_type: "CPO", last_verified: "2025-10-18" },
  { mill_id: "PO1000003", buyer_entity: "GAR Trading", buyer_type: "gar", product_type: "PK", last_verified: "2025-10-18" },
  
  // Palm Valley Processing - Under evaluation (no transactions yet)
  
  // East Coast Palm Solutions - GAR + PHG
  { mill_id: "PO1000005", buyer_entity: "GAR Trading", buyer_type: "gar", product_type: "CPO", last_verified: "2025-10-12" },
  { mill_id: "PO1000005", buyer_entity: "PHG", buyer_type: "gar", product_type: "PK", last_verified: "2025-10-10" },
  { mill_id: "PO1000005", buyer_entity: "PHG", buyer_type: "gar", product_type: "CPO", last_verified: "2025-10-10" },
  
  // Northern Territory Mill (NBL) - Wilmar
  { mill_id: "PO1000006", buyer_entity: "Wilmar International", buyer_type: "competitor", product_type: "CPO", last_verified: "2025-10-01" },
  
  // Expired Mill Alpha - Multiple buyers
  { mill_id: "PO1000009", buyer_entity: "GAR Trading", buyer_type: "gar", product_type: "CPO", last_verified: "2024-08-10" },
  { mill_id: "PO1000009", buyer_entity: "APC", buyer_type: "gar", product_type: "PK", last_verified: "2024-08-05" },
  
  // Expiring Soon Mill Beta - GAR + SDG
  { mill_id: "PO1000010", buyer_entity: "GAR Trading", buyer_type: "gar", product_type: "CPO", last_verified: "2025-10-15" },
  { mill_id: "PO1000010", buyer_entity: "SDG", buyer_type: "gar", product_type: "PK", last_verified: "2025-10-14" },
  
  // Under Review Mill Gamma - No transactions yet
  
  // New Supplier Mill Delta - No transactions yet
  
  // Potential Mill Epsilon - No transactions yet
  
  // Competitor Supplier Mill - Wilmar + Musim Mas
  { mill_id: "PO1000014", buyer_entity: "Wilmar International", buyer_type: "competitor", product_type: "CPO", last_verified: "2025-10-22" },
  { mill_id: "PO1000014", buyer_entity: "Wilmar International", buyer_type: "competitor", product_type: "PK", last_verified: "2025-10-22" },
  { mill_id: "PO1000014", buyer_entity: "Musim Mas", buyer_type: "competitor", product_type: "CPO", last_verified: "2025-10-20" }
];

const DEMO_FACILITIES = [
  { facility_id: "FAC001", facility_name: "GAR Jambi Refinery", type: "Refinery", region: "Jambi", code: "Libo" },
  { facility_id: "FAC002", facility_name: "GAR Riau Processing", type: "Processing Plant", region: "Riau", code: "Lubuk Gaung" },
  { facility_id: "FAC003", facility_name: "GAR Kalimantan Hub", type: "Distribution Hub", region: "Kalimantan", code: "Dumai" }
];

// Mill-to-Facility Distance Data (each mill has distances to all facilities, ranked)
const MILL_FACILITY_DISTANCES = [
  // Forest Green Palm Mill (PO1000001)
  { mill_id: "PO1000001", facility_name: "Libo", distance_km: 12.4, ranking: 1 },
  { mill_id: "PO1000001", facility_name: "Lubuk Gaung", distance_km: 89.5, ranking: 2 },
  { mill_id: "PO1000001", facility_name: "Dumai", distance_km: 145.2, ranking: 3 },
  
  // Sumatra Agri Mill (PO1000002)
  { mill_id: "PO1000002", facility_name: "Lubuk Gaung", distance_km: 18.9, ranking: 1 },
  { mill_id: "PO1000002", facility_name: "Dumai", distance_km: 95.3, ranking: 2 },
  { mill_id: "PO1000002", facility_name: "Libo", distance_km: 156.8, ranking: 3 },
  
  // Kalimantan Sustainable Mills (PO1000003)
  { mill_id: "PO1000003", facility_name: "Dumai", distance_km: 45.2, ranking: 1 },
  { mill_id: "PO1000003", facility_name: "Lubuk Gaung", distance_km: 234.7, ranking: 2 },
  { mill_id: "PO1000003", facility_name: "Libo", distance_km: 389.4, ranking: 3 },
  
  // Palm Valley Processing (PO1000004)
  { mill_id: "PO1000004", facility_name: "Libo", distance_km: 156.3, ranking: 1 },
  { mill_id: "PO1000004", facility_name: "Lubuk Gaung", distance_km: 234.5, ranking: 2 },
  { mill_id: "PO1000004", facility_name: "Dumai", distance_km: 289.1, ranking: 3 },
  
  // East Coast Palm Solutions (PO1000005)
  { mill_id: "PO1000005", facility_name: "Libo", distance_km: 28.7, ranking: 1 },
  { mill_id: "PO1000005", facility_name: "Lubuk Gaung", distance_km: 102.4, ranking: 2 },
  { mill_id: "PO1000005", facility_name: "Dumai", distance_km: 167.9, ranking: 3 },
  
  // Northern Territory Mill (PO1000006)
  { mill_id: "PO1000006", facility_name: "Lubuk Gaung", distance_km: 62.1, ranking: 1 },
  { mill_id: "PO1000006", facility_name: "Dumai", distance_km: 134.8, ranking: 2 },
  { mill_id: "PO1000006", facility_name: "Libo", distance_km: 198.5, ranking: 3 },
  
  // Expired Mill Alpha (PO1000009)
  { mill_id: "PO1000009", facility_name: "Libo", distance_km: 189.4, ranking: 1 },
  { mill_id: "PO1000009", facility_name: "Lubuk Gaung", distance_km: 267.3, ranking: 2 },
  { mill_id: "PO1000009", facility_name: "Dumai", distance_km: 312.6, ranking: 3 },
  
  // Expiring Soon Mill Beta (PO1000010)
  { mill_id: "PO1000010", facility_name: "Libo", distance_km: 15.3, ranking: 1 },
  { mill_id: "PO1000010", facility_name: "Lubuk Gaung", distance_km: 93.7, ranking: 2 },
  { mill_id: "PO1000010", facility_name: "Dumai", distance_km: 151.2, ranking: 3 },
  
  // Under Review Mill Gamma (PO1000011)
  { mill_id: "PO1000011", facility_name: "Dumai", distance_km: 78.5, ranking: 1 },
  { mill_id: "PO1000011", facility_name: "Lubuk Gaung", distance_km: 198.4, ranking: 2 },
  { mill_id: "PO1000011", facility_name: "Libo", distance_km: 356.2, ranking: 3 },
  
  // New Supplier Mill Delta (PO1000012)
  { mill_id: "PO1000012", facility_name: "Lubuk Gaung", distance_km: 45.7, ranking: 1 },
  { mill_id: "PO1000012", facility_name: "Dumai", distance_km: 112.3, ranking: 2 },
  { mill_id: "PO1000012", facility_name: "Libo", distance_km: 176.9, ranking: 3 },
  
  // Potential Mill Epsilon (PO1000013)
  { mill_id: "PO1000013", facility_name: "Libo", distance_km: 22.1, ranking: 1 },
  { mill_id: "PO1000013", facility_name: "Lubuk Gaung", distance_km: 98.6, ranking: 2 },
  { mill_id: "PO1000013", facility_name: "Dumai", distance_km: 159.4, ranking: 3 },
  
  // Competitor Supplier Mill (PO1000014)
  { mill_id: "PO1000014", facility_name: "Lubuk Gaung", distance_km: 134.2, ranking: 1 },
  { mill_id: "PO1000014", facility_name: "Dumai", distance_km: 189.7, ranking: 2 },
  { mill_id: "PO1000014", facility_name: "Libo", distance_km: 267.3, ranking: 3 }
];

const ASANA_WORKFLOW_STEPS = [
  { step: 1, name: "New Submission Received", icon: FileText, color: "blue" },
  { step: 2, name: "GSEP Socialization", icon: Users, color: "blue" },
  { step: 3, name: "Sent to Vendor for Completion", icon: Send, color: "blue" },
  { step: 4, name: "Submitted by Vendor", icon: CheckCircle, color: "blue" },
  { step: 5, name: "TTP Verification by TRND", icon: CheckSquare, color: "purple" },
  { step: 6, name: "Spatial Analysis by TRND", icon: MapPin, color: "purple" },
  { step: 7, name: "NDPE IRF by Latam", icon: Activity, color: "green" },
  { step: 8, name: "Non-Spatial Analysis by SAPA", icon: Database, color: "green" },
  { step: 9, name: "Review by SAPA Head", icon: Eye, color: "orange" },
  { step: 10, name: "Review by Supplier Compliance Head", icon: Award, color: "orange" },
  { step: 11, name: "Final Recommendation by SSP Head", icon: Star, color: "green" }
];

const EVALUATION_HISTORY = [
  {
    evaluation_id: "EVAL2024_001",
    mill_id: "PO1000001",
    mill_name: "Forest Green Palm Mill",
    evaluation_date: "2024-06-15",
    valid_until: "2027-06-15",
    risk_level: "Low",
    recommendation: "Yes",
    eligibility_status: "Eligible"
  },
  {
    evaluation_id: "EVAL2024_003",
    mill_id: "PO1000003",
    mill_name: "Kalimantan Sustainable Mills",
    evaluation_date: "2024-09-10",
    valid_until: "2026-03-20",
    risk_level: "Low",
    recommendation: "Yes",
    eligibility_status: "Eligible"
  }
];

// ============================================
// MAIN APP COMPONENT
// ============================================

const App = () => {
  const [view, setView] = useState('dashboard');
  const [selectedMill, setSelectedMill] = useState(null);
  const [mills, setMills] = useState(DEMO_MILLS);
  const [evaluationHistory, setEvaluationHistory] = useState(EVALUATION_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeScenario, setActiveScenario] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [userRole, setUserRole] = useState('Trading Team'); // Role simulation
  const [selectedFacility, setSelectedFacility] = useState('all'); // For facility-driven scenario
  const [filters, setFilters] = useState({
    region: 'all',
    owner: 'all',
    risk: 'all',
    buyer: 'all',
    product: 'all'
  });
  
  // Upload wizard state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [uploadMill, setUploadMill] = useState(null);
  const [uploadData, setUploadData] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);
  
  // Hover tooltip state
  const [hoveredMill, setHoveredMill] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  // Handle buyer column hover
  const handleBuyerHover = (e, mill) => {
    if (mill.buyerDetails && mill.buyerDetails.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({ x: rect.left, y: rect.bottom + 5 });
      setHoveredMill(mill);
    }
  };
  
  const handleBuyerLeave = () => {
    setHoveredMill(null);
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (validUntil) => {
    if (!validUntil) return null;
    const today = new Date();
    const expiryDate = new Date(validUntil);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Enhanced mills with computed properties
  const enrichedMills = useMemo(() => {
    return mills.map(mill => {
      const daysUntilExpiry = getDaysUntilExpiry(mill.valid_until);
      let validityStatus = null;
      
      if (daysUntilExpiry !== null) {
        if (daysUntilExpiry < 0) validityStatus = 'Expired';
        else if (daysUntilExpiry <= 30) validityStatus = 'Expiring Soon';
        else validityStatus = 'Valid';
      }
      
      const transactions = DEMO_TRANSACTIONS.filter(t => t.mill_id === mill.mill_id);
      
      // Compute buyer summary
      const uniqueBuyers = [...new Set(transactions.map(t => t.buyer_entity))];
      const buyerSummary = uniqueBuyers.join(', ');
      const hasCompetitor = transactions.some(t => t.buyer_type === 'competitor');
      
      // Compute product summary
      const uniqueProducts = [...new Set(transactions.map(t => t.product_type))];
      const productSummary = uniqueProducts.join(', ');
      
      // Group transactions by buyer for tooltip
      const buyerProductMap = {};
      transactions.forEach(t => {
        if (!buyerProductMap[t.buyer_entity]) {
          buyerProductMap[t.buyer_entity] = {
            products: new Set(),
            type: t.buyer_type,
            lastVerified: t.last_verified
          };
        }
        buyerProductMap[t.buyer_entity].products.add(t.product_type);
      });
      
      // Convert to array for easier rendering
      const buyerDetails = Object.entries(buyerProductMap).map(([buyer, data]) => ({
        buyer,
        products: Array.from(data.products).join(', '),
        type: data.type,
        lastVerified: data.lastVerified
      }));
      
      // Get facility distances for this mill
      const facilityDistances = MILL_FACILITY_DISTANCES.filter(f => f.mill_id === mill.mill_id);
      
      // Get nearest facility (ranking 1)
      const nearestFacilityData = facilityDistances.find(f => f.ranking === 1);
      const nearestFacilityName = nearestFacilityData?.facility_name || mill.nearest_facility || 'N/A';
      const nearestFacilityDistance = nearestFacilityData?.distance_km || mill.distance_to_nearest || 0;
      
      return {
        ...mill,
        daysUntilExpiry,
        validityStatus,
        transactions,
        buyerSummary: buyerSummary || '-',
        productSummary: productSummary || '-',
        hasCompetitor,
        buyerDetails,
        facilityDistances,
        nearestFacilityName,
        nearestFacilityDistance
      };
    });
  }, [mills]);

  // Statistics
  const statistics = useMemo(() => {
    const total = enrichedMills.length;
    const eligible = enrichedMills.filter(m => m.evaluation_status === 'Eligible').length;
    const underEvaluation = enrichedMills.filter(m => m.evaluation_status === 'Under Evaluation').length;
    const expiringSoon = enrichedMills.filter(m => m.validityStatus === 'Expiring Soon').length;
    const expired = enrichedMills.filter(m => m.validityStatus === 'Expired').length;
    const inNBL = enrichedMills.filter(m => m.nbl_flag).length;
    const notEvaluated = enrichedMills.filter(m => m.evaluation_status === 'Not Evaluated').length;
    const avgDistance = enrichedMills.reduce((sum, m) => sum + (m.distance_to_nearest || 0), 0) / total;
    
    return { total, eligible, underEvaluation, expiringSoon, expired, inNBL, notEvaluated, avgDistance };
  }, [enrichedMills]);

  // Filtered mills based on scenario, tab, and filters
  const filteredMills = useMemo(() => {
    let result = [...enrichedMills];

    // Apply scenario filter
    if (activeScenario !== 'all') {
      result = result.filter(mill => mill.scenario_tags?.includes(activeScenario));
      
      // Special handling for facility-driven scenario with facility selection
      if (activeScenario === 'facility-driven' && selectedFacility !== 'all') {
        // Get mills with their distance to the selected facility
        result = result.map(mill => {
          const facilityData = mill.facilityDistances.find(f => f.facility_name === selectedFacility);
          return {
            ...mill,
            distanceToSelectedFacility: facilityData?.distance_km || Infinity
          };
        });
        
        // Sort by distance to selected facility (ascending)
        result.sort((a, b) => a.distanceToSelectedFacility - b.distanceToSelectedFacility);
        
        // Show only top 3 nearest mills
        result = result.slice(0, 3);
      }
    }

    // Apply tab filter
    if (activeTab === 'eligible') {
      result = result.filter(m => m.evaluation_status === 'Eligible');
    } else if (activeTab === 'under-evaluation') {
      result = result.filter(m => m.evaluation_status === 'Under Evaluation');
    } else if (activeTab === 'expired') {
      result = result.filter(m => m.validityStatus === 'Expired' || m.validityStatus === 'Expiring Soon');
    } else if (activeTab === 'nbl') {
      result = result.filter(m => m.nbl_flag);
    }

    // Apply search
    if (searchQuery) {
      result = result.filter(mill => 
        mill.mill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mill.mill_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.region !== 'all') {
      result = result.filter(mill => mill.region === filters.region);
    }
    if (filters.owner !== 'all') {
      result = result.filter(mill => mill.parent_group === filters.owner);
    }
    if (filters.risk !== 'all') {
      result = result.filter(mill => mill.risk_level === filters.risk);
    }
    
    // Apply buyer filter
    if (filters.buyer !== 'all') {
      if (filters.buyer === 'gar-only') {
        result = result.filter(mill => mill.transactions.length > 0 && !mill.hasCompetitor);
      } else if (filters.buyer === 'has-competitor') {
        result = result.filter(mill => mill.hasCompetitor);
      } else if (filters.buyer === 'no-transactions') {
        result = result.filter(mill => mill.transactions.length === 0);
      } else {
        // Specific buyer name
        result = result.filter(mill => 
          mill.transactions.some(t => t.buyer_entity === filters.buyer)
        );
      }
    }
    
    // Apply product filter
    if (filters.product !== 'all') {
      // Show all mills trading the selected product
      result = result.filter(mill => 
        mill.transactions.some(t => t.product_type === filters.product)
      );
    }

    return result;
  }, [enrichedMills, activeScenario, activeTab, searchQuery, filters, selectedFacility]);

  // Scenario definitions
  const scenarios = [
    {
      id: 'facility-driven',
      icon: Factory,
      title: 'Facility-Driven',
      description: 'Select facility to find 3 nearest mills for logistics optimization',
      color: 'blue'
    },
    {
      id: 'new-supplier',
      icon: Package,
      title: 'New Supplier',
      description: 'Not evaluated mills for onboarding workflow',
      color: 'green'
    },
    {
      id: 'competitor-check',
      icon: Eye,
      title: 'Competitor Check',
      description: 'Mills currently supplying to competitors',
      color: 'purple'
    },
    {
      id: 'renewal',
      icon: RotateCcw,
      title: 'Contract Renewal',
      description: 'Expired or expiring evaluations requiring renewal',
      color: 'orange'
    }
  ];

  // Tab definitions
  const tabs = [
    { id: 'all', label: 'All Mills', count: statistics.total },
    { id: 'eligible', label: 'Eligible', count: statistics.eligible },
    { id: 'under-evaluation', label: 'Under Evaluation', count: statistics.underEvaluation },
    { id: 'expired', label: 'Expired', count: statistics.expired + statistics.expiringSoon },
    { id: 'nbl', label: 'NBL', count: statistics.inNBL }
  ];

  // Handle request evaluation
  const handleRequestEvaluation = (mill) => {
    const taskId = `ASN-2025-${Math.floor(Math.random() * 9000) + 1000}`;
    const updatedMills = mills.map(m => 
      m.mill_id === mill.mill_id
        ? {
            ...m,
            evaluation_status: 'Under Evaluation',
            asana_task_id: taskId,
            asana_assigned_to: 'Crescentiana P.S.',
            asana_status: 'In Progress',
            asana_current_stage: 'Document Collection',
            current_asana_task_url: `https://app.asana.com/0/123/${taskId}`
          }
        : m
    );
    setMills(updatedMills);
    showToast(`Evaluation requested for ${mill.mill_name}. Task ${taskId} created.`, 'success');
  };

  // Handle upload evaluation submission
  const handleUploadSubmit = () => {
    const evalId = `EVAL2025_${Math.floor(Math.random() * 9000) + 1000}`;
    const today = new Date().toISOString().split('T')[0];
    
    const updatedMills = mills.map(m => 
      m.mill_id === uploadMill.mill_id
        ? {
            ...m,
            evaluation_status: uploadData.recommendation === 'Yes' && !uploadData.ndpe_violation_found && !uploadData.public_grievance_flag ? 'Eligible' : 'Not Eligible',
            current_evaluation_id: evalId,
            last_eval_date: today,
            valid_until: uploadData.valid_until,
            risk_level: uploadData.risk_level,
            recommendation: uploadData.recommendation,
            traceability_level: uploadData.traceability_level,
            ffb_source_own_pct: uploadData.ffb_source_own_pct,
            ffb_source_plasma_pct: uploadData.ffb_source_plasma_pct,
            ffb_source_independent_pct: uploadData.ffb_source_independent_pct,
            ndpe_violation_found: uploadData.ndpe_violation_found,
            public_grievance_flag: uploadData.public_grievance_flag,
            deforestation_alerts: uploadData.deforestation_alerts,
            hotspot_alerts: uploadData.hotspot_alerts,
            current_eval_doc_url: `https://docs.example.com/${evalId}.pdf`
          }
        : m
    );
    
    setMills(updatedMills);
    
    const newHistoryEntry = {
      evaluation_id: evalId,
      mill_id: uploadMill.mill_id,
      mill_name: uploadMill.mill_name,
      evaluation_date: today,
      valid_until: uploadData.valid_until,
      risk_level: uploadData.risk_level,
      recommendation: uploadData.recommendation,
      eligibility_status: uploadData.recommendation === 'Yes' ? 'Eligible' : 'Not Eligible'
    };
    
    setEvaluationHistory([newHistoryEntry, ...evaluationHistory]);
    
    setUploadModalOpen(false);
    setUploadStep(1);
    setUploadMill(null);
    setUploadData({});
    
    showToast(`Evaluation uploaded successfully for ${uploadMill.mill_name}!`, 'success');
    
    // Auto navigate to mill detail
    const updatedMill = updatedMills.find(m => m.mill_id === uploadMill.mill_id);
    setSelectedMill(updatedMill);
    setView('detail');
  };

  // Reset demo data
  const handleResetDemo = () => {
    setMills(DEMO_MILLS);
    setEvaluationHistory(EVALUATION_HISTORY);
    setActiveScenario('all');
    setActiveTab('all');
    setSearchQuery('');
    setSelectedFacility('all');
    setFilters({ region: 'all', owner: 'all', risk: 'all', buyer: 'all', product: 'all' });
    // Note: userRole is NOT reset - user's role selection is preserved
    showToast('Demo data reset successfully!', 'success');
  };

  // Badge color helper
  const getStatusBadgeColor = (status) => {
    const colors = {
      'Eligible': 'bg-green-100 text-green-800 border-green-300',
      'Under Evaluation': 'bg-orange-100 text-orange-800 border-orange-300',
      'Expired': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Expiring Soon': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Not Eligible': 'bg-red-100 text-red-800 border-red-300',
      'Not Eligible (NBL)': 'bg-red-100 text-red-800 border-red-400',
      'Not Evaluated': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // ============================================
  // UPLOAD WIZARD MODAL
  // ============================================
  const UploadWizard = () => {
    const simulateParsing = () => {
      setIsUploading(true);
      setTimeout(() => {
        setUploadData({
          recommendation: 'Yes',
          risk_level: 'Low',
          valid_until: '2027-06-15',
          traceability_level: 'High',
          ndpe_violation_found: false,
          public_grievance_flag: false,
          deforestation_alerts: 0,
          hotspot_alerts: 0,
          ffb_source_own_pct: 55,
          ffb_source_plasma_pct: 35,
          ffb_source_independent_pct: 10
        });
        setIsUploading(false);
        setUploadStep(3);
      }, 2000);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Upload Mill Evaluation</h2>
            <p className="text-sm text-gray-600 mt-1">Step {uploadStep} of 4</p>
          </div>

          <div className="p-6">
            {uploadStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Mill</label>
                  <select 
                    value={uploadMill?.mill_id || ''}
                    onChange={(e) => {
                      const mill = mills.find(m => m.mill_id === e.target.value);
                      setUploadMill(mill);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a mill...</option>
                    {mills.map(mill => (
                      <option key={mill.mill_id} value={mill.mill_id}>
                        {mill.mill_name} - {mill.mill_id}
                      </option>
                    ))}
                  </select>
                </div>
                {uploadMill && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900"><strong>Mill:</strong> {uploadMill.mill_name}</p>
                    <p className="text-sm text-blue-900"><strong>Region:</strong> {uploadMill.region}</p>
                    <p className="text-sm text-blue-900"><strong>Status:</strong> {uploadMill.evaluation_status}</p>
                  </div>
                )}
              </div>
            )}

            {uploadStep === 2 && (
              <div className="space-y-4">
                <div 
                  onClick={simulateParsing}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-900 font-medium">AI Processing Document...</p>
                      <p className="text-sm text-gray-600 mt-2">Extracting evaluation data</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-900 font-medium mb-2">Drop evaluation form here or click to browse</p>
                      <p className="text-sm text-gray-600">Supports PDF, DOCX, Excel</p>
                    </>
                  )}
                </div>

                {!isUploading && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">AI will automatically extract:</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                      <div>• Recommendation (Yes/No)</div>
                      <div>• Risk Level (High/Low)</div>
                      <div>• Valid Until Date</div>
                      <div>• NDPE Violations</div>
                      <div>• Public Grievances</div>
                      <div>• FFB Source Distribution</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {uploadStep === 3 && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-900">Data extracted successfully! Please review:</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation</label>
                    <select 
                      value={uploadData.recommendation}
                      onChange={(e) => setUploadData({...uploadData, recommendation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                    <select 
                      value={uploadData.risk_level}
                      onChange={(e) => setUploadData({...uploadData, risk_level: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Low">Low</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                    <input 
                      type="date" 
                      value={uploadData.valid_until}
                      onChange={(e) => setUploadData({...uploadData, valid_until: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Traceability</label>
                    <select 
                      value={uploadData.traceability_level}
                      onChange={(e) => setUploadData({...uploadData, traceability_level: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={uploadData.ndpe_violation_found}
                      onChange={(e) => setUploadData({...uploadData, ndpe_violation_found: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">NDPE Violation Found</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={uploadData.public_grievance_flag}
                      onChange={(e) => setUploadData({...uploadData, public_grievance_flag: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Public Grievance</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">FFB Source Distribution</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-600">Own %</label>
                      <input 
                        type="number" 
                        value={uploadData.ffb_source_own_pct}
                        onChange={(e) => setUploadData({...uploadData, ffb_source_own_pct: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Plasma %</label>
                      <input 
                        type="number" 
                        value={uploadData.ffb_source_plasma_pct}
                        onChange={(e) => setUploadData({...uploadData, ffb_source_plasma_pct: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Independent %</label>
                      <input 
                        type="number" 
                        value={uploadData.ffb_source_independent_pct}
                        onChange={(e) => setUploadData({...uploadData, ffb_source_independent_pct: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deforestation Alerts</label>
                    <input 
                      type="number" 
                      value={uploadData.deforestation_alerts}
                      onChange={(e) => setUploadData({...uploadData, deforestation_alerts: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotspot Alerts</label>
                    <input 
                      type="number" 
                      value={uploadData.hotspot_alerts}
                      onChange={(e) => setUploadData({...uploadData, hotspot_alerts: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {uploadStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Submission</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm"><strong>Mill:</strong> {uploadMill.mill_name}</p>
                  <p className="text-sm"><strong>Recommendation:</strong> {uploadData.recommendation}</p>
                  <p className="text-sm"><strong>Risk Level:</strong> {uploadData.risk_level}</p>
                  <p className="text-sm"><strong>Valid Until:</strong> {uploadData.valid_until}</p>
                  <p className="text-sm"><strong>Eligibility:</strong> {uploadData.recommendation === 'Yes' && !uploadData.ndpe_violation_found ? 'Eligible' : 'Not Eligible'}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">⚠️ This will:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Update mill status to "{uploadData.recommendation === 'Yes' ? 'Eligible' : 'Not Eligible'}"</li>
                    <li>• Create new evaluation record</li>
                    <li>• Add entry to Evaluation History</li>
                    <li>• Notify trading team</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-between">
            <div>
              {uploadStep > 1 && (
                <button
                  onClick={() => setUploadStep(uploadStep - 1)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  ← Back
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setUploadStep(1);
                  setUploadMill(null);
                  setUploadData({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              {uploadStep === 1 && uploadMill && (
                <button 
                  onClick={() => setUploadStep(2)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next →
                </button>
              )}
              {uploadStep === 3 && (
                <button 
                  onClick={() => setUploadStep(4)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next →
                </button>
              )}
              {uploadStep === 4 && (
                <button 
                  onClick={handleUploadSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  ✓ Submit & Update
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // EVALUATION HISTORY VIEW
  // ============================================
  if (view === 'history') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-full mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-xl font-bold text-gray-900">Evaluation History</h1>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    userRole === 'Sustainability Team' 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-blue-100 text-blue-700 border border-blue-300'
                  }`}>
                    {userRole}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{evaluationHistory.length} evaluations completed</p>
              </div>
              <button
                onClick={() => setView('dashboard')}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-6 py-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mill</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eval Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommendation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Fix: Renamed 'eval' to 'evaluation' to avoid conflict with reserved keyword. */}
                {evaluationHistory.map(evaluation => (
                  <tr key={evaluation.evaluation_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{evaluation.mill_name}</div>
                      <div className="text-xs text-gray-500">{evaluation.mill_id}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{evaluation.evaluation_date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{evaluation.valid_until}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        evaluation.risk_level === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {evaluation.risk_level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{evaluation.recommendation}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(evaluation.eligibility_status)}`}>
                        {evaluation.eligibility_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // SETTINGS VIEW
  // ============================================
  if (view === 'settings') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-full mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">Settings</h1>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  userRole === 'Sustainability Team' 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-blue-100 text-blue-700 border border-blue-300'
                }`}>
                  {userRole}
                </span>
              </div>
              <button
                onClick={() => setView('dashboard')}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings & Configuration</h2>
            <p className="text-sm text-gray-600 mb-6">This is a demo application with no backend or database.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Simulation</label>
                <select 
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Trading Team</option>
                  <option>Sustainability Team</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">For demo purposes only</p>
                
                {/* Role indicator */}
                <div className={`mt-3 p-3 rounded-lg ${
                  userRole === 'Sustainability Team' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <p className={`text-sm font-medium ${
                    userRole === 'Sustainability Team' ? 'text-green-900' : 'text-blue-900'
                  }`}>
                    Current Role: {userRole}
                  </p>
                  {userRole === 'Sustainability Team' ? (
                    <p className="text-xs text-green-700 mt-1">✓ You can upload evaluation forms</p>
                  ) : (
                    <p className="text-xs text-blue-700 mt-1">• You can request evaluations and view reports</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleResetDemo}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Demo Data
                </button>
                <p className="text-xs text-gray-500 mt-2">Restores original mock data and clears all changes</p>
              </div>

              <div className="pt-4 border-t border-gray-200 bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>ℹ️ Demo Information</strong>
                </p>
                <ul className="text-xs text-blue-800 mt-2 space-y-1">
                  <li>• 12 curated mills covering all scenarios</li>
                  <li>• Data changes persist during session only</li>
                  <li>• Refresh page to reset to original state</li>
                  <li>• Perfect for live demonstrations</li>
                  <li>• Role-based access control simulation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ASANA WORKFLOW TRACKER VIEW
  // ============================================
  if (view === 'asana-workflow' && selectedMill) {
    const currentStep = selectedMill.asana_current_stage || 1;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-full mx-auto px-6 py-3">
            <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
              <button onClick={() => setView('dashboard')} className="hover:text-blue-600">Dashboard</button>
              <span>→</span>
              <span className="text-gray-900 font-medium">Evaluation Progress</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">{selectedMill.mill_name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  userRole === 'Sustainability Team' 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-blue-100 text-blue-700 border border-blue-300'
                }`}>
                  {userRole}
                </span>
              </div>
              <button
                onClick={() => setView('dashboard')}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-6 py-6">
          {/* Status Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold text-blue-900">Evaluation In Progress</p>
                  <p className="text-sm text-blue-700">
                    Requested: {selectedMill.asana_request_date} • Expected completion: {selectedMill.asana_expected_completion}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">{selectedMill.asana_progress_pct}%</p>
                <p className="text-xs text-blue-700">Complete</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${selectedMill.asana_progress_pct}%` }}
              ></div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Asana Workflow Progress</h2>
            
            <div className="space-y-4">
              {ASANA_WORKFLOW_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = step.step < currentStep;
                const isCurrent = step.step === currentStep;
                const isPending = step.step > currentStep;

                return (
                  <div key={step.step} className="relative">
                    {/* Connector Line */}
                    {idx < ASANA_WORKFLOW_STEPS.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200">
                        {isCompleted && <div className="w-full bg-green-500 h-full"></div>}
                      </div>
                    )}

                    {/* Step Card */}
                    <div className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all ${
                      isCurrent ? 'border-blue-500 bg-blue-50' :
                      isCompleted ? 'border-green-500 bg-green-50' :
                      'border-gray-200 bg-white'
                    }`}>
                      {/* Icon Circle */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        isCompleted ? 'bg-green-500 border-green-500' :
                        isCurrent ? 'bg-blue-500 border-blue-500' :
                        'bg-gray-100 border-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <StepIcon className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-semibold ${
                            isCurrent ? 'text-blue-900' :
                            isCompleted ? 'text-green-900' :
                            'text-gray-500'
                          }`}>
                            {step.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isCompleted ? 'bg-green-100 text-green-800 border border-green-300' :
                            isCurrent ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                            'bg-gray-100 text-gray-600 border border-gray-300'
                          }`}>
                            {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                          </span>
                        </div>
                        
                        {isCurrent && (
                          <div className="mt-2 text-sm text-blue-700">
                            <p className="font-medium">Currently working on this step</p>
                            <p className="text-xs mt-1">Assigned to: {selectedMill.asana_assigned_to}</p>
                          </div>
                        )}

                        {isCompleted && (
                          <p className="text-xs text-green-700 mt-1">✓ Step completed successfully</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Task Details</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Task ID</p>
                    <p className="font-mono text-sm text-gray-900">{selectedMill.asana_task_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Stage</p>
                    <p className="text-sm font-medium text-gray-900">{selectedMill.asana_current_stage_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Request Date</p>
                    <p className="text-sm text-gray-900">{selectedMill.asana_request_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected Completion</p>
                    <p className="text-sm text-gray-900">{selectedMill.asana_expected_completion}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <a 
                    href={selectedMill.current_asana_task_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Open in Asana
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Assignment</h2>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Assigned To</p>
                    <p className="font-medium text-gray-900">{selectedMill.asana_assigned_to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                      {selectedMill.asana_status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Mill Info</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mill ID</span>
                    <span className="font-mono text-gray-900">{selectedMill.mill_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Region</span>
                    <span className="text-gray-900">{selectedMill.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Owner</span>
                    <span className="text-gray-900">{selectedMill.parent_group}</span>
                  </div>
                </div>
              </div>

              {/* Upload Button for Sustainability Team */}
              {userRole === 'Sustainability Team' ? (
                <button
                  onClick={() => {
                    setUploadMill(selectedMill);
                    setUploadModalOpen(true);
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Evaluation Form
                </button>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 font-medium mb-1">📋 Trading Team View</p>
                  <p className="text-xs text-blue-700">
                    You're viewing progress as Trading Team. Only Sustainability Team can upload evaluation forms.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // EVALUATION DETAIL VIEW
  // ============================================
  if (view === 'evaluation-detail' && selectedMill) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-full mx-auto px-6 py-3">
            <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
              <button onClick={() => setView('dashboard')} className="hover:text-blue-600">Dashboard</button>
              <span>→</span>
              <span className="text-gray-900 font-medium">Evaluation Report</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">{selectedMill.mill_name} - Evaluation Report</h1>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  userRole === 'Sustainability Team' 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-blue-100 text-blue-700 border border-blue-300'
                }`}>
                  {userRole}
                </span>
              </div>
              <button
                onClick={() => setView('dashboard')}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-6 py-6">
          {/* Evaluation Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedMill.mill_name}</h2>
                <p className="text-sm text-gray-600 mt-1">Evaluation ID: {selectedMill.current_evaluation_id}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 ${
                  selectedMill.eligibility_status === 'Eligible' 
                    ? 'bg-green-100 text-green-800 border-green-400' 
                    : 'bg-red-100 text-red-800 border-red-400'
                }`}>
                  {selectedMill.eligibility_status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-600">Evaluation Date</p>
                <p className="text-sm font-semibold text-gray-900">{selectedMill.last_eval_date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Valid Until</p>
                <p className="text-sm font-semibold text-gray-900">{selectedMill.valid_until}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Status Validity</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedMill.status_validity === 'Valid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedMill.status_validity}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600">Risk Level</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedMill.risk_level === 'Low' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedMill.risk_level} Risk
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recommendation */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendation</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Final Recommendation</span>
                    <span className={`px-4 py-1.5 rounded-full font-semibold ${
                      selectedMill.recommendation === 'Yes' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedMill.recommendation}
                    </span>
                  </div>
                  {selectedMill.recommendation_notes && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Notes:</p>
                      <p className="text-sm text-blue-800">{selectedMill.recommendation_notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Traceability & FFB Sourcing */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Traceability & FFB Sourcing</h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Traceability Level</p>
                  <div className="flex items-center">
                    <div className="flex-1 bg-green-100 rounded-full h-8 flex items-center justify-center">
                      <span className="text-sm font-semibold text-green-800">{selectedMill.traceability_level}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-3">FFB Source Distribution</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">Own Estate</span>
                        <span className="text-sm font-semibold text-gray-900">{selectedMill.ffb_source_own_pct}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full" 
                          style={{ width: `${selectedMill.ffb_source_own_pct}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">Plasma Smallholder</span>
                        <span className="text-sm font-semibold text-gray-900">{selectedMill.ffb_source_plasma_pct}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-600 h-3 rounded-full" 
                          style={{ width: `${selectedMill.ffb_source_plasma_pct}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">Independent Supplier</span>
                        <span className="text-sm font-semibold text-gray-900">{selectedMill.ffb_source_independent_pct}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-yellow-600 h-3 rounded-full" 
                          style={{ width: `${selectedMill.ffb_source_independent_pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedMill.ffb_source_comment && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 italic">{selectedMill.ffb_source_comment}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Environmental & Compliance */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental & Compliance</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">NDPE Violation</span>
                      {selectedMill.ndpe_violation_found ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className={`text-lg font-bold mt-1 ${
                      selectedMill.ndpe_violation_found ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {selectedMill.ndpe_violation_found ? 'Found' : 'None'}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Public Grievance</span>
                      {selectedMill.public_grievance_flag ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className={`text-lg font-bold mt-1 ${
                      selectedMill.public_grievance_flag ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {selectedMill.public_grievance_flag ? 'Yes' : 'No'}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Deforestation Alerts</span>
                    <p className={`text-2xl font-bold mt-1 ${
                      selectedMill.deforestation_alerts === 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedMill.deforestation_alerts}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Hotspot Alerts</span>
                    <p className={`text-2xl font-bold mt-1 ${
                      selectedMill.hotspot_alerts === 0 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {selectedMill.hotspot_alerts}
                    </p>
                  </div>
                </div>

                {selectedMill.peat_presence && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Peat Presence</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedMill.peat_presence === 'None' || selectedMill.peat_presence === 'Low'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedMill.peat_presence}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Approval Info */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Approval Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Approved By</p>
                    <p className="font-medium text-gray-900">{selectedMill.approval_by}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Approval Date</p>
                    <p className="text-sm text-gray-900">{selectedMill.approved_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Asana Task</p>
                    <p className="font-mono text-xs text-gray-900">{selectedMill.asana_task_id}</p>
                  </div>
                </div>
              </div>

              {/* Mill Information */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Mill Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-600">Mill ID</p>
                    <p className="font-mono text-gray-900">{selectedMill.mill_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Owner Group</p>
                    <p className="text-gray-900">{selectedMill.parent_group}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Region</p>
                    <p className="text-gray-900">{selectedMill.region}, {selectedMill.island}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Nearest Facility</p>
                    <p className="text-gray-900">{selectedMill.nearest_facility}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Distance</p>
                    <p className="text-gray-900">{selectedMill.distance_to_nearest} km</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Documents</h3>
                <div className="space-y-2">
                  {selectedMill.attachment_url && (
                    <a
                      href={selectedMill.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-600 mr-2" />
                        <span className="text-sm text-gray-900">Evaluation Form</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                  {selectedMill.current_asana_task_url && (
                    <a
                      href={selectedMill.current_asana_task_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <CheckSquare className="w-5 h-5 text-gray-600 mr-2" />
                        <span className="text-sm text-gray-900">Asana Task</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedMill(null);
                      setView('detail');
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View Full Mill Detail
                  </button>
                  <button
                    onClick={() => setView('history')}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // MILL DETAIL VIEW
  // ============================================
  if (view === 'detail' && selectedMill) {
    const [expandedSection, setExpandedSection] = useState('evaluation');

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-full mx-auto px-6 py-3">
            <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
              <button onClick={() => setView('dashboard')} className="hover:text-blue-600">Dashboard</button>
              <span>→</span>
              <span className="text-gray-900 font-medium">{selectedMill.mill_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900">{selectedMill.mill_name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  userRole === 'Sustainability Team' 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-blue-100 text-blue-700 border border-blue-300'
                }`}>
                  {userRole}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {selectedMill.validityStatus && (
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusBadgeColor(selectedMill.validityStatus)}`}>
                    {selectedMill.validityStatus}
                    {selectedMill.daysUntilExpiry >= 0 && ` (${selectedMill.daysUntilExpiry} days)`}
                  </span>
                )}
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusBadgeColor(selectedMill.evaluation_status)}`}>
                  {selectedMill.evaluation_status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Mill Information */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Mill Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mill ID</p>
                    <p className="font-mono text-sm text-gray-900">{selectedMill.mill_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Owner Group</p>
                    <p className="font-medium text-sm text-gray-900">{selectedMill.parent_group}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Region</p>
                    <p className="font-medium text-sm text-gray-900">{selectedMill.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Island</p>
                    <p className="font-medium text-sm text-gray-900">{selectedMill.island}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Distance to Nearest</p>
                    <p className="font-medium text-sm text-gray-900">{selectedMill.distance_to_nearest} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nearest Facility</p>
                    <p className="font-medium text-sm text-gray-900">{selectedMill.nearest_facility}</p>
                  </div>
                </div>
              </div>

              {/* Evaluation Summary (Accordion) */}
              {selectedMill.current_evaluation_id && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'evaluation' ? '' : 'evaluation')}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                  >
                    <span className="font-semibold text-gray-900">Evaluation Summary</span>
                    {expandedSection === 'evaluation' ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  {expandedSection === 'evaluation' && (
                    <div className="px-4 pb-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-600">Risk Level</p>
                          <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            selectedMill.risk_level === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {selectedMill.risk_level}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Recommendation</p>
                          <p className="font-medium text-sm text-gray-900 mt-1">{selectedMill.recommendation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Traceability</p>
                          <p className="font-medium text-sm text-gray-900 mt-1">{selectedMill.traceability_level}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Valid Until</p>
                          <p className="font-medium text-sm text-gray-900 mt-1">{selectedMill.valid_until}</p>
                        </div>
                      </div>

                      {/* FFB Source Distribution */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">FFB Source Distribution</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Own</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${selectedMill.ffb_source_own_pct}%` }}></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-12 text-right">{selectedMill.ffb_source_own_pct}%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Plasma</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${selectedMill.ffb_source_plasma_pct}%` }}></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-12 text-right">{selectedMill.ffb_source_plasma_pct}%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Independent</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${selectedMill.ffb_source_independent_pct}%` }}></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 w-12 text-right">{selectedMill.ffb_source_independent_pct}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Alerts */}
                      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Deforestation Alerts</p>
                          <p className={`font-medium text-sm mt-1 ${selectedMill.deforestation_alerts === 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedMill.deforestation_alerts}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hotspot Alerts</p>
                          <p className={`font-medium text-sm mt-1 ${selectedMill.hotspot_alerts === 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedMill.hotspot_alerts}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Trading Activity - Simple One-Liner */}
              {selectedMill.transactions && selectedMill.transactions.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-gray-600" />
                    Trading Activity
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Active Buyers:</span>
                      <span className={`font-medium ${selectedMill.hasCompetitor ? 'text-red-600' : 'text-gray-900'}`}>
                        {selectedMill.buyerSummary}
                        {selectedMill.hasCompetitor && (
                          <AlertTriangle className="w-3 h-3 inline ml-1 text-red-500" />
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Products:</span>
                      <span className="font-medium text-gray-900">{selectedMill.productSummary}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Transaction:</span>
                      <span className="text-gray-900">
                        {selectedMill.transactions[0]?.last_verified || 'N/A'}
                      </span>
                    </div>
                    {selectedMill.hasCompetitor && (
                      <div className="mt-3 pt-3 border-t border-red-200 bg-red-50 rounded p-2">
                        <p className="text-sm text-red-800 font-medium">⚠️ Currently supplying to competitor</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* NBL Warning */}
              {selectedMill.nbl_flag && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg shadow-sm p-4">
                  <div className="flex items-center mb-2">
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    <h2 className="text-base font-semibold text-red-900">No Buy List (NBL)</h2>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-red-700 font-medium">Reason</p>
                      <p className="text-sm text-red-900 mt-1">{selectedMill.nbl_reason}</p>
                    </div>
                    <div>
                      <p className="text-sm text-red-700 font-medium">Date Added</p>
                      <p className="text-sm text-red-900 mt-1">{selectedMill.nbl_date_added}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <p className="text-sm text-red-800 font-medium">⚠️ This mill is NOT ELIGIBLE for trading</p>
                  </div>
                </div>
              )}

              {/* Evaluation Status */}
              {selectedMill.current_asana_task_url && (
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Evaluation Status</h2>
                  <div className="space-y-3">
                    {selectedMill.asana_task_id && (
                      <div>
                        <p className="text-sm text-gray-600">Task ID</p>
                        <p className="font-mono text-sm text-gray-900 mt-1">{selectedMill.asana_task_id}</p>
                      </div>
                    )}
                    {selectedMill.asana_assigned_to && (
                      <div>
                        <p className="text-sm text-gray-600">Assigned To</p>
                        <p className="text-sm text-gray-900 mt-1">{selectedMill.asana_assigned_to}</p>
                      </div>
                    )}
                    {selectedMill.asana_status && (
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(selectedMill.evaluation_status)}`}>
                          {selectedMill.asana_status}
                        </span>
                      </div>
                    )}
                    <a 
                      href={selectedMill.current_asana_task_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mt-2"
                    >
                      Open in Asana
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Actions</h2>
                <div className="space-y-2">
                  {selectedMill.current_evaluation_id && (
                    <button
                      onClick={() => setView('evaluation-detail')}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Evaluation Report
                    </button>
                  )}
                  {selectedMill.current_eval_doc_url && (
                    <a
                      href={selectedMill.current_eval_doc_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 flex items-center justify-center text-sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Doc (External)
                    </a>
                  )}
                  {selectedMill.evaluation_status !== 'Under Evaluation' && (
                    <button
                      onClick={() => handleRequestEvaluation(selectedMill)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Request Re-evaluation
                    </button>
                  )}
                  <button
                    onClick={() => setView('history')}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 flex items-center justify-center text-sm"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    View History
                    </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Stats</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engagement</span>
                    <span className="font-medium text-gray-900">{selectedMill.group_engagement}</span>
                  </div>
                  {selectedMill.last_eval_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Evaluated</span>
                      <span className="font-medium text-gray-900">{selectedMill.last_eval_date}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                setSelectedMill(null);
                setView('dashboard');
              }}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // DASHBOARD VIEW (Main)
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white flex items-center space-x-2`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Buyer Hover Tooltip */}
      {hoveredMill && hoveredMill.buyerDetails && hoveredMill.buyerDetails.length > 0 && (
        <div 
          className="fixed z-50 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 min-w-[280px]"
          style={{ 
            left: `${tooltipPosition.x}px`, 
            top: `${tooltipPosition.y}px`,
            pointerEvents: 'none'
          }}
        >
          <div className="mb-2">
            <p className="text-xs font-semibold text-gray-900 uppercase mb-2">Buyer Breakdown:</p>
          </div>
          <div className="space-y-2">
            {hoveredMill.buyerDetails.map((buyer, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                  buyer.type === 'gar' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    buyer.type === 'gar' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {buyer.buyer}
                    {buyer.type === 'competitor' && (
                      <span className="ml-1 text-xs text-red-600">⚠️</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600">
                    Products: <span className="font-medium">{buyer.products}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Last: {buyer.lastVerified}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">Click mill to view full details</p>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && <UploadWizard />}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">GAR Mill Procurement Intelligence</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-600">
                    {statistics.total} total mills • {filteredMills.length} showing • Demo Version
                  </p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    userRole === 'Sustainability Team' 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-blue-100 text-blue-700 border border-blue-300'
                  }`}>
                    {userRole}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {userRole === 'Sustainability Team' && (
                <button 
                  onClick={() => {
                    setUploadMill(null);
                    setUploadModalOpen(true);
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Upload Evaluation
                </button>
              )}
              <button
                onClick={() => setView('history')}
                className="inline-flex items-center px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                History
              </button>
              <button
                onClick={() => setView('settings')}
                className="inline-flex items-center px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 py-4">
        {/* Scenario Selector */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Select Workflow Scenario</h2>
          <div className="grid grid-cols-4 gap-3">
            {scenarios.map(scenario => {
              const Icon = scenario.icon;
              const isActive = activeScenario === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => {
                    const newScenario = isActive ? 'all' : scenario.id;
                    setActiveScenario(newScenario);
                    // Reset facility selection when changing scenarios
                    if (newScenario !== 'facility-driven') {
                      setSelectedFacility('all');
                    }
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isActive 
                      ? `border-${scenario.color}-500 bg-${scenario.color}-50` 
                      : 'border-gray-