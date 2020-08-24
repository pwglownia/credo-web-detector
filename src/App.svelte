<script>
  import Loading from "./other/Loading.svelte";
  import isMobile from "./util/isMobile";
  import { route } from "./router";
  import Layout from "./other/Layout.svelte";

  import Login from "./pages/Login/Login.svelte";
  import Detector from "./pages/Detector/Detector.svelte";

  let loading = true;
  $: currentRoute = $route;

  window.onload = () => {
    setTimeout(() => {
      loading = false;
    }, 500);
  };
</script>

<Layout>
  {#if loading}
    <Loading />
  {/if}

  {#if currentRoute === 'login'}
    <Login />
  {/if}

  {#if currentRoute === 'detector'}
    <Detector />
  {/if}
</Layout>
