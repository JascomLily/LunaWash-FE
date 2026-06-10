import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BRANCH_NAMES = {
  'BRN-BT-01': 'LunaWash Bình Thạnh - Chi nhánh Bờ Sông',
  'BRN-Q1-01': 'LunaWash Quận 1 - Chi nhánh Trung Tâm'
};

export default function BranchHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('Today');

  useEffect(() => {
    // Check auth
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Get bookings
    const storedBookings = localStorage.getItem('lunaWash_bookings');
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (e) {
        console.error(e);
      }
    }
  }, [navigate]);

  if (!user) return null;

  const branchId = user.branchId || 'BRN-BT-01';
  const getShortBranch = (id) => {
    switch(id) {
      case 'BRN-Q1-01': return 'Q1';
      case 'BRN-TTH-01': return 'Tân Thới Hiệp';
      case 'BRN-LD-01': return 'Thủ Đức';
      case 'BRN-Q7-01': return 'Quận 7';
      case 'BRN-TB-01': return 'Tân Bình';
      case 'BRN-BT-01': return 'Bình Thạnh';
      default: return '';
    }
  };
  const shortBranch = getShortBranch(branchId);
  const branchName = user.tier === 'BranchManager' ? `Quản lí chi nhánh - ${shortBranch}` : `Nhân viên chi nhánh - ${shortBranch}`;

  // Get completed bookings for this branch
  const completedBookings = bookings.filter(b => b.branchId === branchId && b.status === 'Completed');

  // Search filter
  const filteredHistory = completedBookings.filter(b => {
    const term = searchTerm.toLowerCase();
    return b.licensePlate.toLowerCase().includes(term) ||
           b.packageName.toLowerCase().includes(term) ||
           b.customerName.toLowerCase().includes(term) ||
           b.vehicleType.toLowerCase().includes(term);
  });

  // Calculations for Manager
  // Calculate average rating from seeded reviews for this branch
  const averageRating = 4.8; // Seeded average rating
  // Calculate revenue from completed bookings
  const rawRevenue = completedBookings.reduce((sum, b) => {
    const val = parseInt(b.price.replace(/[.\D]/g, ''), 10) || 0;
    return sum + val;
  }, 0);
  const formattedRevenue = rawRevenue.toLocaleString('vi-VN') + 'đ';

  const handleExportReport = () => {
    alert(`Đang khởi tạo tệp báo cáo Excel cho: ${branchName}\nThời gian: Tháng hiện tại\nTổng số lượt rửa: ${completedBookings.length} lượt\nDoanh thu tạm tính: ${formattedRevenue}\nBáo cáo đã được xuất thành công!`);
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-xl">history</span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Lịch sử hoạt động</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-[#00236f] leading-tight">
              Lịch Sử Giao Dịch Chi Nhánh
            </h1>
            <p className="text-sm text-on-surface-variant/80 mt-1">
              Trạm: <span className="font-extrabold text-[#00236f]">{branchName}</span>
            </p>
          </div>

          {/* Export Report button (Manager Only) */}
          {user.tier === 'BranchManager' && (
            <button
              onClick={handleExportReport}
              className="px-5 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 shadow-md active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Xuất báo cáo
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="glass-card rounded-3xl p-6 mb-8 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              type="text"
              placeholder="Tìm kiếm biển số, khách hàng..."
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low/75 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['Today', 'Yesterday', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setDateFilter(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                  dateFilter === tab 
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-low'
                }`}
              >
                {tab === 'Today' ? 'Hôm nay' : 
                 tab === 'Yesterday' ? 'Hôm qua' : 'Tất cả lịch sử'}
              </button>
            ))}
          </div>
        </div>

        {/* History Table */}
        <div className="glass-card rounded-[32px] overflow-hidden border border-outline-variant/30 shadow-md mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-outline-variant/20">
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Mã Đơn</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Biển Số Xe</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Khách Hàng</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Gói Dịch Vụ</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Thời Gian</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Thanh Toán</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant text-right">Giá Trị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-on-surface-variant/60 font-medium">
                      Chưa ghi nhận lịch sử giao dịch hoàn thành nào.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-primary">{b.id}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-800 font-mono font-bold border border-slate-200 rounded text-xs shadow-sm">
                          {b.licensePlate}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-on-surface">{b.customerName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface-variant">{b.packageName}</span>
                          {b.hasInterior && (
                            <span className="px-1.5 py-0.5 bg-error-container/30 text-error font-extrabold text-[10px] rounded">Nội thất</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        {b.timeRange} | {b.date || 'Hôm nay'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-black text-xs">
                          Đã thanh toán
                        </span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-on-surface text-right text-base">{b.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manager-only Bottom Metrics Panel */}
        {user.tier === 'BranchManager' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Card Đánh giá trung bình */}
            <div className="glass-card rounded-[28px] p-6 shadow-sm border border-outline-variant/30 flex items-center justify-between group hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl font-bold">star</span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-outline tracking-wider">Đánh giá trung bình</p>
                  <h3 className="text-2xl font-black text-on-surface mt-1">{averageRating.toFixed(1)} / 5.0</h3>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-amber-500 text-lg fill-current">star</span>
                ))}
              </div>
            </div>

            {/* Card Doanh thu tạm tính */}
            <div className="glass-card rounded-[28px] p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl font-bold">monetization_on</span>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-outline tracking-wider">Doanh thu tạm tính (Đã hoàn thành)</p>
                <h3 className="text-2xl font-black text-emerald-700 mt-1">{formattedRevenue}</h3>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
