import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, XCircle, Calendar, Users, MapPin, FileText, ExternalLink, Upload, TrendingUp, Package, Navigation, Database, Activity, RefreshCw, Send, Clock, Award, Star, Bell, ArrowRight, CheckSquare, Factory, Droplet, Eye, RotateCcw, ChevronDown, ChevronRight, Settings, FileUp, ArrowLeft, View, Pencil, Trash2, Landmark, Wheat, Building, Target, UserCheck, ShieldAlert, Info, Scale, UploadCloud, Plus } from 'lucide-react';

// --- TYPE DEFINITIONS ---

interface Facility {
    facility_id: string;
    facility_name: string;
    type: string;
    region: string;
    code: string;
}

interface MillFacilityDistance {
    mill_id: string;
    facility_name: string;
    distance_km: number;
    ranking: number;
}

interface Transaction {
    mill_id: string;
    buyer_entity: string;
    buyer_type: 'gar' | 'competitor';
    product_type: 'CPO' | 'PK';
    last_verified: string;
}

interface AsanaWorkflowStep {
    step: number;
    name: string;
    icon: React.ElementType;
    color: string;
}

type EvaluationStatus = 'Eligible' | 'Not Eligible (NBL)' | 'Under Evaluation' | 'Not Evaluated';
type RiskLevel = 'Low' | 'Medium' | 'High' | null;
type SourcingStatus = 'Delivering' | 'Progressing' | 'Commitment & Starting Action' | 'Awareness' | 'Known' | 'Unknown';


interface Mill {
    mill_id: string;
    mill_name: string;
    group?: string;
    company?: string;
    parent_group: string;
    group_engagement: string;
    region: string;
    province_en: string;
    island: string;
    latitude: number;
    longitude: number;
    evaluation_status: EvaluationStatus;
    current_evaluation_id: string | null;
    last_updated: string | null;
    risk_level: RiskLevel;
    sourcing_status: SourcingStatus;
    sourcing_status_last_updated?: string;
    nbl_flag: boolean;
    nbl_reason?: string;
    nbl_date_added?: string;
    distance_to_nearest: number;
    nearest_facility: string;
    scenario_tags: string[];
    capacity_ton_per_hour?: number;
    recommendation?: 'Yes' | 'No';
    traceability_level?: string;
    ffb_source_own_pct?: number;
    ffb_source_plasma_pct?: number;
    ffb_source_independent_pct?: number;
    ffb_source_comment?: string;
    recommendation_notes?: string;
    ndpe_violation_found?: boolean;
    public_grievance_flag?: boolean;
    deforestation_alerts?: number;
    hotspot_alerts?: number;
    peat_presence?: string;
    approval_by?: string;
    approved_date?: string;
    asana_task_id?: string;
    eligibility_status?: 'Eligible' | 'Not Eligible';
    current_asana_task_url?: string | null;
    current_eval_doc_url?: string;
    attachment_url?: string;
    competitor_flag?: boolean;
    competitor_buyer?: string;
    asana_assigned_to?: string;
    asana_status?: string;
    asana_current_stage?: number;
    asana_current_stage_name?: string;
    asana_request_date?: string;
    asana_expected_completion?: string;
    asana_progress_pct?: number;
}

interface EnrichedMill extends Mill {
    transactions: Transaction[];
    buyerSummary: string;
    productSummary: string;
    hasCompetitor: boolean;
    buyerDetails: {
        buyer: string;
        products: string;
        type: 'gar' | 'competitor';
        lastVerified: string;
    }[];
    facilityDistances: MillFacilityDistance[];
    nearestFacilityName: string;
    nearestFacilityDistance: number;
    distanceToSelectedFacility?: number;
}

interface Filters {
    region: string;
    owner: string;
    risk: string;
    buyer: string;
    product: string;
    sourcingStatus: string;
}

interface UploadData {
    recommendation?: 'Yes' | 'No';
    risk_level?: RiskLevel;
    sourcing_status?: SourcingStatus;
    capacity_ton_per_hour?: number;
    traceability_level?: string;
    ndpe_violation_found?: boolean;
    public_grievance_flag?: boolean;
    deforestation_alerts?: number;
    hotspot_alerts?: number;
    ffb_source_own_pct?: number;
    ffb_source_plasma_pct?: number;
    ffb_source_independent_pct?: number;
}

// ============================================
// CURATED DEMO DATA (12 Mills - Story-Driven)
// ============================================

