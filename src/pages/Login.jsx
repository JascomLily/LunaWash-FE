import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Trang Đăng nhập - LunaWash.
 * Hỗ trợ lưu trữ trạng thái người dùng cục bộ (localStorage) khi đăng nhập thành công.
 * Tự động phân tách hạng thành viên theo email nhập vào để khớp với dữ liệu mẫu của Database.
 */
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Background decorative movement
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const bubbles = document.querySelectorAll('.absolute.pointer-events-none');
      if (bubbles.length >= 2) {
        bubbles[0].style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        bubbles[1].style.transform = `translate(${-x * 20}px, ${-y * 20}px)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const togglePasswordVisibility = () => {
    const passInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggle-icon');
    if (passInput && toggleIcon) {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      toggleIcon.textContent = isPass ? 'visibility_off' : 'visibility';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Giả lập phân tách thông tin đăng nhập theo email khớp với Seed Data của SQL Server
    let loggedInUser = {
      fullName: 'Tran Khach Hang Member',
      email: email,
      tier: 'Member',
      avatarUrl: null
    };

    if (email.toLowerCase() === 'customer2@gmail.com' || email.toLowerCase() === 'gold@gmail.com') {
      loggedInUser = {
        fullName: 'Pham Khach Vang',
        email: email,
        tier: 'Gold',
        avatarUrl: null
      };
    } else if (email.toLowerCase() === 'admin@lunawash.com') {
      loggedInUser = {
        fullName: 'Nguyen Van Admin',
        email: email,
        tier: 'Admin',
        avatarUrl: null
      };
    } else if (email.toLowerCase() === 'staff1@lunawash.com') {
      loggedInUser = {
        fullName: 'Le Nhan Vien 1',
        email: email,
        tier: 'Staff',
        avatarUrl: null
      };
    }

    // Lưu vào localStorage để duy trì phiên đăng nhập ở Frontend
    localStorage.setItem('user', JSON.stringify(loggedInUser));

    alert(`Đăng nhập thành công! Chào mừng ${loggedInUser.fullName} quay lại với LunaWash.`);
    
    // Tải lại trang chủ để cập nhật tức thì Header mà không cần cơ chế phức tạp
    window.location.href = '/';
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center relative overflow-hidden px-margin-mobile md:px-0 py-24">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-secondary-fixed/20 rounded-full blur-[100px] pointer-events-none transition-transform duration-300 ease-out"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[100px] pointer-events-none transition-transform duration-300 ease-out"></div>

      <div className="w-full max-w-[500px] glass-card p-8 md:p-12 rounded-3xl shadow-2xl border border-outline-variant/30 relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMIHwZp8RLc19nD4KtDTiu2Q4Nfx7irfa6j_R-1Cel5RXbphsnQnvgVnZk42WxpmbzInAHYM11SRsJDI2Vp8k74kreh2jUhGvsm0YkwUKn4m2KbN1qy9siwvSSQUGmk6arV6AcHgzQ2o8l26YiRZdItVWCMkAPPqZORnpv3MSrKdX0mbqFdWa2CiA65ioUN4VlN0bi3leO-qXk8jgudqm56MsW4gVgQXOkH-PScpiJ2aQItKCWjdLS77HETiuOPKOmywUITMCVN9g" 
              alt="LunaWash Logo" 
              className="h-14 w-auto object-contain"
            />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Đăng nhập</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Chào mừng bạn quay trở lại với LunaWash.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="email">Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline font-medium">mail</span>
              <input 
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low/75 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface" 
                id="email" 
                placeholder="customer1@gmail.com" 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="password">Mật khẩu</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline font-medium">lock</span>
              <input 
                className="w-full pl-12 pr-12 py-4 bg-surface-container-low/75 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface" 
                id="password" 
                placeholder="••••••••" 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" 
                type="button"
                onClick={togglePasswordVisibility}
              >
                <span className="material-symbols-outlined" id="toggle-icon">visibility</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <input 
                className="w-5 h-5 text-primary border-outline-variant/50 rounded focus:ring-primary" 
                id="remember" 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="text-sm text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <a className="text-sm text-primary font-bold hover:underline" href="#">Quên mật khẩu?</a>
          </div>

          <button 
            className="w-full bg-primary text-on-primary font-title-md text-title-md py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform active:scale-[0.98] hover:bg-primary-container" 
            type="submit"
          >
            Đăng nhập ngay
          </button>
          
          <div className="text-center pt-4">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Chưa có tài khoản? 
              <Link className="text-primary font-bold hover:underline ml-1" to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
