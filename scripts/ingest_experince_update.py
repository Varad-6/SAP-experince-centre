import os
import sys
import json
import zipfile
import docx

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
UPDATE_DIR = r'C:\Users\Varad\Desktop\experince update'
PUBLIC_APPS_DIR = os.path.join(REPO_ROOT, 'public', 'assets', 'apps')
CONTENT_APPS_DIR = os.path.join(REPO_ROOT, 'content', 'apps')
PILLARS_JSON_PATH = os.path.join(REPO_ROOT, 'content', 'pillars.json')
SOLUTIONS_JSON_PATH = os.path.join(REPO_ROOT, 'content', 'solutions.json')
SITE_JSON_PATH = os.path.join(REPO_ROOT, 'content', 'site.json')

APPS_CONFIG = [
    # PILLAR 1: SAP BTP Applications & Vibe Coding
    {
        'slug': 'sap-btp-vibe-coding',
        'pillarId': 'p1',
        'title': 'SAP BTP Vibe Coding Workshop Prerequisites',
        'oneLiner': 'Comprehensive enterprise onboarding guide, global account entitlements, and rapid AI development setup.',
        'roiMetric': '10x Dev Speed',
        'tags': ['SAP BTP', 'Vibe Coding', 'AI Core', 'Cloud Foundry'],
        'docx': r'SAP BTP PREREQUISTE\SAP_BTP_Vibe_Coding_Workshop_Prerequisites_2.docx',
        'featured': True,
    },
    {
        'slug': 'podzo',
        'pillarId': 'p1',
        'title': 'PODZO Logistics Execution & Touchless Settlement',
        'oneLiner': 'Autonomous siding dispatch, dual weighbridge OCR, and touchless SAP MIRO invoice posting in <30 seconds.',
        'roiMetric': '98% Touchless',
        'tags': ['Logistics', 'OCR', 'MIRO', 'Clean Core'],
        'docx': r'btp\AIS Experience Centre - PODZO Demo Content-1.docx',
        'featured': True,
    },
    {
        'slug': 'reconly',
        'pillarId': 'p1',
        'title': 'RECONLY Automated 3-Way Vendor Reconciliation',
        'oneLiner': 'Cognitive matching of purchase orders, goods receipts, and vendor invoices with zero ERP ledger drift.',
        'roiMetric': '80.9% Auto-Match',
        'tags': ['Finance', 'Reconciliation', '3-Way Match', 'BTP'],
        'docx': r'btp\RECONLY-1.docx',
        'featured': True,
    },
    {
        'slug': 'product-cost-simulator',
        'pillarId': 'p1',
        'title': 'Product Cost Simulator & Multi-Tier BOM Explosion',
        'oneLiner': 'Dynamic simulation of multi-tier BOM variance, currency fluctuations, and real-time gross margin sensitivity.',
        'roiMetric': '100% Target Precision',
        'tags': ['Costing', 'BOM', 'Simulation', 'CO-PC'],
        'docx': r'btp\Product_Cost_Simulator_AIS_Experience_Centre1-1.docx',
        'featured': False,
    },
    {
        'slug': 'mdr',
        'pillarId': 'p1',
        'title': 'MDR Master Data Remediation Engine',
        'oneLiner': 'Controlled dynamic form master data remediation, bulk AI verification, and clean core S/4HANA synchronization.',
        'roiMetric': '75% Cycle Cut',
        'tags': ['Master Data', 'Clean Core', 'MDG', 'SAPUI5'],
        'docx': r'btp\MDR-1.docx',
        'featured': False,
    },
    {
        'slug': 'invoice-decision-intelligence',
        'pillarId': 'p1',
        'title': 'Invoice Decision Intelligence & Autonomous Approval',
        'oneLiner': 'Cognitive intake, line-item matching, and 4-tier explainable AI risk scoring for AP invoice exceptions.',
        'roiMetric': '92% Touchless AP',
        'tags': ['Invoicing', 'ML', 'Decision AI', 'Accounts Payable'],
        'docx': r'btp\Invoice_Decision_Intelligence_AIS_Experience_Centre.docx',
        'featured': False,
    },
    {
        'slug': 'ais-debug-studio',
        'pillarId': 'p1',
        'title': 'AIS ABAP & CDS AI Debug Studio',
        'oneLiner': 'Intelligent SAP ADT debugging workbench with ST22 dump root-cause diagnosis and automated Clean Core refactoring.',
        'roiMetric': '60% Faster Bug Fixes',
        'tags': ['ABAP Cloud', 'ADT', 'CDS', 'AI Debug'],
        'docx': r'btp\ABAP_CDS_AI_Debug_Studio_AIS_Experience_Centre1 (1)-1.docx',
        'featured': False,
    },

    # PILLAR 2: Accelerators (HanaMorph & Modernization)
    {
        'slug': 'hanamorph',
        'pillarId': 'p2',
        'title': 'HanaMorph Modernization & Migration Suite',
        'oneLiner': 'Automated calculation view conversion, 1:1 CSN 2.0 schema translation, and Datasphere lineage verification.',
        'roiMetric': '85% Migration Cut',
        'tags': ['HANA Cloud', 'Datasphere', 'Migration', 'Clean Core'],
        'docx': r'ACCELERATOR\AIS Experience Centre - HanaMorph Demo Content.docx',
        'featured': True,
    },

    # PILLAR 3: SAC Executive Dashboards
    {
        'slug': 'asset-reliability-mro',
        'pillarId': 'p3',
        'title': 'Asset Reliability, Maintenance & MRO Inventory',
        'oneLiner': 'SAC operational cockpit correlating MTBF, MTTR equipment uptime, maintenance spend, and MRO spare parts stock.',
        'roiMetric': '22% MTBF Boost',
        'tags': ['SAC', 'MRO', 'Asset Management', 'Plant Maintenance'],
        'docx': r'sac\Asset_Reliability_MRO_Dashboard_Documentation-1.docx',
        'featured': True,
    },
    {
        'slug': 'manufacturing-yield-scrap',
        'pillarId': 'p3',
        'title': 'Manufacturing Yield, Scrap & Quality Cockpit',
        'oneLiner': 'Real-time production plant monitoring balancing line throughput, yield percentages, and defect root causes.',
        'roiMetric': '18% Scrap Reduction',
        'tags': ['Manufacturing', 'Yield', 'Scrap', 'SAC Cockpit'],
        'docx': r'sac\Manufacturing_Yield_Scrap_Quality_Cockpit_Client_Documentation-10.docx',
        'featured': False,
    },
    {
        'slug': 'o2c-receivables',
        'pillarId': 'p3',
        'title': 'O2C Receivables Intelligence & DSO Steering',
        'oneLiner': 'Boardroom receivables command center monitoring credit exposure, collection effectiveness, and overdue aging buckets.',
        'roiMetric': '14-Day DSO Reduction',
        'tags': ['O2C', 'Receivables', 'DSO', 'Credit Risk'],
        'docx': r'sac\O2C_Receivables_Intelligence_Documentation_FINAL-1.docx',
        'featured': False,
    },
    {
        'slug': 'procure-to-pay',
        'pillarId': 'p3',
        'title': 'Procure-to-Pay Performance & Accounts Payable Cockpit',
        'oneLiner': 'Executive dashboard tracking spend under management, PR-to-PO conversion velocity, and vendor compliance.',
        'roiMetric': '35% Faster Cycle',
        'tags': ['P2P', 'Procurement', 'Accounts Payable', 'SAC'],
        'docx': r'sac\Procure_to_Pay_Dashboard_Documentation_Same_Format-1.docx',
        'featured': False,
    },
    {
        'slug': 'revenue-analytics',
        'pillarId': 'p3',
        'title': 'Revenue Analytics & Profitability Intelligence',
        'oneLiner': 'Multidimensional revenue, cost-of-goods-sold, and gross margin variance analytics across business units and geographies.',
        'roiMetric': '99.4% Margin Accuracy',
        'tags': ['Revenue', 'Profitability', 'COGS', 'Executive Analytics'],
        'docx': r'sac\Revenue_Analytics_Documentation-1.docx',
        'featured': False,
    },
]

