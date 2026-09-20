<script lang="ts">
  import { charX, selectedCharacter, isMoving, facing } from '$lib/stores/game';

  const art = $derived($selectedCharacter === 'bride' ? 'women' : 'men');
</script>

<div class="character" style="transform: translate3d({$charX}px, 0, 0);">
  <div
    class="sprite"
    class:walking={$isMoving}
    class:flip={$isMoving && $facing === 'right'}
    style="background-image: url('/sprites/{art}-{$isMoving ? 'walk-left' : 'front'}.png');"
  ></div>
</div>

<style>
  .character {
    position: absolute;
    bottom: 30%; /* Sit on top of the ground */
    left: 0;
    width: 48px;
    height: 64px;
    margin-bottom: 4px;
    will-change: transform;
    z-index: 10;
  }
  .sprite {
    width: 48px;
    height: 48px;
    background-repeat: no-repeat;
    background-size: auto 100%;
    image-rendering: pixelated;
    animation: idle 0.8s steps(2) infinite;
  }
  .sprite.walking {
    animation: walk 0.6s steps(4) infinite;
  }
  /* walk-left art already faces left; flip for rightward movement */
  .sprite.flip {
    transform: scaleX(-1);
  }
  @keyframes idle {
    from {
      background-position-x: 0;
    }
    to {
      background-position-x: -48px; /* 2 frames x 48px */
    }
  }
  @keyframes walk {
    from {
      background-position-x: 0;
    }
    to {
      background-position-x: -144px; /* 4 frames x 48px */
    }
  }
</style>