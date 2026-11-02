export interface AssetRecord {
  id: string;
  url: string;
  type: 'glb' | 'texture' | 'image' | 'audio';
  fallbackColor?: string;
}

export const ASSET_MANIFEST: Record<string, AssetRecord> = {
  // Mascot & Drone
  'mascot-standing': {
    id: 'mascot-standing',
    url: '/mascot/mascot_standing.png',
    type: 'image',
    fallbackColor: '#0070F2',
  },
  'mascot-pointing': {
    id: 'mascot-pointing',
    url: '/mascot/mascot_pointing.png',
    type: 'image',
    fallbackColor: '#00B8F5',
  },
  'mascot-explaining': {
    id: 'mascot-explaining',
    url: '/mascot/mascot_explaining.png',
    type: 'image',
    fallbackColor: '#8B5CF6',
  },
  // Flagship Podzo screenshot
  'podzo-screenshot': {
    id: 'podzo-screenshot',
    url: '/assets/apps/podzo/screen-1.png',
    type: 'image',
    fallbackColor: '#0070F2',
  },
};

/**
 * Returns the URL for an asset, or generates a procedural data URL if missing or invalid.
 */
export function getAssetUrl(id: string): string {
  const asset = ASSET_MANIFEST[id];
  if (asset && asset.url) {
    return asset.url;
  }
  return createProceduralPlaceholder(id);
}

/**
 * Creates an inline SVG data URL for missing images/screenshots.
 */
export function createProceduralPlaceholder(label: string, color = '#0070F2'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#050E22"/>
        <stop offset="100%" stop-color="#0A1F44"/>
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="800" height="450" rx="16" fill="url(#bg)"/>
    <rect width="800" height="450" fill="url(#grid)"/>
    <rect x="40" y="40" width="720" height="40" rx="8" fill="rgba(16,42,92,0.6)" stroke="rgba(255,255,255,0.1)"/>
    <circle cx="65" cy="60" r="5" fill="#FF5C5C"/>
    <circle cx="85" cy="60" r="5" fill="#F0AB00"/>
    <circle cx="105" cy="60" r="5" fill="#3DDC97"/>
    <rect x="40" y="100" width="720" height="300" rx="12" fill="rgba(16,42,92,0.35)" stroke="${color}" stroke-opacity="0.4"/>
    <text x="400" y="240" font-family="sans-serif" font-size="20" font-weight="bold" fill="#EAF2FF" text-anchor="middle">${label.toUpperCase()}</text>
    <text x="400" y="270" font-family="sans-serif" font-size="14" fill="#9FB3D1" text-anchor="middle">AIS SAP Experience Centre — Clean Core Simulation</text>
  </svg>`;

  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
