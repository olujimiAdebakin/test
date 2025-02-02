// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwjBohk4Yo2fCn_zf9-Sy4Mt_mzKQkdBY",
  authDomain: "noughtaegis-b314c.firebaseapp.com",
  projectId: "noughtaegis-b314c",
  storageBucket: "noughtaegis-b314c.firebasestorage.app",
  messagingSenderId: "417401174288",
  appId: "1:417401174288:web:001506903a4cdd95ad8d95",
  measurementId: "G-EW4LL0P7W7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { db, storage, analytics };