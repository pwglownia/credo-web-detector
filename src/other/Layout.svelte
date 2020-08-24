<style>
  [wrapper] {
    height: 100%;
  }

  [wrapper],
  [container] {
    width: 100%;
  }

  [wrapper] {
    position: absolute;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  [container] {
    box-sizing: border-box;
    max-width: 500px;
    padding: 10px;
  }
</style>

<main wrapper>
  <div container>
    <slot />
  </div>
</main>
