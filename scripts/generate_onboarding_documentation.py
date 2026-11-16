import os
import shutil
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_documents():
    repo_root = r"C:\Users\Varad\Documents\GitHub\SAP-experince-centre"
    docs_dir = os.path.join(repo_root, "documents")
    prompt_dir = os.path.join(repo_root, "prompt")
    downloads_dir = r"C:\Users\Varad\Downloads"
    
    os.makedirs(docs_dir, exist_ok=True)
    os.makedirs(prompt_dir, exist_ok=True)
    os.makedirs(downloads_dir, exist_ok=True)
    
    # -------------------------------------------------------------
    # 1. RAW CHATGPT PROMPT TEXT
    # -------------------------------------------------------------
    chatgpt_prompt = '''# SYSTEM ROLE: SENIOR SAP ENTERPRISE ARCHITECT & AIS EXPERIENCE CENTRE DIRECTOR

You are the Lead SAP Solution Architect and Prompt Engineer for the **AIS Experience Centre** (Abhiyanta India Solutions). Your mission is to convert raw enterprise documentation (Word documents, architecture blueprints, meeting notes, PRDs, or workshop guides) into production-grade JSON records and slide decks for our Next.js 15 Clean Core interactive showroom.

---

## CONTEXT & DESIGN DNA CONSTRAINTS

The AIS Experience Centre features **Aayam**, our animated executive architect companion. Every solution slide is rendered in a split-cockpit layout:
- **Left Column**: Visual card (16:9 interactive screenshot, DAG architecture diagram, workflow pipeline, or live UI).
- **Right Column**: Exactly 2 to 3 concise, high-impact bullet points and Aayam speaking directly to the reviewer via an anchored speech bubble.

### ⚠️ STRICT COMPLIANCE RULES (ZERO TOLERANCE FOR BREAKAGE)

1. **SLIDE TEXT DENSITY (THE 2-3 BULLET RULE)**:
   - Each slide description MUST contain **exactly 2 to 3 concise bullet points** (under 25 words per point).
   - NEVER generate dense walls of text or long paragraphs that cause vertical scrolling or overflow clipping.
   - Use bold lead-in tags (e.g. `• **Single-Command Verification** — Validates Node.js...`).

2. **AAYAM'S SPOKEN DIALOGUE (`botDialogue`)**:
   - Provide a natural, executive 1–2 sentence spoken line for Aayam in every single card.
   - Tone: Authoritative, energetic, and professional enterprise architect.
   - 🚫 **ABSOLUTE BAN ON META LABELS**: NEVER output text like `🤖 Bot Director Voice:`, `Actor Voice:`, `Spoken Dialogue:`, or quotes inside the text field! Aayam speaks it directly through his animated speech bubble.

3. **POSE SELECTION (`botPose`)**:
   Assign the exact mascot pose matching the card context:
   - `"present"`: Executive overviews, business context, hook, ROI impact.
   - `"point"`: Directing attention to dashboards, KPI metrics, code, or live UI.
   - `"tablet"`: Architecture DAGs, data flows, and workflow sequences.
   - `"laptop"`: Developer workstations, terminal commands, configuration JSON.
   - `"beckon"`: Workshop action steps, hands-on instructions.
   - `"thanks"`: Closing summary and executive contact.

4. **8 TO 10 SLIDE COCKPIT STRUCTURE**:
   - Slide 1: `hook` (Executive Challenge & Value Proposition)
   - Slide 2: `challenge` (Operational Pain Points & Before Metrics)
   - Slide 3: `solution` (Clean Core Architecture Blueprint DAG)
   - Slide 4: `live-ui` (Production UI / Dashboard Screenshot)
   - Slide 5: `workflow` (Process Stages or Terminal Service Key)
   - Slide 6: `tech-stack` (SAP BTP Services & Extensibility Framework)
   - Slide 7: `impact` (Measurable ROI, Financial Gains & Efficiency Multipliers)
   - Slide 8: `cta` (Enterprise Deployment Path & Contact)
   - (Optional Slides 9-10 for extended deep dives / service keys).

5. **IMAGE PATH CONVENTIONS**:
   - Images are placed in `/assets/apps/<slug>/c<slideNumber>_1.webp`.
   - Maintain 16:9 widescreen or sharp application UI captures.

---

## REQUIRED OUTPUT SPECIFICATION

Whenever I provide you with raw project documentation or notes, you MUST produce two distinct outputs:

### OUTPUT 1: Catalog Registry Entry (for `content/solutions.json`)
```json
{
  "slug": "<kebab-case-slug>",
  "pillarId": "<p1 | p2 | p3>",
  "title": "<Full Solution Title>",
  "oneLiner": "<Crisp 1-sentence value proposition>",
  "tags": ["SAP BTP", "<Component 1>", "<Component 2>"],
  "roiMetric": "<e.g. 74% Faster Cycle Time>",
  "featured": true
}
```
*Pillar Mapping: `p1` = Clean Core & Extensibility, `p2` = Data Modernization & Intelligence, `p3` = Real-Time Analytics & Steering.*

### OUTPUT 2: Complete Application Schema (for `content/apps/<slug>.json`)
```json
{
  "id": "<kebab-case-slug>",
  "title": "<Full Solution Title>",
  "subtitle": "AIS Enterprise Experience Centre",
  "heroHeadline": "<Compelling Executive Headline>",
  "intro": "<2-3 sentence executive summary explaining what was engineered>",
  "basicIntro": "<Punchy 1-sentence greeting used by companion bot on solution overview>",
  "sapComponents": [
    "SAP BTP Cloud Foundry",
    "SAP HANA Cloud",
    "SAP AI Core",
    "SAP S/4HANA Cloud"
  ],
  "cards": [
    {
      "id": "card-1",
      "type": "hook",
      "title": "<Slide 1 Title>",
      "subtitle": "<Subheading>",
      "description": {
        "plain": "<Bullet 1>\\n\\n<Bullet 2>\\n\\n<Bullet 3>",
        "blocks": [
          {
            "type": "ul",
            "items": [
              "**<Lead-in>** — <Crisp point 1>.",
              "**<Lead-in>** — <Crisp point 2>.",
              "**<Lead-in>** — <Crisp point 3>."
            ]
          }
        ]
      },
      "badge": "Slide 1 of 8",
      "caption": "<Caption for the screenshot/diagram>",
      "botDialogue": "<Spoken line by Aayam without meta tags>",
      "botPose": "present",
      "imageUrl": "/assets/apps/<slug>/c1_1.webp",
      "screenshot": "/assets/apps/<slug>/c1_1.webp"
    }
    /* Repeat for cards 2 through 8 (or 10) following the structure */
  ],
  "closing": {
    "liveDemoInfo": "Live SAP BTP Cloud Foundry tenant accessible for authenticated enterprise reviewers. Single Sign-On enabled with automated role segregation.",
    "feedbackUrl": "https://abhiyantaindia.com"
  },
  "contact": {
    "name": "Manisha Sawarkar",
    "role": "Sales Head, Abhiyanta India Solutions",
    "email": "Manisha.s@abhiyantatech.com",
    "phone": "+91 9136124009",
    "teamsUrl": "https://teams.microsoft.com/l/chat/0/0?users=Manisha.s@abhiyantatech.com"
  }
}
```

### OUTPUT 3: Image Asset Checklist
Provide a clean table listing the exact filenames (`c1_1.webp`, `c2_1.webp`, etc.) and the recommended screenshot or diagram visual for each slide so the user can easily extract or capture them.

---

## [PASTE YOUR RAW PROJECT NOTES / DOCX CONTENT BELOW THIS LINE]
'''

    # Save prompt to Prompt/
    prompt_txt_path = os.path.join(prompt_dir, "MASTER_CHATGPT_PROJECT_PROMPT.txt")
    with open(prompt_txt_path, "w", encoding="utf-8") as f:
        f.write(chatgpt_prompt)
        
    prompt_txt_dl = os.path.join(downloads_dir, "MASTER_CHATGPT_PROJECT_PROMPT.txt")
    shutil.copyfile(prompt_txt_path, prompt_txt_dl)

    # -------------------------------------------------------------
    # 2. MARKDOWN DOCUMENT
    # -------------------------------------------------------------
    markdown_content = f"""# AIS Experience Centre — Project Onboarding Guide & Master ChatGPT Prompt

**Standard**: Antigravity Clean Core UI Standard v2.0  
**Target Application**: `SAP-experince-centre` (Next.js 15, App Router, React 19)  
**Author**: Lead Enterprise Architect & Senior Prompt Engineer  

---

## 1. Overview & Workflow

Whenever a new enterprise project, proof-of-concept, or SAP BTP solution is completed, follow this simple 3-step workflow to onboard it into the AIS Experience Centre:

```
[Raw Project Notes / Word Doc / Screenshots]
                    │
                    ▼
[Paste into ChatGPT with Master Prompt]
                    │
                    ▼
[ChatGPT generates Schema JSON & solutions.json entry]
                    │
                    ▼
[Save JSON in content/apps/<slug>.json & add images to public/assets/apps/<slug>/]
```

---

## 2. The 5 Golden Rules of Experience Centre Slides

| Rule | Description | Why It Matters |
|---|---|---|
| **1. 2–3 Bullets Max** | Every slide description must strictly feature **2 to 3 concise bullet points** (max 25 words per point). | Prevents card overflow, eliminates vertical scrollbars, and preserves boardroom presentation readability. |
| **2. Clean Dialogue** | `botDialogue` is spoken by Aayam. Never include prefixes like `🤖 Bot Director Voice:` or quotes. | Aayam speaks directly via an animated typewriter speech bubble anchored above his head. |
| **3. Exact Pose Matching** | Use `"present"`, `"point"`, `"tablet"`, `"laptop"`, `"beckon"`, or `"thanks"`. | Matches Aayam's body language to the technical context of each card. |
| **4. 16:9 Image Assets** | Save screenshots as `c1_1.webp`, `c2_1.webp`, etc., in `public/assets/apps/<slug>/`. | Ensures razor-sharp visual rendering with instant zero-lag WebP compression. |
| **5. Standard 8-Slide Flow** | Hook $\to$ Challenge $\to$ Solution DAG $\to$ Live UI $\to$ Workflow $\to$ Tech Stack $\to$ Impact $\to$ CTA. | Follows proven enterprise executive pitch storytelling. |

---

## 3. The Master ChatGPT Prompt (Copy & Paste)

Copy the prompt below and paste it into ChatGPT whenever you have a new project document or notes:

```markdown
{chatgpt_prompt}
```

---

## 4. File Placement Reference

Once ChatGPT gives you the JSON output:
1. **Catalog Registration**:
   Open `content/solutions.json` and append the **Output 1** object into the array.
2. **Slide Content Record**:
   Save **Output 2** as `content/apps/<slug>.json`.
3. **Screenshots & Graphics**:
   Create folder `public/assets/apps/<slug>/` and drop your images renamed to `c1_1.webp`, `c2_1.webp`, `c3_1.webp`, etc.
4. **Instant Verification**:
   Navigate to `http://localhost:3000/solution/<slug>/demo` in your browser. All slides, navigation pills, speech bubbles, and interactive terminals will render automatically!
"""

    md_docs_path = os.path.join(docs_dir, "AIS_PROJECT_ONBOARDING_PROMPT_TEMPLATE.md")
    with open(md_docs_path, "w", encoding="utf-8") as f:
        f.write(markdown_content)
        
    md_dl_path = os.path.join(downloads_dir, "AIS_PROJECT_ONBOARDING_PROMPT_TEMPLATE.md")
    shutil.copyfile(md_docs_path, md_dl_path)

    # -------------------------------------------------------------
    # 3. PROFESSIONAL WORD DOCUMENT (.docx)
    # -------------------------------------------------------------
    doc = docx.Document()
    
    # Page setup - Normal margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
    # Styles & Palette: Enterprise Azure (#0070F2), Slate Navy (#0A1D37), Slate Gray (#4B6282)
    COLOR_AZURE = RGBColor(0, 112, 242)
    COLOR_NAVY = RGBColor(10, 29, 55)
    COLOR_MUTED = RGBColor(75, 98, 130)
    COLOR_CODE = RGBColor(15, 23, 42)
    
    # Document Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(0)
    p_title.paragraph_format.space_after = Pt(2)
    run_sub = p_title.add_run("ABHIYANTA INDIA SOLUTIONS — AIS EXPERIENCE CENTRE\n")
    run_sub.font.size = Pt(10)
    run_sub.font.bold = True
    run_sub.font.color.rgb = COLOR_AZURE
    
    run_main = p_title.add_run("Project Onboarding & Master ChatGPT Prompt Guide")
    run_main.font.size = Pt(22)
    run_main.font.bold = True
    run_main.font.color.rgb = COLOR_NAVY
    
    p_meta = doc.add_paragraph()
    p_meta.paragraph_format.space_after = Pt(14)
    run_meta = p_meta.add_run("Clean Core Standard v2.0 | Next.js 15 Platform Architecture | Automated Slide Deck Generation")
    run_meta.font.size = Pt(9.5)
    run_meta.font.italic = True
    run_meta.font.color.rgb = COLOR_MUTED
    
    # Divider line
    p_div = doc.add_paragraph()
    p_div.paragraph_format.space_after = Pt(14)
    r_div = p_div.add_run("―" * 58)
    r_div.font.color.rgb = RGBColor(200, 220, 240)
    
    # Section 1: Executive Overview
    h1 = doc.add_heading(level=1)
    r_h1 = h1.add_run("1. Executive Overview & Workflow")
    r_h1.font.size = Pt(14)
    r_h1.font.bold = True
    r_h1.font.color.rgb = COLOR_NAVY
    
    p_desc = doc.add_paragraph(
        "This document provides the standardized prompt engineering template for rapidly onboarding any SAP project, "
        "proof-of-concept, or BTP accelerator into the AIS Experience Centre. By simply pasting your raw documentation, "
        "meeting notes, or Word documents into ChatGPT alongside this master prompt, you will receive 100% compliant JSON "
        "records and asset checklists ready for instant zero-drift deployment."
    )
    p_desc.paragraph_format.space_after = Pt(10)
    
    # Step-by-step table
    table = doc.add_table(rows=4, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    headers = ["Step", "Action", "Expected Artifact"]
    row_hdr = table.rows[0]
    for i, title in enumerate(headers):
        cell = row_hdr.cells[i]
        shading = parse_xml(r'<w:shd {} w:fill="0070F2"/>'.format(nsdecls('w')))
        cell._tc.get_or_add_tcPr().append(shading)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r = p.add_run(title)
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)
        
    steps_data = [
        ("Step 1", "Copy the Master Prompt below and paste your raw project notes/docx text at the bottom.", "ChatGPT Input"),
        ("Step 2", "ChatGPT generates the solutions.json entry and the full content/apps/<slug>.json file.", "Standardized JSON Schema"),
        ("Step 3", "Save JSON in repository, place screenshots in public/assets/apps/<slug>/, and verify live.", "Interactive Live Deck")
    ]
    
    for row_idx, data in enumerate(steps_data):
        row = table.rows[row_idx + 1]
        fill_color = "F8FAFC" if row_idx % 2 == 0 else "FFFFFF"
        for col_idx, val in enumerate(data):
            cell = row.cells[col_idx]
            shading = parse_xml(r'<w:shd {} w:fill="{}"/>'.format(nsdecls('w'), fill_color))
            cell._tc.get_or_add_tcPr().append(shading)
            p = cell.paragraphs[0]
            r = p.add_run(val)
            r.font.size = Pt(9)
            if col_idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_AZURE
            else:
                r.font.color.rgb = COLOR_NAVY
                
    doc.add_paragraph().paragraph_format.space_after = Pt(10)
    
    # Section 2: The 5 Golden Rules
    h2 = doc.add_heading(level=1)
    r_h2 = h2.add_run("2. The 5 Golden Rules of Slide Generation")
    r_h2.font.size = Pt(14)
    r_h2.font.bold = True
    r_h2.font.color.rgb = COLOR_NAVY
    
    rules = [
        ("Rule 1: Strict 2–3 Bullet Density", "Every slide description must strictly feature 2 to 3 concise bullet points (maximum 25 words per point). Long paragraphs are strictly prohibited to prevent text overflow."),
        ("Rule 2: Direct Spoken Companion Voice", "Aayam speaks his lines directly through an animated speech bubble. NEVER print labels like 'Bot Director Voice:' or quotation marks inside the slide text."),
        ("Rule 3: Contextual Mascot Posing", "Assign matching poses: 'present' for hook/ROI, 'point' for UI/code, 'tablet' for architecture DAGs, 'laptop' for terminal setups, and 'thanks' for closing."),
        ("Rule 4: 16:9 High-DPI Visual Assets", "All screenshots and diagrams must be saved as WebP format at /assets/apps/<slug>/c<slideNumber>_1.webp."),
        ("Rule 5: Proven 8-Slide Pitch Structure", "Follow the enterprise progression: Hook → Challenge → Solution DAG → Live UI → Process Workflow → Tech Stack → Business ROI → CTA Closing.")
    ]
    
    for r_title, r_desc in rules:
        p_rule = doc.add_paragraph()
        p_rule.paragraph_format.space_after = Pt(4)
        p_rule.paragraph_format.left_indent = Inches(0.2)
        r_t = p_rule.add_run(f"• {r_title}: ")
        r_t.font.bold = True
        r_t.font.size = Pt(10)
        r_t.font.color.rgb = COLOR_AZURE
        r_d = p_rule.add_run(r_desc)
        r_d.font.size = Pt(9.5)
        r_d.font.color.rgb = COLOR_NAVY

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # Section 3: The Master Prompt
    h3 = doc.add_heading(level=1)
    r_h3 = h3.add_run("3. The Master ChatGPT Prompt (Copy & Paste)")
    r_h3.font.size = Pt(14)
    r_h3.font.bold = True
    r_h3.font.color.rgb = COLOR_NAVY
    
    p_box_intro = doc.add_paragraph("Copy everything in the shaded block below into ChatGPT whenever you have a new project to onboard:")
    p_box_intro.paragraph_format.space_after = Pt(6)
    
    # Prompt Callout Box
    table_p = doc.add_table(rows=1, cols=1)
    table_p.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_p.autofit = False
    cell_p = table_p.rows[0].cells[0]
    cell_p.width = Inches(6.8)
    shd = parse_xml(r'<w:shd {} w:fill="F1F5F9"/>'.format(nsdecls('w')))
    cell_p._tc.get_or_add_tcPr().append(shd)
    
    p_code = cell_p.paragraphs[0]
    p_code.paragraph_format.space_before = Pt(6)
    p_code.paragraph_format.space_after = Pt(6)
    p_code.paragraph_format.left_indent = Inches(0.1)
    p_code.paragraph_format.right_indent = Inches(0.1)
    
    r_c = p_code.add_run(chatgpt_prompt)
    r_c.font.name = "Consolas"
    r_c.font.size = Pt(8.5)
    r_c.font.color.rgb = COLOR_CODE
    
    # Section 4: File Deployment Reference
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    h4 = doc.add_heading(level=1)
    r_h4 = h4.add_run("4. File Deployment & Directory Reference")
    r_h4.font.size = Pt(14)
    r_h4.font.bold = True
    r_h4.font.color.rgb = COLOR_NAVY
    
    dep_points = [
        ("content/solutions.json", "Append the Output 1 JSON record into the array. This registers your card in the Experience Centre catalog and pillar filter."),
        ("content/apps/<slug>.json", "Save the Output 2 JSON record under content/apps/ named exactly as your slug (e.g., product-cost-simulator.json)."),
        ("public/assets/apps/<slug>/", "Create this folder and place your screenshots as c1_1.webp, c2_1.webp, etc."),
        ("Instant Browser Preview", "Navigate to http://localhost:3000/solution/<slug>/demo. The slide deck, navigation dots, Aayam companion, and interactive elements load automatically!")
    ]
    
    for loc, expl in dep_points:
        p_dep = doc.add_paragraph()
        p_dep.paragraph_format.space_after = Pt(4)
        p_dep.paragraph_format.left_indent = Inches(0.2)
        r_l = p_dep.add_run(f"📁 {loc}: ")
        r_l.font.bold = True
        r_l.font.size = Pt(9.5)
        r_l.font.color.rgb = COLOR_AZURE
        r_e = p_dep.add_run(expl)
        r_e.font.size = Pt(9.5)
        r_e.font.color.rgb = COLOR_NAVY
        
    # Save .docx in documents/ and Downloads/
    docx_repo_path = os.path.join(docs_dir, "AIS_PROJECT_ONBOARDING_PROMPT_TEMPLATE.docx")
    doc.save(docx_repo_path)
    
    docx_dl_path = os.path.join(downloads_dir, "AIS_PROJECT_ONBOARDING_PROMPT_TEMPLATE.docx")
    shutil.copyfile(docx_repo_path, docx_dl_path)
    
    print("Files successfully generated:")
    print("1.", docx_repo_path)
    print("2.", md_docs_path)
    print("3.", prompt_txt_path)
    print("4.", docx_dl_path)
    print("5.", md_dl_path)
    print("6.", prompt_txt_dl)

if __name__ == '__main__':
    create_documents()
