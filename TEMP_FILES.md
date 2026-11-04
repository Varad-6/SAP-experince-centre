# TEMP_FILES.md — Ledger of Transient & Scratch Files

All scratch and transient files generated during development cycles are recorded here.

| Path | Purpose | Created | Status |
| :--- | :--- | :--- | :--- |
| `scripts/generate-stubs.ts` | One-off script generating the 27 valid stub app scripts conforming to 8-card schema | Phase 1 | Preserved for schema re-generation |
| `scripts/make-placeholders.ts` | Procedural SVG asset generator for zero-asset fallback guarantee | Phase 1 | Permanent utility (`npm run assets:placeholders`) |
| `scripts/validate-content.ts` | Prebuild content validation utility | Phase 1 | Permanent utility (`npm run content:check`) |
| `scripts/optimize-assets.ts` | Sharp pipeline for trimming and webp conversion of bot poses | CR v2 Phase 3 | Permanent utility (`npm run assets:optimize`) |
| `scripts/enrich-apps.ts` | Content enrichment script synchronizing 28 apps with basicIntro, contact, and closing | CR v2 Phase 5 | Utility retained for catalog maintenance |
