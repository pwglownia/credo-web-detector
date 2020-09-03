<script lang="ts">
  import { onDestroy } from "svelte";

  let time = 3600;
  let output = "0s";

  const interval = setInterval(() => update(), 1000);

  let min;
  let hrs;

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
