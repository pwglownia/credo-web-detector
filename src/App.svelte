<script>
  import Loading from "./pages/Loading.svelte";
  import isMobile from "./util/isMobile";
  import { appRoute, appLoading } from "./router";
  import { isBrowserNotSupported } from "./util/is-browser-not-supported";

  import Login from "./pages/Login.svelte";
  import Frame from "./misc/_Frame.svelte";
  import Main from "./pages/Main/Main.svelte";
  import BrowserNotSupported from "./pages/BrowserNotSupported.svelte";

  // if (isBrowserNotSupported()) {
  //   appRoute.set("browser-not-supported");
  // }

  window.onload = () => {
    setTimeout(() => {
      appLoading.set(false);
    }, 1300);
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

  {#if $appRoute === 'browser-not-supported'}
    <BrowserNotSupported />
  {/if}
</Frame>
