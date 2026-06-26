import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { StaffDashboard, HodDashboard, PrincipalDashboard, AdminDashboard } from './pages/Placeholders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/staff/*"     element={<StaffDashboard />} />
        <Route path="/hod/*"       element={<HodDashboard />} />
        <Route path="/principal/*" element={<PrincipalDashboard />} />
        <Route path="/admin/*"     element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
