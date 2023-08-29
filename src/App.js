import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

function App() {
  const [scannedData, setScannedData] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  const handleScan = async data => {
    if (data) {
      setScannedData(data);

      try {
        const response = await fetch('http://localhost:8000/verify-qr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ qrCodeData: data }),
        });

        if (response.ok) {
          const responseData = await response.json();
          setApiResponse(responseData);
        } else {
          console.error('API call failed with status:', response.status);
          setApiResponse(null);
        }
      } catch (error) {
        console.error('API call error:', error);
        setApiResponse(null);
      }
    }
  };

  const handleError = err => {
    console.error(err);
  };

  return (
    <div className="App">
      <h1>QR Code Verifier</h1>
      <QrScanner
        onScan={handleScan}
        onError={handleError}
        style={{ width: '100%' }}
      />
      <div>
        <h2>Scanned Data:</h2>
        <p>{scannedData}</p>
      </div>
      <div>
        <h2>API Response:</h2>
        <p>{apiResponse ? JSON.stringify(apiResponse) : 'No response yet'}</p>
      </div>
    </div>
  );
}

export default App;
