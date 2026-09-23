<script lang="ts">
  import { charX, activeModal } from '$lib/stores/game';
  import { audio } from '$lib/audio/AudioController';
  import { CHAR_WIDTH, HOUSE_WIDTH, HOUSE_HEIGHT, PROXIMITY_THRESHOLD } from '$lib/data/houses';

  let { id, title, x, color, image } = $props();

  let isNear = $derived(
    Math.abs($charX + CHAR_WIDTH / 2 - (x + HOUSE_WIDTH / 2)) < PROXIMITY_THRESHOLD
  );

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
  style="transform: translate3d({x}px, 0, 0); --hw: {HOUSE_WIDTH}px; --hh: {HOUSE_HEIGHT}px;"
  onclick={openModal}
>
  <div class="house-label" class:visible={isNear}>
    {title}
  </div>
  <div
    class="house"
    class:bouncing={isNear}
    class:has-image={!!image}
    style:background-image={image ? `url('/buildings/${image}')` : undefined}
    style:background-color={image ? undefined : color}
  >
    {#if !image}
      <!-- Door (fallback for houses without artwork) -->
      <div class="door"></div>
    {/if}
  </div>
</div>

<style>
  .house-container {
    position: absolute;
    bottom: 71%; /* Sit on top of the ground (ground is 71% tall) */
    left: 0;
    width: var(--hw);
    height: var(--hh);
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
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: bottom center;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .house:not(.has-image) {
    border: 4px solid #333;
    border-radius: 6px 6px 0 0;
  }

  .bouncing {
    transform: scale(1.05) translateY(-8px);
  }

  .door {
    width: 30%;
    height: 40%;
    background-color: #8b5a2b;
    border: 3px solid #333;
    border-bottom: none;
    border-radius: 6px 6px 0 0;
  }
</style>
