import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// CẤU HÌNH DỮ LIỆU TẬP TRUNG - Phục vụ nâng cấp & kết nối API sau này
const INITIAL_ACTIVE_BOOKING = {
  id: 'BKG-202410-0988',
  packageName: 'GÓI CAO CẤP',
  services: 'Rửa xe & Đánh bóng',
  price: '450.000đ',
  branch: 'LunaWash Linh Đông',
  address: 'Thủ Đức, HCM',
  slot: 'Trạm 1',
  timeRange: '09:00 - 09:40',
  date: 'Ngày mai',
  vehicle: 'Mercedes GLC 300 - 51K-999.88'
};

const COMPLETED_BOOKINGS = [
  {
    packageName: 'Gói Cao Cấp ~30 phút',
    vehicle: 'Toyota Camry (4 chỗ) • 51H-123.45',
    extras: 'KÈM VỆ SINH NỘI THẤT',
    branch: 'Chi nhánh Linh Đông, Thủ Đức',
    slot: 'Trạm 1',
    time: 'Lượt 15 (14:00 - 14:40)\n22/10/2024',
    totalPrice: '250.000đ',
    status: 'Hoàn thành'
  },
  {
    packageName: 'Gói Cơ Bản ~15 phút',
    vehicle: 'Honda CR-V (7 chỗ) • 51G-555.66',
    extras: null,
    branch: 'Chi nhánh Linh Đông, Thủ Đức',
    slot: 'Trạm 2',
    time: 'Lượt 08 (09:00 - 09:40)\n15/10/2024',
    totalPrice: '150.000đ',
    status: 'Hoàn thành'
  },
  {
    packageName: 'Gói Nâng Cao ~20 phút',
    vehicle: 'Mazda 3 (5 chỗ) • 60A-888.88',
    extras: null,
    branch: 'Chi nhánh Linh Đông, Thủ Đức',
    slot: 'Trạm 1',
    time: '16:30 - 17:10\n08/10/2024',
    totalPrice: '800.000đ',
    status: 'Hoàn thành'
  }
];

/**
 * Trang Lịch Sử Rửa Xe / Quản lý lịch rửa xe (BookingHistory) - LunaWash.
 * Thiết kế khớp hoàn hảo với Ảnh 3.
 */
