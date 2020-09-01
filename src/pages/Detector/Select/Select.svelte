<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { createEventDispatcher, identity } from "svelte/internal";
  import Prompt from "./_Prompt.svelte";
  import NoCamera from "./_NoCamera.svelte";
  import NoPermission from "./_NoPermission.svelte";
  import { camera } from "../../../camera/camera.store";
  import type { Camera } from "../../../camera/camera.store";
  import type { CameraError } from "../../../camera/camera-error";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  let cameras = [];
  let loading = false;
  let facing: string;

  $: if ($camera.stream && video) {
    video.srcObject = $camera.stream;
    facing = camera.getFacingMode();
  }

  let disabled = false;

  let video: HTMLVideoElement;

  let prompt = false;

  onMount(async () => {
    const res = await navigator.permissions.query({ name: "camera" });

    if (res.state === "prompt") {
      prompt = true;
    }

    loading = true;
    await camera.requestStream();
    cameras = await camera.getAvailableCameras();
    loading = false;
  });

  onDestroy(() => {
    if (video) {
      video.srcObject = null;
    }
    camera.closeStream();
  });

  async function changeCamera(id: string) {
    if (id === $camera.id) {
      return;
    }
    if (video) {
      video.srcObject = null;
    }
    disabled = true;

    await camera.requestStream(id);
    disabled = false;
  }
  function close() {
    dispatch("close");
  }
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

{#if loading === true}
  {#if prompt}
    <Prompt />
  {/if}

  <div class="loading">
    <br />
    <sl-spinner />
  </div>
{:else}

  {#if $camera.error?.isNotAllowedError()}
    <NoPermission />
  {/if}

  {#if $camera.error?.isNotFoundError()}
    <NoCamera />
  {/if}

  {#if $camera.stream}
    <div>
      <!-- svelte-ignore a11y-media-has-caption -->
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
              on:click={() => changeCamera(id)}
              checked={id === $camera.id}>
              {name}
            </sl-radio>
          {/each}
        </div>
        <div class="buttons">
          <sl-button type="primary" on:click={() => close()}>Choose</sl-button>
        </div>
      </div>
    </div>
  {/if}
{/if}
