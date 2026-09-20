<script lang="ts">
  let { title, accent, motif = 'star', children } = $props();

  const motifs: Record<string, string> = {
    heart: '♥',
    crescent: '☾',
    calendar: '▦',
    pin: '⌖',
    envelope: '✉',
    bubble: '❝',
    star: '★'
  };
</script>

<section class="home-section" style="--accent: {accent};">
  <div class="motif" aria-hidden="true">{motifs[motif] ?? '★'}</div>
  <h2>{title}</h2>
  <div class="content">
    {@render children()}
  </div>
</section>

<style>
  .home-section {
    min-height: 100vh;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 1.5rem;
    scroll-snap-align: start;
    position: relative;
    background:
      radial-gradient(circle at 50% -20%, color-mix(in srgb, var(--accent) 60%, white), transparent 60%),
      linear-gradient(180deg, color-mix(in srgb, var(--accent) 35%, white) 0%, #fff 75%);
    color: #333;
  }

  .motif {
    font-size: 3rem;
    line-height: 1;
    margin-bottom: 0.5rem;
    filter: drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.15));
  }

  h2 {
    font-size: 1.6rem;
    margin: 0 0 1.5rem;
    padding: 0.5rem 1.2rem;
    background: #fff;
    border: 3px solid #333;
    box-shadow: 4px 4px 0 #333;
    display: inline-block;
    color: #333;
  }

  .content {
    width: 100%;
    max-width: 640px;
  }
</style>