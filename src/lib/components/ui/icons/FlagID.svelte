<script lang="ts">
  let { size = 28 }: { size?: number } = $props();
</script>

<svg
  width={size}
  height={(size * 8) / 12}
  viewBox="0 0 12 8"
  shape-rendering="crispEdges"
  aria-hidden="true"
>
  <rect width="12" height="4" fill="#e7000b" />
  <rect y="4" width="12" height="4" fill="#ffffff" />
  <rect width="12" height="8" fill="none" stroke="#333" stroke-width="0.4" />
</svg>