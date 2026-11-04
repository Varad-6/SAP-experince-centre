export type PoseName =
  | 'idle'
  | 'wave'
  | 'present'
  | 'explain'
  | 'think'
  | 'point'
  | 'alert'
  | 'celebrate'
  | 'thanks'
  | 'laptop'
  | 'fly'
  | 'fall';

export const BOT_POSES: Record<PoseName, string> = {
  idle: '/assets/bot/idle.webp',
  wave: '/assets/bot/wave.webp',
  present: '/assets/bot/present.webp',
  explain: '/assets/bot/explain.webp',
  think: '/assets/bot/think.webp',
  point: '/assets/bot/point.webp',
  alert: '/assets/bot/alert.webp',
  celebrate: '/assets/bot/celebrate.webp',
  thanks: '/assets/bot/thanks.webp',
  laptop: '/assets/bot/laptop.webp',
  fly: '/assets/bot/fly.webp',
  fall: '/assets/bot/fall.webp',
};

export const POSE_FIT: Record<PoseName, { scale: number; offsetY: number }> = {
  idle: { scale: 1, offsetY: 0 },
  wave: { scale: 1, offsetY: 0 },
  present: { scale: 1, offsetY: 0 },
  explain: { scale: 1, offsetY: 0 },
  think: { scale: 1, offsetY: 0 },
  point: { scale: 1, offsetY: 0 },
  alert: { scale: 1, offsetY: 0 },
  celebrate: { scale: 1.05, offsetY: -4 },
  thanks: { scale: 1, offsetY: 0 },
  laptop: { scale: 0.95, offsetY: 2 },
  fly: { scale: 1, offsetY: -10 },
  fall: { scale: 1, offsetY: 0 },
};
