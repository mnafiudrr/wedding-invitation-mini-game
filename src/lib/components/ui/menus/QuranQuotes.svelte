<script lang="ts">
  import { dictionaries, locale } from '$lib/i18n';

  const T = $derived($locale === 'id' ? dictionaries.id : dictionaries.en);
</script>

<div class="quotes-container">
  <p class="arabic">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ</p>
  <p class="translation">{T.quran.translation}</p>
  <p class="reference">{T.quran.reference}</p>
</div>

<style>
  .quotes-container {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0;
  }
  
  .arabic {
    font-size: 1.5rem;
    line-height: 2;
    direction: rtl;
    color: #4a4a4a;
  }
  
  .translation {
    font-style: italic;
    color: #666;
    line-height: 1.6;
  }
  
  .reference {
    font-weight: bold;
    color: #ffb8b8;
  }
</style>
