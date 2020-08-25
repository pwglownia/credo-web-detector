<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { createEventDispatcher, identity } from "svelte/internal";
  import { Camera, CameraError } from "../../../camera/camera";

  const camera = Camera.getInstance();

  const dispatch = createEventDispatcher()

  $: cameras = [];
  $: hasNotPermission = false;
  $: hasNotCamera = false;
  $: canShowSelect = false;
  let stream = null

  $: if(stream && video){
    video.srcObject = stream
    facing = camera.getFacingMode()
  }
  
  let facing: string;
  let isChanging = false;

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
    } else {
      canShowSelect = true
      hasNotCamera = false;
      hasNotPermission = false;
      stream = result
    }
  }
  

  function errorCase(cameraError: CameraError) {
    if (cameraError.isNotAllowedError()) {
      canShowSelect = false;
      hasNotPermission = true;
      hasNotCamera = false;
    } else if (cameraError.isNotFoundError()) {
      canShowSelect = false;
      hasNotPermission = false;
      hasNotCamera = true;
    } else {
      canShowSelect = false;
      hasNotPermission = false;
      hasNotCamera = false;
      alert("Unknow error");
    }
  }
  async function changeCamera(id: string) {
    isChanging = true;
    if (id === camera.deviceId) {
      isChanging = false;
      return;
    }
    video.srcObject = null;
    const result = await camera.getStreamById(id);
    await handleCameraResult(result);
    isChanging = false;
  }

  function accept() {
    camera.saveCameraId();
    dispatch("close")
  }

  navigator.permissions.query({ name: "camera" }).then((permission) => {
    permission.onchange = function () {
      if (this.state !== "granted") location.reload();
    };
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  video {
    height: 200px;
    width: 100%;
    object-fit: contain;
  }

  .inverted {
  transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    -moz-transform: rotateY(180deg);
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
    <video  class={facing === 'user' ? 'inverted' : ''}  bind:this={video} autoplay />
    
    {#each cameras as { id, name }}
      <sl-radio
        disabled={isChanging}
        name="camera"
        on:slChange={() => changeCamera(id)}
        checked={id === camera.deviceId}>
        {name}
      </sl-radio>
    {/each}
    <sl-button on:click={accept}>Accept</sl-button>
  {/if}
</div>
