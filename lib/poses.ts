import metaJson from '@/public/assets/bot/_meta.json';

export type ActivePoseName =
  | 'idle'
  | 'wave'
  | 'point'
  | 'tablet'
  | 'laptop'
  | 'present'
  | 'beckon'
  | 'thanks';

export type PoseName =
  | ActivePoseName
  | 'explain'
  | 'think'
  | 'alert'
  | 'celebrate'
  | 'fly'
  | 'fall';

export interface PoseHeadMeta {
  hairTop: number;
  hairLeft: number;
  hairRight: number;
  headCx: number;
  headCy: number;
}

export interface PoseMeta {
  w: number;
  h: number;
  anchorX: number;
  anchorY: number;
  head: PoseHeadMeta;
}

export const POSE_META: Record<string, PoseMeta> = metaJson as unknown as Record<string, PoseMeta>;

/**
 * Standard standing reference height in pixels.
 * All bot sprites are authored to this baseline.
 */
export const STANDING_HEIGHT_PX = 620;

/**
 * Legacy/Semantic alias mappings ensuring backwards compatibility
 */
const POSE_ALIASES: Record<string, ActivePoseName> = {
  explain: 'tablet',
  think: 'point',
  alert: 'point',
  celebrate: 'wave',
  fly: 'wave',
  fall: 'idle',
};

export function resolvePose(pose?: string): ActivePoseName {
  if (!pose) return 'idle';
  const clean = pose.toLowerCase();
  if (clean in POSE_META) return clean as ActivePoseName;
  if (clean in POSE_ALIASES) return POSE_ALIASES[clean];
  return 'idle';
}

export function getPoseMeta(pose: string): PoseMeta {
  const resolved = resolvePose(pose);
  return POSE_META[resolved] || POSE_META['idle'];
}

export const BOT_POSES: Record<ActivePoseName, string> = {
  idle: '/assets/bot/idle.webp',
  wave: '/assets/bot/wave.webp',
  point: '/assets/bot/point.webp',
  tablet: '/assets/bot/tablet.webp',
  laptop: '/assets/bot/laptop.webp',
  present: '/assets/bot/present.webp',
  beckon: '/assets/bot/beckon.webp',
  thanks: '/assets/bot/thanks.webp',
};

export const BOT_POSES_PNG: Record<ActivePoseName, string> = {
  idle: '/assets/bot/idle.png',
  wave: '/assets/bot/wave.png',
  point: '/assets/bot/point.png',
  tablet: '/assets/bot/tablet.png',
  laptop: '/assets/bot/laptop.png',
  present: '/assets/bot/present.png',
  beckon: '/assets/bot/beckon.png',
  thanks: '/assets/bot/thanks.png',
};
