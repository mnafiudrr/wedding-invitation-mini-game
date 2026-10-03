<script lang="ts">
  let { data } = $props();

  let expanded = $state<string[]>([]);

  const q = $derived(data.q);
  const action = $derived(data.action);

  function toggle(id: string) {
    expanded = expanded.includes(id) ? expanded.filter((x) => x !== id) : [...expanded, id];
  }

  function pageUrl(page: number): string {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (action) params.set('action', action);
    params.set('page', String(page));
    return `/admin/activity?${params.toString()}`;
  }

  const totalPages = $derived(Math.max(1, Math.ceil(data.total / data.pageSize)));
</script>

<h2>Activity Log</h2>

<form method="GET" class="toolbar">
  <select name="action">
    <option value="">All actions</option>
    <option value="page" selected={data.action === 'page'}>Page</option>
    <option value="game" selected={data.action === 'game'}>Mini Game</option>
  </select>
  <input type="search" name="q" value={data.q} placeholder="Search browser key or code..." />
  <button type="submit">Search</button>
</form>

{#if data.logs.length === 0}
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
          <th>Country</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each data.logs as log (log.id)}
          <tr>
            <td>{new Date(log.createdAt).toLocaleString()}</td>
            <td><span class="badge" class:game={log.action === 'game'}>{log.action}</span></td>
            <td>{log.name ?? '—'}</td>
            <td><code>{log.code ?? '(none)'}</code></td>
            <td>{log.action === 'game' ? (log.meta ?? '—') : '—'}</td>
            <td>{log.country ?? '—'}</td>
            <td>
              <button class="detail-btn" onclick={() => toggle(log.id)}>
                {expanded.includes(log.id) ? 'hide' : 'detail'}
              </button>
            </td>
          </tr>
          {#if expanded.includes(log.id)}
            <tr class="detail-row">
              <td colspan="7">
                <dl class="detail">
                  <div><dt>Device</dt><dd>{log.device ?? '—'}</dd></div>
                  <div><dt>City</dt><dd>{log.city ?? '—'}</dd></div>
                  <div><dt>Region</dt><dd>{log.region ?? '—'}</dd></div>
                  <div><dt>IP</dt><dd><code>{log.ip ?? '—'}</code></dd></div>
                  <div><dt>Browser Key</dt><dd><code>{log.browserKey}</code></dd></div>
                  <div><dt>User-Agent</dt><dd class="ua">{log.ua || '—'}</dd></div>
                </dl>
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>

  <div class="pager">
    {#if data.page > 1}
      <a href={pageUrl(data.page - 1)}>← Prev</a>
    {:else}
      <span class="disabled">← Prev</span>
    {/if}
    <span class="info">Page {data.page} of {totalPages} ({data.total} total)</span>
    {#if data.page < totalPages}
      <a href={pageUrl(data.page + 1)}>Next →</a>
    {:else}
      <span class="disabled">Next →</span>
    {/if}
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
  input,
  .toolbar button {
    padding: 0.7rem;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
  }

  input {
    flex: 1 1 200px;
    min-width: 0;
  }

  .toolbar button {
    background: #bae1ff;
    font-weight: bold;
    cursor: pointer;
    min-height: 44px;
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
    min-width: 640px;
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

  .detail-btn {
    background: #f0f0f7;
    border: 2px solid #333;
    border-radius: 6px;
    padding: 0.25rem 0.6rem;
    font-family: inherit;
    cursor: pointer;
    min-height: 32px;
  }

  .detail-row td {
    background: #fafaff;
    white-space: normal;
  }

  .detail {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin: 0;
  }

  .detail > div {
    display: flex;
    gap: 0.5rem;
  }

  .detail dt {
    font-weight: bold;
    min-width: 110px;
    color: #555;
  }

  .detail dd {
    margin: 0;
    word-break: break-all;
  }

  .ua {
    font-size: 0.78rem;
    color: #666;
  }

  .pager {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  .pager a {
    background: #bae1ff;
    border: 2px solid #333;
    border-radius: 6px;
    padding: 0.5rem 0.9rem;
    text-decoration: none;
    color: #333;
    font-weight: bold;
    min-height: 40px;
    display: inline-flex;
    align-items: center;
  }

  .pager .disabled {
    color: #aaa;
    padding: 0.5rem 0.9rem;
  }

  .pager .info {
    color: #666;
  }
</style>