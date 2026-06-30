import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
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

  // States for Profile Update Modal
  const [showProfileUpdate, setShowProfileUpdate] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [updateFullName, setUpdateFullName] = useState('');
  const [updatePhone, setUpdatePhone] = useState('');
  const [updateAddress, setUpdateAddress] = useState('');

  // States for OTP Modal
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');

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
      // --- Đã xóa Dummy Login. Giờ sẽ gọi thẳng API xuống Backend ---

      // GỌI API XUỐNG BACKEND: Gửi yêu cầu đăng nhập (POST) đến Endpoint /api/Auth/login
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/Auth/login', {
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
        
        if (errText === 'EmailNotVerified' || response.status === 403) {
           setOtpEmail(email);
           setShowOtpModal(true);
           toast.error('Tài khoản chưa xác thực Email. Vui lòng kiểm tra email để lấy mã OTP.');
           return;
        }

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
      if (loggedInUser.tier === 'Admin') {
        window.location.href = '/admin';
      } else if (loggedInUser.tier === 'Staff' || loggedInUser.tier === 'BranchManager') {
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

  const handleGoogleSuccess = async (credentialResponse) => {
    // This is the JWT token provided by Google
    const googleToken = credentialResponse.credential;
    setLoading(true);

    try {
      // Gửi Token này xuống Backend để xác thực và lấy Token hệ thống
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/Auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: googleToken
        })
      });

      if (!response.ok) {
        let errText = 'Đăng nhập Google thất bại.';
        try {
          const errData = await response.json();
          if (errData.message) errText = errData.message;
        } catch (jsonErr) {}
        throw new Error(errText);
      }

      const data = await response.json();
      
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

      if (data.requiresProfileUpdate) {
        setTempUser(loggedInUser);
        setUpdateFullName(data.fullName);
        setShowProfileUpdate(true);
        toast('Vui lòng bổ sung SĐT và Địa chỉ để hoàn tất!', { icon: 'ℹ️' });
      } else {
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        toast.success(`Đăng nhập thành công! Chào mừng ${loggedInUser.fullName}`);
        window.location.href = '/';
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Lỗi kết nối Backend xử lý Google Login.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Có lỗi xảy ra khi bật cửa sổ Đăng nhập Google.');
  };

  const handleProfileUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/Auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempUser.token}`
        },
        body: JSON.stringify({
          fullName: updateFullName,
          phone: updatePhone,
          address: updateAddress
        })
      });

      if (!response.ok) {
        throw new Error('Lỗi cập nhật hồ sơ');
      }

      // Cập nhật lại thông tin mới nhất vào user local
      const finalUser = { ...tempUser, fullName: updateFullName };
      localStorage.setItem('user', JSON.stringify(finalUser));
      
      toast.success(`Tuyệt vời! Chào mừng ${finalUser.fullName} đến với LunaWash!`);
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi khi lưu thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/Auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp: otpCode })
      });
      if (!response.ok) throw new Error('Mã OTP không hợp lệ hoặc đã hết hạn.');
      toast.success('Xác thực email thành công! Vui lòng bấm Đăng nhập lại.');
      setShowOtpModal(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/Auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail })
      });
      if (!response.ok) throw new Error('Không thể gửi lại OTP.');
      toast.success('Đã gửi lại mã OTP. Vui lòng kiểm tra hộp thư đến hoặc mục thư rác.');
    } catch (err) {
      toast.error(err.message);
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
                placeholder="email@example.com" 
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
          
          <div className="relative flex items-center justify-center mt-6 mb-4">
            <span className="absolute inset-x-0 h-px bg-outline-variant/30"></span>
            <span className="relative bg-white px-4 text-sm text-on-surface-variant font-medium">Hoặc</span>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
            />
          </div>
          
          <div className="text-center pt-4">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Chưa có tài khoản? 
              <Link className="text-primary font-bold hover:underline ml-1" to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </form>
      </div>

      {/* Modal Cập nhật thông tin bắt buộc */}
      {showProfileUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-[500px] w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-primary mb-2">Hoàn tất đăng ký</h2>
            <p className="text-on-surface-variant mb-6 text-sm">
              Tài khoản Google của bạn không kèm số điện thoại. Vui lòng bổ sung để LunaWash có thể liên hệ và tích điểm cho bạn nhé!
            </p>
            <form onSubmit={handleProfileUpdateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Họ và Tên</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={updateFullName}
                  onChange={e => setUpdateFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Số điện thoại</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={updatePhone}
                  onChange={e => setUpdatePhone(e.target.value)}
                  placeholder="Ví dụ: 0901234567"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Địa chỉ</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={updateAddress}
                  onChange={e => setUpdateAddress(e.target.value)}
                  placeholder="Nhập địa chỉ của bạn"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary text-white font-bold py-3 mt-4 rounded-xl hover:bg-primary-container transition-all"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu và vào hệ thống'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nhập OTP */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-[400px] w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <span className="material-symbols-outlined text-3xl">mark_email_read</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Xác thực Email</h2>
            <p className="text-on-surface-variant mb-6 text-sm">
              Tài khoản của bạn chưa được xác thực. Chúng tôi đã gửi một mã OTP gồm 6 chữ số đến email <strong>{otpEmail}</strong>. Vui lòng kiểm tra và nhập mã.
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input 
                type="text" 
                maxLength="6"
                className="w-full text-center text-2xl tracking-[10px] font-bold px-4 py-3 border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="------"
                required
              />
              <button 
                type="submit" 
                className="w-full bg-primary text-white font-bold py-3 mt-4 rounded-xl hover:bg-primary-container transition-all"
                disabled={loading || otpCode.length < 6}
              >
                {loading ? 'Đang xác thực...' : 'Xác nhận OTP'}
              </button>
            </form>
            <p className="mt-6 text-sm text-on-surface-variant">
              Chưa nhận được mã? <button onClick={handleResendOtp} type="button" className="text-primary font-bold hover:underline">Gửi lại</button>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
