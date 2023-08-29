import React, { useState } from "react";
import QrReader from "react-qr-scanner";
import axios from "axios";

function App() {
  const [scannedData, setScannedData] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [reservationValid, setReservationValid] = useState(null);

  const handleScan = async (data) => {
    setScannedData(data.text);

    try {
      const mainObject = JSON.parse(data.text);
      const { slot, startTime, endTime, date } = mainObject;
      const requestData = {
        slot,
        startTime,
        endTime,
        date,
      };

      const response = await axios.post(
        "https://deorsum.serveo.net/verify-qr", //change this server url everything you run from serveo
        requestData
      );

      if (response) {
        setApiResponse(response.data);
        if (response.data === "Reservation not found") {
          setReservationValid(false);
        } else {
          setReservationValid(true);
        }
        alert(
          "API call successful. Response: " + JSON.stringify(response.data)
        );
      }
    } catch (error) {
      alert("Error processing QR code data: " + error);
      setApiResponse(null);
      setReservationValid(false);
    }
  };

  const handleError = (err) => {
    alert(err);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <h1 className="text-3xl font-semibold mb-4 text-purple-700">
        QR Code Validator
      </h1>
      <QrReader
        onError={handleError}
        onScan={handleScan}
        style={{ width: "80%", maxWidth: "300px" }}
        facingMode="environment"
      />
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2 text-purple-700">
          Scanned Data:
        </h2>
        <div>
          <pre className="mt-2 text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2 text-purple-700">
          Response from server:
        </h2>
        {apiResponse ? (
          <div>
            <pre className="mt-2 text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-700">No response yet</p>
        )}
      </div>
      <div>
        <p
          className={`${
            reservationValid ? "text-green-600" : "text-red-600"
          } font-bold`}
        >
          {reservationValid
            ? "Reservation is valid"
            : "Reservation is not valid"}
        </p>
      </div>
    </div>
  );
}

export default App;
