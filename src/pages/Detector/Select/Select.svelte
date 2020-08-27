<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { createEventDispatcher, identity } from "svelte/internal";
  import { Camera, CameraError } from "../../../camera/camera";
  import NoCamera from "./_NoCamera.svelte";
  import NoPermission from "./_NoPermission.svelte";
  import { fade } from "svelte/transition";

  const camera = Camera.getInstance();

  const dispatch = createEventDispatcher();

  let stream = null;
  let cameras = [];

  const ui = {
    loading: true,
    hasPermission: null,
    hasCamera: null,
    hasProblem: null,
  };

  let facing: string;

  $: if (stream && video) {
    video.srcObject = stream;
    facing = camera.getFacingMode();
  }

  let disabled = false;

  let video: HTMLVideoElement;

  onMount(() => {
    initCamera();
  });

  onDestroy(() => {
    // video.srcObject = null;
    camera.closeStream();
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
      ui.hasPermission = true;
      ui.hasCamera = true;
      ui.hasProblem = false;

      stream = result;
    }
    ui.loading = false;
  }

  function errorCase(cameraError: CameraError) {
    if (cameraError.isNotAllowedError()) {
      ui.hasPermission = false;
    } else if (cameraError.isNotFoundError()) {
      ui.hasCamera = false;
    } else {
      ui.hasProblem = true;
      alert(cameraError); // TODO: show more love to user, and print it more gracefully
    }
  }
  async function changeCamera(id: string) {
    ui.loading = true;
    disabled = true;
    if (id === camera.deviceId) {
      disabled = false;
      return;
    }
    video.srcObject = null;
    const result = await camera.getStreamById(id);
    await handleCameraResult(result);
    disabled = false;
  }

  function accept() {
    camera.saveCameraId();
    dispatch("close");
  }

  function cancel() {
    dispatch("close");
  }

  navigator.permissions.query({ name: "camera" }).then((permission) => {
    permission.onchange = function () {
      if (this.state !== "granted") location.reload();
    };
  });
</script>

<style>
  .loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 40vh;
  }

  .container {
    padding: var(--spaceLg);
  }

  video {
    height: 200px;
    width: 100%;
    object-fit: contain;
    background: #000;
    border-top-right-radius: var(--sl-border-radius-medium);
    border-top-left-radius: var(--sl-border-radius-medium);
  }

  .controls {
    padding: var(--spaceMd);
  }

  .info > p {
    margin: 0;
  }

  sl-radio {
    padding: var(--spaceSm);
  }

  .buttons {
    width: 100%;
    justify-content: flex-end;
    box-sizing: border-box;
  }

  .inverted {
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg);
    -moz-transform: rotateY(180deg);
  }
</style>

{#if ui.loading}
  <div class="loading">
    <p>Loading available cameras...</p>
    <br />
    <sl-spinner />
  </div>
{/if}

{#if ui.hasPermission === false}
  <NoPermission />
{/if}

{#if ui.hasCamera === false}
  <NoCamera />
{/if}

{#if ui.hasProblem === true}some problem{/if}

{#if ui.hasPermission === true && ui.hasCamera === true && ui.hasProblem === false}
  <!-- svelte-ignore a11y-media-has-caption -->
  <div transition:fade>
    <video
      class={facing === 'user' ? 'inverted' : ''}
      bind:this={video}
      autoplay />

    <div class="container">
      <div class="info">
        <p>
          Select the camera that is
          <a href="/">best suited</a>
          for detections
        </p>
      </div>

      <div class="controls">
        {#each cameras as { id, name }}
          <sl-radio
            {disabled}
            name="camera"
            on:slChange={() => changeCamera(id)}
            checked={id === camera.deviceId}>
            {name}
          </sl-radio>
        {/each}
      </div>
      <div class="buttons">
        <sl-button on:click={() => cancel()}>Cancel</sl-button>
        <sl-button type="primary" on:click={() => accept()}>Choose</sl-button>
      </div>
    </div>
  </div>
{/if}
