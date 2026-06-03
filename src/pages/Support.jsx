import React, { useState } from 'react';

// CẤU HÌNH DỮ LIỆU TẬP TRUNG - Dễ dàng bảo trì và mở rộng sau này
const HELPDESK_TAGS = ['#Booking', '#Payment', '#Packages'];

const HELPDESK_TOPICS = [
  {
    category: 'Booking',
    icon: 'calendar_month',
    colorClass: 'text-sky-500 bg-sky-50',
    questions: [
      { text: 'Cách đặt lịch rửa xe nhanh?', desc: 'Bạn chỉ cần chọn chi nhánh, trạm rửa, gói dịch vụ và khung giờ trống trên trang Đặt Lịch.' },
      { text: 'Thay đổi thời gian hẹn?', desc: 'Vào phần "Lịch Sử", chọn lịch đặt đang hoạt động và cập nhật lại thời gian trước 30 phút.' },
      { text: 'Hủy lịch có mất phí không?', desc: 'Hủy lịch hoàn toàn miễn phí nếu thực hiện trước giờ hẹn ít nhất 30 phút.' }
    ]
  },
  {
    category: 'Payment',
    icon: 'payments',
    colorClass: 'text-teal-500 bg-teal-50',
    questions: [
      { text: 'Phương thức thanh toán?', desc: 'Hỗ trợ thanh toán trực tiếp tại quầy, QR Banking, Momo và VNPAY.' },
      { text: 'Xử lý lỗi thanh toán?', desc: 'Nếu giao dịch bị trừ tiền nhưng chưa xác nhận, vui lòng liên hệ hotline 1900 8888 để đối soát nhanh.' },
      { text: 'Hóa đơn điện tử VAT?', desc: 'Hóa đơn đỏ sẽ được tự động gửi về Email đăng ký của bạn sau khi hoàn thành dịch vụ.' }
    ]
  },
  {
    category: 'Service Packages',
    icon: 'inventory_2',
    colorClass: 'text-indigo-500 bg-indigo-50',
    questions: [
      { text: 'Gói Luna Premium gồm gì?', desc: 'Bao gồm toàn bộ các bước vệ sinh sâu, tẩy nhựa đường, phủ bóng Ceramic cao cấp và diệt khuẩn khoang máy.' },
      { text: 'Dịch vụ phủ ceramic?', desc: 'Giúp tạo lớp màng thủy tinh bảo vệ sơn xe khỏi trầy xước nhẹ và giữ màu sơn bóng loáng lâu dài.' },
      { text: 'Ưu đãi gói thành viên?', desc: 'Hội viên Vàng và Platinum được giảm giá trực tiếp từ 10-15% trên mọi hóa đơn đặt lịch.' }
    ]
  }
];

const SUPPORT_CATEGORIES = [
  'Vấn đề về Đặt Lịch (Booking)',
  'Vấn đề về Thanh Toán (Payment)',
  'Vấn đề về Chất Lượng Dịch Vụ',
  'Yêu cầu nâng cấp/đóng góp ý kiến',
  'Khác'
];

/**
 * Trang Hỗ Trợ Khách Hàng (Support) - LunaWash.
 * Thiết kế khớp hoàn hảo với Ảnh 1, cấu trúc modular rõ ràng.
 */
