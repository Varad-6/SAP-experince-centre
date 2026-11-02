# ASSET SPECIFICATION & PIPELINE — AIS Experience Centre

## 1. Asset Philosophy
The AIS Experience Centre operates on a **zero-asset-blocking guarantee**: every 3D model, UI screenshot, character sprite, and audio cue can be resolved through either a bundled production asset, an SVG/procedural Canvas fallback, or a Web Audio API synth. The site runs end-to-end with 0 network asset dependencies.

## 2. Manifest Inventory (`/public/assets/manifest.json`)
All assets are catalogued with exact IDs, URLs, and fallback types:
- `mascot-standing` (`/mascot/mascot_standing.png`): Chibi Lead Architect avatar in standing idle pose.
- `mascot-pointing` (`/mascot/mascot_pointing.png`): Chibi avatar pointing gesture for card step transitions.
- `mascot-explaining` (`/mascot/mascot_explaining.png`): Chibi avatar presenting tablet / architecture.
- `podzo-screenshot` (`/assets/apps/podzo/screen-1.png`): High-resolution Fiori horizon dispatch UI.

## 3. Procedural Fallbacks
When a model or image asset is missing:
- **GLB Models**: Procedural metallic beveled rounded cube with pillar accent edge glow and floating label.
- **Screenshots**: High-contrast dark SVG canvas with window chrome, status pills, and data rows.
- **Mascot**: 2D billboard sprite with responsive hover and breathing animation.
- **Audio**: Web Audio API oscillator synthesis generating clicks, chimes, and sweeps without audio file latency.
