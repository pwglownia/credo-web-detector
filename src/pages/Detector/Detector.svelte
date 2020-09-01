<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Select from "./Select/Select.svelte";
  import { CameraAnalyzer } from "../../camera/camera.analyzer";
  import { camera } from "../../camera/camera.store";
  import { WakeLocker } from "../../util/wake-locker";
  import type { CameraError } from "../../camera/camera-error";
  import type { Camera } from "../../camera/camera.store";
  import Loading from "../../other/Loading.svelte";

  const analyzer = new CameraAnalyzer();

  let dialog;
  let select: boolean = false;
  let isRunning = false;

  let hits = []

  // debug
  $: console.log($camera);

  $: observer(isRunning, $camera);

  onDestroy(() => {
    analyzer.stop();
    camera.closeStream();
  });

  const observer = (isRunning: boolean, camera: Camera) => {
    if (!camera.stream || camera.error) {
      WakeLocker.release();
    }
    if (isRunning) {
      if (camera.error) {
        handleError(camera.error);
        return;
      }
      if (camera.stream) {
        startAnalyzer(camera.stream);
        WakeLocker.request();
      }
    }
  };
  function handleError(error: CameraError) {
    isRunning = false;
    showDialog();
  }

  function showDialog() {
    stop();
    dialog.show();
  }
  function startAnalyzer(stream: MediaStream) {
    analyzer.start(analyzerCallBack, stream.getVideoTracks()[0]);
  }
  const analyzerCallBack = (data) => {
    console.log(data);
  };

  function start() {
    if (!$camera.id) {
      showDialog();

      return;
    }
    camera.requestStream();
    isRunning = true;
  }

  function stop() {
    isRunning = false;
    analyzer.stop();
    camera.closeStream();
  }
</script>

<style>
  sl-dialog::part(body) {
    padding: 0;
  }

  sl-dialog::part(header) {
    display: none;
  }

  sl-spinner {
    --indicator-color: #fff;
  }
</style>

<header>
  <h2>Credo</h2>
  <nav>
    <sl-button type="primary">Hits</sl-button>
    <sl-tooltip content="Settings">
      <sl-icon-button on:click={() => showDialog()} name="gear" />
    </sl-tooltip>
  </nav>
</header>
<section>

  <sl-dialog
    on:slShow={() => (select = true)}
    on:slHide={() => (select = false)}
    bind:this={dialog}
    noHeader="true">
    {#if select}
      <Select
        on:close={() => {
          dialog.hide();
        }} />
    {/if}
  </sl-dialog>

  {#if $camera.stream}
    <sl-button on:click={() => stop()}>Stop</sl-button>
  {/if}

  {#if !$camera.stream && !isRunning}
    <sl-button on:click={() => start()}>Start</sl-button>
  {/if}

  {#if !$camera.stream && isRunning}
    <sl-button disabled={true}>loading</sl-button>
  {/if}

</section>
