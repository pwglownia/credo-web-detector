<script lang="ts">
  import { fade } from "svelte/transition";
  import { expoIn, expoOut } from "svelte/easing";
  import { onDestroy, onMount } from "svelte";

  let rubbish = "";

  let interval = setInterval(() => {
    rubbish = getRubbish();
  }, 1000);

  const adjs = [
    "hyperdynamic",
    "theoretical",
    "EMF",
    "IC",
    "quantum",
    "ionic",
    "mega",
  ];
  const nouns = [
    "controllers",
    "matrices",
    "measurements",
    "particles",
    "connectors",
    "components",
    "elements",
    "circuits",
  ];

  const rand = (arr: Array<string>) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  function getRubbish() {
    return rand(adjs) + " " + rand(nouns);
  }
  onMount(() => (rubbish = getRubbish()));
  onDestroy(() => clearInterval(interval));
</script>

<style>
  sl-spinner {
    display: inline;
    position: relative;
    top: 3px;
    margin-right: 10px;
  }

  div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    z-index: 700;
    justify-content: center;
    text-align: center;
    height: 100%;
    width: 100%;
    background: var(--sl-color-primary-5);
    color: var(--sl-color-white);
  }

  section {
    margin-left: 15%;
    height: 100px;
    overflow: visible;
    text-align: left;
  }

  h1 {
    display: inline;
  }

  header {
    padding: 10px 25px;
  }

  .loading {
    left: 0;
    text-align: left;
    margin-right: 3px;
    font-weight: bold;
  }
  .rubbish {
    display: inline;
    white-space: nowrap;
    overflow: visible;
  }
</style>

<div transition:fade={{ duration: 1500, easing: expoIn }}>
  <section>
    <header>
      <img src="" alt="" />
      <h1>Credo Web Detector</h1>
    </header>

    <span class="loading">
      <sl-spinner />
      loading:
    </span>
    <span class="rubbish">{rubbish}</span>
  </section>
</div>
