import { redirect } from 'next/navigation';
import solutionsData from '@/content/solutions.json';

export async function generateStaticParams() {
  return solutionsData.map((sol) => ({
    slug: sol.slug,
  }));
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/solution/${slug}`);
}
