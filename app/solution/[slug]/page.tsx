import React from 'react';
import { notFound } from 'next/navigation';
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

  return <SolutionDetailClient solution={solution} pillar={pillar} />;
}
