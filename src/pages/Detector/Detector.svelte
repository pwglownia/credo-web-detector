<script lang="ts">
  import { analyze } from "./_analyze";
  import { currentStream, running, setCamera } from "./_camera";
  import { onDestroy, onMount } from "svelte";
  import NewSelect from "./Select/Select.svelte";
  import Select from "./Select/Select.svelte";
  import { Camera, cameraId } from "../../camera/camera";

  const config = {
    cropWidth: 60,
    cropHeight: 60,
    brightnessTreshold: 0, // 0 - 255
    pixelTreshold: 20, // 0 - 255
  };

  const camera = Camera.getInstance();

  //debug
  $: console.log($cameraId);

  //end debug
  let video;

  let dialog;
  let select: boolean = false;

  onMount(() => {
    dialog.show();
  });
</script>

<style>
  sl-dialog::part(body) {
    padding: 0;
  }

  sl-dialog::part(header) {
    display: none;
  }
</style>

<!-- svelte-ignore a11y-media-has-caption -->
<section>

  <sl-dialog
    on:slShow={() => (select = true)}
    on:slHide={() => (select = false)}
    bind:this={dialog}
    noHeader="true">
    {#if select}
      <NewSelect
        on:close={() => {
          dialog.hide();
        }} />
    {/if}
  </sl-dialog>
  {#if $cameraId}
    <video bind:this={video} />
    jest kamera
    <sl-button on:click={() => dialog.show()}>switch camera</sl-button>
  {:else}
    <sl-button on:click={() => dialog.show()} type="info">
      Choose Camera
    </sl-button>
  {/if}
</section>
