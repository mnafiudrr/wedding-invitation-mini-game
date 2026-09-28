<script lang="ts">
  let { data } = $props();
</script>

<h2>Dashboard</h2>

<div class="grid">
  <a class="card" href="/admin/invitations">
    <span class="num">{data.summary.invitations}</span>
    <span class="lbl">Invitations</span>
  </a>
  <a class="card" href="/admin/rsvps">
    <span class="num">{data.summary.rsvps}</span>
    <span class="lbl">RSVPs</span>
  </a>
  <a class="card attending" href="/admin/rsvps">
    <span class="num">{data.summary.attending}</span>
    <span class="lbl">Attending</span>
  </a>
  <a class="card declined" href="/admin/rsvps">
    <span class="num">{data.summary.declined}</span>
    <span class="lbl">Declined</span>
  </a>
  <a class="card" href="/admin/rsvps">
    <span class="num">{data.summary.headcount}</span>
    <span class="lbl">Guests (headcount)</span>
  </a>
  <a class="card" href="/admin/messages">
    <span class="num">{data.summary.messages}</span>
    <span class="lbl">Messages</span>
  </a>
  <a class="card pending" href="/admin/messages">
    <span class="num">{data.summary.pendingMessages}</span>
    <span class="lbl">Pending</span>
  </a>
  <a class="card" href="/admin/activity">
    <span class="num">{data.summary.accesses}</span>
    <span class="lbl">Invite accesses</span>
  </a>
  <a class="card" href="/admin/activity">
    <span class="num">{data.summary.uniqueBrowsers}</span>
    <span class="lbl">Unique browsers</span>
  </a>
</div>

{#if data.recentLogs.length > 0}
  <h3>Recent activity</h3>
  <div class="recent">
    {#each data.recentLogs as log (log.createdAt + log.browserKey)}
      <div class="row">
        <span class="when">{new Date(log.createdAt).toLocaleString()}</span>
        <code>{log.code ?? '(no to)'}</code>
        <code class="bkey">{log.browserKey}</code>
      </div>
    {/each}
  </div>
{/if}

<style>
  h2 {
    margin-bottom: 1rem;
  }

  h3 {
    margin: 1.5rem 0 0.5rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  @media (min-width: 640px) {
    .grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }
  }

  .card {
    background: #fff;
    border: 3px solid #333;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    box-shadow: 0 4px 0 #333;
    text-decoration: none;
    color: #333;
  }

  .card.attending {
    background: #baffc9;
  }

  .card.declined {
    background: #ffb3ba;
  }

  .card.pending {
    background: #ffdfba;
  }

  .num {
    font-size: 1.6rem;
    font-weight: bold;
  }

  .lbl {
    font-size: 0.85rem;
    text-align: center;
  }

  .recent {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    background: #fff;
    border: 2px solid #e0dcd3;
    border-radius: 8px;
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }

  .when {
    color: #666;
  }

  .bkey {
    font-size: 0.7rem;
    color: #555;
    word-break: break-all;
    max-width: 45%;
    text-align: right;
  }
</style>