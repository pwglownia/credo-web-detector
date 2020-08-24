import { writable } from "svelte/store";

export const appRoute = writable<"login" | "detector">("detector");
export const appLoading = writable<boolean>(true);

export const detectorRoute = writable<"setup">("setup");

appRoute.subscribe((route) => console.info("App route changed to: " + route));
detectorRoute.subscribe((route) =>
  console.info("Detector route changed to: " + route)
);
