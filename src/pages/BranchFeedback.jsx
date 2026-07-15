import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const BRANCH_NAMES = {
  'BRN-LD-01': 'LunaWash Bình Thạnh - Chi nhánh Bờ Sông',
  'BRN-Q1-01': 'LunaWash Quận 1 - Chi nhánh Trung Tâm'
};

export default function BranchFeedback() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchReviews = async (branchId, token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Reviews/branch/${branchId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(r => ({
          ...r,
          rating: r.overallRating,
          vehicle: r.vehicleInfo,
          reply: r.reply
        }));
        setReviews(mapped);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetchReviews(parsedUser.branchId || 'BRN-LD-01', parsedUser.token);
  }, [navigate]);

  if (!user) return null;

  const branchId = user.branchId || 'BRN-LD-01';
  const getShortBranch = (id) => {
    switch(id) {
      case 'BRN-Q1-01': return 'Quận 1';
      case 'BRN-TTH-01': return 'Tân Thới Hiệp';
      case 'BRN-LD-01': return 'Linh Đông';
      case 'BRN-Q7-01': return 'Quận 7';
      case 'BRN-TB-01': return 'Tân Bình';
      default: return '';
    }
  };
  const shortBranch = getShortBranch(branchId);
  const branchName = user.tier === 'BranchManager' ? `Quản lí chi nhánh - ${shortBranch}` : `Nhân viên chi nhánh - ${shortBranch}`;

  const branchReviews = reviews;

  const handleExportFeedback = () => {
    if (branchReviews.length === 0) {
      toast.error('Không có dữ liệu để xuất báo cáo.');
      return;
    }
    setIsExportModalOpen(true);
  };

  const executeExport = () => {

    // Tiêu đề các cột
    const headers = [
      'Ngày Đánh Giá',
      'Tên Khách Hàng',
      'Phương Tiện',
      'Điểm Tổng Quan',
      'Điểm Sạch Sẽ',
      'Điểm Nhanh Chóng',
      'Điểm Thái Độ',
      'Nội Dung Nhận Xét',
      'Nội Dung Phản Hồi Từ Trạm'
    ];

    // Tạo các dòng dữ liệu
    const rows = branchReviews.map(r => {
      const date = new Date(r.createdAt).toLocaleString('vi-VN');
      // Format chuỗi, escape ngoặc kép để an toàn cho CSV
      const name = `"${(r.customerName || '').replace(/"/g, '""')}"`;
      const vehicle = `"${(r.vehicle || '').replace(/"/g, '""')}"`;
      const overall = r.rating || '';
      const clean = r.cleanlinessRating || '';
      const speed = r.speedRating || '';
      const staff = r.staffRating || '';
      const comment = `"${(r.comment || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      const reply = `"${(r.reply || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      
      return [date, name, vehicle, overall, clean, speed, staff, comment, reply].join(',');
    });

    // Kết hợp tiêu đề và nội dung, thêm UTF-8 BOM để Excel hiển thị tiếng Việt
    const csvContent = "\uFEFF" + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Tự động tải xuống
    const link = document.createElement('a');
    const safeBranchName = branchName.replace(/[^a-zA-Z0-9À-ỹ]/g, '_');
    link.href = url;
    link.setAttribute('download', `BaoCao_DanhGia_${safeBranchName}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportModalOpen(false);
    toast.success('Xuất báo cáo thành công!');
  };

  const handleSendReply = async (reviewId) => {
    if (!replyText.trim()) return;

    try {
      const payload = {
        replyText: replyText.trim()
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Đã gửi phản hồi thành công!');
        fetchReviews(branchId, user.token); // Reload
        setActiveReplyId(null);
        setReplyText('');
      } else {
        const errorData = await res.json();
        toast.error(`Lỗi: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Đã xảy ra lỗi khi gửi phản hồi.');
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <main className="min-h-screen bg-background pt-28 pb-16 px-margin-mobile md:px-margin-desktop relative">
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
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">description</span>
              Xuất Báo Cáo
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
                      <p className="text-xs text-on-surface-variant/80">Xe: <span className="font-semibold text-primary">{r.vehicle}</span> • {new Date(r.createdAt).toLocaleDateString('vi-VN')} {new Date(r.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</p>
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

                {/* Actions */}
                {user.tier === 'BranchManager' && (
                  <div className="flex justify-end gap-2 mt-6 border-t border-outline-variant/20 pt-4">
                    {!r.reply && activeReplyId !== r.id && (
                      <button
                        onClick={() => {
                          setActiveReplyId(r.id);
                        }}
                        className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-container shadow-sm active:scale-95 transition-all text-xs flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">reply</span>
                        Trả lời khách hàng
                      </button>
                    )}
                  </div>
                )}

                {/* Reply Form */}
                {activeReplyId === r.id && (
                  <div className="mt-4 border-t border-outline-variant/20 pt-4 animate-fadeIn">
                    <textarea
                      placeholder="Nhập nội dung phản hồi khách hàng tại đây..."
                      className="w-full p-4 bg-surface-container-low/75 border border-outline-variant/50 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm transition-all h-24 mb-3"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    
                    <div className="flex justify-end gap-2 shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => { setActiveReplyId(null); setReplyText(''); }}
                          className="px-4 py-2.5 bg-white text-on-surface border border-outline-variant/50 hover:bg-surface-container-low font-bold rounded-xl text-xs active:scale-95 transition-all flex-1 sm:flex-none"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleSendReply(r.id)}
                          className="px-6 py-2.5 bg-[#00236f] text-white font-bold rounded-xl hover:bg-[#00174f] shadow-md text-xs active:scale-95 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
                        >
                          <span className="material-symbols-outlined text-sm">send</span>
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

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white flex flex-col items-center justify-center text-center relative">
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-md">
                <span className="material-symbols-outlined text-4xl text-white">summarize</span>
              </div>
              <h3 className="font-headline-sm text-xl font-bold">Xuất Báo Cáo Phản Hồi</h3>
              <p className="text-white/80 text-sm mt-1">Định dạng file CSV (Hỗ trợ Excel)</p>
            </div>
            
            <div className="p-6">
              <div className="bg-surface-container-low rounded-2xl p-4 mb-6 border border-outline-variant/30">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant text-sm">Chi nhánh</span>
                  <span className="text-on-surface font-bold text-sm text-right">{shortBranch}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">Tổng số lượt đánh giá</span>
                  <span className="text-primary font-black text-lg bg-primary/10 px-3 py-0.5 rounded-full">{branchReviews.length}</span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant/70 text-center mb-6 px-4">
                Báo cáo sẽ bao gồm toàn bộ nhận xét, điểm đánh giá chi tiết, thông tin xe và lịch sử phản hồi của nhân viên.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="flex-1 py-3.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold rounded-xl transition-colors active:scale-95"
                >
                  Hủy Bỏ
                </button>
                <button
                  onClick={executeExport}
                  className="flex-[2] py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">download</span>
                  Tải Xuống Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
    </>
  );
}
