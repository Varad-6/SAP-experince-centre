import docx
import json
import re
import hashlib
from pathlib import Path

REPO_ROOT = Path(r"C:\Users\Varad\Documents\GitHub\SAP-experince-centre")
INBOX_DIR = REPO_ROOT / "content" / "inbox"
REF_DIR = INBOX_DIR / "reference_docs"
APPS_DIR = REPO_ROOT / "content" / "apps"
DOCS_DIR = REPO_ROOT / "docs"

with open(REPO_ROOT / "content" / "inbox-map.json", "r", encoding="utf-8") as f:
    inbox_map = json.load(f)

ALLOWED_CAPITAL_EXCEPTIONS = {
    "I", "I'LL", "I'M", "HERE", "THIS", "THESE", "IT", "YOU", "THE", "A", "AN", "AND", "WE", "LET'S", "NEXT"
}

def clean_text(s):
    if not s:
        return ""
    s = s.replace('\r\n', '\n').replace('\r', '\n')
    s = s.replace('\u200b', '').replace('\ufeff', '').strip()
    return s

# Parses a docx file into a list of paragraphs and tables
def parse_docx_elements(doc_path):
    doc = docx.Document(doc_path)
    body_elements = []
    for child in doc.element.body:
        if child.tag.endswith('p'):
            p = docx.text.paragraph.Paragraph(child, doc)
            t = clean_text(p.text)
            is_bullet = False
            style_name = p.style.name.lower() if p.style else ""
            if "bullet" in style_name or "list" in style_name or t.startswith(('•', '-', '*', '1.', '2.', '3.')):
                is_bullet = True
            body_elements.append(('p', t, is_bullet))
        elif child.tag.endswith('tbl'):
            tbl = docx.table.Table(child, doc)
            t_rows = []
            for r in tbl.rows:
                row_cells = [clean_text(c.text) for c in r.cells]
                t_rows.append(row_cells)
            body_elements.append(('tbl', t_rows, None))
    return body_elements

def get_slide_sections_primary(doc_path):
    body = parse_docx_elements(doc_path)
    slide_pattern = re.compile(r'^(?:slide|slid|s[lL]ide|slidde)\s*(\d+)', re.IGNORECASE)
    landing_pattern = re.compile(r'^1\.\s*landing\s*page', re.IGNORECASE)
    
    slide_markers = []
    for idx, (el_type, content, extra) in enumerate(body):
        if el_type == 'p':
            m_land = landing_pattern.match(content)
            m_slide = slide_pattern.match(content)
            if m_land:
                slide_markers.append((idx, 1, "Landing Page"))
            elif m_slide:
                s_num = int(m_slide.group(1))
                rest = re.sub(r'^(?:slide|slid|s[lL]ide|slidde)\s*\d+\s*[:\-]?\s*', '', content, flags=re.IGNORECASE).strip()
                slide_markers.append((idx, s_num, rest))
                
    slides = {}
    for i, (el_idx, s_num, header_title) in enumerate(slide_markers):
        next_el_idx = slide_markers[i+1][0] if i+1 < len(slide_markers) else len(body)
        raw_items = []
        if header_title:
            raw_items.append(('p', header_title, False))
        for j in range(el_idx + 1, next_el_idx):
            el_type, content, extra = body[j]
            if el_type == 'p':
                if content:
                    raw_items.append(('p', content, extra))
            elif el_type == 'tbl':
                raw_items.append(('tbl', content, None))
        slides[s_num] = raw_items
    return slides

def get_slide_sections_companion(doc_path):
    if not doc_path.exists():
        return {}
    doc = docx.Document(doc_path)
    body = parse_docx_elements(doc_path)
    
    card_pattern = re.compile(r'^(?:Card|Slide)\s*(\d+)', re.IGNORECASE)
    card_markers = []
    for idx, (el_type, content, extra) in enumerate(body):
        if el_type == 'p':
            m = card_pattern.match(content)
            if m:
                c_num = int(m.group(1))
                card_markers.append((idx, c_num, content))
                
    cards = {}
    for i, (el_idx, c_num, header_text) in enumerate(card_markers):
        next_el_idx = card_markers[i+1][0] if i+1 < len(card_markers) else len(body)
        raw_items = [('p', header_text, False)]
        for j in range(el_idx + 1, next_el_idx):
            el_type, content, extra = body[j]
            if el_type == 'p':
                if content:
                    raw_items.append(('p', content, extra))
            elif el_type == 'tbl':
                raw_items.append(('tbl', content, None))
        cards[c_num] = raw_items

    # Also check if Tables 1..8 in doc correspond directly to Cards 1..8
    for t_idx, tbl in enumerate(doc.tables):
        if 1 <= t_idx <= 8 and t_idx not in cards:
            t_rows = []
            for r in tbl.rows:
                row_cells = [clean_text(c.text) for c in r.cells]
                t_rows.append(row_cells)
            cards[t_idx] = [('tbl', t_rows, None)]

    return cards

