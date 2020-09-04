<script lang="ts">
  import { onDestroy } from "svelte";

  let time = 0;
  let output = "0s";

  const interval = setInterval(() => update(), 1000);

  const update = () => {
    time++;
    if (time < 60) {
      output = time + " " + "s";
      return;
    }
    output = Math.round(time / 60) + " " + "min";
  };
  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<span>{output}</span>
