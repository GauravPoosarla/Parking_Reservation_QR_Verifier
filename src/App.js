import React, { useState } from "react";
import QrReader from "react-qr-scanner";
import axios from "axios";

function App() {
  const [scannedData, setScannedData] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [reservationValid, setReservationValid] = useState(null);
  const [showQrReader, setShowQrReader] = useState(false);

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
        "https://dudum.serveo.net/verify-qr", //change this server url everything you run from serveo and publish again
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
      <button className="bg-purple-700 text-white px-4 py-2 rounded-md mb-4" onClick={() => setShowQrReader(!showQrReader)}>
        {showQrReader ? "Hide QR Scanner" : "Show QR Scanner"}
      </button>
      <div className="mb-4">
        {showQrReader && (
          <QrReader
          onError={handleError}
          onScan={handleScan}
          style={{ width: "80%", maxWidth: "300px"}}
          facingMode="environment"
        />)}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">
          Reservation:
        </h2>
        {apiResponse ? (
          <div>
            <table className="table-auto">
              <thead className="bg-purple-700 text-white"> 
                <tr>
                  <th className="px-4 py-2">Slot</th>
                  <th className="px-4 py-2">Start Time</th>
                  <th className="px-4 py-2">End Time</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">{apiResponse.slot}</td>
                  <td className="border px-4 py-2">
                    {apiResponse.startTime}
                  </td>
                  <td className="border px-4 py-2">{apiResponse.endTime}</td>
                  <td className="border px-4 py-2">{apiResponse.date}</td>
                </tr>
              </tbody>
            </table>
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
