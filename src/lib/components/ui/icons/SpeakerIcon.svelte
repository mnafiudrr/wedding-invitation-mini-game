<script lang="ts">
  let { size = 24, muted = false }: { size?: number; muted?: boolean } = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 16 16"
  shape-rendering="crispEdges"
  aria-hidden="true"
>
  <rect x="1" y="6" width="3" height="4" fill="#333" />
  <polygon points="4,6 9,2 9,14 4,10" fill="#333" />
  {#if muted}
    <line x1="10" y1="5" x2="14" y2="11" stroke="#e7000b" stroke-width="2" />
    <line x1="14" y1="5" x2="10" y2="11" stroke="#e7000b" stroke-width="2" />
  {:else}
    <path d="M10 5 q3 3 0 6" stroke="#333" stroke-width="1.6" fill="none" />
    <path d="M12 3 q5 5 0 10" stroke="#333" stroke-width="1.6" fill="none" />
  {/if}
</svg>