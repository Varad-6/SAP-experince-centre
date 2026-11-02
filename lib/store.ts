import { create } from 'zustand';

export type SceneState =
  | 'LOADING'
  | 'LANDING'
  | 'PILLARS'
  | 'PILLAR'
  | 'PROJECT'
  | 'DEMO_INTRO'
  | 'DEMO'
  | 'DEMO_END';

export type BotState = 'idle' | 'walk' | 'point' | 'explain' | 'celebrate';
export type DroneState = 'hidden' | 'hovering' | 'dropping' | 'lifting';
export type QualityTier = 'HIGH' | 'MED' | 'LOW';

export interface AppStore {
  // State machine fields
  scene: SceneState;
  pillarId: string | null;
  slug: string | null;
  cardIndex: number;
  botState: BotState;
  droneState: DroneState;
  quality: QualityTier;
  isXR: boolean;
  muted: boolean;
  volume: number;
  captions: boolean;
  autoplay: boolean;
  reducedMotion: boolean;

  // Actions
  setScene: (scene: SceneState) => void;
  setQuality: (quality: QualityTier) => void;
  setBotState: (state: BotState) => void;
  setDroneState: (state: DroneState) => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setCaptions: (captions: boolean) => void;
  setAutoplay: (autoplay: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setXR: (isXR: boolean) => void;

  // Flow transitions
  goLanding: () => void;
  goPillars: () => void;
  openPillar: (pillarId: string) => void;
  openProject: (slug: string, pillarId?: string) => void;
  startDemo: (slug?: string) => void;
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
  botState: 'idle',
  droneState: 'hidden',
  quality: 'HIGH',
  isXR: false,
  muted: false,
  volume: 0.8,
  captions: true,
  autoplay: false,
  reducedMotion: false,

  setScene: (scene) => set({ scene }),
  setQuality: (quality) => set({ quality }),
  setBotState: (botState) => set({ botState }),
  setDroneState: (droneState) => set({ droneState }),
  setMuted: (muted) => set({ muted }),
  setVolume: (volume) => set({ volume }),
  setCaptions: (captions) => set({ captions }),
  setAutoplay: (autoplay) => set({ autoplay }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setXR: (isXR) => set({ isXR }),

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
  startDemo: (slug) =>
    set((state) => ({
      scene: 'DEMO_INTRO',
      slug: slug || state.slug,
      cardIndex: 0,
      droneState: 'hovering',
      botState: 'idle',
    })),
  setCardIndex: (cardIndex) => set({ cardIndex }),
  nextCard: (maxCards = 8) => {
    const { cardIndex, slug } = get();
    if (cardIndex + 1 >= maxCards) {
      set({ scene: 'DEMO_END', botState: 'celebrate' });
    } else {
      set({ cardIndex: cardIndex + 1, botState: 'explain' });
    }
  },
  prevCard: () => {
    const { cardIndex } = get();
    if (cardIndex > 0) {
      set({ cardIndex: cardIndex - 1, botState: 'point' });
    }
  },
  exitDemo: () => {
    const { slug, pillarId } = get();
    set({
      scene: slug ? 'PROJECT' : pillarId ? 'PILLAR' : 'PILLARS',
      cardIndex: 0,
      droneState: 'hidden',
      botState: 'idle',
    });
  },
}));
