<script lang="ts">
  import { charX, activeModal } from '$lib/stores/game';

  let { id, title, x, color } = $props();

  // Character width is 48px, so center is +24
  // House width is 68px, so center is +34
  let isNear = $derived(Math.abs(($charX + 24) - (x + 34)) < 100);

  function openModal() {
    if (isNear) {
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
    width: 68px;
    height: 85px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    z-index: 5;
  }

  .house-label {
    position: absolute;
    top: -40px;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px 8px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.9rem;
    white-space: nowrap;
    border: 2px solid #333;
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
    border: 3px solid #333;
    border-radius: 4px 4px 0 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .bouncing {
    transform: scale(1.05) translateY(-5px);
  }

  .door {
    width: 25px;
    height: 34px;
    background-color: #8b5a2b;
    border: 2px solid #333;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
  }
</style>
