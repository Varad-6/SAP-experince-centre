import * as fs from 'fs';
import * as path from 'path';

const PUBLIC_ASSETS = path.join(process.cwd(), 'public', 'assets');

const DIRS = [
  path.join(PUBLIC_ASSETS, 'hero'),
  path.join(PUBLIC_ASSETS, 'pillars'),
  path.join(PUBLIC_ASSETS, 'bot'),
  path.join(PUBLIC_ASSETS, 'drone'),
  path.join(PUBLIC_ASSETS, 'stage'),
  path.join(PUBLIC_ASSETS, 'apps', 'podzo'),
  path.join(PUBLIC_ASSETS, 'audio'),
];

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Generate an SVG placeholder helper
function generateMockSvg(title: string, color = '#0070F2'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050E22"/>
      <stop offset="100%" stop-color="#0A1F44"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#g)"/>
  <rect x="40" y="40" width="1200" height="60" rx="12" fill="rgba(16,42,92,0.6)" stroke="rgba(255,255,255,0.1)"/>
  <circle cx="80" cy="70" r="8" fill="#FF5C5C"/>
  <circle cx="110" cy="70" r="8" fill="#F0AB00"/>
  <circle cx="140" cy="70" r="8" fill="#3DDC97"/>
  <rect x="40" y="120" width="1200" height="560" rx="16" fill="rgba(16,42,92,0.3)" stroke="${color}" stroke-width="2"/>
  <text x="640" y="380" font-family="system-ui, sans-serif" font-size="32" font-weight="700" fill="#EAF2FF" text-anchor="middle">${title}</text>
  <text x="640" y="420" font-family="system-ui, sans-serif" font-size="18" fill="#9FB3D1" text-anchor="middle">SAP Fiori Horizon UI Mockup (AIS Experience Centre)</text>
</svg>`;
}

// Generate screen-1.png (SVG formatted as image fallback) for podzo
const podzoScreen = path.join(PUBLIC_ASSETS, 'apps', 'podzo', 'screen-1.png');
if (!fs.existsSync(podzoScreen)) {
  fs.writeFileSync(podzoScreen, generateMockSvg('PODZO — Open Sales Orders & Dispatch Control Tower', '#0070F2'));
}

// Write manifest.json
const manifestPath = path.join(PUBLIC_ASSETS, 'manifest.json');
const manifest = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  assets: [
    {
      id: 'mascot-standing',
      url: '/mascot/mascot_standing.png',
      type: 'image',
      placeholder: 'procedural',
      fallbackColor: '#0070F2',
    },
    {
      id: 'mascot-pointing',
      url: '/mascot/mascot_pointing.png',
      type: 'image',
      placeholder: 'procedural',
      fallbackColor: '#00B8F5',
    },
    {
      id: 'mascot-explaining',
      url: '/mascot/mascot_explaining.png',
      type: 'image',
      placeholder: 'procedural',
      fallbackColor: '#8B5CF6',
    },
    {
      id: 'podzo-screenshot',
      url: '/assets/apps/podzo/screen-1.png',
      type: 'image',
      placeholder: 'svg',
      fallbackColor: '#0070F2',
    },
  ],
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Successfully generated asset manifest and placeholders.');
