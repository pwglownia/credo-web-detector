<script lang="ts">
  import { analyze } from "./_analyze";
  import Select from "./_Select.svelte";
  import { running } from "./_camera";

  const config = {
    cropWidth: 60,
    cropHeight: 60,
    brightnessTreshold: 0, // 0 - 255
    pixelTreshold: 20, // 0 - 255
  };

  let dialog;
</script>

<section>

  <sl-dialog
    bind:this={dialog}
    noHeader="true"
    style="height: 100vh; width: 100vw">
    <Select />
  </sl-dialog>

  {#if $running === false}
    <button on:click={() => dialog.show()}>Start</button>
  {/if}

  {#if $running === true}
    <button on:click={() => console.log('stop')}>Stop</button>
  {/if}

</section>