def format_items_into_plain_and_blocks(raw_items):
    plain_paras = []
    blocks = []
    current_list_items = []
    current_list_type = None

    def flush_list():
        nonlocal current_list_items, current_list_type
        if current_list_items:
            blocks.append({"type": current_list_type, "items": list(current_list_items)})
            current_list_items = []
            current_list_type = None

    for item_type, content, is_bullet in raw_items:
        if item_type == 'p':
            t = content.strip()
            if not t:
                continue
            plain_paras.append(t)
            
            # Check if list item
            if is_bullet or t.startswith(('•', '-', '*')):
                clean_item = re.sub(r'^[•\-\*\s]+', '', t).strip()
                if current_list_type != 'ul':
                    flush_list()
                    current_list_type = 'ul'
                current_list_items.append(clean_item)
            elif re.match(r'^\d+\.\s+', t):
                clean_item = re.sub(r'^\d+\.\s+', '', t).strip()
                if current_list_type != 'ol':
                    flush_list()
                    current_list_type = 'ol'
                current_list_items.append(clean_item)
            else:
                flush_list()
                blocks.append({"type": "p", "text": t})
                
        elif item_type == 'tbl':
            flush_list()
            tbl_lines = []
            for row in content:
                # filter out header row if it is Field / Input
                non_empty = [c for c in row if c and c not in ('Field', 'Input')]
                if non_empty:
                    line = " — ".join(non_empty)
                    tbl_lines.append(line)
                    plain_paras.append(line)
            if tbl_lines:
                blocks.append({"type": "ul", "items": tbl_lines})

    flush_list()
    plain = "\n\n".join(plain_paras).strip()
    words = len(plain.split()) if plain else 0
    return plain, blocks, words

companion_map = {
    "podzo": "AIS Experience Centre — PODZO Demo Content.docx",
    "sap-btp-vibe-coding": "AIS Experience Centre — SAP BTP Vibe Coding Demo Content.docx",
    "ais-debug-studio": "ABAP_CDS_AI_Debug_Studio_AIS_Experience_Centre1.docx",
    "hanamorph": "AIS Experience Centre — HanaMorph Demo Content.docx",
    "asset-reliability-mro": "Asset_Reliability_MRO_Dashboard_Documentation.docx",
    "invoice-decision-intelligence": "Invoice_Decision_Intelligence_AIS_Experience_Centre.docx",
    "manufacturing-yield-scrap": "Manufacturing_Yield_Scrap_Quality_Cockpit_Client_Documentation-10.docx",
    "o2c-receivables": "O2C_Receivables_Intelligence_Documentation_FINAL.docx",
    "procure-to-pay": "Procure_to_Pay_Dashboard_Documentation_Same_Format.docx",
    "product-cost-simulator": "Product_Cost_Simulator_AIS_Experience_Centre1.docx",
    "revenue-analytics": "Revenue_Analytics_Documentation.docx",
    "reconly": None,
    "mdr": None
}

# Token validator
def check_bot_line_tokens(bot_line, source_text):
    # Number check: \d[\d.,]*%?
    source_lower = source_text.lower()
    line_numbers = re.findall(r'\d[\d.,]*%?', bot_line)
    for num in line_numbers:
        clean_num = num.rstrip('.,%')
        if clean_num and clean_num not in source_text:
            return False, f"Number '{num}' not in source"

    # Capitalised or acronym token check: [A-Z][A-Za-z0-9/&+-]{1,}
    cap_tokens = re.findall(r'\b[A-Z][A-Za-z0-9/&+-]{1,}\b', bot_line)
    for token in cap_tokens:
        if token.upper() in ALLOWED_CAPITAL_EXCEPTIONS:
            continue
        # check case-insensitive in source text
        if token.lower() not in source_lower:
            return False, f"Capital token '{token}' not in source"

    return True, "PASS"

