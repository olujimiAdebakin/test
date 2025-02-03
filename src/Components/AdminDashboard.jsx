// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebaseConfig";

// const AdminDashboard = () => {
//   const [scans, setScans] = useState([]);

//   useEffect(() => {
//     const fetchScans = async () => {
//       const snapshot = await getDocs(collection(db, "sessions"));
//       setScans(snapshot.docs.map((doc) => doc.data()));
//     };

//     fetchScans();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Captured Data</h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 OS
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Location
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Time
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Image
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {scans.map((scan, index) => (
//               <tr key={index}>
//                 <td className="px-6 py-4  text-sm text-gray-900">
//                   {scan.deviceInfo?.os}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-900">
//                   {scan.location?.lat} {scan.location?.lon}
//                 </td>
//                 <td className="px-6 py-4  text-sm text-gray-900">
//                   {scan.timestamp}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-900">
//                   {scan.imageUrl && (
//                     <img
//                       src={scan.imageUrl}
//                       alt="Captured"
//                       className="w-32 rounded-lg"
//                     />
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AdminDashboard = () => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const fetchScans = async () => {
      const snapshot = await getDocs(collection(db, "sessions"));
      const data = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const scan = doc.data();
          const location = await getReadableLocation(
            scan.location?.lat,
            scan.location?.lon
          );
          return {
            os: simplifyOS(scan.deviceInfo?.os || "Unknown"),
            location,
            timestamp: formatTimestamp(scan.timestamp),
            imageUrl: scan.imageUrl || "",
          };
        })
      );
      setScans(data);
    };

    fetchScans();
  }, []);

  // Convert lat/lon to a readable address
  const getReadableLocation = async (lat, lon) => {
    if (!lat || !lon || lat === "unknown") return "Unknown Location";
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      return data.display_name || "Unknown Location";
    } catch (error) {
      console.error("Error fetching location:", error);
      return "Unknown Location";
    }
  };

  // Simplify OS information
  const simplifyOS = (os) => {
    return os.split("(")[0].trim(); // Removes extra details in brackets
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Captured Data</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scans.map((scan, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden p-4"
          >
            <div className="mb-4">
              <p className="text-gray-600 text-sm">📟 OS: {scan.os}</p>
              <p className="text-gray-600 text-sm">📍 {scan.location}</p>
              <p className="text-gray-600 text-sm">⏰ {scan.timestamp}</p>
            </div>
            {scan.imageUrl && (
              <img
                src={scan.imageUrl}
                alt="Captured"
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
