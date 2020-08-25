import { writable } from "svelte/store";

export const running = writable(false);
export const currentCameraId = writable(null);
export const availableCameras = writable([]);
export const currentStream = writable<MediaStream>(null);

export function setCamera(id: string) {
  let constraints;

  if (id === "") {
    constraints = {
      video: true,
      audio: false,
    };
  } else {
    constraints = {
      video: {
        deviceId: { exact: id },
      },
      audio: false,
    };
  }

  currentCameraId.set(id);
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      currentStream.set(stream);
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function getAvailableCameras() {
  let mediaDevices = await navigator.mediaDevices.enumerateDevices();

  let cameras = [];
  mediaDevices.forEach((device) => {
    if (device.kind === "videoinput") {
      let { label, deviceId } = device;
      cameras.push({ label, deviceId });
    }
  });

  availableCameras.set(cameras);
}
