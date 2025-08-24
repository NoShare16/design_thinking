import {type RefObject, useEffect, useRef, useState} from "react";
import {Exception as ZxingError} from "@zxing/library";
import {BrowserMultiFormatReader, type IScannerControls} from "@zxing/browser";
import type {EANNumber} from "@/common/model/EANNumber.ts";
import getPrimaryCamera from "@/common/hooks/getPrimaryCamera.ts";

interface UseBarcodeScannerReturn {
  videoRef: RefObject<HTMLVideoElement | null>,
  lastEAN: EANNumber,
  error:  ZxingError | string | undefined
}

export default function useBarCodeScanner(): UseBarcodeScannerReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lastEAN, setLastEAN] = useState<EANNumber>(0)
  const [error, setError] = useState< ZxingError | string | undefined>(undefined)

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let controls: IScannerControls | null = null;

    (async () => {
      try {
        const primaryCamera = await getPrimaryCamera();
        controls = await codeReader.decodeFromVideoDevice(
          primaryCamera.deviceId,
          !videoRef.current ? undefined : videoRef.current,
          (result, err) => {
            if (result) {
              setLastEAN(Number(result.getText()));
              setError(undefined);
            }
            // explicitly not used else so that currentResult is always overwritten by Error
            if (err) {
              if (err.name !== "NotFoundException2") {
                console.error("Scan Error: " + err);
                setError(err)
              }
            }
          }
        );
      } catch (err) {
        const errString = "Fehler beim Starten des Scanners:" + err
        console.error("Fehler beim Starten des Scanners:", err);
        console.error("errString: ", errString);
        setError(errString)
      }
    })();

    return () => {
      if (controls) {
        controls.stop();
        console.log("Scanner gestoppt.");
      }
    };
  }, []);
  return {videoRef, lastEAN, error: error}
}
