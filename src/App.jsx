

import { Route, Routes } from 'react-router-dom';
import ScanPage from './Components/ScanPage';
import Qrgenerator from './Components/Qrgenerator';
import AdminDashboard from './Components/AdminDashboard';

const App = () => {
  return (
    <div>
      
        <Routes>
          <Route path="/" element={<Qrgenerator />} />
          <Route path="/scan/:sessionId" element={<ScanPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
     
    </div>
  );
}

export default App