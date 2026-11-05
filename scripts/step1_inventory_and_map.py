import os
import shutil
import zipfile
import json
import difflib
from pathlib import Path
from PIL import Image

REPO_ROOT = Path(r"C:\Users\Varad\Documents\GitHub\SAP-experince-centre")
SOURCE_DIR = Path(r"C:\Users\Varad\Desktop\experince update")
INBOX_DIR = REPO_ROOT / "content" / "inbox"
DOCS_DIR = REPO_ROOT / "docs"
DOCS_DIR.mkdir(parents=True, exist_ok=True)

# Step 1: Copy files from Desktop source to content/inbox if needed
if INBOX_DIR.exists():
    shutil.rmtree(INBOX_DIR)
shutil.copytree(SOURCE_DIR, INBOX_DIR)

print(f"Copied {SOURCE_DIR} to {INBOX_DIR}")

# Load solutions.json
with open(REPO_ROOT / "content" / "solutions.json", "r", encoding="utf-8") as f:
    solutions = json.load(f)

print(f"Loaded {len(solutions)} solutions from solutions.json")

# Helper to inspect docx
def inspect_docx(docx_path):
    text_snippet = ""
    images_info = []
    try:
        import docx
        doc = docx.Document(docx_path)
        full_text = " ".join([p.text for p in doc.paragraphs if p.text.strip()])
        text_snippet = full_text[:200]
    except Exception as e:
        text_snippet = f"Error reading text: {e}"

    # Open as zip to inspect images
    try:
        with zipfile.ZipFile(docx_path, 'r') as z:
            media_files = [f for f in z.namelist() if f.startswith('word/media/')]
            for mf in media_files:
                img_data = z.read(mf)
                from io import BytesIO
                try:
                    with Image.open(BytesIO(img_data)) as im:
                        w, h = im.size
                        images_info.append({
                            "name": Path(mf).name,
                            "size_bytes": len(img_data),
                            "w": w,
                            "h": h
                        })
                except Exception:
                    images_info.append({
                        "name": Path(mf).name,
                        "size_bytes": len(img_data),
                        "w": None,
                        "h": None
                    })
    except Exception as e:
        print(f"Error inspecting zip {docx_path}: {e}")

    return text_snippet, images_info

inbox_tree_lines = [
    "# INBOX_TREE.md",
    "",
    "Inventory of all files in `/content/inbox/` extracted from source updates.",
    ""
]

all_files = []
for root, dirs, files in os.walk(INBOX_DIR):
    for f in files:
        full_p = Path(root) / f
        rel_p = full_p.relative_to(INBOX_DIR)
        size_bytes = full_p.stat().st_size
        ext = full_p.suffix.lower()
        all_files.append((rel_p, full_p, size_bytes, ext))

inbox_tree_lines.append(f"Total files found in inbox: {len(all_files)}\n")

for rel_p, full_p, size_bytes, ext in sorted(all_files, key=lambda x: str(x[0])):
    inbox_tree_lines.append(f"### `{rel_p}`")
    inbox_tree_lines.append(f"- **Size**: {size_bytes} bytes ({size_bytes / 1024:.1f} KB)")
    inbox_tree_lines.append(f"- **Extension**: `{ext}`")

    if ext == ".docx":
        snippet, img_list = inspect_docx(full_p)
        inbox_tree_lines.append(f"- **Text snippet (first 200 chars)**: \"{snippet}\"")
        inbox_tree_lines.append(f"- **Embedded images count**: {len(img_list)}")
        for i, img in enumerate(img_list, 1):
            dim_str = f"{img['w']}x{img['h']}" if img['w'] else "unknown"
            inbox_tree_lines.append(f"  - Image {i}: `{img['name']}` ({dim_str}, {img['size_bytes']} bytes, detected slide {i})")
    elif ext in [".png", ".jpg", ".jpeg", ".webp"]:
        try:
            with Image.open(full_p) as im:
                w, h = im.size
                inbox_tree_lines.append(f"- **Dimensions**: {w}x{h}")
        except Exception:
            inbox_tree_lines.append("- **Dimensions**: unknown")
    else:
        try:
            with open(full_p, "r", encoding="utf-8", errors="ignore") as tf:
                snippet = tf.read(200).replace("\n", " ")
                inbox_tree_lines.append(f"- **Text snippet**: \"{snippet}\"")
        except Exception:
            pass
    inbox_tree_lines.append("")

