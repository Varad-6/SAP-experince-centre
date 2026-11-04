# AIS EXPERIENCE CENTRE — CHANGE AUDIT v2
Standard: Change Request v2 (Antigravity Working Protocol)

---

## 1. Overview & Objective
This audit defines the complete scope of deletions, additions, and rewrites required to transition the AIS Experience Centre from a heavy 3D/audio experimental stack to an **immaculate, enterprise-grade, lightweight, SAP Fiori Horizon-inspired platform**.

---

## 2. Dependencies to Delete from `package.json`

| Dependency | Category | Reason for Deletion |
| :--- | :--- | :--- |
| `three` | 3D Engine | Removal of 3D WebGL scenes |
| `@react-three/fiber` | 3D Renderer | Removal of R3F canvas root |
| `@react-three/drei` | 3D Helpers | Removal of 3D helpers/loaders |
| `@react-three/postprocessing` | Visual Effects | Removal of bloom/vignette/chromatic aberration |
| `@react-three/xr` | WebXR / VR | Removal of WebXR store and VR button |
| `three-stdlib` | 3D Utilities | No longer required |
| `@types/three` | TypeScript types | No longer required |
| `howler` | Audio Engine | Removal of all sound/audio systems |
| `@types/howler` | Audio types | No longer required |
| `lenis` | Smooth Scroll | Removal of heavy scroll interventions |

*Retained Core Dependencies*: `next@15.1.0`, `react@19.0.0`, `react-dom@19.0.0`, `gsap@3.12.5`, `@gsap/react@2.1.1`, `zustand@5.0.16`, `zod@4.6.7`, `lucide-react@0.468.0`, `clsx`, `tailwind-merge`, `vite@8.3.5`, `vitest@5.1.0`, `@xyflow/react@12.3.6`.
*Added Dev Dependency*: `sharp` (for `assets:optimize` script converting PNG sprites to WebP).

---

## 3. Files to Delete

### 3.1 Audio Subsystem
- `lib/audio.ts`: Howler manager and Web Audio API synthesizer.
- `components/hud/CaptionBar.tsx`: Redundant bottom caption bar (replaced by SlideDeck and IntroDrop speech bubbles).
- Audio manifest entries in `public/assets/manifest.json`.

### 3.2 3D / WebGL / WebXR Subsystem
- `components/three/CanvasRoot.tsx`: Root R3F WebGL Canvas.
- `components/three/SceneManager.tsx`: 3D composite scene.
- `components/three/Backdrop.tsx`: 3D lighting and environment.
- `components/three/Stage.tsx`: Rotating cylinder platform and rings.
- `components/three/Particles.tsx`: Ambient 3D motes.
- `components/three/PillarTile.tsx`: Floating 3D crystal pedestals.
- `components/three/PillarsRing.tsx`: 3D pedestal circular arc.
- `components/three/CameraRig.tsx`: 3D camera controller and parallax.
- `components/three/Bot.tsx`: 3D billboard mesh.
- `components/three/Drone.tsx`: 3D quadcopter mesh.
- `components/three/QualityProvider.tsx`: 3D quality tier provider.
- `lib/quality.ts`: FPS probe and 3D tier definitions (`HIGH`, `MED`, `LOW`).
- `lib/device.ts`: WebGL GPU renderer sniffing.
- `lib/xr.ts`: WebXR session store.
- `components/hud/VRButton.tsx`: WebXR launcher button.
- `types/three-jsx.d.ts`: R3F JSX element declarations.

### 3.3 Obsolete Mascot / Floating Overlays
- `components/mascot/ChibiMascot.tsx`: Deprecated floating mascot.
- `components/mascot/Director.tsx`: Deprecated floating overlay director.
- `components/demo/HoveringBotGuide.tsx`: Deprecated floating guide (replaced by inline `BotSprite` + `useTypewriter` inside `SlideDeck`).
- `components/hud/PillarRail.tsx`: Floating side rail (navigation now flows cleanly via pages).

### 3.4 Fonts to Remove
- `public/fonts/SpaceGrotesk-Bold.ttf`: Removed (Single font standard: Inter).
- `public/fonts/JetBrainsMono-Regular.ttf`: Removed.

---

## 4. Store Fields & Input Shortcuts to Delete

### In `lib/store.ts`:
- **Deleted Fields**: `muted`, `volume`, `isXR`, `quality`, `droneState`, `captions`.
- **Deleted Actions**: `setMuted`, `setVolume`, `setXR`, `setQuality`, `setDroneState`, `setCaptions`.

### In `lib/input.ts`:
- **Deleted Key Handlers**: `M` / `m` (toggle audio), `C` / `c` (toggle captions).

