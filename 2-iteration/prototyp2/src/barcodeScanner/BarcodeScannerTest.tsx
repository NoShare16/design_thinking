import React, {type RefObject, useEffect, useRef, useState} from "react";
import {BrowserMultiFormatReader, type IScannerControls} from "@zxing/browser";
import {Exception as ZxingError} from "@zxing/library";

export function useVideoDevices(): MediaDeviceInfo[] {
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

type EANNumber = number;

interface UseBarcodeScannerReturn {
  videoRef: RefObject<HTMLVideoElement | null>,
  lastEAN: EANNumber,
  // eanNumber is success, ZxingError and string indicate errors
  // this field is manly to be used for status indicators, or troubleshooting
  currentResult: EANNumber | ZxingError | string
}

export function useBarCodeScanner(selectedVideoDeviceId: string | undefined): UseBarcodeScannerReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lastEAN, setLastEAN] = useState<EANNumber>(0)
  const [currentResult, setCurrentResult] = useState<EANNumber | ZxingError | string>("Initializing")

  useEffect(() => {
    console.log("iran", selectedVideoDeviceId);
    if (!selectedVideoDeviceId) {
      setCurrentResult("No video device selected");
      return;
    }
    const codeReader = new BrowserMultiFormatReader();
    let controls: IScannerControls | null = null;

    (async () => {
      try {
        controls = await codeReader.decodeFromVideoDevice(
          selectedVideoDeviceId,
          !videoRef.current ? undefined : videoRef.current,
          (result, err) => {
            if (result) {
              console.log('Scan-Ergebnis: ', result);
              setLastEAN(Number(result.getText()));
              setCurrentResult(Number(result.getText()));
            }
            // explicitly not used else so that currentResult is always overwritten by Error
            if (err) {
              console.error("Scan Error: " + err);
              setCurrentResult(err)
            }
          }
        );
      } catch (err) {
        const errString = "Fehler beim Starten des Scanners:" + err;
        console.error("Fehler beim Starten des Scanners:", err);
        console.error("errString: ", errString);
        setCurrentResult(errString)
      }
    })();

    return () => {
      if (controls) {
        controls.stop();
        console.log("Scanner gestoppt.");
      }
    };
  }, [selectedVideoDeviceId, videoRef]);
  return {videoRef, lastEAN, currentResult}
}


const BarcodeScannerTest: React.FC = () => {
  const videoDevices = useVideoDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState(videoDevices[0]?.deviceId);
  const {videoRef, lastEAN, currentResult} = useBarCodeScanner(selectedDeviceId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full">
        <div className="mb-4">
          <label htmlFor="video-source" className="block text-gray-700 text-sm font-bold mb-2">
            Kamera:
          </label>
          <select
            id="video-source"
            value={selectedDeviceId}
            onChange={e => setSelectedDeviceId(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline transition duration-200"
          >
            {videoDevices.length > 0 ? (
              videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Kamera ${device.deviceId}`}
                </option>
              ))
            ) : (
              <option disabled>Keine Geräte gefunden</option>
            )}
          </select>
        </div>
        <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        </div>
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-md text-center">
          {lastEAN ? <>
              <p className="font-bold">Letzter gescannter Code:</p>
              <p className="break-all mt-1">{lastEAN}</p>
            </> :
            <p className="text-gray-600">Es wird nach einem Barcode oder QR-Code gesucht...</p>
          }
        </div>
        <div className={typeof currentResult === "number" ?"bg-green-100 border border-green-400 text-green-700": "bg-red-100 border border-red-400 text-red-700" + " mt-6 p-4 rounded-lg shadow-md text-center"}>
          <p className="text-gray-600">{currentResult.toString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerTest;
