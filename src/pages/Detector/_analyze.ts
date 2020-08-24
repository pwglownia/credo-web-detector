export interface Config {
  cropWidth: number;
  cropHeight: number;
  brightnessTreshold: number;
  pixelTreshold: number;
}

export interface Pixel {
  value: number;
  redIndex: number;
}

let canvas: OffscreenCanvas,
  canvasCtx: OffscreenCanvasRenderingContext2D,
  imageData: ImageData,
  brightness: number,
  particleImg: ImageData,
  result = {},
  maxPixelValue = 0,
  redIndex: number,
  imgLength: number,
  imgArray: /// @ts-ignore
  Uint8ClampedArray,
  lineIndex: number,
  newLineGuard: number,
  index: number,
  sum: number,
  currentPixelValue: number;

function process(
  imageData: ImageData,
  particleImg: ImageData,
  brightnessTreshold: number,
  pixelTreshold: number
) {
  imgLength = imageData.data.length;
  imgArray = imageData.data;

  findBrightnessAndSum(imgArray, imgLength);

  if (brightnessTreshold > brightness) {
    if (maxPixelValue > pixelTreshold) {
      particleImg = cropImage(imageData, particleImg);
      return {
        brightness,
        particleImg,
      };
    } else {
      return { brightness };
    }
  } else return { brightness };
}

function findBrightnessAndSum(
  imgArray: // @ts-ignore
  Uint8ClampedArray,
  imgLenght: number
) {
  sum = 0;

  for (let i = 0; i < imgLenght; i += 4) {
    currentPixelValue = imgArray[i] + imgArray[i + 1] + imgArray[i + 2];
    sum += currentPixelValue;

    if (currentPixelValue > maxPixelValue) {
      maxPixelValue = currentPixelValue;
      redIndex = i;
    }
  }
  brightness = sum / (imgLenght * (3 / 4));
}

function cropImage(imgToCut: ImageData, particleImg: ImageData): ImageData {
  lineIndex = redIndex - 30 * 4; // move left 30px * 4 channels
  lineIndex = lineIndex - 30 * 4 * imgToCut.width; // up 30px

  newLineGuard = 0;
  index = lineIndex;

  for (let i = 0; i <= 60 * 60 * 4; i++) {
    if (newLineGuard === 60 * 4) {
      lineIndex += imgToCut.width * 4;
      index = lineIndex;
      newLineGuard = 0;
    }

    particleImg.data[i] = imgToCut.data[index];
    newLineGuard++;
    index++;
  }
  return particleImg;
}

export function analyze(config: Config, img: ImageBitmap) {
  if (canvas === undefined) {
    canvas = new OffscreenCanvas(img.width, img.height);
    let ctx = canvas.getContext("2d");
    canvasCtx = ctx as OffscreenCanvasRenderingContext2D;
  }
  if (particleImg === undefined)
    particleImg = new ImageData(img.width, img.height);

  canvasCtx.drawImage(img, 0, 0);
  imageData = canvasCtx.getImageData(0, 0, img.width, img.height);

  result = process(
    imageData,
    particleImg,
    config.brightnessTreshold,
    config.pixelTreshold
  );

  return result;
}
