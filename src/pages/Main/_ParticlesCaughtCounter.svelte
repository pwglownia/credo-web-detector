<script>
  import { onDestroy } from "svelte";

  import { particlesCaught } from "./detector.store";

  onDestroy(() => particlesCaught.reset());
</script>

<span>
  {$particlesCaught} {$particlesCaught === 1 ? 'particle' : 'particles'}
</span>
