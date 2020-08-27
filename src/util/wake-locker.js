

function createWakeLocker() {
  let wakeLock;
  const request = async () => {
    try {
      // @ts-ignore
      wakeLock = await navigator.wakeLock.request("screen");
    } catch (e) {
      console.error(e);
    }
  };
  const release = () => {
    if (wakeLock) wakeLock.release().then(() => (wakeLock = null));
  };
  return {
    request,
    release,
  };
}

export const WakeLocker = createWakeLocker()