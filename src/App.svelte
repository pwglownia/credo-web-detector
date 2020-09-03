<script>
  import Loading from "./pages/Loading.svelte";
  import isMobile from "./util/isMobile";
  import { appRoute, appLoading } from "./router";

  import Login from "./pages/Login.svelte";
  import Frame from "./misc/_Frame.svelte";
  import Main from "./pages/Main/Main.svelte";

  window.onload = () => {
    setTimeout(() => {
      appLoading.set(false);
    }, 0);
  };
</script>

<Frame>
  {#if $appLoading}
    <Loading />
  {/if}

  {#if $appRoute === 'login'}
    <Login />
  {/if}

  {#if $appRoute === 'detector'}
    <Main />
  {/if}
</Frame>