with open(DOCS_DIR / "INBOX_TREE.md", "w", encoding="utf-8") as f:
    f.write("\n".join(inbox_tree_lines))

print(f"Wrote docs/INBOX_TREE.md")

# Step 2: Match to projects in solutions.json
# Folder or docx to slug
def slugify(text):
    import re
    text = text.lower()
    text = re.sub(r'[\(\)\_\.\-\d]+', ' ', text)
    tokens = text.split()
    return "-".join(tokens)

# We have 13 solutions and 13 docx files
sol_map = []
docx_files = [f for f in all_files if f[3] == ".docx"]

for sol in solutions:
    sol_slug = sol["slug"]
    sol_name = sol["title"]
    best_match = None
    best_score = 0
    best_reason = ""
    match_conf = "none"

    # Compare against docx files
    for rel_p, full_p, size_bytes, ext in docx_files:
        stem = full_p.stem.lower()
        # Direct keyword checks
        if sol_slug == "sap-btp-vibe-coding" and "vibe_coding" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'vibe_coding' corresponding to sap-btp-vibe-coding"
            break
        elif sol_slug == "podzo" and "podzo" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'podzo'"
            break
        elif sol_slug == "reconly" and "reconly" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'reconly'"
            break
        elif sol_slug == "product-cost-simulator" and "product_cost_simulator" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'product_cost_simulator'"
            break
        elif sol_slug == "mdr" and "mdr" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'mdr'"
            break
        elif sol_slug == "invoice-decision-intelligence" and "invoice_decision_intelligence" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'invoice_decision_intelligence'"
            break
        elif sol_slug == "ais-debug-studio" and ("debug_studio" in stem or "abap_cds" in stem):
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'abap_cds' and 'debug_studio'"
            break
        elif sol_slug == "hanamorph" and "hanamorph" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'hanamorph'"
            break
        elif sol_slug == "asset-reliability-mro" and "asset_reliability_mro" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'asset_reliability_mro'"
            break
        elif sol_slug == "manufacturing-yield-scrap" and "manufacturing_yield_scrap" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'manufacturing_yield_scrap'"
            break
        elif sol_slug == "o2c-receivables" and "o2c_receivables" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'o2c_receivables'"
            break
        elif sol_slug == "procure-to-pay" and "procure_to_pay" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'procure_to_pay'"
            break
        elif sol_slug == "revenue-analytics" and "revenue_analytics" in stem:
            best_match = str(rel_p)
            best_score = 1.0
            match_conf = "exact"
            best_reason = "Filename contains 'revenue_analytics'"
            break
        
        # Fuzzy fallback
        ratio = difflib.SequenceMatcher(None, sol_slug, slugify(stem)).ratio()
        if ratio > best_score:
            best_score = ratio
            best_match = str(rel_p)
            match_conf = "fuzzy" if ratio >= 0.8 else "low"
            best_reason = f"difflib ratio {ratio:.2f}"

    sol_map.append({
        "slug": sol_slug,
        "title": sol_name,
        "pillarId": sol["pillarId"],
        "inbox_file": best_match,
        "match_confidence": match_conf if best_match else "MISSING_INBOX",
        "confidence_score": best_score,
        "reason": best_reason
    })

with open(REPO_ROOT / "content" / "inbox-map.json", "w", encoding="utf-8") as f:
    json.dump(sol_map, f, indent=2)

print("Wrote content/inbox-map.json")
for m in sol_map:
    print(f"[{m['match_confidence']}] {m['slug']} -> {m['inbox_file']} (score: {m['confidence_score']})")
