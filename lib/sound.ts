/**
 * Audio Engine completely removed per engineering specification.
 * Zero Web Audio API, zero AudioContext, zero synthesis.
 */

class SoundEngine {
  public isMuted(): boolean {
    return true;
  }
  public setMuted(_v: boolean): void {}
  public click(): void {}
  public slideNext(): void {}
  public slidePrev(): void {}
  public typeChirp(): void {}
  public celebrate(): void {}
}

export const sound = new SoundEngine();
