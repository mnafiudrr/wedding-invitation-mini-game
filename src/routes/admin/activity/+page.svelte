<script lang="ts">
  let { data } = $props();

  let keyFilter = $state('');

  const filtered = $derived(
    data.logs.filter(
      (l) => !keyFilter || l.browserKey.includes(keyFilter) || (l.code ?? '').includes(keyFilter)
    )
  );
</script>

<h2>Activity Log</h2>

<div class="toolbar">
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
          <th>Invitation</th>
          <th>Code (?to=)</th>
          <th>Browser Key</th>
        </tr>
      </thead>
      <tbody>
        {#each filtered as log (log.id)}
          <tr>
            <td>{new Date(log.createdAt).toLocaleString()}</td>
            <td>{log.name ?? '—'}</td>
            <td><code>{log.code ?? '(none)'}</code></td>
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
    margin-bottom: 1rem;
  }

  input {
    width: 100%;
    padding: 0.7rem;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
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