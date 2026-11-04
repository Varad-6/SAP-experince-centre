# PHASE 0 — REPO & ASSET AUDIT (Master Prompt v3)
**Repository**: `SAP-experince-centre`  
**Standard**: Master Prompt v3 Single Source of Truth  
**Delivered Assets**: `C:\Users\Varad\Downloads\ais exp data\AIS_Assets_Pack.zip` + Team Word Documents

---

## 1. Audit Summary & Deletions Map

### 1.1 Audio & 3D Items Completely Removed / Blocked
- **Audio Stack**: Zero audio anywhere. No Howler (`howler`, `@types/howler`), no `lib/audio.ts`, no sound files, no volume toggles, no sound shortcuts (`M`, `C`). All `<video>` elements strictly `muted playsInline`.
- **Heavy 3D Stack**: No Three.js (`three`, `@types/three`), `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@react-three/xr`, `three-stdlib`, `lenis`.
- **Visual Gimmicks**: No neon glows, no backdrop-filter blur, no gradient text, no particle storms, no 3D tilt.

### 1.2 Deprecated / Transient Files to Clean
- Legacy test files or scratch scripts replaced by Master Prompt v3 tests.
- Vector fallback SVGs (`drone.svg`, `parachute.svg`) replaced by real VP9 alpha videos (`intro_drop.webm`, `analytics_laptop.webm`, `explain_close.webm`).
- Unused bot poses (`hang`, `jump`, `chute`, `land`) moved to `/public/assets/bot/unused/` and never referenced.

### 1.3 Kept & Reused Infrastructure
- **Next.js 15 App Router & React 19** with TypeScript strict mode.
- **Self-hosted / Google Font**: Inter only (400, 500, 600, 700).
- **Core Preserved Routes**: `/architecture`, `/prerequisites`, `/present`, `/solution/[slug]`, `/solutions/[slug]`.
- **Design Tokens**: `styles/tokens.css` (Fiori Horizon tokens: `--bg: #F5F7FA`, `--surface: #FFFFFF`, `--surface-2: #EEF2F7`, `--border: #D9E0EA`, `--brand: #0070F2`, `--navy: #0A1F44`).
- **Core Content Base**: `content/pillars.json`, `content/solutions.json` (28 enterprise SAP solutions).

---

## 2. Real Assets Inventory (`AIS_Assets_Pack.zip`)

### 2.1 8 Active Sprites (`/public/assets/bot/`)
All sprites are transparent WebP/PNG, calibrated to a shared scale (`standingHeightPx = 620`), anchored by **FEET** (`anchorX`, `anchorY`), never by image centre.

| Pose | Image Dimensions (w × h) | Feet Anchor (`anchorX`, `anchorY`) | Head Center (`headCx`, `hairTop`) | Primary Screen Usage |
| :--- | :--- | :--- | :--- | :--- |
| `idle` | 333 × 660 px | (160, 648) | (0.509, 0.018) | Docked idle on `/pillars`, demo rest states |
| `wave` | 342 × 636 px | (174, 621) | (0.530, 0.027) | Landing final frame greeting |
| `point` | 384 × 641 px | (164, 626) | (0.423, 0.023) | `/pillar/[id]`, Slide 2 (Challenge), Slide 4 (Live UI) |
| `tablet` | 378 × 640 px | (205, 626) | (0.565, 0.022) | Slide 3 (Solution DAG), Slide 5 (Workflow) |
| `laptop` | 362 × 643 px | (202, 628) | (0.578, 0.026) | Slide 6 (Tech Stack Architecture) |
| `present` | 381 × 655 px | (161, 640) | (0.428, 0.024) | `/solution/[slug]`, Slide 1 (Hook), Slide 7 (Impact) |
| `beckon` | 361 × 657 px | (198, 643) | (0.552, 0.023) | `/solution/[slug]` hover on Demo, Slide 8 (Walkthrough CTA) |
| `thanks` | 326 × 660 px | (170, 645) | (0.504, 0.027) | Slide 9 (Closing Slide) |

*4 Unused Poses*: `hang`, `jump`, `chute`, `land` moved to `/public/assets/bot/unused/`.

### 2.2 3 Real Video Acts (`/public/assets/video/`)
Transparent VP9 `.webm` with alpha for Chrome/Edge/Firefox, matching `_nokey.mp4` for Safari WebGL chroma-key shader, and `_last.png` for posters/reduced-motion stills.

