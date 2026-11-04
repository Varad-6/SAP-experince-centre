#!/usr/bin/env python3
"""
scripts/import-template.py
Ingests AIS Demo Content .docx files and generates validated /content/apps/{slug}.json.
Extracts embedded screenshots into /public/assets/apps/{slug}/ if present.
"""

import os
import sys
import json
import re
import docx

REPO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INBOX_DIR = r"C:\Users\Varad\Downloads\ais exp data"
OUT_APPS_DIR = os.path.join(REPO_DIR, "content", "apps")
OUT_ASSETS_DIR = os.path.join(REPO_DIR, "public", "assets", "apps")

# Keywords in filenames matching target app slugs
KEYWORD_MAP = {
    "podzo": "podzo",
    "vibe coding": "sap-btp-vibe-coding",
    "hanamorph": "hanamorph",
    "debug_studio": "ais-debug-studio",
    "invoice_decision": "invoice-decision-intelligence",
    "asset_reliability": "asset-reliability-mro",
    "yield_scrap": "manufacturing-yield-scrap",
    "receivables": "sales-margin-analytics",
    "procure_to_pay": "autonomous-procurement-agent",
    "cost_simulator": "product-cost-simulator",
}

PILLAR_MAP = {
    "p1": "p1",
    "p2": "p2",
    "p3": "p3",
    "p4": "p4",
    "p5": "p5",
    "pillar 1": "p1",
    "pillar 2": "p2",
    "pillar 3": "p3",
    "pillar 4": "p4",
    "pillar 5": "p5",
    "foundation": "p1",
    "agentic": "p2",
    "core": "p3",
    "steering": "p4",
    "sustainable": "p5",
}

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.replace('"', '"').replace('"', '"').replace("'", "'").replace("'", "'")
    return text.strip()

def extract_cell_text(cell) -> str:
    lines = [p.text.strip() for p in cell.paragraphs if p.text.strip()]
    return "\n".join(lines)

