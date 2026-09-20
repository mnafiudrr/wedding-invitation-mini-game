<script lang="ts">
  import { onMount } from 'svelte';

  let { art, size = 96, zoom = 1, blinkMin = 4000, blinkMax = 7000 } = $props();

  // Random blink: front sheet frame 0 (0-2000px) is the normal pose,
  // frame 1 (2000-4000px) is the closed-eyes blink shown briefly.
  // Frame swap snaps (no transition) for a clean, discrete blink.
  let blinking = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: 'idle' | 'blink' | null = null;

  function schedule() {
    if (pending !== null) return;
    pending = 'idle';
    const delay = blinkMin + Math.random() * (blinkMax - blinkMin);
    timer = setTimeout(() => {
      if (pending !== 'idle') return;
      blinking = true;
      pending = 'blink';
      timer = setTimeout(() => {
        if (pending !== 'blink') return;
        blinking = false;
        pending = null;
        schedule();
      }, 180);
    }, delay);
  }

  onMount(() => {
    schedule();
    return () => {
      if (timer) clearTimeout(timer);
    };
  });
</script>

<div
  class="sprite"
  class:blink={blinking}
  style="--size: {size}px; --zoom: {zoom}; background-image: url('/sprites/{art}-front.png');"
></div>

<style>
  .sprite {
    width: var(--size);
    height: var(--size);
    background-repeat: no-repeat;
    /* zoom: 1 shows the full frame; zoom: 3 crops to the top third (the head) */
    background-size: auto calc(var(--size) * var(--zoom));
    background-position: 0 0;
    image-rendering: pixelated;
  }
  .sprite.blink {
    background-position-x: calc(-1 * var(--size) * var(--zoom));
  }
</style>