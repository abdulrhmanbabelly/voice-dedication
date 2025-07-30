<script lang="ts">
  import { mdiCog } from "@mdi/js";
  import IconButton, { Icon } from "@smui/icon-button";
  let { open = $bindable() } = $props();
</script>

<div
  class="settings-icon"
  tabindex="0"
  role="button"
  aria-labelledby="settings"
  aria-label="settings"
  onclick={() => (open = true)}
  onkeydown={(e: any) => {
    if (e.key == "Enter") open = true;
  }}
>
  <IconButton>
    <Icon tag="svg" viewBox="0 0 24 24">
      <path fill="currentColor" class="icon_path" d={mdiCog} />
    </Icon>
  </IconButton>
</div>

<style lang="scss">
  .settings-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    border-radius: 50%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    & .icon_path {
      transform-origin: center;
      transition: 0.3s;
    }
    &:hover {
      & .icon_path {
        transform: rotate(90deg);
      }
    }
  }
</style>
