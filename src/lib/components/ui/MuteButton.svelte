<script lang="ts">
  import { audio } from '$lib/audio/AudioController';
  import { dictionaries, locale } from '$lib/i18n';
  import SpeakerIcon from './icons/SpeakerIcon.svelte';

  const muted = audio.muted;
  const aria = $derived(
    $muted
      ? ($locale === 'id' ? dictionaries.id.aria.unmute : dictionaries.en.aria.unmute)
      : ($locale === 'id' ? dictionaries.id.aria.mute : dictionaries.en.aria.mute)
  );

  function toggle() {
    audio.setMuted(!$muted);
  }
</script>

<button class="mute-btn" aria-label={aria} aria-pressed={$muted} onclick={toggle}>
  <SpeakerIcon muted={$muted} size={24} />
</button>

<style>
  .mute-btn {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
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

  .mute-btn:active {
    box-shadow: none;
    transform: translateY(3px);
  }
</style>