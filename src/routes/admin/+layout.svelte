<script lang="ts">
  let { data, children } = $props();

  const username = $derived(data.user?.username ?? '');
</script>

<div class="admin-shell">
  <nav class="admin-nav">
    <span class="brand">Admin{username ? ` — ${username}` : ''}</span>
    <div class="links">
      <a href="/admin/rsvps">RSVPs</a>
      <a href="/admin/messages">Messages</a>
      <form method="POST" action="?/logout">
        <button type="submit" class="logout-btn">Logout</button>
      </form>
    </div>
  </nav>
  <main class="admin-main">
    {@render children()}
  </main>
</div>

<style>
  .admin-shell {
    min-height: 100vh;
    background: #f7f7fb;
    color: #333;
  }

  .admin-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1.2rem;
    background: var(--bg-sky);
    border-bottom: 3px solid #333;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .brand {
    font-weight: bold;
  }

  .links {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .links a {
    color: #333;
    text-decoration: none;
    font-weight: bold;
  }

  .links a:hover {
    text-decoration: underline;
  }

  .logout-btn {
    background: #fff;
    border: 2px solid #333;
    box-shadow: 0 2px 0 #333;
    border-radius: 6px;
    padding: 0.3rem 0.8rem;
    font-family: inherit;
    cursor: pointer;
  }

  .logout-btn:active {
    box-shadow: none;
    transform: translateY(2px);
  }

  .admin-main {
    padding: 1.5rem;
    max-width: 900px;
    margin: 0 auto;
  }
</style>
