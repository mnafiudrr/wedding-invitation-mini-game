<script lang="ts">
  import { onMount } from 'svelte';
  import { gameState, selectedCharacter, cameraX, charX, activeModal, isMoving, facing } from '$lib/stores/game';
  import { audio } from '$lib/audio/AudioController';
  import MuteButton from '$lib/components/ui/MuteButton.svelte';
  import Home from '$lib/components/home/Home.svelte';
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

  let innerWidth = $state(0);
  let moveDirection = $state<0 | -1 | 1>(0);
  let animationFrameId: number;
  let lastStepTime = 0;

  function selectCharacter(char: 'bride' | 'groom') {
    audio.init(); // inside this click gesture (autoplay policy)
    audio.preload('bgm', '/audio/bgm.wav');
    audio.preload('step', '/audio/step.wav');
    audio.preload('open', '/audio/open.wav');
    audio.play('bgm', { loop: true, volume: 0.4 });
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

      let newCameraX = newCharX - (innerWidth / 2) + (CHAR_WIDTH / 2);
      newCameraX = Math.max(0, Math.min(newCameraX, WORLD_WIDTH - innerWidth));
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

<svelte:window bind:innerWidth />

{#if $gameState === 'title'}
  <MuteButton />
  <Home onselect={selectCharacter} />
{:else if $gameState === 'playing'}
  <MuteButton />
  <div class="game-container">
    <World>
      {#each houses as house}
        <House id={house.id} title={house.title} x={house.x} color={house.color} />
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
          ←
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
          →
        </button>
      </div>
    {/if}
  </div>

  {#if $activeModal}
    <Modal title={houses.find(h => h.id === $activeModal)?.title || ''}>
      {#if modalComponents[$activeModal]}
        {@const Component = modalComponents[$activeModal]}
        <Component />
      {:else}
        <div class="placeholder-content">
          <p>This is the content area for {houses.find(h => h.id === $activeModal)?.title}.</p>
        </div>
      {/if}
    </Modal>
  {/if}
{/if}

<style>
  .game-container {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .placeholder-content {
    padding: 2rem;
    text-align: center;
    color: #555;
    line-height: 1.5;
  }

  .controls {
    position: absolute;
    bottom: 50%;
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
    font-size: 24px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    box-shadow: 0 4px 0 #333;
  }
  
  .control-btn:active {
    box-shadow: 0 0px 0 #333;
    transform: translateY(4px);
  }
</style>
