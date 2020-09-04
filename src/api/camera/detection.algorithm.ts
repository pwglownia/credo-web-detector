export interface DetectionAlgorithmResult {
  brightness: number;
  particleImg: ImageData | null;
}

const padding = 40;

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
  innerWidth: number,
  innerHeight: number;

export function process(
  imageData: ImageData,
  particleImg: ImageData,
  brightnessTreshold: number,
  pixelTreshold: number
): DetectionAlgorithmResult {
  imgLength = imageData.data.length;
  imgArray = imageData.data;

  setBrightnessAndMaxValue(
    imageData.width,
    imageData.height,
    imgArray,
    imgLength
  );

  if (brightnessTreshold > brightness) {
    if (maxPixelValue > pixelTreshold) {
      // TODO for Credo api
      // maxX = '',
      // maxY = '',

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
  imgLength: number
) {
  let sum = 0;
  maxPixelValue = 0;
  // set up values for padding 30 px
  start = imgWidth * padding * 4 + padding * 4; // 4 * px
  end = imgLength - start; // 4 * px

  innerWidth = imgWidth - 2 * padding; // px
  innerHeight = imgHeight - 2 * padding; // px

  for (let i = start; i < end; i += imgWidth * 4) {
    for (let j = i; j < i + innerWidth * 4; j += 4) {
      let valueOfCurrentPixel = imgArray[j] + imgArray[j + 1] + imgArray[j + 2];
      sum += valueOfCurrentPixel;
      if (valueOfCurrentPixel > maxPixelValue) {
        maxPixelValue = valueOfCurrentPixel;
        redIndex = j;
      }
    }
  }
  brightness = sum / (innerWidth * innerHeight * 3);
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
