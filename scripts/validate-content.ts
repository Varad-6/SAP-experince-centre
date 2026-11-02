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
  SiteSchema.parse(siteData);
  console.log('✓ site.json valid');

  // 2. Pillars schema
  const pillarsData = JSON.parse(fs.readFileSync(path.join(contentDir, 'pillars.json'), 'utf8'));
  if (!Array.isArray(pillarsData) || pillarsData.length !== 5) {
    throw new Error(`Expected exactly 5 pillars, got ${pillarsData?.length}`);
  }
  for (const pillar of pillarsData) {
    PillarSchema.parse(pillar);
  }
  console.log('✓ pillars.json valid (5 pillars)');

  // 3. Solutions schema
  const solutionsData = JSON.parse(fs.readFileSync(path.join(contentDir, 'solutions.json'), 'utf8'));
  if (!Array.isArray(solutionsData) || solutionsData.length !== 28) {
    throw new Error(`Expected exactly 28 solutions, got ${solutionsData?.length}`);
  }
  for (const sol of solutionsData) {
    SolutionSummarySchema.parse(sol);
  }
  console.log('✓ solutions.json valid (28 solutions)');

  // 4. Apps schema
  const appsDir = path.join(contentDir, 'apps');
  for (const sol of solutionsData) {
    const appPath = path.join(appsDir, `${sol.slug}.json`);
    if (!fs.existsSync(appPath)) {
      throw new Error(`Missing app JSON: ${appPath}`);
    }
    const appData = JSON.parse(fs.readFileSync(appPath, 'utf8'));
    AppContentSchema.parse(appData);
  }
  console.log('✓ all 28 app JSON files valid (8 cards per app)');

  console.log('\nAll content successfully validated!');
}

try {
  validate();
} catch (error) {
  console.error('Validation FAILED:', error);
  process.exit(1);
}
