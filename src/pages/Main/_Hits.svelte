<script lang="ts">
  import { onDestroy } from "svelte";
  import type { Detection } from "../../api/credo/models";
  import { DetectionStorage } from "../../api/detection/detection-storage";

  let hits: Detection[] = [];

  const interval = setInterval(() => (hits = DetectionStorage.get()), 5000);
  hits = DetectionStorage.get();
  onDestroy(() => clearInterval(interval));
</script>

<style>
  sl-icon {
    position: relative;
    top: 5px;
    font-size: 20px;
    color: var(--sl-color-primary-5);
    margin-right: 5px;
  }

  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 18px;
    padding-top: 0;
  }

  .info-card {
    background: var(--sl-color-white);
    padding: var(--sl-spacing-large);
    border-radius: var(--sl-border-radius-large);
    margin-bottom: var(--sl-spacing-medium);
  }

  .particle-card {
    background: var(--sl-color-white);
    display: flex;
    margin-bottom: var(--sl-spacing-medium);
    border-radius: var(--sl-border-radius-large);
  }

  .particle {
    background: var(--sl-color-primary-5);
    border-top-left-radius: var(--sl-border-radius-large);
    border-bottom-left-radius: var(--sl-border-radius-large);
  }

  .details {
    padding: var(--sl-spacing-large);
  }

  .info {
    font-weight: 700;
    padding: 2px;
  }

  img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-top-left-radius: var(--sl-border-radius-large);
    border-bottom-left-radius: var(--sl-border-radius-large);
  }
</style>

{#if hits.length === 0}
  <div class="info-card">
    <h1>No particles to show</h1>
    <hr />
    <p>
      <sl-icon name="info-circle-fill" style="color: var(--sl-color-info-50)" />
      Run detector to catch some
    </p>
  </div>
{/if}

{#if hits.length > 0}
  <div class="info-card">
    <h1>Your particles</h1>
    <hr />
    <p>These are recent particles, you found using this detector device.</p>
    <p>
      If you wish to get more information, go to your
      <a href="/">credo account</a>
    </p>
  </div>

  {#each hits as hit}
    <div class="particle-card">
      <span class="particle">
        <img src={hit.frame_content} alt="" />
      </span>
      <span class="details">

        <h2>{new Date(hit.timestamp).toLocaleDateString()}</h2>
        <hr />
        <div class="info">
          <sl-icon name="clock-fill" />
          {new Date(hit.timestamp).toLocaleTimeString()}
        </div>
        <div class="info">
          <sl-icon name="geo-alt" />
          {#if hit.latitude === -1}
            ---
          {:else}{hit.latitude.toFixed(2)}, {hit.longitude.toFixed(2)}{/if}
        </div>
      </span>
    </div>
  {/each}
{/if}
