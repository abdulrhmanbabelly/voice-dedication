<script lang="ts">
  import PageHeading from "./PageHeading.svelte";
  import SettingUi from "./SettingUi.svelte";
  import Modal from "./Modal.svelte";
  import SettingsIcon from "./icons/SettingsIcon.svelte";
  import { translate } from "../helpers/translate";
  import { getConfig, updateConfig } from "../helpers/config";
  import CloseIcon from "./icons/CloseIcon.svelte";

  const languages = [
    {
      value: "عربي",
      dir: "rtl",
    },
    {
      value: "English",
      dir: "ltr",
    },
  ];
  let isOpen = $state(false);
  const handleToggleModal = () => (isOpen = !isOpen);

  let language = $state(getConfig().language.value);

  const handleChangeLanguage = (e: any) => {
    const value = e.target.value;
    const lang = languages.find((l) => l.value === value);
    if (!lang) {
      throw new Error("COULD NOT FIND LANGUAGE");
    }
    const config = getConfig();
    updateConfig({
      ...config,
      language: lang,
    });
    setTimeout(() => {
      location.reload();
    }, 200);
  };
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
  <SettingsIcon fill="#000000" />
</div>

<Modal bind:show={isOpen}>
  <div>
    <PageHeading>
      <div
        style="display: flex; align-items: center; justify-content: space-between; padding:10px"
      >
        {translate("settings")}
        <CloseIcon {handleToggleModal} />
      </div>
    </PageHeading>
    <SettingUi
      ><div
        style="display: flex; justify-content: space-between; align-items:center"
      >
        {translate("interface_language")}
        <select onchange={handleChangeLanguage} value={language}>
          {#each languages as language}
            <option value={language.value}>{language.value}</option>
          {/each}
        </select>
      </div></SettingUi
    >
    <SettingUi>{translate("theme")}</SettingUi>
    <SettingUi>{translate("model")}</SettingUi>
  </div></Modal
>

<style lang="scss">
  select {
    padding: 10px;
    border-radius: 20px;
  }

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
