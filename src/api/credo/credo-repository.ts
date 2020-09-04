import type { Detections } from "./models";
import axios from "axios";

function createCredoRepository() {
  axios.defaults.baseURL = "139.59.148.234";

  async function sendDetections(detections: Detections) {
    return;
    try {
      await axios.put("", detections);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  return {
    submitDetections: sendDetections,
  };
}
export const CredoRepsitory = createCredoRepository();
