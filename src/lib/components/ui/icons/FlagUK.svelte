<script lang="ts">
  let { size = 28 }: { size?: number } = $props();
</script>

<svg
  width={size}
  height={(size * 12) / 20}
  viewBox="0 0 20 12"
  shape-rendering="crispEdges"
  aria-hidden="true"
>
  <rect width="20" height="12" fill="#00247d" />
  <path d="M0 0 L20 12 M20 0 L0 12" stroke="#ffffff" stroke-width="3" />
  <path d="M0 0 L20 12 M20 0 L0 12" stroke="#e7000b" stroke-width="1.5" />
  <rect x="8" width="4" height="12" fill="#ffffff" />
  <rect y="4" width="20" height="4" fill="#ffffff" />
  <rect x="9" width="2" height="12" fill="#e7000b" />
  <rect y="5" width="20" height="2" fill="#e7000b" />
  <rect width="20" height="12" fill="none" stroke="#333" stroke-width="0.4" />
</svg>