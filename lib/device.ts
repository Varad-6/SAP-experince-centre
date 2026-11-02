export interface DeviceCapabilities {
  isTouch: boolean;
  isKiosk: boolean;
  isBigScreen: boolean;
  cores: number;
  memoryGb: number;
  gpuRenderer: string;
  dpr: number;
}

export function detectDevice(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      isTouch: false,
      isKiosk: false,
      isBigScreen: false,
      cores: 4,
      memoryGb: 8,
      gpuRenderer: 'unknown',
      dpr: 1,
    };
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 4;
  const memoryGb = nav.deviceMemory || 8;
  const isTouch = 'ontouchstart' in window || nav.maxTouchPoints > 0;
  const searchParams = new URLSearchParams(window.location.search);
  const isKiosk = searchParams.get('kiosk') === '1';
  const isBigScreen = window.innerWidth >= 2560 || isKiosk;

  let gpuRenderer = 'unknown';
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'generic';
      }
    }
  } catch {
    gpuRenderer = 'fallback';
  }

  return {
    isTouch,
    isKiosk,
    isBigScreen,
    cores,
    memoryGb,
    gpuRenderer,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
  };
}
