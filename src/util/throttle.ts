var waiting = false; // Initially, we're not waiting

export function throttle(f, time) {
  console.log("t");

  return function () {
    // We return a throttled function
    if (!waiting) {
      console.log("no waiting?");
      // If we're not waiting
      f.apply(this, arguments); // Execute users function
      waiting = true; // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        waiting = false; // And allow future invocations
      }, time);
    }
  };
}
