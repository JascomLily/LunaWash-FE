import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Trang chủ (Home) - Hệ thống Rửa xe Thông minh LunaWash.
 * Thiết kế khớp hoàn hảo với ảnh thiết kế số 1 của khách hàng.
 */
export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
    }

    // Hiệu ứng tương tác micro-interactions nhẹ nhàng cho các nút bấm
    document.querySelectorAll('button, a').forEach(elem => {
      const handleMouseDown = () => elem.style.transform = 'scale(0.97)';
      const handleMouseUp = () => elem.style.transform = '';
      const handleMouseLeave = () => elem.style.transform = '';

      elem.addEventListener('mousedown', handleMouseDown);
      elem.addEventListener('mouseup', handleMouseUp);
      elem.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        elem.removeEventListener('mousedown', handleMouseDown);
        elem.removeEventListener('mouseup', handleMouseUp);
        elem.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  const handleActionClick = (packageName) => {
    if (isLoggedIn) {
      alert(`Bạn đã chọn gói "${packageName}". Hệ thống đang chuyển đến trang thanh toán/đặt lịch của trạm.`);
      navigate('/user');
    } else {
      navigate('/login');
    }
  };

  return (
    <main className="pt-20 bg-background text-on-background">
      
      {/* SECTION 1: HERO CONTAINER WITH MAP */}
      <section className="relative h-[550px] w-full overflow-hidden">
        {/* Nền bản đồ công nghệ cao */}
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover filter brightness-90 contrast-105" 
            alt="LunaWash Tech Map" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVp-ElKaKgA0s_v90niy_KwxhEadE7jG27OC3d1jCmHnDauQKEVuMlHROliCs_QHtqoKKvZTfwAelVvIOmHVg9KLnw4Goa2H22D1id4fjnPZTaP0UsHB4Ott_2nWKym7BpgeBD3CyxhitVT4GdZb_OnVfm9FUFD_vGwP1Z_RaE2tN_zxHaxX2rBbGEVkYD1hguoHZ26uG495LorzZxnR5gb9S3mOSppn-BKSw4X1iR06FM08jzf1nPOIbhuw9mqK476UWujEeSfuU"
          />
          {/* Lớp phủ chuyển sắc xanh đậm đặc trưng */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/45 pointer-events-none"></div>
        </div>

        {/* Nội dung hộp kính bên trái */}
        <div className="relative z-10 max-w-container-max mx-auto h-full px-margin-desktop flex items-center">
          <div className="glass-card p-8 rounded-3xl max-w-md w-full shadow-2xl animate-fade-in-up border border-outline-variant/30">
            <h1 className="font-display-lg text-4xl mb-3 text-[#00236f] leading-tight font-extrabold">
              Trạm rửa xe <br />thông minh
            </h1>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
              Tìm trạm rửa xe tự động gần nhất và trải nghiệm công nghệ vệ sinh ô tô đỉnh cao.
            </p>
            
            {/* Khối danh sách trạm */}
            <div className="space-y-3" id="locations">
              <h2 className="text-sm font-bold text-[#00236f] border-b border-outline-variant pb-2 uppercase tracking-wider">
                Danh sách trạm khu vực
              </h2>
              <ul className="space-y-2 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
                
                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-primary-fixed/30 transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-[#00236f] group-hover:scale-110 transition-transform font-bold">
                    location_on
                  </span>
                  <div>
                    <p className="font-bold text-on-surface text-sm">LunaWash Quận 1</p>
                    <p className="text-xs text-on-surface-variant">123 Lê Lợi, Phường Bến Thành</p>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-primary-fixed/30 transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-[#00236f] group-hover:scale-110 transition-transform font-bold">
                    location_on
                  </span>
                  <div>
                    <p className="font-bold text-on-surface text-sm">LunaWash Quận 7</p>
                    <p className="text-xs text-on-surface-variant">456 Nguyễn Văn Linh, Tân Phong</p>
                  </div>
                </li>

                <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-primary-fixed/30 transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-[#00236f] group-hover:scale-110 transition-transform font-bold">
                    location_on
                  </span>
                  <div>
                    <p className="font-bold text-on-surface text-sm">LunaWash Thủ Đức</p>
                    <p className="text-xs text-on-surface-variant">789 Võ Văn Ngân, Bình Thọ</p>
                  </div>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CHỌN GÓI DỊCH VỤ PHÙ HỢP */}
      <section className="py-20 px-margin-desktop max-w-container-max mx-auto" id="packages">
        <div className="text-center mb-16">
          <span className="bg-sky-100 text-primary px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest select-none">
            Dịch vụ hàng đầu
          </span>
          <h2 className="text-3xl font-extrabold mt-4 text-[#00236f] tracking-tight">
            Chọn gói dịch vụ phù hợp
          </h2>
        </div>
        
        {/* Lưới 4 gói dịch vụ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          
          {/* GÓI 1: Rửa tổng quát */}
          <div className="bg-surface-container-lowest p-7 rounded-3xl border border-outline-variant/60 hover:border-primary/45 transition-all hover:shadow-xl group flex flex-col h-full">
            <div className="mb-5 text-primary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_car_wash
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-on-surface">Rửa tổng quát</h3>
            <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
              Làm sạch thân xe, hút bụi nội thất cơ bản và làm bóng lốp.
            </p>
            <div className="mt-auto">
              <p className="text-2xl font-black text-primary mb-5">150.000đ</p>
              <button 
                onClick={() => handleActionClick('Rửa tổng quát')}
                className="w-full py-3 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all text-sm shadow-sm hover:shadow active:scale-95"
              >
                Chọn ngay
              </button>
            </div>
          </div>

          {/* GÓI 2: Vệ sinh bề mặt */}
          <div className="bg-surface-container-lowest p-7 rounded-3xl border border-outline-variant/60 hover:border-primary/45 transition-all hover:shadow-xl group flex flex-col h-full">
            <div className="mb-5 text-primary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                dry_cleaning
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-on-surface">Vệ sinh bề mặt</h3>
            <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
              Tẩy nhựa đường, bụi sắt và vệ sinh sâu các bề mặt kính.
            </p>
            <div className="mt-auto">
              <p className="text-2xl font-black text-primary mb-5">250.000đ</p>
              <button 
                onClick={() => handleActionClick('Vệ sinh bề mặt')}
                className="w-full py-3 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all text-sm shadow-sm hover:shadow active:scale-95"
              >
                Chọn ngay
              </button>
            </div>
          </div>

          {/* GÓI 3: Rửa chuyên sâu (Nổi bật nhất) */}
          <div className="relative bg-surface-container-lowest p-7 rounded-3xl border-2 border-[#00236f] shadow-lg hover:shadow-2xl transition-all group flex flex-col h-full overflow-hidden">
            {/* Nhãn PHỔ BIẾN ở góc trên bên phải */}
            <div className="absolute top-0 right-0 bg-[#00236f] text-white px-4 py-1 text-[10px] font-black rounded-bl-xl uppercase tracking-wider">
              Phổ Biến
            </div>
            <div className="mb-5 text-primary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                electric_car
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-on-surface">Rửa chuyên sâu</h3>
            <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
              Quy trình 12 bước, vệ sinh khoang máy và diệt khuẩn nội thất.
            </p>
            <div className="mt-auto">
              <p className="text-2xl font-black text-primary mb-5">450.000đ</p>
              <button 
                onClick={() => handleActionClick('Rửa chuyên sâu')}
                className="w-full py-3 bg-[#00236f] hover:bg-primary-container text-white font-bold rounded-xl transition-all text-sm shadow-md hover:shadow-lg active:scale-95"
              >
                Chọn ngay
              </button>
            </div>
          </div>

          {/* GÓI 4: Đánh bóng */}
          <div className="bg-surface-container-lowest p-7 rounded-3xl border border-outline-variant/60 hover:border-primary/45 transition-all hover:shadow-xl group flex flex-col h-full">
            <div className="mb-5 text-primary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                diamond
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-on-surface">Đánh bóng</h3>
            <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
              Xử lý vết trầy xước nhẹ và phủ lớp wax bảo vệ sơn cao cấp.
            </p>
            <div className="mt-auto">
              <p className="text-2xl font-black text-primary mb-5">800.000đ</p>
              <button 
                onClick={() => handleActionClick('Đánh bóng')}
                className="w-full py-3 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all text-sm shadow-sm hover:shadow active:scale-95"
              >
                Chọn ngay
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: TIẾT KIỆM THỜI GIAN, TỐI ƯU QUY TRÌNH */}
      <section className="py-12 px-margin-desktop max-w-container-max mx-auto mb-16" id="support">
        <div className="relative rounded-[40px] overflow-hidden min-h-[380px] flex items-center bg-[#0d2e61] shadow-2xl group">
          {/* Ảnh nền trạm rửa xe công nghệ cao */}
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-35 scale-105 group-hover:scale-100 transition-transform duration-700" 
              alt="High-tech automatic car wash bay"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcTrY-cpvLID43k740kSwJdlvH4nR7aNeqGW5Tc-kW2SIG0KHYv3Bty8CeNfobCKxYWSOwpW0UtrmuIVT5qNRHHoWxl3mPKOa598zbHKrMFa8z9ZJKuBgr_W_MbY0T04c9Dk6uJIaoNH6mp03981Khgt614tnkr8yeyeOUmRkTTBsqhLv7AB0tLUMaYO6bo5quyRaGXz5bE6AG_mwFXdh2d8w58UKCrTr5voZyk9J4YuOKb4fbzvNEhoBkvxY1mqm5Lqio5pbVo10"
            />
            {/* Lớp phủ chuyển màu gradient từ trái qua phải */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e61] via-[#0d2e61]/80 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Nội dung bên trái */}
          <div className="relative z-10 p-10 md:p-16 max-w-xl">
            <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
              Tiết kiệm thời gian, tối <br />ưu quy trình
            </h2>
            <p className="text-white/80 text-sm mb-8 leading-relaxed">
              Hệ thống đặt lịch thông minh giúp bạn không phải chờ đợi. Chỉ cần 30 giây để hoàn tất thủ tục và chọn trạm trống gần nhất.
            </p>
            <button 
              onClick={() => handleActionClick('Đặt lịch ngay')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4cd7f6] hover:bg-[#57dffe] text-[#001f26] rounded-full font-black text-base hover:scale-105 transition-all shadow-xl active:scale-95"
            >
              Đặt lịch ngay
              <span className="material-symbols-outlined font-bold text-lg">arrow_forward</span>
            </button>
          </div>

          {/* Phần trang trí trừu tượng bên phải (AUTOMATED PRECISION) */}
          <div className="absolute right-12 bottom-0 top-0 w-1/3 hidden lg:flex items-center justify-center p-8 z-10">
            <div className="w-full h-3/5 border-2 border-white/20 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm shadow-inner">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-[#4cd7f6] progress-glow animate-[ping_2.5s_infinite]"></div>
              <div className="flex flex-col items-center text-center text-white/50 group-hover:text-white/70 transition-all duration-300">
                <span className="material-symbols-outlined text-7xl mb-3" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>
                  verified
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">
                  Automated Precision
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
