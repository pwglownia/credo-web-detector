import { writable } from "svelte/store";

export interface Geoposition {
  position?: Position;
  error?: PositionError;
}

function createGeopositionStore() {
  const geoposition: Geoposition = {
    position: null,
    error: null,
  };
  const { set, subscribe } = writable(geoposition);
  let watcherId = null;
  function startWatchingPosition() {
    watcherId = navigator.geolocation.watchPosition(
      (position) => {
        geoposition.position = position;
        geoposition.error = null;
        set(geoposition);
      },
      (error) => {
        geoposition.error = error;
        geoposition.position = null;
        set(geoposition);
      },
      { enableHighAccuracy: true, timeout: 0 }
    );
  }
  function stopWatchingPosition() {
    if (watcherId) navigator.geolocation.clearWatch(watcherId);
  }

  return { subscribe, startWatchingPosition, stopWatchingPosition };
}

export const geoposition = createGeopositionStore();
