export class CameraError {
  constructor(readonly errorName: string) {}
  isNotAllowedError() {
    return this.errorName === CameraError.NotAllowedError;
  }
  isNotFoundError() {
    return this.errorName === CameraError.NotFoundError;
  }
  static NotAllowedError = "NotAllowedError";
  static NotFoundError = "NotFoundError";
}