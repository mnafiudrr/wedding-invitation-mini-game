<script lang="ts">
  let { data, children } = $props();

  const username = $derived(data.user?.username ?? '');
</script>

<div class="admin-shell">
  <nav class="admin-nav">
    <span class="brand">Admin{username ? ` — ${username}` : ''}</span>
    <div class="links">
      <a href="/admin/invitations">Invitations</a>
      <a href="/admin/rsvps">RSVPs</a>
      <a href="/admin/messages">Messages</a>
      <a href="/admin/activity">Activity</a>
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
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.6rem;
    padding: 0.7rem 1rem;
    padding-bottom: calc(0.7rem + env(safe-area-inset-top, 0px));
    background: var(--bg-sky);
    border-bottom: 3px solid #333;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .brand {
    font-weight: bold;
    font-size: clamp(0.9rem, 4vw, 1rem);
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem;
  }

  .links a {
    color: #333;
    text-decoration: none;
    font-weight: bold;
    padding: 0.35rem 0.4rem;
    border-radius: 6px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }

  .links a:hover {
    text-decoration: underline;
    background: rgba(255, 255, 255, 0.5);
  }

  .logout-btn {
    background: #fff;
    border: 2px solid #333;
    box-shadow: 0 2px 0 #333;
    border-radius: 6px;
    padding: 0.45rem 0.8rem;
    min-height: 40px;
    font-family: inherit;
    cursor: pointer;
  }

  .logout-btn:active {
    box-shadow: none;
    transform: translateY(2px);
  }

  .admin-main {
    padding: 1.25rem;
    padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
    max-width: 900px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    .admin-main {
      padding: 1.5rem;
    }
  }
</style>
