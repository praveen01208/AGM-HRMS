import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth
import Home from './pages/Home';

// Staff
import StaffDashboard from './pages/staff/StaffDashboard';
import LeaveApply from './pages/staff/LeaveApply';
import LeaveStatus from './pages/staff/LeaveStatus';
import LeaveHistory from './pages/staff/LeaveHistory';
import AdjustmentRespond from './pages/staff/AdjustmentRespond';
import StaffProfile from './pages/staff/StaffProfile';

// HOD
import HodDashboard from './pages/hod/HodDashboard';
import HodLeaveList from './pages/hod/HodLeaveList';
import HodLeaveDetail from './pages/hod/HodLeaveDetail';
import HodProfile from './pages/hod/HodProfile';

// Principal
import {
  default as PrincipalDashboard,
  PrincipalLeaveList,
  PrincipalReports,
  PrincipalProfile
} from './pages/principal/PrincipalPages';

// Admin
import {
  default as AdminDashboard,
  AdminStaffList,
  StaffForm,
  CalendarManager,
  AdminReports,
  ResetPassword
} from './pages/admin/AdminPages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Staff Routes */}
        <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/leave/apply" element={<LeaveApply />} />
        <Route path="/staff/leave/status" element={<LeaveStatus />} />
        <Route path="/staff/leave/history" element={<LeaveHistory />} />
        <Route path="/staff/adjustment/respond" element={<AdjustmentRespond />} />
        <Route path="/staff/profile" element={<StaffProfile />} />

        {/* HOD Routes */}
        <Route path="/hod" element={<Navigate to="/hod/dashboard" replace />} />
        <Route path="/hod/dashboard" element={<HodDashboard />} />
        <Route path="/hod/leaves" element={<HodLeaveList />} />
        <Route path="/hod/leaves/:id" element={<HodLeaveDetail />} />
        <Route path="/hod/profile" element={<HodProfile />} />

        {/* Principal Routes */}
        <Route path="/principal" element={<Navigate to="/principal/dashboard" replace />} />
        <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
        <Route path="/principal/leaves" element={<PrincipalLeaveList />} />
        <Route path="/principal/reports" element={<PrincipalReports />} />
        <Route path="/principal/profile" element={<PrincipalProfile />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/staff" element={<AdminStaffList />} />
        <Route path="/admin/staff/add" element={<StaffForm mode="add" />} />
        <Route path="/admin/staff/edit/:id" element={<StaffForm mode="edit" staffId={Number(window.location.pathname.split('/').pop())} />} />
        <Route path="/admin/calendar" element={<CalendarManager />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/reset/staff" element={<ResetPassword type="staff" />} />
        <Route path="/admin/reset/hod" element={<ResetPassword type="hod" />} />

      </Routes>
    </Router>
  );
}

export default App;
