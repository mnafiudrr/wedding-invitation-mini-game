<script lang="ts">
  import { CREDITS, POWERED_BY } from '$lib/data/couple';
  import { dictionaries, locale } from '$lib/i18n';

  const T = $derived($locale === 'id' ? dictionaries.id : dictionaries.en);

  const roleKeys: Record<string, 'concept' | 'development' | 'assets'> = {
    'Concept & Idea': 'concept',
    Development: 'development',
    Assets: 'assets'
  };
</script>

<div class="credits-container">
  <h3>{T.credits.thankYou}</h3>
  <p>{T.credits.support}</p>

  {#each CREDITS as credit}
    <div class="credit-section">
      <h4>{T.credits.roles[roleKeys[credit.role]]}</h4>
      <p>{credit.name} ·
        <a
          href={`https://instagram.com/${credit.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
        >@{credit.instagram}</a>
      </p>
    </div>
  {/each}

  <div class="credit-section">
    <h4>{T.credits.poweredBy}</h4>
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

  a {
    color: #b9427a;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }
</style>