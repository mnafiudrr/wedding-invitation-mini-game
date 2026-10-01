<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { dictionaries, locale } from '$lib/i18n';

  const T = $derived($locale === 'id' ? dictionaries.id : dictionaries.en);

  // Invitation code comes from the ?to= query param; if absent, randomize one.
  // It is auto-submitted as a hidden field, so the guest never sees/edits it.
  const inviteCode = $derived(
    $page.data.inviteCode || 'guest-' + Math.random().toString(36).slice(2, 10)
  );

  let submitting = $state(false);
  let success = $state(false);
  let errorMsg = $state('');
  let attending = $state('true');
  let headcount = $state(1);

  function onAttendingChange() {
    headcount = attending === 'true' ? 1 : 0;
  }

  const handleSubmit: SubmitFunction = () => {
    submitting = true;
    errorMsg = '';
    return async ({ result, update }) => {
      submitting = false;
      if (result.type === 'success') {
        success = true;
      } else if (result.type === 'failure' && result.data?.error) {
        errorMsg = String(result.data.error);
      } else {
        errorMsg = T.rsvp.errorFallback;
      }
      update({ reset: false });
    };
  }
</script>

<div class="rsvp-container">
  {#if success}
    <div class="success-message">
      <h3>{T.rsvp.thankYou}</h3>
      <p>{T.rsvp.saved}</p>
    </div>
  {:else}
    <p>{T.rsvp.intro}</p>
    
    {#if errorMsg}
      <div class="error">{errorMsg}</div>
    {/if}

    <form method="POST" action="?/rsvp" use:enhance={handleSubmit}>
      <input type="hidden" name="inviteCode" value={inviteCode} />
      
      <div class="form-group">
        <label for="name">{T.rsvp.name}</label>
        <input type="text" id="name" name="name" required placeholder={T.rsvp.namePlaceholder} />
      </div>
      
<fieldset class="form-group borderless">
        <legend>{T.rsvp.attend}</legend>
        <div class="radio-group">
          <label><input type="radio" name="isAttending" value="true" bind:group={attending} onchange={onAttendingChange} /> {T.rsvp.yes}</label>
          <label><input type="radio" name="isAttending" value="false" bind:group={attending} onchange={onAttendingChange} /> {T.rsvp.no}</label>
        </div>
      </fieldset>

      {#if attending === 'true'}
        <div class="form-group">
          <label for="headcount">{T.rsvp.headcount}</label>
          <input type="number" id="headcount" bind:value={headcount} min="1" max="5" required />
        </div>
      {/if}
      <input type="hidden" name="headcount" value={attending === 'true' ? headcount : 0} />
      
      <button type="submit" class="submit-btn" disabled={submitting}>
        {submitting ? T.rsvp.submitting : T.rsvp.submit}
      </button>
    </form>
  {/if}
</div>

<style>
  .rsvp-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    text-align: left;
  }
  
  label, legend {
    font-weight: bold;
    color: #333;
  }

  .borderless {
    border: none;
    padding: 0;
    margin: 0;
    margin-bottom: 1rem;
  }
  
  input[type="text"], input[type="number"] {
    padding: 0.8rem;
    border: 2px solid #ccc;
    border-radius: 8px;
    font-family: inherit;
  }
  
  .radio-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .submit-btn {
    background: #bae1ff;
    border: 3px solid #333;
    padding: 1rem;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    font-size: 1.1rem;
  }
  
  .submit-btn:disabled {
    opacity: 0.7;
  }
  
  .error {
    color: red;
    font-weight: bold;
    text-align: center;
  }
  
  .success-message {
    text-align: center;
    padding: 2rem;
    background: #baffc9;
    border-radius: 12px;
    border: 2px dashed #333;
  }
</style>