export default function Support() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Trạng thái hiển thị giải đáp câu hỏi khi click
  const [activeQuestion, setActiveQuestion] = useState(null);

  const handleQuestionClick = (qText, qDesc) => {
    if (activeQuestion?.text === qText) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion({ text: qText, desc: qDesc });
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!category) {
      alert('Vui lòng chọn danh mục vấn đề cần hỗ trợ.');
      return;
    }

    setSubmitting(true);
    // Mô phỏng kết nối gửi yêu cầu hỗ trợ (Dễ dàng tích hợp API BE sau này)
    setTimeout(() => {
      alert(`Gửi yêu cầu thành công! Chúng tôi sẽ phản hồi quý khách qua SĐT ${phone} trong vòng 24 giờ.`);
      setFullName('');
      setPhone('');
      setCategory('');
      setMessage('');
      setSubmitting(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-background pt-20 pb-16 text-on-background">
      
      {/* 1. HEADER BLUE BANNER */}
      <section className="bg-gradient-to-r from-primary to-[#0c317c] text-white py-16 px-margin-mobile md:px-margin-desktop text-center relative overflow-hidden">
        {/* Nền lưới công nghệ */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
            Hỗ trợ khách hàng LunaWash
          </h1>
          
          {/* Thanh tìm kiếm câu hỏi nhanh */}
          <div className="w-full relative max-w-lg mb-4">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm câu hỏi thường gặp..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white text-on-surface rounded-full shadow-lg outline-none focus:ring-2 focus:ring-[#4cd7f6] transition-all text-sm"
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                if (query.length > 2) {
                  // Logic tìm kiếm câu hỏi có thể mở rộng ở đây
                }
              }}
            />
          </div>

          {/* Tags tìm kiếm nhanh */}
          <div className="flex gap-2.5 flex-wrap justify-center mt-2">
            {HELPDESK_TAGS.map((tag, idx) => (
              <button 
                key={idx}
                onClick={() => alert(`Đang lọc chủ đề liên quan đến: ${tag}`)}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-bold transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CHỦ ĐỀ PHỔ BIẾN (FAQ MODULE) */}
      <section className="py-16 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <h2 className="text-2xl font-extrabold text-[#00236f] text-center mb-12 tracking-tight">
          Chủ đề phổ biến
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {HELPDESK_TOPICS.map((topic, tIdx) => (
            <div 
              key={tIdx} 
              className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 shadow-sm flex flex-col"
            >
              {/* Category Icon */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${topic.colorClass}`}>
                <span className="material-symbols-outlined text-2xl font-bold">{topic.icon}</span>
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-lg text-primary mb-4">{topic.category}</h3>

              {/* List of Questions */}
              <ul className="space-y-3.5">
                {topic.questions.map((q, qIdx) => (
                  <li key={qIdx} className="group">
                    <button 
                      onClick={() => handleQuestionClick(q.text, q.desc)}
                      className="w-full flex items-start gap-2.5 text-left text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors py-1 focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-sm text-[#00236f] mt-0.5 group-hover:translate-x-0.5 transition-transform font-bold">
                        chevron_right
                      </span>
                      {q.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Khối hiển thị đáp án khi click câu hỏi */}
        {activeQuestion && (
          <div className="mt-8 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl animate-fadeIn">
            <p className="font-bold text-primary text-sm mb-1">Hỏi: {activeQuestion.text}</p>
            <p className="text-on-surface-variant text-sm leading-relaxed">Đáp: {activeQuestion.desc}</p>
          </div>
        )}
      </section>

      {/* 3. FORM GỬI YÊU CẦU & THÔNG TIN LIÊN HỆ */}
      <section className="py-8 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
        
        {/* Form gửi yêu cầu (2 cột rộng) */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 shadow-md">
          <h3 className="font-extrabold text-2xl text-primary mb-2">Gửi yêu cầu hỗ trợ</h3>
          <p className="text-on-surface-variant text-xs mb-8">Chúng tôi sẽ phản hồi yêu cầu của bạn trong vòng 24 giờ làm việc.</p>

          <form onSubmit={handleSubmitRequest} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Họ và tên</label>
                <input 
                  type="text" 
                  placeholder="Nguyễn Văn A" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Số điện thoại</label>
                <input 
                  type="tel" 
                  placeholder="0901 xxx xxx" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Danh mục vấn đề</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={submitting}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
              >
                <option value="" disabled>Chọn vấn đề cần hỗ trợ</option>
                {SUPPORT_CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Nội dung tin nhắn</label>
              <textarea 
                rows="5"
                placeholder="Mô tả chi tiết vấn đề của bạn..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={submitting}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="px-8 py-3.5 bg-primary text-white hover:bg-primary-container rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu'}
            </button>
          </form>
        </div>

        {/* Thông tin liên hệ & Bản đồ (1 cột) */}
        <div className="space-y-6">
          {/* Card thông tin liên hệ */}
          <div className="bg-[#4cd7f6]/10 border border-[#4cd7f6]/30 rounded-3xl p-6 shadow-sm">
            <h4 className="font-extrabold text-primary text-base mb-6">Thông tin liên hệ</h4>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4cd7f6]/25 text-primary flex items-center justify-center select-none flex-shrink-0">
                  <span className="material-symbols-outlined text-lg font-bold">call</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-outline tracking-wider uppercase">Hotline 24/7</p>
                  <p className="font-extrabold text-primary text-sm">1900 8888</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4cd7f6]/25 text-primary flex items-center justify-center select-none flex-shrink-0">
                  <span className="material-symbols-outlined text-lg font-bold">mail</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-outline tracking-wider uppercase">Email hỗ trợ</p>
                  <p className="font-extrabold text-primary text-sm">support@lunawash.vn</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4cd7f6]/25 text-primary flex items-center justify-center select-none flex-shrink-0">
                  <span className="material-symbols-outlined text-lg font-bold">location_on</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-outline tracking-wider uppercase">Trụ sở chính</p>
                  <p className="font-extrabold text-primary text-sm leading-tight">
                    Khu Công nghệ cao, Quận 9, TP. Thủ Đức, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bản đồ đại diện */}
          <div className="relative rounded-3xl overflow-hidden border border-outline-variant/40 shadow-sm aspect-[4/3] group">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVp-ElKaKgA0s_v90niy_KwxhEadE7jG27OC3d1jCmHnDauQKEVuMlHROliCs_QHtqoKKvZTfwAelVvIOmHVg9KLnw4Goa2H22D1id4fjnPZTaP0UsHB4Ott_2nWKym7BpgeBD3CyxhitVT4GdZb_OnVfm9FUFD_vGwP1Z_RaE2tN_zxHaxX2rBbGEVkYD1hguoHZ26uG495LorzZxnR5gb9S3mOSppn-BKSw4X1iR06FM08jzf1nPOIbhuw9mqK476UWujEeSfuU" 
              alt="Bản đồ trụ sở LunaWash" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/25 flex items-end p-4">
              <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-lg select-none">
                Bản đồ trụ sở LunaWash
              </span>
            </div>
          </div>
        </div>

      </section>

    </main>
  );
}
