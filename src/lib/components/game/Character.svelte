<script lang="ts">
  import { charX, selectedCharacter, isMoving, facing } from '$lib/stores/game';
</script>

<div class="character" style="transform: translate3d({$charX}px, 0, 0);">
  <div
    class="sprite {$facing === 'left' ? 'facing-left' : ''}"
    class:walking={$isMoving}
    style="background-image: url('/sprites/char-{$selectedCharacter ?? 'groom'}-{$isMoving
      ? 'walk'
      : 'front'}.png');"
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
    image-rendering: pixelated;
    animation: idle 0.8s steps(2) infinite;
  }
  .sprite.walking {
    animation: walk 0.5s steps(6) infinite;
  }
  @keyframes idle {
    from {
      background-position-x: 0;
    }
    to {
      background-position-x: -96px; /* 2 frames x 48px */
    }
  }
  @keyframes walk {
    from {
      background-position-x: 0;
    }
    to {
      background-position-x: -288px; /* 6 frames x 48px */
    }
  }
  .facing-left {
    transform: scaleX(-1);
  }
</style>
