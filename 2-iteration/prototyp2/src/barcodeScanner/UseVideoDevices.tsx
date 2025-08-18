import {useEffect, useState} from "react";

export interface VideoDeviceWithInfo extends MediaDeviceInfo {
  capabilities?: MediaTrackCapabilities;
}

export default function useVideoDevices(): {
  bestDevice?: VideoDeviceWithInfo;
} {
    const [bestDevice, setBestDevice] = useState<VideoDeviceWithInfo>();
    useEffect(() => {
      (async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = allDevices.filter(d => d.kind === "videoinput");

          const devicesWithCaps: VideoDeviceWithInfo[] = [];

          for (const device of videoDevices) {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: device.deviceId } },
              });
              const track = stream.getVideoTracks()[0];
              const caps = track.getCapabilities();

              devicesWithCaps.push({ ...device, capabilities: caps });

              track.stop();
            } catch (err) {
              console.warn("Could not read capabilities for", device.label, err);
            }
          }

          const envCams = devicesWithCaps.filter(d =>
              d.capabilities?.facingMode?.includes("environment")
          );
          if (envCams.length > 0) {
            const torchCams = envCams.find(d => d.capabilities?.torch);
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

    return { bestDevice };
}

