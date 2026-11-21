import { ActivePoseName } from './poses';

export interface QuickPrompt {
  id: string;
  label: string;
  question: string;
  answer: string;
  pose?: ActivePoseName;
}

const SOLUTION_PROMPTS: Record<string, QuickPrompt[]> = {
  hanamorph: [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does HanaMorph target?',
      answer: 'HanaMorph empowers 5 core personas: Analytics and BI Engineers migrating view models, Data Engineers configuring replication flows and CDC, Migration Program Leads orchestrating wave rollouts, Business Data Owners reviewing column semantics, and Security Architects governing OAuth access.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does HanaMorph comply with SAP Clean Core?',
      answer: 'Zero modifications to S/4HANA core ERP. HanaMorph operates side-by-side on SAP BTP using CAP Node.js, compiling views into standard CSN 2.0 schemas and Datasphere Replication Flows without touching ABAP core logic.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of HanaMorph?',
      answer: 'Reduces view migration cycles by 85% (from 6 months to 3 weeks per wave), eliminates 95% of manual SQL rewrites, deduplicates shared master tables (e.g., MARA, KNA1) to save cloud storage, and guarantees 100% calculation parity.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the HanaMorph architecture work?',
      answer: 'Decoupled 3-tier pipeline: SAPUI5 Migration Cockpit with 4 functional workflows, CAP Node.js Migration Engine on BTP Cloud Foundry, integrating S/4HANA (HDD) via direct catalog extraction with SAP Datasphere via OAuth 2.0 CLI.',
      pose: 'laptop',
    },
  ],
  'ais-debug-studio': [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does AI Debug Studio target?',
      answer: 'ABAP and Cloud Application Developers resolving CDS or AMDP dumps, Enterprise QA and Performance Engineers diagnosing memory bottlenecks, Release and CTS Transport Managers, and SAP Technical Architecture Leads.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does AI Debug Studio comply with Clean Core?',
      answer: 'Operates entirely side-by-side on SAP BTP via ADT (ABAP Development Tools) and SAP AI Core. Captures DevClass and Transport Requests cleanly without injecting unmanaged code into S/4HANA core.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of AI Debug Studio?',
      answer: 'Slashes dump investigation and root-cause isolation time by 60%, eliminates manual log correlation, and enforces strict TR transport governance before code reaches production.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the AI Debug Studio architecture work?',
      answer: 'Next.js and SAPUI5 Developer Cockpit connecting through CAP Node.js orchestration on BTP to SAP AI Core generative reasoning, communicating with S/4HANA via secure Cloud Connector and ADT endpoints.',
      pose: 'laptop',
    },
  ],
  'invoice-decision-intelligence': [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does Invoice Decision Intelligence target?',
      answer: 'Accounts Payable Managers, Financial Controllers, Shared Services AP Specialists, Procurement Buyers resolving price discrepancies, and Chief Accounting Officers (CAOs).',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does this comply with SAP Clean Core?',
      answer: 'Decoupled side-by-side BTP extension reading standard S/4HANA POs and GRs via OData V4 APIs. Automatic MIRO posting is executed via certified standard BAPIs without custom table modifications.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of Invoice Intelligence?',
      answer: 'Automates 85% of straight-through invoice approvals, reduces invoice cycle time from 14 days to 4 hours, and eliminates AP late fees while capturing 100% of available dynamic vendor discounts.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the architecture work?',
      answer: 'Fiori Horizon AP Cockpit on SAP BTP with CAP Node.js decision engine, integrating Document Information Extraction (DOX) AI service and bi-directional S/4HANA OData connectivity.',
      pose: 'laptop',
    },
  ],
  podzo: [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does PODZO target?',
      answer: 'Plant Gate and Security Supervisors, Warehouse Receiving Clerks, Logistics and Transport Coordinators, Supply Chain Operations Directors, and Commercial Compliance Officers.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does PODZO comply with SAP Clean Core?',
      answer: 'Runs as an offline-first PWA on SAP BTP. Performs OCR digitisation and GPS geo-stamping on edge mobile devices, posting standard MIGO Goods Receipts into S/4HANA via public Clean Core APIs.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of PODZO?',
      answer: 'Cuts truck gate turnaround from 45 minutes to 7 minutes, eliminates paper delivery challan loss, and posts instant goods receipts with tamper-evident digital signatures.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the PODZO architecture work?',
      answer: 'Mobile-first React and PWA scanner with offline IndexedDB sync, CAP Node.js backend on BTP Cloud Foundry, and standard S/4HANA REST and OData MIGO integration.',
      pose: 'laptop',
    },
  ],
  reconly: [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does RECONLY target?',
      answer: 'General Ledger Accountants, Financial Controllers, Internal Audit and Compliance Teams, Corporate Treasury Managers, and CFOs managing multi-entity period closures.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does RECONLY comply with Clean Core?',
      answer: 'Side-by-side reconciliation engine on BTP reading ACDOCA universal journal entries via standard CDS views. Generates automated clearing postings via standard BAPIs without altering core accounting tables.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of RECONLY?',
      answer: 'Automates 92% of bank and intercompany reconciliations, accelerates financial close from 10 days to 2 days, and eliminates audit discrepancy penalties with immutable transaction audit trails.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the RECONLY architecture work?',
      answer: 'Executive Reconciliation Cockpit on BTP, CAP fuzzy-matching engine with HANA Vector search, and secure read and write connectivity to S/4HANA ACDOCA and bank statement feeds.',
      pose: 'laptop',
    },
  ],
  'product-cost-simulator': [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does Product Cost Simulator target?',
      answer: 'Industrial Costing Engineers, BOM Specialists, Plant Financial Controllers, Commercial Pricing Directors, and VP Manufacturing.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does this comply with Clean Core?',
      answer: 'Pure side-by-side simulation model on BTP. Extracts standard BOM (MAST, STPO) and routing data without modifying S/4HANA product costing tables (CK11N/CK40N), keeping production master data pristine.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of Product Cost Simulator?',
      answer: 'Compresses complex industrial BOM costing cycles from 5 days down to 15 minutes, achieves 100% target pricing precision, and safeguards profit margins against raw material commodity shifts.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the architecture work?',
      answer: 'Interactive UI5/React costing workspace, CAP Node.js tree-rollup engine with multi-currency sensitivity calculation, and standard S/4HANA BOM OData ingestion.',
      pose: 'laptop',
    },
  ],
  mdr: [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does MDR target?',
      answer: 'Master Data Stewards, Enterprise Data Governance (MDG) Leads, Supply Chain Operations Managers, and IT Compliance Auditors.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does MDR comply with Clean Core?',
      answer: 'External governance and deduplication layer on BTP. Evaluates material (MARA), vendor (LFA1), and customer (KNA1) quality rules externally before staging clean records into S/4HANA via standard validation BAPIs.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of MDR?',
      answer: 'Detects 98% of duplicate records across legacy ERP systems, eliminates procurement misallocations, and reduces master data onboarding time by 75%.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the MDR architecture work?',
      answer: 'Governance cockpit on BTP Cloud Foundry with AI semantic deduplication, automated approval workflows, and standard MDG/S4 integration.',
      pose: 'laptop',
    },
  ],
  'asset-reliability-mro': [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does Asset Reliability target?',
      answer: 'Plant Maintenance Heads, Reliability Engineers, MRO Spare Parts Inventory Controllers, Equipment Asset Managers, and VP Operations.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does this comply with Clean Core?',
      answer: 'SAC cloud analytics layer consuming harmonized Datasphere models. Reads standard PM work orders (AFKO, AUFK) and material stocks (MARD) without altering core maintenance transactions.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of Asset Reliability?',
      answer: 'Boosts Mean Time Between Failures (MTBF) by 22%, reduces emergency breakdown downtime by 35%, and eliminates excess MRO spare parts carrying costs.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the architecture work?',
      answer: 'SAP Analytics Cloud (SAC) operational dashboard consuming real-time analytical models from SAP Datasphere and S/4HANA Plant Maintenance (PM).',
      pose: 'laptop',
    },
  ],
  'manufacturing-yield-scrap': [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does Yield & Scrap Cockpit target?',
      answer: 'Plant Managers, Quality Assurance Directors, Production Shift Supervisors, Continuous Improvement / Lean Specialists, and Industrial Engineers.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does this comply with Clean Core?',
      answer: 'Built on SAP Analytics Cloud with direct analytical views into S/4HANA PP/QM production orders and inspection lots, adhering strictly to zero-custom-table analytics.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of Yield & Scrap Cockpit?',
      answer: 'Reduces scrap rates by 18%, provides real-time shift-level defect root cause isolation, and prevents defective batch shipments before warehouse release.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the architecture work?',
      answer: 'SAC production cockpit driven by real-time S/4HANA Production Planning (PP) and Quality Management (QM) CDS views.',
      pose: 'laptop',
    },
  ],
  'o2c-receivables': [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does O2C Receivables target?',
      answer: 'Credit and Collections Managers, Cash Application Specialists, Accounts Receivable Leads, Corporate Treasurers, and CFOs.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does this comply with Clean Core?',
      answer: 'Cloud analytical cockpit on SAC and Datasphere. Aggregates open billing documents and customer ledger balances via standard S/4HANA SD/FI views without custom modifications.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of O2C Receivables?',
      answer: 'Reduces Days Sales Outstanding (DSO) by 14 days, automates cash collection prioritization, and minimizes bad debt write-offs by 28%.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the architecture work?',
      answer: 'SAP Analytics Cloud dashboard backed by Datasphere harmonization spaces and standard S/4HANA SD/FI analytical pipelines.',
      pose: 'laptop',
    },
  ],
  'procure-to-pay': [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does Procure-to-Pay target?',
      answer: 'Chief Procurement Officers (CPOs), Strategic Sourcing Managers, Category Buyer Leads, AP Operational Supervisors, and Vendor Relationship Executives.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does this comply with Clean Core?',
      answer: 'Operates as a governed SAC analytical solution consuming standard MM/FI CDS views. Full analytical reporting on PO compliance without altering S/4HANA procurement tables.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of Procure-to-Pay?',
      answer: 'Accelerates PO-to-delivery cycles by 24%, resolves GR/IR clearing blockages, and enforces 100% contracted pricing compliance across strategic vendors.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the architecture work?',
      answer: 'SAC enterprise procurement dashboard consuming real-time purchase order, delivery status, and invoice verification feeds from SAP S/4HANA.',
      pose: 'laptop',
    },
  ],
  'revenue-analytics': [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does Revenue Analytics target?',
      answer: 'Chief Revenue Officers (CROs), Commercial FP&A Directors, Regional Sales Vice Presidents, Business Unit Heads, and CFOs.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does this comply with Clean Core?',
      answer: 'Datasphere semantic layer and SAC executive cockpit. Ingests billing and profitability data (CO-PA) via standard analytical interfaces without core ledger customizations.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of Revenue Analytics?',
      answer: 'Delivers multi-dimensional margin visibility in real time, uncovers margin leakage across customer segments, and accelerates pricing recalibration by 40%.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the architecture work?',
      answer: 'Executive SAC dashboard connected to SAP Datasphere analytical models and live S/4HANA Sales & Distribution (SD) billing documents.',
      pose: 'laptop',
    },
  ],
  'sap-btp-vibe-coding': [
    {
      id: 'target-users',
      label: '👥 Target User Groups',
      question: 'What user groups does BTP Vibe Coding target?',
      answer: 'Enterprise Architecture Leaders, Digital Transformation Executives, Cloud Application Developers, Citizen Developers, and IT Innovation Directors.',
      pose: 'tablet',
    },
    {
      id: 'clean-core',
      label: '💎 Clean Core',
      question: 'How does this comply with Clean Core?',
      answer: 'The cornerstone of Clean Core practice: teaches and delivers rapid side-by-side application extensions on SAP BTP using CAP, Fiori Elements, and modern AI acceleration.',
      pose: 'present',
    },
    {
      id: 'roi',
      label: '📈 Business ROI',
      question: 'What is the business ROI of BTP Vibe Coding?',
      answer: 'Accelerates custom app development from months to days, eliminates core ERP technical debt, and empowers enterprise teams to prototype production-ready BTP apps in 48 hours.',
      pose: 'point',
    },
    {
      id: 'architecture',
      label: '⚡ 3-Tier Architecture',
      question: 'How does the architecture work?',
      answer: 'Cloud Foundry developer workspace on SAP BTP leveraging SAP Business Application Studio, CAP Node.js, SAP AI Core, and standard S/4HANA Cloud connectors.',
      pose: 'laptop',
    },
  ],
};

