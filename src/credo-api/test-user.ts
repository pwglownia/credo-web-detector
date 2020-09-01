import type { UserCredential } from "./models";
import { requiredFields } from "./models";

export const TestUser = (): UserCredential => {
  return {
    username: "test-web-detector",
    email: "credotest.webdetector@interia.pl",
    password: "qwerty123",
    ...requiredFields,
  };
};
