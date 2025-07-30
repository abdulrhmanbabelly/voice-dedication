<script>
  import Button from "@smui/button";
  import { translate } from "../../helpers/translate";
  import { config, modelDialogOpen } from "../../helpers/config.svelte";
  const modelName = $derived(config.model);
  const handleToggleModal = () =>
    (modelDialogOpen.isOpen = !modelDialogOpen.isOpen);
</script>

<div class="setting">
  {translate("model")}
  <Button
    tabindex="0"
    role="button"
    aria-labelledby="model"
    aria-label="model"
    onclick={handleToggleModal}
  >
    {modelName == "" ? translate("none") : modelName}
  </Button>
</div>

<style lang="scss">
  .setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
