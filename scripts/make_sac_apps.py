import json
import os

apps = {
  'revenue-analytics': {
    'slug': 'revenue-analytics',
    'pillarId': 'p4',
    'title': 'Revenue & Profitability Intelligence',
    'heroHeadline': 'Multi-Dimensional Revenue Waterfalls, Margin Drill-Downs & Product Profitability',
    'basicIntro': 'Welcome to Revenue & Profitability Intelligence! I am Aayam. Let me show you how our executive SAC dashboards unify sales and financial margin drivers across business units.',
    'sapComponents': ['SAP Analytics Cloud (SAC)', 'SAP Datasphere', 'SAP S/4HANA Sales & Distribution (SD)', 'SAP S/4HANA Profitability Analysis (CO-PA)'],
    'stat': {'number': '+3.1%', 'label': 'Top-Line Revenue Lift'},
    'bullets': [
      'Dispersed financial and sales datasets obscure customer and product profitability.',
      'Manual revenue reporting delays executive margin optimization decisions.',
      'Lack of real-time variance analysis between booked revenue and gross margin contribution.'
    ],
    'screenshot': '/assets/apps/revenue-analytics/screen-1.png',
    'hotspots': [
      {'x': 25, 'y': 30, 'label': 'Net Revenue Telemetry', 'tooltip': 'Consolidated global net revenue with real-time currency conversion.'},
      {'x': 65, 'y': 48, 'label': 'Gross Margin Waterfall', 'tooltip': 'Multi-tier variance breakdown from gross sales to EBITDA.'},
      {'x': 80, 'y': 70, 'label': 'Customer Segment Matrix', 'tooltip': 'Drill-down into top 20% revenue-generating enterprise accounts.'}
    ],
    'steps': [
      {'step': 1, 'title': 'Data Harmonization in Datasphere', 'desc': 'Unify SD billing lines with CO-PA actuals into curated Data Products.', 'sapAction': 'Datasphere Semantic Model'},
      {'step': 2, 'title': 'Real-Time Margin Calculation', 'desc': 'Compute net revenue, direct cost allocations, and contribution margin variance.', 'sapAction': 'SAC Analytical Engine'},
      {'step': 3, 'title': 'Executive Decision Steering', 'desc': 'Enable boardroom drill-downs by region, product category, and customer tier.', 'sapAction': 'SAC Executive Story'}
    ],
    'chips': [
      {'layer': 'Presentation', 'tech': 'SAP Analytics Cloud (SAC)'},
      {'layer': 'Data Fabric', 'tech': 'SAP Datasphere'},
      {'layer': 'Source ERP', 'tech': 'SAP S/4HANA SD / CO-PA'},
      {'layer': 'Data Modeling', 'tech': 'SAC Calculated Dimensions'},
      {'layer': 'Security', 'tech': 'SAP Cloud Identity Services'}
    ],
    'metrics': [
      {'value': '+3.1%', 'label': 'Revenue Lift', 'delta': '+2.8%'},
      {'value': '-40%', 'label': 'Reporting Effort', 'delta': '-15 hrs/wk'},
      {'value': '100%', 'label': 'Audit Traceability', 'delta': 'Sub-second'}
    ]
  },
  'vendor-management': {
    'slug': 'vendor-management',
    'pillarId': 'p4',
    'title': 'Procurement Spend & Vendor Performance Steering',
    'heroHeadline': 'Centralized View of Spend, Price Variance & Off-Contract Spend Leakage',
    'basicIntro': 'Welcome to Procurement Spend & Vendor Performance Steering! I am Aayam. Let me show you how our SAC dashboard provides real-time visibility into supplier compliance and spend leakage.',
    'sapComponents': ['SAP Analytics Cloud (SAC)', 'SAP Datasphere', 'SAP S/4HANA Materials Management (MM)', 'SAP S/4HANA Accounts Payable (FI-AP)'],
    'stat': {'number': '12%', 'label': 'Cost Leakage Avoided'},
    'bullets': [
      'Lack of centralized visibility across the end-to-end Procure-to-Pay lifecycle.',
      'Uncontrolled off-contract spending and Maverick purchasing eroding supplier discounts.',
      'Manual reporting making it difficult to identify supplier delivery delays and quality issues.'
    ],
    'screenshot': '/assets/apps/vendor-management/screen-1.png',
    'hotspots': [
      {'x': 25, 'y': 30, 'label': 'Procurement Spend Overview', 'tooltip': 'Categorized spend breakdown across Direct, Indirect, and CAPEX categories.'},
      {'x': 65, 'y': 48, 'label': 'Price Variance Heatmap', 'tooltip': 'Tracking purchase price variance (PPV) against standard contract rates.'},
      {'x': 80, 'y': 70, 'label': 'Vendor Scorecard & OTIF', 'tooltip': 'Supplier On-Time In-Full (OTIF) delivery metrics and defect rates.'}
    ],
    'steps': [
      {'step': 1, 'title': 'P2P Data Integration', 'desc': 'Combine POs, goods receipts, vendor masters, and invoices from S/4HANA.', 'sapAction': 'Datasphere Ingestion'},
      {'step': 2, 'title': 'Spend & Variance Computation', 'desc': 'Identify off-contract transactions, price variations, and payment discount losses.', 'sapAction': 'SAC Story Analytics'},
      {'step': 3, 'title': 'Strategic Sourcing Action', 'desc': 'Arm procurement leadership with renegotiation data and compliance enforcement.', 'sapAction': 'Supplier Contract Renewal'}
    ],
    'chips': [
      {'layer': 'Presentation', 'tech': 'SAP Analytics Cloud (SAC)'},
      {'layer': 'Data Fabric', 'tech': 'SAP Datasphere'},
      {'layer': 'Source ERP', 'tech': 'SAP S/4HANA MM / FI-AP'},
      {'layer': 'Analytics', 'tech': 'SAC Smart Insights'},
      {'layer': 'Security', 'tech': 'XSUAA Role Collections'}
    ],
    'metrics': [
      {'value': '12%', 'label': 'Spend Leakage Saved', 'delta': '+$2.4M'},
      {'value': '94%', 'label': 'On-Contract Spend', 'delta': '+22%'},
      {'value': '85%', 'label': 'Vendor OTIF Compliance', 'delta': '+15%'}
    ]
  },
  'quality-management-analytics': {
    'slug': 'quality-management-analytics',
    'pillarId': 'p4',
    'title': 'Quality Management & Inspection Cockpit',
    'heroHeadline': 'Unified View of Inspection Lots, Rejection Rates & Cost of Poor Quality',
    'basicIntro': 'Welcome to Quality Management & Inspection Cockpit! I am Aayam. Let me show you how we connect production confirmations with QM inspection lots to stop scrap before it spreads.',
    'sapComponents': ['SAP Analytics Cloud (SAC)', 'SAP Datasphere', 'SAP S/4HANA Quality Management (QM)', 'SAP S/4HANA Production Planning (PP)'],
    'stat': {'number': '-30%', 'label': 'Defect Recurrence'},
    'bullets': [
      'Quality inspection data isolated from production confirmations and supplier lots.',
      'Delayed root-cause analysis when defect rates spike across manufacturing shifts.',
      'Rising Cost of Poor Quality (COPQ) without visibility into supplier-related returns.'
    ],
    'screenshot': '/assets/apps/quality-management-analytics/screen-1.png',
    'hotspots': [
      {'x': 25, 'y': 30, 'label': 'First-Pass Yield Metric', 'tooltip': 'Real-time production yield and lot acceptance rate across plants.'},
      {'x': 65, 'y': 48, 'label': 'Defect Pareto Matrix', 'tooltip': 'Root-cause ranking by material, vendor lot, machine, and shift.'},
      {'x': 80, 'y': 70, 'label': 'Supplier Quality Scorecard', 'tooltip': 'Incoming goods rejection rates and vendor return credit notes.'}
    ],
    'steps': [
      {'step': 1, 'title': 'Inspection Lot Aggregation', 'desc': 'Extract QM inspection results, defects, and notifications from S/4HANA.', 'sapAction': 'QM Data Product Ingestion'},
      {'step': 2, 'title': 'Pareto & Trend Analysis', 'desc': 'Correlate scrap events with work centers, shifts, and raw material vendor lots.', 'sapAction': 'SAC Analytical Model'},
      {'step': 3, 'title': 'Corrective Action Workflow', 'desc': 'Trigger automated CAPA quality notifications and supplier quality holds.', 'sapAction': 'S/4HANA QM Notification'}
    ],
    'chips': [
      {'layer': 'Presentation', 'tech': 'SAP Analytics Cloud (SAC)'},
      {'layer': 'Data Fabric', 'tech': 'SAP Datasphere'},
      {'layer': 'Source ERP', 'tech': 'SAP S/4HANA QM / PP / MM'},
      {'layer': 'Modeling', 'tech': 'Datasphere Quality View'},
      {'layer': 'Security', 'tech': 'Role-Based Row Security'}
    ],
    'metrics': [
      {'value': '-30%', 'label': 'Defect Recurrence', 'delta': '-18% COPQ'},
      {'value': '99.2%', 'label': 'Lot Inspection Compliance', 'delta': '+8%'},
      {'value': '<4h', 'label': 'Root-Cause Identification', 'delta': '-4 days'}
    ]
  }
}

