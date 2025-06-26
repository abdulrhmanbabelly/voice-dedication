<!--@component
this is a sidebar
-->
<script lang="ts">
  import SettingsIcon from "./icons/SettingsIcon.svelte";
  import VoiceDedecationIcon from "./icons/VoiceDedecationIcon.svelte";
</script>

<aside>
  <a href="/dedicate">
    <button>
      <VoiceDedecationIcon />
    </button></a
  >
  <a href="/settings"><button><SettingsIcon /></button></a>
</aside>

<style lang="scss">
  a {
    text-decoration: none;
  }
  aside {
    height: 100vh;
    min-width: 50px;
    width: 5vw;
    background-color: var(--color-primary);
    box-shadow: 1px 1px 10px 1px #ccc;
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 20px 0;
      border: none;
      background-color: var(--color-primary);
      border-bottom: 0;
      text-transform: uppercase;
      transition: all 0.3s;
      color: var(--color-text);
      &:hover {
        background-color: var(--color-accent-pink);
        cursor: pointer;
      }
    }
  }
</style>
