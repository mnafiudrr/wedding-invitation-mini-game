<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';

  let submitting = $state(false);
  let success = $state(false);
  let errorMsg = $state('');

  const handleSubmit: SubmitFunction = () => {
    submitting = true;
    errorMsg = '';
    return async ({ result, update }) => {
      submitting = false;
      if (result.type === 'success') {
        success = true;
      } else {
        errorMsg = result.data?.error || 'Something went wrong.';
      }
      update({ reset: false });
    };
  }
</script>

<div class="rsvp-container">
  {#if success}
    <div class="success-message">
      <h3>Thank you!</h3>
      <p>Your RSVP has been saved.</p>
    </div>
  {:else}
    <p>Please confirm your attendance by filling out the form below.</p>
    
    {#if errorMsg}
      <div class="error">{errorMsg}</div>
    {/if}

    <form method="POST" action="?/rsvp" use:enhance={handleSubmit}>
      <div class="form-group">
        <label for="inviteCode">Invitation Code</label>
        <input type="text" id="inviteCode" name="inviteCode" required placeholder="e.g. VIP123" />
      </div>
      
      <div class="form-group">
        <label for="name">Your Name</label>
        <input type="text" id="name" name="name" required placeholder="John Doe" />
      </div>
      
      <fieldset class="form-group borderless">
        <legend>Will you attend?</legend>
        <div class="radio-group">
          <label><input type="radio" name="isAttending" value="true" checked /> Yes</label>
          <label><input type="radio" name="isAttending" value="false" /> No</label>
        </div>
      </fieldset>
      
      <div class="form-group">
        <label for="headcount">Number of Guests</label>
        <input type="number" id="headcount" name="headcount" min="1" max="5" value="1" required />
      </div>
      
      <button type="submit" class="submit-btn" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit RSVP'}
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
  }
  
  input[type="text"], input[type="number"] {
    padding: 0.8rem;
    border: 2px solid #ccc;
    border-radius: 8px;
    font-family: inherit;
  }
  
  .radio-group {
    display: flex;
    gap: 1rem;
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
