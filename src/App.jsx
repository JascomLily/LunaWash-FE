import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import Booking from './pages/Booking';
import BookingHistory from './pages/BookingHistory';
import Support from './pages/Support';
import Payment from './pages/Payment';
import Feedback from './pages/Feedback';
import StaffQueue from './pages/StaffQueue';
import BranchHistory from './pages/BranchHistory';
import BranchFeedback from './pages/BranchFeedback';
import ManagerStaff from './pages/ManagerStaff';
import TechnicalPage from './pages/TechnicalPage';

import ForgotPassword from './pages/ForgotPassword';

/**
 * Route guard để bảo vệ các tuyến đường Staff và Manager
 */
function ProtectedRoute({ children, allowedRoles }) {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }
  try {
    const user = JSON.parse(storedUser);
    if (!allowedRoles.includes(user.tier)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
          <span className="material-symbols-outlined text-6xl text-error mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
            gpp_bad
          </span>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Bạn không có quyền hạn</h2>
          <p className="text-on-surface-variant max-w-md">
            Bạn không có quyền truy cập vào khu vực này. Vui lòng chuyển sang các tab chức năng phù hợp với nghiệp vụ của bạn.
          </p>
        </div>
      );
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

import { Toaster } from 'react-hot-toast';

/**
 * App component chinh de thiet lap dinh tuyen (Routing) cac trang giao dien
 * va ap dung Navbar / Footer dong bo cho toan bo he thong.
 */
function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col min-h-screen bg-background text-on-background">
        {/* Thanh dieu huong dinh kem */}
        <Navbar />

        {/* Khong gian noi dung dong */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/history" element={<BookingHistory />} />
            <Route path="/support" element={<Support />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/feedback" element={<Feedback />} />

            {/* Phân hệ Nhân viên & Quản lý */}
            <Route path="/staff/queue" element={
              <ProtectedRoute allowedRoles={['Staff', 'BranchManager']}>
                <StaffQueue />
              </ProtectedRoute>
            } />
            <Route path="/staff/history" element={
              <ProtectedRoute allowedRoles={['Staff', 'BranchManager']}>
                <BranchHistory />
              </ProtectedRoute>
            } />
            <Route path="/staff/feedback" element={
              <ProtectedRoute allowedRoles={['Staff', 'BranchManager', 'TechnicalStaff']}>
                <BranchFeedback />
              </ProtectedRoute>
            } />
            <Route path="/staff/employees" element={
              <ProtectedRoute allowedRoles={['BranchManager']}>
                <ManagerStaff />
              </ProtectedRoute>
            } />
            <Route path="/staff/technical" element={
              <ProtectedRoute allowedRoles={['TechnicalStaff', 'BranchManager']}>
                <TechnicalPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>

        {/* Chan trang dong bo */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
