<script lang="ts">
  import { charX, selectedCharacter } from '$lib/stores/game';
</script>

<div class="character" style="transform: translate3d({$charX}px, 0, 0);">
  {#if $selectedCharacter === 'bride'}
    <div class="placeholder bride">B</div>
  {:else if $selectedCharacter === 'groom'}
    <div class="placeholder groom">G</div>
  {:else}
    <div class="placeholder">?</div>
  {/if}
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
  .placeholder {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 24px;
    border-radius: 24px 24px 0 0;
  }
  .bride { background-color: #ffb8b8; }
  .groom { background-color: #b8c0ff; }
</style>
