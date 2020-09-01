interface RequiredFields {
  device_id: string;
  device_type: string;
  device_model: string;
  system_version: string;
  app_version: string;
}

export interface UserCredential extends RequiredFields {
  email: string;
  username: string;
  password: string;
}

export interface UserInfo {
  display_name: string;
  team: string;
  language;
}

export interface RegisterUser
  extends RequiredFields,
    UserCredential,
    UserInfo {}
export interface DetectionPostion {
  accuracy: number;
  altitude: number;
  latitude: number;
  longitude: number;
  provider: string;
}
export interface Detection extends DetectionPostion {
  frame_content: string;
  timestamp: number;
}
export interface Detections extends RequiredFields {
  detections: Array<Detection>;
}
export interface SuccessLogin extends UserInfo {
  token: string;
  email: string;
  username: string;
}
export const requiredFields:RequiredFields={
  app_version:"v1.0-alpha",
  device_id:"unknow",
  device_model:"unknow",
  device_type:"phone/laptop",
  system_version: navigator.userAgent
}