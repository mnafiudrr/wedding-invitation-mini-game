<script lang="ts">
  let { data } = $props();

  let keyFilter = $state('');
  let actionFilter = $state('');

  const filtered = $derived(
    data.logs.filter(
      (l) =>
        (!actionFilter || l.action === actionFilter) &&
        (!keyFilter || l.browserKey.includes(keyFilter) || (l.code ?? '').includes(keyFilter))
    )
  );
</script>

<h2>Activity Log</h2>

<div class="toolbar">
  <select bind:value={actionFilter}>
    <option value="">All actions</option>
    <option value="page">Page</option>
    <option value="game">Mini Game</option>
  </select>
  <input
    type="search"
    placeholder="Filter by browser key or code..."
    bind:value={keyFilter}
  />
</div>

{#if filtered.length === 0}
  <p class="empty">No activity yet.</p>
{:else}
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Action</th>
          <th>Invitation</th>
          <th>Code (?to=)</th>
          <th>Character</th>
          <th>Browser Key</th>
        </tr>
      </thead>
      <tbody>
        {#each filtered as log (log.id)}
          <tr>
            <td>{new Date(log.createdAt).toLocaleString()}</td>
            <td><span class="badge" class:game={log.action === 'game'}>{log.action}</span></td>
            <td>{log.name ?? '—'}</td>
            <td><code>{log.code ?? '(none)'}</code></td>
            <td>{log.action === 'game' ? (log.meta ?? '—') : '—'}</td>
            <td><code class="bkey">{log.browserKey}</code></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  h2 {
    margin-bottom: 1rem;
  }

  .toolbar {
    display: flex;
    gap: 0.6rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  select,
  input {
    padding: 0.7rem;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
  }

  input {
    flex: 1 1 200px;
    width: 100%;
  }

  .badge {
    font-size: 0.75rem;
    font-weight: bold;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    border: 2px solid #333;
    background: #bae1ff;
  }

  .badge.game {
    background: #baffc9;
  }

  .empty {
    text-align: center;
    color: #777;
    padding: 2rem;
  }

  .table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border: 3px solid #333;
    border-radius: 10px;
    background: #fff;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    min-width: 560px; /* let it scroll horizontally on small screens */
  }

  th,
  td {
    text-align: left;
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
  }

  th {
    background: var(--bg-sky);
    position: sticky;
    top: 0;
  }

  .bkey {
    font-size: 0.7rem;
    color: #555;
    word-break: break-all;
  }
</style>