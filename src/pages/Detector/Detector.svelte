<script lang="ts">
  import { analyze } from "./_analyze";
  import { currentStream, running, setCamera } from "./_camera";
  import { onMount } from "svelte";
  import NewSelect from "./Select/newSelect.svelte";
  import Select from "./Select/Select.svelte";
  import { Camera, cameraId } from "../../camera/camera";

  const config = {
    cropWidth: 60,
    cropHeight: 60,
    brightnessTreshold: 0, // 0 - 255
    pixelTreshold: 20, // 0 - 255
  };
  $: canNotStart = true;
  $: if ($cameraId) {
    canNotStart = true;
  }

  const camera = Camera.getInstance();

  let dialog;
  let select: boolean = false;

  onMount(() => {
    if (camera.deviceId) canNotStart = true;
  });
</script>

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

  <sl-button on:click={() => dialog.show()} type="info">Settings</sl-button>
  <sl-button on:click={() => {}} type="primary" disabled={canNotStart}>
    Start
  </sl-button>

</section>
