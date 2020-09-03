<style>
  img {
    z-index: -1;
    height: 100%;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .wrapper {
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
  }

  .frame {
    padding: 20px;
    max-width: 520px;
    margin: 0 auto;
  }
</style>

<div class="wrapper">
  <img alt="blur background" src="assets/bg.jpg" />
  <div class="frame">
    <slot />

  </div>
</div>
