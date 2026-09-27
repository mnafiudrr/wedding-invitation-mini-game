<script lang="ts">
  let { size = 24 }: { size?: number } = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 16 16"
  shape-rendering="crispEdges"
  aria-hidden="true"
>
  <rect x="1" y="6" width="14" height="8" fill="#ffffff" stroke="#333" stroke-width="1.4" />
  <polygon points="0,6 8,0 16,6" fill="#d9822b" stroke="#333" stroke-width="1.4" stroke-linejoin="round" />
  <rect x="6.5" y="9" width="3" height="5" fill="#8b5a2b" />
</svg>