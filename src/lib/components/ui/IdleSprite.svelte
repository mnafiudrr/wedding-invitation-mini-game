<script lang="ts">
  import { onMount } from 'svelte';

  let { art, size = 96, blinkMin = 4000, blinkMax = 7000 } = $props();

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
  style="--size: {size}px; background-image: url('/sprites/{art}-front.png');"
></div>

<style>
  .sprite {
    width: var(--size);
    height: var(--size);
    background-repeat: no-repeat;
    background-size: auto 100%;
    image-rendering: pixelated;
  }
  .sprite.blink {
    background-position-x: calc(-1 * var(--size));
  }
</style>