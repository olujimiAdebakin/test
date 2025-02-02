import { useEffect, useState } from "react";
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                OS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {scans.map((scan, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {scan.deviceInfo?.os}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {scan.location?.lat}, {scan.location?.lon}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {scan.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {scan.imageUrl && (
                    <img
                      src={scan.imageUrl}
                      alt="Captured"
                      className="w-32 rounded-lg"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
