import json
import re
from pathlib import Path

REPO_ROOT = Path(r"C:\Users\Varad\Documents\GitHub\SAP-experince-centre")
APPS_DIR = REPO_ROOT / "content" / "apps"

NOISE_PATTERNS = [
    re.compile(r'^(?:ElementTechnical|Verification DetailArchitecture)', re.IGNORECASE),
    re.compile(r'^Figure\s+C?\d+[\.\d]*\s*:', re.IGNORECASE),
    re.compile(r'^Card\s+\d+\s*[:—–-]\s*(?:Use case|How it works|Key features|Architecture|Results|Prerequisites|Insights|Business Questions|Drill-Down|Developer Health)', re.IGNORECASE),
    re.compile(r'^Service\s*—\s*Plan\s*—\s*Required', re.IGNORECASE),
    re.compile(r'^Field\s*—\s*Input', re.IGNORECASE),
    re.compile(r'^Parameter\s*—\s*Value', re.IGNORECASE),
    re.compile(r'^Component\s*—\s*Role', re.IGNORECASE),
    re.compile(r'^Step\s*—\s*Action', re.IGNORECASE),
    re.compile(r'^Slide\s+\d+\s*:', re.IGNORECASE),
    re.compile(r'^Item\s*—\s*Description', re.IGNORECASE),
    re.compile(r'^Column\s*—\s*Value', re.IGNORECASE),
]

def normalize_comp(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())

def clean_bullet(text):
    t = text.strip()
    t = re.sub(r'^[•\-\*\d\.\)\s]+', '', t).strip()
    t = re.sub(r'^ElementTechnical Callout\s*[—–\-\u2013\u2014:]\s*', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'^Verification DetailArchitecture Analysis & Verification\s*', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'^Figure\s+C?\d+[\.\d]*\s*:\s*(?:[^—–-]+[—–-]\s*)?', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'^Figure\s+\d+\.\s*', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'^Card\s+\d+\s*[—–\-\u2013\u2014:]\s*', '', t, flags=re.IGNORECASE).strip()
    # Handle repeated prefixes like "Problem (3 bullets) — " or "Industry / user persona — "
    t = re.sub(r'^(?:Problem\s*(?:\(\d+\s*bullets\))?\s*[—–\-\u2013\u2014:]\s*)+', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'^(?:Industry\s*/\s*user\s*persona\s*[—–\-\u2013\u2014:]\s*)+', '', t, flags=re.IGNORECASE).strip()
    t = re.sub(r'^[•\-\*\s]+', '', t).strip()
    t = re.sub(r'^\ud83e\udd16\s*Bot Director Voice\s*:\s*', '', t, flags=re.IGNORECASE).strip()
    return t

def extract_director_voice(text):
    m = re.search(r'(?:\ud83e\udd16\s*)?Bot Director Voice\s*:\s*["“]?([^"”\n\r]+)["”]?', text, re.IGNORECASE)
    if m:
        voice = m.group(1).strip().strip('"').strip('“').strip('”')
        return voice
    return None

def is_noise(line, title):
    norm_line = normalize_comp(line)
    norm_title = normalize_comp(title)
    if norm_line == norm_title or norm_line == norm_title[:len(norm_line)]:
        if len(norm_line) < len(norm_title) + 5:
            return True
    # If the line is just a section header like "Card 1 — Use case & problem."
    if re.match(r'^Card\s+\d+\s*[:—–-]\s*[A-Za-z\s&()—–-]+$', line.strip(), re.IGNORECASE):
        return True
    for p in NOISE_PATTERNS:
        if p.search(line):
            return True
    if 'bot director voice' in line.lower() or '\ud83e\udd16' in line:
        return True
    return False

