import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const BOT_DIR = path.join(process.cwd(), 'public', 'assets', 'bot');
const MASCOT_DIR = path.join(process.cwd(), 'public', 'mascot');

const POSE_MAPPING: Record<string, string> = {
  idle: 'mascot_standing.png',
  wave: 'mascot_standing.png',
  present: 'mascot_explaining.png',
  explain: 'mascot_explaining.png',
  think: 'mascot_explaining.png',
  point: 'mascot_pointing.png',
  alert: 'mascot_pointing.png',
  celebrate: 'mascot_standing.png',
  thanks: 'mascot_standing.png',
  laptop: 'mascot_explaining.png',
  fly: 'mascot_standing.png',
  fall: 'mascot_standing.png',
};

async function optimizeAssets() {
  console.log('Optimizing bot sprite assets with Sharp...');

  if (!fs.existsSync(BOT_DIR)) {
    fs.mkdirSync(BOT_DIR, { recursive: true });
  }

  // 1. Process existing PNGs in public/assets/bot
  const botFiles = fs.readdirSync(BOT_DIR);
  for (const file of botFiles) {
    if (file.endsWith('.png')) {
      const inputPath = path.join(BOT_DIR, file);
      const outputName = file.replace(/\.png$/, '.webp');
      const outputPath = path.join(BOT_DIR, outputName);

      try {
        await sharp(inputPath)
          .trim()
          .resize({ height: 1200, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(outputPath);
        console.log(`✓ Processed ${file} -> ${outputName}`);
      } catch (err) {
        console.warn(`Could not process ${file}:`, err);
      }
    }
  }

  // 2. Map mascot source images to initial webp poses if not already present
  if (fs.existsSync(MASCOT_DIR)) {
    for (const [pose, sourceFileName] of Object.entries(POSE_MAPPING)) {
      const targetWebp = path.join(BOT_DIR, `${pose}.webp`);
      const sourcePath = path.join(MASCOT_DIR, sourceFileName);

      if (!fs.existsSync(targetWebp) && fs.existsSync(sourcePath)) {
        try {
          await sharp(sourcePath)
            .trim()
            .resize({ height: 1200, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(targetWebp);
          console.log(`✓ Generated ${pose}.webp from ${sourceFileName}`);
        } catch (err) {
          console.warn(`Could not generate ${pose}.webp:`, err);
        }
      }
    }
  }

  console.log('Asset optimization complete!');
}

optimizeAssets().catch((err) => {
  console.error('Asset optimization error:', err);
  process.exit(1);
});
