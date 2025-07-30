<script lang="ts">
  import { modelDialogOpen, updateConfig } from "../../helpers/config.svelte";
  import {
    BaseDirectory,
    mkdir,
    readDir,
    writeFile,
  } from "@tauri-apps/plugin-fs";
  import { invoke } from "@tauri-apps/api/core";
  import { fetch } from "@tauri-apps/plugin-http";
  import { appDataDir } from "@tauri-apps/api/path";
  import DataTable, {
    Head,
    Body,
    Row,
    Cell,
    Pagination,
  } from "@smui/data-table";
  import Button, { Label } from "@smui/button";
  import Dialog, { Header, Title, Content, Actions } from "@smui/dialog";
  import Snackbar, {
    Actions as SnackbarActions,
    Label as SnackbarLabel,
  } from "@smui/snackbar";
  import LinearProgress from "@smui/linear-progress";
  import IconButton from "@smui/icon-button";
  let snackbarWithClose: Snackbar;

  type modelType = {
    modelName: string;
    downloadHref: string;
    size: string;
    wordErrorRateSlashSpeed: string;
    isDownloaded: boolean;
  };

  const models: modelType[] = $state([]);
  let downloadAborted = false;
  let open = $state(false);
  let downloading = $state(false);
  let progress = $state(0);
  let currentModelName = $state("");
  let perPage = $state(5);
  let currentPage = $state(0);

  const start = $derived(currentPage * perPage);
  const end = $derived(Math.min(start + perPage, models.length));
  const slice = $derived(models.slice(start, end));
  const lastPage = $derived(
    Math.max(Math.ceil(models.length / perPage) - 1, 0)
  );

  $effect(() => {
    if (currentPage > lastPage) {
      currentPage = lastPage;
    }
  });

  const getDownloadedModels = async () => {
    const baseDir = await appDataDir();
    const extractPath = `${baseDir}/models/extracted`;
    const downloadedModels = await readDir(extractPath);
    return downloadedModels;
  };

  const handleChooseModel = (modelName: string) =>
    updateConfig({
      model: modelName,
    });

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
    snackbarWithClose.forceOpen();
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
      snackbarWithClose.close();
      setTimeout(() => {
        location.reload();
      }, 200);
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

<Dialog
  bind:open={modelDialogOpen.isOpen}
  aria-labelledby="model-label"
  aria-describedby="model-description"
>
  <Header>
    <Title id="model-title">VOSK MODELS</Title>
  </Header>
  <Content id="model-content">
    <DataTable style="width : 100%">
      <Head>
        <Row>
          <Cell>Model Name</Cell>
          <Cell>Size</Cell>
          <Cell>Download</Cell>
          <Cell>Choose Model</Cell>
        </Row>
      </Head>
      <Body>
        {#each slice as model, i}
          <Row class="row">
            <Cell class="data">{model.modelName}</Cell>
            <Cell class="data">{model.size}</Cell>
            <Cell class="data">
              <Button
                onclick={() => handleDownloadModel(model.downloadHref)}
                disabled={downloading || model.isDownloaded}
              >
                {model.isDownloaded ? "downloaded" : "download"}
              </Button>
            </Cell>
            <Cell class="data">
              <Button
                onclick={() => handleChooseModel(model.modelName)}
                disabled={!model.isDownloaded}
              >
                choose
              </Button>
            </Cell>
          </Row>{/each}
      </Body>
      {#snippet paginate()}
        <Pagination style="width : 100%" class="custom">
          {#snippet rowsPerPage()}
            <Label>5 Rows Per Page</Label>
          {/snippet}
          {#snippet total()}
            {start + 1}-{end} of {models.length}
          {/snippet}

          <IconButton
            class="material-icons"
            action="first-page"
            title="First page"
            onclick={() => (currentPage = 0)}
            disabled={currentPage === 0}>first_page</IconButton
          >
          <IconButton
            class="material-icons"
            action="prev-page"
            title="Prev page"
            onclick={() => currentPage--}
            disabled={currentPage === 0}>chevron_left</IconButton
          >
          <IconButton
            class="material-icons"
            action="next-page"
            title="Next page"
            onclick={() => currentPage++}
            disabled={currentPage === lastPage}>chevron_right</IconButton
          >
          <IconButton
            class="material-icons"
            action="last-page"
            title="Last page"
            onclick={() => (currentPage = lastPage)}
            disabled={currentPage === lastPage}>last_page</IconButton
          >
        </Pagination>
      {/snippet}
    </DataTable>
  </Content>
  <Actions>
    <Button action="reject">
      <Label>CLOSE</Label>
    </Button>
  </Actions>
</Dialog>

<Snackbar leading={true as false} bind:this={snackbarWithClose} timeoutMs={-1}>
  <SnackbarLabel
    >Downloading: {currentModelName}
    <div class="progress">
      <LinearProgress
        progress={Number(progress.toFixed(0)) / 100}
        closed={false}
      />
      <span>{progress.toFixed(1)}%</span>
    </div>
  </SnackbarLabel>
  <SnackbarActions>
    <Button onclick={cancelDownload} title="Dismiss">cencel</Button>
  </SnackbarActions>
</Snackbar>

<style lang="scss">
  .progress {
    padding: 10px 0 0;
    display: flex;
    gap: 20px;
    align-items: center;
  }

  :global(.mdc-data-table__pagination) {
    :global(.mdc-data-table__pagination-trailing) {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
    }
  }
</style>
