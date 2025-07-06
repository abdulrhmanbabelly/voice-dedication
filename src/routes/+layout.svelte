<script>
  import Settings from "../components/settings/Settings.svelte";
  let { children } = $props();
  import { createConfig, getConfig } from "../helpers/config";
  createConfig();
  const config = getConfig();
  if (config.language.dir === "rtl") document.body.style.direction = "rtl";
  if (config.darkMode) {
    const rootElement = document.documentElement;
    rootElement.style.setProperty("--color-primary", "#888888");
    rootElement.style.setProperty("--color-accent-pink", " #01161e");
    rootElement.style.setProperty("--color-accent-lime", " #2d3142");
    rootElement.style.setProperty("--color-warning", " #124559");
    rootElement.style.setProperty("--color-background", "#121212");
    rootElement.style.setProperty("--color-text", "#fffaff");
  }
</script>

<div class="layout">
  <Settings />
  <div class="content">{@render children()}</div>
</div>

<style>
  .layout {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    width: 100vw;
    height: 100vh;
    background: var(--color-background);
    color: var(--color-text);
  }
  :root {
    --color-primary: #2d3142; /* Deep navy (menu backgrounds) */
    --color-accent-pink: #01161e; /* Neon pink (highlights) */
    --color-accent-lime: #2d3142; /* Neon lime (effects/boosts) */
    --color-warning: #124559; /* Racing yellow (rewards/stars) */
    --color-background: #ecebeb; /* Jet black (main background) */
    --color-text: #000000; /* Pure white (text/icons) */
  }
  .content {
    width: 100vw;
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
</style>
