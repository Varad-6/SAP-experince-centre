import docx
import json
import re
from pathlib import Path

root = Path(r"C:\Users\Varad\Documents\GitHub\SAP-experince-centre")
inbox_map = json.load(open(root / "content" / "inbox-map.json", encoding="utf-8"))

def clean_text(s):
    if not s:
        return ""
    return s.replace('\u200b', '').replace('\ufeff', '').strip()

slide_pattern = re.compile(r'^(?:slide|slid|s[lL]ide|slidde)\s*(\d+)', re.IGNORECASE)
landing_pattern = re.compile(r'^1\.\s*landing\s*page', re.IGNORECASE)

stats = []

for item in inbox_map:
    slug = item["slug"]
    rel_path = item["inbox_file"]
    doc_path = root / "content" / "inbox" / rel_path
    doc = docx.Document(doc_path)
    
    # Also check if there is a companion doc in downloads/ais exp data
    # but first check the inbox doc itself
    
    # 1. Walk elements
    body_elements = []
    for child in doc.element.body:
        if child.tag.endswith('p'):
            p = docx.text.paragraph.Paragraph(child, doc)
            t = clean_text(p.text)
            is_bullet = False
            style_name = p.style.name.lower() if p.style else ""
            if "bullet" in style_name or "list" in style_name or t.startswith(('•', '-', '*')):
                is_bullet = True
            body_elements.append(('p', t, is_bullet))
        elif child.tag.endswith('tbl'):
            tbl = docx.table.Table(child, doc)
            t_rows = []
            for r in tbl.rows:
                row_str = [clean_text(c.text) for c in r.cells]
                t_rows.append(row_str)
            body_elements.append(('tbl', t_rows, None))

    slide_markers = []
    for idx, (el_type, content, extra) in enumerate(body_elements):
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
        next_el_idx = slide_markers[i+1][0] if i+1 < len(slide_markers) else len(body_elements)
        
        slide_lines = []
        if header_title:
            slide_lines.append(header_title)
            
        for j in range(el_idx + 1, next_el_idx):
            el_type, content, extra = body_elements[j]
            if el_type == 'p':
                if content:
                    slide_lines.append(content)
            elif el_type == 'tbl':
                for row in content:
                    # Filter out header row if it's Field | Input
                    filtered = [c for c in row if c and c not in ('Field', 'Input')]
                    if filtered:
                        slide_lines.append(" — ".join(filtered))
                        
        plain = "\n\n".join(slide_lines).strip()
        words = len(plain.split()) if plain else 0
        slides[s_num] = {
            "plain": plain,
            "words": words,
            "first80": plain[:80].replace('\n', ' ') if plain else ""
        }
        
    stats.append({
        "slug": slug,
        "file": rel_path,
        "total_slides": len(slides),
        "with_text": sum(1 for s in slides.values() if s["words"] > 0),
        "missing_text": sum(1 for s in slides.values() if s["words"] == 0),
        "slides": slides
    })

print("=== STATS ACROSS INBOX DOCS ===")
total_slides_all = sum(s["total_slides"] for s in stats)
total_with_text_all = sum(s["with_text"] for s in stats)
total_missing_all = sum(s["missing_text"] for s in stats)

for s in stats:
    pct = (s["with_text"] / s["total_slides"] * 100) if s["total_slides"] else 0
    print(f"{s['slug']}: {s['with_text']}/{s['total_slides']} slides with text ({pct:.1f}%), missing: {s['missing_text']}")

print(f"\nOVERALL: {total_with_text_all}/{total_slides_all} slides with text ({total_with_text_all/total_slides_all*100:.1f}%), missing: {total_missing_all} ({total_missing_all/total_slides_all*100:.1f}%)")
