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

export interface Detection extends RequiredFields {
  accuracy: number;
  altitude: number;
  latitude: number;
  frame_content: string;
  longitude: number;
  provider: string;
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
