# AIS Experience Centre — Asset Specification & Anchors
**Source**: `AIS_Assets_Pack.zip`  
**Location**: `/public/assets/`  
**Standard**: Master Prompt v3 Single Source of Truth

---

## 1. Mascot 2D Sprites

All active sprites are located in `/public/assets/bot/` in both modern `.webp` and lossless `.png` formats.

### Scaling & Positioning Rule (Feet Anchor)
- Shared standing height constant: `standingHeightPx = 620`.
- Display target height:
  - Desktop / Landscape ($\ge 1024\text{px}$): $H = \text{clamp}(220\text{px}, 46\text{dvh}, 480\text{px})$
  - Mobile / Portrait ($< 1024\text{px}$): $H = \text{clamp}(150\text{px}, 24\text{dvh}, 240\text{px})$
- Scale factor: $k = \frac{H}{620}$
- Screen positioning given target feet anchor coordinate $(dockX, dockY)$:
  $$\text{left} = dockX - anchorX \times k$$
  $$\text{bottom} = -(h - anchorY) \times k$$
  *(or top offset $\text{top} = dockY - anchorY \times k$)*

### Active Poses Table
| Pose | Width × Height | Feet Anchor (`anchorX`, `anchorY`) | Head Center (`headCx`, `hairTop`) | Primary Screen / Flow Placement |
| :--- | :--- | :--- | :--- | :--- |
| `idle` | 333 × 660 px | (160, 648) | (0.509, 0.018) | Docked idle on `/pillars`, rest state |
| `wave` | 342 × 636 px | (174, 621) | (0.530, 0.027) | Landing final frame greeting & Welcome |
| `point` | 384 × 641 px | (164, 626) | (0.423, 0.023) | `/pillar/[id]`, Slide 2 (Challenge), Slide 4 (Live UI) |
| `tablet` | 378 × 640 px | (205, 626) | (0.565, 0.022) | Slide 3 (Solution DAG), Slide 5 (Workflow) |
| `laptop` | 362 × 643 px | (202, 628) | (0.578, 0.026) | Slide 6 (Tech Stack Architecture) |
| `present` | 381 × 655 px | (161, 640) | (0.428, 0.024) | `/solution/[slug]`, Slide 1 (Hook), Slide 7 (Impact) |
| `beckon` | 361 × 657 px | (198, 643) | (0.552, 0.023) | `/solution/[slug]` hover on Demo CTA, Slide 8 |
| `thanks` | 326 × 660 px | (170, 645) | (0.504, 0.027) | Slide 9 (Closing Slide) |

### Unused Poses
Moved to `/public/assets/bot/unused/` and never referenced in code:
- `hang.png`, `hang.webp` (368 × 766)
- `jump.png`, `jump.webp` (377 × 620)
- `chute.png`, `chute.webp` (388 × 671)
- `land.png`, `land.webp` (410 × 548)

---

## 2. Transparent & Keyed Video Acts

All videos are located in `/public/assets/video/`.

| Act | Video Name | Format | Resolution | Duration | Key Color | Bubble Start | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Act 1** | `intro_drop` | `.webm` / `_nokey.mp4` / `_last.png` | 1280 × 720 | 10.0 s | `#E95DCF` | **8.6 s** | Bot lands on mound. Bottom-anchor so mound meets screen edge. |
| **Act 2** | `analytics_laptop` | `.webm` / `_nokey.mp4` / `_last.png` | 1920 × 1080 | 10.0 s | `#F445AE` | **4.5 s** | Bot types on laptop, reveals hologram. Bottom-anchor bust shot. |
| **Act 3** | `explain_close` | `.webm` / `_nokey.mp4` / `_last.png` | 1920 × 1080 | 10.0 s | `#F647BC` | **1.0 s** | Zoom to close-up, ends with open-palm gesture aligning with "Explore solutions". |

- All `<video>` elements are strictly `muted playsInline`.
- Audio track is stripped in media container.
- For WebKit/Safari where VP9 alpha is unsupported, WebGL chroma-key shader (`components/ChromaKeyCanvas.tsx`) renders `_nokey.mp4` stripping the exact `keyColor` in CbCr color space.
