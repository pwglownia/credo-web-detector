import { writable } from "svelte/store";
import { CameraError } from "./camera-error";

export interface Camera {
  id: string;
  stream: MediaStream;
  error: null | CameraError;
  pending: boolean;
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
    pending: false,
  };

  camera.id = localStorage.getItem(CAMERA_KEY);

  const { subscribe, set } = writable<Camera>(camera);

  const store = {
    id: camera.id,
    pending: camera.pending,

    subscribe,
    closeStream,

    requestStream: async function (id: string = null) {
      closeStream();

      if (camera.pending) return;
      camera.pending = true;

      if (id) camera.id = id;

      const videoSettings = getVideoSettings();
      const result = await tryGetStream(videoSettings);
      camera.pending = false;

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

  function getVideoSettings(): MediaTrackConstraints {
    const settings: MediaTrackConstraints = {
      deviceId: null,
      frameRate: 60,
      width: 1920,
      height: 1080,
    };
    if (camera.id) {
      settings.deviceId = camera.id;
    }

    return settings;
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
