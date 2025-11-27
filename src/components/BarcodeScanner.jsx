// BarcodeScanner.jsx
// iOS-compatible barcode scanner using html5-qrcode library
// Works on Safari iOS, Chrome Android, and all modern browsers

import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, Loader } from 'lucide-react';

const BarcodeScanner = ({ onScanSuccess, onClose, colors }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [detectedBarcode, setDetectedBarcode] = useState(null);
  const [html5QrCode, setHtml5QrCode] = useState(null);

  useEffect(() => {
    loadScannerLibrary();
    return () => {
      stopScanner();
    };
  }, []);

  const loadScannerLibrary = async () => {
    try {
      // Dynamically load html5-qrcode library from CDN
      if (!window.Html5Qrcode) {
        await loadScript('https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js');
      }
      
      // Wait a bit for the library to initialize
      setTimeout(() => {
        startScanner();
      }, 500);
      
    } catch (err) {
      console.error('Failed to load scanner library:', err);
      setError('LIBRARY_LOAD_ERROR');
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const startScanner = async () => {
    try {
      setError(null);
      
      if (!window.Html5Qrcode) {
        setError('LIBRARY_NOT_LOADED');
        return;
      }

      const html5QrCodeScanner = new window.Html5Qrcode("barcode-reader");
      setHtml5QrCode(html5QrCodeScanner);

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [
          window.Html5QrcodeSupportedFormats.EAN_13,
          window.Html5QrcodeSupportedFormats.EAN_8,
          window.Html5QrcodeSupportedFormats.UPC_A,
          window.Html5QrcodeSupportedFormats.UPC_E,
          window.Html5QrcodeSupportedFormats.CODE_128,
          window.Html5QrcodeSupportedFormats.CODE_39,
          window.Html5QrcodeSupportedFormats.QR_CODE
        ]
      };

      await html5QrCodeScanner.start(
        { facingMode: "environment" }, // Use back camera
        config,
        (decodedText, decodedResult) => {
          handleBarcodeDetected(decodedText);
        },
        (errorMessage) => {
          // Ignore scan errors (happens constantly while scanning)
        }
      );

      setIsScanning(true);

    } catch (err) {
      console.error('Camera error:', err);
      
      if (err.toString().includes('NotAllowedError') || err.toString().includes('Permission')) {
        setError('CAMERA_PERMISSION_DENIED');
      } else if (err.toString().includes('NotFoundError')) {
        setError('NO_CAMERA_FOUND');
      } else {
        setError('CAMERA_ERROR');
      }
    }
  };

  const handleBarcodeDetected = (barcodeValue) => {
    console.log('Barcode detected:', barcodeValue);
    setDetectedBarcode(barcodeValue);
    
    // Vibrate if available
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    
    // Stop scanner
    stopScanner();
    
    // Call success callback after a brief delay to show success state
    setTimeout(() => {
      onScanSuccess(barcodeValue);
    }, 800);
  };

  const stopScanner = () => {
    if (html5QrCode) {
      try {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        }).catch(err => {
          console.error('Error stopping scanner:', err);
        });
      } catch (err) {
        console.error('Error in stopScanner:', err);
      }
    }
  };

  const handleManualEntry = () => {
    stopScanner();
    onClose('manual');
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  // Error states
  if (error === 'CAMERA_PERMISSION_DENIED') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>Camera Access</h2>
            <button onClick={handleClose}>
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

  if (error === 'LIBRARY_LOAD_ERROR' || error === 'LIBRARY_NOT_LOADED') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>Scanner Not Available</h2>
            <button onClick={handleClose}>
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
              Loading Scanner...
            </h3>
            <p className="text-base mb-6" style={{ color: colors.textSecondary }}>
              Please wait a moment or use manual entry.
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

  if (error === 'NO_CAMERA_FOUND' || error === 'CAMERA_ERROR') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>Camera Error</h2>
            <button onClick={handleClose}>
              <X size={24} style={{ color: colors.textLight }} />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.criticalBg }}>
              <Camera size={40} style={{ color: colors.critical }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
              {error === 'NO_CAMERA_FOUND' ? 'No Camera Found' : 'Camera Error'}
            </h3>
            <p className="text-base mb-6" style={{ color: colors.textSecondary }}>
              {error === 'NO_CAMERA_FOUND' 
                ? 'Your device does not have a camera or it is not accessible.'
                : 'Unable to access the camera. Please try again or use manual entry.'
              }
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

  // Camera view with scanner
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 bg-black bg-opacity-80" style={{ position: 'relative', zIndex: 10 }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Scan Barcode</h2>
          <button onClick={handleClose}>
            <X size={24} color="white" />
          </button>
        </div>
        <p className="text-sm text-white text-opacity-80 mt-1">
          Point camera at product barcode
        </p>
      </div>

      {/* Camera view container */}
      <div className="flex-1 relative flex items-center justify-center" style={{ backgroundColor: '#000' }}>
        {/* Scanner element */}
        <div 
          id="barcode-reader" 
          style={{ 
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto'
          }}
        />
        
        {/* Success overlay */}
        {detectedBarcode && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <div className="text-center">
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.fresh }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-white font-bold text-xl">Barcode Detected!</p>
              <p className="text-white text-opacity-70 mt-2">{detectedBarcode}</p>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {!isScanning && !detectedBarcode && !error && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="text-center">
              <Loader size={48} className="animate-spin mx-auto mb-4" color="white" />
              <p className="text-white">Starting camera...</p>
            </div>
          </div>
        )}
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

      {/* Custom styles for html5-qrcode */}
      <style>{`
        #barcode-reader {
          border-radius: 16px;
          overflow: hidden;
        }
        #barcode-reader video {
          border-radius: 16px;
          width: 100% !important;
          height: auto !important;
        }
        #barcode-reader__scan_region {
          border-radius: 16px !important;
        }
        #barcode-reader__dashboard_section_csr {
          display: none !important;
        }
        #barcode-reader__dashboard_section {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;
