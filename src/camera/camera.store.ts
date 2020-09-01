import { writable } from "svelte/store";
import { CameraError } from "./camera-error";

export interface Camera {
  id: string;
  stream: MediaStream;
  error: null | CameraError;
}

export interface CameraDevice {
  id: string;
  name: string;
}

const CAMERA_KEY = "device_id";

function createCameraStore() {
  const camera: Camera = {
    stream: null,
    id: null,
    error: null,
  };

  camera.id = localStorage.getItem(CAMERA_KEY);

  const { subscribe, set } = writable<Camera>(camera);

  const store = {
    subscribe,
    id: camera.id,
    closeStream,

    requestStream: async function (id: string = null) {
      if (id) camera.id = id;
      const videoSettings = getVideoSettings();
      const result = await tryGetStream(videoSettings);

      closeStream(); // close old stream

      if (result instanceof CameraError) {
        set({
          ...camera,
          error: result,
        });
        return;
      }
      camera.stream = result;
      camera.id = getDeviceId();
      save();
      return;
    },

    getAvailableCameras: async function () {
      let mediaDevices = await navigator.mediaDevices.enumerateDevices();
      return mediaDevices
        .filter((device) => device.kind === "videoinput")
        .map<CameraDevice>((device) => ({
          id: device.deviceId,
          name: device.label,
        }));
    },

    getFacingMode: () => {
      return camera.stream?.getVideoTracks()[0].getSettings().facingMode;
    },
  };
  return store;

  function getVideoSettings(): boolean | MediaTrackConstraints {
    if (camera.id) return { deviceId: camera.id };
    return true;
  }

  async function tryGetStream(videoSettings: boolean | MediaTrackConstraints) {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: videoSettings,
        audio: false,
      });
    } catch (e) {
      return new CameraError(e.name);
    }
  }

  function getDeviceId() {
    return camera.stream?.getVideoTracks()[0].getSettings().deviceId;
  }

  function closeStream() {
    if (!camera.stream) return;
    camera.stream.getTracks().forEach((track) => track.stop());
    camera.stream = null;
    set(camera);
  }
  function save() {
    set({ ...camera, error: null });
    localStorage.setItem(CAMERA_KEY, camera.id);
  }
}
export const camera = createCameraStore();
