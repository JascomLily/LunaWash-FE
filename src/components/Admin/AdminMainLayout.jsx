import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminMainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đọc user thật từ localStorage
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  // Guard: nếu không có user hoặc không có token → redirect về login
  useEffect(() => {
    if (!storedUser || !storedUser.token || storedUser.tier !== 'Admin') {
      navigate('/login', { replace: true });
    }
  }, [storedUser, navigate]);

  const user = storedUser || {
    fullName: 'Admin',
    tier: 'Admin',
    email: '',
    avatarUrl: null,
    token: null
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path || (path !== '/admin' && location.pathname.includes(path));

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-[64px] text-error mb-4">desktop_access_disabled</span>
        <h1 className="text-2xl font-bold text-error mb-2">Truy cập bị từ chối</h1>
        <p className="text-on-surface-variant font-medium">
          Trang quản trị (Admin) chỉ được phép sử dụng trên máy tính bàn (Desktop) tại cơ quan.<br/>
          Vui lòng mở rộng cửa sổ trình duyệt hoặc đăng nhập bằng máy tính.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md flex flex-col">
      {/* Top Header - Matching Navbar.jsx style */}
      <header className="bg-surface/90 backdrop-blur-md text-primary font-title-md fixed w-full top-0 left-0 right-0 z-50 h-20 shadow-sm border-b border-outline-variant/20">
        <div className="flex justify-between items-center w-full px-6 md:px-10 h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <NavLink to="/admin/dashboard" className="font-display-lg text-display-lg font-bold text-primary flex items-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMIHwZp8RLc19nD4KtDTiu2Q4Nfx7irfa6j_R-1Cel5RXbphsnQnvgVnZk42WxpmbzInAHYM11SRsJDI2Vp8k74kreh2jUhGvsm0YkwUKn4m2KbN1qy9siwvSSQUGmk6arV6AcHgzQ2o8l26YiRZdItVWCMkAPPqZORnpv3MSrKdX0mbqFdWa2CiA65ioUN4VlN0bi3leO-qXk8jgudqm56MsW4gVgQXOkH-PScpiJ2aQItKCWjdLS77HETiuOPKOmywUITMCVN9g"
                alt="LunaWash Logo"
                className="h-12 w-auto object-contain"
              />
            </NavLink>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 ml-4">
              <NavLink
                to="/admin/dashboard"
                className={`transition-colors py-2 border-b-2 text-sm ${
                  isActive('/admin/dashboard') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant font-semibold border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Trang Chủ
              </NavLink>
              <NavLink
                to="/admin/employees"
                className={`transition-colors py-2 border-b-2 text-sm ${
                  isActive('/admin/employees') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant font-semibold border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Quản lý nhân viên
              </NavLink>
              <NavLink
                to="/admin/settings"
                className={`transition-colors py-2 border-b-2 text-sm ${
                  isActive('/admin/settings') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant font-semibold border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Cài đặt hệ thống
              </NavLink>
              <NavLink
                to="/admin/feedback"
                className={`transition-colors py-2 border-b-2 text-sm ${
                  isActive('/admin/feedback') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant font-semibold border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Thông báo & Phản hồi
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Bell Icon */}
            <button 
              className="relative text-on-surface-variant/80 hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low select-none flex items-center justify-center"
              title="Thông báo"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-error ring-2 ring-white"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 border border-outline-variant/60 rounded-full hover:bg-surface-container-low transition-all duration-200 shadow-sm"
              >
                <img
                  src={user.avatarUrl || '/default-avatar.svg'}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-outline-variant/40 shadow-sm flex-shrink-0"
                />
                <div className="flex flex-col text-left leading-tight gap-0.5 hidden sm:flex">
                  <span className="font-bold text-xs text-on-surface-variant max-w-[110px] truncate">
                    {user.fullName}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wide text-primary">
                    {user.tier}
                  </span>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-surface-container-lowest rounded-2xl p-4 shadow-2xl border border-outline-variant/30 z-50">
                  <div className="flex items-center gap-3 pb-3 mb-2 border-b border-outline-variant/20">
                    <img
                      src={user.avatarUrl || '/default-avatar.svg'}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full object-cover border border-outline-variant/30 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-primary text-base truncate leading-tight">
                        {user.fullName}
                      </h4>
                      <p className="text-xs text-on-surface-variant truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-outline-variant/20 mt-2 pt-2">
                    <button
                      onClick={() => {
                        localStorage.removeItem('user');
                        window.location.href = '/';
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-container/20 rounded-xl transition-all font-bold text-left"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminMainLayout;
