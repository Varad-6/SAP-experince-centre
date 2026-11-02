// GSAP easing strings and cubic-bezier equivalents
export const EASING = {
  gsap: {
    snap: 'power4.out',
    glide: 'power3.inOut',
    bounce: 'back.out(1.6)',
    soft: 'sine.inOut',
  },
  css: {
    snap: 'cubic-bezier(0.25, 1, 0.5, 1)',
    glide: 'cubic-bezier(0.65, 0, 0.35, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    soft: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  durations: {
    hover: 0.18,
    ui: 0.42,
    scene: 1.2,
    cameraFly: 1.4,
  },
} as const;
