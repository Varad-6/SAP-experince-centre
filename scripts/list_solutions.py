import json

with open('content/solutions.json', 'r', encoding='utf-8') as f:
    sols = json.load(f)

for i, s in enumerate(sols):
    print(f"{i+1}. slug={s['slug']} | pillar={s['pillarId']} | title={s['title']}")
