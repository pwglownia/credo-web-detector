import {
  DetectionAlgorithmResult as DetectionResult,
  process,
} from "./detection.algorithm";

export interface Config {
  cropWidth: number;
  cropHeight: number;
  brightnessTreshold: number;
  pixelTreshold: number;
}

const config: Config = {
  cropWidth: 60,
  cropHeight: 60,
  brightnessTreshold: 1, // 0 - 255
  pixelTreshold: 210, // 0 - 765
};

export class CameraAnalyzer {
  private imageCapture: ImageCapture = null;
  private isRunning = false;
  private callBack = null;
  private canvas: OffscreenCanvas;
  private canvasCtx: OffscreenCanvasRenderingContext2D;
  private particleImg: ImageData = new ImageData(
    config.cropWidth,
    config.cropHeight
  );

  start(
    callBack: (result: DetectionResult) => void,
    videoTrack: MediaStreamTrack
  ) {
    this.imageCapture = new ImageCapture(videoTrack);
    this.isRunning = true;
    this.callBack = callBack;
    this.grabFrames();
  }

  private async grabFrames() {
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
    this.setUpCanvasIfNecessary(bitmap);
    const result = process(
      this.bitmapToImageData(bitmap),
      this.particleImg,
      config.brightnessTreshold,
      config.pixelTreshold
    );
    if (this.callBack) {
      this.callBack(result);
    }
  }

  private setUpCanvasIfNecessary(bitmap: ImageBitmap) {
    if (this.canvas === undefined) {
      this.canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      this.canvasCtx = this.canvas.getContext(
        "2d"
      ) as OffscreenCanvasRenderingContext2D;
    }
  }

  private bitmapToImageData(bitmap: ImageBitmap): ImageData {
    this.canvasCtx.drawImage(bitmap, 0, 0);

    const imageData = this.canvasCtx.getImageData(
      0,
      0,
      bitmap.width,
      bitmap.height
    ); // add paddings here
    return imageData;
  }

  stop() {
    this.isRunning = false;
  }
}
