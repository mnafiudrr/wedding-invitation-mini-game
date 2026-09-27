<script lang="ts">
  import { gameState, selectedCharacter, activeModal, cameraX, charX, isMoving } from '$lib/stores/game';
  import IdleSprite from '$lib/components/ui/IdleSprite.svelte';
  import HomeIcon from '$lib/components/ui/icons/HomeIcon.svelte';
  import { dictionaries, locale } from '$lib/i18n';

  const art = $derived($selectedCharacter === 'bride' ? 'women' : 'men');
  const aria = $derived($locale === 'id' ? dictionaries.id.aria.home : dictionaries.en.aria.home);

  function goHome() {
    isMoving.set(false);
    activeModal.set(null);
    charX.set(0, { hard: true });
    cameraX.set(0, { hard: true });
    $gameState = 'title';
  }
</script>

<div class="hud-left">
  <div class="avatar-frame">
    <IdleSprite art={art} size={48} zoom={2} />
  </div>
  <div class="hearts">
    {#each [0, 1, 2] as i (i)}
      <img src="/particles/love.png" alt="health" class="heart" draggable="false" />
    {/each}
  </div>
</div>

<button class="home-btn" onclick={goHome} aria-label={aria}>
  <HomeIcon size={24} />
</button>

<style>
  .hud-left {
    position: fixed;
    top: 0.8rem;
    left: 0.8rem;
    z-index: 90;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    pointer-events: none;
  }

  .avatar-frame {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 3px solid #333;
    box-shadow: 2px 2px 0 #333;
  }

  .hearts {
    display: flex;
    gap: 0.2rem;
  }

  .heart {
    width: 26px;
    height: 26px;
    image-rendering: pixelated;
    filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.2));
  }

  .home-btn {
    position: fixed;
    top: 0.8rem;
    right: 6.4rem; /* sits beside the language toggle (3.6rem) and mute (0.8rem) */
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

  .home-btn:active {
    box-shadow: none;
    transform: translateY(3px);
  }
</style>