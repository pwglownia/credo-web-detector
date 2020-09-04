export function setTrackConstraints(track: MediaStreamTrack) {
  // Bug: timeout needed in Chrome, see https://crbug.com/711524
  // it causes irrelevent promise errors:
  //
  //    we try to set constraints after 500ms, if track is removed
  //    due to camera shut down, it has no track to set.
  //
  //    Errors are suppressed with ".catch((e) => {});"
  setTimeout(() => {
    const capabilities = track.getCapabilities();

    if (capabilities.iso?.min) {
      track
        .applyConstraints({
          advanced: [
            {
              iso: capabilities.iso.min,
            },
          ],
        })
        .catch((e) => {});
    }

    if (capabilities.contrast?.max) {
      track
        .applyConstraints({
          advanced: [
            {
              contrast: capabilities.contrast.max,
            },
          ],
        })
        .catch((e) => {});
    }

    if (capabilities.sharpness?.max) {
      track
        .applyConstraints({
          advanced: [
            {
              sharpness: capabilities.sharpness.max,
            },
          ],
        })
        .catch((e) => {});
    }

    if (capabilities.saturation?.max) {
      track
        .applyConstraints({
          advanced: [
            {
              saturation: capabilities.saturation.max,
            },
          ],
        })
        .catch((e) => {});
    }

    if (capabilities.noiseSuppression) {
      track
        .applyConstraints({
          advanced: [
            {
              noiseSuppression: false,
            },
          ],
        })
        .catch((e) => {});
    }

    // if (capabilities.brightness?.max) {
    //   track
    //     .applyConstraints({
    //       advanced: [
    //         {
    //           brightness: capabilities.brightness.max,
    //         },
    //       ],
    //     })
    //     .catch((e) => {});
    // }

    if (capabilities.exposureMode) {
      track
        .applyConstraints({
          advanced: [
            {
              exposureMode: "continuous",
            },
          ],
        })
        .catch((e) => {});
    }

    if (capabilities.exposureCompensation?.max) {
      track
        .applyConstraints({
          advanced: [
            {
              exposureCompensation: capabilities.exposureCompensation.max,
            },
          ],
        })
        .catch((e) => {});
    }
  }, 500);
}
