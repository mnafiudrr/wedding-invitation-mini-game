<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { activeModal } from '$lib/stores/game';

  let { title, children } = $props();

  function close() {
    $activeModal = null;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-backdrop" transition:fade={{ duration: 200 }} onclick={close}>
  <div class="modal-content" transition:scale={{ duration: 300, start: 0.9 }} onclick={(e) => e.stopPropagation()}>
    <div class="modal-header">
      <h2>{title}</h2>
      <button class="close-btn" onclick={close}>×</button>
    </div>
    <div class="modal-body">
      {@render children()}
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal-content {
    background: #fff;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 3px solid #333;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 2px dashed #eee;
    background-color: var(--bg-sky);
  }
  
  h2 {
    font-size: 1.5rem;
    margin: 0;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
    color: #555;
    transition: transform 0.2s;
  }

  .close-btn:hover {
    transform: scale(1.2) rotate(90deg);
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    font-family: sans-serif;
  }
</style>