### In `docs/LICENSES.md`:
- Removed lines referencing Three.js, Howler, and removed fonts.

---

## 5. Files to Add (New Modules)

| File | Purpose |
| :--- | :--- |
| `lib/poses.ts` | 12 pose definitions (`idle`, `wave`, `point`, `tablet`, `laptop`, `present`, `beckon`, `thanks`, `hang`, `jump`, `chute`, `land`) and `POSE_FIT` scale/offset registry. |
| `lib/useTypewriter.ts` | Reusable typewriter animation hook with character pacing and immediate `finish()` capability. |
| `components/BotSprite.tsx` | Universal 2D sprite container swapping transparent WebP poses with automatic fallback to `/assets/bot/_placeholder.svg`. |
| `components/IntroDrop.tsx` | Landing page cinematic GSAP sequence: drone carries bot, release, parachute deploy, sway descent, land settle, and speech bubble introduction with skip button. |
| `components/ContactDialog.tsx` | Enterprise modal dialog displaying contact name, email, phone, and Microsoft Teams link. |
| `components/demo/SlideDeck.tsx` | Clean 8-slide presentation deck + slide 9 closing screen with bottom docked `BotSprite`, typewriter chat, and slide progress bar. |
| `public/assets/bot/_placeholder.svg` | Neutral vector figure SVG ensuring zero missing asset rendering errors. |
| `scripts/optimize-assets.ts` | Asset conversion utility using `sharp` to trim transparent padding, resize, and output optimized `.webp` sprites. |

---

## 6. Files to Rewrite / Restyle

| File | Changes Required |
| :--- | :--- |
| `styles/tokens.css` / `app/globals.css` | Complete reset to clean SAP-Fiori tokens (`--bg: #F5F7FA`, `--surface: #FFFFFF`, `--border: #D9E0EA`, `--brand: #0070F2`). Single font: Inter. Zero blur, zero glow, zero gradient text. |
| `app/layout.tsx` | Remove `AppProvider` and 3D canvas wrappers; configure single `next/font/google` Inter font. |
| `app/page.tsx` | Full-height sky stage (`linear-gradient(var(--sky-top), var(--sky-bottom))`), ground strip, drifting clouds, `IntroDrop` component with `sessionStorage` guard, static bot + "Explore solutions" CTA. |
| `app/pillars/page.tsx` | 5 clean cards in a 6-column grid (cards 1–2 span 3 columns, cards 3–5 span 2 columns; 2 on tablet, 1 on phone); docked idle bot with 5s auto-hide bubble. |
| `app/pillar/[id]/page.tsx` | Title, description, back link, responsive auto-fill grid of project cards with 16:9 thumbnail, 2-line tagline, status chip, ROI chip. |
| `app/solution/[slug]/page.tsx` | Project briefing page: breadcrumb, H1, intro line, center thumbnail card, bottom row with "Contact for details" (opens `ContactDialog`) and "Demo" button, bot in `present` pose with `basicIntro` bubble. |
| `app/solution/[slug]/demo/page.tsx` | Mounts the clean `SlideDeck` component with 8 slides and slide 9 closing screen. |
| `components/demo/CardTypes/*` | Restyle `HookCard`, `ChallengeCard`, `SolutionCard`, `LiveUiCard`, `WorkflowCard`, `TechStackCard`, `ImpactCard`, `CtaCard` to clean white surface with 1px border. Replace cursor glow with clean 20px arrow. |
| `lib/schema.ts` | Add Zod schemas for `Contact`, `Closing`, `intro`, `basicIntro`, `contact`, `closing`, and `introLines`. |
| `content/site.json` | Update with `botName`, `tagline`, `sub`, and `introLines` array (`text` + `pose`). |
| `content/apps/podzo.json` | Populate realistic production fields (`intro`, `basicIntro`, `contact`, `closing`, and callouts for KPI strip, live table, S/4 adapter). |
| `scripts/validate-content.ts` | Update validation runner to verify `intro`, `basicIntro`, `contact`, and `closing` across all apps. |

---

## 7. Files Kept (Preserved Architecture)
- All 28 solution app records in `content/apps/*.json`
- `content/pillars.json` and `content/solutions.json`
- Static route layout: `/`, `/pillars`, `/pillar/[id]`, `/solution/[slug]`, `/solution/[slug]/demo`, `/architecture`, `/prerequisites`, `/present`
- Next.js 15 App Router configuration and Tailwind utilities

---

## 8. Definition of Done for Phase 0
- [x] Complete audit recorded in `docs/CHANGE_AUDIT.md`.
- [x] Clear inventory of deleted dependencies, files, store fields, and new modules established.
- [ ] Awaiting user written **"APPROVED"** before executing Phase 1 cleanup.
