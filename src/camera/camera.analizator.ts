import type { DetectionAlgorithResult } from "./detection.algorithm";

export class CameraAnalizator {
  private imageCapture: ImageCapture;
  private isRunning = false;
  private webWorker = new Worker("camera.webworker.ts");

  constructor(private stream: MediaStream) {
    const videoTrack = stream.getVideoTracks[0];
    this.imageCapture = new ImageCapture(videoTrack);
  }

  start(callBack: (DetectionAlgorithResult) => void) {
    if (this.isRunning) throw Error("Analizator is running");
    this.isRunning = true;
    this.grabFrames();
    this.webWorker.onmessage = ({ data }) => {
      callBack(data);
    };
  }

  private grabFrames() {
    this.imageCapture.grabFrame().then(this.grabFrameCallback);
  }

  private grabFrameCallback(bitmap: ImageBitmap) {
    this.webWorker.postMessage(bitmap);
    if (this.isRunning) {
      this.grabFrames();
    }
  }

  private analizeBitmap(bitmap: ImageBitmap) {}
  stop() {
    this.isRunning = false;
  }

  clear() {
    this.webWorker.terminate();
    this.stream = null;
  }
}
