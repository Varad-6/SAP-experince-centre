import { create } from 'zustand';

export type SceneState =
  | 'LANDING'
  | 'PILLARS'
  | 'PILLAR'
  | 'PROJECT'
  | 'DEMO'
  | 'DEMO_END';

export interface AppStore {
  scene: SceneState;
  pillarId: string | null;
  slug: string | null;
  cardIndex: number;
  reducedMotion: boolean;

  // Actions
  setScene: (scene: SceneState) => void;
  setReducedMotion: (reduced: boolean) => void;
  goLanding: () => void;
  goPillars: () => void;
  openPillar: (pillarId: string) => void;
  openProject: (slug: string, pillarId?: string) => void;
  setCardIndex: (index: number) => void;
  nextCard: (maxCards?: number) => void;
  prevCard: () => void;
  exitDemo: () => void;
}

export const useStore = create<AppStore>((set, get) => ({
  scene: 'LANDING',
  pillarId: null,
  slug: null,
  cardIndex: 0,
  reducedMotion: false,

  setScene: (scene) => set({ scene }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),

  goLanding: () => set({ scene: 'LANDING', cardIndex: 0 }),
  goPillars: () => set({ scene: 'PILLARS', pillarId: null, slug: null, cardIndex: 0 }),
  openPillar: (pillarId) => set({ scene: 'PILLAR', pillarId, slug: null, cardIndex: 0 }),
  openProject: (slug, pillarId) =>
    set((state) => ({
      scene: 'PROJECT',
      slug,
      pillarId: pillarId || state.pillarId,
      cardIndex: 0,
    })),
  setCardIndex: (cardIndex) => set({ cardIndex }),
  nextCard: (maxCards = 8) => {
    const { cardIndex } = get();
    if (cardIndex + 1 >= maxCards) {
      set({ scene: 'DEMO_END' });
    } else {
      set({ cardIndex: cardIndex + 1 });
    }
  },
  prevCard: () => {
    const { cardIndex } = get();
    if (cardIndex > 0) {
      set({ cardIndex: cardIndex - 1 });
    }
  },
  exitDemo: () => {
    const { slug, pillarId } = get();
    set({
      scene: slug ? 'PROJECT' : pillarId ? 'PILLAR' : 'PILLARS',
      cardIndex: 0,
    });
  },
}));
