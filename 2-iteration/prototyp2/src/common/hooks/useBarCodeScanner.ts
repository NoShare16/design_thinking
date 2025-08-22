import {type RefObject, useEffect, useRef, useState} from "react";
import {Exception as ZxingError} from "@zxing/library";
import {BrowserMultiFormatReader, type IScannerControls} from "@zxing/browser";
import type {EANNumber} from "@/common/model/EANNumber.ts";
import usePrimaryCamera from "@/common/hooks/usePrimaryCamera.ts";

interface UseBarcodeScannerReturn {
  videoRef: RefObject<HTMLVideoElement | null>,
  lastEAN: EANNumber,
  // eanNumber is success, ZxingError and string indicate errors
  // this field is manly to be used for status indicators, or troubleshooting
  currentResult: EANNumber | ZxingError | string
}

export default function useBarCodeScanner(): UseBarcodeScannerReturn {
  const primaryCamera = usePrimaryCamera();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lastEAN, setLastEAN] = useState<EANNumber>(0)
  const [currentResult, setCurrentResult] = useState<EANNumber | ZxingError | string>("Initializing")

  useEffect(() => {
    if (primaryCamera == undefined) {
      setCurrentResult("No video device selected");
      return;
    }
    const codeReader = new BrowserMultiFormatReader();
    let controls: IScannerControls | null = null;

    (async () => {
      try {
        controls = await codeReader.decodeFromVideoDevice(
          primaryCamera.deviceId,
          !videoRef.current ? undefined : videoRef.current,
          (result, err) => {
            if (result) {
              setLastEAN(Number(result.getText()));
              setCurrentResult(Number(result.getText()));
            }
            // explicitly not used else so that currentResult is always overwritten by Error
            if (err) {
              if (err.name !== "NotFoundException2") {
                console.error("Scan Error: " + err);
              }
              setCurrentResult(err)
            }
          }
        );
      } catch (err) {
        const errString = "Fehler beim Starten des Scanners:" + err + " | videoDeviceId: " + primaryCamera.deviceId;
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
  }, [primaryCamera]);
  return {videoRef, lastEAN, currentResult}
}
