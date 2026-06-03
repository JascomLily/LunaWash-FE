import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Cấu hình tọa độ bản đồ Google Map cho các chi nhánh của LunaWash
const HOME_BRANCHES = [
  { id: 'BR-LD', name: 'LunaWash Linh Đông', address: 'Thủ Đức, HCM', lat: 10.852445, lng: 106.748364 },
  { id: 'BR-TTH', name: 'LunaWash Tân Thới Hiệp', address: 'Quận 12, HCM', lat: 10.861789, lng: 106.657512 },
  { id: 'BR-Q1', name: 'LunaWash Quận 1', address: '123 Lê Lợi, Bến Thành', lat: 10.772564, lng: 106.698047 },
  { id: 'BR-Q7', name: 'LunaWash Quận 7', address: '456 Nguyễn Văn Linh', lat: 10.729351, lng: 106.702983 },
  { id: 'BR-TB', name: 'LunaWash Tân Bình', address: '789 Cộng Hòa, Phường 13', lat: 10.801648, lng: 106.640954 }
];

/**
 * Trang chủ (Home) - Hệ thống Rửa xe Thông minh LunaWash.
 * Thiết kế khớp hoàn hảo với ảnh thiết kế mới nhất của khách hàng (3 gói dịch vụ đồng bộ).
 */
export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState('BR-LD');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Hiệu ứng camera bay (lướt cái vèo) khi đổi chi nhánh
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [selectedBranchId]);

  // Tính toán URL Map nhúng động theo chi nhánh được chọn
  const selectedBranch = HOME_BRANCHES.find(b => b.id === selectedBranchId) || HOME_BRANCHES[0];
  const embedUrl = `https://maps.google.com/maps?q=${selectedBranch.lat},${selectedBranch.lng}&z=16&ie=UTF8&iwloc=&output=embed`;

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
      navigate('/booking');
    } else {
      navigate('/login');
    }
  };

  return (
    <main className="pt-20 bg-background text-on-background">
      
      {/* SECTION 1: HERO CONTAINER WITH MAP */}
      <section className="relative h-[550px] w-full overflow-hidden">
        {/* Nền bản đồ Google Map thật */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            title="LunaWash Google Map"
            src={embedUrl}
            className={`w-full h-full border-0 filter brightness-95 contrast-105 grayscale-[20%] transition-all duration-700 ease-out ${
              isTransitioning 
                ? 'opacity-30 scale-110 blur-[4px] translate-x-6 translate-y-3' 
                : 'opacity-90 scale-100 blur-0 translate-x-0 translate-y-0'
            }`}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
          {/* Lớp phủ chuyển sắc xanh đậm đặc trưng */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/15 to-primary/35 pointer-events-none"></div>
        </div>

        {/* Nội dung hộp kính bên trái */}
        <div className="relative z-10 max-w-container-max mx-auto h-full px-margin-desktop flex items-center pointer-events-none">
          <div className="glass-card p-8 rounded-3xl max-w-md w-full shadow-2xl animate-fade-in-up border border-outline-variant/30 pointer-events-auto">
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
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {HOME_BRANCHES.map((b) => (
                  <li 
                    key={b.id}
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer group ${
                      selectedBranchId === b.id 
                        ? 'bg-[#00236f]/10 border-l-4 border-[#00236f] pl-1.5' 
                        : 'hover:bg-primary-fixed/30'
                    }`}
                  >
                    <span className={`material-symbols-outlined group-hover:scale-110 transition-transform font-bold ${
                      selectedBranchId === b.id ? 'text-[#00236f]' : 'text-outline/70'
                    }`}>
                      location_on
                    </span>
                    <div>
                      <p className={`font-bold text-sm ${selectedBranchId === b.id ? 'text-[#00236f]' : 'text-on-surface'}`}>{b.name}</p>
                      <p className="text-xs text-on-surface-variant">{b.address}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CHỌN GÓI DỊCH VỤ PHÙ HỢP (Khớp 3 gói mới từ ảnh 5) */}
      <section className="py-20 px-margin-desktop max-w-container-max mx-auto" id="packages">
        <div className="text-center mb-16">
          <span className="bg-sky-100 text-primary px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest select-none">
            Dịch vụ hàng đầu
          </span>
          <h2 className="text-3xl font-extrabold mt-4 text-[#00236f] tracking-tight">
            Chọn gói dịch vụ phù hợp
          </h2>
        </div>
        
        {/* Lưới 3 gói dịch vụ theo thiết kế ảnh 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-5xl mx-auto">
          
          {/* GÓI 1: Cơ bản */}
          <div className="bg-surface-container-lowest p-7 rounded-3xl border border-outline-variant/60 hover:border-primary/45 transition-all hover:shadow-xl group flex flex-col h-full">
            <div className="mb-5 text-primary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                water_drop
              </span>
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="font-bold text-lg text-on-surface">Cơ bản</h3>
              <span className="text-[10px] text-outline font-bold">~15 phút</span>
            </div>
            <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
              Rửa bề mặt, rửa kính, sấy khô.
            </p>
            <div className="mt-auto">
              <p className="text-2xl font-black text-primary mb-5">150.000đ</p>
              <button 
                onClick={() => handleActionClick('Cơ bản')}
                className="w-full py-3 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all text-sm shadow-sm hover:shadow active:scale-95"
              >
                Chọn ngay
              </button>
            </div>
          </div>

          {/* GÓI 2: Nâng cao (Nổi bật nhất - PHỔ BIẾN) */}
          <div className="relative bg-surface-container-lowest p-7 rounded-3xl border-2 border-[#00236f] shadow-lg hover:shadow-2xl transition-all group flex flex-col h-full overflow-hidden">
            {/* Nhãn PHỔ BIẾN ở góc trên bên phải */}
            <div className="absolute top-0 right-0 bg-[#00236f] text-white px-4 py-1 text-[10px] font-black rounded-bl-xl uppercase tracking-wider">
              Phổ Biến
            </div>
            <div className="mb-5 text-primary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                cool_to_dry
              </span>
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="font-bold text-lg text-on-surface">Nâng cao</h3>
              <span className="text-[10px] text-outline font-bold">~20 phút</span>
            </div>
            <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
              Tất cả gói Cơ bản và Rửa gầm xe.
            </p>
            <div className="mt-auto">
              <p className="text-2xl font-black text-primary mb-5">250.000đ</p>
              <button 
                onClick={() => handleActionClick('Nâng cao')}
                className="w-full py-3 bg-[#00236f] hover:bg-primary-container text-white font-bold rounded-xl transition-all text-sm shadow-md hover:shadow-lg active:scale-95"
              >
                Chọn ngay
              </button>
            </div>
          </div>

          {/* GÓI 3: Cao cấp */}
          <div className="bg-surface-container-lowest p-7 rounded-3xl border border-outline-variant/60 hover:border-primary/45 transition-all hover:shadow-xl group flex flex-col h-full">
            <div className="mb-5 text-primary">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                diamond
              </span>
            </div>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="font-bold text-lg text-on-surface">Cao cấp</h3>
              <span className="text-[10px] text-outline font-bold">~30 phút</span>
            </div>
            <p className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed">
              Dịch vụ cả 2 gói trên kèm đánh bóng.
            </p>
            <div className="mt-auto">
              <p className="text-2xl font-black text-primary mb-5">500.000đ</p>
              <button 
                onClick={() => handleActionClick('Cao cấp')}
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