| Act | Name | Resolution | Duration | Key Color | Bubble Start | Spoken/Typed Content |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Act 1: Arrival** | `intro_drop` | 1280 × 720 | 10.0 s | `#E95DCF` | **8.6 s** (touchdown on mound) | `introScript` act:1 ("Hi, I'm Lead Architect...") |
| **Act 2: What we do** | `analytics_laptop` | 1920 × 1080 | 10.0 s | `#F445AE` | **4.5 s** (hologram appears) | `introScript` act:2 ("We build enterprise AI & SAP BTP...") |
| **Act 3: Invitation**| `explain_close` | 1920 × 1080 | 10.0 s | `#F647BC` | **1.0 s** | `introScript` act:3 ("Explore solutions...") → CTA |

---

## 3. Team Word Documents Inventory (`C:\Users\Varad\Downloads\ais exp data`)

The following real production project documents will be imported into `/content/apps/{slug}.json` via `scripts/import-template.py`:
1. `AIS Experience Centre - PODZO Demo Content.docx` → `podzo.json` (Flagship Logistics)
2. `AIS Experience Centre - SAP BTP Vibe Coding Demo Content.docx` → `sap-btp-vibe-coding.json`
3. `AIS Experience Centre - HanaMorph Demo Content.docx` → `hanamorph.json`
4. `ABAP_CDS_AI_Debug_Studio_AIS_Experience_Centre1.docx` → `ais-debug-studio.json`
5. `Invoice_Decision_Intelligence_AIS_Experience_Centre.docx` → `invoice-decision-intelligence.json`
6. `Asset_Reliability_MRO_Dashboard_Documentation.docx` → `asset-reliability-mro.json`
7. `Manufacturing_Yield_Scrap_Quality_Cockpit_Client_Documentation-10.docx` → `manufacturing-yield-scrap.json`
8. `O2C_Receivables_Intelligence_Dashboard_Documentation (2).docx` → `sales-margin-analytics.json` / receivables
9. `Procure_to_Pay_Documentation.docx` → `autonomous-procurement-agent.json`
10. `Product_Cost_Simulator_AIS_Experience_Centre1.docx` → `product-cost-simulator.json`

---

## 4. Master 8-Phase Execution Plan

- **PHASE 1 — Asset Unpack & Foundation**:
  - Extract `AIS_Assets_Pack.zip` into `/public/assets/`.
  - Isolate unused poses into `/public/assets/bot/unused/`.
  - Verify `assets.json` and `_meta.json`.
  - Generate `docs/ASSETS.md`.
- **PHASE 2 — Feet-Anchored Sprites & Thinking BotBubble**:
  - `components/BotSprite.tsx`: Position strictly by `(anchorX, anchorY)` feet coordinates, scale `k = H / 620`.
  - `components/BotBubble.tsx`: 3 thinking circles (6px, 9px, 12px with 90ms stagger), scaling from head anchor, 22ms/char typing, translucent background (`rgba(255,255,255,0.86)`), hide toggle (`C`).
  - Wire `/pillars`, `/pillar/[id]`, and `/solution/[slug]` (with hover `beckon` pose).
- **PHASE 3 — ActorVideo & 3-Act Landing Sequence**:
  - `components/ActorVideo.tsx`: Bottom-anchored 16:9 `.actor`, `muted playsInline`, `requestVideoFrameCallback` tracking.
  - Safari/iOS WebGL chroma-key shader fallback using CbCr distance math.
  - Interactive tuning route `/debug/key?video=intro_drop` with `sim` and `blend` sliders.
  - 3-Act orchestration on `/` with crossfading and "Explore solutions" open-palm hand alignment.
- **PHASE 4 — SlideDeck (8 Slides + Slide 9 Closing)**:
  - SlideDeck with exact pose sequences (`app` variant vs `dashboard` variant).
  - Restyled card subcomponents with moving 20px arrow cursor on screenshot callouts and animated ROI delta bars.
  - Slide 9 Closing slide with feedback link, demo contact, and live demo info.
- **PHASE 5 — Content Schema, docx Importer & Data**:
  - Updated Zod schema in `lib/schema.ts` (`IntroLine`, `Contact`, `Closing`, `AppContent`).
  - `scripts/import-template.py` parsing `.docx` from `/content/inbox/`.
  - Strict validator `npm run content:check` enforcing word counts, card counts, and image presence.
- **PHASE 6 — Responsive Pass & No-Clip Verification**:
  - Calibrate all 8 viewports: 390×844, 430×932, 820×1180, 1180×820, 1440×900, 1728×1117, 1920×1080, 3840×2160 (scale ×1.25 on 4K).
  - Strict no-clip check: sprite and bubble inside viewport boundaries.
- **PHASE 7 — Playwright E2E Test Suite & Documentation**:
  - End-to-end journey tests with screenshot captures in `/tests/shots/`.
  - Comprehensive `README.md` guide for adding apps, swapping videos, and importing docs.
- **PHASE 8 — Final Review & Sign-Off**:
  - Verification against Definition of Done checklist.
