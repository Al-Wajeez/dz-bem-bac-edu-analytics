import { Routes, Route } from 'react-router-dom';
import IntroPage from './components/IntroPage';
import DashboardTCL from './components/tcl/DashboardTCL';
import DashboardTCS from './components/tcs/DashboardTCS';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/tcl" element={<DashboardTCL />} />
        <Route path="/tcs" element={<DashboardTCS />} />
      </Routes>
      <Analytics /></>
  );
}

export default App;