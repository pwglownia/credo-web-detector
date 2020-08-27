<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Select from "./Select/Select.svelte";
  import { CameraError } from "../../camera/camera";
  import { CameraAnalyzer } from "../../camera/camera.analyzer";
  import { CameraObject, cameraStore } from "../../camera/camera.store";
  import { WakeLocker } from "../../util/wake-locker";

  const analyzer = new CameraAnalyzer();
  let isDetectorRunning = false;
  let dialog;
  let select: boolean = false;

  onDestroy(() => {
    analyzer.stop();
    cameraStore.closeStream();
  });

  const reactiveScreenRelase = (result?: CameraObject | CameraError) => {
    if (!result || result instanceof CameraError) WakeLocker.release();
  };

  const reactiveDetectorObserver = (
    isRunning: boolean,
    result: CameraObject | CameraError
  ) => {
    if (isRunning && result) {
      if (result instanceof CameraError) {
        alert(result.errorName);
      } else {
        startAnalyzer(result.stream);
        WakeLocker.request();
      }
    }
  };
  function handleError(error: CameraError) {
    alert(error.errorName);
  }
  function startAnalyzer(stream: MediaStream) {
    analyzer.start((result) => {
      analyzerCallBack;
    }, stream.getVideoTracks()[0]);
  }
  const analyzerCallBack = () => {};

  $: reactiveDetectorObserver(isDetectorRunning, $cameraStore);
  $: reactiveScreenRelase($cameraStore)

  function startStopBtn() {
    if (!cameraStore.deviceId) {
      dialog.show();
      return;
    }
    if (isDetectorRunning) {
      stopDetector();
    } else {
      startDetector();
    }
  }
  function startDetector() {
    cameraStore.requestStream();
    isDetectorRunning = true;
  }

  function stopDetector() {
    isDetectorRunning = false;
    analyzer.stop();
    cameraStore.closeStream();
  }
</script>

<style>
  sl-dialog::part(body) {
    padding: 0;
  }

  sl-dialog::part(header) {
    display: none;
  }

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  header {
    height: 75px;
    width: 100%;
    background-color: #1a1a1a;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }
  nav {
    width: 50%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
  }
  sl-icon-button::part(base) {
    color: white;
    font-size: 24px;
  }
</style>

<header>
  <h2>Credo</h2>
  <nav>
    <sl-button type="primary">Hits</sl-button>
    <sl-tooltip content="Settings">
      <sl-icon-button on:click={() => dialog.show()} name="gear" />
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
  <sl-button on:click={startStopBtn} type="info">
    {#if isDetectorRunning}Stop{:else}Start{/if}
  </sl-button>

</section>
