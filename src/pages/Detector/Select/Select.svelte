<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Login from "../../Login/Login.svelte";
  import {
    availableCameras,
    currentCameraId,
    currentStream,
    getAvailableCameras,
    setCamera,
  } from "../_camera";
  import NoCamera from "./_NoCamera.svelte";
  import NoPermission from "./_NoPermission.svelte";

  let video: HTMLVideoElement;
  let permission: boolean;

  async function getPermission() {
    const permissionObj = await navigator.permissions.query({ name: "camera" });
    permission = permissionObj.state === "granted";
    permissionObj.onchange = function () {
      permission = this.state === "granted";
    };
  }

  $: if (video) {
    video.srcObject = $currentStream;
  }

  $: if (!permission) {
    stopAllTracks();
  }

  $: if (permission) {
    start();
  }

  async function start() {
    await getPermission();
    getAvailableCameras().then(() => {
      setCamera($availableCameras[0].deviceId);
    });
  }

  function change(id) {
    stopAllTracks();
    setCamera(id);
  }

  function stopAllTracks() {
    if ($currentStream) {
      $currentStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  onMount(() => {
    start();
  });

  onDestroy(() => {
    stopAllTracks();
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }
  video {
    height: 200px;
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg); /* Safari and Chrome */
    -moz-transform: rotateY(180deg); /* Firefox */
  }
</style>

<div class="container">

  {#if permission && $availableCameras.length === 0}
    <NoCamera />
  {/if}

  {#if permission && $availableCameras.length > 0}
    <section class="video">
      <!-- svelte-ignore a11y-media-has-caption -->
      <video bind:this={video} autoplay />
    </section>
    <section class="controls">

      {#each $availableCameras as { deviceId, label }, i}
        <sl-radio
          on:slChange={(ev) => {
            change(ev.srcElement.value);
          }}
          checked={deviceId === $currentCameraId}
          value={deviceId}
          name="option">
          {label}
        </sl-radio>
      {/each}

      <sl-button>Accept</sl-button>
    </section>
  {:else}
    <NoPermission />
  {/if}

</div>