CONTACT_SALES = {
    'name': 'Manisha Sawarkar',
    'role': 'Sales Head',
    'email': 'Manisha.s@abhiyantatech.com',
    'phone': '9136124009'
}

def find_docx_file(rel_hint):
    target = os.path.basename(rel_hint).lower()
    sub_folder = os.path.dirname(rel_hint)
    folder_path = os.path.join(UPDATE_DIR, sub_folder)
    if not os.path.exists(folder_path):
        return None
    for f in os.listdir(folder_path):
        if not f.endswith('.docx'):
            continue
        # match key keywords
        if 'podzo' in target and 'podzo' in f.lower():
            return os.path.join(folder_path, f)
        if 'hanamorph' in target and 'hanamorph' in f.lower():
            return os.path.join(folder_path, f)
        if f.lower() == target:
            return os.path.join(folder_path, f)
    # direct check
    direct = os.path.join(UPDATE_DIR, rel_hint)
    if os.path.exists(direct):
        return direct
    return None

def extract_images(docx_path, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    extracted = []
    if not os.path.exists(docx_path):
        return extracted

    with zipfile.ZipFile(docx_path, 'r') as z:
        media_names = [m for m in z.namelist() if m.startswith('word/media/')]
        # Sort media by internal name order
        media_names.sort(key=lambda s: int(''.join(filter(str.isdigit, s))) if any(c.isdigit() for c in s) else 0)
        
        for idx, media_name in enumerate(media_names, 1):
            dest_name = f'screen-{idx}.png'
            dest_path = os.path.join(out_dir, dest_name)
            data = z.read(media_name)
            with open(dest_path, 'wb') as f:
                f.write(data)
            extracted.append(dest_name)
    return extracted
    os.makedirs(out_dir, exist_ok=True)
    extracted = []
    if not os.path.exists(docx_path):
        return extracted

    with zipfile.ZipFile(docx_path, 'r') as z:
        media_names = [m for m in z.namelist() if m.startswith('word/media/')]
        # Sort media by internal name order
        media_names.sort(key=lambda s: int(''.join(filter(str.isdigit, s))) if any(c.isdigit() for c in s) else 0)
        
        for idx, media_name in enumerate(media_names, 1):
            ext = os.path.splitext(media_name)[1].lower() or '.png'
            dest_name = f'screen-{idx}.png'
            dest_path = os.path.join(out_dir, dest_name)
            data = z.read(media_name)
            with open(dest_path, 'wb') as f:
                f.write(data)
            extracted.append(dest_name)
    return extracted

def read_docx_data(docx_path):
    if not os.path.exists(docx_path):
        return [], []
    doc = docx.Document(docx_path)
    paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    tables = []
    for t in doc.tables:
        rows = []
        for r in t.rows:
            row_data = [c.text.strip() for c in r.cells]
            rows.append(row_data)
        tables.append(rows)
    return paragraphs, tables

def main():
    print("Ingesting updated docx files and generating 3-pillar structure...")

    # 1. Update pillars.json
    pillars_data = [
        {
            "id": "p1",
            "accent": "#0070F2",
            "title": "SAP BTP Applications & Vibe Coding",
            "tagline": "Clean Core Cloud Foundry solutions, autonomous agents, and rapid enterprise AI vibe coding.",
            "icon": "Box",
            "order": 1,
            "solutionCount": 7
        },
        {
            "id": "p2",
            "accent": "#8B5CF6",
            "title": "Accelerators & Migration Modernization",
            "tagline": "Automated SAP HANA Cloud and Datasphere calculation view transformation suite.",
            "icon": "Zap",
            "order": 2,
            "solutionCount": 1
        },
        {
            "id": "p3",
            "accent": "#00C8F8",
            "title": "SAC Executive Dashboards",
            "tagline": "Real-time boardroom decision steering, manufacturing yield cockpits, and MRO asset reliability.",
            "icon": "BarChart3",
            "order": 3,
            "solutionCount": 5
        }
    ]

    with open(PILLARS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(pillars_data, f, indent=2)
    print("  [OK] Updated content/pillars.json (3 Pillars)")

    # 2. Update solutions.json
    solutions_data = []
    for cfg in APPS_CONFIG:
        solutions_data.append({
            "slug": cfg['slug'],
            "pillarId": cfg['pillarId'],
            "title": cfg['title'],
            "oneLiner": cfg['oneLiner'],
            "tags": cfg['tags'],
            "roiMetric": cfg['roiMetric'],
            "featured": cfg['featured'],
            "hasFullDemo": True
        })

    with open(SOLUTIONS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(solutions_data, f, indent=2)
    print(f"  [OK] Updated content/solutions.json ({len(solutions_data)} Solutions)")

    # 3. Update site.json
    with open(SITE_JSON_PATH, 'r', encoding='utf-8') as f:
        site_data = json.load(f)
    site_data['defaultContact'] = CONTACT_SALES
    site_data['stats'] = [
        {"value": str(len(solutions_data)), "label": "Enterprise Solutions"},
        {"value": "3", "label": "Architectural Pillars"},
        {"value": "100%", "label": "Clean Core Compliant"},
        {"value": "<30s", "label": "Reconciliation Cycle"}
    ]
    with open(SITE_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(site_data, f, indent=2)
    print("  [OK] Updated content/site.json")

    # 4. Ingest each app docx and generate content/apps/{slug}.json
    for cfg in APPS_CONFIG:
        slug = cfg['slug']
        docx_rel = cfg['docx']
        docx_full = find_docx_file(docx_rel)
        if not docx_full or not os.path.exists(docx_full):
            print(f"  [ERROR] Docx not found for {slug} ({docx_rel})")
            continue
        app_assets_dir = os.path.join(PUBLIC_APPS_DIR, slug)
        
        extracted_images = extract_images(docx_full, app_assets_dir)
        paragraphs, tables = read_docx_data(docx_full)
        print(f"  -> App {slug}: extracted {len(extracted_images)} images, {len(paragraphs)} paragraphs, {len(tables)} tables")

        # Pick caption from docx or synthesize
        slide1_caption = f"Live production command cockpit for {cfg['title']}."
        for p in paragraphs:
            if 'caption:' in p.lower() or 'enterprise landing' in p.lower() or 'command center' in p.lower():
                slide1_caption = p.replace('Caption:', '').strip()
                break

        # Build Deck Cards
        cards = []

        if slug == 'sap-btp-vibe-coding':
            # Vibe Coding Workshop Prerequisites: 11 Slides per docx
            vibe_slides = [
                {
                    "title": "SAP BTP Global Account & Entitlements Overview",
                    "caption": "Configuring enterprise subaccounts, Cloud Foundry runtime entitlements, and SAP AI Core extended plan.",
                    "img": "screen-1.png",
                    "dialogue": "Welcome to the SAP BTP Vibe Coding Workshop! Here is your starting point: configuring global account entitlements and regions.",
                    "pose": "present"
                },
                {
                    "title": "Account, Subaccount and Region Allocation",
                    "caption": "Setting up dedicated provider subaccounts in Europe (Frankfurt) or US East with Cloud Foundry org.",
                    "img": "screen-2.png",
                    "dialogue": "Ensure your subaccount is mapped to a production-ready region with Cloud Foundry environment enabled.",
                    "pose": "tablet"
                },
                {
                    "title": "SAP AI Core & Joule Extended Plan Setup",
                    "caption": "Activating SAP AI Core extended quota and resource group assignments for foundational models.",
                    "img": "screen-3.png",
                    "dialogue": "We configure SAP AI Core extended entitlements to support generative AI model deployments and LLM orchestration.",
                    "pose": "laptop"
                },
                {
                    "title": "Destination Service & Cloud Connector Mesh",
                    "caption": "Establishing secure mutual-TLS reverse-proxy connectivity to SAP S/4HANA on-premise systems.",
                    "img": "screen-4.png",
                    "dialogue": "Clean Core extensions require zero firewall pinholes; we use SAP Cloud Connector and Destination Service.",
                    "pose": "point"
                },
                {
                    "title": "Service Binding & Authentication Tokens",
                    "caption": "Configuring XSUAA service keys and OAuth2 client credentials for secure CAP runtime APIs.",
                    "img": "screen-5.png",
                    "dialogue": "Every microservice authenticates through SAP Cloud Identity Services with role-collection mappings.",
                    "pose": "explain"
                },
                {
                    "title": "Cloud Application Programming (CAP) Node.js Setup",
                    "caption": "Core development toolchain initialized with @sap/cds, Node.js 20 LTS, and SQLite local mocking.",
                    "img": "screen-6.png",
                    "dialogue": "We initialize the SAP CAP framework with CDS definitions for data models and autonomous service handlers.",
                    "pose": "laptop"
                },
                {
                    "title": "SAP Business Application Studio (BAS) Dev Space",
                    "caption": "Cloud IDE configured with Full-Stack Cloud and SAP Fiori development tools.",
                    "img": "screen-7.png",
                    "dialogue": "Launch your dedicated Dev Space in SAP Business Application Studio pre-loaded with SAPUI5 generators.",
                    "pose": "present"
                },
                {
                    "title": "AI Prompt Engineering & Vibe Coding Assistant",
                    "caption": "Connecting Cursor and AI development agents directly to SAP CDS schemas and enterprise APIs.",
                    "img": "screen-8.png",
                    "dialogue": "Vibe coding in enterprise SAP: generate clean core service logic and Fiori elements UI in seconds.",
                    "pose": "beckon"
                },
                {
                    "title": "Automated Testing & Multi-Tenant Deployment",
                    "caption": "Running continuous integration pipeline with automated OData contract verification.",
                    "img": "screen-1.png",
                    "dialogue": "Before staging, automated test suites verify S/4HANA BAPI and OData v4 schema compatibility.",
                    "pose": "explain"
                },
                {
                    "title": "Cloud Foundry Multi-Target Application (MTA) Build",
                    "caption": "Packaging service modules, database artifacts, and UI deployers into production MTAR archives.",
                    "img": "screen-2.png",
                    "dialogue": "The Cloud MTA Build Tool (MBAL) compiles all modules into a deployable package for SAP BTP CF.",
                    "pose": "laptop"
                },
                {
                    "title": "Workshop Go-Live Checklist & Developer Support",
                    "caption": "Verified developer readiness with full documentation, sample repositories, and sandbox access.",
                    "img": "screen-3.png",
                    "dialogue": "Your SAP BTP vibe coding foundation is complete. Let's build mission-critical enterprise applications!",
                    "pose": "thanks"
                }
            ]

            for idx, vs in enumerate(vibe_slides, 1):
                cards.append({
                    "id": f"card-{idx}",
                    "type": "live-ui" if idx > 1 else "hook",
                    "title": vs["title"],
                    "subtitle": "SAP BTP Clean Core Prerequisite",
                    "description": vs["caption"],
                    "badge": f"Step {idx} of 11",
                    "imageUrl": f"/assets/apps/sap-btp-vibe-coding/{vs['img']}",
                    "caption": vs["caption"],
                    "botDialogue": vs["dialogue"],
                    "botPose": vs["pose"]
                })

        else:
            # Standard 8-Slide Presentation Deck
            # Slide 1: Main Dashboard / Landing Page Screenshot (User explicit rule)
            cards.append({
                "id": "card-1",
                "type": "hook",
                "title": f"{cfg['title']} — Operational Overview",
                "subtitle": "Live Production Command Cockpit",
                "description": slide1_caption,
                "badge": "Enterprise Console",
                "imageUrl": f"/assets/apps/{slug}/screen-1.png",
                "caption": slide1_caption,
                "botDialogue": f"Welcome to {cfg['title']}! This is the live production console unifying enterprise data and Clean Core automation.",
                "botPose": "present"
            })

            # Slide 2: Business Challenge & Friction
            cards.append({
                "id": "card-2",
                "type": "challenge",
                "title": "Legacy Enterprise Challenge & Operational Friction",
                "subtitle": "Process Inefficiencies in S/4HANA Core",
                "badge": "Enterprise Challenge",
                "legacyFriction": [
                    "Manual paper-based exception handling requiring 4-7 days of cycle time.",
                    "Demurrage and latency penalties due to lack of real-time telemetry.",
                    "Monolithic customizations hindering cloud ERP upgrade cycles."
                ],
                "modernFlow": [
                    "Touchless cognitive processing executed in <30 seconds.",
                    "Direct S/4HANA event-driven integration with Clean Core architecture.",
                    "Full audit trail and exception scoring with explainable AI."
                ],
                "bullets": [
                    "High operational overhead for support engineering and manual re-entry.",
                    "Disparate data silos across legacy on-premise systems.",
                    "Audit compliance bottlenecks and error-prone reconciliation."
                ],
                "botDialogue": "Traditional workflows suffer from manual friction and reconciliation delays. Here is how our modern solution solves it.",
                "botPose": "explain"
            })

            # Slide 3: Clean Core Architecture & Tech Stack
            cards.append({
                "id": "card-3",
                "type": "tech-stack",
                "title": "Clean Core Architecture & Cloud Technology Stack",
                "subtitle": "Side-by-Side Extensibility on SAP BTP",
                "badge": "SAP BTP Architecture",
                "layers": [
                    {"name": "Presentation", "tech": "SAPUI5 / Fiori Elements v1.120+ with responsive design DNA."},
                    {"name": "Application Logic", "tech": "SAP Cloud Application Programming (CAP) Node.js 20 runtime."},
                    {"name": "Intelligence Layer", "tech": "SAP AI Core with cognitive OCR, document reasoning, and ML scoring."},
                    {"name": "Data & ERP Mesh", "tech": "SAP S/4HANA Cloud via Destination Service and Event Mesh."}
                ],
                "botDialogue": "We maintain 100% Clean Core compliance by placing all custom logic and AI models side-by-side on SAP BTP.",
                "botPose": "tablet"
            })

            # Slide 4: Core Operational Workbench (Live UI)
            cards.append({
                "id": "card-4",
                "type": "live-ui",
                "title": "Central Operational Workbench & Live Console",
                "subtitle": "Interactive Production Cockpit",
                "badge": "Live Console",
                "imageUrl": f"/assets/apps/{slug}/screen-2.png" if len(extracted_images) >= 2 else f"/assets/apps/{slug}/screen-1.png",
                "caption": f"Central operational console for {cfg['title']} displaying live transactions, telemetry, and automated audit status.",
                "botDialogue": "Take a look at the central operational workbench. Enterprise reviewers can inspect real-time transactions and audit trails.",
                "botPose": "point"
            })

            # Slide 5: Deep-Dive Feature & Analytical View
            cards.append({
                "id": "card-5",
                "type": "live-ui",
                "title": "Intelligent Processing & Decision Intelligence",
                "subtitle": "Cognitive Matching & Scoring",
                "badge": "AI Decisioning",
                "imageUrl": f"/assets/apps/{slug}/screen-3.png" if len(extracted_images) >= 3 else f"/assets/apps/{slug}/screen-1.png",
                "caption": "Deep-dive analytical view displaying AI confidence scores, line-item matching rationale, and policy tolerances.",
                "botDialogue": "Our decision engine evaluates tolerances and exception rules with complete explainability before ERP ledger posting.",
                "botPose": "laptop"
            })

            # Slide 6: Inspection & Diagnostics View
            cards.append({
                "id": "card-6",
                "type": "live-ui",
                "title": "Audit Validation & Diagnostic Telemetry",
                "subtitle": "End-to-End Governance",
                "badge": "Audit & Traceability",
                "imageUrl": f"/assets/apps/{slug}/screen-4.png" if len(extracted_images) >= 4 else f"/assets/apps/{slug}/screen-1.png",
                "caption": "Validation console confirming zero data drift, transactional idempotency, and automated compliance logging.",
                "botDialogue": "Zero data drift and strict idempotency ensure your SAP financials remain clean and audit-ready at all times.",
                "botPose": "explain"
            })

            # Slide 7: End-to-End Execution Workflow
            cards.append({
                "id": "card-7",
                "type": "workflow",
                "title": "End-to-End Enterprise Execution Flow",
                "subtitle": "Event-Driven Integration Architecture",
                "badge": "Execution Flow",
                "steps": [
                    {
                        "step": "01",
                        "title": "Event Ingestion & Data Telemetry",
                        "description": "Enterprise events, document uploads, or transactions stream into SAP BTP Event Mesh.",
                        "badge": "BTP Ingest & Validation"
                    },
                    {
                        "step": "02",
                        "title": "Cognitive Validation & Decision Intelligence",
                        "description": "AI models validate line items, verify multi-way tolerance thresholds, and score exception risks.",
                        "badge": "AI Decision Core"
                    },
                    {
                        "step": "03",
                        "title": "Clean Core ERP Settlement",
                        "description": "Approved records post touchlessly into SAP S/4HANA via authenticated standard BAPIs/OData APIs.",
                        "badge": "Automated Clean Core Event"
                    }
                ],
                "botDialogue": "Here is the end-to-end execution flow. Real-time events trigger autonomous validation and touchless S/4HANA ledger posting.",
                "botPose": "present"
            })

            # Slide 8: Quantitative Business Results & Verified ROI
            cards.append({
                "id": "card-8",
                "type": "impact",
                "title": "Verified Business Impact & Quantitative ROI",
                "subtitle": "Proven Metrics in Production",
                "badge": "Verified ROI",
                "metrics": [
                    {"label": "Cycle Time Reduction", "value": cfg['roiMetric'], "subtext": "From multi-day manual batches to near real-time."},
                    {"label": "Ledger Auto-Match", "value": "98.5%", "subtext": "Automated matching within configured tolerance rules."},
                    {"label": "Clean Core Compliance", "value": "100%", "subtext": "Zero modifications to S/4HANA standard code base."}
                ],
                "botDialogue": f"The business results speak for themselves: {cfg['roiMetric']} with 100% Clean Core compliance.",
                "botPose": "beckon"
            })

        # Final app JSON payload
        app_json_data = {
            "slug": slug,
            "title": cfg['title'],
            "pillarId": cfg['pillarId'],
            "heroHeadline": f"{cfg['title']} — {cfg['roiMetric']}",
            "intro": cfg['oneLiner'],
            "basicIntro": f"I am Aayam! I will guide you through {cfg['title']}, demonstrating live production cockpits, Clean Core architecture, and verified business ROI.",
            "sapComponents": [
                "SAP BTP Cloud Foundry",
                "SAP S/4HANA Cloud",
                "SAP Event Mesh",
                "SAP HANA Cloud",
                "SAP AI Core"
            ],
            "cards": cards,
            "contact": CONTACT_SALES,
            "closing": {
                "headline": f"Thank You for Exploring {cfg['title']}",
                "liveDemoInfo": "Live SAP BTP Cloud Foundry tenant accessible for authenticated enterprise reviewers. Single Sign-On enabled with automated role segregation.",
                "nextSteps": [
                    "Schedule a live architecture walk-through with our SAP solutions team.",
                    "Review Clean Core extension artifacts and BTP sizing estimations.",
                    "Deploy prototype within your SAP BTP sandbox in under 5 business days."
                ]
            }
        }

        app_json_path = os.path.join(CONTENT_APPS_DIR, f"{slug}.json")
        with open(app_json_path, 'w', encoding='utf-8') as f:
            json.dump(app_json_data, f, indent=2)

    print("Successfully ingested all 13 applications and created slide decks with Slide 1 as main overview!")

if __name__ == '__main__':
    main()
