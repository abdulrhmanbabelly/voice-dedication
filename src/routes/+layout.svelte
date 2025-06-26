<script>
  import Settings from "../components/Settings.svelte";
  let { children } = $props();
  import { createConfig, getConfig } from "../helpers/config";
  createConfig();
  const config = getConfig();
  if (config.language.dir === "rtl") document.body.style.direction = "rtl";
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
    background: #ecebeb;
  }
  :root {
    --color-primary: #2d3142; /* Deep navy (menu backgrounds) */
    --color-accent-pink: #01161e; /* Neon pink (highlights) */
    --color-accent-lime: #2d3142; /* Neon lime (effects/boosts) */
    --color-warning: #124559; /* Racing yellow (rewards/stars) */
    --color-background: #000000; /* Jet black (main background) */
    --color-text: #fffaff; /* Pure white (text/icons) */
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
