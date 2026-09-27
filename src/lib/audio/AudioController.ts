import { writable } from 'svelte/store';

type PlayOptions = { loop?: boolean; volume?: number };

// Sound always starts muted on every page load (autoplay-safe); the user
// can unmute with the toggle. The toggle still applies within the session.
function defaultMuted(): boolean {
  return true;
}

class AudioController {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private loading = new Map<string, Promise<void>>();
  private pending = new Map<string, PlayOptions>();

  readonly muted = writable<boolean>(defaultMuted());

  /** MUST be called from inside a user-gesture handler. Safe to call repeatedly. */
  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    try {
      const Ctx = window.AudioContext ?? (window as any).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muteTarget;
      this.master.connect(this.ctx.destination);

      document.addEventListener('visibilitychange', () => {
        if (!this.ctx) return;
        if (document.hidden) void this.ctx.suspend();
        else if (!this.muteTarget) void this.ctx.resume();
      });
    } catch {
      this.ctx = null;
    }
  }

  private get muteTarget(): number {
    return defaultMuted() ? 0 : 1;
  }

  preload(name: string, url: string): void {
    if (!this.ctx || this.buffers.has(name) || this.loading.has(name)) return;
    const promise = fetch(url)
      .then((r) => r.arrayBuffer())
      .then((ab) => this.ctx!.decodeAudioData(ab))
      .then((buf) => {
        this.buffers.set(name, buf);
        const queued = this.pending.get(name);
        if (queued) {
          this.pending.delete(name);
          this.start(name, queued);
        }
      })
      .catch(() => {
        this.pending.delete(name); // drop queued plays if the audio fails
      })
      .finally(() => this.loading.delete(name));
    this.loading.set(name, promise);
  }

  play(name: string, options: PlayOptions = {}): void {
    if (!this.ctx || !this.master) return;
    if (this.buffers.has(name)) {
      this.start(name, options);
    } else {
      // buffer still decoding — queue and start as soon as it's ready
      this.pending.set(name, options);
    }
  }

  private start(name: string, { loop = false, volume = 1 }: PlayOptions): void {
    if (!this.ctx || !this.master || !this.buffers.has(name)) return;
    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.buffers.get(name)!;
      source.loop = loop;
      const gain = this.ctx.createGain();
      gain.gain.value = volume;
      source.connect(gain);
      gain.connect(this.master);
      source.start();
    } catch {
      /* ignore */
    }
  }

  setMuted(muted: boolean): void {
    localStorage.setItem('wedding_muted', String(muted));
    this.muted.set(muted);
    if (this.master && this.ctx) {
      // unmuting is a user gesture — resume a suspended context so bgm starts/continues
      if (!muted && this.ctx.state === 'suspended') void this.ctx.resume();
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(muted ? 0 : 1, t + 0.1);
    }
  }
}

export const audio = new AudioController();
