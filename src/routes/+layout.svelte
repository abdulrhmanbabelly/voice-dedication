<script>
  import Sidebar from "../components/Sidebar.svelte";
  import "animate.css";

  let { children } = $props();
</script>

<main>
  <Sidebar />
  {@render children()}
</main>

<style>
  main {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    width: 100vw;
    height: 100vh;
    background: #ecebeb;
  }
  :root {
    --color-primary: #021439; /* Deep navy (menu backgrounds) */
    --color-accent-pink: #ff0054; /* Neon pink (highlights) */
    --color-accent-lime: #c3fb13; /* Neon lime (effects/boosts) */
    --color-warning: #ffd700; /* Racing yellow (rewards/stars) */
    --color-background: #000000; /* Jet black (main background) */
    --color-text: #ffffff; /* Pure white (text/icons) */
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
</style>
