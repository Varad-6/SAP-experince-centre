export const TOKENS = {
  colors: {
    bg: '#F5F7FA',
    surface: '#FFFFFF',
    surface2: '#EEF2F7',
    border: '#D9E0EA',
    text: '#0A1F44',
    textDim: '#5B6B85',
    brand: '#0070F2',
    brand600: '#0058C2',
    brand50: '#E8F1FE',
    navy: '#0A1F44',
    gold: '#F0AB00',
    ok: '#188918',
    warn: '#E9730C',
    danger: '#D20A0A',
    skyTop: '#CFE3FF',
    skyBottom: '#F5F7FA',
  },
  pillars: {
    p1: '#0070F2', // Foundation
    p2: '#0058C2', // Custom BTP Apps
    p3: '#0A1F44', // Enterprise AI & Joule
    p4: '#F0AB00', // HanaMorph
    p5: '#188918', // SAC Dashboards
  },
  radii: {
    base: 12,
    lg: 16,
  },
  durations: {
    hover: 180,
    slide: 250,
  },
} as const;

export type PillarId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';
