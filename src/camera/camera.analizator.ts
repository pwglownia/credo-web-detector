import { DetectionAlgorithResult, process } from "./detection.algorithm";

export class CameraAnalizator {
  private imageCapture: ImageCapture;
  private isRunning = false;
  // private webWorker = new Worker("camera.webworker.ts");
  private callBack = null;

  constructor(private stream: MediaStream) {
    console.log(stream);
    const videoTrack = stream.getVideoTracks()[0];
    console.log("VideoTrack", videoTrack);
    this.imageCapture = new ImageCapture(videoTrack);
  }

  start(callBack: (DetectionAlgorithResult) => void) {
    if (this.isRunning) throw Error("Analizator is running");
    this.isRunning = true;
    this.callBack = callBack
    this.grabFrames();
  }

  private grabFrames() {
    this.imageCapture.grabFrame().then(this.grabFrameCallback);
  }

  private grabFrameCallback(bitmap: ImageBitmap) {
    if (this.isRunning) {
      this.grabFrames();
    }
  }
  private processImg(bitmap:ImageBitmap){
   
  }

  stop() {
    this.isRunning = false;
  }

  clear() {
    this.isRunning = false;
    //this.webWorker.terminate();
    this.stream = null;
  }
}
