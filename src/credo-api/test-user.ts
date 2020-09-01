import type { UserCredential } from "./models";

export const TestUser = (): UserCredential => {
  return {
    username: "test-web-detector",
    app_version: "1.0-alpha",
    device_id: "unknow",
    device_model: "unknow",
    device_type: "laptop/phone",
    email: "credotest.webdetector@interia.pl",
    password: "qwerty123",
    system_version: "browser",
  };
};
