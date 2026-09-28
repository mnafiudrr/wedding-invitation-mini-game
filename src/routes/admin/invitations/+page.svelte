<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import type { SubmitFunction } from '@sveltejs/kit';

  let { data } = $props();

  let submitting = $state(false);
  let errorMsg = $state('');
  let expanded = $state<string[]>([]);
  let calling = $state('Bapak');
  let callingCustom = $state('');
  let editingTemplate = $state(false);
  // svelte-ignore state_referenced_locally — intentional: the draft starts from the saved template
  let templateDraft = $state(data.waTemplate);

  function toggleAccesses(id: string) {
    expanded = expanded.includes(id) ? expanded.filter((x) => x !== id) : [...expanded, id];
  }

  function submitCalling(): string {
    return calling === 'fill' ? callingCustom.trim().slice(0, 20) : calling;
  }

  function openTemplateEditor() {
    templateDraft = data.waTemplate;
    editingTemplate = true;
  }

  const saveTemplateHandler: SubmitFunction = () => {
    submitting = true;
    return async ({ result, update }) => {
      submitting = false;
      if (result.type === 'success') {
        editingTemplate = false;
        await invalidateAll();
      }
      update({ reset: false });
    };
  };

  // Simplified mustache template — uses the editable template from settings.
  function whatsappUrl(phone: string, name: string, code: string, calling: string): string {
    const normalized = phone.replace(/[^\d]/g, '').replace(/^0/, '62');
    const link = `${data.baseUrl}/?to=${code}`;
    const message = data.waTemplate
      .replaceAll('{{calling}}', calling)
      .replaceAll('{{name}}', name)
      .replaceAll('{{link}}', link);
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

<div class="template-section">
  <div class="template-head">
    <strong>WhatsApp Template</strong>
    {#if !editingTemplate}
      <button class="btn" onclick={openTemplateEditor}>Edit Template</button>
    {/if}
  </div>
  {#if editingTemplate}
    <form method="POST" action="?/saveTemplate" use:enhance={saveTemplateHandler}>
      <textarea name="template" rows="8" bind:value={templateDraft}></textarea>
      <p class="hint">Placeholders: {'{{calling}}'} · {'{{name}}'} · {'{{link}}'}</p>
      <div class="template-actions">
        <button type="submit" class="btn wa" disabled={submitting}>Save Template</button>
        <button type="button" class="btn" onclick={() => (editingTemplate = false)}>Cancel</button>
      </div>
    </form>
  {:else}
    <pre class="template-preview">{data.waTemplate}</pre>
  {/if}
</div>

<form method="POST" action="?/create" use:enhance={createHandler} class="create-form">
  <input type="hidden" name="calling" value={submitCalling()} />
  <input type="text" name="name" placeholder="Guest name (e.g. Budi Santoso)" required />
  <input type="tel" name="phone" placeholder="Phone / WhatsApp number (e.g. 081234567890)" required />
  <select name="callingSelect" bind:value={calling}>
    {#each data.callingOptions as opt (opt)}
      <option value={opt}>{opt}</option>
    {/each}
    <option value="fill">fill</option>
  </select>
  {#if calling === 'fill'}
    <input type="text" placeholder="Custom calling (e.g. Kakak)" bind:value={callingCustom} />
  {/if}
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
          <strong>{row.calling} {row.name}</strong>
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
            href={whatsappUrl(row.phone, row.name, row.code, row.calling)}
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

  .template-section {
    background: #fdfbf7;
    border: 3px solid #333;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .template-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  textarea {
    width: 100%;
    padding: 0.7rem;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.9rem;
    line-height: 1.5;
    resize: vertical;
    box-sizing: border-box;
  }

  .hint {
    margin: 0.4rem 0 0;
    color: #777;
    font-size: 0.8rem;
  }

  .template-actions {
    display: flex;
    gap: 0.6rem;
    margin-top: 0.6rem;
  }

  .template-preview {
    margin: 0;
    white-space: pre-wrap;
    color: #555;
    font-family: inherit;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  input {
    padding: 0.7rem;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
  }

  select {
    padding: 0.7rem;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    background: #fff;
  }

  .create-form button[type='submit'] {
    padding: 0.7rem 1.1rem;
    min-height: 46px;
    background: #baffc9;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
    font-weight: bold;
    cursor: pointer;
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
    padding: 0.5rem 0.85rem;
    min-height: 42px;
    font-family: inherit;
    cursor: pointer;
    text-decoration: none;
    color: #333;
    display: inline-flex;
    align-items: center;
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