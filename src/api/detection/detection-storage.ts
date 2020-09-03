import type { Detection } from "../credo/models";

const DETECTION_KEY = "detections";
function createDetectionStorage() {
  function save(detection: Detection) {
    let resuls = localStorage.getItem(DETECTION_KEY);
    const array = converToArrayOfDetection(resuls);
    if (array.length > 19) array.pop();
    array.unshift(detection);
    localStorage.setItem(DETECTION_KEY, JSON.stringify(array));
  }
  function get(): Array<Detection> {
    let result = localStorage.getItem(DETECTION_KEY);
    return converToArrayOfDetection(result);
  }
  return { save, get };
  function converToArrayOfDetection(result: string): Array<Detection> {
    if (!result) return [];
    return JSON.parse(result);
  }
}

export const DetectionStorage = createDetectionStorage();
