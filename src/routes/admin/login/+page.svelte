<script lang="ts">
  import { enhance } from '$app/forms';

  let submitting = $state(false);
  let errorMsg = $state('');
</script>

<div class="login-card">
  <h1>Admin Login</h1>

  {#if errorMsg}
    <div class="error">{errorMsg}</div>
  {/if}

  <form method="POST" action="?/login" use:enhance={() => {
    submitting = true;
    errorMsg = '';
    return async ({ result, update }) => {
      submitting = false;
      if (result.type === 'failure' && result.data?.error) {
        errorMsg = String(result.data.error);
      }
      update({ reset: false });
    };
  }}>
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" required autocomplete="username" />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required autocomplete="current-password" />
    </div>

    <button type="submit" class="submit-btn" disabled={submitting}>
      {submitting ? 'Logging in...' : 'Log In'}
    </button>
  </form>
</div>

<style>
  .login-card {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;
    max-width: 360px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 1.4rem;
    text-align: center;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  label {
    font-weight: bold;
    color: #333;
  }

  input {
    padding: 0.8rem;
    border: 2px solid #333;
    border-radius: 8px;
    font-family: inherit;
  }

  .submit-btn {
    width: 100%;
    background: #bae1ff;
    border: 3px solid #333;
    box-shadow: 0 4px 0 #333;
    padding: 0.9rem;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
  }

  .submit-btn:active {
    box-shadow: 0 0 0 #333;
    transform: translateY(4px);
  }

  .submit-btn:disabled {
    opacity: 0.7;
  }

  .error {
    color: #c0392b;
    font-weight: bold;
    text-align: center;
    padding: 0.6rem;
    border: 2px dashed #c0392b;
    border-radius: 8px;
    background: #fdecea;
  }
</style>