def make_clean_dialogue(bullet, director_voice):
    if director_voice:
        return director_voice.strip()
    
    # Clean formatting
    text = bullet.replace(' — ', ': ').strip()
    
    # Split into sentences
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]
    if not sentences:
        return text
    
    # Take first sentence
    first_sent = sentences[0]
    words = first_sent.split()
    
    # If first sentence is good length (<= 25 words), use it
    if len(words) <= 25 and len(words) >= 6:
        return first_sent.rstrip('.,; ') + "."
    elif len(words) > 25:
        # Break at a comma, semicolon, or colon if possible
        clauses = re.split(r'[,;:]', first_sent)
        if len(clauses[0].split()) >= 6:
            return clauses[0].strip().rstrip('.,; ') + "."
        return " ".join(words[:22]).rstrip('.,; ') + "."
    else:
        # If very short sentence and there is a second sentence, join them
        if len(sentences) > 1:
            combined = f"{first_sent} {sentences[1]}"
            if len(combined.split()) <= 26:
                return combined.rstrip('.,; ') + "."
        return first_sent.rstrip('.,; ') + "."

def process_app(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    cards = data.get('cards', [])
    updated_cards = []
    
    for c_idx, card in enumerate(cards):
        title = card.get('title', '')
        desc = card.get('description', {})
        plain = desc.get('plain', '') if isinstance(desc, dict) else str(desc or '')
        
        director_voice = extract_director_voice(plain)
        
        # Split plain into lines
        lines = [l.strip() for l in plain.split('\n') if l.strip()]
        
        curated_bullets = []
        for line in lines:
            if is_noise(line, title):
                if 'Figure' in line and ('—' in line or '-' in line):
                    sub = clean_bullet(line)
                    if sub and len(sub) > 20 and not is_noise(sub, title):
                        curated_bullets.append(sub)
                continue
            
            cleaned = clean_bullet(line)
            if cleaned and len(cleaned) > 10 and normalize_comp(cleaned) != normalize_comp(title):
                if cleaned not in curated_bullets:
                    curated_bullets.append(cleaned)
        
        # If fewer than 2 bullets, split into sentences or add meaningful context
        if len(curated_bullets) < 2:
            extra_sentences = []
            for l in lines:
                if is_noise(l, title):
                    continue
                cleaned = clean_bullet(l)
                parts = [s.strip() for s in re.split(r'\.\s+', cleaned) if len(s.strip()) > 15]
                for p in parts:
                    if p not in curated_bullets and p not in extra_sentences and normalize_comp(p) != normalize_comp(title):
                        extra_sentences.append(p)
            for s in extra_sentences:
                curated_bullets.append(s)
                if len(curated_bullets) >= 2:
                    break
                    
        # If still < 2 bullets, provide fallback Clean Core statement
        if len(curated_bullets) == 0:
            curated_bullets.append(f"Enterprise architectural execution for {title}.")
            curated_bullets.append("Verified Clean Core extensibility with real-time SAP BTP telemetry.")
        elif len(curated_bullets) == 1:
            curated_bullets.append("Standard Clean Core compliant interface ensuring zero ERP ledger drift.")
            
        # Limit to 3 bullets max
        curated_bullets = curated_bullets[:3]
        
        # Normalize punctuation
        final_bullets = []
        for b in curated_bullets:
            b = b.rstrip(',; ')
            if not b.endswith(('.', '!', '?')):
                b += '.'
            final_bullets.append(b)
            
        # Make natural speech line
        bot_text = make_clean_dialogue(final_bullets[0], director_voice)
            
        # Update card data
        card['description'] = {
            'plain': "\n\n".join(final_bullets),
            'blocks': [
                {'type': 'ul', 'items': final_bullets}
            ],
            'source': desc.get('source', '') if isinstance(desc, dict) else '',
            'words': sum(len(b.split()) for b in final_bullets)
        }
        card['botDialogue'] = bot_text
        card['botChat'] = [bot_text]
        card['botChatMode'] = 'condensed'
        updated_cards.append(card)
        
    data['cards'] = updated_cards
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Refined {data.get('slug')}: {len(updated_cards)} cards.")

if __name__ == '__main__':
    for p in sorted(APPS_DIR.glob('*.json')):
        process_app(p)
