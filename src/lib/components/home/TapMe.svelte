<script lang="ts">
  import { onMount } from 'svelte';
  import { dictionaries, locale } from '$lib/i18n';

  const T = $derived($locale === 'id' ? dictionaries.id : dictionaries.en);

  // First appearance right after 2s, then randomly every 3-7s; stays for 1-3s.
  let visible = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let first = true;

  function schedule() {
    const delay = first ? 2000 : 3000 + Math.random() * 4000; // 2s first, then 3-7s
    first = false;
    timer = setTimeout(() => {
      visible = true;
      const duration = 1000 + Math.random() * 2000; // 1-3s
      timer = setTimeout(() => {
        visible = false;
        schedule();
      }, duration);
    }, delay);
  }

  onMount(() => {
    schedule();
    return () => {
      if (timer) clearTimeout(timer);
    };
  });
</script>

{#if visible}
  <div class="tapme">{T.home.tapMe}</div>
{/if}

<style>
  .tapme {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%) translateY(-100%);
    background: #fdfbf7;
    color: #333;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 0.25rem 0.6rem;
    font-size: 0.8rem;
    font-weight: bold;
    white-space: nowrap;
    box-shadow: 2px 2px 0 #333;
    z-index: 5;
    pointer-events: none;
    animation: pop 0.2s ease-out;
  }

  .tapme::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #333;
  }

  @keyframes pop {
    from {
      transform: translateX(-50%) translateY(-70%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(-100%);
      opacity: 1;
    }
  }
</style>