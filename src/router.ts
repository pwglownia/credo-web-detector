import { writable } from "svelte/store";

// Routes
export const appRoute = writable<"login" | "detector">("detector");
export const detectorRoute = writable<"main">("main");

// Miscs
export const appLoading = writable<boolean>(true);
