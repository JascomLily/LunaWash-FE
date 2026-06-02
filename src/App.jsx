import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';

/**
 * App component chinh de thiet lap dinh tuyen (Routing) cac trang giao dien
 * va ap dung Navbar / Footer dong bo cho toan bo he thong.
 */
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-on-background">
        {/* Thanh dieu huong dinh kem */}
        <Navbar />

        {/* Khong gian noi dung dong */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<UserProfile />} />
          </Routes>
        </div>

        {/* Chan trang dong bo */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
