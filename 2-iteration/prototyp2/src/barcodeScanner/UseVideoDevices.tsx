import {useEffect, useState} from "react";

export default function useVideoDevices(): MediaDeviceInfo[] {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  useEffect(() => {
    (async () => {
      try {
        await navigator.mediaDevices.getUserMedia({video: true});
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const devices = allDevices.filter(device => device.kind === 'videoinput');
        setDevices(devices)
      } catch (err) {
        console.error("Could not get devices:", err);
      }
    })()
  }, []);
  return devices
}
