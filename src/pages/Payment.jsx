import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/**
 * Trang Thanh Toán QR VNPay (Payment) - LunaWash.
 * Thiết kế khớp hoàn hảo với ảnh giao diện yêu cầu.
 */
export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // Nhận dữ liệu đặt lịch chuyển qua state
  const bookingData = location.state || {
    formattedPrice: '550.000đ',
    activeBranchName: 'LunaWash Linh Đông',
    activeSlotName: 'Trạm 1',
    expectedTimeRange: '08:00 - 08:15',
    packageName: 'GÓI CƠ BẢN',
    vehicleLicense: 'Toyota Vios - 51H-123.45'
  };

  // Đổi giá tiền sang dạng số chuẩn VND (ví dụ: '550.000đ' -> '550.000')
  const priceDisplay = bookingData.formattedPrice.replace(/[^\d.]/g, '');

  // Đếm ngược 15 phút (900 giây)
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0')
    };
  };

  const timeFormatted = formatTime(timeLeft);

  // Nhấn xác nhận thanh toán (Mô phỏng thành công)
  const handlePaymentSuccess = async () => {
    if (bookingData.bookingPayload) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          toast.loading('Đang xử lý thanh toán...', { id: 'payment' });
          const response = await fetch('http://localhost:5010/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${parsed.token}`
            },
            body: JSON.stringify({ ...bookingData.bookingPayload, Notes: 'VNPay' })
          });
          
          if (!response.ok) {
            throw new Error('Lỗi đặt lịch từ máy chủ.');
          }
          toast.success('Thanh toán VNPay thành công!', { id: 'payment' });
        }
      } catch (err) {
        console.error(err);
        toast.error('Có lỗi xảy ra: ' + err.message, { id: 'payment' });
        return;
      }
    } else {
      toast.success('Thanh toán qua VNPay thành công! (Mô phỏng)');
    }
    navigate('/history', { state: { ...bookingData, paymentMethod: 'vnpay' } });
  };

  const handleCancelPayment = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy giao dịch thanh toán qua VNPay này không?')) {
      navigate('/booking');
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-24 pb-16 flex flex-col items-center justify-center text-[#0f172a]">
      <div className="w-full max-w-[500px] px-4 space-y-6 text-center">
        
        {/* LOGO & TIÊU ĐỀ */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl text-[#00236f] font-bold">wash</span>
            <span className="text-3xl font-black text-[#00236f] uppercase tracking-tight">LunaWash</span>
          </div>
          <p className="text-xs text-outline font-bold">Thanh toán an toàn cho dịch vụ của bạn</p>
        </div>

        {/* THẺ THANH TOÁN CHÍNH */}
        <div className="bg-white border border-[#e2e8f0] rounded-3xl overflow-hidden shadow-2xl">
          
          {/* THANH ĐẦU TRANG CARD */}
          <div className="bg-[#00236f] text-white px-6 py-3 flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Giao dịch mã hóa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-white/90">Đang kết nối...</span>
            </div>
          </div>

          {/* NỘI DUNG THANH TOÁN */}
          <div className="p-8 space-y-6">
            
            <div className="space-y-1">
              <p className="text-[10px] text-outline font-black uppercase tracking-widest">Tổng cộng cần thanh toán</p>
              <p className="text-3xl font-black text-[#00236f] tracking-tight">
                {priceDisplay} <span className="text-lg font-bold">VND</span>
              </p>
            </div>

            {/* HỘP MÃ QR MINH HỌA CỰC KỲ ĐẸP */}
            <div className="relative inline-block bg-slate-50 p-4 border border-slate-100 rounded-3xl shadow-inner group">
              {/* 4 góc viền trang trí */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00236f] rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00236f] rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#00236f] rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00236f] rounded-br-xl"></div>

              <div className="w-[180px] h-[180px] bg-white rounded-2xl flex items-center justify-center border border-slate-100 p-2 relative overflow-hidden">
                {/* Vẽ mã QR bằng SVG */}
                <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                  {/* Góc phần tư trên trái */}
                  <path d="M5,5 h30 v30 h-30 z M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" />
                  {/* Góc phần tư trên phải */}
                  <path d="M65,5 h30 v30 h-30 z M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" />
                  {/* Góc phần tư dưới trái */}
                  <path d="M5,65 h30 v30 h-30 z M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" />
                  {/* Các khối dữ liệu ngẫu nhiên */}
                  <path d="M45,5 h10 v10 h-10 z M45,20 h10 v15 h-10 z M50,40 h15 v10 h-15 z M15,45 h20 v10 h-20 z M5,55 h10 v5 h-10 z" />
                  <path d="M65,45 h10 v10 h-10 z M80,45 h15 v10 h-15 z M70,60 h10 v15 h-10 z M85,60 h10 v20 h-10 z" />
                  <path d="M45,65 h15 v10 h-15 z M45,80 h10 v15 h-10 z M60,85 h20 v10 h-20 z M85,85 h10 v10 h-10 z" />
                  {/* Logo LunaWash thu nhỏ ở chính giữa */}
                  <rect x="38" y="38" width="24" height="24" rx="6" fill="white" stroke="#00236f" strokeWidth="2" />
                  <path d="M44,44 L56,56 M56,44 L44,56" stroke="#00236f" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                
                {/* Tia quét sáng động */}
                <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 opacity-60 animate-[bounce_3s_infinite] shadow-md shadow-cyan-400"></div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-[#1e293b]">
                Quét mã qua ứng dụng <span className="text-red-600 font-extrabold">VN</span> <span className="text-blue-600 font-extrabold">Pay</span>
              </p>
            </div>

            {/* BỘ ĐẾM THỜI GIAN */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-3">
              <span className="text-[10px] text-outline font-extrabold uppercase tracking-wider">Mã QR sẽ hết hạn sau</span>
              <div className="flex items-center gap-1">
                <span className="bg-slate-200/60 font-black text-sm px-2.5 py-1.5 rounded-lg select-none min-w-[32px] text-[#00236f]">
                  {timeFormatted.minutes}
                </span>
                <span className="font-extrabold text-[#00236f] animate-pulse">:</span>
                <span className="bg-slate-200/60 font-black text-sm px-2.5 py-1.5 rounded-lg select-none min-w-[32px] text-[#00236f]">
                  {timeFormatted.seconds}
                </span>
              </div>
            </div>

            {/* NÚT QUAY LẠI HỦY */}
            <button
              onClick={handleCancelPayment}
              className="text-[#dc2626] hover:text-[#b91c1c] text-xs font-extrabold tracking-wide uppercase flex items-center justify-center gap-1.5 mx-auto transition-colors duration-200 hover:underline"
            >
              <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
              Hủy giao dịch & Quay lại
            </button>

          </div>
        </div>

        {/* NÚT GIẢ LẬP THANH TOÁN (MÔ PHỎNG) */}
        <div className="pt-2">
          <button
            onClick={handlePaymentSuccess}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Xác nhận thanh toán thành công (Mô phỏng VNPay IPN)
          </button>
        </div>

        {/* CÁC CHỨNG CHỈ BẢO MẬT */}
        <div className="flex justify-center gap-6 text-[10px] text-outline font-bold uppercase tracking-wider pt-2">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">shield</span>
            <span>PCI Compliant</span>
          </div>
        </div>

      </div>
    </main>
  );
}
