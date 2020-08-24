import { writable } from "svelte/store";

export const route = writable<"login" | "detector">("login");

// DEBUG
route.subscribe((route) => console.info("Route changed to: " + route));
