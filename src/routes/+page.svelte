<script lang="ts">
  import { onMount } from 'svelte';
  import { gameState, selectedCharacter, cameraX, charX, activeModal, isMoving, facing } from '$lib/stores/game';
  import { audio } from '$lib/audio/AudioController';
  import MuteButton from '$lib/components/ui/MuteButton.svelte';
  import LanguageToggle from '$lib/components/ui/LanguageToggle.svelte';
  import { initLocale, dictionaries, locale } from '$lib/i18n';
  import { getBrowserKey } from '$lib/utils/browserKey';
  import Home from '$lib/components/home/Home.svelte';
  import GameHud from '$lib/components/game/GameHud.svelte';
  import World from '$lib/components/game/World.svelte';
  import Character from '$lib/components/game/Character.svelte';
  import House from '$lib/components/game/House.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import { houses, WORLD_WIDTH, CHAR_WIDTH } from '$lib/data/houses';

  import BrideGroom from '$lib/components/ui/menus/BrideGroom.svelte';
  import QuranQuotes from '$lib/components/ui/menus/QuranQuotes.svelte';
  import Events from '$lib/components/ui/menus/Events.svelte';
  import Maps from '$lib/components/ui/menus/Maps.svelte';
  import RSVP from '$lib/components/ui/menus/RSVP.svelte';
  import Messages from '$lib/components/ui/menus/Messages.svelte';
  import Credits from '$lib/components/ui/menus/Credits.svelte';

  const modalComponents: Record<string, any> = {
    'bride-groom': BrideGroom,
    'quran-quotes': QuranQuotes,
    'events': Events,
    'maps': Maps,
    'rsvp': RSVP,
    'messages': Messages,
    'credits': Credits
  };

  let moveDirection = $state<0 | -1 | 1>(0);
  let animationFrameId: number;
  let lastStepTime = 0;

  const T = $derived($locale === 'id' ? dictionaries.id : dictionaries.en);

  // ---- Responsive scale-to-fit (mobile-first) ----
  // The game is designed on a fixed base canvas (BASE_W wide) and scaled to the
  // phone frame's width, so it always fills the frame left-to-right. The base
  // height is derived from the frame height (baseH = h / scale), letting the
  // world stretch vertically while staying horizontally anchored.
  const BASE_W = 400;
  let frameW = $state(BASE_W);
  let frameH = $state(800);
  const scale = $derived(frameW / BASE_W);
  const baseH = $derived(Math.max(600, frameH / scale));

  onMount(() => {
    initLocale();

    // Log page access (with a per-browser key) so admins can trace activity.
    logActivity();

    // Try to auto-start the background music as soon as the page opens.
    // Where the browser blocks autoplay (AudioContext created suspended), the
    // source is scheduled anyway and starts on the first user gesture below.
    startBgm();

    const onFirstGesture = () => {
      audio.init(); // resumes a suspended context → scheduled bgm starts
      window.removeEventListener('pointerdown', onFirstGesture, true);
      window.removeEventListener('keydown', onFirstGesture, true);
    };
    window.addEventListener('pointerdown', onFirstGesture, true);
    window.addEventListener('keydown', onFirstGesture, true);

    return () => {
      window.removeEventListener('pointerdown', onFirstGesture, true);
      window.removeEventListener('keydown', onFirstGesture, true);
    };
  });

  let bgmStarted = false;
  function startBgm() {
    if (bgmStarted) return;
    bgmStarted = true;
    audio.init(); // inside a user gesture where possible
    audio.preload('bgm', '/audio/akad-payung-teduh.m4a');
    audio.preload('step', '/audio/step.wav');
    audio.preload('open', '/audio/open.wav');
    audio.play('bgm', { loop: true, volume: 0.4 });
  }

  // Stable random key per browser (localStorage) to correlate access activity.
  function logActivity() {
    try {
      const code = new URLSearchParams(window.location.search).get('to') ?? '';
      void fetch('/?/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ browserKey: getBrowserKey(), code }).toString()
      });
    } catch {
      /* non-critical */
    }
  }

  function selectCharacter(char: 'bride' | 'groom') {
    startBgm();
    audio.play('select');
    $selectedCharacter = char;
    $gameState = 'playing';

    // Spawn slightly before the first house (which is at x=300)
    charX.set(100, { hard: true });
    cameraX.set(0, { hard: true });
  }

  function updatePosition() {
    if (moveDirection !== 0 && $gameState === 'playing' && !$activeModal) {
      const speed = 5; // slower, relaxed walk
      let newCharX = $charX + (moveDirection * speed);
      newCharX = Math.max(0, Math.min(newCharX, WORLD_WIDTH - CHAR_WIDTH));
      charX.set(newCharX, { hard: true });

      let newCameraX = newCharX - (BASE_W / 2) + (CHAR_WIDTH / 2);
      newCameraX = Math.max(0, Math.min(newCameraX, WORLD_WIDTH - BASE_W));
      cameraX.set(newCameraX, { hard: true });

      const now = performance.now();
      if (now - lastStepTime > 280) {
        lastStepTime = now;
        audio.play('step', { volume: 0.5 });
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    }
  }

  function startMove(dir: -1 | 1) {
    if ($gameState !== 'playing' || $activeModal) return;
    facing.set(dir === -1 ? 'left' : 'right');
    isMoving.set(true);
    moveDirection = dir;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(updatePosition);
  }

  function stopMove() {
    moveDirection = 0;
    isMoving.set(false);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  }
</script>

<div
  class="mobile-frame"
  bind:clientWidth={frameW}
  bind:clientHeight={frameH}
>
  {#if $gameState === 'title'}
    <MuteButton />
    <LanguageToggle />
    <Home onselect={selectCharacter} />
  {:else if $gameState === 'playing'}
    <MuteButton />
  <LanguageToggle />
  <GameHud />
  <div class="game-container">
    <div class="game-scale" style="--scale: {scale}; --bh: {baseH}px;">
      <World>
        {#each houses as house}
          <House id={house.id} title={house.title} x={house.x} color={house.color} image={house.image} scale={house.scale ?? 1} />
        {/each}
        <Character />
      </World>

      {#if !$activeModal}
        <div class="controls">
          <button
            class="control-btn"
            ontouchstart={(e) => { e.preventDefault(); startMove(-1); }}
            onmousedown={() => startMove(-1)}
            ontouchend={stopMove}
            onmouseup={stopMove}
            onmouseleave={stopMove}
            ontouchcancel={stopMove}
            oncontextmenu={(e) => e.preventDefault()}
          >
            <img src="/particles/arrow-left.png" alt="" class="arrow" draggable="false" />
          </button>
          <button
            class="control-btn"
            ontouchstart={(e) => { e.preventDefault(); startMove(1); }}
            onmousedown={() => startMove(1)}
            ontouchend={stopMove}
            onmouseup={stopMove}
            onmouseleave={stopMove}
            ontouchcancel={stopMove}
            oncontextmenu={(e) => e.preventDefault()}
          >
            <img src="/particles/arrow-right.png" alt="" class="arrow" draggable="false" />
          </button>
        </div>
      {/if}
    </div>
  </div>

  {#if $activeModal}
    <Modal title={$activeModal ? T.sections[$activeModal] ?? '' : ''}>
      {#if modalComponents[$activeModal]}
        {@const Component = modalComponents[$activeModal]}
        <Component />
      {:else}
        <div class="placeholder-content">
          <p>This is the content area for {T.sections[$activeModal] ?? ''}.</p>
        </div>
      {/if}
    </Modal>
  {/if}
  {/if}
</div>

<style>
  /* Mobile-first: force a portrait (taller-than-wide) view, centered on desktop */
  .mobile-frame {
    position: relative;
    height: 100dvh;
    width: 100%;
    max-width: min(100vw, calc(100dvh * 0.56));
    margin: 0 auto;
    overflow: hidden;
    background: var(--bg-sky);
  }

  .game-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .game-scale {
    position: relative;
    width: 400px;
    height: var(--bh);
    flex: none;
    transform: scale(var(--scale));
  }

  .placeholder-content {
    padding: 2rem;
    text-align: center;
    color: #555;
    line-height: 1.5;
  }

  .controls {
    position: absolute;
    bottom: 8rem;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
    pointer-events: none;
    z-index: 50;
  }

  .control-btn {
    pointer-events: auto;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    border: 3px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    touch-action: none;
    box-shadow: 0 4px 0 #333;
  }

  .control-btn .arrow {
    width: 36px;
    height: 36px;
    image-rendering: pixelated;
    pointer-events: none;
  }
  
  .control-btn:active {
    box-shadow: 0 0px 0 #333;
    transform: translateY(4px);
  }
</style>
