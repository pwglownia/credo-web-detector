<style>

  .wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    min-height: -webkit-fill-available;
    overflow-y: scroll;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .frame {
    padding: var(--sl-spacing-large);
    max-width: 520px;
    margin: 0 auto;
  }

  :global(body) {
    background: url("/assets/bg.jpg") no-repeat;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }
</style>

<div class="wrapper">
  <div class="frame">
    <slot />
  </div>
</div>
