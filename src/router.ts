import { writable } from "svelte/store";

// Routes
export const appRoute = writable<"login" | "detector">("login");
export const detectorRoute = writable<"main" | "hits" | "faq">("main");

// Miscs
export const appLoading = writable<boolean>(true);
