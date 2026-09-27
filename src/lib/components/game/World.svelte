<script lang="ts">
  import { cameraX } from '$lib/stores/game';
  import { WORLD_WIDTH } from '$lib/data/houses';
  let { children } = $props();

  function rnd(min: number, max: number) {
    return min + Math.random() * (max - min);
  }

  const semakImgs = ['semak', 'semak-2', 'semak-3'];
  const treeImgs = ['tree', 'tree-2', 'tree-3'];

  // Layer order (back -> front): far clouds -> mountains -> near clouds -> ground decor.
  const cloudsFar = Array.from({ length: 11 }, () => ({
    x: Math.round(rnd(20, WORLD_WIDTH - 240)),
    w: Math.round(rnd(120, 260)),
    top: Math.round(rnd(2, 20))
  }));

  const cloudsNear = Array.from({ length: 11 }, () => ({
    x: Math.round(rnd(20, WORLD_WIDTH - 240)),
    w: Math.round(rnd(90, 200)),
    top: Math.round(rnd(10, 34))
  }));

  // Far-away mountains rising from the ground line (bottom: 30%), hazy overlay.
  const gunung = Array.from({ length: 10 }, () => ({
    x: Math.round(rnd(0, WORLD_WIDTH - 380)),
    w: Math.round(rnd(200, 380)),
    haze: 0.3 + Math.random() * 0.3
  }));

  // Ground scenery: bushes, trees, plants — random sprite, position and size.
  const groundDecor: { kind: string; img: string; x: number; w: number; ar?: number }[] = [
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
    }))
  ];
</script>

<div
  class="world"
  style="transform: translate3d({-$cameraX}px, 0, 0); --ww: {WORLD_WIDTH}px;"
>
  <div class="sky"></div>
  <div class="ground"></div>

  {#each cloudsFar as c, i (i)}
    <div class="cloud far" style="--x: {c.x}px; --w: {c.w}px; --top: {c.top}%;"></div>
  {/each}

  {#each gunung as m, i (i)}
    <div class="mountain" style="--x: {m.x}px; --w: {m.w}px; --haze: {m.haze};">
      <div class="mountain-img"></div>
      <div class="mountain-haze"></div>
    </div>
  {/each}

  {#each cloudsNear as c, i (i)}
    <div class="cloud near" style="--x: {c.x}px; --w: {c.w}px; --top: {c.top}%;"></div>
  {/each}

  {#each groundDecor as d, i (i)}
    <div
      class="decor {d.kind}"
      style="--x: {d.x}px; --w: {d.w}px; --ar: {d.ar ?? 1}; background-image: url('/particles/{d.img}.png');"
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
    /* ground-only.png is grass-on-top + earth body; height 35% puts the grass
       line at the character's knee (same horizon as the old ground.png look) */
    height: 35%;
    z-index: 3; /* in front of mountains (far), behind near clouds & scenery */
    /* Tile horizontally, stretch the tile height to fill the ground band */
    background-image: url('/backgrounds/ground-only.png');
    background-repeat: repeat-x;
    background-size: auto 100%;
    background-position: left center;
  }
  /* ---- far clouds (behind mountains) ---- */
  .cloud.far {
    z-index: 1;
    opacity: 0.75;
  }
  /* ---- mountains (behind the ground, base at the grass/knee line) ---- */
  .mountain {
    position: absolute;
    bottom: 30%; /* grass line = top of the (35%-tall) ground band */
    left: var(--x);
    width: var(--w);
    aspect-ratio: 1;
    z-index: 2;
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
  /* ---- near clouds (in front of mountains & ground) ---- */
  .cloud.near {
    z-index: 4;
  }
  .cloud {
    position: absolute;
    top: var(--top);
    left: var(--x);
    width: var(--w);
    aspect-ratio: 1;
    background-image: url('/particles/cloud.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: bottom center;
    image-rendering: pixelated;
    pointer-events: none;
  }
  /* ---- foreground scenery ---- */
  .decor {
    position: absolute;
    left: var(--x);
    width: var(--w);
    aspect-ratio: var(--ar, 1);
    background-repeat: no-repeat;
    background-size: contain;
    image-rendering: pixelated;
    pointer-events: none;
    z-index: 5; /* front-most scenery (else) */
  }
  .decor.tree,
  .decor.semak,
  .decor.tanaman {
    bottom: 32%;
    background-position: bottom center;
  }
</style>