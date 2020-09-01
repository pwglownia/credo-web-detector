import { process, DetectionAlgorithResult } from "./detection.algorithm";
export interface WorkerConfig {
  cropWidth: number;
  cropHeight: number;
  brightnessTreshold: number;
  pixelTreshold: number;
}

export interface Pixel {
  value: number;
  redIndex: number;
}

/// <reference lib="webworker" />

const config: WorkerConfig = {
  cropWidth: 60,
  cropHeight: 60,
  brightnessTreshold: 50, // 0 - 255
  pixelTreshold: 210, // 0 - 255
};

let canvas: OffscreenCanvas, canvasCtx: OffscreenCanvasRenderingContext2D;

let bitmap: ImageBitmap,
  particleImg: ImageData,
  result: DetectionAlgorithResult;

addEventListener("message", (event) => {
  bitmap = event.data as ImageBitmap;
  setup(bitmap);
  result = process(
    bitmapToImageData(bitmap),
    particleImg,
    config.brightnessTreshold,
    config.pixelTreshold
  );
  /// @ts-ignore // bug
  postMessage(result);
});

function setup(bitmap: ImageBitmap) {
  if (canvas === undefined) setupCanvas(bitmap);
  if (particleImg === undefined)
    particleImg = new ImageData(bitmap.width, bitmap.height);
}

function setupCanvas(bitmap: ImageBitmap) {
  canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  let ctx = canvas.getContext("2d");
  canvasCtx = ctx as OffscreenCanvasRenderingContext2D;
}

function bitmapToImageData(bitmap: ImageBitmap): ImageData {
  canvasCtx.drawImage(bitmap, 0, 0);
  const imageData = canvasCtx.getImageData(0, 0, bitmap.width, bitmap.height); // add paddings here
  return imageData;
}
