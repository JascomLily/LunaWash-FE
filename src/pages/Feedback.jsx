import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Trang Đánh Giá Dịch Vụ (Feedback) - LunaWash.
 * Thiết kế khớp hoàn hảo với ảnh giao diện yêu cầu.
 */
export default function Feedback() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;
  const bookingId = location.state?.bookingId;

  // Trạng thái các mục đánh giá
  const [overallRating, setOverallRating] = useState(0);
  const [cleanlinessRating, setCleanlinessRating] = useState(0);
  const [speedRating, setSpeedRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);

  const [comment, setComment] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý kéo thả và tải ảnh lên mô phỏng
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingId) {
      alert('Không tìm thấy thông tin chuyến xe hợp lệ để đánh giá!');
      return;
    }
    if (overallRating === 0) {
      alert('Vui lòng chọn mức độ trải nghiệm tổng thể của bạn!');
      return;
    }

    setIsSubmitting(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      const parsed = JSON.parse(storedUser);
      
      const payload = {
        bookingId: bookingId,
        serviceRating: overallRating,
        cleanlinessRating,
        speedRating,
        staffRating,
        comment: comment
      };

      const res = await fetch('http://localhost:5010/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parsed.token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('Cảm ơn đóng góp của bạn! Đánh giá đã được gửi đi thành công.');
        navigate('/history');
      } else {
        alert('Không thể gửi đánh giá, vui lòng thử lại sau.');
      }
    } catch(err) {
      alert('Lỗi kết nối đến máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Component phụ trợ cho phần chọn ngôi sao
  const StarRating = ({ rating, setRating, size = 'text-2xl' }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
      <div className="flex gap-1.5 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className={`material-symbols-outlined ${size} cursor-pointer transition-all duration-150 select-none ${
              (hoverRating || rating) >= star
                ? 'text-yellow-500 fill-current'
                : 'text-outline/30 hover:text-yellow-500'
            }`}
            style={{ fontVariationSettings: (hoverRating || rating) >= star ? '"FILL" 1' : '"FILL" 0' }}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-24 pb-16 text-[#0f172a]">
      <div className="max-w-[700px] mx-auto px-4 space-y-6">
        
        {/* TIÊU ĐỀ TRANG */}
        <div className="text-center py-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#00236f] tracking-tight">
            Đánh giá dịch vụ
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* INFO CARD: CHI TIẾT CUỐC XE */}
          {booking && (
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div>
                <h3 className="font-extrabold text-[#00236f] text-lg uppercase">{booking.packageName}</h3>
                <p className="text-sm font-bold text-[#1e293b] mt-1">{booking.vehicle}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">location_on</span> 
                    {booking.branch}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-blue-600">schedule</span> 
                    <span className="whitespace-pre-line">{booking.time}</span>
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl text-center shadow-inner min-w-[120px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mã cuốc xe</p>
                <p className="font-black text-[#00236f] text-sm">{bookingId.split('-')[0].toUpperCase()}</p>
              </div>
            </div>
          )}

          {/* BOX 1: TRẢI NGHIỆM TỔNG THỂ */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm text-center space-y-4">
            <h3 className="font-extrabold text-[#1e293b] text-sm tracking-wide uppercase">
              Trải nghiệm tổng thể của bạn?
            </h3>
            <StarRating rating={overallRating} setRating={setOverallRating} size="text-3xl" />
          </div>

          {/* BOX 2: CÁC TIÊU CHÍ CHI TIẾT */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm space-y-5">
            
            {/* Độ sạch xe */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-[#f1f5f9] last:border-0 gap-3">
              <div>
                <h4 className="font-extrabold text-sm text-[#1e293b]">Độ sạch của xe</h4>
                <p className="text-[11px] text-outline mt-0.5">Mức độ hài lòng về chất lượng tẩy rửa.</p>
              </div>
              <StarRating rating={cleanlinessRating} setRating={setCleanlinessRating} />
            </div>

            {/* Tốc độ xử lý */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-[#f1f5f9] last:border-0 gap-3">
              <div>
                <h4 className="font-extrabold text-sm text-[#1e293b]">Tốc độ xử lý</h4>
                <p className="text-[11px] text-outline mt-0.5">Bạn có hài lòng với thời gian chờ đợi?</p>
              </div>
              <StarRating rating={speedRating} setRating={setSpeedRating} />
            </div>

            {/* Thái độ phục vụ */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 last:border-0 gap-3">
              <div>
                <h4 className="font-extrabold text-sm text-[#1e293b]">Thái độ phục vụ</h4>
                <p className="text-[11px] text-outline mt-0.5">Sự chuyên nghiệp từ đội ngũ nhân viên.</p>
              </div>
              <StarRating rating={staffRating} setRating={setStaffRating} />
            </div>

          </div>

          {/* BOX 3: NHẬN XÉT CHI TIẾT */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-extrabold text-[#00236f] text-sm tracking-wide">
              Nhận xét chi tiết
            </h3>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Hãy cho chúng tôi biết về trải nghiệm của bạn..."
              className="w-full p-4 border border-[#cbd5e1] rounded-2xl outline-none text-sm transition-all focus:ring-2 focus:ring-[#00236f]/25 focus:border-[#00236f] bg-slate-50/50"
            />
          </div>

          {/* BOX 4: TẢI ẢNH XE LÊN */}
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-extrabold text-[#00236f] text-sm tracking-wide">
              Tải lên hình ảnh xe của bạn (tùy chọn)
            </h3>
            <label className="border-2 border-dashed border-[#cbd5e1] hover:border-[#00236f]/60 bg-[#f8fafc] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 gap-3 select-none">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="material-symbols-outlined text-4xl text-[#00236f] font-light">cloud_upload</span>
              {uploadedFileName ? (
                <div>
                  <p className="text-xs font-bold text-[#00236f]">{uploadedFileName}</p>
                  <p className="text-[10px] text-emerald-600 mt-1">Đã chọn ảnh thành công</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-extrabold text-[#1e293b]">Nhấp hoặc kéo tệp vào đây để tải lên</p>
                  <p className="text-[10px] text-outline mt-1">Hỗ trợ JPG, PNG (Tối đa 10MB)</p>
                </div>
              )}
            </label>
          </div>

          {/* NÚT GỬI ĐÁNH GIÁ */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-[#00236f] hover:bg-[#00174b] text-white rounded-full font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>Đang gửi đánh giá...</>
              ) : (
                <>
                  <span>Gửi đánh giá</span>
                  <span className="material-symbols-outlined text-base">send</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </main>
  );
}
