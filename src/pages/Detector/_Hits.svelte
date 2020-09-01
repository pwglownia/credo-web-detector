<script lang="ts">
  import { onDestroy } from "svelte";
  import type { Detection } from "../../credo-api/models";

  import { DetectionStorage } from "../../detection/detection-storage";

  let hits: Detection[] = [];

  const interval = setInterval(() => (hits = DetectionStorage.get()), 0);

  onDestroy(() => clearInterval(interval));
</script>

<div>
  {#each hits as hit}
    {new Date(hit.timestamp).toLocaleTimeString()}
    <img src={hit.frame_content} alt="" />
  {/each}

</div>
