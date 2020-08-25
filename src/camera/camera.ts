import { writable } from "svelte/store"

export const cameraId = writable(null)
export interface CameraDevice {
  id: string;
  name: string;
}
export class CameraError {
  constructor(readonly errorName: string) {}
  isNotAllowedError(){
    return this.errorName === CameraError.NotAllowedError
  }
  isNotFoundError(){
    return this.errorName === CameraError.NotFoundError
  }
  static NotAllowedError = "NotAllowedError"
  static NotFoundError = "NotFoundError"
}

export class Camera {
  private stream: MediaStream = null;
  private _deviceId: string = null;

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
    const result = await this.tryGetDefaultStream();
    if (result instanceof CameraError) {
      this.stream = null;
      return result;
    }
    this.stream = result
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
        video: { deviceId: {exact: id} },
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

  saveCameraId(){
    cameraId.set(this._deviceId)
  }
}
