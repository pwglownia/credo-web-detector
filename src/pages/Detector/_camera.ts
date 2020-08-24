import { writable } from "svelte/store";

export const running = writable(false);
export const currentCameraId = writable(null);
export const availableCameras = writable([]);
export const currentStream = writable<MediaStream>(null);

export function setCamera(id: string, video: HTMLVideoElement) {
  console.log(id)
  navigator.mediaDevices
    .getUserMedia({
      video: {
        deviceId: { exact: id },
      },
      audio: false,
    })
    .then((stream) => {
      console.log(stream);
      video.srcObject = stream;
      currentStream.set(stream);
      currentCameraId.set(id);
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
