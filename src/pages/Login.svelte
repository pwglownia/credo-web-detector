<script>
  import { appRoute } from "../router";
  import { fade } from "svelte/transition";
</script>

<style>
  sl-button {
    margin: var(--sl-spacing-small);
  }

  .card {
    border-radius: var(--sl-border-radius-large);
    padding: var(--sl-spacing-large);
    background: var(--sl-color-white);
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

<div class="card" in:fade>
  <div class="header">
    <h1>App in development</h1>
    <hr />
  </div>
  <div class="content">
    <div class="left">
      <p>You will proceed as anonymous user.</p>
    </div>
    <div class="right">
      <sl-button
        on:click={() => {
          appRoute.set('detector');
        }}
        type="primary">
        Continue
      </sl-button>
    </div>
  </div>
</div>
