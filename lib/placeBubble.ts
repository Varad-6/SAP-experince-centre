const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export interface Head {
  cx: number;
  hairTop: number;
}

export interface PlaceBubbleOptions {
  headX: number;
  hairTopY: number;
  headW: number;
  bw: number;
  bh: number;
  vw: number;
  vh: number;
  topSafe: number;
  forceAbove?: boolean;
}

export interface BubblePlacement {
  mode: 'above' | 'right' | 'left';
  left: number;
  top: number;
  tailX?: number;
  dotsX?: number;
  dotsFromY?: number;
  dotsY?: number;
  maxH?: number;
}

export function placeBubble(o: PlaceBubbleOptions): BubblePlacement {
  const M = 16;
  const DOTS = o.vw < 640 ? 40 : 52;
  const bottom = o.hairTopY - DOTS;
  const top = bottom - o.bh;

  // Mode 1: Above head with standard clearance
  if (top >= o.topSafe + 8 || o.forceAbove) {
    const left = clamp(o.headX - o.bw / 2, M, o.vw - o.bw - M);
    return {
      mode: 'above' as const,
      left,
      top: Math.max(o.topSafe + 4, top),
      tailX: clamp(o.headX - left, 20, o.bw - 20),
      dotsX: o.headX,
      dotsFromY: o.hairTopY - 8,
    };
  }

  // Fallback Mode 2: Beside head (right first, then left)
  const gap = 28;
  const half = o.headW / 2;
  const y = clamp(o.hairTopY - o.bh * 0.5, o.topSafe + 8, o.vh - o.bh - M);

  if (o.headX + half + gap + o.bw <= o.vw - M) {
    return {
      mode: 'right' as const,
      left: o.headX + half + gap,
      top: y,
      dotsY: o.hairTopY + 12,
    };
  }

  if (o.headX - half - gap - o.bw >= M) {
    return {
      mode: 'left' as const,
      left: o.headX - half - gap - o.bw,
      top: y,
      dotsY: o.hairTopY + 12,
    };
  }

  // Fallback Mode 3: Capped height scrollable above head (never over face)
  const maxH = Math.max(80, bottom - o.topSafe - 8);
  return {
    mode: 'above' as const,
    left: clamp(o.headX - o.bw / 2, M, o.vw - o.bw - M),
    top: bottom - maxH,
    maxH,
    tailX: 20,
    dotsX: o.headX,
    dotsFromY: o.hairTopY - 8,
  };
}
