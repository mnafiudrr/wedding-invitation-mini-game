<script lang="ts">
  import IdleSprite from '$lib/components/ui/IdleSprite.svelte';
  import HomeSection from './HomeSection.svelte';
  import { COUPLE } from '$lib/data/couple';
  import { houses } from '$lib/data/houses';

  import BrideGroom from '$lib/components/ui/menus/BrideGroom.svelte';
  import QuranQuotes from '$lib/components/ui/menus/QuranQuotes.svelte';
  import Events from '$lib/components/ui/menus/Events.svelte';
  import Maps from '$lib/components/ui/menus/Maps.svelte';
  import RSVP from '$lib/components/ui/menus/RSVP.svelte';
  import Messages from '$lib/components/ui/menus/Messages.svelte';
  import Credits from '$lib/components/ui/menus/Credits.svelte';

  let { onselect }: { onselect: (char: 'bride' | 'groom') => void } = $props();

  const sections = [
    { component: BrideGroom, motif: 'heart' },
    { component: QuranQuotes, motif: 'crescent' },
    { component: Events, motif: 'calendar' },
    { component: Maps, motif: 'pin' },
    { component: RSVP, motif: 'envelope' },
    { component: Messages, motif: 'bubble' },
    { component: Credits, motif: 'star' }
  ];
</script>

<div class="home-scroll">
  <section class="hero">
    <h1>Wedding Invitation</h1>

    <div class="character-selection">
      <button onclick={() => onselect('bride')}>
        <IdleSprite art="women" size={96} />
        <span class="name">{COUPLE.bride.name}</span>
      </button>
      <span class="amp">&</span>
      <button onclick={() => onselect('groom')}>
        <IdleSprite art="men" size={96} />
        <span class="name">{COUPLE.groom.name}</span>
      </button>
    </div>

    <div class="scroll-hint">Scroll to explore</div>
  </section>

  {#each sections as section, i (i)}
    {@const Component = section.component}
    <HomeSection title={houses[i].title} accent={houses[i].color} motif={section.motif}>
      <Component />
    </HomeSection>
  {/each}
</div>

<style>
  .home-scroll {
    height: 100vh;
    height: 100svh;
    overflow-y: auto;
    touch-action: pan-y;
    scroll-snap-type: y proximity;
    background: var(--bg-sky);
  }

  .hero {
    min-height: 100vh;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    scroll-snap-align: start;
    background-color: var(--bg-sky);
    color: #333;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 3rem;
  }

  .character-selection {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .amp {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    transform: translateY(-20px);
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    font-family: inherit;
    font-size: 1rem;
    transition: transform 0.2s;
  }

  .name {
    font-size: 1.2rem;
    font-weight: bold;
  }

  button:hover {
    transform: scale(1.1);
  }

  .scroll-hint {
    margin-top: 4rem;
    font-size: 1rem;
    color: #666;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(8px);
    }
  }
</style>