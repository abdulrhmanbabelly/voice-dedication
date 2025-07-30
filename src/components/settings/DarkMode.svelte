<!-- From Uiverse.io by Tsiangana -->
<script lang="ts">
  import { config, updateConfig } from "../../helpers/config.svelte";
  import { translate } from "../../helpers/translate";
  import Checkbox from "@smui/checkbox";
  let darkMode = $derived(config.darkMode);

  const handleToggleDarkMode = (e: any) => {
    const value = e.target.checked;
    updateConfig({
      darkMode: value,
    });
  };
</script>

<div style="display: flex; justify-content: space-between; align-items: center">
  <span>{translate("theme")}</span>
  <Checkbox bind:checked={darkMode} onclick={handleToggleDarkMode} />
</div>

<style lang="scss">
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
