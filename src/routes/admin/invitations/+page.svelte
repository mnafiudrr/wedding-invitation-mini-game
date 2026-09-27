<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import type { SubmitFunction } from '@sveltejs/kit';

  let { data } = $props();

  let submitting = $state(false);
  let errorMsg = $state('');
  let expanded = $state<string[]>([]);

  function toggleAccesses(id: string) {
    expanded = expanded.includes(id) ? expanded.filter((x) => x !== id) : [...expanded, id];
  }

  // Simplified mustache template: {{name}} and {{link}} are replaced per invitation.
  const WA_TEMPLATE =
    "Assalamu'alaikum Wr. Wb.\n\n" +
    'Yth. Bapak/Ibu/Saudara/i {{name}}\n\n' +
    'Dengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara ' +
    'pernikahan kami:\n\n' +
    'Buka undangan digital di: {{link}}\n\n' +
    'Terima kasih atas kehadiran dan doa restunya.\n\n' +
    'Wassalamu\'alaikum Wr. Wb.\n' +
    'Vicky & Nafiu';

  function whatsappUrl(phone: string, name: string, code: string): string {
    const normalized = phone.replace(/[^\d]/g, '').replace(/^0/, '62');
    const link = `${data.baseUrl}/?to=${code}`;
    const message = WA_TEMPLATE.replaceAll('{{name}}', name).replaceAll('{{link}}', link);
    return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
  }

  function copyLink(code: string) {
    navigator.clipboard?.writeText(`${data.baseUrl}/?to=${code}`);
  }

  const createHandler: SubmitFunction = () => {
    submitting = true;
    errorMsg = '';
    return async ({ result, update }) => {
      submitting = false;
      if (result.type === 'failure' && result.data?.error) {
        errorMsg = String(result.data.error);
      }
      if (result.type === 'success') {
        await invalidateAll();
      }
      update({ reset: true });
    };
  };
</script>

<h2>Invitations</h2>

{#if errorMsg}
  <div class="error">{errorMsg}</div>
{/if}

<form method="POST" action="?/create" use:enhance={createHandler} class="create-form">
  <input type="text" name="name" placeholder="Guest name (e.g. Budi Santoso)" required />
  <input type="tel" name="phone" placeholder="Phone / WhatsApp number (e.g. 081234567890)" required />
  <button type="submit" disabled={submitting}>
    {submitting ? 'Adding...' : 'Add Invitation'}
  </button>
</form>

{#if data.rows.length === 0}
  <p class="empty">No invitations yet.</p>
{:else}
  <div class="list">
    {#each data.rows as row (row.id)}
      <div class="card">
        <div class="head">
          <strong>{row.name}</strong>
          <span class="code">{row.code}</span>
        </div>
        <p class="phone">{row.phone}</p>
        <p class="link">{data.baseUrl}/?to={row.code}</p>
        <button class="accessed" onclick={() => toggleAccesses(row.id)}>
          Accessed: {row.accessed}
        </button>
        {#if expanded.includes(row.id)}
          <div class="access-list">
            {#if row.accesses.length === 0}
              <p class="none">No access recorded.</p>
            {:else}
              {#each row.accesses as a (a.at + a.browserKey)}
                <div class="access-row">
                  <span>{new Date(a.at).toLocaleString()}</span>
                  <code class="bkey">{a.browserKey}</code>
                </div>
              {/each}
            {/if}
          </div>
        {/if}
        <div class="actions">
          <a
            href={whatsappUrl(row.phone, row.name, row.code)}
            target="_blank"
            rel="noopener noreferrer"
            class="btn wa"
          >Send WhatsApp</a>
          <button class="btn" onclick={() => copyLink(row.code)}>Copy Link</button>
          <form method="POST" action="?/remove">
            <input type="hidden" name="id" value={row.id} />
            <button type="submit" class="btn danger">Delete</button>
          </form>
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  h2 {
    margin-bottom: 1rem;
  }

  .error {
    color: #c0392b;
    font-weight: bold;
    margin-bottom: 1rem;
    border: 2px dashed #c0392b;
    padding: 0.6rem;
    border-radius: 8px;
    background: #fdecea;
  }

  .create-form {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    background: #e6b3ff;
    border: 3px solid #333;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  input {
    padding: 0.6rem;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .card {
    background: #fff;
    border: 3px solid #333;
    border-radius: 10px;
    padding: 0.9rem 1.1rem;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.3rem;
  }

  .code {
    font-family: monospace;
    background: #bae1ff;
    border: 2px solid #333;
    border-radius: 6px;
    padding: 0.15rem 0.5rem;
  }

  .phone,
  .link {
    margin: 0.2rem 0;
    color: #666;
    font-size: 0.9rem;
    word-break: break-all;
  }

  .actions {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }

  .accessed {
    margin-top: 0.5rem;
    background: #fffbe8;
    border: 2px solid #333;
    border-radius: 6px;
    padding: 0.25rem 0.7rem;
    font-family: inherit;
    font-weight: bold;
    cursor: pointer;
  }

  .access-list {
    margin-top: 0.5rem;
    border-top: 2px dashed #ddd;
    padding-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    max-height: 180px;
    overflow-y: auto;
  }

  .access-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .bkey {
    font-size: 0.7rem;
    background: #f0f0f7;
    border-radius: 4px;
    padding: 0.1rem 0.4rem;
    color: #555;
    word-break: break-all;
    max-width: 55%;
  }

  .none {
    color: #888;
    font-style: italic;
  }

  .btn {
    background: #bae1ff;
    border: 2px solid #333;
    box-shadow: 0 2px 0 #333;
    border-radius: 6px;
    padding: 0.35rem 0.8rem;
    font-family: inherit;
    cursor: pointer;
    text-decoration: none;
    color: #333;
  }

  .btn.wa {
    background: #baffc9;
  }

  .btn.danger {
    background: #ffb3ba;
  }

  .empty {
    text-align: center;
    color: #777;
    padding: 2rem;
  }
</style>