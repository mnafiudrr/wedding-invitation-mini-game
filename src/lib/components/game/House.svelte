<script lang="ts">
  import { charX, activeModal } from '$lib/stores/game';
  import { audio } from '$lib/audio/AudioController';

  let { id, title, x, color } = $props();

  // Character width is 96px, so center is +48
  // House width is 136px, so center is +68
  let isNear = $derived(Math.abs(($charX + 48) - (x + 68)) < 170);

  function openModal() {
    if (isNear) {
      audio.play('open');
      $activeModal = id;
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  class="house-container" 
  style="transform: translate3d({x}px, 0, 0);"
  onclick={openModal}
>
  <div class="house-label" class:visible={isNear}>
    {title}
  </div>
  <div class="house" class:bouncing={isNear} style="background-color: {color};">
    <!-- Door -->
    <div class="door"></div>
  </div>
</div>

<style>
  .house-container {
    position: absolute;
    bottom: 30%; /* Sit on top of the ground */
    left: 0;
    width: 136px;
    height: 170px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    z-index: 5;
  }

  .house-label {
    position: absolute;
    top: -56px;
    background: rgba(255, 255, 255, 0.9);
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1.1rem;
    white-space: nowrap;
    border: 3px solid #333;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;
  }

  .house-label.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .house {
    width: 100%;
    height: 100%;
    border: 4px solid #333;
    border-radius: 6px 6px 0 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .bouncing {
    transform: scale(1.05) translateY(-8px);
  }

  .door {
    width: 50px;
    height: 68px;
    background-color: #8b5a2b;
    border: 3px solid #333;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
  }
</style>
