<script lang="ts">
  import SettingUi from "./SettingUi.svelte";
  import Modal from "../common/Modal.svelte";
  import SettingsIcon from "../icons/SettingsIcon.svelte";
  import { translate } from "../../helpers/translate";
  import DarkMode from "./DarkMode.svelte";
  import { getThemeColors } from "../../helpers/getThemeColors";
  import Language from "./Language.svelte";
  import Model from "./Model.svelte";

  let isOpen = $state(false);
</script>

<div
  tabindex="0"
  role="button"
  aria-labelledby="settings"
  aria-label="settings"
  class="settings-icon"
  onclick={() => (isOpen = true)}
  onkeydown={(e) => {
    if (e.key == "Enter") isOpen = true;
  }}
>
  <SettingsIcon fill={getThemeColors().colorText} />
</div>

<Modal bind:show={isOpen} headingKey="settings">
  <div>
    <SettingUi><Language /></SettingUi>
    <SettingUi>
      <div
        style="display: flex; justify-content: space-between; align-items:center"
      >
        {translate("theme")}
        <DarkMode />
      </div>
    </SettingUi>
    <SettingUi><Model /></SettingUi>
  </div></Modal
>

<style lang="scss">
  .settings-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10000;
    border-radius: 50%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      transform: rotate(90deg);
    }
  }
</style>
