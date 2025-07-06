<script lang="ts">
  let { children } = $props();
</script>

<div>{@render children?.()}</div>

<style lang="scss">
  div {
    margin: 20px;
    padding: 20px;
    border-radius: 20px;
    border: 1px solid #ccc;
    transition: 0.3s;
  }
</style>
