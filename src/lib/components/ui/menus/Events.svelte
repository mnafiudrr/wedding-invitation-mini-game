<script lang="ts">
  import { EVENTS } from '$lib/data/couple';
</script>

<div class="events-container">
  {#each EVENTS as event}
    <div class="event-card">
      <h3>{event.title}</h3>
      <p class="date">{event.date}</p>
      <p class="time">{event.time}</p>
      <p class="location">{event.location}</p>
    </div>
  {/each}

  <div class="countdown">
    <h4>Countdown to the big day!</h4>
    <p>10 Oktober 2026</p>
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
</style>