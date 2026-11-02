import { z } from 'zod';

export const PillarIdSchema = z.enum(['p1', 'p2', 'p3', 'p4', 'p5']);

export const CardTypeSchema = z.enum([
  'hook',
  'challenge',
  'solution',
  'live-ui',
  'workflow',
  'tech-stack',
  'impact',
  'cta',
]);

export const HotspotSchema = z.object({
  x: z.number(),
  y: z.number(),
  label: z.string(),
  tooltip: z.string(),
});

export const WorkflowStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  desc: z.string(),
  sapAction: z.string(),
});

export const TechChipSchema = z.object({
  layer: z.string(),
  tech: z.string(),
});

export const MetricItemSchema = z.object({
  value: z.string(),
  label: z.string(),
  delta: z.string().optional(),
});

export const CtaActionSchema = z.object({
  label: z.string(),
  type: z.enum(['demo', 'prereq', 'pdf', 'architecture']),
});

export const CardSchema = z.object({
  index: z.number().min(0).max(7),
  type: CardTypeSchema,
  title: z.string(),
  botDialogue: z.string(),
  stat: z.object({ number: z.string(), label: z.string() }).optional(),
  bullets: z.array(z.string()).optional(),
  visual: z.enum(['pain-matrix', 'before-after']).optional(),
  diagram: z
    .object({
      nodes: z.array(z.object({ id: z.string(), label: z.string() })),
      edges: z.array(z.object({ from: z.string(), to: z.string() })),
    })
    .optional(),
  screenshot: z.string().optional(),
  hotspots: z.array(HotspotSchema).optional(),
  steps: z.array(WorkflowStepSchema).optional(),
  chips: z.array(TechChipSchema).optional(),
  metrics: z.array(MetricItemSchema).optional(),
  actions: z.array(CtaActionSchema).optional(),
});

export const AppContentSchema = z.object({
  slug: z.string(),
  pillarId: PillarIdSchema,
  title: z.string(),
  heroHeadline: z.string(),
  sapComponents: z.array(z.string()),
  hasContent: z.boolean().default(true),
  cards: z.array(CardSchema).length(8),
});

export const PillarSchema = z.object({
  id: PillarIdSchema,
  accent: z.string(),
  title: z.string(),
  tagline: z.string(),
  icon: z.string(),
  order: z.number(),
  solutionCount: z.number(),
});

export const SolutionSummarySchema = z.object({
  slug: z.string(),
  pillarId: PillarIdSchema,
  title: z.string(),
  oneLiner: z.string(),
  tags: z.array(z.string()),
  roiMetric: z.string(),
  featured: z.boolean().default(false),
  hasFullDemo: z.boolean().default(false),
});

export const SiteSchema = z.object({
  brand: z.string(),
  subBrand: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
  footer: z.object({
    copyright: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.string() })),
  }),
});
