import {type RefObject, useEffect, useRef, useState} from "react";
import {Exception as ZxingError} from "@zxing/library";
import {BrowserMultiFormatReader, type IScannerControls} from "@zxing/browser";

type EANNumber = number;

interface UseBarcodeScannerReturn {
  videoRef: RefObject<HTMLVideoElement | null>,
  lastEAN: EANNumber,
  // eanNumber is success, ZxingError and string indicate errors
  // this field is manly to be used for status indicators, or troubleshooting
  currentResult: EANNumber | ZxingError | string
}

export default function useBarCodeScanner(selectedVideoDeviceId: string | undefined): UseBarcodeScannerReturn {
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
