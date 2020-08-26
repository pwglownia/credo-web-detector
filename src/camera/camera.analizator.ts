export class CameraAnalizator {
    
  private imageCapture: ImageCapture;
  private isRunning = false;
  private webWorker = new Worker("camera.webworker.ts");

  constructor(private stream: MediaStream) {
    const videoTrack = stream.getVideoTracks[0];
    this.imageCapture = new ImageCapture(videoTrack);
  } 

  startAnalizator() {
    if (this.isRunning) throw Error("Analizator is running");
    this.isRunning = true;
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

  stopAnalizator() {
    this.isRunning = false;
  }

  private analizeBitmap(bitmap: ImageBitmap) {}
}
