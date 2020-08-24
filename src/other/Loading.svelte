<script lang="ts">
  import { fade } from "svelte/transition";
  import { expoOut } from "svelte/easing";
</script>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    z-index: 700;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
    width: 100%;
    background: #fff;
  }
</style>

<div transition:fade={{ duration: 700, easing: expoOut }}>
  <sl-spinner />
  <p>Loading Axionomatic Ray Matrices...</p>
</div>
