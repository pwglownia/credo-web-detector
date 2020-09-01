export interface DetectionAlgorithmResult {
  brightness: number;
  particleImg: ImageData | null;
}

let brightness: number,
  maxPixelValue = 0,
  redIndex: number,
  imgLength: number,
  imgArray: Uint8ClampedArray,
  lineIndex: number,
  newLineGuard: number,
  index: number;

export function process(
  imageData: ImageData,
  particleImg: ImageData,
  brightnessTreshold: number,
  pixelTreshold: number
): DetectionAlgorithmResult {
  imgLength = imageData.data.length;
  imgArray = imageData.data;

  setBrightnessAndMaxValue(imgArray, imgLength);

  console.log("brightness", brightnessTreshold, "|", brightness);
  console.log("pixel", maxPixelValue, "|", pixelTreshold);

  if (brightnessTreshold > brightness) {
    if (maxPixelValue > pixelTreshold) {
      particleImg = cropImage(imageData, particleImg);
      return {
        brightness,
        particleImg,
      };
    } else {
      return { brightness, particleImg: null };
    }
  } else return { brightness, particleImg: null };
}

function setBrightnessAndMaxValue(
  imgArray: Uint8ClampedArray,
  imgLenght: number
) {
  let sum = 0;
  maxPixelValue = 0;
  for (let i = 0; i < imgLenght; i += 4) {
    let valueOfCurrentPixel = imgArray[i] + imgArray[i + 1] + imgArray[i + 2];
    sum += valueOfCurrentPixel;

    if (valueOfCurrentPixel > maxPixelValue) {
      maxPixelValue = valueOfCurrentPixel;
      redIndex = i;
    }
  }
  brightness = sum / (imgLenght * (3 / 4));
}

function cropImage(imgToCut: ImageData, particleImg: ImageData): ImageData {
  lineIndex = redIndex - 30 * 4; // left 30 px
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
