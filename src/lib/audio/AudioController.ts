import { writable } from 'svelte/store';

class AudioController {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private loading = new Set<string>();

  readonly muted = writable<boolean>(
    typeof localStorage !== 'undefined' && localStorage.getItem('wedding_muted') === 'true'
  );

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
    return typeof localStorage !== 'undefined' && localStorage.getItem('wedding_muted') === 'true'
      ? 0
      : 1;
  }

  preload(name: string, url: string): void {
    if (!this.ctx || this.buffers.has(name) || this.loading.has(name)) return;
    this.loading.add(name);
    fetch(url)
      .then((r) => r.arrayBuffer())
      .then((ab) => this.ctx!.decodeAudioData(ab))
      .then((buf) => this.buffers.set(name, buf))
      .catch(() => {
        /* audio is optional; fail silently */
      })
      .finally(() => this.loading.delete(name));
  }

  play(name: string, { loop = false, volume = 1 }: { loop?: boolean; volume?: number } = {}): void {
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
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.linearRampToValueAtTime(muted ? 0 : 1, t + 0.1);
    }
  }
}

export const audio = new AudioController();
