<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import type { SubmitFunction } from '@sveltejs/kit';

  let submitting = $state(false);
  
  // Get messages passed from page load
  let messages = $derived($page.data.messages || []);

  const handleSubmit: SubmitFunction = () => {
    submitting = true;
    return async ({ update }) => {
      submitting = false;
      update();
    };
  }
</script>

<div class="messages-container">
  <div class="message-list">
    {#if messages.length === 0}
      <p class="empty">No messages yet. Be the first to leave a wish!</p>
    {:else}
      {#each messages as msg}
        <div class="message-card">
          <h4>{msg.guestName}</h4>
          <p>{msg.message}</p>
        </div>
      {/each}
    {/if}
  </div>

  <div class="message-form-container">
    <form method="POST" action="?/message" use:enhance={handleSubmit}>
      <input type="text" name="guestName" placeholder="Your Name" required />
      <textarea name="message" placeholder="Leave a wish for the bride and groom..." required rows="3"></textarea>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  </div>
</div>

<style>
  .messages-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 60vh;
  }
  
  .message-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-right: 0.5rem;
  }
  
  .empty {
    text-align: center;
    color: #888;
    font-style: italic;
    margin: auto;
  }
  
  .message-card {
    background: #fdfbf7;
    border: 2px solid #e0dcd3;
    padding: 1rem;
    border-radius: 12px;
  }
  
  .message-card h4 {
    margin: 0 0 0.5rem 0;
    color: #ffb8b8;
  }
  
  .message-card p {
    margin: 0;
    line-height: 1.4;
  }
  
  .message-form-container form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: #e6b3ff;
    padding: 1rem;
    border-radius: 12px;
    border: 3px solid #333;
  }
  
  input, textarea {
    padding: 0.8rem;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
  }
  
  button {
    background: #fff;
    border: 3px solid #333;
    padding: 0.8rem;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }
</style>
