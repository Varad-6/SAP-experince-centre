# TEMP_FILES.md — Ledger of Transient & Scratch Files

All scratch and transient files generated during development cycles are recorded here.

| Path | Purpose | Created | Status |
| :--- | :--- | :--- | :--- |
| `scripts/generate-stubs.ts` | One-off script generating the 27 valid stub app scripts conforming to 8-card schema | Phase 1 | Preserved for schema re-generation |
| `scripts/make-placeholders.ts` | Procedural SVG asset generator for zero-asset fallback guarantee | Phase 1 | Permanent utility (`npm run assets:placeholders`) |
| `scripts/validate-content.ts` | Prebuild content validation utility | Phase 1 | Permanent utility (`npm run content:check`) |
| `scripts/optimize-assets.ts` | Sharp pipeline for trimming and webp conversion of bot poses | CR v2 Phase 3 | Permanent utility (`npm run assets:optimize`) |
| `scripts/enrich-apps.ts` | Content enrichment script synchronizing 28 apps with basicIntro, contact, and closing | CR v2 Phase 5 | Utility retained for catalog maintenance |
| `scripts/extract_and_enrich.py` | Automated docx screenshot and content extraction pipeline for ais exp data.zip | v4.0 | Utility retained for catalog updates |
| `scripts/make_sac_apps.py` | Generator for SAC dashboard applications from ais exp data sub-zips | v5.0 | Utility retained for catalog updates |
| `scripts/snap.js` | Automated Playwright multi-viewport visual regression and snapshot script | v5.0 | Permanent UI testing utility (`node scripts/snap.js`) |
| `scripts/measure-head-track.py` | Python 4fps ffmpeg + scipy.ndimage hair cluster tracker for videoHeadTracks | v6.0 | Permanent utility (`python scripts/measure-head-track.py`) |
| `scripts/step1_inventory_and_map.py` | Inventory generator and project matcher for content inbox | v6.2 | Utility retained (`docs/INBOX_TREE.md`, `content/inbox-map.json`) |
| `scripts/build_pipeline.py` | WebP conversion, SHA-1 collision-free extractor and schema builder | v6.2 | Permanent pipeline utility |
| `scripts/verify_audit.ts` | Multi-viewport Playwright visual and console error audit script | v6.2 | Permanent verification utility (`npx tsx scripts/verify_audit.ts`) |
