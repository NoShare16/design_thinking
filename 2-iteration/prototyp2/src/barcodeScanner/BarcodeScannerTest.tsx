import React, {useState} from "react";
import useVideoDevices from "@/barcodeScanner/UseVideoDevices.tsx";
import useBarCodeScanner from "@/barcodeScanner/UseBarCodeScanner.tsx";

const BarcodeScannerTest: React.FC = () => {
  const videoDevice = useVideoDevices().bestDevice;
  const [selectedDeviceId, setSelectedDeviceId] = useState(videoDevice?.deviceId);
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
            {videoDevice ? (
                <option key={videoDevice.deviceId} value={videoDevice.deviceId}>
                  {videoDevice.label || `Kamera ${videoDevice.deviceId}`}
                </option>
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
