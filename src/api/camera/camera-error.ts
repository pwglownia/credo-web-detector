export class CameraError {
  constructor(readonly name: string) {}
  isNotAllowedError() {
    return this.name === CameraError.NotAllowedError;
  }
  isNotFoundError() {
    return this.name === CameraError.NotFoundError;
  }
  static NotAllowedError = "NotAllowedError";
  static NotFoundError = "NotFoundError";
}
