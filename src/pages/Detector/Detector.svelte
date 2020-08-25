<script lang="ts">
  import { analyze } from "./_analyze";
  import Select from "./Select/Select.svelte";
  import { running, setCamera } from "./_camera";
  import { onMount } from "svelte";

  const config = {
    cropWidth: 60,
    cropHeight: 60,
    brightnessTreshold: 0, // 0 - 255
    pixelTreshold: 20, // 0 - 255
  };

  let dialog;
  let select: boolean = false;
</script>

<section>

  <sl-dialog
    on:slShow={() => (select = true)}
    on:slHide={() => (select = false)}
    bind:this={dialog}
    noHeader="true">
    {#if select}
      <Select />
    {/if}
  </sl-dialog>

  {#if $running === false}
    <button on:click={() => dialog.show()}>Start</button>
  {/if}

  {#if $running === true}
    <button on:click={() => console.log('stop')}>Stop</button>
  {/if}

</section>
