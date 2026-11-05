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

export const DescriptionBlockSchema = z.object({
  type: z.enum(['p', 'ul', 'ol']),
  text: z.string().optional(),
  items: z.array(z.string()).optional(),
});

export const CardDescriptionSchema = z.object({
  plain: z.string(),
  blocks: z.array(DescriptionBlockSchema),
  source: z.string(),
  words: z.number(),
});

export const CardSchema = z.object({
  index: z.number().min(0).max(16).optional(),
  id: z.string().optional(),
  type: CardTypeSchema,
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.union([z.string(), CardDescriptionSchema]).nullable().optional(),
  botChat: z.array(z.string()).nullable().optional(),
  botChatMode: z.enum(['verbatim', 'split', 'condensed', 'none']).nullable().optional(),
  badge: z.string().optional(),
  imageUrl: z.string().optional(),
  caption: z.string().optional(),
  botDialogue: z.string(),
  botPose: z.string().optional(),
  stat: z.object({ number: z.string(), label: z.string() }).optional(),
  bullets: z.array(z.string()).optional(),
  legacyFriction: z.array(z.string()).optional(),
  modernFlow: z.array(z.string()).optional(),
  layers: z.array(z.object({ name: z.string(), tech: z.string() })).optional(),
  visual: z.enum(['pain-matrix', 'before-after']).optional(),
  diagram: z
    .object({
      nodes: z.array(z.object({ id: z.string(), label: z.string() })),
      edges: z.array(z.object({ from: z.string(), to: z.string() })),
    })
    .optional(),
  screenshot: z.string().optional(),
  hotspots: z.array(HotspotSchema).optional(),
  steps: z.array(z.any()).optional(),
  chips: z.array(TechChipSchema).optional(),
  metrics: z.array(z.any()).optional(),
  actions: z.array(CtaActionSchema).optional(),
}).passthrough();

export const ContactSchema = z.object({
  name: z.string(),
  role: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  teamsUrl: z.string().optional(),
});

export const ClosingSchema = z.object({
  liveDemoInfo: z.string().optional(),
  feedbackUrl: z.string().optional(),
  contact: ContactSchema.optional(),
});

export const AppContentSchema = z.object({
  slug: z.string(),
  pillarId: PillarIdSchema,
  title: z.string(),
  heroHeadline: z.string(),
  intro: z.string().optional(),
  basicIntro: z.string().optional(),
  sapComponents: z.array(z.string()),
  hasContent: z.boolean().default(true),
  cards: z.array(CardSchema).min(1).max(24),
  contact: ContactSchema.optional(),
  closing: ClosingSchema.optional(),
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
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  tagline: z.string().optional(),
  sub: z.string().optional(),
  botName: z.string().optional(),
  introLines: z.array(z.string()).optional(),
  defaultContact: ContactSchema.optional(),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
  footer: z.object({
    copyright: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.string() })),
  }),
});
