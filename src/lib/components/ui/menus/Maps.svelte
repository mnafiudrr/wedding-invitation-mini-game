<script lang="ts">
  import { MAPS_URL, MAPS_EMBED } from '$lib/data/couple';
</script>

<div class="maps-container">
  <p>We look forward to seeing you at Gedung Serba Guna Perum Serdang Asri.</p>

  <div class="iframe-wrapper">
    <iframe
      src={MAPS_EMBED}
      width="100%"
      height="300"
      style="border:0;"
      allowfullscreen={true}
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      title="Wedding Location"
    ></iframe>
  </div>

  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" class="btn">
    Open in Google Maps
  </a>
</div>

<style>
  .maps-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .iframe-wrapper {
    border: 3px solid #333;
    border-radius: 12px;
    overflow: hidden;
  }

  .btn {
    display: inline-block;
    background: #ffb8b8;
    color: #fff;
    padding: 1rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    border: 3px solid #333;
    transition: transform 0.2s;
  }

  .btn:active {
    transform: scale(0.95);
  }
</style>