import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function Qrgenerator() {
  const [sessionId] = useState(uuidv4());
  const scanUrl = `${window.location.origin}/scan/${sessionId}`;

  // Automatically save the session when the component is mounted
  useEffect(() => {
    const saveSession = async () => {
      await setDoc(doc(db, "sessions", sessionId), { createdAt: new Date() });
    };

    saveSession(); // Automatically save the session when the component is mounted
  }, [sessionId]); // Ensures that the session is saved whenever the sessionId is created

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full sm:w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Scan the QR Code
        </h2>
        <div className="flex justify-center mb-6">
          <QRCodeCanvas value={scanUrl} size={250} />
        </div>
        <p className="text-center text-gray-700 mb-4">
          Session ID: <span className="font-semibold">{sessionId}</span>
        </p>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            The session has been saved automatically. Please scan the code to
            proceed.
          </p>
        </div>
      </div>
    </div>
  );
}
