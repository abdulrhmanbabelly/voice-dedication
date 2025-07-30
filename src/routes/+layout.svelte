<script>
  // @ts-nocheck

  import Settings from "../components/settings/Settings.svelte";
  let { children } = $props();
  import { config, createConfig, getConfig } from "../helpers/config.svelte";
  createConfig();
  $effect(() => {
    document.body.style.direction = config.language.dir;
    document.body.dir = config.language.dir;
    const link = document.getElementById("smui-theme");
    link.href = config.darkMode ? "/smui-dark.css" : "/smui.css";
  });
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
