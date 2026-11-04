import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');
const solutions = JSON.parse(fs.readFileSync(path.join(contentDir, 'solutions.json'), 'utf8'));
const site = JSON.parse(fs.readFileSync(path.join(contentDir, 'site.json'), 'utf8'));
const appsDir = path.join(contentDir, 'apps');

const defaultPoses = ['wave', 'alert', 'present', 'point', 'explain', 'laptop', 'celebrate', 'present'];

let updatedCount = 0;
for (const sol of solutions) {
  const filePath = path.join(appsDir, `${sol.slug}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;

    if (!data.basicIntro) {
      data.basicIntro = sol.oneLiner;
      changed = true;
    }
    if (!data.intro) {
      data.intro = data.heroHeadline || sol.oneLiner;
      changed = true;
    }
    if (!data.contact) {
      data.contact = site.defaultContact;
      changed = true;
    }
    if (!data.closing) {
      data.closing = {
        liveDemoInfo: 'Accessible on SAP BTP Cloud Foundry tenant with pre-configured single sign-on.',
        contact: site.defaultContact,
      };
      changed = true;
    }

    if (Array.isArray(data.cards)) {
      data.cards.forEach((card: any, idx: number) => {
        if (!card.botPose) {
          card.botPose = defaultPoses[idx] || 'explain';
          changed = true;
        }
      });
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      updatedCount++;
    }
  }
}
console.log(`Enrichment complete. Updated ${updatedCount} app scripts.`);
