import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_REVIEWS = [
  {
    id: 'REV-001',
    bookingId: 'BKG-003',
    customerName: 'Lê Quang Trường',
    vehicle: 'Toyota Camry (51H-123.45)',
    rating: 5,
    comment: 'Dịch vụ rất tốt, nhân viên nhiệt tình, rửa xe sạch bóng loáng!',
    createdAt: '06/06/2026',
    branchId: 'BRN-BT-01',
    reply: 'Cảm ơn anh Trường đã tin tưởng dịch vụ LunaWash! Rất hân hạnh được phục vụ anh lần sau.'
  },
  {
    id: 'REV-002',
    bookingId: 'BKG-004',
    customerName: 'Phạm Minh',
    vehicle: 'Ford Ranger (51H-998.88)',
    rating: 4,
    comment: 'Rửa xe kỹ, vệ sinh nội thất sạch sẽ. Tuy nhiên thời gian chờ hơi lâu hơn dự kiến 5 phút.',
    createdAt: '06/06/2026',
    branchId: 'BRN-BT-01',
    reply: null
  },
  {
    id: 'REV-011',
    bookingId: 'BKG-012',
    customerName: 'Nguyễn Văn An',
    vehicle: 'Mazda 3 (51B-222.22)',
    rating: 5,
    comment: 'Nhân viên trạm Quận 1 làm việc rất chuyên nghiệp, phòng chờ mát mẻ.',
    createdAt: '05/06/2026',
    branchId: 'BRN-Q1-01',
    reply: null
  }
];

const BRANCH_NAMES = {
  'BRN-BT-01': 'LunaWash Bình Thạnh - Chi nhánh Bờ Sông',
  'BRN-Q1-01': 'LunaWash Quận 1 - Chi nhánh Trung Tâm'
};

export default function BranchFeedback() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    // Check auth
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Get reviews
    const storedReviews = localStorage.getItem('lunaWash_reviews');
    if (!storedReviews) {
      localStorage.setItem('lunaWash_reviews', JSON.stringify(DEFAULT_REVIEWS));
      setReviews(DEFAULT_REVIEWS);
    } else {
      try {
        setReviews(JSON.parse(storedReviews));
      } catch (e) {
        setReviews(DEFAULT_REVIEWS);
      }
    }
  }, [navigate]);

  if (!user) return null;

  const branchId = user.branchId || 'BRN-BT-01';
  const branchName = BRANCH_NAMES[branchId] || 'Chi nhánh LunaWash';

  // Filter reviews belonging to this branch
  const branchReviews = reviews.filter(r => r.branchId === branchId);

  const handleExportFeedback = () => {
    alert(`Đang tải báo cáo đánh giá & phản hồi cho: ${branchName}\nTổng số đánh giá: ${branchReviews.length} lượt\nĐã xuất báo cáo thành công!`);
  };

  const handleSendReply = (reviewId) => {
    if (!replyText.trim()) return;

    const updated = reviews.map(r => {
      if (r.id === reviewId) {
        return { ...r, reply: replyText };
      }
      return r;
    });

    localStorage.setItem('lunaWash_reviews', JSON.stringify(updated));
    setReviews(updated);
    setActiveReplyId(null);
    setReplyText('');
    alert('Đã gửi phản hồi phản hồi cho khách hàng thành công!');
  };

  const handleContactSupport = (review) => {
    alert(`Đang kết nối tới tổng đài hỗ trợ kỹ thuật LunaWash...\nKhách hàng: ${review.customerName}\nĐánh giá: ${review.rating} sao\nNội dung khiếu nại: "${review.comment}"`);
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-xl">reviews</span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Phản hồi khách hàng</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-[#00236f] leading-tight">
              Đánh Giá Dịch Vụ Tại Trạm
            </h1>
            <p className="text-sm text-on-surface-variant/80 mt-1">
              Trạm: <span className="font-extrabold text-[#00236f]">{branchName}</span>
            </p>
          </div>

          {/* Export Report button (Manager Only) */}
          {user.tier === 'BranchManager' && (
            <button
              onClick={handleExportFeedback}
              className="px-5 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 shadow-md active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Xuất báo cáo
            </button>
          )}
        </div>

        {/* Feedback Cards List */}
        <div className="flex flex-col gap-6">
          {branchReviews.length === 0 ? (
            <div className="glass-card rounded-[32px] p-12 text-center border border-outline-variant/30 text-on-surface-variant/60 font-medium">
              Chưa có đánh giá nào từ khách hàng tại chi nhánh này.
            </div>
          ) : (
            branchReviews.map((r) => (
              <div key={r.id} className="glass-card rounded-[32px] p-6 md:p-8 border border-outline-variant/30 shadow-md relative overflow-hidden group hover:border-[#00236f]/30 transition-all duration-300">
                
                {/* Upper row: Customer Info & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary text-white font-bold text-sm flex items-center justify-center shadow-sm select-none">
                      {r.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">{r.customerName}</h4>
                      <p className="text-xs text-on-surface-variant/80">Xe: <span className="font-semibold text-primary">{r.vehicle}</span> • {r.createdAt}</p>
                    </div>
                  </div>

                  {/* Stars Display */}
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/50 px-3 py-1 rounded-full w-fit">
                    <span className="text-xs font-black text-amber-700 mr-1">{r.rating}.0</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`material-symbols-outlined text-sm ${
                          star <= r.rating ? 'text-amber-500 fill-current' : 'text-outline-variant'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>

                {/* Feedback Comment */}
                <div className="bg-surface-container-low/60 rounded-2xl p-4 border border-outline-variant/20 mb-4">
                  <p className="text-on-surface text-sm italic leading-relaxed">
                    "{r.comment}"
                  </p>
                </div>

                {/* Existing Reply */}
                {r.reply && (
                  <div className="ml-4 md:ml-8 mt-4 border-l-2 border-[#00236f] pl-4 py-1 relative">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="material-symbols-outlined text-[#00236f] text-sm">reply</span>
                      <span className="text-xs font-black uppercase tracking-wider text-[#00236f]">Phản hồi của trạm</span>
                    </div>
                    <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                      {r.reply}
                    </p>
                  </div>
                )}

                {/* Manager actions */}
                {user.tier === 'BranchManager' && (
                  <div className="flex justify-end gap-2 mt-6 border-t border-outline-variant/20 pt-4">
                    {!r.reply && activeReplyId !== r.id && (
                      <button
                        onClick={() => setActiveReplyId(r.id)}
                        className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-container shadow-sm active:scale-95 transition-all text-xs flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">reply</span>
                        Trả lời
                      </button>
                    )}
                    <button
                      onClick={() => handleContactSupport(r)}
                      className="px-4 py-2 bg-white text-on-surface border border-outline-variant/50 hover:bg-surface-container-low font-bold rounded-xl active:scale-95 transition-all text-xs flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm text-error">phone</span>
                      Liên hệ hỗ trợ
                    </button>
                  </div>
                )}

                {/* Reply Form */}
                {activeReplyId === r.id && (
                  <div className="mt-4 border-t border-outline-variant/20 pt-4 animate-fadeIn">
                    <textarea
                      placeholder="Nhập nội dung phản hồi khách hàng tại đây..."
                      className="w-full p-4 bg-surface-container-low/75 border border-outline-variant/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm transition-all h-24"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => { setActiveReplyId(null); setReplyText(''); }}
                        className="px-3 py-1.5 bg-white text-on-surface border border-outline-variant/50 hover:bg-surface-container-low font-bold rounded-lg text-xs"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleSendReply(r.id)}
                        className="px-4 py-1.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-container text-xs"
                      >
                        Gửi phản hồi
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
