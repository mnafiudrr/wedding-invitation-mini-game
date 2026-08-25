<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import type { SubmitFunction } from '@sveltejs/kit';

  let { data } = $props();

  let submittingIds = $state<string[]>([]);

  function makeHandler(id: string): SubmitFunction {
    return () => {
      submittingIds = [...submittingIds, id];
      return async ({ result, update }) => {
        submittingIds = submittingIds.filter((x) => x !== id);
        if (result.type === 'success') await invalidateAll();
        update({ reset: false });
      };
    };
  }
</script>

<h2>Messages</h2>

{#if data.rows.length === 0}
  <p class="empty">No messages yet.</p>
{:else}
  <div class="list">
    {#each data.rows as row (row.id)}
      <div class="card" class:pending={!row.isApproved}>
        <div class="head">
          <strong>{row.guestName}</strong>
          <span class="badge" class:approved={row.isApproved}>
            {row.isApproved ? 'Approved' : 'Pending'}
          </span>
        </div>
        <p class="body">{row.message}</p>
        <div class="foot">
          <span class="date">{new Date(row.createdAt).toLocaleString()}</span>
          <div class="actions">
            <form
              method="POST"
              action="?/toggleApproval"
              use:enhance={makeHandler(row.id)}
            >
              <input type="hidden" name="id" value={row.id} />
              <button type="submit" disabled={submittingIds.includes(row.id)}>
                {row.isApproved ? 'Unapprove' : 'Approve'}
              </button>
            </form>
            <form method="POST" action="?/deleteMessage" use:enhance={makeHandler(row.id)}>
              <input type="hidden" name="id" value={row.id} />
              <button type="submit" class="danger" disabled={submittingIds.includes(row.id)}>Delete</button>
            </form>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  h2 { margin-bottom: 1rem; }

  .empty {
    text-align: center;
    color: #777;
    padding: 2rem;
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

  .card.pending { opacity: 0.85; background: #fffbe8; }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.4rem;
  }

  .badge {
    font-size: 0.75rem;
    font-weight: bold;
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    border: 2px solid #333;
    background: #baffc9;
  }

  .badge:not(.approved) {
    background: #ffdfba;
  }

  .body {
    line-height: 1.5;
    white-space: pre-wrap;
  }

  .foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .date {
    color: #888;
    font-size: 0.8rem;
  }

  .actions {
    display: flex;
    gap: 0.6rem;
  }

  button {
    background: #bae1ff;
    border: 2px solid #333;
    box-shadow: 0 2px 0 #333;
    border-radius: 6px;
    padding: 0.35rem 0.8rem;
    font-family: inherit;
    cursor: pointer;
  }

  button:disabled { opacity: 0.6; }

  button.danger {
    background: #ffb3ba;
  }
</style>