contact = {
  'name': 'Varad Rane',
  'role': 'Chief SAP Solutions Architect',
  'email': 'contact@abhiyantaindia.com',
  'phone': '+91 (022) 6982-1000',
  'teamsUrl': 'https://teams.microsoft.com/l/chat/0/0?users=contact@abhiyantaindia.com'
}

out_dir = r'C:\Users\Varad\Documents\GitHub\SAP-experince-centre\content\apps'

for slug, d in apps.items():
    cards = [
      {
        'index': 0,
        'type': 'hook',
        'title': 'Strategic Opportunity & Executive Visibility',
        'botPose': 'present',
        'botDialogue': f"Welcome! I am Aayam. Let's inspect {d['title']}. Here is how we transform enterprise steering velocity.",
        'stat': d['stat'],
        'bullets': d['bullets']
      },
      {
        'index': 1,
        'type': 'challenge',
        'title': 'Operational Process Friction',
        'botPose': 'explain',
        'botDialogue': 'Notice the process friction points: fragmented data silos, delayed analytics, and lack of real-time drill-down capabilities.',
        'visual': 'pain-matrix',
        'bullets': d['bullets']
      },
      {
        'index': 2,
        'type': 'solution',
        'title': 'Data Fabric & Analytics Architecture',
        'botPose': 'tablet',
        'botDialogue': 'Here is our analytics architecture: SAP Datasphere provides a unified business semantic layer directly consumed by SAP Analytics Cloud.',
        'diagram': {
          'nodes': [
            {'id': 'n1', 'label': 'SAP S/4HANA Core Ledgers'},
            {'id': 'n2', 'label': 'SAP Datasphere Data Fabric'},
            {'id': 'n3', 'label': 'SAC Semantic Modeling'},
            {'id': 'n4', 'label': 'Boardroom Executive Story'}
          ],
          'edges': [
            {'from': 'n1', 'to': 'n2'},
            {'from': 'n2', 'to': 'n3'},
            {'from': 'n3', 'to': 'n4'}
          ]
        }
      },
      {
        'index': 3,
        'type': 'live-ui',
        'title': 'Interactive Executive Dashboard',
        'botPose': 'point',
        'botDialogue': 'Let us inspect the live production dashboard. Every KPI connects to live S/4HANA enterprise master data.',
        'screenshot': d['screenshot'],
        'hotspots': d['hotspots']
      },
      {
        'index': 4,
        'type': 'workflow',
        'title': 'End-to-End Governance Flow',
        'botPose': 'tablet',
        'botDialogue': 'From data ingestion to C-suite decision steering, the analytical pipeline runs with sub-second responsiveness.',
        'steps': d['steps']
      },
      {
        'index': 5,
        'type': 'tech-stack',
        'title': 'SAP Architecture Topology',
        'botPose': 'laptop',
        'botDialogue': 'Built on SAP Analytics Cloud and SAP Datasphere, fully compliant with Clean Core principles and zero modifications.',
        'chips': d['chips']
      },
      {
        'index': 6,
        'type': 'impact',
        'title': 'Quantified Business ROI',
        'botPose': 'present',
        'botDialogue': 'Measurable impact delivered across executive operations, working capital, and governance agility.',
        'metrics': d['metrics']
      },
      {
        'index': 7,
        'type': 'cta',
        'title': 'Deployment Readiness & Next Steps',
        'botPose': 'beckon',
        'botDialogue': f"Ready to deploy {d['title']} on your SAP landscape? Schedule an executive briefing with our architecture team.",
        'actions': [
          {'label': 'Interactive Architecture Demo', 'type': 'demo'},
          {'label': 'Landscape Prerequisites', 'type': 'prereq'},
          {'label': 'Clean Core Architecture Review', 'type': 'architecture'}
        ]
      }
    ]

    record = {
      'slug': slug,
      'pillarId': 'p4',
      'title': d['title'],
      'heroHeadline': d['heroHeadline'],
      'basicIntro': d['basicIntro'],
      'sapComponents': d['sapComponents'],
      'hasContent': True,
      'cards': cards,
      'contact': contact,
      'closing': {
        'liveDemoInfo': 'Live SAP Analytics Cloud tenant accessible for authenticated enterprise reviewers. Single Sign-On enabled.',
        'feedbackUrl': f'https://forms.office.com/r/abhiyanta-{slug}',
        'contact': contact
      }
    }

    fpath = os.path.join(out_dir, f'{slug}.json')
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(record, f, indent=2)
    print(f'Created {fpath}')
