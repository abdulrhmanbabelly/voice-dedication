<script lang="ts">
  let { children } = $props();
</script>

<div>{@render children?.()}</div>

<style lang="scss">
  div {
    margin: 20px;
    padding: 20px;
    border-radius: 20px;
    background-color: var(--color-warning);
    color: var(--color-text);
  }
</style>
