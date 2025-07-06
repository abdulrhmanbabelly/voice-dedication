<script>
  import { translate } from "../../helpers/translate";
  import CloseIcon from "../icons/CloseIcon.svelte";
  import PageHeading from "./PageHeading.svelte";

  export let show = false;
  export let headingKey = "";
  export let emitCloseIcon = false;
  let visible = false;
  let animatingOut = false;

  $: if (show && !visible) {
    visible = true;
    animatingOut = false;
  }

  const handleAnimationEnd = () => {
    if (animatingOut) {
      visible = false;
      animatingOut = false;
    }
  };

  $: if (!show && visible) {
    animatingOut = true;
  }
</script>

{#if visible}
  <div
    class="overlay {animatingOut ? 'fade-out' : ''}"
    onanimationend={handleAnimationEnd}
  >
    <div class="dialog {animatingOut ? 'fade-out' : ''}">
      <PageHeading>
        <div
          style="display: flex; align-items: center; justify-content: space-between; padding:10px"
        >
          {translate(headingKey)}
          {#if !emitCloseIcon}
            <CloseIcon handleToggleModal={() => (show = !show)} />
          {/if}
        </div>
      </PageHeading>
      <slot></slot>
    </div>
  </div>
{/if}

<style lang="scss">
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease-out forwards;
    &.fade-out {
      animation: fadeOut 0.3s ease-in forwards;
    }
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 900000;
  }

  .dialog {
    background: var(--color-background);
    padding: 1.5rem;
    border-radius: 8px;
    width: 100vw;
    height: 100vh;
    animation: popFade 0.3s ease-out forwards;
    &.fade-out {
      animation: popOut 0.3s ease-in forwards;
    }
    z-index: 1000000000;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes popFade {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes popOut {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(0.9);
      opacity: 0;
    }
  }
</style>
