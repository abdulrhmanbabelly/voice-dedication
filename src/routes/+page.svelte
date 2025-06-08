<script lang="ts">
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
      micIcon?.setAttribute("fill", "#261fb3");
      ws.send("start");
      start.play();
    } else {
      micIcon?.setAttribute("fill", "#f3f3f3");
      ws.send("stop");
      stop.play();
    }
  };
</script>

<main>
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
  <div id="mic-status">{isListening ? "...يستمع" : "مطفئ"}</div>
</main>

<style>
  :root {
    --primary-color: #3f38ca;
    --hover-color: #261fb3;
    --text-color: #f3f3f3;
    --border-color: #eee;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  button {
    background: transparent;
    border: none;
    display: flex;
    margin: auto;
  }

  #mic-icon {
    width: 45px;
    height: 45px;
    transition: 0.3s;
    cursor: pointer;
    border-radius: 50%;
    padding: 10px;
    background: var(--primary-color);
    border: 1px solid var(--border-color);
  }

  #mic-status {
    font-weight: bold;
    font-size: smaller;
    text-align: center;
    color: var(--text-color);
  }

  #mic-icon:hover {
    transform: scale(1.1);
    background-color: var(--hover-color);
  }

  main {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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

  .active {
    animation: pulse 0.9s infinite ease-in-out;
    color: var(--hover-color) !important;
    background-color: var(--text-color) !important;
  }

  #mic-btn {
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
  }
</style>
