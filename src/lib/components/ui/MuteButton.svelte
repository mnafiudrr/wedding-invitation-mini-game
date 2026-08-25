<script lang="ts">
  import { audio } from '$lib/audio/AudioController';

  const muted = audio.muted;

  function toggle() {
    audio.setMuted(!$muted);
  }
</script>

<button
  class="mute-btn"
  aria-label={$muted ? 'Unmute music and sounds' : 'Mute music and sounds'}
  aria-pressed={$muted}
  onclick={toggle}
>
  {$muted ? '🔇' : '🔊'}
</button>

<style>
  .mute-btn {
    position: fixed;
    top: 0.8rem;
    right: 0.8rem;
    z-index: 90;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #333;
    box-shadow: 0 3px 0 #333;
    font-size: 18px;
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
