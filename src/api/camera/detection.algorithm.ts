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
  index: number,
  start: number,
  end: number,
  lineGuard: number;

export function process(
  imageData: ImageData,
  particleImg: ImageData,
  brightnessTreshold: number,
  pixelTreshold: number
): DetectionAlgorithmResult {
  imgLength = imageData.data.length;
  imgArray = imageData.data;

  setBrightnessAndMaxValue(imageData.width, imageData.height, imgArray, imgLength);

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
  imgWidth: number,
  imgHeight: number,
  imgArray: Uint8ClampedArray,
  imgLenght: number
) {
  let sum = 0;
  maxPixelValue = 0;
  // set up values for padding 30 px 
  start = imgWidth * 30 + 120;
  end = imgLenght - start;
  lineGuard = 2 * start;
  for (let i = start; i < end; i += 4) {
    if (i < i + lineGuard) continue;
    let valueOfCurrentPixel = imgArray[i] + imgArray[i + 1] + imgArray[i + 2];
    sum += valueOfCurrentPixel;

    if (valueOfCurrentPixel > maxPixelValue) {
      maxPixelValue = valueOfCurrentPixel;
      redIndex = i;
    }
  }
  brightness = sum / (((imgWidth-240)*(imgHeight-240)) * (3 / 4));
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
