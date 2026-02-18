import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

function QRScanner({ user }) {
  const scannerRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    return () => {
      if (scanner && scanner.getState() === 2) {
        scanner.stop();
      }
    };
  }, [scanner]);

  const startScanner = () => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-scanner',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        aspectRatio: 1,
      },
      false
    );

    const onScanSuccess = (decodedText) => {
      try {
        const data = JSON.parse(decodedText);
        setScannedData(data);
        html5QrcodeScanner.pause();
        setScanning(false);
        toast.success('QR code scanned successfully!');
      } catch (error) {
        toast.error('Invalid QR code format');
      }
    };

    const onScanError = (error) => {
      // Silently ignore scan errors (camera constantly scanning)
    };

    html5QrcodeScanner.render(onScanSuccess, onScanError);
    setScanner(html5QrcodeScanner);
    setScanning(true);
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.stop();
      setScanning(false);
    }
  };

  return (
    <Layout user={user} activePage="scanner">
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-slate-900" data-testid="page-title">
            QR Code Scanner
          </h1>
          <p className="text-slate-600 mt-1">Scan batch QR codes for quick access</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-semibold">Camera Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              {!scanning && !scannedData && (
                <div className="text-center py-12">
                  <Button
                    data-testid="start-scanner-btn"
                    onClick={startScanner}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Start Camera Scanner
                  </Button>
                </div>
              )}

              {scanning && (
                <div>
                  <div id="qr-scanner" className="mb-4"></div>
                  <Button
                    data-testid="stop-scanner-btn"
                    onClick={stopScanner}
                    variant="outline"
                    className="w-full"
                  >
                    Stop Scanning
                  </Button>
                </div>
              )}

              {scannedData && (
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">Scan Successful!</h3>
                  </div>
                  <Button
                    data-testid="scan-again-btn"
                    onClick={() => {
                      setScannedData(null);
                      startScanner();
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Scan Another Batch
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scanned Data Card */}
          {scannedData && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading font-semibold">Batch Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">Batch ID</p>
                    <p className="text-lg font-mono font-semibold text-slate-900">{scannedData.batch_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Farmer ID</p>
                    <p className="text-lg font-semibold text-slate-900">{scannedData.farmer_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Weight</p>
                    <p className="text-lg font-semibold text-slate-900">{scannedData.weight_kg} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Size Grade</p>
                    <p className="text-lg font-semibold text-slate-900">{scannedData.size_grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Intake Date</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(scannedData.intake_date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default QRScanner;
