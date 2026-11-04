import os
import json

REPO_DIR = r"C:\Users\Varad\Documents\GitHub\SAP-experince-centre"
APPS_DIR = os.path.join(REPO_DIR, "content", "apps")
SOLUTIONS_PATH = os.path.join(REPO_DIR, "content", "solutions.json")
PILLARS_PATH = os.path.join(REPO_DIR, "content", "pillars.json")
OUT_DIR = os.path.join(REPO_DIR, "demo_information")

os.makedirs(OUT_DIR, exist_ok=True)

with open(SOLUTIONS_PATH, "r", encoding="utf-8") as f:
    solutions = json.load(f)

with open(PILLARS_PATH, "r", encoding="utf-8") as f:
    pillars = json.load(f)

pillar_map = {p["id"]: p for p in pillars}

# Group solutions by pillar
by_pillar = {}
for s in solutions:
    pid = s["pillarId"]
    if pid not in by_pillar:
        by_pillar[pid] = []
    by_pillar[pid].append(s)

def format_app(slug):
    fpath = os.path.join(APPS_DIR, f"{slug}.json")
    if not os.path.exists(fpath):
        return f"### {slug}\n*Error: file {slug}.json not found*\n\n"

    with open(fpath, "r", encoding="utf-8") as f:
        data = json.load(f)

    out = []
    out.append(f"## {data.get('title', slug)}")
    out.append(f"- **Slug**: `{slug}`")
    out.append(f"- **Hero Headline**: {data.get('heroHeadline', 'N/A')}")
    out.append(f"- **Basic Intro**: {data.get('basicIntro', 'N/A')}")
    out.append(f"- **SAP Components**: {', '.join(data.get('sapComponents', []))}")
    out.append("")
    out.append("### 8-Slide Presentation Walkthrough & Bot Dialogue")
    out.append("")

    for c in data.get("cards", []):
        c_idx = c.get("index", 0) + 1
        c_type = c.get("type", "unknown").upper()
        c_title = c.get("title", "Untitled")
        c_pose = c.get("botPose", "idle")
        c_dialogue = c.get("botDialogue", "")

        out.append(f"#### Slide {c_idx}: [{c_type}] {c_title}")
        out.append(f"- **Aayam Pose**: `{c_pose}`")
        out.append(f"- **Aayam Dialogue**: *\"{c_dialogue}\"*")

        if "stat" in c:
            out.append(f"- **Key Stat**: **{c['stat'].get('number', '')}** — {c['stat'].get('label', '')}")

        if "bullets" in c and c["bullets"]:
            out.append("- **Bullet Points**:")
            for b in c["bullets"]:
                out.append(f"  * {b}")

        if "screenshot" in c:
            out.append(f"- **Live UI Screenshot**: `{c['screenshot']}`")

        if "hotspots" in c and c["hotspots"]:
            out.append("- **Interactive Hotspots**:")
            for h in c["hotspots"]:
                out.append(f"  * `({h.get('x')}%, {h.get('y')}%)` **{h.get('label')}**: {h.get('tooltip')}")

        if "steps" in c and c["steps"]:
            out.append("- **Workflow Steps**:")
            for st in c["steps"]:
                out.append(f"  * **Step {st.get('step')}: {st.get('title')}** -> {st.get('desc')} *[SAP Action: {st.get('sapAction')}]*")

        if "chips" in c and c["chips"]:
            out.append("- **Tech Topology Chips**:")
            for ch in c["chips"]:
                out.append(f"  * **{ch.get('layer')}**: {ch.get('tech')}")

        if "metrics" in c and c["metrics"]:
            out.append("- **Quantified ROI Metrics**:")
            for m in c["metrics"]:
                out.append(f"  * **{m.get('value')}** ({m.get('label')}) | Delta: `{m.get('delta', 'N/A')}`")

        if "actions" in c and c["actions"]:
            out.append("- **Next Steps Actions**:")
            for a in c["actions"]:
                out.append(f"  * {a.get('label')} `[Type: {a.get('type')}]`")

        out.append("")

    closing = data.get("closing", {})
    out.append("### Closing Slide & Tenant Info")
    out.append(f"- **Live Tenant Info**: {closing.get('liveDemoInfo', 'Available on request')}")
    out.append(f"- **Feedback Form**: `{closing.get('feedbackUrl', '')}`")
    out.append("")
    out.append("---")
    out.append("")
    return "\n".join(out)

# 1. PILLAR 1 File
p1_content = [
    "# PILLAR 1: Foundation & BTP Infrastructure",
    "**Pillar Focus**: SAP BTP vibe coding, reverse-proxy connectivity mesh, and hybrid integration suites.",
    f"**Total Applications**: {len(by_pillar.get('p1', []))}",
    "",
    "---",
    ""
]
for s in by_pillar.get("p1", []):
    p1_content.append(format_app(s["slug"]))

