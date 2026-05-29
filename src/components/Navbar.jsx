import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

/**
 * Navbar component dùng chung cho toàn bộ giao diện LunaWash.
 * Chuyển đổi toàn bộ liên kết điều hướng sang tiếng Việt có dấu.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

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

        {/* Action Button */}
        <div className="flex items-center gap-4">
          {location.pathname === '/login' ? (
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
          )}
        </div>
      </div>
    </header>
  );
}
