// BarcodeScanner.jsx
// Real barcode scanner using device camera and BarcodeDetector API

import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, Loader } from 'lucide-react';

const BarcodeScanner = ({ onScanSuccess, onClose, colors }) => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [detectedBarcode, setDetectedBarcode] = useState(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      
      // Check if BarcodeDetector is supported
      if (!('BarcodeDetector' in window)) {
        // Fallback: show manual input
        setError('BARCODE_DETECTOR_NOT_SUPPORTED');
        return;
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsScanning(true);
      startBarcodeDetection();

    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('CAMERA_PERMISSION_DENIED');
      } else if (err.name === 'NotFoundError') {
        setError('NO_CAMERA_FOUND');
      } else {
        setError('CAMERA_ERROR');
      }
    }
  };

  const startBarcodeDetection = async () => {
    try {
      const barcodeDetector = new window.BarcodeDetector({
        formats: [
          'ean_13',
          'ean_8',
          'upc_a',
          'upc_e',
          'code_128',
          'code_39',
          'qr_code'
        ]
      });

      // Scan every 500ms
      scanIntervalRef.current = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            
            if (barcodes.length > 0) {
              const barcode = barcodes[0];
              setDetectedBarcode(barcode.rawValue);
              handleBarcodeDetected(barcode.rawValue);
            }
          } catch (err) {
            console.error('Detection error:', err);
          }
        }
      }, 500);

    } catch (err) {
      console.error('BarcodeDetector error:', err);
      setError('BARCODE_DETECTOR_ERROR');
    }
  };

  const handleBarcodeDetected = (barcodeValue) => {
    // Stop scanning
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    // Vibrate if available
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    // Call success callback
    onScanSuccess(barcodeValue);
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleManualEntry = () => {
    onClose('manual');
  };

  // Error states
  if (error === 'CAMERA_PERMISSION_DENIED') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>Camera Access</h2>
            <button onClick={() => onClose()}>
              <X size={24} style={{ color: colors.textLight }} />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.warningBg }}>
              <Camera size={40} style={{ color: colors.warning }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
              Camera Access Required
            </h3>
            <p className="text-base mb-6" style={{ color: colors.textSecondary }}>
              Waste Warrior needs camera access to scan barcodes. Please enable camera permissions in your browser settings.
            </p>
            <button
              onClick={handleManualEntry}
              className="w-full py-3.5 rounded-xl font-semibold text-base"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              Enter Details Manually
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error === 'BARCODE_DETECTOR_NOT_SUPPORTED' || error === 'BARCODE_DETECTOR_ERROR') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>Scanner Not Available</h2>
            <button onClick={() => onClose()}>
              <X size={24} style={{ color: colors.textLight }} />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primaryLight }}>
              <Camera size={40} style={{ color: colors.primary }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
              Barcode Scanning Not Supported
            </h3>
            <p className="text-base mb-6" style={{ color: colors.textSecondary }}>
              Your browser doesn't support automatic barcode scanning. You can still add items manually.
            </p>
            <button
              onClick={handleManualEntry}
              className="w-full py-3.5 rounded-xl font-semibold text-base"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              Enter Details Manually
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Camera view
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 bg-black bg-opacity-80" style={{ position: 'relative', zIndex: 10 }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Scan Barcode</h2>
          <button onClick={() => onClose()}>
            <X size={24} color="white" />
          </button>
        </div>
        <p className="text-sm text-white text-opacity-80 mt-1">
          Point camera at product barcode
        </p>
      </div>

      {/* Camera view */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Scanning frame */}
            <div 
              className="relative"
              style={{
                width: '280px',
                height: '280px',
                border: `3px solid ${detectedBarcode ? colors.fresh : 'white'}`,
                borderRadius: '24px',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4" style={{ borderColor: colors.fresh, borderRadius: '12px 0 0 0' }} />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4" style={{ borderColor: colors.fresh, borderRadius: '0 12px 0 0' }} />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4" style={{ borderColor: colors.fresh, borderRadius: '0 0 0 12px' }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4" style={{ borderColor: colors.fresh, borderRadius: '0 0 12px 0' }} />
              
              {/* Scanning line animation */}
              {isScanning && !detectedBarcode && (
                <div 
                  className="absolute left-0 right-0 h-0.5"
                  style={{
                    backgroundColor: colors.fresh,
                    top: '50%',
                    boxShadow: `0 0 20px ${colors.fresh}`,
                    animation: 'scan 2s ease-in-out infinite'
                  }}
                />
              )}
              
              {/* Success indicator */}
              {detectedBarcode && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.fresh }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">Barcode Detected!</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Help text */}
            <p className="text-white text-center mt-6 text-sm">
              {isScanning ? 'Align barcode within frame' : 'Searching product...'}
            </p>
          </div>
        </div>
      </div>

      {/* Manual entry button */}
      <div className="p-4 bg-black bg-opacity-80">
        <button
          onClick={handleManualEntry}
          className="w-full py-3.5 rounded-xl font-semibold text-base"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
        >
          Enter Details Manually
        </button>
      </div>

      {/* Scanning animation styles */}
      <style>{`
        @keyframes scan {
          0%, 100% {
            top: 10%;
            opacity: 0;
          }
          50% {
            top: 90%;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;
