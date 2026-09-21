<script lang="ts">
  import { cameraX } from '$lib/stores/game';
  import { WORLD_WIDTH } from '$lib/data/houses';
  let { children } = $props();
</script>

<div
  class="world"
  style="transform: translate3d({-$cameraX}px, 0, 0); --ww: {WORLD_WIDTH}px;"
>
  <div class="sky"></div>
  <div class="ground"></div>
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
    height: 30%;
    background: #8fb935;
    border-top: 4px solid #5d821d;
  }
</style>