const DEFAULT_PROMPTS: QuickPrompt[] = [
  {
    id: 'target-users',
    label: '👥 Target User Groups',
    question: 'What user groups does this solution target?',
    answer: 'Enterprise architects, process transformation leads, data engineers, and line-of-business managers modernizing ERP operations on SAP BTP.',
    pose: 'tablet',
  },
  {
    id: 'clean-core',
    label: '💎 Clean Core',
    question: 'How does this comply with SAP Clean Core?',
    answer: 'Maintains a clean core by decoupling extensions on SAP BTP, utilizing public OData APIs, and avoiding modifications to standard SAP ERP tables.',
    pose: 'present',
  },
  {
    id: 'roi',
    label: '📈 Business ROI',
    question: 'What is the quantified business ROI?',
    answer: 'Delivers accelerated go-live velocity, reduces manual operational effort, and provides verifiable financial returns across enterprise workflows.',
    pose: 'point',
  },
  {
    id: 'architecture',
    label: '⚡ 3-Tier Architecture',
    question: 'How is the architecture designed?',
    answer: 'Decoupled 3-tier architecture with modern web frontends, SAP BTP CAP runtime services, and secure Cloud Connector integration to core SAP ERP systems.',
    pose: 'laptop',
  },
];

export function getQuickPrompts(slug: string): QuickPrompt[] {
  return SOLUTION_PROMPTS[slug] || DEFAULT_PROMPTS;
}
