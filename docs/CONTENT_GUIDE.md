# CONTENT ARCHITECTURE & AUTHORING GUIDE

## 1. Directory Structure
- `/content/site.json`: Global brand metadata, hero text, and high-level enterprise statistics.
- `/content/pillars.json`: Definitions of the 5 architectural pillars, their brand accent colors, and ordering.
- `/content/solutions.json`: 28 solutions summary records with slugs, tags, and ROI metrics.
- `/content/apps/{slug}.json`: Scripted 8-card interactive walkthrough for each individual solution.

## 2. Card Specification (Strict 8-Card Script)
Every solution walkthrough must contain exactly 8 cards validating against `CardSchema` in `/lib/schema.ts`:
1. `hook`: Executive problem statement with hero numerical KPI.
2. `challenge`: Operational bottleneck with before/after analysis or pain matrix.
3. `solution`: Interactive DAG architecture diagram with data flow nodes.
4. `live-ui`: High-resolution application screenshot with interactive coordinate hotspots.
5. `workflow`: 3-step operational pipeline with mapped SAP transaction codes.
6. `tech-stack`: Cloud infrastructure chips categorized by architectural layer.
7. `impact`: Quantified business ROI metrics and time compression deltas.
8. `cta`: Action buttons to launch live demo, view prerequisites, or download executive PDF.

## 3. Validation
Run `npm run content:check` before committing. The build script automatically runs this prebuild check.
