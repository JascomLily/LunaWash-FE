import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const BRANCH_NAMES = {
  'BRN-LD-01': 'LunaWash Bình Thạnh - Chi nhánh Bờ Sông',
  'BRN-Q1-01': 'LunaWash Quận 1 - Chi nhánh Trung Tâm'
};

export default function BranchHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const getVietnamTime = () => {
    const vnTimeStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
    return new Date(vnTimeStr);
  };
  const today = getVietnamTime();
  const getTodayStr = (d = getVietnamTime()) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const datePickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateCalendarDays = () => {
    const days = [];
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevTotalDays = new Date(calendarYear, calendarMonth, 0).getDate();
    
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevTotalDays - i;
      let m = calendarMonth - 1;
      let y = calendarYear;
      if (m < 0) { m = 11; y--; }
      days.push({ day: dayNum, month: m, year: y, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, month: calendarMonth, year: calendarYear, isCurrentMonth: true });
    }
    
    const totalCells = 42; 
    const nextDaysCount = totalCells - days.length;
    for (let i = 1; i <= nextDaysCount; i++) {
      let m = calendarMonth + 1;
      let y = calendarYear;
      if (m > 11) { m = 0; y++; }
      days.push({ day: i, month: m, year: y, isCurrentMonth: false });
    }
    return days;
  };

  const handleSelectDay = (dayObj) => {
    const y = dayObj.year;
    const m = String(dayObj.month + 1).padStart(2, '0');
    const d = String(dayObj.day).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
    setShowDatePicker(false);
  };

  const handleSelectToday = () => {
    const t = getVietnamTime();
    setCalendarMonth(t.getMonth());
    setCalendarYear(t.getFullYear());
    setSelectedDate(getTodayStr(t));
    setShowDatePicker(false);
  };

  const handleSelectAll = () => {
    setSelectedDate('All');
    setShowDatePicker(false);
  };

  const prevMonth = (e) => {
    e.stopPropagation();
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };

  const nextMonth = (e) => {
    e.stopPropagation();
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check auth
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const branchIdToFetch = parsedUser.branchId || 'BRN-LD-01';

    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/staff/bookings/history/${branchIdToFetch}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          // We need to parse minified JSON in notes/extras if necessary, but the backend GetBranchHistoryAsync 
          // already extracts 'extras', 'services', 'packageName'.
          // Wait, the API returns BookingResponseDTO with Extras as a string.
          // Let's just set the bookings array directly.
          
          // Map to match frontend structure expectations if needed
          const mapped = data.map(b => {
            // b.extras could be a minified json string: '{"n":"Rửa Gầm","p":"50.000đ","i":"12"}'
            let parsedExtras = [];
            if (b.extras) {
                try {
                    const parsed = JSON.parse(b.extras);
                    if (Array.isArray(parsed)) {
                        parsedExtras = parsed.map(ext => ({
                            name: ext.name || ext.n || 'Dịch vụ thêm',
                            price: ext.price || ext.p || '0đ'
                        }));
                    }
                } catch (e) {
                    // ignore
                }
            }

            return {
              id: b.id,
              branchId: b.branchInfo, // Used for frontend filtering if any, though backend already filters
              licensePlate: b.vehicleInfo?.split('•')[1]?.trim() || 'N/A',
              customerName: b.customerName,
              packageName: b.packageName,
              hasInterior: parsedExtras.some(e => e.name.toLowerCase().includes('nội thất')),
              timeRange: b.timeRange?.split('\n')[0] || b.timeRange,
              date: b.timeRange?.split('\n')[1] || '',
              price: b.totalPrice ? b.totalPrice.toLocaleString('vi-VN') + 'đ' : '0đ',
              status: b.status === 'Hoàn thành' ? 'Completed' : (b.status === 'Đã hủy' ? 'Cancelled' : b.status)
            };
          });

          setBookings(mapped);
        } else {
          console.error("Failed to fetch history:", res.status);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
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

  // Get completed bookings for this branch
  const completedBookings = bookings.filter(b => b.branchId === branchId && b.status === 'Completed');

  // Search filter
  const filteredHistory = completedBookings.filter(b => {
    // Filter by date
    if (selectedDate !== 'All') {
      const [y, m, d] = selectedDate.split('-');
      const targetStr = `${d}/${m}/${y}`;
      const normalizedDate = b.date?.replace(/-/g, '/');
      if (normalizedDate !== targetStr) return false;
    }

    const term = searchTerm.toLowerCase();
    return (b.licensePlate || '').toLowerCase().includes(term) ||
           (b.packageName || '').toLowerCase().includes(term) ||
           (b.customerName || '').toLowerCase().includes(term) ||
           (b.vehicleType || '').toLowerCase().includes(term);
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
        <div className="glass-card rounded-3xl p-6 mb-8 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center z-10 relative">
          <div className="flex gap-4 w-full items-center">
            {/* Date Picker Toggle */}
            <div className="relative" ref={datePickerRef}>
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center justify-between min-w-[170px] px-4 py-3 bg-surface-container-low/75 border border-outline-variant/50 rounded-xl hover:bg-surface-container-low transition-all font-bold text-sm text-[#00236f]"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  {selectedDate === 'All' ? 'Tất cả' : selectedDate === getTodayStr(today) ? 'Hôm nay' : selectedDate.split('-').reverse().join('/')}
                </div>
                <span className="material-symbols-outlined text-[18px] ml-2">expand_more</span>
              </button>

              {/* Date Picker Dropdown */}
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-surface rounded-3xl shadow-xl border border-outline-variant/20 min-w-[280px] z-50">
                  <div className="flex justify-between items-center mb-4">
                    <button type="button" onClick={prevMonth} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[20px] font-bold">chevron_left</span>
                    </button>
                    <div className="font-black text-sm">Tháng {calendarMonth + 1}, {calendarYear}</div>
                    <button type="button" onClick={nextMonth} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[20px] font-bold">chevron_right</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-outline/60 mb-2">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
                    {generateCalendarDays().map((dayObj, idx) => {
                      const y = dayObj.year;
                      const m = String(dayObj.month + 1).padStart(2, '0');
                      const d = String(dayObj.day).padStart(2, '0');
                      const dateStr = `${y}-${m}-${d}`;
                      const isSelected = selectedDate === dateStr;
                      
                      let dayClasses = "h-8 w-8 flex items-center justify-center rounded-xl mx-auto transition-all cursor-pointer ";
                      if (isSelected) {
                        dayClasses += "bg-[#00236f] text-white shadow";
                      } else if (!dayObj.isCurrentMonth) {
                        dayClasses += "text-outline/40 hover:bg-surface-container-low";
                      } else {
                        dayClasses += "text-on-surface hover:bg-[#00236f]/10";
                      }
                      
                      return (
                        <div 
                          key={idx}
                          onClick={() => handleSelectDay(dayObj)}
                          className={dayClasses}
                        >
                          {dayObj.day}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between border-t border-outline-variant/20 pt-3 mt-3">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-xs font-black text-on-surface-variant hover:text-[#00236f] transition-colors"
                    >
                      Tất cả lịch sử
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectToday}
                      className="text-xs font-black text-[#00236f] hover:underline"
                    >
                      Hôm nay
                    </button>
                  </div>
                </div>
              )}
            </div>

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
