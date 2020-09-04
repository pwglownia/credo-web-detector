<script>
  import { onDestroy } from "svelte";

  import { framesAnalyzed } from "./detector.store";
  onDestroy(() => {
    framesAnalyzed.reset();
  });
</script>

<span>{$framesAnalyzed} frames</span>
