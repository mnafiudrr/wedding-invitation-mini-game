<script lang="ts">
  import { cameraX } from '$lib/stores/game';
  import { WORLD_WIDTH } from '$lib/data/houses';
  let { children } = $props();

  function rnd(min: number, max: number) {
    return min + Math.random() * (max - min);
  }

  const semakImgs = ['semak', 'semak-2', 'semak-3'];
  const treeImgs = ['tree', 'tree-2', 'tree-3'];

  // Far-away mountains (gunung.png) rising from the horizon, with a hazy overlay.
  const gunung = Array.from({ length: 5 }, () => ({
    x: Math.round(rnd(0, WORLD_WIDTH - 380)),
    w: Math.round(rnd(220, 380)),
    haze: 0.3 + Math.random() * 0.3
  }));

  // Random ground scenery: bushes, trees, plants — random sprite, position and size.
  const decor: { kind: string; img: string; x: number; w: number; top?: number; ar?: number }[] = [
    ...Array.from({ length: 10 }, (_, i) => ({
      kind: 'semak',
      img: semakImgs[i % semakImgs.length],
      x: Math.round(rnd(30, WORLD_WIDTH - 130)),
      w: Math.round(rnd(60, 130))
    })),
    ...Array.from({ length: 7 }, (_, i) => ({
      kind: 'tree',
      img: treeImgs[i % treeImgs.length],
      x: Math.round(rnd(30, WORLD_WIDTH - 280)),
      w: Math.round(rnd(160, 280))
    })),
    ...Array.from({ length: 5 }, () => ({
      kind: 'tanaman',
      img: 'tanaman',
      x: Math.round(rnd(30, WORLD_WIDTH - 190)),
      w: Math.round(rnd(110, 170)),
      ar: 3.05 // tanaman.png is a wide 896x294 strip (about 3:1), not square
    })),
    // clouds float in the sky with random sizes/heights
    ...Array.from({ length: 9 }, () => ({
      kind: 'cloud',
      img: 'cloud',
      x: Math.round(rnd(20, WORLD_WIDTH - 240)),
      w: Math.round(rnd(90, 210)),
      top: Math.round(rnd(4, 32))
    }))
  ];
</script>

<div
  class="world"
  style="transform: translate3d({-$cameraX}px, 0, 0); --ww: {WORLD_WIDTH}px;"
>
  <div class="sky"></div>
  <div class="ground"></div>

  {#each gunung as m, i (i)}
    <div class="mountain" style="--x: {m.x}px; --w: {m.w}px; --haze: {m.haze};">
      <div class="mountain-img"></div>
      <div class="mountain-haze"></div>
    </div>
  {/each}

  {#each decor as d, i (i)}
    <div
      class="decor {d.kind}"
      style="--x: {d.x}px; --w: {d.w}px; --top: {d.top ?? 0}%; --ar: {d.ar ?? 1}; background-image: url('/particles/{d.img}.png');"
    ></div>
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
  .ground {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 71%;
    /* Tile horizontally, stretch the tile height to fill the ground band */
    background-image: url('/backgrounds/ground.png');
    background-repeat: repeat-x;
    background-size: auto 100%;
    background-position: left center;
  }
  /* Far-away mountains: desaturated + lightened (haze) so they read as distant */
  .mountain {
    position: absolute;
    bottom: 71%;
    left: var(--x);
    width: var(--w);
    aspect-ratio: 1;
    z-index: 1;
  }
  .mountain-img {
    position: absolute;
    inset: 0;
    background-image: url('/particles/gunung.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: bottom center;
    image-rendering: pixelated;
    filter: opacity(0.7) saturate(0.5) brightness(1.12);
  }
  .mountain-haze {
    position: absolute;
    inset: 0;
    background: rgba(168, 206, 240, calc(0.35 * var(--haze)));
    mix-blend-mode: screen;
    pointer-events: none;
  }
  .decor {
    position: absolute;
    left: var(--x);
    width: var(--w);
    aspect-ratio: var(--ar, 1);
    background-repeat: no-repeat;
    background-size: contain;
    image-rendering: pixelated;
    pointer-events: none;
    z-index: 2;
  }
  .decor.cloud {
    top: var(--top);
  }
  .decor.tree,
  .decor.semak,
  .decor.tanaman {
    bottom: 30%;
    background-position: bottom center;
  }
</style>