// Web Audio API Procedural Sound Synthesizer (Zero External MP3/WAV files)

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Realistic wooden gavel strike on sounding block
  public playGavelStrike(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Primary hard wood impact (Transient high pop)
    const impactOsc = ctx.createOscillator();
    const impactGain = ctx.createGain();
    impactOsc.type = 'triangle';
    impactOsc.frequency.setValueAtTime(420, now);
    impactOsc.frequency.exponentialRampToValueAtTime(75, now + 0.08);

    impactGain.gain.setValueAtTime(0.8, now);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    impactOsc.connect(impactGain);
    impactGain.connect(ctx.destination);

    impactOsc.start(now);
    impactOsc.stop(now + 0.1);

    // 2. Resonant hardwood body (Warm low-mid thud)
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(140, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(55, now + 0.35);

    bodyGain.gain.setValueAtTime(0.7, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);

    bodyOsc.start(now);
    bodyOsc.stop(now + 0.36);

    // 3. Bench reverberation (Secondary echo rattle at 90ms)
    const echoOsc = ctx.createOscillator();
    const echoGain = ctx.createGain();
    echoOsc.type = 'triangle';
    echoOsc.frequency.setValueAtTime(110, now + 0.09);
    echoOsc.frequency.exponentialRampToValueAtTime(45, now + 0.28);

    echoGain.gain.setValueAtTime(0.0, now);
    echoGain.gain.setValueAtTime(0.3, now + 0.09);
    echoGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    echoOsc.connect(echoGain);
    echoGain.connect(ctx.destination);

    echoOsc.start(now + 0.09);
    echoOsc.stop(now + 0.29);
  }

  // Official court clerk mechanical docket stamp
  public playDocketStamp(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Heavy mechanical press
    const stampOsc = ctx.createOscillator();
    const stampGain = ctx.createGain();
    stampOsc.type = 'square';
    stampOsc.frequency.setValueAtTime(280, now);
    stampOsc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

    stampGain.gain.setValueAtTime(0.5, now);
    stampGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    stampOsc.connect(stampGain);
    stampGain.connect(ctx.destination);

    stampOsc.start(now);
    stampOsc.stop(now + 0.08);

    // Ink suction release click
    const releaseOsc = ctx.createOscillator();
    const releaseGain = ctx.createGain();
    releaseOsc.type = 'sine';
    releaseOsc.frequency.setValueAtTime(620, now + 0.05);
    releaseOsc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

    releaseGain.gain.setValueAtTime(0.0, now);
    releaseGain.gain.setValueAtTime(0.35, now + 0.05);
    releaseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    releaseOsc.connect(releaseGain);
    releaseGain.connect(ctx.destination);

    releaseOsc.start(now + 0.05);
    releaseOsc.stop(now + 0.13);
  }

  // High urgency deadline warning chime
  public playWarningBell(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [880, 1046.5]; // A5 and C6 double alert

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.setValueAtTime(0.4, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.55);
    });
  }

  // Success milestone harmonic triad chime
  public playSuccessChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    notes.forEach((note, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now + idx * 0.07);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.setValueAtTime(0.3, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.75);
    });
  }

  // Subtle tactical haptic click
  public playClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  // Panic shredder sweep (Noise burst + fast sweep)
  public playShredderWipe(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.6);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.62);
  }
}

export const sound = new SoundEngine();
