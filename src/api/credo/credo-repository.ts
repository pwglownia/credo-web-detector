import type { Detections } from "./models";
import axios from "axios";

function createCredoRepository() {
  axios.defaults.baseURL = "139.59.148.234";

  async function sendDetections(detections: Detections) {
    try {
      await axios.put("", detections);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  return {
    submitDetections: sendDetections,
  };
}
export const CredoRepsitory = createCredoRepository();
