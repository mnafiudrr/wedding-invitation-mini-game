<script lang="ts">
  let { data } = $props();

  let filter = $state('');
  const rows = $derived(
    data.rows.filter(
      (r) =>
        r.name.toLowerCase().includes(filter.toLowerCase()) ||
        r.inviteCode.toLowerCase().includes(filter.toLowerCase())
    )
  );

  function exportCsv() {
    const header = 'Name,Invite Code,Attending,Headcount,Submitted At\n';
    const lines = rows
      .map((r) =>
        [r.name, r.inviteCode, r.isAttending ? 'yes' : 'no', r.headcount, r.createdAt]
          .map((v) => `"${String(v).replaceAll('"', '""')}"`)
          .join(',')
      )
      .join('\n');
    const blob = new Blob([header + lines], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvps.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<h2>RSVPs</h2>

<div class="summary">
  <div class="card"><span class="num">{data.summary.total}</span><span>Total</span></div>
  <div class="card attending"><span class="num">{data.summary.attending}</span><span>Attending</span></div>
  <div class="card declined"><span class="num">{data.summary.declined}</span><span>Declined</span></div>
  <div class="card"><span class="num">{data.summary.headcount}</span><span>Total Guests</span></div>
</div>

<div class="toolbar">
  <input type="search" placeholder="Filter by name or invite code..." bind:value={filter} />
  <button onclick={exportCsv} disabled={rows.length === 0}>Export CSV</button>
</div>

{#if rows.length === 0}
  <p class="empty">No RSVPs{filter ? ' matching filter' : ' yet'}.</p>
{:else}
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Name</th><th>Invite Code</th><th>Attending</th><th>Headcount</th><th>Submitted</th></tr>
      </thead>
      <tbody>
        {#each rows as row (row.id)}
          <tr>
            <td>{row.name}</td>
            <td><code>{row.inviteCode}</code></td>
            <td><span class:yes={row.isAttending} class:no={!row.isAttending}>{row.isAttending ? 'Yes' : 'No'}</span></td>
            <td>{row.headcount}</td>
            <td>{new Date(row.createdAt).toLocaleString()}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.2rem;
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
  }

  .card.attending { background: #baffc9; }
  .card.declined { background: #ffb3ba; }

  .num { font-size: 1.6rem; font-weight: bold; }

  .toolbar {
    display: flex;
    gap: 0.8rem;
    margin-bottom: 1rem;
  }

  input {
    flex: 1;
    padding: 0.6rem;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
  }

  button {
    background: #bae1ff;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 0.6rem 1rem;
    font-family: inherit;
    font-weight: bold;
    cursor: pointer;
    white-space: nowrap;
  }

  .empty {
    text-align: center;
    color: #777;
    padding: 2rem;
  }

  .table-wrap {
    overflow-x: auto;
    border: 3px solid #333;
    border-radius: 10px;
    background: #fff;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }

  th, td {
    text-align: left;
    padding: 0.7rem 1rem;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
  }

  th {
    background: var(--bg-sky);
    position: sticky;
    top: 0;
  }

  .yes { color: #1e7d34; font-weight: bold; }
  .no { color: #c0392b; font-weight: bold; }
</style>
