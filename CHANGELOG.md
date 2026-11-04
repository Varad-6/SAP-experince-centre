# CHANGELOG — AIS Experience Centre

All notable changes to the `SAP-experince-centre` platform are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [5.0.0] — 2026-11-04 — Master Plan v5: Real Software Dashboard Curation, Thought-Wave Bubble Engine & Exact 4-Pillar Redistribution

### Summary
Executed complete architectural overhaul per Master Plan v5: replaced all summary/PPT slides with genuine live software UI dashboards across all 28 applications, implemented overhead Thought-Wave speech bubble clearance engine, rebalanced the 4 pillars symmetrically (`p1`: 3, `p2`: 7, `p3`: 6, `p4`: 12), and added first-class applications for `mdr`, `reconly`, `revenue-analytics`, `vendor-management`, and `quality-management-analytics`.

### Added & Updated
- **Overhead Thought-Wave Bubble Engine**: Re-engineered `BotBubble.tsx` and `LandingActorSequence.tsx` with a generous 72px overhead clearance buffer and 3-circle thought-wave trail, ensuring 100% head and face visibility throughout all 3 videos.
- **Three-Act Video Scripts**: Synchronized narrative focusing on Abhiyanta India Solutions, modern AI engineering, and Clean Core standards.
- **Real Software Dashboards**: Replaced all PPT graphics with genuine production software consoles (e.g. PODZO Transporter Command Console `screen-1.png`, Reconly 3-way match cockpit, MDR master data workspace).
- **Exact Pillar Catalog**:
  - `p1`: Foundation & BTP Infrastructure (3 solutions: Vibe Coding, Connectivity Mesh, CPI Hybrid Cloud)
  - `p2`: Custom BTP Applications (7 solutions: PODZO, RECONLY, Product Cost Simulator, MDR, Invoice Decision Intelligence, AIS Debug Studio, ABAP Cloud Converter)
  - `p3`: HanaMorph & Data Modernization (6 solutions: HanaMorph, Datasphere Lineage, Calc View Optimizer, BW/4HANA Accelerator, Doc Intelligence, Contract Intelligence)
  - `p4`: SAC Executive Dashboards (12 solutions: Manufacturing Yield, Asset Reliability, Sales & Margin, Revenue Analytics, Vendor Spend, Quality Management, Autonomous Procurement, Clean Core Extensibility, Identity & Access Governance, ESG, Supply Chain, CFO Liquidity)
- **Symmetrical 4-Pillar Grid**: Upgraded `/pillars` to a balanced 4-column layout (`xl:grid-cols-4`) with equal-height cards and aligned baselines.
- **Verification**: `npm run content:check` (100% valid), `npm test` (13/13 passing), `npm run build` (79/79 static pages generated).

---

## [4.0.0] — 2026-11-04 — Aayam Rebrand, Procreate Blue Palette, 4-Pillar Architecture & Ingestion

### Summary
Rebranded the platform to **Aayam — AIS Experience Centre** (*"Exploring new dimensions of technology"*). Introduced the lead guide character **Aayam**, updated the styling tokens to the **Procreate Blue Palette** (mid-layer royal sapphire, electric blue accents, deep executive navy), consolidated to **4 Architectural Pillars**, and built automated extraction pipeline pulling real high-resolution screenshots and rich tables from `ais exp data.zip`.

### Added & Updated
- **Master Specification v4**: Delivered `AAYAM_AIS_EXPERIENCE_CENTRE_MASTER_PROMPT_v4.md` artifact with complete Big Four presentation standard.
- **Hero & Landing**: Hero title upgraded with bold "Aayam" and "AIS Experience Centre", "Exploring new dimensions of technology" tagline, prominent floating SoundToggle and architecture contact trigger.
- **Bot Persona**: Guide bot renamed to **Aayam** across all components (`BotBubble`, `BotSprite`, `LandingActorSequence`, `SlideDeck`, `PillarBotDock`, `site.json`).
- **Design Tokens**: Standardized on Procreate Blue Palette in `styles/tokens.css` (`--bg: #F0F6FD`, `--surface-2: #E8F2FC`, `--brand-vivid: #0084FF`, `--brand-electric: #00A6FF`, `--navy: #0A1D37`).
- **4 Architectural Pillars**:
  1. `p1`: Foundation & Clean Core (7 solutions)
  2. `p2`: Custom BTP Applications (7 solutions)
  3. `p3`: HanaMorph & Modernization (7 solutions)
  4. `p4`: SAC Executive Dashboards (7 solutions)
  (Removed deprecated 5th Joule standalone pillar; replaced with `sap-btp-vibe-coding`).
- **Screenshot & Content Extraction Pipeline**: Created `scripts/extract_and_enrich.py` extracting 80+ high-resolution screenshots from `.docx` files directly into `/public/assets/apps/{slug}/screen-{1..N}.png` and enriching each application's 8-slide deck with verified business challenges, architecture nodes, workflow steps, and quantitative ROI metrics.
- **Verification**: `npm run content:check` (100% valid), `npm test` (13/13 passing), `npm run build` (79/79 static pages generated).

