import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Trang Đăng ký tài khoản - LunaWash.
 * Kết nối trực tiếp với API Backend của hệ thống.
 */
export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hiệu ứng tương tác nền
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const bubbles = document.querySelectorAll('.absolute.-z-10 div');
      if (bubbles.length >= 2) {
        bubbles[0].style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        bubbles[1].style.transform = `translate(${-x * 30}px, ${-y * 30}px)`;
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
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Vui lòng đồng ý với các Điều khoản & Chính sách.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5010/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: fullName,
          email: email,
          phone: phone,
          password: password
        })
      });

      if (!response.ok) {
        let errText = 'Đăng ký tài khoản thất bại.';
        try {
          const errData = await response.json();
          if (errData.message) errText = errData.message;
        } catch (jsonErr) {}
        throw new Error(errText);
      }

      alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập để bắt đầu sử dụng.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Không thể kết nối đến máy chủ Backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center py-24 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-fixed blur-[120px] rounded-full transition-transform duration-300 ease-out"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container blur-[120px] rounded-full transition-transform duration-300 ease-out"></div>
      </div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30">
        {/* Left Side: Visual/Branding */}
        <div className="hidden lg:block relative overflow-hidden">
          <img 
            className="absolute inset-0 w-full h-full object-cover" 
            alt="High-tech automated car wash bay"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu_6sJ_HG0JvZSotkHpVDnPxxdRnHJb7XagoUBsRPxr5OEq6FePHEcm3MmVZ-ibW-9k8M8mRHiwsCRz-nWjFfRx8eu8jLxtqMeStnMYKXoG3vJ6ihIPcqUa5o9a4ngxTpM1mTRA2S7qETPcT9b4N_IN26yoDL585kbYa0r9qYe6DPzUxNo53ko7uncMO56MaE39d0imHrb6nPFBxyhFmMGw8A-6fy4eu6xOzubk90le7nGiFDFAEdE5Z9FPakEiDGgoLFm5HwG-GM"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-12">
            <div className="mb-4">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMIHwZp8RLc19nD4KtDTiu2Q4Nfx7irfa6j_R-1Cel5RXbphsnQnvgVnZk42WxpmbzInAHYM11SRsJDI2Vp8k74kreh2jUhGvsm0YkwUKn4m2KbN1qy9siwvSSQUGmk6arV6AcHgzQ2o8l26YiRZdItVWCMkAPPqZORnpv3MSrKdX0mbqFdWa2CiA65ioUN4VlN0bi3leO-qXk8jgudqm56MsW4gVgQXOkH-PScpiJ2aQItKCWjdLS77HETiuOPKOmywUITMCVN9g" 
                alt="LunaWash" 
                className="h-16 w-auto object-contain mb-4"
              />
            </div>
            <p className="font-body-md text-body-md text-primary-fixed mb-8 max-w-sm">Trải nghiệm dịch vụ chăm sóc xe thông minh hàng đầu với công nghệ tự động hóa tối tân nhất.</p>
            <div className="flex gap-4">
              <div className="flex -space-x-3">
                <img 
                  className="w-10 h-10 rounded-full border-2 border-primary" 
                  alt="Customer 1"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuANzqhG_Tzu8OPe4kgRPOywPIRx3IZFdjvUn5hGcksArjuRtsGdOvyGOjMyk9BFyyFr2vLUCVMouY3q8wRveQC3s2LPKiw7c6VR4dD9A3CFojp1p_2U_lYE6dJhj8sqSk-SIz6KUe0cfqKDNcTagXJQRrbYBpotUQWDzpjwHi_P1pAGTmj1P08bKe-N3if7guTZt3GBGRaAOCHecxkxamD5LnlRv1F-ireaAdO8OjaO414aab20qz85EZT6YVtpAiTUc8YJsTaC8a8"
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-primary" 
                  alt="Customer 2"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW4zfwyWlP2TS-SeWHihY_66_mAL1FmER_ugcteK1SajAlRsYWkfJvvw91w-JeTaI32Xp2MAb4wn7WdXcJcbvUzxpSe0V---A2j6LptwxCoO8zCjwasiJOi92quyZDnPKGVPz37tW2vvNwQjjBDyy0RpqwCTsoOzXRXmlhwRHgsLzZBS3caV5dMKo6OJPGtDSxC6Cx7jxwqZXpcIVxdru38ns8Gnv26GNjKNVjDuydtKiATJUntrCNQUBs4QKwumfFiT41Gb1Rr-Q"
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-primary" 
                  alt="Customer 3"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXrHuGaTWRCTpVRBfXq4p5v4W89Yuqfwqj6tGPZ7Fzh4AfuIESqDMFH1e3rly_ZRedXAEb7BweE9OoVwaUbEKBGPpNLTn_6k9SbeVoTTcGM4jHAb1hbRdW74FpgPzyNumg2MGyp-e_lw2re9DVtyo29ns3ThhdhLJaL9Wp-XKubiiqfcaPX73RzwBvXZ71ZbjrZD6Ff4eLbeJwnJ_kIag9Wa3j6frwohc68lSINoBQi1lDmEW1edHu8N740IWM2ghoG7CrrlYbU20"
                />
              </div>
              <p className="text-white text-sm self-center font-medium">Hơn 50,000+ chủ xe đã tin dùng.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-surface-container-lowest">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Đăng ký tài khoản</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Khởi đầu hành trình chăm sóc xe chuyên nghiệp cùng chúng tôi.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-error-container/20 border border-error/30 rounded-xl text-error text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {errorMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="fullname">Họ tên</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">person</span>
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface" 
                  id="fullname" 
                  placeholder="Nguyễn Văn A" 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="phone">Số điện thoại</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">call</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface" 
                    id="phone" 
                    placeholder="090 123 4567" 
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="email">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                  <input 
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface" 
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
            </div>

            <div className="space-y-2">
              <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="password">Mật khẩu</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                <input 
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface" 
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

            <div className="space-y-2">
              <label className="block font-title-md text-sm text-on-surface-variant ml-1" htmlFor="confirm_password">Xác nhận mật khẩu</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock_reset</span>
                <input 
                  className="w-full pl-12 pr-12 py-4 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface" 
                  id="confirm_password" 
                  placeholder="••••••••" 
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input 
                className="w-5 h-5 text-primary border-outline-variant/50 rounded focus:ring-primary" 
                id="terms" 
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={loading}
              />
              <label className="text-sm text-on-surface-variant cursor-pointer select-none" htmlFor="terms">
                Tôi đồng ý với <a className="text-primary font-bold hover:underline" href="#">Điều khoản</a> và <a className="text-primary font-bold hover:underline" href="#">Chính sách bảo mật</a>.
              </label>
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
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký ngay'
              )}
            </button>
            <div className="text-center pt-4">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Bạn đã có tài khoản? 
                <Link className="text-primary font-bold hover:underline ml-1" to="/login">Đăng nhập</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
