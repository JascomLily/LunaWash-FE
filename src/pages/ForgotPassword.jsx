import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Vui lòng nhập địa chỉ email.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/Auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      if (!response.ok) {
        throw new Error('Email không tồn tại trong hệ thống.');
      }
      setOtpSent(true);
      setSuccessMsg(`Mã OTP đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư.`);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/Auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, otp: otp, newPassword: newPassword })
      });
      
      if (!response.ok) {
        throw new Error('Mã OTP không hợp lệ hoặc đã hết hạn.');
      }
      
      setSuccessMsg('Đổi mật khẩu thành công! Bạn có thể quay lại đăng nhập.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center py-24 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
      {/* Nền background tương tự trang Login */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-fixed blur-[120px] rounded-full transition-transform duration-300 ease-out"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container blur-[120px] rounded-full transition-transform duration-300 ease-out"></div>
      </div>

      <div className="w-full max-w-[500px] bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 p-8 md:p-12 relative">
        <div className="mb-10 text-center">
          <span className="material-symbols-outlined text-5xl text-primary mb-4">lock_reset</span>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Quên mật khẩu</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Vui lòng nhập email bạn đã đăng ký để nhận mã xác minh OTP lấy lại mật khẩu.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-error-container/20 border border-error/30 rounded-xl text-error text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-primary-container/20 border border-primary/30 rounded-xl text-primary text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            {successMsg}
          </div>
        )}

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="email">Địa chỉ Email</label>
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
                disabled={loading || otpSent}
              />
            </div>
          </div>

          {otpSent && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="otp">Mã OTP</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline font-medium">pin</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 tracking-[0.5em] font-bold bg-surface-container-low/75 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface text-center disabled:opacity-50" 
                    id="otp" 
                    placeholder="------" 
                    type="text"
                    maxLength="6"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    disabled={loading || successMsg.includes('thành công')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="newPassword">Mật khẩu mới</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline font-medium">lock</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low/75 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface disabled:opacity-50" 
                    id="newPassword" 
                    placeholder="••••••••" 
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading || successMsg.includes('thành công')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline font-medium">lock_reset</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low/75 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface disabled:opacity-50" 
                    id="confirmPassword" 
                    placeholder="••••••••" 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading || successMsg.includes('thành công')}
                  />
                </div>
              </div>
            </div>
          )}

          {!otpSent ? (
            <button 
              className="w-full bg-primary text-on-primary font-title-md text-title-md py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform active:scale-[0.98] hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
              type="button"
              onClick={handleSendOtp}
              disabled={loading || !email}
            >
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
              {!loading && <span className="material-symbols-outlined">send</span>}
            </button>
          ) : (
            <button 
              className="w-full bg-primary text-on-primary font-title-md text-title-md py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 transform active:scale-[0.98] hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 4 || !newPassword || successMsg.includes('thành công')}
            >
              {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
              {!loading && <span className="material-symbols-outlined">save</span>}
            </button>
          )}

          <div className="text-center pt-4 border-t border-outline-variant/30">
            <Link className="flex items-center justify-center gap-1 font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" to="/login">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Quay lại Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
