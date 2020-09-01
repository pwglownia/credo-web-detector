import { ImageConverter } from "../util/image-converter";
import type { Detection } from "../credo-api/models";


function createDetecotSaver() {
  
  function save(imageData:ImageData) {
    const base64 = ImageConverter.converImageDataToBase64(imageData)
    createDetectionObject()
  }
/*   function createDetectionObject(imgBase64:string):Detection{
    const location = $geoposition
    return{

    }
  } */
  function saveToLocalStorage(){

  }
}
export const DetectorSaver = createDetecotSaver();
