# CHANGELOG — AIS Experience Centre

All notable changes to the `SAP-experince-centre` platform are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-11-02 — Master Build Prompt v1.0 Release

### Added
- **Phase 0: Audit & Master Architecture**:
  - `docs/REPO_AUDIT.md`: Complete audit of Next.js 15 app router structure, preserved routes, and clean core migration map.
  - `LOG.md`: Master execution ledger recording phases, pinned package versions, and verification runs.
- **Phase 1: Foundation & Toolchain**:
  - Pinned exact dependencies for React 19 (`@react-three/fiber@9.8.2`, `@react-three/drei@10.7.9`, `three@0.171.0`, `gsap@3.12.5`, `zustand@5.0.16`, `zod@4.6.7`, `vite@8.3.5`).
  - Dark-only Design DNA (`--navy-950: #050E22`, `--sap-blue: #0070F2`, `--cyan: #00B8F5`, P1-P5 accents) in `lib/tokens.ts` and `app/globals.css`.
  - Self-hosted typography: Space Grotesk Bold, Inter Regular, JetBrains Mono Regular in `public/fonts/`.
  - Global Zustand state machine (`lib/store.ts`), hardware quality tier monitor (`lib/quality.ts`, `lib/device.ts`), global keyboard/swipe input (`lib/input.ts`), and Web Audio API synthesizer (`lib/audio.ts`).
  - Zero-asset guarantee with SVG/Canvas procedural placeholders (`scripts/make-placeholders.ts`).
  - Content schema validation (`lib/schema.ts`, `scripts/validate-content.ts`).
  - Complete content database: `content/site.json`, `content/pillars.json`, `content/solutions.json` (all 28 enterprise solutions), `content/apps/podzo.json` (flagship 8-card script), and 27 generated app scripts.
  - UI kit in `components/ui/` (`Button`, `Chip`, `GlassPanel`, `Tooltip`, `IconButton`, `Toast`) and HUD controls in `components/hud/` (`TopBar`, `PillarRail`, `BackButton`, `FullscreenButton`, `VRButton`, `CaptionBar`).
- **Phase 2: 3D Stage & Environment**:
  - `components/three/Stage.tsx`: Circular rotating metallic stage, concentric neon energy rings, glass floor plate, center hologram beacon.
  - `components/three/PillarTile.tsx` & `PillarsRing.tsx`: 5 floating 3D octahedron crystal pedestals with active pillar glow and click selection.
  - `components/three/CameraRig.tsx`: State-driven camera positions with mathematical dampening and interactive mouse parallax.
- **Phase 3: Bot & Drone (Mascot Guide & Cinematic Drop-in)**:
  - `components/three/Drone.tsx`: Cartoon quadcopter with spinning rotor blades, cyan sensor underbelly, visor, and 3-stage cinematic drop-in sequence with audio triggers.
  - `components/three/Bot.tsx`: 3D Lead Architect mascot bot on stage with shadow decal, dynamic sprite texture switching across states, and breathing/celebration animations.
  - `components/mascot/Director.tsx`: DOM Director speech bubble with typewriter effect, procedural audio chirps, and guide agency mode switcher (`[ Guide: ON | Tour Only | OFF ]`).
- **Phase 4: Hub & Navigation**:
  - `app/pillars/page.tsx`: 5 Pillar Hub cards with solution counts and clean core badges.
  - `app/pillar/[id]/page.tsx`: Dynamic pillar detail pages (`p1` to `p5`).
  - `app/solution/[slug]/page.tsx`: Solution overview pages with clean core badges and direct walkthrough launch.
  - `app/page.tsx`: Redesigned executive landing page with dynamic pillar filtering across all 28 solutions.
- **Phase 5: Demo Stage & 8-Card System**:
  - `components/demo/CardTypes/*`: `HookCard`, `ChallengeCard`, `SolutionCard` (interactive DAG), `LiveUiCard` (screenshot with interactive coordinate hotspots), `WorkflowCard` (3-step mapped SAP actions), `TechStackCard`, `ImpactCard`, `CtaCard`.
  - `components/demo/ProgressDots.tsx`: 8-step progress indicator with active glow and direct jumping.
  - `components/demo/DemoStage.tsx`: Interactive card shell with responsive navigation.
  - `app/solution/[slug]/demo/page.tsx`: Static route generating interactive walkthroughs for all 28 enterprise solutions.
- **Phase 6: WebXR, Big-Screen & Testing**:
  - Vitest test suite (`tests/content.test.ts`) validating 100% of content schemas, 5 pillars, 28 solutions, and 28 8-card scripts.
  - Big-screen & kiosk mode with 3s idle cursor auto-hide and automatic autoplay.
  - WebXR VR headset session integration via `@react-three/xr`.
