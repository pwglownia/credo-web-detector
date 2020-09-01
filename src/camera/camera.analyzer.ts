import {
  DetectionAlgorithResult as DetectionResult,
  process,
} from "./detection.algorithm";

export interface WorkerConfig {
  cropWidth: number;
  cropHeight: number;
  brightnessTreshold: number;
  pixelTreshold: number;
  imagePaddigInPercent: number;
}

const config: WorkerConfig = {
  cropWidth: 60,
  cropHeight: 60,
  brightnessTreshold: 50, // 0 - 255
  pixelTreshold: 210, // 0 - 255
  imagePaddigInPercent: 0.1,
};
let bitmap;

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
    if (this.isRunning) throw Error("Analyzer is running");
    this.imageCapture = new ImageCapture(videoTrack);
    this.isRunning = true;
    this.callBack = callBack;
    console.log(this.imageCapture);
    this.grabFrames();
  }

  private async grabFrames() {
    /*     this.imageCapture
      .grabFrame()
      .then(this.grabFrameCallback)
      .catch((e) => {
        console.log("error !!!", e);
      }); */
    while (this.isRunning) {
      console.time("All");
      console.time("Get bitmap");
      bitmap = await this.imageCapture.grabFrame();
      console.timeEnd("Get bitmap");
      //this.processImg(bitmap);
      console.timeEnd("All");
    }
  }

  private grabFrameCallback = (bitmap: ImageBitmap) => {
    this.processImg(bitmap);
    console.timeEnd("All");
    if (this.isRunning) {
      this.grabFrames();
    }
  };

  private processImg(bitmap: ImageBitmap) {
    this.setUpCanvasIfNecessary(bitmap);
    console.time("PROCESS");
    const result = process(
      this.bitmapToImageData(bitmap),
      this.particleImg,
      config.brightnessTreshold,
      config.pixelTreshold
    );
    console.timeEnd("PROCESS");
    if (this.callBack) {
      this.callBack(result);
    }
  }

  private setUpCanvasIfNecessary(bitmap: ImageBitmap) {
    if (this.canvas === undefined) {
      this.canvas = new OffscreenCanvas(bitmap.width,bitmap.height);
      this.canvasCtx = this.canvas.getContext(
        "2d"
      ) as OffscreenCanvasRenderingContext2D;
    }
  }

  private bitmapToImageData(bitmap: ImageBitmap): ImageData {
    console.time("CONVERT");
    this.canvasCtx.drawImage(bitmap, 0, 0);

    const imageData = this.canvasCtx.getImageData(
      0,
      0,
      bitmap.width,
      bitmap.height
    ); // add paddings here
    console.timeEnd("CONVERT");
    return imageData;
  }
  

  stop() {
    this.isRunning = false;
  }
}
