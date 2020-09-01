import type {
  RegisterUser,
  UserCredential,
  SuccessLogin,
  Detections,
} from "./models";
import axios from "axios";

function createCredoRepository() {
  axios.defaults.baseURL = "";

  function register(user: RegisterUser) {
    return axios.put("user/register", user);
  }

  function login(credential: UserCredential) {
    return axios.post<SuccessLogin>("user/login", credential);
  }

  function submitDetections(detections: Detections, token: string) {
    const tokenHeader = {
      Authorization: `Token ${token}`,
    };
    return axios.put("detection", detections, { headers: tokenHeader });
  }
  return {
    register,
    login,
    submitDetections,
  };
}
export const CredoRepsitory = createCredoRepository();
