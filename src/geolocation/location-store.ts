import { writable } from "svelte/store";

export interface Geoposition {
  postion?: Position;
  error?: PositionError;
}

function createGeopositionStore() {
  const geoposition: Geoposition = {
    postion: null,
    error: null,
  };
  const { set, subscribe } = writable(geoposition);
  let watcherId = null;
  function startWatchingPostion() {
    watcherId = navigator.geolocation.watchPosition(
      (postion) => {
        geoposition.postion = postion;
        geoposition.error = null;
        set(geoposition);
      },
      (error) => {
        geoposition.error = error;
        geoposition.postion = null;
        set(geoposition);
      },
      { enableHighAccuracy: true, timeout: 0 }
    );
  }
  function stopWatchingPostion() {
    if (watcherId) navigator.geolocation.clearWatch(watcherId);
  }

  return { subscribe, startWatchingPostion, stopWatchingPostion };
}

export const geoposition = createGeopositionStore();
