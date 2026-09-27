<script lang="ts">
  import { onMount } from 'svelte';
  import { EVENTS, WEDDING_DATE } from '$lib/data/couple';
  import { dictionaries, locale } from '$lib/i18n';

  const T = $derived($locale === 'id' ? dictionaries.id : dictionaries.en);

  const eventTitles: Record<string, string> = {
    'Akad Nikah': $locale === 'id' ? 'Akad Nikah' : 'Akad Nikah',
    'Resepsi': $locale === 'id' ? 'Resepsi' : 'Wedding Reception'
  };

  const target = new Date(WEDDING_DATE).getTime();
  let now = $state(Date.now());

  onMount(() => {
    const timer = setInterval(() => (now = Date.now()), 1000);
    return () => clearInterval(timer);
  });

  const diff = $derived(Math.max(0, target - now));
  const days = $derived(Math.floor(diff / 86_400_000));
  const hours = $derived(Math.floor((diff % 86_400_000) / 3_600_000));
  const minutes = $derived(Math.floor((diff % 3_600_000) / 60_000));
  const seconds = $derived(Math.floor((diff % 60_000) / 1000));

  const pad = (n: number) => String(n).padStart(2, '0');
</script>

<div class="events-container">
  {#each EVENTS as event}
    <div class="event-card">
      <h3>{eventTitles[event.title] ?? event.title}</h3>
      <p class="date">{T.events.dates[event.date] ?? event.date}</p>
      <p class="time">{event.time}</p>
      <p class="location">{event.location}</p>
    </div>
  {/each}

  <div class="countdown">
    <h4>{T.events.countdown}</h4>
    <div class="timer">
      <div class="unit"><span class="num">{days}</span><span class="lbl">{T.events.days}</span></div>
      <div class="unit"><span class="num">{pad(hours)}</span><span class="lbl">{T.events.hours}</span></div>
      <div class="unit"><span class="num">{pad(minutes)}</span><span class="lbl">{T.events.minutes}</span></div>
      <div class="unit"><span class="num">{pad(seconds)}</span><span class="lbl">{T.events.seconds}</span></div>
    </div>
  </div>
</div>

<style>
  .events-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .event-card {
    background: #fdfbf7;
    border: 2px solid #e0dcd3;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
  }

  .date {
    font-weight: bold;
    color: #333;
    margin-top: 0.5rem;
  }

  .countdown {
    text-align: center;
    background: #ffb8b8;
    color: #fff;
    padding: 1rem;
    border-radius: 12px;
    font-weight: bold;
    border: 3px solid #333;
  }

  .timer {
    display: flex;
    justify-content: center;
    gap: 0.6rem;
    margin-top: 0.75rem;
  }

  .unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 0.4rem 0.5rem;
    min-width: 52px;
  }

  .num {
    font-size: 1.4rem;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .lbl {
    font-size: 0.7rem;
    margin-top: 0.2rem;
    opacity: 0.75;
  }
</style>