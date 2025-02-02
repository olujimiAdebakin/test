import { useEffect, useState } from "react";
// import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AdminDashboard = () => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const fetchScans = async () => {
      const snapshot = await getDocs(collection(db, "sessions"));
      setScans(snapshot.docs.map((doc) => doc.data()));
    };

    fetchScans();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Captured Data</h2>
      {scans.map((scan, index) => (
        <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
          <p>
            <strong>OS:</strong> {scan.deviceInfo?.os}
          </p>
          <p>
            <strong>Location:</strong> {scan.location?.lat},{" "}
            {scan.location?.lon}
          </p>
          <p>
            <strong>Time:</strong> {scan.timestamp}
          </p>
          {scan.imageUrl && (
            <img
              src={scan.imageUrl}
              alt="Captured"
              className="mt-2 w-32 rounded-lg"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