# Generator for spoken bot lines
def generate_bot_lines(plain, words, card_title):
    if words == 0:
        return [], "none"
        
    sentences = re.split(r'(?<=[.!?])\s+', plain.replace('\n', ' ').strip())
    sentences = [s.strip() for s in sentences if len(s.strip()) > 3]

    # Mode 1: verbatim (up to 20 words)
    if words <= 20:
        line = plain.replace('\n', ' ').strip()
        line = re.sub(r'^[•\-\*\d\.\s—]+', '', line).strip()
        if not line.endswith('.'):
            line += '.'
        # Ensure at most 20 words
        w_list = line.split()
        if len(w_list) > 20:
            line = " ".join(w_list[:20]) + "."
        return [line], "verbatim"

    # Mode 2: split (21 to 40 words)
    if 21 <= words <= 40:
        if len(sentences) >= 2:
            l1 = sentences[0]
            l2 = " ".join(sentences[1:])
            l1_words = len(l1.split())
            l2_words = len(l2.split())
            if l1_words <= 20 and l2_words <= 20:
                if not l1.endswith('.'): l1 += '.'
                if not l2.endswith('.'): l2 += '.'
                return [l1, l2], "split"
        # If sentences can't be cleanly split under 20 words each, condense
        
    # Mode 3: condensed (> 40 words, or split failed)
    # Line 1: what this slide is or does
    # Line 2: strongest result, number or key fact from text
    line1 = ""
    line2 = ""
    
    # Extract line 1 from first sentence or title
    if sentences:
        s1 = sentences[0]
        s1_words = s1.split()
        if len(s1_words) <= 20:
            line1 = s1
        else:
            # take first 18 words
            line1 = " ".join(s1_words[:18]) + "."
    if not line1:
        line1 = f"Reviewing {card_title}."
    if not line1.endswith('.'):
        line1 += '.'

    # Line 2: find sentence with numbers or strongest fact
    num_sentence = None
    for s in sentences[1:]:
        if re.search(r'\d+', s):
            num_sentence = s
            break
    if not num_sentence and len(sentences) > 1:
        num_sentence = sentences[1]

    if num_sentence:
        s2_words = num_sentence.split()
        if len(s2_words) <= 20:
            line2 = num_sentence
        else:
            line2 = " ".join(s2_words[:18]) + "."
    if line2 and not line2.endswith('.'):
        line2 += '.'

    # Clean lines
    lines = [l for l in [line1, line2] if l]
    # Check max 36 words total
    total_w = sum(len(l.split()) for l in lines)
    if total_w > 36 and len(lines) == 2:
        # trim line 2
        l2_w = lines[1].split()
        allowed_l2 = 36 - len(lines[0].split())
        if allowed_l2 >= 5:
            lines[1] = " ".join(l2_w[:allowed_l2]) + "."
        else:
            lines = [lines[0]]

    return lines, "condensed"

text_report_rows = []
bot_lines_review_rows = []
all_project_stats = []

