<script lang="ts">
  import { getConfig, updateConfig } from "../../helpers/config";
  import { translate } from "../../helpers/translate";
  import Modal from "../common/Modal.svelte";
  import {
    BaseDirectory,
    mkdir,
    readDir,
    writeFile,
  } from "@tauri-apps/plugin-fs";
  import { invoke } from "@tauri-apps/api/core";
  import { fetch } from "@tauri-apps/plugin-http";
  import { appDataDir } from "@tauri-apps/api/path";

  type modelType = {
    modelName: string;
    downloadHref: string;
    size: string;
    wordErrorRateSlashSpeed: string;
    isDownloaded: boolean;
  };

  const models: modelType[] = $state([]);
  const modelName = $state(getConfig().model);
  let downloadAborted = false;
  let isOpen = $state(false);
  let downloading = $state(false);
  let progress = $state(0);
  let currentModelName = $state("");
  let showDownloadModal = $state(false);
  const getDownloadedModels = async () => {
    const baseDir = await appDataDir();
    const extractPath = `${baseDir}/models/extracted`;
    const downloadedModels = await readDir(extractPath);
    return downloadedModels;
  };

  const handleChooseModel = (modelName: string) => {
    const config = getConfig();
    updateConfig({
      ...config,
      model: modelName,
    });
  };
  const handleToggleModal = () => (isOpen = !isOpen);

  fetch("https://alphacephei.com/vosk/models", { method: "GET" }).then(
    async (data: any) => {
      const downloadedModels = await getDownloadedModels();
      const domParser = new DOMParser();
      const htmlText = await data.text();
      const html = domParser.parseFromString(htmlText, "text/html");
      const table = html.getElementsByTagName("table")[0];
      const tableBody = table?.lastElementChild;
      for (let i = 0; i < (tableBody?.children.length ?? 0); i++) {
        const child = tableBody?.children.item(i);
        const modelName: string = child?.children[0].children[0]
          .textContent as string;
        const downloadHref: string =
          child?.children[0].children[0].getAttribute("href") as string;
        const size: string = child?.children[1].textContent as string;
        const wordErrorRateSlashSpeed: string = child?.children[2]
          .textContent as string;
        if (size.length > 1)
          models.push({
            modelName,
            downloadHref,
            size,
            wordErrorRateSlashSpeed,
            isDownloaded: Boolean(
              downloadedModels.find(({ name }) => name == modelName)
            ),
          });
      }
    }
  );

  const handleDownloadModel = async (downloadHref: string) => {
    downloading = true;
    progress = 0;
    showDownloadModal = true;
    currentModelName = downloadHref.split("/").pop() || "model.zip";

    try {
      const response = await fetch(downloadHref);
      if (!response.ok || !response.body) throw new Error("Download failed");

      const contentLength = response.headers.get("Content-Length");
      if (!contentLength) throw new Error("Content-Length header missing");

      const total = parseInt(contentLength, 10);
      let loaded = 0;
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (downloadAborted) await reader.cancel();

        if (value) {
          chunks.push(value);
          loaded += value.length;
          progress = parseFloat(((loaded / total) * 100).toFixed(2));
        }
      }

      const length = chunks.reduce((acc, val) => acc + val.length, 0);
      const uint8Array = new Uint8Array(length);
      let offset = 0;
      for (const chunk of chunks) {
        uint8Array.set(chunk, offset);
        offset += chunk.length;
      }

      await mkdir("models", {
        baseDir: BaseDirectory.AppData,
        recursive: true,
      });

      const baseDir = await appDataDir();

      const zipPath = `${baseDir}/models/${currentModelName}`;
      const extractPath = `${baseDir}/models/extracted`;
      await writeFile(zipPath, uint8Array, {
        baseDir: BaseDirectory.AppData,
      });

      await invoke("unzip_file", {
        file: zipPath,
        destination: extractPath,
      });

      alert(
        `Model "${currentModelName}" downloaded and extracted successfully!`
      );
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Download aborted");
      } else {
        console.error("Download or unzip failed:", error);
        alert(`Error: ${error.message || error}`);
      }
    } finally {
      downloading = false;
      showDownloadModal = false;
    }
  };

  const cancelDownload = () => {
    downloadAborted = true;
    setTimeout(() => {
      downloadAborted = false;
    }, 200);
    downloading = false;
    setTimeout(() => {
      location.reload();
    }, 200);
  };