export default function BookingHistory() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeBooking, setActiveBooking] = useState(() => {
    if (location.state && location.state.paymentMethod) {
      const newBooking = {
        id: `BKG-${Date.now().toString().slice(-4)}`,
        packageName: location.state.packageName,
        services: location.state.services,
        price: location.state.formattedPrice,
        branch: location.state.activeBranchName,
        address: location.state.address,
        slot: location.state.activeSlotName,
        timeRange: location.state.expectedTimeRange,
        date: 'Hôm nay',
        vehicle: location.state.vehicleLicense,
        paymentMethod: location.state.paymentMethod
      };
      localStorage.setItem('lunaWash_activeBooking', JSON.stringify(newBooking));
      return newBooking;
    }
    const saved = localStorage.getItem('lunaWash_activeBooking');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACTIVE_BOOKING;
  });

  const [historyList] = useState(COMPLETED_BOOKINGS);

  const handleCancelBooking = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch đặt xe này không? (Hủy trước 30 phút hoàn toàn miễn phí)')) {
      alert('Đã hủy lịch đặt thành công. Chúng tôi sẽ hoàn tiền nếu quý khách đã thanh toán trước.');
      setActiveBooking(null);
      localStorage.removeItem('lunaWash_activeBooking');
    }
  };

  const handleCreateNewBooking = () => {
    navigate('/booking');
  };

  const handleReviewClick = () => {
    navigate('/feedback');
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-16 text-on-background">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-10">
        
        {/* TIÊU ĐỀ CHÍNH */}
        <header className="border-b border-outline-variant/35 pb-4">
          <h1 className="text-3xl font-extrabold text-[#00236f] tracking-tight">
            Quản lý lịch rửa xe
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Theo dõi các lịch đặt hiện tại và xem lại hành trình chăm sóc xe của bạn.
          </p>
        </header>

        {/* 1. LỊCH ĐẶT HIỆN TẠI */}
        <section className="space-y-4">
          <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Lịch Đặt Hiện Tại
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-stretch">
            
            {/* Thẻ lịch đặt xe đang hoạt động */}
            {activeBooking ? (
              <div className="lg:col-span-2 border-2 border-primary bg-surface-container-lowest rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                <span className="absolute top-0 right-0 bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl select-none">
                  Sắp đến
                </span>

                <div className="space-y-6">
                  {/* Tên gói & Giá tiền */}
                  <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4">
                    <div>
                      <span className="text-[10px] font-black text-primary tracking-widest uppercase block mb-1">
                        {activeBooking.packageName}
                      </span>
                      <h3 className="font-extrabold text-xl text-primary">{activeBooking.services}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-[#0d2e61]">{activeBooking.price}</p>
                      <p className="text-[10px] text-outline font-semibold">
                        {activeBooking.paymentMethod === 'vnpay' ? 'Thanh toán qua VNPay' : 'Thanh toán tại quầy (Tiền mặt)'}
                      </p>
                    </div>
                  </div>

                  {/* Chi tiết vị trí / Thời gian */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary font-bold">location_on</span>
                      <div>
                        <p className="font-extrabold text-on-surface">Chi nhánh</p>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {activeBooking.branch}
                          <span className="block text-[11px] text-outline font-medium">{activeBooking.address}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary font-bold">wash</span>
                      <div>
                        <p className="font-extrabold text-on-surface">Trạm rửa</p>
                        <p className="text-xs text-on-surface-variant font-medium">{activeBooking.slot}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary font-bold">schedule</span>
                      <div>
                        <p className="font-extrabold text-on-surface">Khung giờ (Bắt đầu - Kết thúc)</p>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {activeBooking.timeRange}
                          <span className="block text-[11px] text-primary font-bold">{activeBooking.date}</span>
                          <span className="block text-[10px] text-amber-600 font-extrabold mt-1 leading-snug">
                            * Khuyên quý khách nên đến sớm, không nên trễ quá 10 phút!
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary font-bold">directions_car</span>
                      <div>
                        <p className="font-extrabold text-on-surface">Phương tiện</p>
                        <p className="text-xs text-on-surface-variant font-medium leading-tight">{activeBooking.vehicle}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nút hủy lịch */}
                <div className="border-t border-outline-variant/20 pt-5 mt-6">
                  <button 
                    onClick={handleCancelBooking}
                    className="w-full py-3.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 shadow-inner"
                  >
                    <span className="material-symbols-outlined text-lg">cancel</span>
                    Hủy Lịch
                  </button>
                </div>

              </div>
            ) : (
              <div className="lg:col-span-2 border border-outline-variant/40 bg-surface-container-low/30 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-inner">
                <span className="material-symbols-outlined text-5xl text-outline mb-4">calendar_today</span>
                <p className="font-bold text-on-surface text-base">Không có lịch đặt nào sắp diễn ra</p>
                <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                  Hãy trải nghiệm dịch vụ chăm sóc xe thông minh của chúng tôi ngay hôm nay.
                </p>
              </div>
            )}

            {/* Khung đặt lịch mới */}
            <div 
              onClick={handleCreateNewBooking}
              className="border border-dashed border-outline-variant hover:border-primary bg-surface-container-lowest hover:bg-primary/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 shadow-sm group min-h-[250px]"
            >
              <div className="w-14 h-14 rounded-full bg-surface-container-high/60 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-on-surface-variant transition-all shadow-md mb-4">
                <span className="material-symbols-outlined text-3xl font-bold">add</span>
              </div>
              <h3 className="font-extrabold text-primary text-base mb-1">Đặt lịch mới</h3>
              <p className="text-xs text-on-surface-variant max-w-[200px] leading-relaxed">
                Trải nghiệm dịch vụ rửa xe công nghệ cao ngay hôm nay
              </p>
            </div>

          </div>
        </section>

        {/* 2. LỊCH SỬ ĐÃ HOÀN THÀNH */}
        <section className="space-y-4">
          <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base font-bold">history</span>
            Lịch Sử Đã Hoàn Thành
          </h2>

          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[750px]">
                <thead>
                  <tr className="bg-surface-container-low/40 border-b border-outline-variant/50 text-outline text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Dịch vụ & Phương tiện</th>
                    <th className="py-4 px-6">Địa điểm & Trạm</th>
                    <th className="py-4 px-6">Thời gian (Bắt đầu - Kết thúc)</th>
                    <th className="py-4 px-6">Tổng tiền</th>
                    <th className="py-4 px-6">Trạng thái</th>
                    <th className="py-4 px-6 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-sm">
                  {historyList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low/10 transition-colors">
                      {/* Dịch vụ & xe */}
                      <td className="py-5 px-6">
                        <p className="font-extrabold text-primary">{item.packageName}</p>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">{item.vehicle}</p>
                        {item.extras && (
                          <span className="inline-block bg-sky-100 text-sky-800 text-[9px] font-black px-2 py-0.5 rounded mt-1.5">
                            {item.extras}
                          </span>
                        )}
                      </td>
                      {/* Vị trí */}
                      <td className="py-5 px-6 font-medium text-on-surface-variant">
                        <p className="font-semibold text-on-surface">{item.branch}</p>
                        <p className="text-xs text-outline">{item.slot}</p>
                      </td>
                      {/* Thời gian */}
                      <td className="py-5 px-6 font-semibold text-on-surface whitespace-pre-line text-xs">
                        {item.time}
                      </td>
                      {/* Tiền */}
                      <td className="py-5 px-6 text-base font-black text-[#0d2e61]">{item.totalPrice}</td>
                      {/* Trạng thái */}
                      <td className="py-5 px-6">
                        <span className="inline-flex items-center px-3 py-1 bg-emerald-100/70 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold shadow-sm select-none">
                          • {item.status}
                        </span>
                      </td>
                      {/* Chi tiết */}
                      <td className="py-5 px-6 text-center">
                        <button 
                          onClick={() => alert(`Xem chi tiết mã đặt chỗ: ${activeBooking?.id || 'BKG-202410-008'}`)}
                          className="text-primary hover:underline font-bold text-xs"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. BANNER KHẢO SÁT SỰ HÀI LÒNG */}
        <section className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#00236f] to-indigo-900 shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 group">
          {/* Lớp lưới nền */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] z-0"></div>
          
          <div className="relative z-10 max-w-xl space-y-2">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              Bạn hài lòng với dịch vụ?
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Đánh giá trải nghiệm của bạn để giúp chúng tôi ngày càng hoàn thiện, đồng thời nhận ngay mã giảm giá 15% cho lượt đặt tiếp theo.
            </p>
          </div>

          <button 
            onClick={handleReviewClick}
            className="relative z-10 inline-flex items-center justify-center px-8 py-4 bg-[#4cd7f6] hover:bg-[#57dffe] text-[#001f26] rounded-full font-black text-base hover:scale-105 transition-all shadow-xl active:scale-95 flex-shrink-0"
          >
            Đánh giá ngay
          </button>
        </section>

      </div>
    </main>
  );
}
