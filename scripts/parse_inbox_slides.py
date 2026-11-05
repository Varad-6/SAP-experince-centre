import docx
import json
import re
from pathlib import Path

root = Path(r"C:\Users\Varad\Documents\GitHub\SAP-experince-centre")
inbox_map = json.load(open(root / "content" / "inbox-map.json", encoding="utf-8"))

def clean_text(s):
    if not s:
        return ""
    # remove trailing whitespace, zero-width chars
    s = s.replace('\u200b', '').replace('\ufeff', '').strip()
    return s

def extract_project_slide_texts(item):
    slug = item["slug"]
    rel_path = item["inbox_file"]
    doc_path = root / "content" / "inbox" / rel_path
    doc = docx.Document(doc_path)
    
    # We walk paragraphs and tables in order of appearance
    # Look for slide headings
    slide_pattern = re.compile(r'^(?:slide|slid|s[lL]ide|slidde)\s*(\d+)', re.IGNORECASE)
    landing_pattern = re.compile(r'^1\.\s*landing\s*page', re.IGNORECASE)
    
    # Structure of document elements
    body_elements = []
    for child in doc.element.body:
        if child.tag.endswith('p'):
            p = docx.text.paragraph.Paragraph(child, doc)
            t = clean_text(p.text)
            body_elements.append(('p', t, p))
        elif child.tag.endswith('tbl'):
            tbl = docx.table.Table(child, doc)
            t_rows = []
            for r in tbl.rows:
                row_str = [clean_text(c.text) for c in r.cells]
                t_rows.append(row_str)
            body_elements.append(('tbl', t_rows, tbl))
            
    # Group by slide
    # First, let's scan where slide headers are
    slide_indices = [] # (element_idx, slide_num, header_title)
    for idx, (el_type, content, raw) in enumerate(body_elements):
        if el_type == 'p':
            t = content
            m_land = landing_pattern.match(t)
            m_slide = slide_pattern.match(t)
            if m_land:
                slide_indices.append((idx, 1, "Landing Page"))
            elif m_slide:
                s_num = int(m_slide.group(1))
                # rest of line after slide N:
                rest = re.sub(r'^(?:slide|slid|s[lL]ide|slidde)\s*\d+\s*[:\-]?\s*', '', t, flags=re.IGNORECASE).strip()
                slide_indices.append((idx, s_num, rest))
                
    slides_data = {}
    
    # If no slide headers found, map whole document
    if not slide_indices:
        # Check if tables or paragraphs describe slides
        pass
    else:
        for i, (el_idx, s_num, header_title) in enumerate(slide_indices):
            next_el_idx = slide_indices[i+1][0] if i+1 < len(slide_indices) else len(body_elements)
            
            slide_paras = []
            slide_tables = []
            
            if header_title:
                slide_paras.append(header_title)
                
            for j in range(el_idx + 1, next_el_idx):
                el_type, content, raw = body_elements[j]
                if el_type == 'p':
                    if content:
                        slide_paras.append(content)
                elif el_type == 'tbl':
                    slide_tables.append(content)
                    
            slides_data[s_num] = {
                "paras": slide_paras,
                "tables": slide_tables
            }
            
    # Let's also check if tables before slide headers or at end belong to specific slides
    # For example in PODZO, Table 0 (Use case & problem) is under Slide 2 or in doc
    # In MDR, Table 0 is under Slide 2, etc.
    return slides_data

all_results = {}
for item in inbox_map:
    slug = item["slug"]
    slides_data = extract_project_slide_texts(item)
    all_results[slug] = slides_data
    print(f"{slug}: extracted {len(slides_data)} slides: {sorted(slides_data.keys())}")
    for s_num in sorted(slides_data.keys()):
        p_count = len(slides_data[s_num]["paras"])
        t_count = len(slides_data[s_num]["tables"])
        print(f"  Slide {s_num}: {p_count} paras, {t_count} tables")
