<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { charX, selectedCharacter, isMoving, facing } from '$lib/stores/game';
  import { CHAR_WIDTH, CHAR_HEIGHT } from '$lib/data/houses';

  const art = $derived($selectedCharacter === 'bride' ? 'women' : 'men');

  // Random blink while idle: front sheet frame 0 (0-2000px) is the normal pose,
  // frame 1 (2000-4000px) is the closed-eyes blink shown briefly every 5-10s.
  let blinking = $state(false);
  let blinkTimer: ReturnType<typeof setTimeout> | undefined;
  let unblinkTimer: ReturnType<typeof setTimeout> | undefined;

  function scheduleBlink() {
    const delay = 5000 + Math.random() * 5000; // random 5-10s
    blinkTimer = setTimeout(() => {
      blinking = true;
      unblinkTimer = setTimeout(() => {
        blinking = false;
        scheduleBlink();
      }, 180);
    }, delay);
  }

  onMount(scheduleBlink);
  onDestroy(() => {
    if (blinkTimer) clearTimeout(blinkTimer);
    if (unblinkTimer) clearTimeout(unblinkTimer);
  });
</script>

<div
  class="character"
  style="transform: translate3d({$charX}px, 0, 0); --cw: {CHAR_WIDTH}px; --ch: {CHAR_HEIGHT}px;"
>
  <div
    class="sprite"
    class:walking={$isMoving}
    class:blink={blinking && !$isMoving}
    class:flip={$isMoving && $facing === 'right'}
    style="background-image: url('/sprites/{art}-{$isMoving ? 'walk-left' : 'front'}.png');"
  ></div>
</div>

<style>
  .character {
    position: absolute;
    bottom: 30%; /* Sit on top of the ground */
    left: 0;
    width: var(--cw);
    height: var(--ch);
    margin-bottom: calc(var(--cw) / 12);
    will-change: transform;
    z-index: 10;
  }
  .sprite {
    width: var(--cw);
    height: var(--cw);
    background-repeat: no-repeat;
    background-size: auto 100%;
    image-rendering: pixelated;
    transition: background-position-x 0.05s;
  }
  /* front sheet: frame 0 = normal pose, frame 1 = blink (2000px cell, scaled to one frame) */
  .sprite.blink {
    background-position-x: calc(-1 * var(--cw));
  }
  .sprite.walking {
    /* walk-left sheet: 4 frames of 2000px (scaled to one frame each) at 0-2000 / 2000-4000 / 4000-6000 / 6000-8000px */
    /* steps(4) with end -4*frame steps by exactly one frame per interval */
    animation: walk 0.8s steps(4) infinite;
  }
  /* walk-left art already faces left; flip for rightward movement */
  .sprite.flip {
    transform: scaleX(-1);
  }
  @keyframes walk {
    from {
      background-position-x: 0;
    }
    to {
      background-position-x: calc(-4 * var(--cw)); /* 4 frames */
    }
  }
</style>