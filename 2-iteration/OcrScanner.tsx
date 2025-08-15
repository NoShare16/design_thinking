import React, { useEffect, useRef, useState, useCallback } from "react";
import Tesseract from 'tesseract.js';

interface RecognizeResult {
    data: {
        text: string;
    };
}

const OcrScanner: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null); // Canvas für die Bildaufnahme
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [scannedResult, setScannedResult] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false); // Zeigt an, ob Tesseract gerade verarbeitet

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
                setError("Zugriff auf die Kamera verweigert oder kein Gerät verfügbar.");
            }
        };
        getDevices();
    }, []);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!selectedDeviceId || !videoElement) {
            return;
        }

        let stream: MediaStream | null = null;

        const startStream = async () => {
            try {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: selectedDeviceId }
                });
                videoElement.srcObject = stream;
            } catch (err) {
                console.error("Fehler beim Starten des Video-Streams:", err);
                setError("Konnte den Video-Stream nicht starten.");
            }
        };

        startStream();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [selectedDeviceId]);

    const captureAndRecognize = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current || isProcessing) {
            return;
        }

        setIsProcessing(true);
        setError(""); // Fehler zurücksetzen

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
            setError("Konnte den Canvas-Kontext nicht erhalten.");
            setIsProcessing(false);
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Zeichne den aktuellen Frame des Videos auf den Canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
            const { data: { text } } = await Tesseract.recognize(canvas,'deu') as RecognizeResult; // Type assertion

            console.log('OCR-Ergebnis:', text);
            if(text.match("/*.Zutaten:.*/")) {
                setScannedResult(text);
            }
        } catch (err) {
            console.error("Fehler bei der OCR-Verarbeitung:", err);
            setError("Fehler bei der OCR-Verarbeitung.");
        } finally {
            setIsProcessing(false);
        }
    }, [isProcessing]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            captureAndRecognize();
        }, 5000); // 5 Sec

        return () => clearInterval(intervalId);
    }, [captureAndRecognize]);


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
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        {isProcessing && (
                            <div className="bg-black bg-opacity-50 text-white p-3 rounded-lg">
                                Verarbeite Text...
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-md text-center">
                    {scannedResult ? (
                        <>
                            <p className="font-bold">Letzter gescannter Text:</p>
                            <p className="break-all mt-1">{scannedResult}</p>
                        </>
                    ) : (
                        <p className="text-gray-600">Es wird nach Text gesucht...</p>
                    )}
                </div>
                <button
                    onClick={captureAndRecognize}
                    disabled={isProcessing}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? "Verarbeite..." : "Text jetzt scannen"}
                </button>
            </div>
        </div>
    );
};

export default OcrScanner;
