<!-- From Uiverse.io by Tsiangana -->
<script lang="ts">
  import { getConfig, updateConfig } from "../../helpers/config";

  let darkMode = $state(getConfig().darkMode);
  const handleToggleDarkMode = (e: any) => {
    const value = e.target.checked;
    const config = getConfig();
    updateConfig({
      ...config,
      darkMode: value,
    });
  };
</script>

<label class="ios-checkbox red">
  <input type="checkbox" onchange={handleToggleDarkMode} checked={darkMode} />
  <div class="checkbox-wrapper">
    <div class="checkbox-bg"></div>
    <svg class="checkbox-icon" viewBox="0 0 24 24" fill="none">
      <path
        class="check-path"
        d="M4 12L10 18L20 6"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  </div>
</label>

<style lang="scss">
  /* From Uiverse.io by Tsiangana */
  .checkbox-container {
    display: flex;
    gap: 20px;
    padding: 10px;
    background: #f8fafc;
    border-radius: 12px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.05);
  }

  .ios-checkbox {
    --checkbox-size: 28px;
    --color-primary: #3b82f6;
    --checkbox-bg: #dbeafe;
    --color-primary: #93c5fd;

    position: relative;
    display: inline-block;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .ios-checkbox input {
    display: none;
  }

  .checkbox-wrapper {
    position: relative;
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    border-radius: 8px;
    transition: transform 0.2s ease;
  }

  .checkbox-bg {
    position: absolute;
    inset: 0;
    border-radius: 8px;
    border: 2px solid var(--color-primary);
    background: white;
    transition: all 0.2s ease;
  }

  .checkbox-icon {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 80%;
    height: 80%;
    color: white;
    transform: scale(0);
    transition: all 0.2s ease;
  }

  .check-path {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    transition: stroke-dashoffset 0.3s ease 0.1s;
  }

  /* Checked State */
  .ios-checkbox input:checked + .checkbox-wrapper .checkbox-bg {
    background: var(--color-primary);
    border-color: var(--color-primary);
  }

  .ios-checkbox input:checked + .checkbox-wrapper .checkbox-icon {
    transform: scale(1);
  }

  .ios-checkbox input:checked + .checkbox-wrapper .check-path {
    stroke-dashoffset: 0;
  }

  /* Hover Effects */
  .ios-checkbox:hover .checkbox-wrapper {
    transform: scale(1.05);
  }

  /* Active Animation */
  .ios-checkbox:active .checkbox-wrapper {
    transform: scale(0.95);
  }

  /* Focus Styles */
  .ios-checkbox input:focus + .checkbox-wrapper .checkbox-bg {
    box-shadow: 0 0 0 4px var(--color-primary);
  }

  /* Animation */
  @keyframes bounce {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  .ios-checkbox input:checked + .checkbox-wrapper {
    animation: bounce 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
