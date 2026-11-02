export const TOKENS = {
  colors: {
    navy950: '#050E22',
    navy900: '#0A1F44',
    navy800: '#102A5C',
    sapBlue: '#0070F2',
    cyan: '#00B8F5',
    gold: '#F0AB00',
    violet: '#8B5CF6',
    teal: '#19C3A6',
    text: '#EAF2FF',
    textDim: '#9FB3D1',
    danger: '#FF5C5C',
    ok: '#3DDC97',
  },
  pillars: {
    p1: '#0070F2', // Foundation
    p2: '#00B8F5', // Custom BTP Apps
    p3: '#8B5CF6', // AI & Joule
    p4: '#F0AB00', // HanaMorph
    p5: '#19C3A6', // SAC Dashboards
  },
  glass: {
    background: 'rgba(16, 42, 92, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.14)',
    backdropFilter: 'blur(18px) saturate(140%)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 112, 242, 0.18)',
  },
  radii: {
    sm: 12,
    md: 20,
    lg: 28,
  },
  zIndex: {
    canvas: 0,
    domStage: 10,
    hud: 20,
    modal: 30,
    toast: 40,
  },
  durations: {
    hover: 180,
    ui: 420,
    scene: 1200,
    cameraFly: 1400,
  },
} as const;

export type PillarId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';
