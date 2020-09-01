function createImageConverter() {
  function converImageDataToBase64(image: ImageData) {
    const canvas = document.createElement("canvas");
    canvas.width = 60;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    ctx.putImageData(image, 0, 0);
    const url = canvas.toDataURL("image/png",1.0);
    return url;
  }
  return {
    converImageDataToBase64,
  };

}

export const ImageConverter = createImageConverter();
