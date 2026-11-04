import React from 'react';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import solutionsData from '@/content/solutions.json';
import pillarsData from '@/content/pillars.json';
import { SolutionDetailClient } from './SolutionDetailClient';

export function generateStaticParams() {
  return solutionsData.map((s) => ({ slug: s.slug }));
}

export default async function SolutionOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = solutionsData.find((s) => s.slug === slug);

  if (!solution) {
    notFound();
  }

  const pillar = pillarsData.find((p) => p.id === solution.pillarId);

  // Load app data if it exists
  let appData = null;
  const appPath = path.join(process.cwd(), 'content', 'apps', `${slug}.json`);
  if (fs.existsSync(appPath)) {
    try {
      appData = JSON.parse(fs.readFileSync(appPath, 'utf8'));
    } catch {
      appData = null;
    }
  }

  return <SolutionDetailClient solution={solution} pillar={pillar} appData={appData} />;
}
