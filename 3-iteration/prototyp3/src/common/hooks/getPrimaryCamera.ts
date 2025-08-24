export default async function getPrimaryCamera(): Promise<MediaTrackCapabilities> {
  try {
    await navigator.mediaDevices.getUserMedia({video: true});
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = allDevices.filter(d => d.kind === "videoinput");

    const devicesWithCaps: MediaTrackCapabilities[] = [];

    for (const device of videoDevices) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {deviceId: {exact: device.deviceId}},
        });
        const track = stream.getVideoTracks()[0];
        const caps = track.getCapabilities();

        devicesWithCaps.push(caps);

        track.stop();
      } catch (err) {
        console.warn("Could not read capabilities for", device.label, err);
      }
    }

    const envCams = devicesWithCaps.filter(d =>
      d.facingMode?.includes("environment")
    );
    if (envCams.length > 0) {
      const torchCams = envCams.find(d => d.torch);
      if (torchCams) {
        return torchCams;
      } else {
        return envCams[0];
      }
    } else {
      return devicesWithCaps[0];
    }
  } catch (err) {
    return Promise.reject("Could not get devices: " + err);
  }
}
