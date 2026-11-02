# AGENTS.md — AIS Experience Centre Engineering Guidelines
**Repository**: `SAP-experince-centre`  
**Organization**: Abhiyanta India Solutions (AIS)  
**Standard**: Antigravity Working Protocol v1.0 (Nov 2026)

---

## 1. Stack & Architecture

- **Framework**: Next.js 15 (App Router, React 19, Server & Client Components)
- **Styling**: Tailwind CSS v3/v4 with custom Design DNA tokens (Enterprise Horizon + Editorial Quartz)
- **Motion & 3D Layer**:
  - `three` & `@react-three/fiber` / `@react-three/drei` (Interactive 3-Tier Topology Canvas)
  - `gsap` & `@gsap/react` + `ScrollTrigger` + `MotionPath` (Mascot walking director & card reveals)
  - `framer-motion` (Micro-interactions, smooth page transitions, modal overlays)
  - `lucide-react` (Crisp enterprise iconography)
- **Diagrams**: `@xyflow/react` (React Flow) for interactive solution architectures
- **TypeScript**: Strict mode enabled (`noImplicitAny: true`, strict null checks)

---

## 2. Directory Layout & Conventions

```
SAP-experince-centre/
├── apps/
│   └── web/                        # Next.js Application
│       ├── app/                    # App Router routes (/, /solutions, /architecture, etc.)
│       ├── components/             # Reusable UI, Mascot, 3D Canvas, Flow diagrams
│       │   ├── mascot/             # Director engine, chibi character state machine, speech bubbles
│       │   ├── canvas/             # Three.js 3D topology & particle scenes
│       │   ├── ui/                 # Design DNA buttons, pills, cards, metric tiles
│       │   └── solutions/          # Solution template, 3-step flows, interactive demos
│       ├── data/                   # Structured JSON records for all 28 solutions & 5 pillars
│       ├── public/                 # Static assets, character sprites, diagrams, screenshots
│       └── styles/                 # Tailwind config & Design DNA CSS variables
├── AGENTS.md                       # Stack rules & definition of done
├── CHANGELOG.md                    # Release & package changelog
└── TEMP_FILES.md                   # Ledger of scratch / transient files
```

---

## 3. Design DNA Tokens (Enterprise Horizon)

- **Canvas Background**:
  - Light Mode: `#F8FAFC` (Slate-50 Quartz)
  - Dark Mode: `#0A111E` (Executive Deep Navy)
- **Primary Brand**:
  - SAP Azure: `#0070F2` (Fiori Horizon Core)
  - Electric Cyan: `#00C8F8` (AI Core & Joule Glow)
- **Surface Cards**: `#FFFFFF` with `1px` border `#E2E8F0` and `12px` rounded radius
- **Status Accents**:
  - Success Green: `#107E3E` (Surface: `#E6F7ED`, Border: `#A6E9BD`)
  - Warning Amber: `#B25900` (Surface: `#FFF1D6`, Border: `#FFD599`)
  - Active Blue: `#0064D9` (Surface: `#E8F2FF`, Border: `#B8D7FF`)

---

## 4. Chibi Mascot Director Rules

1. **Character Identity**: "The Lead Architect" chibi avatar (swept hair, tinted spectacles, tailored black blazer, white shirt, SAP conference lanyard, smart watch).
2. **Behavioral States**:
   - `idle`: Gentle breathing, blinking, hovering in bottom right.
   - `walk`: Moves smoothly across the screen synchronized with scroll progress via GSAP.
   - `point`: Directs attention to active solution cards and key ROI metrics.
   - `explain`: Opens interactive speech bubble on click or when user triggers a glossary term.
   - `celebrate`: Thumbs-up pose when completing tours or viewing milestone results.
3. **User Agency**:
   - Mascot toggle permanently visible: `[ Guide: ON | Tour Only | OFF ]`.
   - Never blocks critical CTAs, forms, or reading flow.

---

## 5. Performance & Quality Budgets

- **Lighthouse Scores**: $\ge 95$ across Performance, Accessibility, Best Practices, and SEO.
- **Zero Dead Code**: No unused dependencies, orphaned components, or dummy imports.
- **Clean Core Compliance**: No client data hardcoded; seeded mock data reflects production SAP structures (e.g. Sales Orders `#2318`, `#2322`, MIRO settlement).

---

## 6. Definition of Done (DoD)

For every work package:
1. Approved plan before execution.
2. Verified TypeScript build (`npm run build` succeeds with zero errors).
3. Documented in `CHANGELOG.md`.
4. Transient files cleaned or logged in `TEMP_FILES.md`.