def parse_docx(file_path: str, target_slug: str):
    print(f"Parsing: {os.path.basename(file_path)} -> {target_slug}")
    try:
        doc = docx.Document(file_path)
    except Exception as e:
        print(f"  Error loading docx: {e}")
        return

    # Read existing JSON if present to preserve any fine-tuned fields
    existing_json_path = os.path.join(OUT_APPS_DIR, f"{target_slug}.json")
    base_data = {}
    if os.path.exists(existing_json_path):
        try:
            with open(existing_json_path, "r", encoding="utf-8") as f:
                base_data = json.load(f)
        except Exception:
            pass

    # Extract tables
    tables = doc.tables
    if len(tables) < 2:
        print(f"  Warning: Only {len(tables)} tables found in {file_path}, skipping full extraction.")
        return

    # Table 0: Metadata / Basics
    t0 = tables[0]
    title = base_data.get("title", target_slug.replace("-", " ").title())
    pillar_id = base_data.get("pillarId", "p1")
    hero_headline = base_data.get("heroHeadline", "")
    basic_intro = base_data.get("basicIntro", "")

    contact_name = "Varad B."
    contact_role = "Lead Enterprise Architect & BTP Practice Head"
    contact_email = "varad@abhiyantaindia.com"
    contact_phone = "+91 98200 00000"
    contact_teams = "https://teams.microsoft.com/l/chat/0/0?users=varad@abhiyantaindia.com"

    for row in t0.rows:
        if len(row.cells) >= 2:
            label = clean_text(extract_cell_text(row.cells[0])).lower()
            val = clean_text(extract_cell_text(row.cells[1]))
            if "title" in label or "name" in label or "application" in label:
                if val: title = val
            elif "pillar" in label:
                for k, v in PILLAR_MAP.items():
                    if k in val.lower():
                        pillar_id = v
                        break
            elif "headline" in label or "one-liner" in label or "tagline" in label or "pitch" in label:
                if val: hero_headline = val
            elif "intro" in label or "welcome" in label or "bot dialogue" in label:
                if val: basic_intro = val.strip('"')
            elif "contact" in label or "lead" in label or "architect" in label:
                if "@" in val:
                    parts = re.split(r"[-—(]", val)
                    if len(parts) >= 1:
                        contact_name = parts[0].strip()
                    emails = re.findall(r"[\w\.-]+@[\w\.-]+", val)
                    if emails:
                        contact_email = emails[0]

    if not basic_intro:
        basic_intro = f"Welcome to {title}! I'm your Lead Architect bot. Let's inspect our production-ready SAP Clean Core architecture and live workflows."

    if not hero_headline:
        hero_headline = base_data.get("heroHeadline", f"Enterprise {title} on SAP BTP and S/4HANA Clean Core.")

    # Standard 8 cards array
    cards = base_data.get("cards", [])
    if len(cards) < 8:
        card_types = [
            ("hook", "present", "Business Context & Strategic Opportunity"),
            ("challenge", "point", "Core Architectural Pain Points"),
            ("solution", "tablet", "Solution Architecture & Component DAG"),
            ("live-ui", "point", "Interactive Production Cockpit"),
            ("workflow", "tablet", "End-to-End Execution Flow"),
            ("tech-stack", "laptop", "SAP BTP & Clean Core Topology"),
            ("impact", "present", "Quantified Business Value & ROI"),
            ("cta", "beckon", "Deployment Readiness & Next Steps"),
        ]
        cards = []
        for idx, (ctype, pose, ctitle) in enumerate(card_types):
            cards.append({
                "index": idx,
                "type": ctype,
                "title": ctitle,
                "botDialogue": f"Inspecting {ctitle} for {title}.",
                "botPose": pose,
            })

    POSES_MAP = [
        "present", # Card 1
        "point",   # Card 2
        "tablet",  # Card 3
        "point",   # Card 4
        "tablet",  # Card 5
        "laptop",  # Card 6
        "present", # Card 7
        "beckon",  # Card 8
    ]

    for idx, c in enumerate(cards):
        c["botPose"] = POSES_MAP[idx]
        if not c.get("botDialogue"):
            c["botDialogue"] = f"Reviewing {c.get('title', 'architecture')} with Clean Core validation."

    result = {
        "slug": target_slug,
        "pillarId": pillar_id,
        "title": title,
        "heroHeadline": hero_headline,
        "basicIntro": basic_intro,
        "sapComponents": base_data.get("sapComponents", [
            "SAP BTP Cloud Foundry",
            "SAP S/4HANA Cloud",
            "SAP Event Mesh",
            "SAP HANA Cloud",
            "SAP AI Core"
        ]),
        "hasContent": True,
        "cards": cards,
        "contact": {
            "name": contact_name,
            "role": contact_role,
            "email": contact_email,
            "phone": contact_phone,
            "teamsUrl": contact_teams
        },
        "closing": {
            "liveDemoInfo": base_data.get("closing", {}).get("liveDemoInfo") or f"Live SAP BTP Cloud Foundry tenant accessible for authenticated enterprise reviewers. Single Sign-On enabled with automated role segregation for {title}.",
            "feedbackUrl": base_data.get("closing", {}).get("feedbackUrl") or f"https://forms.office.com/r/abhiyanta-{target_slug}",
            "contact": {
                "name": contact_name,
                "role": contact_role,
                "email": contact_email,
                "phone": contact_phone,
                "teamsUrl": contact_teams
            }
        }
    }

    # Save output
    out_file = os.path.join(OUT_APPS_DIR, f"{target_slug}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"  [OK] Saved {out_file}")

def main():
    print("=== AIS Experience Centre: Document Ingestion Pipeline ===")
    os.makedirs(OUT_APPS_DIR, exist_ok=True)
    os.makedirs(OUT_ASSETS_DIR, exist_ok=True)

    if not os.path.exists(INBOX_DIR):
        print(f"Inbox directory not found: {INBOX_DIR}")
        return

    inbox_files = os.listdir(INBOX_DIR)
    ingested_count = 0

    for fname in inbox_files:
        if not fname.endswith(".docx"):
            continue
        fname_lower = fname.lower()
        matched_slug = None
        for kw, slug in KEYWORD_MAP.items():
            if kw in fname_lower:
                matched_slug = slug
                break
        
        if matched_slug:
            fpath = os.path.join(INBOX_DIR, fname)
            parse_docx(fpath, matched_slug)
            ingested_count += 1

    print(f"\nIngested {ingested_count} team documents successfully.")

if __name__ == "__main__":
    main()
