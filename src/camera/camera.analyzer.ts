import {
  DetectionAlgorithResult as DetectionResult,
  process,
} from "./detection.algorithm";

export interface WorkerConfig {
  cropWidth: number;
  cropHeight: number;
  brightnessTreshold: number;
  pixelTreshold: number;
}

const config: WorkerConfig = {
  cropWidth: 60,
  cropHeight: 60,
  brightnessTreshold: 50, // 0 - 255
  pixelTreshold: 210, // 0 - 255
};

let canvas: OffscreenCanvas,
  canvasCtx: OffscreenCanvasRenderingContext2D,
  particleImg: ImageData,
  result: DetectionResult;

export class CameraAnalyzer {
  private imageCapture: ImageCapture = null;
  private isRunning = false;
  private callBack = null;

  start(
    callBack: (result: DetectionResult) => void,
    videoTrack: MediaStreamTrack
  ) {
    this.imageCapture = new ImageCapture(videoTrack);
    this.isRunning = true;
    this.callBack = callBack;
    this.grabFrames();
  }

  private grabFrames() {
    this.imageCapture
      .grabFrame()
      .then(this.grabFrameCallback)
      .catch((e) => {});
  }

  private grabFrameCallback = (bitmap: ImageBitmap) => {
    this.processImg(bitmap);

    if (this.isRunning) {
      this.grabFrames();
    }
  };

  private processImg(bitmap: ImageBitmap) {
    this.setup(bitmap);
    result = process(
      this.bitmapToImageData(bitmap),
      particleImg,
      config.brightnessTreshold,
      config.pixelTreshold
    );
    if (this.callBack) {
      this.callBack(result);
    }
  }

  private setup(bitmap: ImageBitmap) {
    if (canvas === undefined) this.setupCanvas(bitmap);
    if (particleImg === undefined)
      particleImg = new ImageData(bitmap.width, bitmap.height);
  }

  private setupCanvas(bitmap: ImageBitmap) {
    canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    let ctx = canvas.getContext("2d");
    canvasCtx = ctx as OffscreenCanvasRenderingContext2D;
  }

  private bitmapToImageData(bitmap: ImageBitmap): ImageData {
    canvasCtx.drawImage(bitmap, 0, 0);
    const imageData = canvasCtx.getImageData(0, 0, bitmap.width, bitmap.height); // add paddings here
    return imageData;
  }

  stop() {
    this.isRunning = false;
  }
}
