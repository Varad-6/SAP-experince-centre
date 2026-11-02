# REPO AUDIT — AIS Experience Centre
**Audit Date**: 2026-11-02  
**Target Repository**: `C:\Users\Varad\Documents\GitHub\SAP-experince-centre`  
**Execution Standard**: Master Build Prompt Rule 0.3

---

## 1. Current Folder Tree

```
SAP-experince-centre/
├── .gitignore
├── AGENTS.md
├── CHANGELOG.md
├── TEMP_FILES.md
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── architecture/
│   │   └── page.tsx
│   ├── prerequisites/
│   │   └── page.tsx
│   ├── present/
│   │   └── page.tsx
│   └── solutions/
│       └── [slug]/
│           └── page.tsx
├── components/
│   ├── Navbar.tsx
│   └── mascot/
│       └── ChibiMascot.tsx
├── data/
│   └── solutions.json
└── public/
    ├── mascot/
    │   ├── mascot_standing.png
    │   ├── mascot_pointing.png
    │   └── mascot_explaining.png
    └── media/
        ├── ais_logo.png
        └── podzo_live_production_screen.png
```

---

## 2. Styling Approach & Token Audit

- **Current Styling**: Tailwind CSS v3 (`tailwindcss: 3.4.16`) + PostCSS with customized theme extensions in `tailwind.config.js` (`sap.blue: #0070F2`, `sap.navy: #0A111E`, `sap.cyan: #00C8F8`, etc.).
- **Required Master Tokens (Section 4)**:
  - Strict dark theme only (`--navy-950: #050E22`, `--navy-900: #0A1F44`, `--navy-800: #102A5C`).
  - Brand accents (`--sap-blue: #0070F2`, `--cyan: #00B8F5`, `--gold: #F0AB00`, `--violet: #8B5CF6`, `--teal: #19C3A6`).
  - Glassmorphic spec: `background: rgba(16,42,92,0.45)`, `border: 1px solid rgba(255,255,255,0.14)`, `backdrop-filter: blur(18px) saturate(140%)`, shadow `0 20px 60px rgba(0,112,242,0.18)`.
  - Pillar-specific accents: P1 Foundation (`--sap-blue`), P2 Custom BTP Apps (`--cyan`), P3 AI & Joule (`--violet`), P4 HanaMorph (`--gold`), P5 SAC Dashboards (`--teal`).
- **Action**: Export CSS variables in `app/globals.css` and TypeScript tokens in `lib/tokens.ts`. Retain Tailwind v3/v4 integration with CSS variable utility classes.

---

## 3. Data Files Audit

- **Existing Data**: `data/solutions.json` containing 10 rich solution records (PODZO, Invoice Decision Intelligence, RECONLY, Product Cost Simulator, AIS Debug Studio, Joule Copilot, HanaMorph, Manufacturing Yield, Asset Reliability, Sales & Margin).
- **Target Schema & Content System (Section 12)**:
  - Migrate and expand to `/content/site.json`, `/content/pillars.json`, `/content/solutions.json` (all 28 solutions mapped across the 5 pillars).
  - Create `/content/apps/{slug}.json` with strict Zod validation schema (8 cards per app, `botIntro`, `botOutro`, `botChat` lines <= 20 words, callouts, clickPaths).
  - Seed `/content/apps/podzo.json` as the fully-written 8-card flagship sample.
  - Generate valid stub content files for all remaining 27 apps with `hasContent: false`.

---

## 4. What is Reused vs. Replaced

| Area | Current State | Target State (Master Prompt) | Migration Plan |
|---|---|---|---|
| **Layout & Shell** | Static Navbar + DOM main | Persistent single `<Canvas>` root in layout + HUD overlay (`/components/hud/*`, `/components/three/*`) | Replace layout with persistent Canvas + HUD layer. |
| **Landing** | DOM hero + grid | Fullscreen 3D Skydome + Instanced Hex Crystals + Particles + Lenis scrub to Pillars | Replaced with 3D Landing scene (`SceneManager: LANDING`). |
| **Existing Routes** | `/architecture`, `/prerequisites`, `/present` | Kept working and restyled to Section 4 Dark Glass Design Tokens | Reused & Restyled with glass panels, glowing borders, Space Grotesk/Inter fonts. |
| **Solution Routes** | `/solutions/[slug]` | Retained at `/solutions/[slug]` and aliased/structured with `/solution/[slug]` + new `/solution/[slug]/demo` | Keep existing URLs working, add 1-click "▶ Demo" button leading to `/solution/[slug]/demo`. |
| **Mascot Engine** | 2D DOM draggable widget | 3D Bot & Drone R3F component (`/components/three/Bot.tsx`, `Drone.tsx`) with 2D Billboard fallback (`/public/assets/bot/poses/*`) | Reused transparent PNG poses as verified 2D billboard fallback; build procedural R3F bot & drone. |
| **Media Assets** | `/public/media/*`, `/public/mascot/*` | Mapped into `/public/assets/**` per manifest contract (Section 6.2) | Reused real PODZO screens, AIS logo, and mascot stickers; implement procedural placeholder generator for all missing assets. |

---

## 5. Build & Verification Integrity

- `npm run build` must pass with 0 errors after every phase.
- Existing routes (`/architecture`, `/prerequisites`, `/present`, `/solutions/[slug]`) will continue to function throughout the transformation.
