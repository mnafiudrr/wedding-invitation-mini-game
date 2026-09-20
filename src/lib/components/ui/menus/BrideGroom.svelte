<script lang="ts">
  import { COUPLE } from '$lib/data/couple';
  import IdleSprite from '$lib/components/ui/IdleSprite.svelte';
</script>

<div class="menu-content">
  <div class="profile">
    <div class="avatar-frame bride-color">
      <IdleSprite art="women" size={80} zoom={3} />
    </div>
    <h3>{COUPLE.bride.name}</h3>
    <p>Putri dari Bapak {COUPLE.bride.parent.split(' & ')[0]} & Ibu {COUPLE.bride.parent.split(' & ')[1]}</p>
  </div>

  <div class="ampersand">&</div>

  <div class="profile">
    <div class="avatar-frame groom-color">
      <IdleSprite art="men" size={80} zoom={3} />
    </div>
    <h3>{COUPLE.groom.name}</h3>
    <p>Putra dari Bapak {COUPLE.groom.parent.split(' & ')[0]} & Ibu {COUPLE.groom.parent.split(' & ')[1]}</p>
  </div>

  <div class="story">
    <h4>Our Story</h4>
    <p>We met in 2020 and instantly connected over our love for retro games. After 6 wonderful years, we are so excited to tie the knot!</p>
  </div>
</div>

<style>
  .menu-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .profile {
    text-align: center;
  }
  .avatar-frame {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 0 auto 1rem;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #333;
    box-shadow: 3px 3px 0 #333;
  }
  .bride-color { background-color: #ffb8b8; }
  .groom-color { background-color: #b8c0ff; }

  .ampersand {
    font-size: 2.5rem;
    font-weight: bold;
    color: #ffb8b8;
  }

  .story {
    margin-top: 1rem;
    text-align: center;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 12px;
    border: 2px dashed #ccc;
  }
</style>