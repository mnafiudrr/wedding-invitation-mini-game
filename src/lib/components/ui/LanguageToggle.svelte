<script lang="ts">
  import { locale, toggleLocale, dictionaries } from '$lib/i18n';
  import FlagID from './icons/FlagID.svelte';
  import FlagUK from './icons/FlagUK.svelte';

  const isId = $derived($locale === 'id');
  const aria = $derived($locale === 'id' ? dictionaries.id.aria.toEnglish : dictionaries.en.aria.toIndonesian);
</script>

<button class="lang-btn" onclick={toggleLocale} aria-label={aria}>
  {#if isId}
    <FlagUK size={26} />
  {:else}
    <FlagID size={26} />
  {/if}
</button>

<style>
  .lang-btn {
    position: fixed;
    top: 0.8rem;
    right: 4rem; /* sits between mute (0.8rem) and home (7.2rem) with a small gap each */
    z-index: 90;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #333;
    box-shadow: 0 3px 0 #333;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
  }

  .lang-btn:active {
    box-shadow: none;
    transform: translateY(3px);
  }
</style>