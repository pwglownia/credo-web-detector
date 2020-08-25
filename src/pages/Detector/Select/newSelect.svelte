<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { identity } from "svelte/internal";
  import { Camera, CameraError } from "../../../camera/camera";
  
  const camera = new Camera();

  $: cameras = [];
  $: hasNotPermission = false;
  $: hasNotCamera = false;
  $: canShowSelect = true;

  let video: HTMLVideoElement;

  onMount(() => {
    initCamera();
  });

  onDestroy(() => {
    if (canShowSelect) {
      video.srcObject = null;
      camera.closeStream();
    }
  });

  async function initCamera() {
    const result = await camera.getDefaultStream();
    await handleCameraResult(result);
    cameras = await camera.getAvaiableCameras();
  }

  async function handleCameraResult(result: MediaStream | CameraError) {
    if (result instanceof CameraError) {
      errorCase(result);
      return;
    } else {
      hasNotCamera = false;
      hasNotPermission = false;
      video.srcObject = result;
    }
  }
  function errorCase(cameraError: CameraError) {
    console.log(cameraError);
    if (cameraError.isNotAllowedError()) {
      canShowSelect = false
      hasNotPermission = true;
      hasNotCamera = false;
    }
    if(cameraError.isNotFoundError()) {
      canShowSelect = false
      hasNotPermission = false;
      hasNotCamera = true;
    }
    else {
      canShowSelect = false
      hasNotPermission = false;
      hasNotCamera = false;
      alert("Error")
    }
  }
  async function changeCamera(id: string) {
    if (id === camera.deviceId) return;
    video.srcObject = null;
    const result = await camera.getStreamById(id);
    await handleCameraResult(result);
  }

  function accept() {
    camera.saveCameraId();
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }
  video {
    height: 200px;
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    -moz-transform: rotateY(180deg);
  }
  .radio-btn {
    padding: 16px;
  }
</style>

<!-- svelte-ignore a11y-media-has-caption -->
<div class="container">

  {#if hasNotPermission}
    <h2>Not allowed</h2>
  {/if}
  {#if hasNotCamera}
    <h2>No camera</h2>
  {/if}
  {#if canShowSelect}
    <section class="video">
      <video bind:this={video} autoplay />
    </section>
    {#each cameras as { id, name }}
      <sl-radio
        class="radio-btn"
        value={id}
        name="camera"
        on:slChange={(ev) => changeCamera(ev.srcElement.value)}
        checked={id === camera.deviceId}>
        {name}
      </sl-radio>
    {/each}
    <sl-button on:click={accept()}>Accept</sl-button>
  {/if}

</div>
