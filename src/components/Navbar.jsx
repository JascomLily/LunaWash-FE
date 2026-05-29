import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

/**
 * Navbar component dùng chung cho toàn bộ giao diện LunaWash.
 * Hỗ trợ hiển thị Avatar và dropdown của người dùng khi đã đăng nhập.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy thông tin user từ localStorage khi mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Lỗi phân tích cú pháp user từ localStorage:', e);
      }
    }
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (!header) return;
      if (window.scrollY > 20) {
        header.classList.add('shadow-lg', 'h-16');
        header.classList.remove('h-20');
      } else {
        header.classList.remove('shadow-lg', 'h-16');
        header.classList.add('h-20');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    window.location.href = '/';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const trimmed = name.trim();
    if (trimmed.length === 0) return 'U';
    return trimmed.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-surface/80 backdrop-blur-md text-primary font-title-md text-title-md fixed w-full top-0 left-0 right-0 z-50 h-20 shadow-sm border-b border-outline-variant/20 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-full">
        {/* Logo */}
        <Link to="/" className="font-display-lg text-display-lg font-bold text-primary flex items-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMIHwZp8RLc19nD4KtDTiu2Q4Nfx7irfa6j_R-1Cel5RXbphsnQnvgVnZk42WxpmbzInAHYM11SRsJDI2Vp8k74kreh2jUhGvsm0YkwUKn4m2KbN1qy9siwvSSQUGmk6arV6AcHgzQ2o8l26YiRZdItVWCMkAPPqZORnpv3MSrKdX0mbqFdWa2CiA65ioUN4VlN0bi3leO-qXk8jgudqm56MsW4gVgQXOkH-PScpiJ2aQItKCWjdLS77HETiuOPKOmywUITMCVN9g"
            alt="LunaWash Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-gutter">
          <Link
            to="/"
            className={`transition-colors py-2 border-b-2 ${
              isActive('/') 
                ? 'text-primary font-bold border-primary' 
                : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
            }`}
          >
            Trang chủ
          </Link>
          <a className="text-on-surface-variant hover:text-primary transition-colors py-2 border-b-2 border-transparent" href="#packages">
            Gói dịch vụ
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors py-2 border-b-2 border-transparent" href="#locations">
            Chi nhánh
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors py-2 border-b-2 border-transparent" href="#membership">
            Hội viên
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors py-2 border-b-2 border-transparent" href="#support">
            Hỗ trợ
          </a>
        </nav>

        {/* Action Button or User Profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none transition-transform active:scale-95 duration-200"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-outline-variant/30 hover:border-secondary transition-all shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-lg flex items-center justify-center shadow-md select-none border-2 border-outline-variant/30 hover:border-secondary transition-all">
                    {getInitials(user.fullName)}
                  </div>
                )}
                <span className="hidden sm:inline font-bold text-sm text-on-surface-variant hover:text-primary max-w-[120px] truncate transition-colors">
                  {user.fullName}
                </span>
                <span 
                  className="material-symbols-outlined text-outline text-lg transition-transform duration-300 select-none hidden sm:inline" 
                  style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}
                >
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl p-4 shadow-2xl border border-outline-variant/30 z-50 glass-card animate-fadeIn">
                  {/* User info header */}
                  <div className="flex items-center gap-3 pb-3 mb-2 border-b border-outline-variant/20">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-outline-variant/30 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-xl flex-shrink-0 flex items-center justify-center shadow-sm select-none">
                        {getInitials(user.fullName)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-primary text-base truncate leading-tight">
                        {user.fullName}
                      </h4>
                      <p className="text-xs text-on-surface-variant truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Membership badge */}
                  <div className="py-2 mb-2 flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-outline tracking-wider uppercase">Hạng thành viên</span>
                    {user.tier === 'Gold' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold rounded-full w-fit shadow-sm">
                        <span className="material-symbols-outlined text-xs">star</span>
                        Hội viên Vàng (Gold)
                      </div>
                    ) : user.tier === 'Admin' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-bold rounded-full w-fit shadow-sm">
                        <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
                        Quản trị viên (Admin)
                      </div>
                    ) : user.tier === 'Staff' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs font-bold rounded-full w-fit shadow-sm">
                        <span className="material-symbols-outlined text-xs">badge</span>
                        Nhân viên (Staff)
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-slate-400 to-slate-500 text-white text-xs font-bold rounded-full w-fit shadow-sm">
                        <span className="material-symbols-outlined text-xs">person</span>
                        Hội viên Bạc (Member)
                      </div>
                    )}
                  </div>

                  {/* Actions Links */}
                  <div className="border-t border-outline-variant/20 pt-2 flex flex-col gap-1">
                    <button 
                      onClick={() => { setDropdownOpen(false); alert("Tính năng lịch sử đặt lịch sẽ được cập nhật khi có API BE hoàn chỉnh."); }} 
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-xl transition-all font-medium text-left"
                    >
                      <span className="material-symbols-outlined text-lg">calendar_month</span>
                      Lịch sử đặt lịch
                    </button>
                    <button 
                      onClick={() => { setDropdownOpen(false); alert("Tính năng cài đặt tài khoản sẽ được cập nhật khi có API BE hoàn chỉnh."); }} 
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-xl transition-all font-medium text-left"
                    >
                      <span className="material-symbols-outlined text-lg">settings</span>
                      Cài đặt tài khoản
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-outline-variant/20 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-container/20 rounded-xl transition-all font-bold text-left"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            location.pathname === '/login' ? (
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-secondary text-on-secondary rounded-lg font-bold hover:bg-secondary/90 transition-all active:scale-95 shadow-md"
              >
                Đăng ký
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container transition-all active:scale-95 shadow-md"
              >
                Đăng nhập
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
