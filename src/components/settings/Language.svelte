<script lang="ts">
  import { translate } from "../../helpers/translate";
  import {
    config,
    updateConfig,
    type Language,
  } from "../../helpers/config.svelte";
  import Select, { Option } from "@smui/select";
  let currentLanguage = $derived(config.language.value);

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

  const handleChangeLanguage = (language: Language) => {
    if (!language) {
      throw new Error("COULD NOT FIND LANGUAGE");
    } else updateConfig({ language });
  };
</script>

<div>
  <span>{translate("interface_language")}</span>
  <Select bind:value={currentLanguage}>
    {#each languages as language}
      <Option
        value={language.value}
        onclick={() => handleChangeLanguage(language)}>{language.value}</Option
      >
    {/each}
  </Select>
</div>

<style lang="scss">
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
