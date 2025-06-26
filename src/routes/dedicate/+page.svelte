<script lang="ts">
  import { translate } from "../../helpers/translate";

  let isListening = $state(false);
  const start = new Audio("assets/start.mp3"); // Replace with your audio file path
  const stop = new Audio("assets/stop.mp3"); // Replace with your audio file path
  // Establish WebSocket connection
  const ws = new WebSocket("ws://localhost:8765");

  ws.onopen = () => console.log("Connected to WebSocket server");
  ws.onmessage = (event) => console.log("Transcribed Text:", event.data);
  ws.onerror = (error) => console.error("WebSocket Error:", error);
  ws.onclose = () => console.log("WebSocket connection closed");

  const toggleMicrophone = () => {
    isListening = !isListening;
    const micIcon = document.getElementById("mic-icon");
    if (isListening) {
      micIcon?.setAttribute("fill", "#ff0054");
      ws.send("start");
      start.play();
    } else {
      micIcon?.setAttribute("fill", "#f3f3f3");
      ws.send("stop");
      stop.play();
    }
  };
</script>

<div id="mic-btn-wrapper" class="animate__fadeIn">
  <div>
    <button
      onclick={toggleMicrophone}
      aria-label="Toggle Microphone"
      id="mic-btn"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        fill="#FFFFFF"
        id="mic-icon"
        class={isListening ? "active" : ""}
      >
        <path
          d="M192 0C139 0 96 43 96 96v160c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464h-48c-13.3 0-24 10.7-24 24s10.7 24 24 24h144c13.3 0 24-10.7 24-24s-10.7-24-24-24h-48v-33.6c85.8-11.7 152-85.3 152-174.4v-40c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128v-40z"
        />
      </svg>
    </button>
    <div id="mic-status">
      {isListening ? translate("listening") : translate("not_listening")}
    </div>
  </div>
</div>

<style>
  @keyframes fadeInDown {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .animate__fadeIn {
    transition: 0.5s all;
    animation: fadeInDown 0.5s ease-in-out 1 forwards;
  }
  #mic-btn-wrapper {
    min-width: 200px;

    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button {
    background: transparent;
    border: none;
    display: flex;
    margin: auto;
  }

  .active {
    animation: pulse 0.9s infinite ease-in-out;
    color: var(--color-background) !important;
    background-color: var(--color-text) !important;
  }

  #mic-icon {
    width: 100px;
    height: 100px;
    transition: 0.3s;
    cursor: pointer;
    border-radius: 50%;
    padding: 20px;
    background: var(--color-primary);
    border: 1px solid #ccc;
  }

  #mic-status {
    font-weight: bold;
    text-align: center;
  }

  #mic-icon:hover {
    transform: scale(1.1);
    background-color: var(--color-accent-pink);
  }

  #mic-btn {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1.1);
    }
    50% {
      transform: scale(1.15);
    }
  }
</style>
