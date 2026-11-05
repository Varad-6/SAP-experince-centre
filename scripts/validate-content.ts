import * as fs from 'fs';
import * as path from 'path';
import {
  SiteSchema,
  PillarSchema,
  SolutionSummarySchema,
  AppContentSchema,
} from '../lib/schema';

function validate() {
  console.log('Validating content integrity against Zod schemas...');
  const contentDir = path.join(process.cwd(), 'content');

  // 1. Site schema
  const siteData = JSON.parse(fs.readFileSync(path.join(contentDir, 'site.json'), 'utf8'));
  const parsedSite = SiteSchema.parse(siteData);

  if (!parsedSite.introLines || parsedSite.introLines.length !== 3) {
    throw new Error(`site.json introLines must have exactly 3 strings, got ${parsedSite.introLines?.length}`);
  }
  if (!parsedSite.defaultContact || !parsedSite.defaultContact.email) {
    throw new Error('site.json must define defaultContact with valid email');
  }
  if (!parsedSite.botName || !parsedSite.tagline || !parsedSite.sub) {
    throw new Error('site.json missing required botName, tagline, or sub');
  }
  console.log('✓ site.json valid (brand, botName, 3 introLines, defaultContact)');

  // 2. Pillars schema
  const pillarsData = JSON.parse(fs.readFileSync(path.join(contentDir, 'pillars.json'), 'utf8'));
  if (!Array.isArray(pillarsData) || pillarsData.length !== 3) {
    throw new Error(`Expected exactly 3 pillars, got ${pillarsData?.length}`);
  }
  for (const pillar of pillarsData) {
    PillarSchema.parse(pillar);
  }
  console.log('✓ pillars.json valid (3 pillars)');

  // 3. Solutions schema
  const solutionsData = JSON.parse(fs.readFileSync(path.join(contentDir, 'solutions.json'), 'utf8'));
  if (!Array.isArray(solutionsData) || solutionsData.length === 0) {
    throw new Error(`Expected valid solutions array, got ${solutionsData?.length}`);
  }
  for (const sol of solutionsData) {
    SolutionSummarySchema.parse(sol);
  }
  console.log(`✓ solutions.json valid (${solutionsData.length} solutions)`);

  // 4. Apps schema
  const appsDir = path.join(contentDir, 'apps');
  for (const sol of solutionsData) {
    const appPath = path.join(appsDir, `${sol.slug}.json`);
    if (!fs.existsSync(appPath)) {
      throw new Error(`Missing app JSON: ${appPath}`);
    }
    const appData = JSON.parse(fs.readFileSync(appPath, 'utf8'));
    const parsed = AppContentSchema.parse(appData);

    if (!parsed.basicIntro || parsed.basicIntro.trim().length === 0) {
      throw new Error(`App ${sol.slug} missing non-empty basicIntro`);
    }
    if (!parsed.contact || !parsed.contact.email) {
      throw new Error(`App ${sol.slug} missing valid contact object`);
    }
    if (!parsed.closing || !parsed.closing.liveDemoInfo) {
      throw new Error(`App ${sol.slug} missing valid closing object with liveDemoInfo`);
    }

    // Verify all cards have non-empty botDialogue and valid botPose
    parsed.cards.forEach((card, idx) => {
      if (!card.botDialogue || card.botDialogue.trim().length === 0) {
        throw new Error(`App ${sol.slug} card ${idx} has empty botDialogue`);
      }
      if (!card.botPose) {
        throw new Error(`App ${sol.slug} card ${idx} missing botPose`);
      }
    });
  }
  console.log(`✓ all ${solutionsData.length} app JSON files valid (basicIntro, contact, closing, cards with botPose & botDialogue)`);

  console.log('\nAll content successfully validated!');
}

try {
  validate();
} catch (error) {
  console.error('Validation FAILED:', error);
  process.exit(1);
}