</script>

<div class="setting">
  {translate("model")}
  <span
    tabindex="0"
    role="button"
    aria-labelledby="model"
    aria-label="model"
    class="settings-icon"
    onkeydown={(e) => e.key == "Enter" && handleToggleModal()}
    onclick={handleToggleModal}
  >
    {modelName == "" ? translate("none") : modelName}
  </span>

  <Modal bind:show={isOpen} headingKey="model">
    <div class="models">
      <div class="table">
        <div class="row tableHead">
          <div style="width : 14%" class="data">number</div>
          <div style="width : 26%" class="data">model name</div>
          <div style="width : 20%" class="data">size</div>
          <div style="width : 20%" class="data">download</div>
          <div style="width : 20%" class="data">choose model</div>
        </div>
        <div class="tableBody">
          {#each models as model, i}
            <div class="row">
              <div style="width : 14%" class="data">{i + 1}</div>
              <div style="width : 26%" class="data">{model.modelName}</div>
              <div style="width : 20%" class="data">{model.size}</div>
              <div style="width : 20%" class="data">
                <button
                  onclick={() => handleDownloadModel(model.downloadHref)}
                  disabled={downloading || model.isDownloaded}
                >
                  {model.isDownloaded ? "already downloaded" : "download"}
                </button>
              </div>
              <div style="width : 20%" class="data">
                <button
                  onclick={() => handleChooseModel(model.modelName)}
                  disabled={!model.isDownloaded}
                >
                  choose
                </button>
              </div>
            </div>
          {/each}
        </div>
        <div class="tableFooter">Total Number of Models is {models.length}</div>
      </div>
    </div>
  </Modal>

  <!-- 🔽 NEW MODAL FOR DOWNLOAD PROGRESS -->
  <Modal bind:show={showDownloadModal} headingKey="downloading" emitCloseIcon>
    <div class="download-progress-content">
      <h3>Downloading: {currentModelName}</h3>

      <div class="progress-bar-container">
        <div class="progress-bar" style="width: {progress}%"></div>
      </div>

      <div class="progress-details">
        <span>{progress.toFixed(1)}%</span>
        <button onclick={cancelDownload}>Cancel</button>
      </div>
    </div>
  </Modal>
</div>

<style lang="scss">
  .setting {
    display: flex;
    justify-content: space-between;
  }

  span {
    cursor: pointer;
  }

  .models {
    width: 100%;

    padding: 20px;
    .table {
      border-radius: 20px;
      width: 900px;
      margin: auto;

      border: 1px solid #eee;
      height: 70vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-wrap: wrap;

      .tableHead {
        padding: 10px 0;
        width: 98.5% !important;
        background-color: #111 !important;

        & div {
          text-transform: uppercase;
        }
      }

      .tableBody {
        flex: 1;
        height: 400px;
        overflow-y: scroll;
      }

      .tableFooter {
        padding: 10px;
        background-color: #111 !important;
        color: #fff;
        display: flex;
        align-items: center;
      }

      & .data {
        display: flex;
        word-break: break-word;
        padding: 5px 20px;
        align-items: center;
        color: #fff !important;
      }

      .row {
        display: flex;
        width: 100%;
      }

      .row:nth-of-type(even) {
        background: #333;
      }

      .row:nth-of-type(odd) {
        background: #555;
      }
    }
  }

  .download-progress-content {
    padding: 20px;
    text-align: center;

    h3 {
      color: #fff;
      margin-bottom: 15px;
    }

    .progress-bar-container {
      width: 100%;
      height: 14px;
      background: #444;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 10px;
    }

    .progress-bar {
      height: 100%;
      background-color: limegreen;
      transition: width 0.3s ease;
    }

    .progress-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;

      button {
        padding: 6px 12px;
        background: crimson;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
          background: #ff3f3f;
        }
      }
    }
  }

  button {
    padding: 10px 20px;
    color: #fff;
    background-color: #000;
    transition: 0.3s;
    display: flex;
    justify-content: space-between;
    border-radius: 20px;
    border: none;

    &:hover {
      color: #fff;
      background-color: var(--color-primary);
      cursor: pointer;
    }
  }
</style>
