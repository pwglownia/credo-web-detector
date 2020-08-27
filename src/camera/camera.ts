import { writable } from "svelte/store";

export const cameraId = writable(null);
export interface CameraDevice {
  id: string;
  name: string;
}

export class CameraError {
  constructor(readonly errorName: string) {}
  isNotAllowedError() {
    return this.errorName === CameraError.NotAllowedError;
  }
  isNotFoundError() {
    return this.errorName === CameraError.NotFoundError;
  }
  static NotAllowedError = "NotAllowedError";
  static NotFoundError = "NotFoundError";
}

const CAMERA_KEY = "device_id";

export class Camera {
  private static INSTANCE: Camera = null;
  static getInstance() {
    if (!Camera.INSTANCE) Camera.INSTANCE = new Camera();
    return this.INSTANCE;
  }

  private stream: MediaStream = null;

  private _deviceId: string = localStorage.getItem(CAMERA_KEY);

  private constructor() {
    if(this._deviceId){
      cameraId.set(this._deviceId)
    }
  }

  get deviceId() {
    return this._deviceId;
  }

  async getAvaiableCameras() {
    let mediaDevices = await navigator.mediaDevices.enumerateDevices();
    return mediaDevices
      .filter((device) => device.kind === "videoinput")
      .map<CameraDevice>((device) => ({
        id: device.deviceId,
        name: device.label,
      }));
  }

  async getDefaultStream() {
    this.closeStream();
    let result;
    if (!this._deviceId) result = await this.tryGetDefaultStream();
    else result = await this.tryGetStreamById(this._deviceId);
    if (result instanceof CameraError) {
      this.stream = null;
      return result;
    }
    this.stream = result;
    this._deviceId = this.stream?.getVideoTracks()[0].getSettings().deviceId;
    return this.stream;
  }
  private async tryGetDefaultStream() {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    } catch (e) {
      console.error(e);
      return new CameraError(e.name);
    }
  }

  async getStreamById(id: string) {
    this.closeStream();
    const results = await this.tryGetStreamById(id);
    if (results instanceof CameraError) {
      this.stream = null;
      return results;
    } else this.stream = results;
    this._deviceId = this.stream ? id : null;
    return this.stream;
  }
  private async tryGetStreamById(id: string) {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: id },width: 4096, height:2160 },
        audio: false,
      });
    } catch (e) {
      console.error(e);
      return new CameraError(e.name);
    }
  }

  closeStream() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    this.stream = null;
  }

  saveCameraId() {
    cameraId.set(this._deviceId);
    localStorage.setItem(CAMERA_KEY, this._deviceId);
  }

  getFacingMode() {
    return this.stream?.getVideoTracks()[0].getSettings().facingMode;
  }
}
