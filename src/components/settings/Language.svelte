<script lang="ts">
  import { translate } from "../../helpers/translate";
  import { getConfig, updateConfig } from "../../helpers/config";

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

  let currentLanguage = $state(getConfig().language.value);

  const handleChangeLanguage = (lang: { value: string; dir: string }) => {
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

<div style="display: flex; justify-content: space-between; align-items:center">
  {translate("interface_language")}
  <div class="select">
    {currentLanguage}
    <span class="arrow">{"▼"}</span>
    <div class="dropdown">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      {#each languages as language}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          class={`option ${currentLanguage == language.value ? "selected" : ""}`}
          onclick={() => handleChangeLanguage(language)}
        >
          {language.value}
          <span>
            {currentLanguage == language.value ? "✅" : ""}
          </span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .select {
    position: relative;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 100px;
    border-radius: 10px;
    border: 1px solid #ccc;
    .arrow {
      transition: 0.3s;
    }
    &:hover {
      transition: 0.3s;

      .arrow {
        transform: rotate(180deg);
      }
      .dropdown {
        opacity: 1;
        display: block;
      }
    }
    .dropdown {
      top: 100%;
      left: 0;
      border-radius: 10px;
      overflow: hidden;
      opacity: 0;
      transition: 0.3s;
      position: absolute;
      display: none;
      z-index: 100000;

      .option {
        padding: 10px 20px;
        color: #fff;
        background-color: #000;
        min-width: 120px;
        transition: 0.3s;
        display: flex;
        justify-content: space-between;
        &:hover {
          color: #fff;
          background-color: var(--color-primary);
          cursor: pointer;
        }
      }
    }
  }
  .selected {
    background-color: var(--color-primary) !important;
    color: #fff;
  }
</style>
