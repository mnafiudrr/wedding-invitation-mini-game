<script lang="ts">
  import { cameraX } from '$lib/stores/game';
  import { WORLD_WIDTH } from '$lib/data/houses';
  let { children } = $props();

  // Decorative scenery scattered across the world (particles/*.png, 1000x1000 each).
  const decor = [
    { kind: 'tree', x: 80, w: 110 },
    { kind: 'tree', x: 1500, w: 120 },
    { kind: 'tree', x: 2720, w: 110 },
    { kind: 'semak', x: 320, w: 70 },
    { kind: 'semak', x: 880, w: 75 },
    { kind: 'semak', x: 1620, w: 70 },
    { kind: 'semak', x: 2380, w: 80 },
    { kind: 'tanaman', x: 500, w: 55 },
    { kind: 'tanaman', x: 1220, w: 55 },
    { kind: 'tanaman', x: 1960, w: 55 },
    { kind: 'tanaman', x: 2620, w: 60 },
    { kind: 'cloud', x: 140, w: 140 },
    { kind: 'cloud', x: 920, w: 170 },
    { kind: 'cloud', x: 1780, w: 150 },
    { kind: 'cloud', x: 2520, w: 180 }
  ];
</script>

<div
  class="world"
  style="transform: translate3d({-$cameraX}px, 0, 0); --ww: {WORLD_WIDTH}px;"
>
  <div class="sky"></div>
  <div class="clouds"></div>
  <div class="ground"></div>
  {#each decor as d, i (i)}
    <div class="decor {d.kind}" style="--x: {d.x}px; --w: {d.w}px;"></div>
  {/each}
  {@render children()}
</div>

<style>
  .world {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    /* Wide world (design units, scaled to fit by the game container) */
    width: var(--ww);
    will-change: transform;
  }
  .sky {
    position: absolute;
    top: 0;
    width: 100%;
    height: 70%;
    background: linear-gradient(to bottom, #74b9ff, #b3dcfd);
  }
  /* Far cloud band from backgrounds/cloud.png (cover crops to the painted band) */
  .clouds {
    position: absolute;
    top: 0;
    width: 100%;
    height: 70%;
    background-image: url('/backgrounds/cloud.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.85;
    pointer-events: none;
    z-index: 1;
  }
  .ground {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30%;
    background: #8fb935;
    border-top: 4px solid #5d821d;
  }
  .decor {
    position: absolute;
    left: var(--x);
    width: var(--w);
    aspect-ratio: 1;
    background-repeat: no-repeat;
    background-size: contain;
    image-rendering: pixelated;
    pointer-events: none;
    z-index: 2;
  }
  .decor.cloud {
    top: 8%;
    background-image: url('/particles/cloud.png');
  }
  .decor.tree,
  .decor.semak,
  .decor.tanaman {
    bottom: 30%;
    background-position: bottom center;
  }
  .decor.tree {
    background-image: url('/particles/tree.png');
  }
  .decor.semak {
    background-image: url('/particles/semak.png');
  }
  .decor.tanaman {
    background-image: url('/particles/tanaman.png');
  }
</style>