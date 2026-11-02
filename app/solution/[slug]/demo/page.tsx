import React from 'react';
import { notFound } from 'next/navigation';
import * as fs from 'fs';
import * as path from 'path';
import solutionsData from '@/content/solutions.json';
import { AppContentSchema } from '@/lib/schema';
import { DemoStage } from '@/components/demo/DemoStage';

export function generateStaticParams() {
  return solutionsData.map((s) => ({ slug: s.slug }));
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const appFilePath = path.join(process.cwd(), 'content', 'apps', `${slug}.json`);

  if (!fs.existsSync(appFilePath)) {
    notFound();
  }

  const raw = fs.readFileSync(appFilePath, 'utf8');
  const appData = AppContentSchema.parse(JSON.parse(raw));

  return <DemoStage appData={appData} />;
}