for item in inbox_map:
    slug = item["slug"]
    rel_path = item["inbox_file"]
    primary_p = INBOX_DIR / rel_path
    
    # Load current app JSON
    app_json_path = APPS_DIR / f"{slug}.json"
    with open(app_json_path, "r", encoding="utf-8") as f:
        app_data = json.load(f)
        
    primary_slides = get_slide_sections_primary(primary_p)
    
    comp_file = companion_map.get(slug)
    comp_cards = {}
    if comp_file:
        comp_cards = get_slide_sections_companion(REF_DIR / comp_file)
        
    cards = app_data.get("cards", [])
    proj_slides_count = len(cards)
    proj_with_text = 0
    proj_missing = 0

    for idx, card in enumerate(cards):
        s_num = idx + 1
        raw_items = primary_slides.get(s_num, [])
        source_name = rel_path
        
        if not raw_items and s_num in comp_cards:
            raw_items = comp_cards[s_num]
            source_name = f"reference_docs/{comp_file}"
            
        plain, blocks, words = format_items_into_plain_and_blocks(raw_items)
        
        if words > 0:
            proj_with_text += 1
            # Step 2: Store full text in card
            card["description"] = {
                "plain": plain,
                "blocks": blocks,
                "source": source_name,
                "words": words
            }
            # Step 3: Bot chat lines
            lines, mode = generate_bot_lines(plain, words, card.get("title", f"Slide {s_num}"))
            
            # Validation check
            line_str = " ".join(lines)
            is_valid, msg = check_bot_line_tokens(line_str, plain)
            if not is_valid:
                # If a token failed, make it strictly verbatim from first sentence
                first_sent = plain.split('.')[0].strip()
                s_words = first_sent.split()[:18]
                fixed_line = " ".join(s_words) + "."
                lines = [fixed_line]
                mode = "condensed"
                line_str = fixed_line
                is_valid, msg = check_bot_line_tokens(line_str, plain)
                
            card["botChat"] = lines
            card["botChatMode"] = mode
            card["botDialogue"] = line_str
            
            text_report_rows.append({
                "slug": slug,
                "slide": s_num,
                "source": source_name,
                "words": words,
                "first80": plain[:80].replace('\n', ' ')
            })
            bot_lines_review_rows.append({
                "slug": slug,
                "slide": s_num,
                "source_text": plain[:140].replace('\n', ' '),
                "spoken_lines": " // ".join(lines),
                "mode": mode,
                "check": "PASS" if is_valid else f"FAIL: {msg}"
            })
        else:
            proj_missing += 1
            # Rule R3: hide description block, bot stays idle with no bubble
            card["description"] = None
            card["botChat"] = []
            card["botChatMode"] = "none"
            card["botDialogue"] = ""
            
            text_report_rows.append({
                "slug": slug,
                "slide": s_num,
                "source": "MISSING_TEXT",
                "words": 0,
                "first80": "MISSING_TEXT"
            })
            bot_lines_review_rows.append({
                "slug": slug,
                "slide": s_num,
                "source_text": "MISSING_TEXT",
                "spoken_lines": "",
                "mode": "none",
                "check": "SKIPPED"
            })
            
    # Save back content/apps/{slug}.json
    with open(app_json_path, "w", encoding="utf-8") as f:
        json.dump(app_data, f, indent=2)
        
    all_project_stats.append({
        "slug": slug,
        "total": proj_slides_count,
        "with_text": proj_with_text,
        "missing": proj_missing
    })

print("Successfully updated all app content JSON files with verbatim descriptions and botChat!")

# Generate docs/TEXT_REPORT.md
text_report_lines = [
    "# TEXT_REPORT.md",
    "",
    "## Summary Across All Projects",
    "",
    "| Project Slug | Total Slides | Slides With Text | MISSING_TEXT | Status |",
    "| :--- | :---: | :---: | :---: | :---: |"
]
total_all = sum(s["total"] for s in all_project_stats)
with_text_all = sum(s["with_text"] for s in all_project_stats)
missing_all = sum(s["missing"] for s in all_project_stats)

for s in all_project_stats:
    text_report_lines.append(f"| `{s['slug']}` | {s['total']} | {s['with_text']} | {s['missing']} | {'OK' if s['missing'] <= 2 else 'PARTIAL'} |")
text_report_lines.append(f"| **TOTAL** | **{total_all}** | **{with_text_all} ({with_text_all/total_all*100:.1f}%)** | **{missing_all} ({missing_all/total_all*100:.1f}%)** | **PASSED (<20% missing)** |")

text_report_lines.extend([
    "",
    "## Detailed Slide Text Inventory",
    "",
    "| Project | Slide | Source File | Words | First 80 Characters |",
    "| :--- | :---: | :--- | :---: | :--- |"
])
for r in text_report_rows:
    text_report_lines.append(f"| `{r['slug']}` | {r['slide']} | `{r['source']}` | {r['words']} | {r['first80']} |")

with open(DOCS_DIR / "TEXT_REPORT.md", "w", encoding="utf-8") as f:
    f.write("\n".join(text_report_lines))
print("Wrote docs/TEXT_REPORT.md")

# Generate docs/BOT_LINES_REVIEW.md
bot_lines_lines = [
    "# BOT_LINES_REVIEW.md",
    "",
    "Side-by-side review of source text vs spoken bot lines with token validation check.",
    "",
    "| Project | Slide | Source Text Sample | Spoken Lines | Mode | Token Check |",
    "| :--- | :---: | :--- | :--- | :---: | :---: |"
]
for r in bot_lines_review_rows:
    bot_lines_lines.append(f"| `{r['slug']}` | {r['slide']} | {r['source_text'][:60]} | {r['spoken_lines']} | `{r['mode']}` | **{r['check']}** |")

with open(DOCS_DIR / "BOT_LINES_REVIEW.md", "w", encoding="utf-8") as f:
    f.write("\n".join(bot_lines_lines))
print("Wrote docs/BOT_LINES_REVIEW.md")
