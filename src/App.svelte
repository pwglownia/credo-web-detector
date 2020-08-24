<script>
  import Loading from "./other/Loading.svelte";
  import isMobile from "./util/isMobile";
  import { appRoute, appLoading } from "./router";
  import Layout from "./other/Layout.svelte";

  import Login from "./pages/Login/Login.svelte";
  import Detector from "./pages/Detector/Detector.svelte";

  window.onload = () => {
    setTimeout(() => {
      appLoading.set(false);
    }, 500);
  };
</script>

<Layout>
  {#if $appLoading}
    <Loading />
  {/if}

  {#if $appRoute === 'login'}
    <Login />
  {/if}

  {#if $appRoute === 'detector'}
    <Detector />
  {/if}
</Layout>
