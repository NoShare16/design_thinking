import React, { useEffect, useRef, useState } from "react";
import {BrowserMultiFormatReader, type IScannerControls} from "@zxing/browser";

const BarcodeScanner: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [scannedResult, setScannedResult] = useState<string>("");

    useEffect(() => {
        const getDevices = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                const allDevices = await navigator.mediaDevices.enumerateDevices();
                const videoInputDevices = allDevices.filter(device => device.kind === 'videoinput');

                setDevices(videoInputDevices);
                if (videoInputDevices.length > 0) {
                    setSelectedDeviceId(videoInputDevices[0].deviceId);
                } else {
                    setError("Keine Videogeräte gefunden.");
                }
            } catch (err) {
                console.error("Fehler bei getDevices:", err);
            }
        };
        getDevices();
    }, []);

    useEffect(() => {
        const video1 = videoRef.current;

        if (!selectedDeviceId || !video1) {
            return;
        }

        const codeReader = new BrowserMultiFormatReader();
        let controls: IScannerControls | null = null;

        const startScanner = async () => {
            try {
                controls = await codeReader.decodeFromVideoDevice(
                    selectedDeviceId,
                    video1,
                    (result, err) => {
                        if (result) {
                            console.log('Scan-Ergebnis: ', result.getText());
                            setScannedResult(result.getText());
                        }
                        if (err) {
                            console.error("Scan Error: " + err);
                        }
                    }
                );
            } catch (err) {
                console.error("Fehler beim Starten des Scanners:", err);
            }
        };

        startScanner();

        return () => {
            if (controls) {
                controls.stop();
                console.log("Scanner gestoppt.");
            }
        };

    }, [selectedDeviceId, videoRef]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Fehler:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

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
                        {devices.length > 0 ? (
                            devices.map((device) => (
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
                    {scannedResult ? (
                        <>
                            <p className="font-bold">Letzter gescannter Code:</p>
                            <p className="break-all mt-1">{scannedResult}</p>
                        </>
                    ) : (
                        <p className="text-gray-600">Es wird nach einem Barcode oder QR-Code gesucht...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BarcodeScanner;
