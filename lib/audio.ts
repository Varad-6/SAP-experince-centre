import { Howl } from 'howler';

export type SfxName =
  | 'ui_hover'
  | 'ui_click'
  | 'pillar_select'
  | 'drone_arrive'
  | 'drone_drop'
  | 'drone_leave'
  | 'card_next'
  | 'card_prev'
  | 'stat_tick'
  | 'celebrate'
  | 'bot_chirp';

class AudioManager {
  private muted = false;
  private volume = 0.8;
  private audioCtx: AudioContext | null = null;
  private sounds: Partial<Record<SfxName, Howl>> = {};

  constructor() {
    // Lazy AudioContext on first interaction
  }

  private initCtx() {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Synthesize procedural SFX if audio file is not found (Zero-asset compliance)
  private playSynthesized(sfx: SfxName) {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      switch (sfx) {
        case 'ui_hover':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(3000, now);
          osc.frequency.exponentialRampToValueAtTime(1000, now + 0.04);
          gain.gain.setValueAtTime(0.03 * this.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
          break;

        case 'ui_click':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
          gain.gain.setValueAtTime(0.08 * this.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
          break;

        case 'pillar_select':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
          gain.gain.setValueAtTime(0.12 * this.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
          break;

        case 'card_next':
        case 'card_prev':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(sfx === 'card_next' ? 400 : 700, now);
          osc.frequency.exponentialRampToValueAtTime(sfx === 'card_next' ? 700 : 400, now + 0.15);
          gain.gain.setValueAtTime(0.06 * this.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
          break;

        case 'stat_tick':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, now);
          gain.gain.setValueAtTime(0.04 * this.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
          break;

        case 'bot_chirp':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(650, now);
          osc.frequency.exponentialRampToValueAtTime(1100, now + 0.09);
          gain.gain.setValueAtTime(0.05 * this.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
          break;

        case 'celebrate':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
          osc.frequency.setValueAtTime(1046.5, now + 0.3); // C6
          gain.gain.setValueAtTime(0.15 * this.volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          osc.start(now);
          osc.stop(now + 0.8);
          break;

        default:
          break;
      }
    } catch {
      // Silent error handler (Section 10.3)
    }
  }

  play(sfx: SfxName) {
    if (this.muted) return;
    this.playSynthesized(sfx);
  }
}

export const audio = new AudioManager();
