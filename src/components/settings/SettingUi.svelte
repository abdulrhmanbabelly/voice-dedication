<script lang="ts">
  let { children } = $props();
  import Card, { Content } from "@smui/card";
</script>

<Card variant="outlined" style="margin-bottom : 20px">
  <Content>
    {@render children?.()}
  </Content>
</Card>

<style lang="scss">
</style>
