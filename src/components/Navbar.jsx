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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isCustomer = !user || !['Admin', 'Staff', 'BranchManager', 'TechnicalStaff'].includes(user.tier);

  // Lấy thông tin hạng thành viên (đồng bộ với UserProfile)
  const getTierInfo = () => {
    if (!user) return { label: 'Thành viên', bg: 'from-slate-400 to-slate-500', icon: 'person' };
    const tier = user.tier;
    if (tier === 'Admin') return { label: 'Quản trị viên (Admin)', bg: 'from-rose-600 to-pink-500', icon: 'admin_panel_settings' };
    if (tier === 'BranchManager') return { label: 'Quản lý Chi nhánh', bg: 'from-indigo-600 to-blue-500', icon: 'manage_accounts' };
    if (tier === 'TechnicalStaff') return { label: 'Kỹ Thuật Viên', bg: 'from-slate-700 to-slate-600', icon: 'engineering' };
    if (tier === 'Staff') return { label: 'Nhân viên', bg: 'from-sky-600 to-sky-500', icon: 'support_agent' };
    
    const userTier = tier.toLowerCase();
    if (userTier === 'platinum' || userTier === 'bạch kim' || userTier === 'bach kim') 
      return { label: 'Thành viên Bạch Kim', bg: 'from-slate-500 to-slate-400', icon: 'diamond' };
    if (userTier === 'gold' || userTier === 'vàng' || userTier === 'vang') 
      return { label: 'Thành viên Vàng', bg: 'from-amber-500 to-yellow-400', icon: 'military_tech' };
    if (userTier === 'silver' || userTier === 'bạc' || userTier === 'bac') 
      return { label: 'Thành viên Bạc', bg: 'from-slate-400 to-gray-300', icon: 'military_tech' };
    
    // Mặc định khách hàng là Đồng
    return { label: 'Thành viên Đồng', bg: 'from-orange-700 to-amber-600', icon: 'military_tech' };
  };
  const tierInfo = getTierInfo();

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
        header.classList.add('shadow-md');
      } else {
        header.classList.remove('shadow-md');
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
    <header className="bg-surface/80 backdrop-blur-md text-primary font-title-md text-title-md fixed w-full top-0 left-0 right-0 z-50 shadow-sm border-b border-outline-variant/20 flex flex-col">
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto h-20 shrink-0">
        {/* Logo */}
        {/* Logo */}
        <Link to={(!isCustomer && user) ? (user.tier === 'Admin' ? "/admin" : (user.tier === 'TechnicalStaff' ? "/staff/technical" : "/staff/queue")) : "/"} className="font-display-lg text-display-lg font-bold text-primary flex items-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMIHwZp8RLc19nD4KtDTiu2Q4Nfx7irfa6j_R-1Cel5RXbphsnQnvgVnZk42WxpmbzInAHYM11SRsJDI2Vp8k74kreh2jUhGvsm0YkwUKn4m2KbN1qy9siwvSSQUGmk6arV6AcHgzQ2o8l26YiRZdItVWCMkAPPqZORnpv3MSrKdX0mbqFdWa2CiA65ioUN4VlN0bi3leO-qXk8jgudqm56MsW4gVgQXOkH-PScpiJ2aQItKCWjdLS77HETiuOPKOmywUITMCVN9g"
            alt="LunaWash Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-gutter">
          {isCustomer ? (
            <>
              <Link
                to="/"
                className={`transition-colors py-2 border-b-2 ${
                  isActive('/') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Trang Chủ
              </Link>
              <Link
                to="/booking"
                className={`transition-colors py-2 border-b-2 ${
                  isActive('/booking') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Đặt Lịch
              </Link>
              <Link
                to="/history"
                className={`transition-colors py-2 border-b-2 ${
                  isActive('/history') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Lịch Sử
              </Link>
              <Link
                to="/support"
                className={`transition-colors py-2 border-b-2 ${
                  isActive('/support') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Hỗ Trợ
              </Link>
            </>
          ) : user.tier === 'Admin' ? (
            <>
              <Link
                to="/admin"
                className={`transition-colors py-2 border-b-2 ${
                  isActive('/admin') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Vào Trang Quản Trị
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/staff/queue"
                className={`transition-colors py-2 border-b-2 ${
                  isActive('/staff/queue') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Hàng Đợi Xe
              </Link>
              <Link
                to="/staff/history"
                className={`transition-colors py-2 border-b-2 ${
                  isActive('/staff/history') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Lịch Sử Trạm
              </Link>
              <Link
                to="/staff/feedback"
                className={`transition-colors py-2 border-b-2 ${
                  isActive('/staff/feedback') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Phản Hồi
              </Link>
              <Link
                to="/staff/technical"
                className={`transition-colors py-2 border-b-2 ${
                  isActive('/staff/technical') 
                    ? 'text-primary font-bold border-primary' 
                    : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
                }`}
              >
                Trang Kỹ Thuật
              </Link>
              {user.tier === 'BranchManager' && (
                <Link
                  to="/staff/employees"
                  className={`transition-colors py-2 border-b-2 ${
                    isActive('/staff/employees') 
                      ? 'text-primary font-bold border-primary' 
                      : 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/50'
                  }`}
                >
                  Nhân Sự & Ca Trực
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Action Button or User Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Nút Hamburger cho Mobile */}
          <button 
            className="md:hidden p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-colors flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              {/* Nút Chuông Thông Báo */}
              <button 
                onClick={() => alert("Bạn không có thông báo mới nào.")}
                className="text-on-surface-variant/80 hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low select-none flex items-center justify-center"
                title="Thông báo"
              >
                <span className="material-symbols-outlined text-2xl">notifications</span>
              </button>

              {/* Nút Avatar bo góc sang trọng */}
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => navigate('/user')}
                  onMouseEnter={() => setDropdownOpen(true)}
                  className="flex items-center gap-2.5 px-3 py-1.5 border border-outline-variant/60 rounded-full hover:bg-surface-container-low transition-all duration-200 shadow-sm"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {/* Avatar tròn */}
                  <img
                    src={user.avatarUrl || '/default-avatar.svg'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-outline-variant/40 shadow-sm flex-shrink-0"
                  />

                  {/* Tên + Badge vai trò dạng ribbon */}
                  <div className="flex flex-col text-left leading-tight gap-0.5">
                    <span className="font-bold text-xs text-on-surface-variant max-w-[110px] truncate">
                      {user.fullName}
                    </span>
                    {isCustomer ? (
                      <span className={`relative inline-flex items-center gap-1 px-2 py-[1px] rounded text-white font-black text-[9px] uppercase tracking-widest select-none shadow-sm bg-gradient-to-r ${tierInfo.bg}`}
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)'
                        }}
                      >
                        <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {tierInfo.icon}
                        </span>
                        {tierInfo.label}
                        <span className="text-white/80 px-1">|</span>
                        <span className="text-amber-300 flex items-center gap-0.5">
                          {user.points || 0} pt
                        </span>
                        {/* Trailing spacer to account for clip-path arrow */}
                        <span className="w-2.5 inline-block" />
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold uppercase tracking-wide text-primary">
                        {user.tier === 'Staff' ? 'Nhân viên' : 
                         user.tier === 'BranchManager' ? 'Quản lý' : 
                         user.tier === 'Admin' ? 'Admin' : 
                         user.tier === 'TechnicalStaff' ? 'Kỹ Thuật' : ''}
                      </span>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu (on hover/click if dropdownOpen) */}
                {dropdownOpen && (
                  <div 
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl p-4 shadow-2xl border border-outline-variant/30 z-50 animate-fadeIn"
                  >
                    {/* User info header */}
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

                    {/* Actions Links */}
                    <div className="border-t border-outline-variant/20 pt-2 flex flex-col gap-1">
                      <button 
                        onClick={() => { setDropdownOpen(false); navigate('/user'); }} 
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-xl transition-all font-medium text-left"
                      >
                        <span className="material-symbols-outlined text-lg">account_circle</span>
                        Thông tin cá nhân
                      </button>
                      {isCustomer && (
                        <button 
                          onClick={() => { setDropdownOpen(false); navigate('/user', { state: { scrollToHistory: true } }); }} 
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-xl transition-all font-medium text-left"
                        >
                          <span className="material-symbols-outlined text-lg">calendar_month</span>
                          Lịch sử đặt lịch
                        </button>
                      )}
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

      {/* TẦNG 2 MOBILE: Thanh Profile */}
      {user && (
        <div className="md:hidden w-full bg-surface-container-lowest border-t border-outline-variant/20 px-4 py-2.5 flex items-center justify-between shadow-sm relative z-40 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/user')}>
            <img src={user.avatarUrl || '/default-avatar.svg'} className="w-10 h-10 rounded-full object-cover border-2 border-outline-variant/40 shadow-sm" alt={user.fullName} />
            <div className="flex flex-col text-left leading-tight gap-1">
              <span className="font-bold text-sm text-on-surface-variant">{user.fullName}</span>
              {isCustomer ? (
                <span className={`relative inline-flex items-center gap-1 px-2 py-[2px] rounded text-white font-black text-[10px] uppercase tracking-widest shadow-sm bg-gradient-to-r ${tierInfo.bg}`} style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%)' }}>
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>{tierInfo.icon}</span>
                  {tierInfo.label}
                  <span className="text-white/80 px-1">|</span>
                  <span className="text-amber-300 flex items-center gap-0.5">{user.points || 0} pt</span>
                  <span className="w-2.5 inline-block" />
                </span>
              ) : (
                <span className={`inline-flex items-center gap-1 px-2 py-[2px] rounded text-white font-black text-[10px] uppercase tracking-widest shadow-sm ${tierInfo.bg}`}>
                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>{tierInfo.icon}</span>
                  {tierInfo.label}
                </span>
              )}
            </div>
          </div>
          <button onClick={handleLogout} className="text-error p-2 hover:bg-error/10 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">logout</span>
          </button>
        </div>
      )}

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 w-full h-[calc(100vh-80px)] bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 shadow-2xl flex flex-col z-[45] animate-fadeIn mt-[60px]">
          <div className="flex flex-col p-6 gap-4">
            {isCustomer ? (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`py-4 text-lg font-bold border-b border-outline-variant/20 ${isActive('/') ? 'text-primary' : 'text-on-surface'}`}>Trang Chủ</Link>
                <Link to="/booking" onClick={() => setMobileMenuOpen(false)} className={`py-4 text-lg font-bold border-b border-outline-variant/20 ${isActive('/booking') ? 'text-primary' : 'text-on-surface'}`}>Đặt Lịch</Link>
                <Link to="/history" onClick={() => setMobileMenuOpen(false)} className={`py-4 text-lg font-bold border-b border-outline-variant/20 ${isActive('/history') ? 'text-primary' : 'text-on-surface'}`}>Lịch Sử</Link>
                <Link to="/support" onClick={() => setMobileMenuOpen(false)} className={`py-4 text-lg font-bold border-b border-outline-variant/20 ${isActive('/support') ? 'text-primary' : 'text-on-surface'}`}>Hỗ Trợ</Link>
              </>
            ) : user?.tier === 'Admin' ? (
              <>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={`py-4 text-lg font-bold border-b border-outline-variant/20 ${isActive('/admin') ? 'text-primary' : 'text-on-surface'}`}>Vào Trang Quản Trị</Link>
              </>
            ) : (
              <>
                <Link to="/staff/queue" onClick={() => setMobileMenuOpen(false)} className={`py-4 text-lg font-bold border-b border-outline-variant/20 ${isActive('/staff/queue') ? 'text-primary' : 'text-on-surface'}`}>Hàng Đợi Xe</Link>
                <Link to="/staff/history" onClick={() => setMobileMenuOpen(false)} className={`py-4 text-lg font-bold border-b border-outline-variant/20 ${isActive('/staff/history') ? 'text-primary' : 'text-on-surface'}`}>Lịch Sử Trạm</Link>
                <Link to="/staff/feedback" onClick={() => setMobileMenuOpen(false)} className={`py-4 text-lg font-bold border-b border-outline-variant/20 ${isActive('/staff/feedback') ? 'text-primary' : 'text-on-surface'}`}>Phản Hồi</Link>
                <Link to="/staff/technical" onClick={() => setMobileMenuOpen(false)} className={`py-4 text-lg font-bold border-b border-outline-variant/20 ${isActive('/staff/technical') ? 'text-primary' : 'text-on-surface'}`}>Trang Kỹ Thuật</Link>
                {user?.tier === 'BranchManager' && (
                  <Link to="/staff/employees" onClick={() => setMobileMenuOpen(false)} className={`py-4 text-lg font-bold border-b border-outline-variant/20 ${isActive('/staff/employees') ? 'text-primary' : 'text-on-surface'}`}>Nhân Sự & Ca Trực</Link>
                )}
              </>
            )}
            
            {!user && (
              <div className="flex flex-col gap-3 mt-4">
                <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="py-3 bg-primary text-on-primary rounded-xl font-bold w-full shadow-md">Đăng Nhập</button>
                <button onClick={() => { setMobileMenuOpen(false); navigate('/register'); }} className="py-3 bg-secondary text-on-secondary rounded-xl font-bold w-full shadow-md">Đăng Ký</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
