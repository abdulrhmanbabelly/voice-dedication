<script lang="ts">
  let { children } = $props();
</script>

<h1>{@render children?.()}</h1>

<style>
  h1 {
    padding: 10px 20px;
    font-size: 40px;
    text-transform: uppercase;
  }
</style>
