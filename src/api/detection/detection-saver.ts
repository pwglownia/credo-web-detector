import { ImageConverter } from "./image-converter";
import { requiredFields } from "../credo/models";
import { CredoRepsitory } from "../credo/credo-repository";
import type { Detection, DetectionPostion } from "../credo/models";
import { DetectionStorage } from "./detection-storage";
import { TokenStorage } from "../../util/token/token-storage";

function createDetectionSaver() {
  function save(imageData: ImageData, postion: Position) {
    const base64 = ImageConverter.converImageDataToBase64(imageData);
    const detectionPostion = createDetectionPostion(postion);
    const detection: Detection = {
      ...detectionPostion,
      frame_content: base64,
      timestamp: Date.now(),
    };
    DetectionStorage.save(detection);
    return CredoRepsitory.submitDetections(
      { detections: [detection], ...requiredFields });
  }
  return { save };
  function createDetectionPostion(position?: Position): DetectionPostion {
    if (!position)
      return {
        accuracy: -1,
        altitude: -1,
        latitude: -1,
        longitude: -1,
        provider: "Unknown",
      };
    return {
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      provider: "Unknown",
    };
  }
}
export const DetectionSaver = createDetectionSaver();
