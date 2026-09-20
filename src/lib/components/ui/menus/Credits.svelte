<script lang="ts">
  import { CREDITS, POWERED_BY } from '$lib/data/couple';
</script>

<div class="credits-container">
  <h3>Thank You</h3>
  <p>To everyone who supported us in making this dream a reality.</p>

  {#each CREDITS as credit}
    <div class="credit-section">
      <h4>{credit.role}</h4>
      <p>{credit.name} · {credit.handle}</p>
    </div>
  {/each}

  <div class="credit-section">
    <h4>Powered By</h4>
    <p>{POWERED_BY}</p>
  </div>
</div>

<style>
  .credits-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .credit-section {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 12px;
    border: 2px dashed #ccc;
  }

  h4 {
    margin: 0 0 0.5rem 0;
    color: #ffb8b8;
  }

  p {
    margin: 0;
    color: #555;
  }
</style>