<script lang="ts">
  import { getThemeColors } from "../../helpers/getThemeColors";

  let { handleToggleModal } = $props();
</script>

<div
  role="button"
  tabindex={1}
  class="close-icon"
  onkeydown={(e) => e.key == "Enter" && handleToggleModal()}
  onclick={handleToggleModal}
>
  <svg
    width="30px"
    height="30px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill={getThemeColors().colorText}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
    />
  </svg>
</div>

<style lang="scss">
  .close-icon {
    transition: 0.3s;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    cursor: pointer;
    &:hover {
      background: #000;
    }
    &:hover path {
      fill: #ffffff !important;
      stroke: #ffffff;
    }
  }
</style>
