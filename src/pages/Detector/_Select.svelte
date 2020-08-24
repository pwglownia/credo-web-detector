<script lang="ts">
  import { onMount } from "svelte";
  import {
    availableCameras,
    currentCameraId,
    getAvailableCameras,
    setCamera,
  } from "./_camera";

  let video: HTMLVideoElement;
  let permission: boolean;

  navigator.permissions.query({ name: "camera" }).then((permissionObj) => {
    permissionObj.state === "granted"
      ? (permission = true)
      : (permission = false);
  });

  onMount(() => {
    getAvailableCameras().then(() => {
      setCamera($availableCameras[0].deviceId, video);
    });
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
  {#if permission}
    <section class="video">
      <video bind:this={video} autoplay />
    </section>
    <section class="controls">

      {#each $availableCameras as { deviceId, label }, i}
        <sl-radio name="option" checked={(deviceId = $currentCameraId)}>
          {label}
        </sl-radio>
      {/each}

      <sl-button>Accept</sl-button>
    </section>
  {:else}brak permisji{/if}

</div>
