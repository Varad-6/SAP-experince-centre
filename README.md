# AIS Experience Centre — Next-Gen SAP Enterprise Solutions
**Organization**: Abhiyanta India Solutions (AIS)  
**Standard**: Master Prompt v3 (Single Source of Truth)

---

## 1. Executive Overview

The **AIS Experience Centre** is a responsive showcase for Abhiyanta India Solutions, an SAP Gold Partner specializing in SAP BTP, Clean Core extensibility, and Agentic AI copilots.

Visitors are guided by **The Lead Architect**, an interactive cartoon mascot with feet-anchored 2D sprite poses, translucent thinking bubbles, and a 3-act transparent video introduction.

### Core Architecture Highlights
- **Clean SAP-Fiori Light Look**: Enterprise Horizon tokens (`#F5F7FA` Quartz background, `#0070F2` Azure, `#0A1F44` Navy).
- **Strictly Audio-Free & Clean 2D Motion**: Zero WebGL 3D scenes, no bloom/particles, no audio files, all videos strictly `muted playsInline`.
- **Feet-Anchored Mascot Sprites**: All poses share a single reference scale ($H = 620\text{px}$) and are positioned by feet anchors `(anchorX, anchorY)` from `_meta.json`.
- **Multi-Act Video Intro with Safari WebGL Shader Fallback**: Native transparent VP9 WebM for Chrome/Edge/Firefox, and a real-time WebGL CbCr chroma-key shader for Safari/iOS WebKit (`_nokey.mp4`).
- **Interactive Shader Calibration Route**: Visit `/debug/key?video=intro_drop` to calibrate color keys, similarity, and smoothness with live video playback on a checkerboard canvas.
- **Word Document Pipeline**: Direct ingestion of `.docx` project briefs into structured JSON apps via `python scripts/import-template.py`.

---

## 2. Information Architecture & Navigation

```
/                             -> Landing Page (3-Act Mascot Video Intro + Explore solutions CTA)
├── /pillars                  -> 5 Architectural Pillars (6-column responsive grid + docked guide bot)
│   └── /pillar/[id]          -> Pillar detail & solution cards (p1..p5)
├── /solution/[slug]          -> Solution detail page (Interactive demo & Architecture top buttons)
│   └── /solution/[slug]/demo -> 8-Slide Interactive Walkthrough + Slide 9 Closing Slide
├── /debug/key                -> Safari WebGL Chroma-Key Shader calibration tool
├── /architecture             -> Reference architecture blueprints
├── /prerequisites            -> BTP tenant & landscape deployment prerequisites
└── /present                  -> Presenter kiosk view
```

---

## 3. Mascot Sprite & Video Specifications

### 8 Active Poses (`/public/assets/bot/`)
| Pose | Dimensions (w × h) | Feet Anchor (`anchorX`, `anchorY`) | Head Center (`headCx`, `hairTop`) | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `idle` | 333 × 660 px | (160, 648) | (0.509, 0.018) | Docked idle on `/pillars`, rest state |
| `wave` | 342 × 636 px | (174, 621) | (0.530, 0.027) | Landing final frame greeting & Welcome |
| `point` | 384 × 641 px | (164, 626) | (0.423, 0.023) | `/pillar/[id]`, Slide 2 (Challenge), Slide 4 (Live UI) |
| `tablet` | 378 × 640 px | (205, 626) | (0.565, 0.022) | Slide 3 (Solution DAG), Slide 5 (Workflow) |
| `laptop` | 362 × 643 px | (202, 628) | (0.578, 0.026) | Slide 6 (Tech Stack Architecture) |
| `present` | 381 × 655 px | (161, 640) | (0.428, 0.024) | `/solution/[slug]`, Slide 1 (Hook), Slide 7 (Impact) |
| `beckon` | 361 × 657 px | (198, 643) | (0.552, 0.023) | `/solution/[slug]` hover on Demo CTA, Slide 8 |
| `thanks` | 326 × 660 px | (170, 645) | (0.504, 0.027) | Slide 9 (Closing Slide) |

*Unused poses isolated in `/public/assets/bot/unused/`: `hang`, `jump`, `chute`, `land`.*

### 3 Video Acts (`/public/assets/video/`)
1. **Act 1 (`intro_drop`)**: 1280×720, Key `#E95DCF`, Bubble at 8.6s (Drone delivery & landing on grass mound).
2. **Act 2 (`analytics_laptop`)**: 1920×1080, Key `#F445AE`, Bubble at 4.5s (Laptop typing & holographic dashboard).
3. **Act 3 (`explain_close`)**: 1920×1080, Key `#F647BC`, Bubble at 1.0s (Close-up & open-palm gesture aligning with "Explore solutions" CTA).

---

## 4. Development & Toolchain Commands

### Start Local Development Server
```bash
npm run dev
```
Accessible at `http://localhost:3000`.

### Content Integrity Check
Enforces strict Zod validation across `site.json`, `pillars.json`, `solutions.json`, and all 28 app scripts:
```bash
npm run content:check
```

### Unit & Smoke Testing
Runs Vitest test suite covering route smoke tests, schema validations, and 8-viewport responsive assertions:
```bash
npm test
```

### End-to-End Playwright Tests
Executes end-to-end user journeys and saves screenshots to `/tests/shots/`:
```bash
npm run test:e2e
```

### Ingest Team Word Documents
Parses `.docx` files from `C:\Users\Varad\Downloads\ais exp data` into `/content/apps/{slug}.json`:
```bash
python scripts/import-template.py
```

### Production Build
Generates static pages with zero compilation or lint errors:
```bash
npm run build
```

---

## 5. Responsive Verification (8 Target Viewports)

The application is calibrated and verified against 8 canonical screen sizes without content clipping or horizontal overflow:
1. `390 × 844` (Mobile Standard / iPhone 14)
2. `430 × 932` (Large Mobile / iPhone 15 Pro Max)
3. `820 × 1180` (Tablet Portrait / iPad Air)
4. `1180 × 820` (Tablet Landscape / iPad Air)
5. `1440 × 900` (Laptop / MacBook Air 13")
6. `1728 × 1117` (High-DPI Laptop / MacBook Pro 16")
7. `1920 × 1080` (Full HD Desktop)
8. `3840 × 2160` (4K UHD Boardroom Display with automated 125% root scaling)