const DEMO_MILLS: Mill[] = [
  // ✅ ELIGIBLE MILLS (5)
  {
    mill_id: "PO1000001",
    mill_name: "Forest Green Palm Mill",
    group: "Jambi Operations",
    company: "Sustainable Palm Industries",
    parent_group: "Sustainable Palm Industries",
    group_engagement: "Active",
    region: "Jambi",
    province_en: "Jambi",
    island: "Sumatra",
    latitude: -1.6101,
    longitude: 103.6131,
    evaluation_status: "Eligible",
    current_evaluation_id: "EVAL2024_001",
    last_updated: "2024-06-15",
    risk_level: "Low",
    nbl_flag: false,
    distance_to_nearest: 12.4,
    nearest_facility: "GAR Jambi Refinery",
    scenario_tags: ["facility-driven"],
    capacity_ton_per_hour: 45,
    recommendation: "Yes",
    traceability_level: "100% traceable to mill",
    sourcing_status: "Progressing",
    sourcing_status_last_updated: "2024-05-10",
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
    group: "Kalimantan Division",
    company: "GAR Internal",
    parent_group: "GAR Internal",
    group_engagement: "Active",
    region: "Kalimantan",
    province_en: "East Kalimantan",
    island: "Kalimantan",
    latitude: -0.5024,
    longitude: 117.1536,
    evaluation_status: "Eligible",
    current_evaluation_id: "EVAL2024_003",
    last_updated: "2024-09-10",
    risk_level: "Low",
    nbl_flag: false,
    distance_to_nearest: 45.2,
    nearest_facility: "GAR Kalimantan Hub",
    scenario_tags: ["facility-driven", "renewal"],
    capacity_ton_per_hour: 62,
    recommendation: "Yes",
    traceability_level: "100% traceable to plantation",
    sourcing_status: "Delivering",
    sourcing_status_last_updated: "2024-09-01",
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
    group: "East Coast Division",
    company: "Sustainable Palm Industries",
    parent_group: "Sustainable Palm Industries",
    group_engagement: "Active",
    region: "Jambi",
    province_en: "Jambi",
    island: "Sumatra",
    latitude: -1.4852,
    longitude: 103.3838,
    evaluation_status: "Eligible",
    current_evaluation_id: "EVAL2024_005",
    last_updated: "2024-07-30",
    risk_level: "Low",
    nbl_flag: false,
    distance_to_nearest: 28.7,
    nearest_facility: "GAR Jambi Refinery",
    scenario_tags: ["facility-driven"],
    capacity_ton_per_hour: 28,
    recommendation: "Yes",
    traceability_level: "95% traceable to plantation",
    sourcing_status: "Delivering",
    sourcing_status_last_updated: "2024-07-20",
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
   {
    mill_id: "PO1000009",
    mill_name: "Riau Central Mill",
    group: "Riau Operations",
    company: "Independent Supplier",
    parent_group: "Independent Supplier",
    group_engagement: "Active",
    region: "Riau",
    province_en: "Riau",
    island: "Sumatra",
    latitude: -2.3307,
    longitude: 99.8453,
    evaluation_status: "Eligible",
    current_evaluation_id: "EVAL2023_009",
    last_updated: "2023-08-15",
    risk_level: "Low",
    nbl_flag: false,
    distance_to_nearest: 189.4,
    nearest_facility: "GAR Riau Processing",
    scenario_tags: ["renewal"],
    capacity_ton_per_hour: 35,
    recommendation: "Yes",
    traceability_level: "High",
    sourcing_status: "Delivering",
    sourcing_status_last_updated: "2023-08-10",
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
    mill_name: "Jambi Delta Mill",
    group: "Jambi Delta Operations",
    company: "Sustainable Palm Industries",
    parent_group: "Sustainable Palm Industries",
    group_engagement: "Active",
    region: "Jambi",
    province_en: "Jambi",
    island: "Sumatra",
    latitude: -1.5200,
    longitude: 103.4500,
    evaluation_status: "Eligible",
    current_evaluation_id: "EVAL2024_010",
    last_updated: "2024-11-20",
    risk_level: "Low",
    nbl_flag: false,
    distance_to_nearest: 15.3,
    nearest_facility: "GAR Jambi Refinery",
    scenario_tags: ["renewal"],
    capacity_ton_per_hour: 50,
    recommendation: "Yes",
    traceability_level: "High",
    sourcing_status: "Delivering",
    sourcing_status_last_updated: "2024-11-15",
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

  // 🟥 NBL MILLS (2)
  {
    mill_id: "PO1000002",
    mill_name: "Sumatra Agri Mill",
    group: "Sumatra Agri Division",
    company: "Wilmar Group",
    parent_group: "Wilmar Group",
    group_engagement: "Suspended",
    region: "Riau",
    province_en: "Riau",
    island: "Sumatra",
    latitude: 0.2933,
    longitude: 101.7068,
    evaluation_status: "Not Eligible (NBL)",
    current_evaluation_id: "EVAL2024_002",
    last_updated: "2024-11-20",
    risk_level: "High",
    nbl_flag: true,
    nbl_reason: "NDPE Violation - Deforestation",
    nbl_date_added: "2024-11-20",
    distance_to_nearest: 18.9,
    nearest_facility: "GAR Riau Processing",
    scenario_tags: ["competitor-check"],
    capacity_ton_per_hour: 75,
    recommendation: "No",
    traceability_level: "Limited traceability - 60% to plantation",
    sourcing_status: "Known",
    sourcing_status_last_updated: "2024-01-15",
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
    group: "Northern Territory Division",
    company: "Wilmar Group",
    parent_group: "Wilmar Group",
    group_engagement: "Suspended",
    region: "Riau",
    province_en: "Riau",
    island: "Sumatra",
    latitude: 1.0456,
    longitude: 101.4479,
    evaluation_status: "Not Eligible (NBL)",
    current_evaluation_id: "EVAL2024_006",
    last_updated: "2024-10-15",
    risk_level: "High",
    nbl_flag: true,
    nbl_reason: "NDPE Violation - Peat Development",
    nbl_date_added: "2024-10-15",
    distance_to_nearest: 62.1,
    nearest_facility: "GAR Riau Processing",
    scenario_tags: ["competitor-check"],
    capacity_ton_per_hour: 80,
    recommendation: "No",
    traceability_level: "Low",
    sourcing_status: "Known",
    sourcing_status_last_updated: "2023-12-01",
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

  // 🟧 UNDER EVALUATION (2)
  {
    mill_id: "PO1000004",
    mill_name: "Palm Valley Processing",
    group: "Palm Valley Division",
    company: "Independent Supplier",
    parent_group: "Independent Supplier",
    group_engagement: "New",
    region: "Sumatra",
    province_en: "West Sumatra",
    island: "Sumatra",
    latitude: -0.9471,
    longitude: 100.4172,
    evaluation_status: "Under Evaluation",
    current_evaluation_id: null,
    last_updated: null,
    risk_level: null,
    nbl_flag: false,
    distance_to_nearest: 156.3,
    nearest_facility: "GAR Jambi Refinery",
    scenario_tags: ["new-supplier"],
    capacity_ton_per_hour: 40,
    sourcing_status: "Awareness",
    sourcing_status_last_updated: "2024-10-01",
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
    group: "Gamma Operations",
    company: "Regional Cooperative",
    parent_group: "Regional Cooperative",
    group_engagement: "New",
    region: "Kalimantan",
    province_en: "Central Kalimantan",
    island: "Kalimantan",
    latitude: -1.2379,
    longitude: 116.8529,
    evaluation_status: "Under Evaluation",
    current_evaluation_id: null,
    last_updated: null,
    risk_level: null,
    nbl_flag: false,
    distance_to_nearest: 78.5,
    nearest_facility: "GAR Kalimantan Hub",
    scenario_tags: ["new-supplier"],
    capacity_ton_per_hour: 30,
    sourcing_status: "Known",
    sourcing_status_last_updated: "2024-09-28",
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
    group: "Delta Operations",
    company: "Emerging Palm Group",
    parent_group: "Emerging Palm Group",
    group_engagement: "New",
    region: "Riau",
    province_en: "Riau",
    island: "Sumatra",
    latitude: 0.5500,
    longitude: 101.5000,
    evaluation_status: "Not Evaluated",
    current_evaluation_id: null,
    last_updated: null,
    risk_level: null,
    nbl_flag: false,
    distance_to_nearest: 45.7,
    nearest_facility: "GAR Riau Processing",
    scenario_tags: ["new-supplier"],
    capacity_ton_per_hour: 25,
    sourcing_status: "Unknown",
  },
  {
    mill_id: "PO1000013",
    mill_name: "Potential Mill Epsilon",
    group: "Epsilon Division",
    company: "Local Supplier Co.",
    parent_group: "Local Supplier Co.",
    group_engagement: "New",
    region: "Jambi",
    province_en: "Jambi",
    island: "Sumatra",
    latitude: -1.6500,
    longitude: 103.7000,
    evaluation_status: "Not Evaluated",
    current_evaluation_id: null,
    last_updated: null,
    risk_level: null,
    nbl_flag: false,
    distance_to_nearest: 22.1,
    nearest_facility: "GAR Jambi Refinery",
    scenario_tags: ["new-supplier"],
    capacity_ton_per_hour: 55,
    sourcing_status: "Unknown",
  },
  {
    mill_id: "PO1000014",
    mill_name: "Competitor Supplier Mill",
    group: "Sumatra Division",
    company: "Independent Supplier",
    parent_group: "Independent Supplier",
    group_engagement: "Active",
    region: "Sumatra",
    province_en: "North Sumatra",
    island: "Sumatra",
    latitude: 2.1000,
    longitude: 99.5000,
    evaluation_status: "Not Evaluated",
    current_evaluation_id: null,
    last_updated: null,
    risk_level: null,
    nbl_flag: false,
    distance_to_nearest: 134.2,
    nearest_facility: "GAR Riau Processing",
    scenario_tags: ["competitor-check"],
    capacity_ton_per_hour: 60,
    competitor_flag: true,
    competitor_buyer: "Wilmar International",
    sourcing_status: "Known",
    sourcing_status_last_updated: "2024-03-03",
  }
];

const DEMO_TRANSACTIONS: Transaction[] = [
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
  
  // Riau Central Mill - Multiple buyers
  { mill_id: "PO1000009", buyer_entity: "GAR Trading", buyer_type: "gar", product_type: "CPO", last_verified: "2024-08-10" },
  { mill_id: "PO1000009", buyer_entity: "APC", buyer_type: "gar", product_type: "PK", last_verified: "2024-08-05" },
  
  // Jambi Delta Mill - GAR + SDG
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

const DEMO_FACILITIES: Facility[] = [
  { facility_id: "FAC001", facility_name: "GAR Jambi Refinery", type: "Refinery", region: "Jambi", code: "Libo" },
  { facility_id: "FAC002", facility_name: "GAR Riau Processing", type: "Processing Plant", region: "Riau", code: "Lubuk Gaung" },
  { facility_id: "FAC003", facility_name: "GAR Kalimantan Hub", type: "Distribution Hub", region: "Kalimantan", code: "Dumai" }
];

// Mill-to-Facility Distance Data (each mill has distances to all facilities, ranked)
const MILL_FACILITY_DISTANCES: MillFacilityDistance[] = [
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
  
  // Riau Central Mill (PO1000009)
  { mill_id: "PO1000009", facility_name: "Lubuk Gaung", distance_km: 189.4, ranking: 1 },
  { mill_id: "PO1000009", facility_name: "Dumai", distance_km: 267.3, ranking: 2 },
  { mill_id: "PO1000009", facility_name: "Libo", distance_km: 312.6, ranking: 3 },
  
  // Jambi Delta Mill (PO1000010)
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

const ASANA_WORKFLOW_STEPS: AsanaWorkflowStep[] = [
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

const App = () => {
    const [view, setView] = useState('dashboard');
    const [selectedMill, setSelectedMill] = useState<EnrichedMill | null>(null);
    const [mills, setMills] = useState<Mill[]>(DEMO_MILLS);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeScenario, setActiveScenario] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [userRole, setUserRole] = useState('Trading Team'); // Role simulation
    const [selectedFacility, setSelectedFacility] = useState('all'); // For facility-driven scenario
    const [filters, setFilters] = useState<Filters>({
        region: 'all',
        owner: 'all',
        risk: 'all',
        buyer: 'all',
        product: 'all',
        sourcingStatus: 'all',
    });
    
    // State for interactive KPI cards
    const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    // Upload wizard state
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadStep, setUploadStep] = useState(1);
    const [uploadMill, setUploadMill] = useState<Mill | null>(null);
    const [uploadData, setUploadData] = useState<UploadData>({});
    const [isUploading, setIsUploading] = useState(false);

    // Add Mill modal state
    const [addMillModalOpen, setAddMillModalOpen] = useState(false);
    const [addMillStep, setAddMillStep] = useState(1);
    const [newMillData, setNewMillData] = useState<Partial<Mill>>({});
    const [isSubmittingMill, setIsSubmittingMill] = useState(false);

    // Toast notification
    const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
    
    // Hover tooltip state
    const [hoveredMill, setHoveredMill] = useState<EnrichedMill | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    
    // State for detail view accordion
    const [expandedSection, setExpandedSection] = useState('evaluation');

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };
    
    // Handle buyer column hover
    const handleBuyerHover = (e: React.MouseEvent, mill: EnrichedMill) => {
        if (mill.buyerDetails && mill.buyerDetails.length > 0) {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipPosition({ x: rect.left, y: rect.bottom + 5 });
        setHoveredMill(mill);
        }
    };
    
    const handleBuyerLeave = () => {
        setHoveredMill(null);
    };

    // Enhanced mills with computed properties
    const enrichedMills: EnrichedMill[] = useMemo(() => {
        return mills.map(mill => {
        const transactions = DEMO_TRANSACTIONS.filter(t => t.mill_id === mill.mill_id);
        
        const uniqueBuyers = [...new Set(transactions.map(t => t.buyer_entity))];
        const buyerSummary = uniqueBuyers.join(', ');
        const hasCompetitor = transactions.some(t => t.buyer_type === 'competitor');
        
        const uniqueProducts = [...new Set(transactions.map(t => t.product_type))];
        const productSummary = uniqueProducts.join(', ');
        
        const buyerProductMap: {[key: string]: {products: Set<string>, type: 'gar' | 'competitor', lastVerified: string}} = {};
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
        
        const buyerDetails = Object.entries(buyerProductMap).map(([buyer, data]) => ({
            buyer,
            products: Array.from(data.products).join(', '),
            type: data.type,
            lastVerified: data.lastVerified
        }));
        
        const facilityDistances = MILL_FACILITY_DISTANCES.filter(f => f.mill_id === mill.mill_id);
        
        const nearestFacilityData = facilityDistances.find(f => f.ranking === 1);
        const nearestFacilityName = nearestFacilityData?.facility_name || mill.nearest_facility || 'N/A';
        const nearestFacilityDistance = nearestFacilityData?.distance_km || mill.distance_to_nearest || 0;
        
        return {
            ...mill,
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

    const statistics = useMemo(() => {
        const total = enrichedMills.length;
        const eligible = enrichedMills.filter(m => m.evaluation_status === 'Eligible').length;
        const underEvaluation = enrichedMills.filter(m => m.evaluation_status === 'Under Evaluation').length;
        const inNBL = enrichedMills.filter(m => m.nbl_flag).length;
        const notEvaluated = enrichedMills.filter(m => m.evaluation_status === 'Not Evaluated').length;
        
        return { total, eligible, underEvaluation, inNBL, notEvaluated };
    }, [enrichedMills]);
    
    const summaryKpis = useMemo(() => {
        const deliveringCount = enrichedMills.filter(m => m.sourcing_status === 'Delivering').length;
        const atRiskCount = enrichedMills.filter(m => m.risk_level === 'High').length;
        const total = enrichedMills.length;
        const deliveringPercentage = total > 0 ? Math.round((deliveringCount / total) * 100) : 0;
        return {
            deliveringCount,
            atRiskCount,
            deliveringPercentage,
        }
    }, [enrichedMills]);

    const handleClearKpiFilter = () => {
        if (activeKpiFilter) {
            if (activeKpiFilter === 'eligible') setActiveTab('all');
            if (activeKpiFilter === 'delivering') setFilters(f => ({ ...f, sourcingStatus: 'all' }));
            if (activeKpiFilter === 'at-risk') setFilters(f => ({ ...f, risk: 'all' }));
            if (activeKpiFilter === 'capacity' || activeKpiFilter === 'distance') setSortConfig(null);
        }
        setActiveKpiFilter(null);
    };

    const handleKpiClick = (kpi: string) => {
        if (activeKpiFilter === kpi) {
            handleClearKpiFilter();
            return;
        }

        handleClearKpiFilter(); // Clear previous KPI filter before applying new one

        setActiveKpiFilter(kpi);

        switch (kpi) {
            case 'eligible':
                setActiveTab('eligible');
                break;
            case 'delivering':
                setFilters(f => ({ ...f, sourcingStatus: 'Delivering' }));
                break;
            case 'at-risk':
                setFilters(f => ({ ...f, risk: 'High' }));
                break;
            case 'capacity':
                setSortConfig({ key: 'capacity_ton_per_hour', direction: 'desc' });
                break;
            case 'distance':
                setSortConfig({ key: 'distance', direction: 'asc' });
                break;
        }
    };


    const filteredMills = useMemo(() => {
        let result: EnrichedMill[] = [...enrichedMills];

        if (activeScenario !== 'all' && activeScenario !== 'regional-supply') {
            result = result.filter(mill => mill.scenario_tags?.includes(activeScenario));
        }
        
        if (activeScenario === 'facility-driven' && selectedFacility !== 'all') {
            result = result.map(mill => {
            const facilityData = mill.facilityDistances.find(f => f.facility_name === selectedFacility);
            return {
                ...mill,
                distanceToSelectedFacility: facilityData?.distance_km || Infinity
            };
            });
            result.sort((a, b) => (a as any).distanceToSelectedFacility - (b as any).distanceToSelectedFacility);
            result = result.slice(0, 3);
        }

        if (activeTab === 'eligible') {
            result = result.filter(m => m.evaluation_status === 'Eligible');
        } else if (activeTab === 'under-evaluation') {
            result = result.filter(m => m.evaluation_status === 'Under Evaluation');
        } else if (activeTab === 'nbl') {
            result = result.filter(m => m.nbl_flag);
        }

        if (searchQuery) {
        result = result.filter(mill => 
            mill.mill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mill.mill_id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        }

        if (filters.region !== 'all') {
        result = result.filter(mill => mill.region === filters.region);
        }
        if (filters.owner !== 'all') {
        result = result.filter(mill => mill.parent_group === filters.owner);
        }
        if (filters.risk !== 'all') {
        result = result.filter(mill => mill.risk_level === filters.risk);
        }
        if (filters.sourcingStatus !== 'all') {
            result = result.filter(mill => mill.sourcing_status === filters.sourcingStatus);
        }
        
        if (filters.buyer !== 'all') {
        if (filters.buyer === 'gar-only') {
            result = result.filter(mill => mill.transactions.length > 0 && !mill.hasCompetitor);
        } else if (filters.buyer === 'has-competitor') {
            result = result.filter(mill => mill.hasCompetitor);
        } else if (filters.buyer === 'no-transactions') {
            result = result.filter(mill => mill.transactions.length === 0);
        } else {
            result = result.filter(mill => 
            mill.transactions.some(t => t.buyer_entity === filters.buyer)
            );
        }
        }
        
        if (filters.product !== 'all') {
        result = result.filter(mill => 
            mill.transactions.some(t => t.product_type === filters.product)
        );
        }

        if (sortConfig) {
            result.sort((a, b) => {
                let aValue: number;
                let bValue: number;
                
                if (sortConfig.key === 'distance') {
                    const isFacilityDriven = activeScenario === 'facility-driven' && selectedFacility !== 'all';
                    aValue = isFacilityDriven ? (a as any).distanceToSelectedFacility ?? Infinity : a.nearestFacilityDistance;
                    bValue = isFacilityDriven ? (b as any).distanceToSelectedFacility ?? Infinity : b.nearestFacilityDistance;
                } else {
                    aValue = (a as any)[sortConfig.key] || 0;
                    bValue = (b as any)[sortConfig.key] || 0;
                }

                if (sortConfig.direction === 'asc') {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            });
        }

        return result;
    }, [enrichedMills, activeScenario, activeTab, searchQuery, filters, selectedFacility, sortConfig]);

    const filteredStatistics = useMemo(() => {
        const totalCapacity = filteredMills.reduce((sum, m) => sum + (m.capacity_ton_per_hour || 0), 0);
        const totalDistance = filteredMills.reduce((sum, m) => sum + m.nearestFacilityDistance, 0);
        const avgDistance = filteredMills.length > 0 ? totalDistance / filteredMills.length : 0;
        return { totalCapacity, avgDistance };
    }, [filteredMills]);

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
        id: 'regional-supply',
        icon: Landmark,
        title: 'Regional Supply Potential',
        description: 'Analyze supply capacity and mill status by region',
        color: 'teal'
        }
    ];

    const tabs = [
        { id: 'all', label: 'All Mills', count: statistics.total },
        { id: 'under-evaluation', label: 'Under Evaluation', count: statistics.underEvaluation },
        { id: 'nbl', label: 'NBL', count: statistics.inNBL }
    ];

    const handleRequestEvaluation = (mill: Mill) => {
        const taskId = `ASN-2025-${Math.floor(Math.random() * 9000) + 1000}`;
        const updatedMills = mills.map(m => {
            if (m.mill_id === mill.mill_id) {
                const updatedMill: Mill = {
                    ...m,
                    evaluation_status: 'Under Evaluation',
                    asana_task_id: taskId,
                    asana_assigned_to: 'Crescentiana P.S.',
                    asana_status: 'In Progress',
                    asana_current_stage_name: 'Document Collection',
                    current_asana_task_url: `https://app.asana.com/0/123/${taskId}`
                };
                return updatedMill;
            }
            return m;
        });
        setMills(updatedMills);
        showToast(`Evaluation requested for ${mill.mill_name}. Task ${taskId} created.`, 'success');
    };

    const handleUploadSubmit = () => {
        if (!uploadMill) return;
        const evalId = uploadMill.current_evaluation_id || `EVAL2025_${Math.floor(Math.random() * 9000) + 1000}`;
        const today = new Date().toISOString().split('T')[0];
        
        const updatedMills = mills.map(m => {
            if (m.mill_id === uploadMill.mill_id) {
                const newStatus: EvaluationStatus = uploadData.recommendation === 'Yes' && !uploadData.ndpe_violation_found && !uploadData.public_grievance_flag ? 'Eligible' : 'Not Eligible (NBL)';
                
                const updatedMill: Mill = {
                    ...m,
                    evaluation_status: newStatus,
                    current_evaluation_id: evalId,
                    last_updated: today,
                    risk_level: uploadData.risk_level || null,
                    sourcing_status: uploadData.sourcing_status || m.sourcing_status,
                    sourcing_status_last_updated: m.sourcing_status !== uploadData.sourcing_status ? today : m.sourcing_status_last_updated,
                    capacity_ton_per_hour: uploadData.capacity_ton_per_hour,
                    recommendation: uploadData.recommendation,
                    traceability_level: uploadData.traceability_level,
                    ffb_source_own_pct: uploadData.ffb_source_own_pct,
                    ffb_source_plasma_pct: uploadData.ffb_source_plasma_pct,
                    ffb_source_independent_pct: uploadData.ffb_source_independent_pct,
                    ndpe_violation_found: uploadData.ndpe_violation_found,
                    public_grievance_flag: uploadData.public_grievance_flag,
                    deforestation_alerts: uploadData.deforestation_alerts,
                    hotspot_alerts: uploadData.hotspot_alerts,
                    current_eval_doc_url: `https://docs.example.com/${evalId}.pdf`,
                    asana_task_id: undefined,
                    asana_assigned_to: undefined,
                    asana_status: undefined,
                    asana_current_stage: undefined,
                    asana_current_stage_name: undefined,
                    asana_request_date: undefined,
                    asana_expected_completion: undefined,
                    asana_progress_pct: undefined
                };
                return updatedMill;
            }
            return m;
        });
        
        setMills(updatedMills);
        
        setUploadModalOpen(false);
        setUploadStep(1);
        
        const finalUpdatedMill = updatedMills.find(m => m.mill_id === uploadMill.mill_id);
        const enrichedFinalMill = enrichedMills.find(m => m.mill_id === finalUpdatedMill?.mill_id);
        
        showToast(`Evaluation updated successfully for ${uploadMill.mill_name}!`, 'success');
        
        if (enrichedFinalMill) {
             setSelectedMill(enrichedFinalMill);
             setView('evaluation-detail');
        }
       
        setUploadMill(null);
        setUploadData({});
    };

    const handleResetDemo = () => {
        setMills(DEMO_MILLS);
        setActiveScenario('all');
        setActiveTab('all');
        setSearchQuery('');
        setSelectedFacility('all');
        setFilters({ region: 'all', owner: 'all', risk: 'all', buyer: 'all', product: 'all', sourcingStatus: 'all' });
        handleClearKpiFilter();
        showToast('Demo data reset successfully!', 'success');
    };

    const getStatusBadgeColor = (status: EvaluationStatus | 'Not Eligible' | null) => {
        const colors: {[key: string]: string} = {
        'Eligible': 'bg-green-100 text-green-800 border-green-300',
        'Under Evaluation': 'bg-orange-100 text-orange-800 border-orange-300',
        'Not Eligible': 'bg-red-100 text-red-800 border-red-300',
        'Not Eligible (NBL)': 'bg-red-100 text-red-800 border-red-400',
        'Not Evaluated': 'bg-gray-100 text-gray-800 border-gray-300',
        };
        return colors[status || ''] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getSourcingStatusBadgeColor = (status: SourcingStatus) => {
        const colors: { [key in SourcingStatus]: string } = {
            'Delivering': 'bg-green-100 text-green-800 border-green-300',
            'Progressing': 'bg-blue-100 text-blue-800 border-blue-300',
            'Commitment & Starting Action': 'bg-sky-100 text-sky-800 border-sky-300',
            'Awareness': 'bg-purple-100 text-purple-800 border-purple-300',
            'Known': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Unknown': 'bg-gray-100 text-gray-800 border-gray-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const RegionalSummaryView = ({ mills }: { mills: EnrichedMill[] }) => {
        const regionalData = useMemo(() => {
            const regions: { [key: string]: EnrichedMill[] } = {};
            mills.forEach(mill => {
                if (!regions[mill.region]) {
                    regions[mill.region] = [];
                }
                regions[mill.region].push(mill);
            });

            return Object.entries(regions).map(([region, millsInRegion]) => {
                const totalCapacity = millsInRegion.reduce((sum, m) => sum + (m.capacity_ton_per_hour || 0), 0);
                const statusCounts = millsInRegion.reduce((counts, m) => {
                    counts[m.evaluation_status] = (counts[m.evaluation_status] || 0) + 1;
                    return counts;
                }, {} as { [key in EvaluationStatus]?: number });

                const garBuyers = millsInRegion.filter(m => m.transactions.some(t => t.buyer_type === 'gar')).length;
                const competitorBuyers = millsInRegion.filter(m => m.hasCompetitor).length;

                return {
                    region,
                    totalMills: millsInRegion.length,
                    totalCapacity,
                    statusCounts,
                    garBuyers,
                    competitorBuyers
                };
            }).sort((a,b) => b.totalCapacity - a.totalCapacity);
        }, [mills]);

        if (regionalData.length === 0) {
            return (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No mills match your current filters.</h3>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter criteria.</p>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                {regionalData.map(data => (
                    <div key={data.region} className="bg-white rounded-lg shadow-sm border">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-900">{data.region}</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4 p-4">
                            <div className="col-span-1 space-y-4">
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-800">Total Capacity</p>
                                    <p className="text-3xl font-bold text-blue-900">{data.totalCapacity.toLocaleString()} <span className="text-lg font-medium">T/H</span></p>
                                </div>
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-700">Total Mills</p>
                                    <p className="text-3xl font-bold text-gray-900">{data.totalMills}</p>
                                </div>
                            </div>
                            <div className="col-span-1 border-l border-r border-gray-200 px-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Breakdown</h3>
                                <div className="space-y-2">
                                    {Object.entries(data.statusCounts).map(([status, count]) => (
                                        <div key={status} className="flex justify-between items-center text-sm">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(status as EvaluationStatus)}`}>{status}</span>
                                            <span className="font-medium text-gray-800">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Buyer Distribution</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{data.garBuyers} Mills</p>
                                            <p className="text-xs text-gray-600">Supplying to GAR</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{data.competitorBuyers} Mills</p>
                                            <p className="text-xs text-gray-600">Supplying to Competitor</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };


    const UploadWizard = () => {
        const isEditMode = !!uploadMill?.current_evaluation_id;

        const simulateParsing = () => {
            setIsUploading(true);
            setTimeout(() => {
                setUploadData({
                recommendation: 'Yes',
                risk_level: 'Low',
                traceability_level: 'High',
                ndpe_violation_found: false,
                public_grievance_flag: false,
                deforestation_alerts: 0,
                hotspot_alerts: 0,
                ffb_source_own_pct: 55,
                ffb_source_plasma_pct: 35,
                ffb_source_independent_pct: 10,
                capacity_ton_per_hour: 42,
                });
                setIsUploading(false);
                setUploadStep(3);
            }, 2000);
        };
    
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{isEditMode ? 'Edit Mill Evaluation' : 'Upload Mill Evaluation'}</h2>
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
                            setUploadMill(mill || null);
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
                            <div>• Traceability Level</div>
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

                    {(isEditMode || userRole === 'Sustainability Team') && (
                        <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sourcing Status</label>
                            <select
                                value={uploadData.sourcing_status || 'Unknown'}
                                onChange={(e) => setUploadData({ ...uploadData, sourcing_status: e.target.value as SourcingStatus })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                disabled={userRole !== 'Sustainability Team'}
                            >
                                <option>Delivering</option>
                                <option>Progressing</option>
                                <option>Commitment & Starting Action</option>
                                <option>Awareness</option>
                                <option>Known</option>
                                <option>Unknown</option>
                            </select>
                            {uploadMill?.sourcing_status_last_updated && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Last updated: {uploadMill.sourcing_status_last_updated}
                                </p>
                            )}
                            {userRole !== 'Sustainability Team' && <p className="text-xs text-gray-500 mt-1">Only Sustainability Team can edit this field.</p>}
                        </div>
                    )}
    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation</label>
                        <select 
                            value={uploadData.recommendation}
                            onChange={(e) => setUploadData({...uploadData, recommendation: e.target.value as 'Yes' | 'No'})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                        <select 
                            value={uploadData.risk_level || ''}
                            onChange={(e) => setUploadData({...uploadData, risk_level: e.target.value as RiskLevel})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="Low">Low</option>
                            <option value="High">High</option>
                        </select>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (Ton/Hour)</label>
                            <input
                                type="number"
                                value={uploadData.capacity_ton_per_hour || ''}
                                onChange={(e) => setUploadData({...uploadData, capacity_ton_per_hour: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="e.g., 45"
                            />
                        </div>
                    </div>
    
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center space-x-2">
                        <input 
                            type="checkbox" 
                            checked={!!uploadData.ndpe_violation_found}
                            onChange={(e) => setUploadData({...uploadData, ndpe_violation_found: e.target.checked})}
                            className="rounded"
                        />
                        <span className="text-sm text-gray-700">NDPE Violation Found</span>
                        </label>
                        <label className="flex items-center space-x-2">
                        <input 
                            type="checkbox" 
                            checked={!!uploadData.public_grievance_flag}
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
    
                {uploadStep === 4 && uploadMill && (
                    <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Confirm Submission</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-sm"><strong>Mill:</strong> {uploadMill.mill_name}</p>
                        <p className="text-sm"><strong>Sourcing Status:</strong> {uploadData.sourcing_status}</p>
                        <p className="text-sm"><strong>Capacity:</strong> {uploadData.capacity_ton_per_hour} T/H</p>
                        <p className="text-sm"><strong>Recommendation:</strong> {uploadData.recommendation}</p>
                        <p className="text-sm"><strong>Risk Level:</strong> {uploadData.risk_level}</p>
                        <p className="text-sm"><strong>Eligibility:</strong> {uploadData.recommendation === 'Yes' && !uploadData.ndpe_violation_found ? 'Eligible' : 'Not Eligible'}</p>
                    </div>
    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-2">⚠️ This will:</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Update mill status to "{uploadData.recommendation === 'Yes' ? 'Eligible' : 'Not Eligible'}"</li>
                        <li>• {isEditMode ? 'Update the' : 'Create a new'} evaluation record</li>
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
                        onClick={() => {
                            if (isEditMode) {
                                const millToEdit = enrichedMills.find(m => m.mill_id === uploadMill.mill_id);
                                if (millToEdit) {
                                    setUploadData({
                                        recommendation: millToEdit.recommendation,
                                        risk_level: millToEdit.risk_level,
                                        sourcing_status: millToEdit.sourcing_status,
                                        capacity_ton_per_hour: millToEdit.capacity_ton_per_hour,
                                        traceability_level: millToEdit.traceability_level,
                                        ndpe_violation_found: millToEdit.ndpe_violation_found,
                                        public_grievance_flag: millToEdit.public_grievance_flag,
                                        deforestation_alerts: millToEdit.deforestation_alerts,
                                        hotspot_alerts: millToEdit.hotspot_alerts,
                                        ffb_source_own_pct: millToEdit.ffb_source_own_pct,
                                        ffb_source_plasma_pct: millToEdit.ffb_source_plasma_pct,
                                        ffb_source_independent_pct: millToEdit.ffb_source_independent_pct,
                                    });
                                    setUploadStep(3);
                                }
                            } else {
                                setUploadStep(2);
                            }
                        }}
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

    if (view === 'dashboard') {
        return (
            <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white flex items-center space-x-2`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

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

      {uploadModalOpen && <UploadWizard />}

      {addMillModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Mill</h2>
                <p className="text-sm text-gray-600 mt-1">Step {addMillStep} of 5</p>
              </div>
              <button
                onClick={() => {
                  setAddMillModalOpen(false);
                  setNewMillData({});
                  setAddMillStep(1);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                {['Basic Info', 'Location', 'Operations', 'Risk & Compliance', 'Review'].map((step, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      idx + 1 < addMillStep ? 'bg-green-600 text-white' :
                      idx + 1 === addMillStep ? 'bg-blue-600 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {idx + 1}
                    </div>
                    {idx < 4 && <div className={`w-12 h-1 ${idx + 1 < addMillStep ? 'bg-green-600' : 'bg-gray-300'}`} />}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                {['Basic Info', 'Location', 'Operations', 'Risk', 'Review'].map((label, idx) => (
                  <span key={idx} className={idx + 1 === addMillStep ? 'font-semibold text-blue-600' : ''}>{label}</span>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {/* Step 1: Basic Information */}
              {addMillStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mill ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newMillData.mill_id || ''}
                      onChange={(e) => setNewMillData({ ...newMillData, mill_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., MILL-2025-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mill Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newMillData.mill_name || ''}
                      onChange={(e) => setNewMillData({ ...newMillData, mill_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter mill name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Group <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newMillData.parent_group || ''}
                      onChange={(e) => setNewMillData({ ...newMillData, parent_group: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter parent company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Group Engagement <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newMillData.group_engagement || ''}
                      onChange={(e) => setNewMillData({ ...newMillData, group_engagement: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select engagement level</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {addMillStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newMillData.region || ''}
                      onChange={(e) => setNewMillData({ ...newMillData, region: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select region</option>
                      <option value="Sumatra">Sumatra</option>
                      <option value="Kalimantan">Kalimantan</option>
                      <option value="Java">Java</option>
                      <option value="Sulawesi">Sulawesi</option>
                      <option value="Papua">Papua</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newMillData.province_en || ''}
                      onChange={(e) => setNewMillData({ ...newMillData, province_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter province name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Island <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newMillData.island || ''}
                      onChange={(e) => setNewMillData({ ...newMillData, island: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select island</option>
                      <option value="Sumatra">Sumatra</option>
                      <option value="Kalimantan">Kalimantan</option>
                      <option value="Java">Java</option>
                      <option value="Sulawesi">Sulawesi</option>
                      <option value="Papua">Papua</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={newMillData.latitude || ''}
                        onChange={(e) => setNewMillData({ ...newMillData, latitude: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 1.234567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={newMillData.longitude || ''}
                        onChange={(e) => setNewMillData({ ...newMillData, longitude: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 101.234567"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Operational Details */}
              {addMillStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Details</h3>
                  <p className="text-sm text-gray-600 mb-4">All fields in this step are optional</p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity (ton/hour)
                    </label>
                    <input
                      type="number"
                      value={newMillData.capacity_ton_per_hour || ''}
                      onChange={(e) => setNewMillData({ ...newMillData, capacity_ton_per_hour: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Traceability Level
                    </label>
                    <select
                      value={newMillData.traceability_level || ''}
                      onChange={(e) => setNewMillData({ ...newMillData, traceability_level: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select level</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">FFB Source Distribution (%)</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Own</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newMillData.ffb_source_own_pct || ''}
                          onChange={(e) => setNewMillData({ ...newMillData, ffb_source_own_pct: parseFloat(e.target.value) })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                          placeholder="0-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Plasma</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newMillData.ffb_source_plasma_pct || ''}
                          onChange={(e) => setNewMillData({ ...newMillData, ffb_source_plasma_pct: parseFloat(e.target.value) })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                          placeholder="0-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Independent</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={newMillData.ffb_source_independent_pct || ''}
                          onChange={(e) => setNewMillData({ ...newMillData, ffb_source_independent_pct: parseFloat(e.target.value) })}
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                          placeholder="0-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      FFB Source Comment
                    </label>
                    <textarea
                      value={newMillData.ffb_source_comment || ''}
                      onChange={(e) => setNewMillData({ ...newMillData, ffb_source_comment: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Additional notes about FFB sources"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Risk & Compliance */}
              {addMillStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk & Compliance</h3>
                  <p className="text-sm text-gray-600 mb-4">All fields in this step are optional</p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Level
                    </label>
                    <select
                      value={newMillData.risk_level || 'Low'}
                      onChange={(e) => setNewMillData({ ...newMillData, risk_level: e.target.value as RiskLevel })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Flags & Alerts</h4>

                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newMillData.nbl_flag || false}
                          onChange={(e) => setNewMillData({ ...newMillData, nbl_flag: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">NBL Flag (No Buy List)</span>
                      </label>

                      {newMillData.nbl_flag && (
                        <div className="ml-6">
                          <input
                            type="text"
                            value={newMillData.nbl_reason || ''}
                            onChange={(e) => setNewMillData({ ...newMillData, nbl_reason: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="NBL reason"
                          />
                        </div>
                      )}

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newMillData.ndpe_violation_found || false}
                          onChange={(e) => setNewMillData({ ...newMillData, ndpe_violation_found: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">NDPE Violation Found</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newMillData.public_grievance_flag || false}
                          onChange={(e) => setNewMillData({ ...newMillData, public_grievance_flag: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Public Grievance Flag</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deforestation Alerts
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newMillData.deforestation_alerts || ''}
                        onChange={(e) => setNewMillData({ ...newMillData, deforestation_alerts: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hotspot Alerts
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newMillData.hotspot_alerts || ''}
                        onChange={(e) => setNewMillData({ ...newMillData, hotspot_alerts: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peat Presence
                    </label>
                    <select
                      value={newMillData.peat_presence || ''}
                      onChange={(e) => setNewMillData({ ...newMillData, peat_presence: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select status</option>
                      <option value="None">None</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {addMillStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h3>
                  <p className="text-sm text-gray-600">Please review all information before submitting</p>

                  {/* Basic Information */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-blue-600" />
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="font-medium">Mill ID:</span> {newMillData.mill_id || 'N/A'}</div>
                      <div><span className="font-medium">Mill Name:</span> {newMillData.mill_name || 'N/A'}</div>
                      <div><span className="font-medium">Parent Group:</span> {newMillData.parent_group || 'N/A'}</div>
                      <div><span className="font-medium">Engagement:</span> {newMillData.group_engagement || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      Location
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="font-medium">Region:</span> {newMillData.region || 'N/A'}</div>
                      <div><span className="font-medium">Province:</span> {newMillData.province_en || 'N/A'}</div>
                      <div><span className="font-medium">Island:</span> {newMillData.island || 'N/A'}</div>
                      <div><span className="font-medium">Coordinates:</span> {newMillData.latitude && newMillData.longitude ? `${newMillData.latitude}, ${newMillData.longitude}` : 'N/A'}</div>
                    </div>
                  </div>

                  {/* Operations */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <Factory className="w-4 h-4 mr-2 text-blue-600" />
                      Operations
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="font-medium">Capacity:</span> {newMillData.capacity_ton_per_hour ? `${newMillData.capacity_ton_per_hour} t/h` : 'Not specified'}</div>
                      <div><span className="font-medium">Traceability:</span> {newMillData.traceability_level || 'Not specified'}</div>
                    </div>
                  </div>

                  {/* Risk */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <ShieldAlert className="w-4 h-4 mr-2 text-blue-600" />
                      Risk & Compliance
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="font-medium">Risk Level:</span> {newMillData.risk_level || 'Low'}</div>
                      <div><span className="font-medium">NBL Flag:</span> {newMillData.nbl_flag ? 'Yes' : 'No'}</div>
                      <div><span className="font-medium">NDPE Violation:</span> {newMillData.ndpe_violation_found ? 'Yes' : 'No'}</div>
                      <div><span className="font-medium">Grievance:</span> {newMillData.public_grievance_flag ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => {
                  if (addMillStep > 1) {
                    setAddMillStep(addMillStep - 1);
                  }
                }}
                disabled={addMillStep === 1}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  addMillStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>

              {addMillStep < 5 ? (
                <button
                  onClick={() => {
                    // Validate required fields for each step
                    if (addMillStep === 1) {
                      if (!newMillData.mill_id || !newMillData.mill_name || !newMillData.parent_group || !newMillData.group_engagement) {
                        showToast('Please fill all required fields', 'error');
                        return;
                      }
                    } else if (addMillStep === 2) {
                      if (!newMillData.region || !newMillData.province_en || !newMillData.island || !newMillData.latitude || !newMillData.longitude) {
                        showToast('Please fill all required fields', 'error');
                        return;
                      }
                    }
                    setAddMillStep(addMillStep + 1);
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsSubmittingMill(true);

                    // Generate unique mill ID if not provided
                    const millId = newMillData.mill_id || `MILL-${Date.now()}`;

                    // Create new mill with defaults
                    const newMill: Mill = {
                      mill_id: millId,
                      mill_name: newMillData.mill_name || '',
                      parent_group: newMillData.parent_group || '',
                      group_engagement: newMillData.group_engagement || '',
                      region: newMillData.region || '',
                      province_en: newMillData.province_en || '',
                      island: newMillData.island || '',
                      latitude: newMillData.latitude || 0,
                      longitude: newMillData.longitude || 0,
                      evaluation_status: 'Not Evaluated' as EvaluationStatus,
                      current_evaluation_id: null,
                      last_updated: new Date().toISOString(),
                      risk_level: (newMillData.risk_level as RiskLevel) || 'Low',
                      sourcing_status: 'Unknown' as SourcingStatus,
                      sourcing_status_last_updated: new Date().toISOString(),
                      nbl_flag: newMillData.nbl_flag || false,
                      nbl_reason: newMillData.nbl_reason,
                      distance_to_nearest: 0,
                      nearest_facility: 'TBD',
                      scenario_tags: [],
                      capacity_ton_per_hour: newMillData.capacity_ton_per_hour,
                      traceability_level: newMillData.traceability_level,
                      ffb_source_own_pct: newMillData.ffb_source_own_pct,
                      ffb_source_plasma_pct: newMillData.ffb_source_plasma_pct,
                      ffb_source_independent_pct: newMillData.ffb_source_independent_pct,
                      ffb_source_comment: newMillData.ffb_source_comment,
                      ndpe_violation_found: newMillData.ndpe_violation_found,
                      public_grievance_flag: newMillData.public_grievance_flag,
                      deforestation_alerts: newMillData.deforestation_alerts,
                      hotspot_alerts: newMillData.hotspot_alerts,
                      peat_presence: newMillData.peat_presence,
                    };

                    // Add to mills array at the beginning
                    setMills([newMill, ...mills]);

                    // Close modal and reset
                    setTimeout(() => {
                      setIsSubmittingMill(false);
                      setAddMillModalOpen(false);
                      setNewMillData({});
                      setAddMillStep(1);
                      showToast(`Mill "${newMill.mill_name}" added successfully!`, 'success');
                    }, 500);
                  }}
                  disabled={isSubmittingMill}
                  className="inline-flex items-center px-6 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmittingMill ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Mill
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
                <>
                  <button
                    onClick={() => {
                      setUploadMill(null);
                      setUploadData({});
                      setUploadModalOpen(true);
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    Upload Evaluation
                  </button>
                  <button
                    onClick={() => {
                      setNewMillData({});
                      setAddMillStep(1);
                      setAddMillModalOpen(true);
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add Mill
                  </button>
                </>
              )}
              <button
                onClick={() => setView('settings')}
                className="inline-flex items-center px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 py-4">
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
                    if (newScenario !== 'facility-driven') {
                      setSelectedFacility('all');
                    }
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isActive 
                      ? `border-${scenario.color}-500 bg-${scenario.color}-50` 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <Icon className={`w-6 h-6 mr-2 ${isActive ? `text-${scenario.color}-600` : 'text-gray-400'}`} />
                    <span className={`text-sm font-semibold ${isActive ? `text-${scenario.color}-900` : 'text-gray-900'}`}>
                      {scenario.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{scenario.description}</p>
                </button>
              );
            })}
          </div>
          {activeScenario !== 'all' && (
            <div className="mt-2 flex items-center text-xs text-blue-600">
              <Filter className="w-3 h-3 mr-1" />
              Filtered by {scenarios.find(s => s.id === activeScenario)?.title} scenario
            </div>
          )}
          
          {activeScenario === 'facility-driven' && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <label className="block text-sm font-medium text-blue-900 mb-2">
                🏭 Select Facility to see 3 nearest mills:
              </label>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Mills (no facility filter)</option>
                {DEMO_FACILITIES.map(facility => (
                  <option key={facility.facility_id} value={facility.code}>
                    {facility.code} ({facility.facility_name})
                  </option>
                ))}
              </select>
              {selectedFacility !== 'all' && (
                <p className="mt-2 text-xs text-blue-700">
                  ✓ Showing 3 nearest mills to <strong>{selectedFacility}</strong> facility, sorted by distance
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-3 mb-4">
            <button
                onClick={() => handleKpiClick('eligible')}
                title="Click to show only eligible mills"
                className={`bg-white rounded-lg shadow-sm border p-3 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeKpiFilter && activeKpiFilter !== 'eligible' ? 'opacity-60 hover:opacity-100' : ''} ${activeKpiFilter === 'eligible' ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'hover:border-gray-400'}`}
            >
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-600">Eligible Mills</p>
                    <UserCheck className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{statistics.eligible}</p>
            </button>
            <button
                onClick={() => handleKpiClick('delivering')}
                title="Click to show only 'Delivering' status mills"
                className={`bg-white rounded-lg shadow-sm border p-3 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeKpiFilter && activeKpiFilter !== 'delivering' ? 'opacity-60 hover:opacity-100' : ''} ${activeKpiFilter === 'delivering' ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'hover:border-gray-400'}`}
            >
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-600">Delivering</p>
                    <Droplet className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                    {summaryKpis.deliveringCount}
                    <span className="text-base font-medium text-gray-500 ml-1">
                        / {statistics.total} ({summaryKpis.deliveringPercentage}%)
                    </span>
                </p>
            </button>
            <button
                onClick={() => handleKpiClick('capacity')}
                title="Click to sort by mill capacity (descending)"
                className={`bg-white rounded-lg shadow-sm border p-3 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeKpiFilter && activeKpiFilter !== 'capacity' ? 'opacity-60 hover:opacity-100' : ''} ${activeKpiFilter === 'capacity' ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'hover:border-gray-400'}`}
            >
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-600">Filtered Capacity</p>
                    <Scale className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                    {filteredStatistics.totalCapacity.toLocaleString()}
                    <span className="text-base font-medium text-gray-500"> T/H</span>
                </p>
            </button>
            <button
                onClick={() => handleKpiClick('distance')}
                title="Click to sort by distance (ascending)"
                className={`bg-white rounded-lg shadow-sm border p-3 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeKpiFilter && activeKpiFilter !== 'distance' ? 'opacity-60 hover:opacity-100' : ''} ${activeKpiFilter === 'distance' ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'hover:border-gray-400'}`}
            >
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-600">Avg. Distance</p>
                    <Navigation className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                    {filteredStatistics.avgDistance.toFixed(1)}
                    <span className="text-base font-medium text-gray-500"> km</span>
                </p>
            </button>
            <button
                onClick={() => handleKpiClick('at-risk')}
                title="Click to show only high-risk mills"
                className={`bg-white rounded-lg shadow-sm border p-3 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeKpiFilter && activeKpiFilter !== 'at-risk' ? 'opacity-60 hover:opacity-100' : ''} ${activeKpiFilter === 'at-risk' ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'hover:border-gray-400'}`}
            >
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-600">At-Risk Mills</p>
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{summaryKpis.atRiskCount}</p>
            </button>
        </div>

        <div className="mb-4">
          <div className="border-b border-gray-200">
            <div className="flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border mb-4">
          <div className="p-3">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mills by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filters.region}
                onChange={(e) => setFilters({...filters, region: e.target.value})}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Regions</option>
                <option value="Jambi">Jambi</option>
                <option value="Riau">Riau</option>
                <option value="Kalimantan">Kalimantan</option>
                <option value="Sumatra">Sumatra</option>
              </select>
              <select
                value={filters.buyer}
                onChange={(e) => setFilters({...filters, buyer: e.target.value})}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Buyers</option>
                <option value="gar-only">🟢 GAR Entities Only</option>
                <option value="has-competitor">🔴 Has Competitor</option>
                <option value="no-transactions">No Transactions</option>
                <option disabled>──────────</option>
                <option value="GAR Trading">GAR Trading</option>
                <option value="APC">APC</option>
                <option value="PHG">PHG</option>
                <option value="SDG">SDG</option>
                <option disabled>──────────</option>
                <option value="Wilmar International">Wilmar International</option>
                <option value="Musim Mas">Musim Mas</option>
              </select>
              <select
                value={filters.product}
                onChange={(e) => setFilters({...filters, product: e.target.value})}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                title="CPO/PK shows all mills trading that product (even if they also trade other products)"
              >
                <option value="all">All Products</option>
                <option value="CPO">CPO</option>
                <option value="PK">PK</option>
              </select>
              <select
                value={filters.risk}
                onChange={(e) => setFilters({...filters, risk: e.target.value})}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Risk</option>
                <option value="Low">Low Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
            
            {(filters.product === 'CPO' || filters.product === 'PK') && (
              <div className="mt-2 flex items-start space-x-1">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-blue-700">
                  Showing all mills trading <strong>{filters.product}</strong> (includes mills that also trade other products)
                </p>
              </div>
            )}
            
            {(activeKpiFilter || filters.buyer !== 'all' || filters.product !== 'all' || filters.region !== 'all' || filters.risk !== 'all' || filters.sourcingStatus !== 'all') && (
              <div className="mt-3 flex items-center flex-wrap gap-2">
                <span className="text-xs text-gray-600">Active filters:</span>
                {activeKpiFilter && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 border border-indigo-300">
                    KPI: {activeKpiFilter.charAt(0).toUpperCase() + activeKpiFilter.slice(1)}
                    <button 
                      onClick={handleClearKpiFilter}
                      className="ml-1 hover:text-indigo-900"
                      title="Clear KPI filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.buyer !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-300">
                    Buyer: {filters.buyer === 'gar-only' ? '🟢 GAR Only' : filters.buyer === 'has-competitor' ? '🔴 Has Competitor' : filters.buyer === 'no-transactions' ? 'No Transactions' : filters.buyer}
                    <button 
                      onClick={() => setFilters({...filters, buyer: 'all'})}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.product !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-300">
                    Product: {filters.product}
                    <button 
                      onClick={() => setFilters({...filters, product: 'all'})}
                      className="ml-1 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.region !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 border border-purple-300">
                    Region: {filters.region}
                    <button 
                      onClick={() => setFilters({...filters, region: 'all'})}
                      className="ml-1 hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.risk !== 'all' && !activeKpiFilter && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-300">
                    Risk: {filters.risk}
                    <button 
                      onClick={() => setFilters({...filters, risk: 'all'})}
                      className="ml-1 hover:text-orange-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                 {filters.sourcingStatus !== 'all' && !activeKpiFilter && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-cyan-100 text-cyan-800 border border-cyan-300">
                    Sourcing Status: {filters.sourcingStatus}
                    <button 
                      onClick={() => setFilters({...filters, sourcingStatus: 'all'})}
                      className="ml-1 hover:text-cyan-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setFilters({ region: 'all', owner: 'all', risk: 'all', buyer: 'all', product: 'all', sourcingStatus: 'all' });
                    handleClearKpiFilter();
                  }}
                  className="text-xs text-gray-600 hover:text-gray-900 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {activeScenario === 'regional-supply' ? (
          <RegionalSummaryView mills={filteredMills} />
        ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mill</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sourcing Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facility</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity (T/H)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMills.map(mill => (
                  <tr key={mill.mill_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 mr-2">{mill.mill_name}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(mill.evaluation_status)}`}>
                              {mill.evaluation_status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">{mill.mill_id}</div>
                          <div className="text-xs text-gray-500">{mill.parent_group}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{mill.group || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{mill.company || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{mill.region}</td>
                     <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSourcingStatusBadgeColor(mill.sourcing_status)}`}>
                        {mill.sourcing_status}
                      </span>
                    </td>
                    <td 
                      className="px-4 py-3 text-sm relative cursor-pointer"
                      onMouseEnter={(e) => handleBuyerHover(e, mill)}
                      onMouseLeave={handleBuyerLeave}
                    >
                      <div className="flex items-center space-x-1">
                        <span className={mill.hasCompetitor ? 'text-red-600 font-medium' : 'text-gray-900'}>
                          {mill.buyerSummary}
                        </span>
                        {mill.hasCompetitor && (
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {activeScenario === 'facility-driven' && selectedFacility !== 'all' 
                        ? selectedFacility 
                        : mill.nearestFacilityName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {activeScenario === 'facility-driven' && selectedFacility !== 'all' 
                        ? `${(mill as any).distanceToSelectedFacility?.toFixed(1) || 'N/A'} km`
                        : `${mill.nearestFacilityDistance} km`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                        {mill.last_updated || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      {mill.risk_level ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          mill.risk_level === 'High' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {mill.risk_level}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                     <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {mill.capacity_ton_per_hour ? `${mill.capacity_ton_per_hour} T/H` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm space-x-2 whitespace-nowrap">
                        <button
                            onClick={() => {
                            setSelectedMill(mill);
                            if (mill.evaluation_status === 'Under Evaluation') {
                                setView('asana-workflow');
                            } else if (mill.current_evaluation_id) {
                                setView('evaluation-detail');
                            } else {
                                setView('detail');
                            }
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            View
                        </button>
                        {userRole === 'Sustainability Team' ? (
                            mill.evaluation_status !== 'Under Evaluation' && (
                                <button
                                    onClick={() => {
                                        const millToModify = enrichedMills.find(m => m.mill_id === mill.mill_id);
                                        if (millToModify) {
                                            setUploadMill(millToModify);
                                            setUploadStep(1);
                                            if (millToModify.current_evaluation_id) {
                                                setUploadData({
                                                    recommendation: millToModify.recommendation,
                                                    risk_level: millToModify.risk_level,
                                                    sourcing_status: millToModify.sourcing_status,
                                                    capacity_ton_per_hour: millToModify.capacity_ton_per_hour,
                                                    traceability_level: millToModify.traceability_level,
                                                    ndpe_violation_found: millToModify.ndpe_violation_found,
                                                    public_grievance_flag: millToModify.public_grievance_flag,
                                                    deforestation_alerts: millToModify.deforestation_alerts,
                                                    hotspot_alerts: millToModify.hotspot_alerts,
                                                    ffb_source_own_pct: millToModify.ffb_source_own_pct,
                                                    ffb_source_plasma_pct: millToModify.ffb_source_plasma_pct,
                                                    ffb_source_independent_pct: millToModify.ffb_source_independent_pct,
                                                });
                                            } else {
                                                setUploadData({ sourcing_status: millToModify.sourcing_status });
                                            }
                                            setUploadModalOpen(true);
                                        }
                                    }}
                                    className="text-green-600 hover:text-green-800 font-medium"
                                >
                                    {mill.current_evaluation_id ? 'Edit' : 'Create'}
                                </button>
                            )
                        ) : (
                            mill.evaluation_status === 'Not Evaluated' && (
                                <button
                                    onClick={() => handleRequestEvaluation(mill)}
                                    className="text-green-600 hover:text-green-800 font-medium"
                                >
                                    Request
                                </button>
                            )
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600">
              Showing {filteredMills.length} of {statistics.total} mills
            </p>
          </div>
        </div>
        )}
      </div>
            </div>
        )
    }

    if (view === 'detail' && selectedMill) {
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
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusBadgeColor(selectedMill.evaluation_status)}`}>
                      {selectedMill.evaluation_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
    
            <div className="max-w-full mx-auto px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
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
                        <p className="text-sm text-gray-600">Capacity (T/H)</p>
                        <p className="font-medium text-sm text-gray-900">{selectedMill.capacity_ton_per_hour} T/H</p>
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
                              <p className="text-sm text-gray-600">Last Updated</p>
                              <p className="font-medium text-sm text-gray-900 mt-1">{selectedMill.last_updated}</p>
                            </div>
                          </div>
    
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
    
                <div className="space-y-4">
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
                    </div>
                  </div>
    
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Stats</h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                          <span className="text-gray-600">Sourcing Status</span>
                          <span className="font-medium text-gray-900">{selectedMill.sourcing_status || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engagement</span>
                        <span className="font-medium text-gray-900">{selectedMill.group_engagement}</span>
                      </div>
                      {selectedMill.last_updated && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated</span>
                          <span className="font-medium text-gray-900">{selectedMill.last_updated}</span>
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
                      <p className="text-sm font-semibold text-gray-900">{selectedMill.last_updated}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Last Updated</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedMill.last_updated}</p>
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
                  <div className="lg:col-span-2 space-y-6">
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
      
                  <div className="space-y-6">
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
      
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Actions</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setView('detail');
                          }}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          View Full Mill Detail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
    }
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
                        {idx < ASANA_WORKFLOW_STEPS.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200">
                            {isCompleted && <div className="w-full bg-green-500 h-full"></div>}
                          </div>
                        )}
    
                        <div className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all ${
                          isCurrent ? 'border-blue-500 bg-blue-50' :
                          isCompleted ? 'border-green-500 bg-green-50' :
                          'border-gray-200 bg-white'
                        }`}>
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
                        href={selectedMill.current_asana_task_url || '#'}
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
                      
                      <div className={`mt-3 p-3 rounded-lg ${
                        userRole === 'Sustainability Team' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <p className={`text-sm font-medium ${
                          userRole === 'Sustainability Team' ? 'text-green-900' : 'text-blue-900'
                        }`}>
                          Current Role: {userRole}
                        </p>
                        {userRole === 'Sustainability Team' ? (
                          <p className="text-xs text-green-700 mt-1">✓ You can create and edit evaluation forms</p>
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

    return <div>Loading...</div>;
}

export default App;