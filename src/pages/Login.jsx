import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // GỌI API XUỐNG BACKEND: Gửi yêu cầu đăng nhập (POST) đến Endpoint /api/Auth/login
      const response = await fetch('http://192.168.1.219:5010/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        let errText = 'Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.';
        try {
          const errData = await response.json();
          if (errData.message) errText = errData.message;
        } catch (jsonErr) {}
        throw new Error(errText);
      }

      const data = await response.json();
      // data: { token, fullName, email, role }
      
      // Map role to tier for frontend compatibility
      let tier = 'Member';
      if (data.role === 'Admin') tier = 'Admin';
      else if (data.role === 'Staff') tier = 'Staff';
      else if (data.role === 'BranchManager') tier = 'BranchManager';
      else if (data.role === 'TechnicalStaff') tier = 'TechnicalStaff';
      else if (data.role === 'Customer') tier = data.tier || 'Member';

      const loggedInUser = {
        fullName: data.fullName,
        email: data.email,
        tier: tier,
        branchId: data.branchId || null,
        branchName: data.branchName || null,
        token: data.token,
        points: data.currentPoints || 0,
        avatarUrl: null
      };

      // Lưu vào localStorage để duy trì phiên đăng nhập ở Frontend
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      toast.success(`Đăng nhập thành công! Chào mừng ${loggedInUser.fullName}`);
      
      // Chuyển hướng trực tiếp dựa trên vai trò để tránh hiện trang chủ
      if (loggedInUser.tier === 'Staff' || loggedInUser.tier === 'BranchManager') {
        window.location.href = '/staff/queue';
      } else if (loggedInUser.tier === 'TechnicalStaff') {
        window.location.href = '/staff/technical';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Không thể kết nối đến máy chủ Backend.');
    } finally {
      setLoading(false);
    }
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
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low/75 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface disabled:opacity-50" 
                id="email" 
                placeholder="customer1@gmail.com" 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="password">Mật khẩu</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline font-medium">lock</span>
              <input 
                className="w-full pl-12 pr-12 py-4 bg-surface-container-low/75 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface disabled:opacity-50" 
                id="password" 
                placeholder="••••••••" 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" 
                type="button"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                <span className="material-symbols-outlined" id="toggle-icon">visibility</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <input 
                className="w-5 h-5 text-primary border-outline-variant/50 rounded focus:ring-primary disabled:opacity-50" 
                id="remember" 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label className="text-sm text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <Link className="text-sm text-primary font-bold hover:underline" to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          <button 
            className="w-full bg-primary text-on-primary font-title-md text-title-md py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform active:scale-[0.98] hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập ngay'
            )}
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
