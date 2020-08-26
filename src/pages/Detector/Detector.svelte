<script lang="ts">
  import { analyze } from "./_analyze";
  import { currentStream, running, setCamera } from "./_camera";
  import { onDestroy, onMount } from "svelte";
  import NewSelect from "./Select/newSelect.svelte";
  import Select from "./Select/Select.svelte";
  import { Camera, CameraError, cameraId } from "../../camera/camera";
  import { VideoSettings } from "../../util/video.settings";
import { CameraAnalyser } from "../../camera/camera.analyser";


  const requestWakeLock = async()=>{
    try{
      // @ts-ignore 
      const wakeLock = await navigator.wakeLock.request('screen');
      console.log(wakeLock)
    }catch(e){
      console.error(e)
    }   
  }

  const config = {
    cropWidth: 60,
    cropHeight: 60,
    brightnessTreshold: 0, // 0 - 255
    pixelTreshold: 20, // 0 - 255
  };

  const camera = Camera.getInstance();
  const analyser = new CameraAnalyser()

  $: canShowVideo = VideoSettings.getCanShow();
  $: isDetectorRunning = false;
  let video;

  let dialog;
  let select: boolean = false;

  onMount(() => {
    requestWakeLock()
  });
  onDestroy(() => {});
  function startStopBtn() {
    console.log('onStartStop')
    if (!$cameraId) {
      dialog.show();
      return;
    }
    if (isDetectorRunning){
      stopDetector();
    }
    else {
      startDetector()
    }
  }
  async function startDetector() {
    console.log("startDetector()")
    const result = await camera.getStreamById($cameraId)
     if(result instanceof CameraError)
        return
      isDetectorRunning = true;
      analyser.start((result)=>{
        console.log(result)
      }, result.getVideoTracks()[0])
  }

  function stopDetector() {
    console.log("stopDetecotr()")
    isDetectorRunning = false
     analyser.stop()
    camera.closeStream()
  }
  function stopVideo(){
    analyser.stop()
    analyser.clear()
    camera.closeStream()
  }
  function onSwitchChange() {
    canShowVideo = !canShowVideo;
    VideoSettings.saveCanShow(canShowVideo);
  }
</script>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  header {
    height: 75px;
    width: 100%;
    background-color: #1a1a1a;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }
  nav {
    width: 50%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
  }
  sl-icon-button::part(base) {
    color: white;
    font-size: 24px;
  }
  sl-switch::part(label) {
    color: white;
  }
  video {
    height: 200px;
    width: 100%;
    object-fit: contain;
  }
</style>

<header>
  <h2>Credo</h2>
  <nav>
    <sl-button type="primary">Hits</sl-button>
    <sl-switch on:slChange={onSwitchChange} checked={canShowVideo}>
      video
    </sl-switch>
    <sl-tooltip content="Settings">
      <sl-icon-button name="gear" />
    </sl-tooltip>
  </nav>
</header>
<section>

  <sl-dialog
    on:slShow={() => (select = true)}
    on:slHide={() => (select = false)}
    bind:this={dialog}
    noHeader="true">
    {#if select}
      <NewSelect
        on:close={() => {
          dialog.hide();
        }} />
    {/if}
  </sl-dialog>
  <!-- svelte-ignore a11y-media-has-caption -->
  {#if canShowVideo}
    <video bind:this={video} />
  {/if}

  <sl-button on:click={startStopBtn} type="info">
    {#if isDetectorRunning}Stop{:else}Start{/if}
  </sl-button>

</section>
