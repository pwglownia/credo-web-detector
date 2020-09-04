<script>
  import { appRoute } from "../../router";
</script>

<style>
  h1 {
    font-size: 20px;
    letter-spacing: 1.5px;
    margin: 2px;
  }

  .img {
    max-width: 3rem;
  }
  .card {
    padding: var(--sl-spacing-large);
    background: var(--sl-color-white);
    border-top-left-radius: var(--sl-border-radius-large);
    border-top-right-radius: var(--sl-border-radius-large);
    background: var(--sl-color-primary-15);
    color: var(--sl-color-white);
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

<div class="card">
  <div class="content">
    <span>
      <a href="https://credo.science" target="blank">
        <img
          class="img"
          src="assets/credo-logo-grey.png"
          alt="credo.science logo" />
      </a>
      <h1>web detector</h1>
    </span>
    <sl-tooltip placement="left" content="Logout / Exit">
      <sl-icon-button
        style="font-size: 1.5rem;"
        on:click={() => appRoute.set('login')}
        name="arrow-up-right-square-fill" />
    </sl-tooltip>
  </div>
</div>
