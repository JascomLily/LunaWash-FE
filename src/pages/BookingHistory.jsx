import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';


/**
 * Trang Lịch Sử Rửa Xe / Quản lý lịch rửa xe (BookingHistory) - LunaWash.
 * Thiết kế khớp hoàn hảo với Ảnh 3.
 */
export default function BookingHistory() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeBooking, setActiveBooking] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Modals
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [serviceRating, setServiceRating] = useState(5);
  const [staffRating, setStaffRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsBooking, setDetailsBooking] = useState(null);

  const handleOpenReview = (booking) => {
    setReviewBooking(booking);
    setServiceRating(5);
    setStaffRating(5);
    setReviewComment('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      const parsed = JSON.parse(storedUser);
      
      const payload = {
        bookingId: reviewBooking.id || 'BKG-MOCK',
        serviceRating,
        staffRating,
        comment: reviewComment
      };

      const res = await fetch(import.meta.env.VITE_API_URL + '/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parsed.token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        toast.success('Cảm ơn bạn đã đánh giá dịch vụ!');
      } else {
        // Tạm báo thành công vì BE đang làm
        toast.success('Cảm ơn bạn đã đánh giá dịch vụ! (Pending BE)');
      }
    } catch(err) {
      toast.success('Cảm ơn bạn đã đánh giá! (Pending BE)');
    } finally {
      setShowReviewModal(false);
    }
  };

  const handleOpenDetails = (booking) => {
    setDetailsBooking(booking);
    setShowDetailsModal(true);
  };

  const fetchBookings = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      const parsed = JSON.parse(storedUser);
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/bookings/history', {
        headers: { 'Authorization': `Bearer ${parsed.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        
        // Find the first "Sắp đến" or "Đang rửa" booking
        const active = data.find(b => b.status === 'Sắp đến' || b.status === 'Đang rửa');
        if (active) {
          let timeVal = '';
          let dateVal = '';
          if (active.timeRange) {
            if (active.timeRange.includes('\n')) {
              const parts = active.timeRange.split('\n');
              timeVal = parts[0];
              dateVal = parts[1] || '';
            } else {
              const parts = active.timeRange.trim().split(' ');
              dateVal = parts.pop() || '';
              timeVal = parts.join(' ');
            }
          }

          setActiveBooking({
            id: active.id,
            packageName: active.packageName,
            services: active.services,
            price: active.totalPrice,
            branch: active.branchInfo,
            address: '',
            slot: active.slotName,
            timeRange: timeVal,
            date: dateVal,
            vehicle: active.vehicleInfo,
            paymentMethod: active.paymentMethod,
            status: active.status
          });
        } else {
          setActiveBooking(null);
        }

        // Map the rest to historyList
        const history = data.filter(b => !active || b.id !== active.id).map(b => ({
          id: b.id,
          packageName: b.packageName,
          vehicle: b.vehicleInfo,
          extras: b.extras,
          branch: b.branchInfo,
          slot: b.slotName,
          time: b.timeRange,
          totalPrice: b.totalPrice,
          status: b.status,
          rating: b.rating
        }));
        setHistoryList(history);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!activeBooking) return;
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch đặt xe này không? (Hủy trước 30 phút hoàn toàn miễn phí)')) {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const parsed = JSON.parse(storedUser);
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${activeBooking.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${parsed.token}` }
        });
        
        if (res.ok) {
          toast.success('Đã hủy lịch đặt thành công.');
          fetchBookings();
        } else {
          const errData = await res.json();
          toast.error(errData.message || 'Không thể hủy lịch đặt.');
        }
      } catch(err) {
        toast.error('Lỗi kết nối đến máy chủ.');
      }
    }
  };

  const handleCreateNewBooking = () => {
    navigate('/booking');
  };

  const handleDeleteReview = async (bookingId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const parsed = JSON.parse(storedUser);
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${bookingId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${parsed.token}` }
        });
        
        if (res.ok) {
          toast.success('Đã xóa đánh giá thành công.');
          fetchBookings();
        } else {
          toast.error('Không thể xóa đánh giá.');
        }
      } catch (err) {
        toast.error('Lỗi kết nối máy chủ.');
      }
    }
  };

  const handleReviewClick = () => {
    const unratedBooking = historyList.find(b => b.status === 'Hoàn thành' && !b.rating);
    if (!unratedBooking) {
      toast.error('Bạn đã đánh giá tất cả các chuyến đi hoàn thành.');
      return;
    }
    navigate('/feedback', { state: { bookingId: unratedBooking.id, booking: unratedBooking } });
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
                <span className={`absolute top-0 right-0 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl select-none ${activeBooking.status === 'Đang rửa' ? 'bg-amber-500 animate-pulse' : 'bg-sky-500'}`}>
                  {activeBooking.status}
                </span>

                <div className="space-y-6">
                  {/* Tên gói & Giá tiền */}
                  <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4">
                    <div>
                      <h3 className="font-extrabold text-xl text-primary uppercase">{activeBooking.packageName}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-[#0d2e61]">{activeBooking.price}</p>
                      <p className="text-[10px] text-outline font-semibold">
                        {activeBooking.paymentMethod === 'vnpay' 
                          ? 'Thanh toán qua VNPay (Đã thanh toán)' 
                          : activeBooking.paymentMethod === 'vnpay_pending' 
                            ? 'Thanh toán qua VNPay (Chờ thanh toán)' 
                            : 'Thanh toán tại quầy (Tiền mặt)'}
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
                      <span className="material-symbols-outlined text-primary font-bold mt-0.5">schedule</span>
                      <div>
                        <p className="font-extrabold text-on-surface mb-2">Khung giờ (Dự kiến)</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-800 font-bold text-xs rounded-full border border-sky-200">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            {activeBooking.timeRange}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-800 font-bold text-xs rounded-full border border-indigo-200">
                            <span className="material-symbols-outlined text-[12px]">calendar_month</span>
                            {activeBooking.date}
                          </span>
                        </div>
                        <span className="block text-[10px] text-amber-600 font-extrabold mt-2 leading-snug">
                          * Khuyên quý khách nên đến sớm, không nên trễ quá 10 phút!
                        </span>
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
                  <button                        onClick={handleCancelBooking}
                        disabled={activeBooking.status === 'Đang rửa'}
                        className={`w-full py-3.5 font-bold rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 ${
                          activeBooking.status === 'Đang rửa' 
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            : 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 active:scale-[0.98]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {activeBooking.status === 'Đang rửa' ? 'lock' : 'cancel'}
                        </span>
                        {activeBooking.status === 'Đang rửa' ? 'Không thể hủy khi đang rửa' : 'Hủy Lịch'}
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

        {/* 2. LỊCH SỬ */}
        <section className="space-y-4">
          <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base font-bold">history</span>
            Lịch Sử
          </h2>

          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[850px]">
                <thead>
                  <tr className="bg-surface-container-low/40 border-b border-outline-variant/50 text-outline text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Dịch vụ & Phương tiện</th>
                    <th className="py-4 px-6">Địa điểm & Trạm</th>
                    <th className="py-4 px-6">Thời gian</th>
                    <th className="py-4 px-6">Tổng tiền</th>
                    <th className="py-4 px-6">Trạng thái</th>
                    <th className="py-4 px-6 text-center">Đánh giá</th>
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
                      {/* Đánh giá */}
                      <td className="py-5 px-6 text-center">
                        {item.rating ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-sm">
                              ⭐ {Number(item.rating).toFixed(1)}
                            </span>
                            <button 
                              onClick={() => navigate('/feedback', { state: { bookingId: item.id, booking: item, isEdit: true } })} 
                              className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-full transition-colors" 
                              title="Chỉnh sửa đánh giá"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => navigate('/feedback', { state: { bookingId: item.id, booking: item } })}
                            className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1 mx-auto transition-colors shadow-sm"
                          >
                            <span className="material-symbols-outlined text-sm">star</span>
                            Đánh giá
                          </button>
                        )}
                      </td>
                      {/* Chi tiết */}
                      <td className="py-5 px-6 text-center">
                        <button 
                          onClick={() => handleOpenDetails(item)}
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

      {/* MODAL ĐÁNH GIÁ */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden p-6 relative">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface bg-surface-container-low rounded-full w-8 h-8 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <h3 className="text-xl font-extrabold text-[#00236f] mb-2">Đánh giá dịch vụ</h3>
            <p className="text-sm text-on-surface-variant mb-6">Đánh giá của bạn giúp chúng tôi cải thiện chất lượng tốt hơn.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Đánh giá dịch vụ</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      onClick={() => setServiceRating(star)}
                      className={`material-symbols-outlined text-3xl cursor-pointer transition-all ${star <= serviceRating ? 'text-amber-400 fill-current' : 'text-outline-variant/40'}`}
                      style={{ fontVariationSettings: star <= serviceRating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Nhận xét thêm</label>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ thêm trải nghiệm của bạn..."
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-24"
                ></textarea>
              </div>
            </div>

            <button 
              onClick={handleSubmitReview}
              className="w-full mt-6 bg-[#00236f] text-white font-bold py-3.5 rounded-xl hover:bg-indigo-800 transition-colors shadow-md"
            >
              Gửi Đánh Giá
            </button>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT LỊCH ĐẶT */}
      {showDetailsModal && detailsBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-[24px] shadow-2xl overflow-hidden p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 text-outline hover:text-on-surface bg-surface-container-low rounded-full w-8 h-8 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <h3 className="text-2xl font-extrabold text-[#00236f] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl">receipt_long</span>
              Chi tiết lịch đặt
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h4 className="font-bold text-outline uppercase text-xs tracking-widest border-b border-outline-variant/20 pb-2">Thông tin dịch vụ</h4>
                <div>
                  <p className="text-xs text-outline mb-0.5">Dịch vụ & Gói</p>
                  <p className="font-extrabold text-primary">{detailsBooking.packageName}</p>
                  {detailsBooking.extras && <p className="text-xs text-on-surface-variant font-medium mt-1">Kèm: {detailsBooking.extras}</p>}
                </div>
                <div>
                  <p className="text-xs text-outline mb-0.5">Phương tiện</p>
                  <p className="font-bold text-on-surface">{detailsBooking.vehicle}</p>
                </div>
                <div>
                  <p className="text-xs text-outline mb-0.5">Chi nhánh & Trạm</p>
                  <p className="font-bold text-on-surface">{detailsBooking.branch}</p>
                  <p className="text-xs text-on-surface-variant">{detailsBooking.slot}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-outline uppercase text-xs tracking-widest border-b border-outline-variant/20 pb-2">Thời gian thực tế</h4>
                <div>
                  <p className="text-xs text-outline mb-0.5">Lịch hẹn</p>
                  <p className="font-bold text-on-surface whitespace-pre-line">{detailsBooking.time}</p>
                </div>
                <div>
                  <p className="text-xs text-outline mb-0.5">Check-in (Đang cập nhật BE)</p>
                  <p className="font-bold text-emerald-600">--:--</p>
                </div>
                <div>
                  <p className="text-xs text-outline mb-0.5">Check-out (Đang cập nhật BE)</p>
                  <p className="font-bold text-blue-600">--:--</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low/30 rounded-2xl p-5 border border-outline-variant/30">
              <h4 className="font-bold text-outline uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">payments</span>
                Hóa đơn thanh toán
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant font-medium">Tạm tính:</span>
                  <span className="font-bold text-on-surface">{detailsBooking.totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-600">
                  <span className="font-medium">Giảm giá:</span>
                  <span className="font-bold">- 0đ</span>
                </div>
                <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-center mt-3">
                  <span className="font-extrabold text-on-surface text-base">Tổng thanh toán:</span>
                  <span className="font-black text-xl text-[#00236f]">{detailsBooking.totalPrice}</span>
                </div>
                <div className="mt-4 flex justify-between items-center bg-surface-container-lowest p-3 rounded-xl text-xs font-bold">
                  <span className="text-outline">Phương thức: <span className="text-on-surface ml-1">
                    {detailsBooking.paymentMethod === 'vnpay' 
                      ? 'Thanh toán qua VNPay (Đã thanh toán)' 
                      : detailsBooking.paymentMethod === 'vnpay_pending' 
                        ? 'Thanh toán qua VNPay (Chờ thanh toán)' 
                        : 'Thanh toán tại quầy (Tiền mặt)'}
                  </span></span>
                  <span className={`px-2 py-1 rounded ${detailsBooking.paymentMethod === 'vnpay' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                    {detailsBooking.paymentMethod === 'vnpay' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
