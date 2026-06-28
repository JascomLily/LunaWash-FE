import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

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

  // Kiểm tra quyền nhân viên/quản lý đồng bộ ngay lập tức trước khi render để tránh flash trang chủ
  const storedUser = localStorage.getItem('user');
  let isStaffOrManager = false;
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.tier === 'Staff' || parsed.tier === 'BranchManager') {
        isStaffOrManager = true;
      }
    } catch (e) {}
  }

  // Nếu là nhân viên/quản lý, chuyển hướng ngay lập tức bằng Navigate component
  if (isStaffOrManager) {
    return <Navigate to="/staff/queue" replace />;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState('BR-LD');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [mainPackages, setMainPackages] = useState([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);

  // Lấy danh sách các gói dịch vụ (MainPackage)
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('http://localhost:5010/api/services');
        if (res.ok) {
          const data = await res.json();
          // Lọc gói tự động (Package), đang kích hoạt, và chỉ lấy tối đa 3 gói đầu
          const activeMain = data
            .filter(s => s.serviceType === 'Package' && s.isActive)
            .slice(0, 3);
          setMainPackages(activeMain);
        }
      } catch (e) {
        console.error("Lỗi khi tải gói dịch vụ:", e);
      } finally {
        setIsLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  const [banners, setBanners] = useState([
    { id: 1, url: '/promo_1.png', promoCode: 'SUMMER20' },
    { id: 2, url: '/promo_2.png', promoCode: 'VIPWASH' },
    { id: 3, url: '/promo_3.png', promoCode: 'EXPRESS15' },
  ]);

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
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.tier === 'Staff' || parsed.tier === 'BranchManager') {
          navigate('/staff/queue', { replace: true });
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    const storedBanners = localStorage.getItem('ads_banners');
    if (storedBanners) {
      try {
        setBanners(JSON.parse(storedBanners));
      } catch (e) {}
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
    navigate('/booking');
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
                    onClick={() => {
                      setSelectedBranchId(b.id);
                    }}
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

      {/* KHU VỰC QUẢNG CÁO KHUYẾN MÃI CHẠY LIÊN TỤC */}
      <section className="pt-16 pb-8 overflow-hidden w-full bg-[#f8fafc]/40 border-b border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-desktop mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[#00236f]">
            <span className="material-symbols-outlined text-lg animate-pulse font-bold">campaign</span>
            <span className="text-xs font-black uppercase tracking-wider">Ưu đãi độc quyền & Tin tức mới</span>
          </div>
          <span className="text-[10px] text-outline font-bold italic">Rê chuột vào để tạm dừng</span>
        </div>
        
        {/* Marquee Wrapper */}
        <div className="relative w-full overflow-hidden py-2">
          {/* Faders for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background via-background/40 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background via-background/40 to-transparent z-10 pointer-events-none"></div>

          <div className="animate-marquee flex gap-6">
            {/* Set 1 */}
            <div className="flex gap-6">
              {banners.map((b) => (
                <div 
                  key={b.id} 
                  onClick={() => navigate('/booking', { state: { promoCode: b.promoCode } })} 
                  className="w-[380px] sm:w-[420px] h-[160px] rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/30 hover:scale-102 hover:shadow-md transition-all duration-300 relative cursor-pointer group"
                >
                  <img src={b.url} alt={`Promo ${b.id}`} className="w-full h-full object-cover group-hover:scale-103 transition-all duration-500" />
                </div>
              ))}
            </div>
            {/* Set 2 (Duplicated for infinite scroll effect) */}
            <div className="flex gap-6">
              {banners.map((b) => (
                <div 
                  key={`dup-${b.id}`} 
                  onClick={() => navigate('/booking', { state: { promoCode: b.promoCode } })} 
                  className="w-[380px] sm:w-[420px] h-[160px] rounded-[24px] overflow-hidden shadow-sm border border-outline-variant/30 hover:scale-102 hover:shadow-md transition-all duration-300 relative cursor-pointer group"
                >
                  <img src={b.url} alt={`Promo ${b.id}`} className="w-full h-full object-cover group-hover:scale-103 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CHỌN GÓI DỊCH VỤ PHÙ HỢP */}
      <section className="py-20 px-margin-desktop max-w-container-max mx-auto" id="packages">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter items-center">
          
          {/* CỘT TIÊU ĐỀ HÀNG DỊCH VỤ */}
          <div className="lg:pr-4 space-y-4">
            <span className="inline-block bg-sky-100 text-[#00236f] px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest select-none">
              Dịch vụ hàng đầu
            </span>
            <h2 className="text-3xl font-extrabold text-[#00236f] tracking-tight leading-tight">
              Chọn gói dịch vụ phù hợp
            </h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Trải nghiệm công nghệ rửa xe thông minh nhanh chóng, chất lượng vượt trội tại LunaWash.
            </p>
          </div>

          {/* BA GÓI DỊCH VỤ */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-gutter">
            
            {isLoadingPackages ? (
              <div className="col-span-full text-center py-10 text-outline">
                <span className="material-symbols-outlined animate-spin text-4xl mb-2">hourglass_empty</span>
                <p>Đang tải danh sách dịch vụ...</p>
              </div>
            ) : mainPackages.length === 0 ? (
              <div className="col-span-full text-center py-10 text-outline">
                <span className="material-symbols-outlined text-4xl mb-2">info</span>
                <p>Hiện chưa có gói dịch vụ nào.</p>
              </div>
            ) : (
              mainPackages.map((pkg, index) => {
                // Xác định gói phổ biến (nếu admin set isPopular, hoặc fallback lấy gói thứ 2 nếu chỉ có 3 gói)
                const isPopular = pkg.isPopular || (mainPackages.length >= 3 && index === 1);
                
                // Lấy giá tiền và thời gian (hiển thị giá min nếu có nhiều loại xe)
                const price = pkg.prices && pkg.prices.length > 0 
                  ? Math.min(...pkg.prices.map(p => p.price)) 
                  : 0;
                const duration = pkg.prices && pkg.prices.length > 0 
                  ? pkg.prices[0].durationMinutes 
                  : 0;

                return (
                  <div key={pkg.id} className={`relative bg-surface-container-lowest p-7 rounded-3xl transition-all group flex flex-col h-full overflow-hidden ${isPopular ? 'border-2 border-[#00236f] shadow-lg hover:shadow-2xl' : 'border border-outline-variant/60 hover:border-primary/45 hover:shadow-xl'}`}>
                    {isPopular && (
                      <div className="absolute top-0 right-0 bg-[#00236f] text-white px-4 py-1 text-[10px] font-black rounded-bl-xl uppercase tracking-wider">
                        Phổ Biến
                      </div>
                    )}
                    <div className="mb-5 text-primary">
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {pkg.iconName || 'water_drop'}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-bold text-lg text-on-surface">{pkg.serviceName}</h3>
                      <span className="text-[10px] text-outline font-bold">~{duration} phút</span>
                    </div>
                    <div className="text-on-surface-variant text-sm mb-6 flex-grow leading-relaxed flex flex-col gap-2">
                      <p>{pkg.description}</p>
                      {pkg.serviceFeatures && pkg.serviceFeatures.length > 0 && (
                        <ul className="space-y-1.5 mt-2 border-t border-outline-variant/30 pt-3">
                          {pkg.serviceFeatures.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-on-surface-variant">
                              <span className="material-symbols-outlined text-[14px] text-green-600 mt-0.5">check_circle</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="mt-auto pt-4 border-t border-outline-variant/30">
                      <p className="text-2xl font-black text-primary mb-5">{price.toLocaleString('vi-VN')}đ</p>
                      <button 
                        onClick={() => handleActionClick(pkg.serviceName)}
                        className={`w-full py-3 font-bold rounded-xl transition-all text-sm shadow-sm active:scale-95 ${isPopular ? 'bg-[#00236f] hover:bg-primary-container text-white hover:shadow-lg' : 'border border-primary text-primary hover:bg-primary hover:text-white hover:shadow'}`}
                      >
                        Chọn ngay
                      </button>
                    </div>
                  </div>
                );
              })
            )}

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

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden animate-slideUp border border-outline-variant/20 flex flex-col relative">
            <button 
              onClick={() => setShowLoginPrompt(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="p-6 text-center mt-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-blue-600 text-3xl">login</span>
              </div>
              <h3 className="font-black text-xl text-primary mb-2">Yêu cầu đăng nhập</h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                Bạn cần đăng nhập tài khoản để có thể tiếp tục thao tác.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 py-3 bg-surface-container hover:bg-outline-variant/20 text-on-surface font-bold rounded-xl transition-all"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#001d5c] shadow-md hover:shadow-lg transition-all"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
