<script lang="ts">
  import Header from "./_Header.svelte";
  import Detector from "./_Detector.svelte";
  import Hits from "./_Hits.svelte";
  import FAQ from "./_FAQ.svelte";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { newParticleCaught } from "../detector.store";

  let tabGroup;
</script>

<style>
  sl-tab-group {
    padding: 0 var(--sl-spacing-large);
  }

  sl-tab {
    padding: 0;
  }

  sl-tab-panel::part(base) {
    position: absolute;
    width: calc(100% + calc(2 * var(--sl-spacing-large)));
    left: calc(-1 * var(--sl-spacing-large));
    top: 42px;
    padding: 0;
  }

  .card {
    background: var(--sl-color-white);
    padding-bottom: 20px;
    border-bottom-left-radius: var(--sl-border-radius-large);
    border-bottom-right-radius: var(--sl-border-radius-large);
  }

  .badge-icon {
    position: absolute;
    font-size: 1rem;
    top: 0.5rem;
    left: 50px;
  }
</style>

<div in:fade>

  <Header />

  <div class="card">
    <sl-tab-group
      bind:this={tabGroup}
      on:click={() => newParticleCaught.set(false)}>
      <sl-tab slot="nav" panel="main">Detector</sl-tab>
      <sl-tab slot="nav" panel="hits">
        {#if $newParticleCaught}
          <sl-icon
            class="badge-icon"
            style="color: var(--sl-color-primary-50)"
            name="exclamation-circle-fill" />
        {/if}
        Hits
      </sl-tab>
      <sl-tab slot="nav" disabled panel="faq">F.A.Q</sl-tab>

      <sl-tab-panel name="main">
        <Detector />
      </sl-tab-panel>

      <sl-tab-panel name="hits">
        <Hits />
      </sl-tab-panel>

      <sl-tab-panel name="faq">
        <FAQ />
      </sl-tab-panel>
    </sl-tab-group>
  </div>
</div>
