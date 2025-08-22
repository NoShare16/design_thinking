import {useEffect, useState} from "react";

export default function useVideoDevices(): MediaTrackCapabilities | undefined {
    const [bestDevice, setBestDevice] = useState<MediaTrackCapabilities>();
    useEffect(() => {
      (async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = allDevices.filter(d => d.kind === "videoinput");

          const devicesWithCaps: MediaTrackCapabilities[] = [];

          for (const device of videoDevices) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: device.deviceId } },
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
              setBestDevice(torchCams);
            } else {
              setBestDevice(envCams[0]);
            }
          } else {
            setBestDevice(devicesWithCaps[0]);
          }
        } catch (err) {
          console.error("Could not get devices:", err);
        }
      })();
    }, []);
    return bestDevice;
}

