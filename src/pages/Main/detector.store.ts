import { writable } from "svelte/store";
export const newParticleCaught = writable<boolean>(false);
export const particlesCaught = createParticlesCaught();
export const playSound = createplaySound();
export const framesAnalyzed = createFramesAnalyzed();

const PLAY_SOUND_KEY = "play-sound";
setPlaySound();

function createFramesAnalyzed() {
  const { subscribe, set, update } = writable<number>(0);
  return {
    subscribe,
    increment: () => update((n) => n + 1),
    reset: () => set(0),
  };
}

function createParticlesCaught() {
  const { subscribe, set, update } = writable<number>(0);
  return {
    subscribe,
    increment: () => update((n) => n + 1),
    reset: () => set(0),
  };
}

function createplaySound() {
  const { subscribe, set, update } = writable<boolean>(false);
  return {
    subscribe,
    toggle: () =>
      update((value: boolean) => {
        localStorage.setItem(PLAY_SOUND_KEY, String(!value));
        return !value;
      }),
    set,
    reset: () => set(false),
  };
}

function setPlaySound() {
  let playSoundItem = localStorage.getItem(PLAY_SOUND_KEY);
  if (playSoundItem !== null) {
    playSound.set(Boolean(playSoundItem));
  }
}
