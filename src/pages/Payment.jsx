import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Trang Kết Quả Thanh Toán VNPay (Payment Result) - Premium Receipt Design
 */
export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Lấy ID thật sự của booking từ session trước khi xóa
    const realBookingId = localStorage.getItem('pendingVnpayBooking');
    localStorage.removeItem('pendingVnpayBooking');
    
    // Kích hoạt animation sau khi mount
    setTimeout(() => setIsLoaded(true), 100);

    // Nếu thanh toán thất bại, tự động hủy lịch đặt trên hệ thống
    const currentStatus = searchParams.get('status') || 'success';
    // Ưu tiên dùng realBookingId, nếu không có mới dùng bookingId từ URL (thường là mã BKG-...)
    const currentBookingId = realBookingId || searchParams.get('bookingId');
    
    if (currentStatus !== 'success' && currentBookingId && currentBookingId !== 'BK-123456') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          
          const doCancel = async () => {
            let idToDelete = currentBookingId;
            
            // Nếu mất localStorage và URL trả về BKG-XXX, ta fetch lịch sử để tìm đúng ID
            if (!realBookingId || idToDelete.toString().startsWith('BKG')) {
              try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/history`, {
                  headers: { 'Authorization': `Bearer ${parsed.token}` }
                });
                if (res.ok) {
                  const data = await res.json();
                  const pendingBooking = data.find(b => b.paymentMethod === 'vnpay_pending' && (b.status === 'Sắp đến' || b.status === 'Pending'));
                  if (pendingBooking) {
                    idToDelete = pendingBooking.id;
                  }
                }
              } catch (e) {}
            }
            
            // Xóa booking
            if (idToDelete && idToDelete !== 'BK-123456' && !idToDelete.toString().startsWith('BKG')) {
              fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${idToDelete}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${parsed.token}`
                }
              }).catch(() => {});
            }
          };
          
          doCancel();
        } catch (e) {}
      }
    }
  }, [searchParams]);

  const status = searchParams.get('status') || 'success'; 
  const bookingId = searchParams.get('bookingId') || 'BK-123456';
  const errorCode = searchParams.get('errorCode');
  const amount = searchParams.get('amount') || '150000'; // Demo giá trị

  const isSuccess = status === 'success';

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const currentDate = new Date().toLocaleString('vi-VN', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <main className="min-h-screen bg-slate-900 pt-24 pb-16 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#00236f] blur-[120px] rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] bg-emerald-500 blur-[100px] rounded-full opacity-20"></div>
      </div>

      <div className={`w-full max-w-[400px] transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} relative z-10`}>
        
        {/* LOGO */}
        <div className="flex flex-col items-center justify-center gap-1 mb-6 text-white cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-2 shadow-xl ring-1 ring-white/20">
            <span className="material-symbols-outlined text-4xl text-[#4cd7f6] font-bold">wash</span>
          </div>
          <span className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[#4cd7f6]">
            LunaWash
          </span>
          <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase">Premium Car Spa</p>
        </div>

        {/* THE RECEIPT CARD */}
        <div className="bg-white rounded-[24px] shadow-2xl relative overflow-hidden">
          
          {/* Top circle cutouts for receipt effect */}
          <div className="absolute -left-4 top-[140px] w-8 h-8 bg-slate-900 rounded-full shadow-inner z-20"></div>
          <div className="absolute -right-4 top-[140px] w-8 h-8 bg-slate-900 rounded-full shadow-inner z-20"></div>

          {/* Receipt Header */}
          <div className={`pt-10 pb-8 px-8 flex flex-col items-center text-center ${isSuccess ? 'bg-emerald-50/50' : 'bg-red-50/50'}`}>
            <div className="relative mb-5">
              <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg relative z-10 ${isSuccess ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white' : 'bg-gradient-to-br from-red-400 to-red-600 text-white'}`}>
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isSuccess ? 'check_circle' : 'cancel'}
                </span>
              </div>
            </div>
            
            <h2 className={`text-xl font-black uppercase tracking-tight mb-1.5 ${isSuccess ? 'text-emerald-700' : 'text-red-700'}`}>
              {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              {isSuccess ? 'Cảm ơn bạn đã tin dùng LunaWash!' : 'Vui lòng thử lại hoặc liên hệ CSKH'}
            </p>
            <p className="text-xs font-medium text-slate-400 mt-3">{currentDate}</p>
          </div>

          {/* Dashed separator */}
          <div className="relative h-0 z-10">
            <div className="absolute top-0 left-6 right-6 border-t-[3px] border-dashed border-slate-200"></div>
          </div>

          {/* Receipt Details */}
          <div className="px-8 py-8 space-y-5 bg-white relative z-0">
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Mã giao dịch</span>
                <span className="font-bold text-slate-800">{bookingId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Phương thức</span>
                <span className="font-bold text-[#00236f] bg-[#00236f]/10 px-2 py-1 rounded-md">VNPAY</span>
              </div>
              {!isSuccess && errorCode && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Mã lỗi</span>
                  <span className="font-bold text-red-600">{errorCode}</span>
                </div>
              )}
            </div>

            {/* Total Block */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng cộng</span>
                <span className="text-3xl font-black text-[#0f172a] tracking-tight">{formatCurrency(amount)}</span>
              </div>
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shadow-inner">
                <span className="material-symbols-outlined text-slate-400">receipt_long</span>
              </div>
            </div>

          </div>

          {/* Bottom Barcode Decorative */}
          <div className="bg-slate-50 p-6 flex flex-col items-center justify-center border-t border-slate-100">
            <div className="w-full h-12 opacity-30 flex gap-1.5 justify-center items-end overflow-hidden">
              {/* Sinh ra các sọc giả barcode */}
              {[...Array(35)].map((_, i) => {
                const isThick = i % 3 === 0;
                const heights = [45, 85, 60, 40, 95, 50, 75, 45, 90, 55, 65, 80, 40, 100, 55, 70, 85, 50, 60, 95, 45, 75, 65, 80, 55, 90, 40, 85, 60, 100, 50, 75, 45, 95, 65];
                return (
                  <div key={i} className="bg-slate-800 rounded-sm" style={{ width: isThick ? '3px' : '1.5px', height: `${heights[i % heights.length]}%` }}></div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-3 tracking-widest uppercase">{bookingId}</p>
          </div>
        </div>

        {/* NÚT ĐIỀU HƯỚNG */}
        <div className="mt-8 space-y-3">
          {isSuccess ? (
            <button
              onClick={() => navigate('/history')}
              className="w-full py-4 bg-gradient-to-r from-[#00236f] to-[#0038b8] hover:from-[#001b57] hover:to-[#002d94] text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">calendar_month</span>
              Xem lịch hẹn của bạn
            </button>
          ) : (
            <button
              onClick={() => navigate('/booking')}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-red-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">refresh</span>
              Thử lại thanh toán
            </button>
          )}
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-sm transition-all active:scale-95"
          >
            Quay về trang chủ
          </button>
        </div>

      </div>
    </main>
  );
}