---

## [2.0.0] — 2026-11-04 — Change Request v2: Enterprise Fiori Horizon & 2D Sprite Stack

### Summary
Replaced experimental 3D/WebXR/audio stack with a lightweight, clean, executive SAP Fiori Horizon-inspired platform (`#F5F7FA`, `#0070F2`, `#0A1F44`). Swapped heavy Three.js canvases for crisp 2D sprite pose-swapping, GSAP parachute drop timeline, and streamlined 8-slide walkthrough deck with dedicated Closing Slide and contact modal.

### Removed
- **All Audio**: Removed `howler`, `@types/howler`, `lib/audio.ts`, Web Audio API synthesizer, sound toggles, and audio keyboard shortcuts (`M`, `C`).
- **Heavy 3D Stack**: Removed `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@react-three/xr`, `three-stdlib`, `@types/three`, `lenis`, WebXR sessions, 3D camera rigs, particle storms, glassmorphism blur, neon glow, and gradient text.

### Added & Restructured
- **Design Tokens**: Standardized on [tokens.css](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/styles/tokens.css) (Fiori Horizon tokens: `--bg: #F5F7FA`, `--surface: #FFFFFF`, `--surface-2: #EEF2F7`, `--border: #D9E0EA`, `--brand: #0070F2`, `--navy: #0A1F44`, `--ok: #188918`, `--warn: #E9730C`, `--danger: #D20A0A`).
- **Typography**: Single clean font **Inter** loaded via `next/font/google`.
- **Pages & Flow**:
  - `/` Landing: Full-height sky stage (`linear-gradient(var(--sky-top), var(--sky-bottom))`), drifting clouds, 14% ground strip (`#E3E9F2`), title block, "Explore solutions" CTA, and animated drone drop-in bot.
  - `/pillars`: 5 clean cards in a 6-col responsive grid (cards 1–2 span 3 cols, cards 3–5 span 2 cols), 3px pillar accent top borders, docked bot with 5s auto-hide speech bubble (*"Pick a pillar to explore."*).
  - `/pillar/[id]`: Clean header with `< All pillars` link, pillar title, and clean grid (`repeat(auto-fill, minmax(240px, 1fr))`) of solution cards with 16:9 thumbnails via [ThumbnailImage.tsx](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/components/ThumbnailImage.tsx), status chips (`Production` / `Preview`), and ROI badges.
  - `/solution/[slug]`: Breadcrumb (`Pillars > [Pillar Title] > [Solution Title]`), H1, 1-line intro, status chips, center 16:9 `.card` hero preview, bottom action row with TWO buttons ("Contact for details" opening `ContactDialog` and "Demo" navigating to walkthrough), docked bot in `present` pose with `basicIntro` speech bubble.
  - `/solution/[slug]/demo`: [SlideDeck.tsx](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/components/demo/SlideDeck.tsx) presenting 8 slides + Slide 9 Closing slide with "Thank You", live demo credentials info (`closing.liveDemoInfo`), "Share feedback" link, and "Demo contact" button.
- **2D Bot & Drone Engine**:
  - [poses.ts](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/lib/poses.ts): 12 sprite poses with vertical calibration offsets (`POSE_FIT`).
  - [BotSprite.tsx](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/components/BotSprite.tsx): Dynamic pose-swapping sprite component with zero-break `_placeholder.svg` fallback.
  - [optimize-assets.ts](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/scripts/optimize-assets.ts): Automated Sharp pipeline generating trimmed, 85-quality WebP sprites.
  - [IntroDrop.tsx](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/components/IntroDrop.tsx): 2D GSAP timeline with drone fly-in, claw drop, parachute deployment, gentle swaying float, ground touchdown, parachute collapse, pose transitions (`fly` -> `fall` -> `wave` -> `idle`), and typewriter speech bubble. Features "Skip intro (Esc)" button, `sessionStorage` caching (`ais.intro=1`), and `prefers-reduced-motion` compliance.
  - [ContactDialog.tsx](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/components/ContactDialog.tsx): Clean corporate modal supporting email, phone, and Microsoft Teams integration.
- **Content & Validation**:
  - Extended [schema.ts](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/lib/schema.ts) with `ContactSchema`, `ClosingSchema`, `basicIntro`, `contact`, `closing`, and `botPose`.
  - Enriched all 28 enterprise application scripts in `content/apps/` via [enrich-apps.ts](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/scripts/enrich-apps.ts).
  - Strict validator in [validate-content.ts](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/scripts/validate-content.ts).
  - 9/9 Vitest tests passing in [content.test.ts](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/tests/content.test.ts) and [routes.test.ts](file:///C:/Users/Varad/Documents/GitHub/SAP-experince-centre/tests/routes.test.ts).

---

## [1.0.0] — 2026-11-02 — Master Build Prompt v1.0 Release

### Added
- Initial 3D platform foundation with Next.js 15, R3F, 28 enterprise solutions across 5 pillars, and WebXR.
