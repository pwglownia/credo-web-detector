import { writable } from "svelte/store";
import { CameraError } from "./camera-error";
import type { CameraDevice } from "./camera";

export interface CameraObject {
  id: string;
  stream: MediaStream;
}
const CAMERA_KEY = "device_id";

function createCameraStore() {
  const { subscribe, set } = writable<CameraObject | CameraError>(null);
  let stream: MediaStream = null;
  let deviceId: string = localStorage.getItem(CAMERA_KEY);
  const store = {
    subscribe,
    deviceId,
    closeStream,
    requestStream: async function (id: string = null) {
      if (id) deviceId = id;
      const videoSettings = getVideoSettings();
      const result = await tryGetStream(videoSettings);
      if (result instanceof CameraError) {
        set(result);
        return;
      }
      closeStream();
      stream = result;
      deviceId = getDeviceId();
      save();
    },
    getAvaiableCameras: async function () {
      let mediaDevices = await navigator.mediaDevices.enumerateDevices();
      return mediaDevices
        .filter((device) => device.kind === "videoinput")
        .map<CameraDevice>((device) => ({
          id: device.deviceId,
          name: device.label,
        }));
    },
    getFacingMode: () => {
      return stream?.getVideoTracks()[0].getSettings().facingMode;
    },
  };
  return store;

  function getVideoSettings(): boolean | MediaTrackConstraints {
    if (deviceId) return { deviceId: { exact: deviceId }  };
    return true;
  }

  async function tryGetStream(videoSettings: boolean | MediaTrackConstraints) {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: videoSettings,
        audio: false,
      });
    } catch (e) {
      console.error(e);
      return new CameraError(e.name);
    }
  }

  function getDeviceId() {
    return stream?.getVideoTracks()[0].getSettings().deviceId;
  }

  function closeStream() {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
    set(null);
  }
  function save() {
    set({ id: deviceId, stream });
    localStorage.setItem(CAMERA_KEY, deviceId);
  }
}
export const cameraStore = createCameraStore();
