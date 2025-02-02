import { useState } from "react";
// import QRCode from "qrcode.react";
import { QRCodeCanvas } from "qrcode.react";

import { v4 as uuidv4 } from "uuid";

// import { db } from "../firebaseConfig";
// import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function Qrgenerator() {
  const [sessionId] = useState(uuidv4());
  const scanUrl = `${window.location.origin}/scan/${sessionId}`;

  const saveSession = async () => {
    await setDoc(doc(db, "sessions", sessionId), { createdAt: new Date() });
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Scan the QR Code</h2>
        <QRCodeCanvas value={scanUrl} size={200} />
        <p className="mt-2 text-gray-600">Session ID: {sessionId}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={saveSession}
        >
          Save Session
        </button>
      </div>
    </>
  );
}
