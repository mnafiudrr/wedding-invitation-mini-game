<script lang="ts">
  import { COUPLE } from '$lib/data/couple';
  import IdleSprite from '$lib/components/ui/IdleSprite.svelte';
  import { dictionaries, locale } from '$lib/i18n';

  const T = $derived($locale === 'id' ? dictionaries.id : dictionaries.en);

  function parents(parent: string) {
    const [a, b] = parent.split(' & ');
    return { a, b };
  }
</script>

<div class="menu-content">
  <div class="profile">
    <div class="avatar-frame bride-color">
      <IdleSprite art="women" size={100} zoom={2} />
    </div>
    <h3>{COUPLE.bride.name}</h3>
    <p>{T.brideGroom.brideParent.replace('{0}', parents(COUPLE.bride.parent).a).replace('{1}', parents(COUPLE.bride.parent).b)}</p>
  </div>

  <div class="ampersand">&</div>

  <div class="profile">
    <div class="avatar-frame groom-color">
      <IdleSprite art="men" size={100} zoom={2} />
    </div>
    <h3>{COUPLE.groom.name}</h3>
    <p>{T.brideGroom.groomParent.replace('{0}', parents(COUPLE.groom.parent).a).replace('{1}', parents(COUPLE.groom.parent).b)}</p>
  </div>

  <div class="story">
    <h4>{T.brideGroom.storyTitle}</h4>
    <p>{T.brideGroom.storyBody}</p>
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