with open(os.path.join(OUT_DIR, "PILLAR_1_FOUNDATION_BTP.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(p1_content))

# 2. PILLAR 2 File
p2_content = [
    "# PILLAR 2: Custom BTP Applications & Core Extensions",
    "**Pillar Focus**: Tailored cloud applications extending S/4HANA Order-to-Cash, logistics, finance, and master data.",
    f"**Total Applications**: {len(by_pillar.get('p2', []))}",
    "",
    "---",
    ""
]
for s in by_pillar.get("p2", []):
    p2_content.append(format_app(s["slug"]))

with open(os.path.join(OUT_DIR, "PILLAR_2_CUSTOM_BTP_APPS.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(p2_content))

# 3. PILLAR 3 File
p3_content = [
    "# PILLAR 3: HanaMorph & Data Modernization",
    "**Pillar Focus**: 1:1 visual lineage parity, calculation view modernization, and automated data fabrics.",
    f"**Total Applications**: {len(by_pillar.get('p3', []))}",
    "",
    "---",
    ""
]
for s in by_pillar.get("p3", []):
    p3_content.append(format_app(s["slug"]))

with open(os.path.join(OUT_DIR, "PILLAR_3_HANAMORPH_MODERNIZATION.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(p3_content))

# 4. PILLAR 4 File
p4_content = [
    "# PILLAR 4: SAC Executive Dashboards & Boardroom Steering",
    "**Pillar Focus**: Real-time boardroom decision steering, OEE manufacturing analytics, MRO reliability, and spend intelligence.",
    f"**Total Applications**: {len(by_pillar.get('p4', []))}",
    "",
    "---",
    ""
]
for s in by_pillar.get("p4", []):
    p4_content.append(format_app(s["slug"]))

with open(os.path.join(OUT_DIR, "PILLAR_4_SAC_EXECUTIVE_DASHBOARDS.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(p4_content))

# 5. README Master Index
readme_content = [
    "# AAYAM — AIS EXPERIENCE CENTRE: DEMO INFORMATION REPOSITORY",
    "",
    "This directory contains the complete slide-by-slide and card-by-card audit for all 28 enterprise solutions across the 4 Architectural Pillars.",
    "Use these documents to inspect, verify, and fine-tune every slide's copy, live UI screenshot reference, hotspots, and Aayam's voiceover dialogue.",
    "",
    "## Directory Index",
    "",
    "### [Pillar 1: Foundation & BTP Infrastructure](./PILLAR_1_FOUNDATION_BTP.md)",
    "- `sap-btp-vibe-coding` (SAP BTP Vibe Coding & Enterprise AI)",
    "- `sap-btp-connectivity-mesh` (SAP BTP Connectivity Mesh)",
    "- `hybrid-cloud-integration-suite` (Hybrid Cloud Integration Suite)",
    "",
    "### [Pillar 2: Custom BTP Applications & Core Extensions](./PILLAR_2_CUSTOM_BTP_APPS.md)",
    "- `podzo` (PODZO Logistics Execution)",
    "- `reconly` (RECONLY Automated 3-Way Reconciliation)",
    "- `product-cost-simulator` (Product Cost Simulator)",
    "- `mdr` (MDR Master Data Remediation)",
    "- `invoice-decision-intelligence` (Invoice Decision Intelligence)",
    "- `ais-debug-studio` (AIS ABAP & CDS AI Debug Studio)",
    "- `abap-cloud-syntax-converter` (ABAP Cloud Syntax Converter)",
    "",
    "### [Pillar 3: HanaMorph & Data Modernization](./PILLAR_3_HANAMORPH_MODERNIZATION.md)",
    "- `hanamorph` (HanaMorph Automated SAP HANA to Datasphere Studio)",
    "- `datasphere-lineage-parity` (Datasphere Semantic Lineage Parity)",
    "- `calc-view-optimizer` (Calculation View Topology Optimizer)",
    "- `bw4hana-migration-accelerator` (BW/4HANA Cloud Transformation)",
    "- `doc-intelligence-extractor` (Document Information AI Extractor)",
    "- `contract-intelligence-analyzer` (Contract Intelligence Analyzer)",
    "",
    "### [Pillar 4: SAC Executive Dashboards & Boardroom Steering](./PILLAR_4_SAC_EXECUTIVE_DASHBOARDS.md)",
    "- `manufacturing-yield-scrap` (Manufacturing Yield & Scrap Cockpit)",
    "- `asset-reliability-mro` (Asset Reliability & MRO Optimization)",
    "- `sales-margin-analytics` (Sales & Margin Executive Steering)",
    "- `revenue-analytics` (Revenue & Profitability Intelligence)",
    "- `vendor-management` (Procurement Spend & Vendor Steering)",
    "- `quality-management-analytics` (Quality Management & Inspection Cockpit)",
    "- `autonomous-procurement-agent` (Autonomous Procurement & P2P Intake)",
    "- `clean-core-extensibility-hub` (Clean Core Extensibility Governance)",
    "- `identity-access-governance` (Cloud Identity & Access Governance)",
    "- `esg-sustainability-cockpit` (ESG & Carbon Sustainability Cockpit)",
    "- `supply-chain-control-tower` (Supply Chain Operational Control Tower)",
    "- `cfo-liquidity-planner` (CFO Liquidity & Working Capital Planner)",
    "",
    "---",
    "Generated automatically by AIS Experience Centre Engineering Engine."
]

with open(os.path.join(OUT_DIR, "README.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(readme_content))

print(f"[SUCCESS] Generated complete demo information repository in {OUT_DIR}")
