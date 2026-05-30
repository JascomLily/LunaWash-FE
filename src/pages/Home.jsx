import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Trang chủ - Hệ thống Rửa xe Thông minh LunaWash.
 * Cập nhật toàn bộ giao diện người dùng sang tiếng Việt có dấu hoàn chỉnh.
 */
export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simple micro-interactions
    document.querySelectorAll('button, a').forEach(elem => {
      elem.addEventListener('mousedown', () => elem.style.transform = 'scale(0.95)');
      elem.addEventListener('mouseup', () => elem.style.transform = '');
      elem.addEventListener('mouseleave', () => elem.style.transform = '');
    });
  }, []);

  return (
    <main className="pt-20">
      {/* Section 1: Hero with Map */}
      <section className="relative h-[600px] w-full overflow-hidden">
        {/* Map Container */}
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover filter brightness-75" 
            alt="Ho Chi Minh City Map" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVp-ElKaKgA0s_v90niy_KwxhEadE7jG27OC3d1jCmHnDauQKEVuMlHROliCs_QHtqoKKvZTfwAelVvIOmHVg9KLnw4Goa2H22D1id4fjnPZTaP0UsHB4Ott_2nWKym7BpgeBD3CyxhitVT4GdZb_OnVfm9FUFD_vGwP1Z_RaE2tN_zxHaxX2rBbGEVkYD1hguoHZ26uG495LorzZxnR5gb9S3mOSppn-BKSw4X1iR06FM08jzf1nPOIbhuw9mqK476UWujEeSfuU"
          />
        </div>
        {/* Overlay Content */}
        <div className="relative z-10 max-w-container-max mx-auto h-full px-margin-desktop flex items-center">
          <div className="glass-card p-8 rounded-xl max-w-md w-full shadow-2xl animate-fade-in-up">
            <h1 className="font-display-lg text-display-lg mb-4 text-primary leading-tight">Trạm rửa xe thông minh</h1>
            <p className="text-on-surface-variant mb-6">Tìm trạm rửa xe tự động gần nhất và trải nghiệm công nghệ vệ sinh ô tô đỉnh cao.</p>
            
            <div className="space-y-4" id="locations">
              <h2 className="font-title-md text-title-md text-secondary border-b border-outline-variant pb-2">Danh sách trạm khu vực</h2>
              <ul className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">location_on</span>
                  <div>
                    <p className="font-bold text-on-surface">LunaWash Quận 1</p>
                    <p className="text-sm text-on-surface-variant">123 Lê Lợi, Phường Bến Thành</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">location_on</span>
                  <div>
                    <p className="font-bold text-on-surface">LunaWash Quận 7</p>
                    <p className="text-sm text-on-surface-variant">456 Nguyễn Văn Linh, Tân Phong</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">location_on</span>
                  <div>
                    <p className="font-bold text-on-surface">LunaWash Thủ Đức</p>
                    <p className="text-sm text-on-surface-variant">789 Võ Văn Ngân, Bình Thọ</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Services Grid */}
      <section className="py-20 px-margin-desktop max-w-container-max mx-auto" id="packages">
        <div className="text-center mb-12">
          <span className="bg-secondary-fixed text-on-secondary-fixed px-4 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider">Dịch vụ hàng đầu</span>
          <h2 className="font-headline-lg text-headline-lg mt-4 text-primary">Chọn gói dịch vụ phù hợp</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/* Package 1 */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:border-secondary transition-all hover:shadow-xl group flex flex-col h-full">
            <div className="mb-4 text-secondary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_car_wash</span>
            </div>
            <h3 className="font-title-md text-title-md mb-2 text-on-surface">Rửa tổng quát</h3>
            <p className="text-on-surface-variant mb-6 flex-grow">Làm sạch thân xe, hút bụi nội thất cơ bản và làm bóng lốp.</p>
            <div className="mt-auto">
              <p className="text-2xl font-black text-primary mb-4">150.000đ</p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-lg border-2 border-secondary text-secondary font-bold hover:bg-secondary hover:text-white transition-all active:scale-95"
              >
                Chọn ngay
              </button>
            </div>
          </div>

          {/* Package 2 */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:border-secondary transition-all hover:shadow-xl group flex flex-col h-full">
            <div className="mb-4 text-secondary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>clean_hands</span>
            </div>
            <h3 className="font-title-md text-title-md mb-2 text-on-surface">Vệ sinh bề mặt</h3>
            <p className="text-on-surface-variant mb-6 flex-grow">Tẩy nhựa đường, bụi sắt và vệ sinh sâu các bề mặt kính.</p>
            <div className="mt-auto">
              <p className="text-2xl font-black text-primary mb-4">250.000đ</p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-lg border-2 border-secondary text-secondary font-bold hover:bg-secondary hover:text-white transition-all active:scale-95"
              >
                Chọn ngay
              </button>
            </div>
          </div>

          {/* Package 3 */}
          <div className="relative bg-surface-container-lowest p-6 rounded-xl border-2 border-primary shadow-lg group flex flex-col h-full overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-on-primary px-3 py-1 text-xs font-bold rounded-bl-lg">PHỔ BIẾN</div>
            <div className="mb-4 text-primary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>electric_car</span>
            </div>
            <h3 className="font-title-md text-title-md mb-2 text-on-surface">Rửa chuyên sâu</h3>
            <p className="text-on-surface-variant mb-6 flex-grow">Quy trình 12 bước, vệ sinh khoang máy và diệt khuẩn nội thất.</p>
            <div className="mt-auto">
              <p className="text-2xl font-black text-primary mb-4">450.000đ</p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary-container transition-all active:scale-95 shadow-md"
              >
                Chọn ngay
              </button>
            </div>
          </div>

          {/* Package 4 */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:border-secondary transition-all hover:shadow-xl group flex flex-col h-full">
            <div className="mb-4 text-secondary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <h3 className="font-title-md text-title-md mb-2 text-on-surface">Đánh bóng</h3>
            <p className="text-on-surface-variant mb-6 flex-grow">Xử lý vết trầy xước nhẹ và phủ lớp wax bảo vệ sơn cao cấp.</p>
            <div className="mt-auto">
              <p className="text-2xl font-black text-primary mb-4">800.000đ</p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-lg border-2 border-secondary text-secondary font-bold hover:bg-secondary hover:text-white transition-all active:scale-95"
              >
                Chọn ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Booking Box */}
      <section className="py-10 px-margin-desktop max-w-container-max mx-auto" id="support">
        <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center bg-primary-container shadow-2xl group">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              className="w-full h-full object-cover opacity-40 scale-105 group-hover:scale-100 transition-transform duration-700" 
              alt="High-tech automatic car wash bay"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcTrY-cpvLID43k740kSwJdlvH4nR7aNeqGW5Tc-kW2SIG0KHYv3Bty8CeNfobCKxYWSOwpW0UtrmuIVT5qNRHHoWxl3mPKOa598zbHKrMFa8z9ZJKuBgr_W_MbY0T04c9Dk6uJIaoNH6mp03981Khgt614tnkr8yeyeOUmRkTTBsqhLv7AB0tLUMaYO6bo5quyRaGXz5bE6AG_mwFXdh2d8w58UKCrTr5voZyk9J4YuOKb4fbzvNEhoBkvxY1mqm5Lqio5pbVo10"
            />
          </div>
          {/* Content */}
          <div className="relative z-10 p-12 md:p-20 max-w-2xl">
            <h2 className="font-display-lg text-display-lg text-white mb-6 leading-tight">Tiết kiệm thời gian, tối ưu quy trình</h2>
            <p className="text-white/80 text-lg mb-10">Hệ thống đặt lịch thông minh giúp bạn không phải chờ đợi. Chỉ cần 30 giây để hoàn tất thủ tục và chọn trạm trống gần nhất.</p>
            <button 
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-4 px-10 py-5 bg-secondary-container text-on-secondary-container rounded-full font-black text-xl hover:bg-secondary-fixed-dim transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
            >
              Đặt lịch ngay
              <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </button>
          </div>
          {/* Abstract Visual */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:flex items-center justify-center p-12">
            <div className="w-full h-2/3 border-4 border-white/20 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary-fixed progress-glow animate-[ping_2s_infinite]"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                <span className="material-symbols-outlined text-8xl">verified</span>
                <span className="font-label-sm mt-4 uppercase">Automated Precision</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
