import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Seed data for bookings if not already in localStorage
// DEMO: Dữ liệu mẫu tạm thời. Đợi BE viết API trả về danh sách lịch hẹn của trạm
const DEFAULT_BOOKINGS = [
  // Binh Thanh Branch (BRN-BT-01)
  {
    id: 'BKG-001',
    licensePlate: '51K-999.88',
    vehicleType: 'Ô tô 4 chỗ',
    packageName: 'Gói Cao Cấp',
    branchId: 'BRN-LD-01',
    timeRange: '08:30 AM',
    status: 'Pending',
    hasInterior: true,
    price: '450.000đ',
    customerName: 'Lê Quang Trường',
    notes: 'Rửa xe 4 chỗ cơ bản và làm bóng sơn'
  },
  {
    id: 'BKG-002',
    licensePlate: '51H-123.45',
    vehicleType: 'SUV',
    packageName: 'Gói Nâng Cao',
    branchId: 'BRN-LD-01',
    timeRange: '09:30 AM',
    status: 'Washing',
    hasInterior: true,
    price: '250.000đ',
    customerName: 'Lê Quang Trường',
    notes: 'Rửa xe SUV Premium và vệ sinh nội thất kỹ'
  },
  {
    id: 'BKG-003',
    licensePlate: '51G-555.66',
    vehicleType: 'Ô tô 7 chỗ',
    packageName: 'Gói Cơ Bản',
    branchId: 'BRN-LD-01',
    timeRange: '10:30 AM',
    status: 'Completed',
    hasInterior: false,
    price: '150.000đ',
    customerName: 'Lê Quang Trường',
    notes: 'Rửa xe 7 chỗ nhanh'
  },
  {
    id: 'BKG-004',
    licensePlate: '51H-998.88',
    vehicleType: 'Xe bán tải',
    packageName: 'Gói Cao Cấp',
    branchId: 'BRN-LD-01',
    timeRange: '11:00 AM',
    status: 'Pending',
    hasInterior: true,
    price: '500.000đ',
    customerName: 'Phạm Minh',
    notes: 'Vệ sinh gầm và hút bụi kỹ'
  },
  // District 1 Branch (BRN-Q1-01)
  {
    id: 'BKG-011',
    licensePlate: '51A-111.11',
    vehicleType: 'Ô tô 4 chỗ',
    packageName: 'Gói Cao Cấp',
    branchId: 'BRN-Q1-01',
    timeRange: '09:00 AM',
    status: 'Pending',
    hasInterior: true,
    price: '450.000đ',
    customerName: 'Trần Bình',
    notes: 'Rửa sạch sấy khô kỹ'
  },
  {
    id: 'BKG-012',
    licensePlate: '51B-222.22',
    vehicleType: 'SUV',
    packageName: 'Gói Cơ Bản',
    branchId: 'BRN-Q1-01',
    timeRange: '10:00 AM',
    status: 'Washing',
    hasInterior: false,
    price: '180.000đ',
    customerName: 'Nguyễn An',
    notes: 'Rửa nhanh đi công tác'
  }
];

const BRANCH_DETAILS = {
  'BRN-LD-01': {
    name: 'LunaWash Linh Đông',
    address: 'Thủ Đức, HCM',
    phone: '1900 1234'
  },
  'BRN-Q1-01': {
    name: 'LunaWash Quận 1',
    address: '123 Lê Lợi, Bến Thành',
    phone: '1900 5678'
  },
  'BRN-TTH-01': {
    name: 'LunaWash Tân Thới Hiệp',
    address: 'Quận 12, HCM',
    phone: '1900 9012'
  },
  'BRN-Q7-01': {
    name: 'LunaWash Quận 7',
    address: '456 Nguyễn Văn Linh',
    phone: '1900 3456'
  },
  'BRN-TB-01': {
    name: 'LunaWash Tân Bình',
    address: '789 Cộng Hòa, Phường 13',
    phone: '1900 7890'
  }
};

export default function StaffQueue() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [addingInteriorBooking, setAddingInteriorBooking] = useState(null);

  // Date picker states
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const datePickerRef = useRef(null);

  // Handle click outside to close date picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    const t = new Date();
    setCalendarMonth(t.getMonth());
    setCalendarYear(t.getFullYear());
    const y = t.getFullYear();
    const m = String(t.getMonth() + 1).padStart(2, '0');
    const d = String(t.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
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

  const fetchBookings = async (parsedUser, date) => {
    try {
      const branchId = parsedUser.branchId || 'BRN-LD-01';
      const targetDate = date || selectedDate;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/staff/bookings/today/${branchId}?date=${targetDate}`, {
        headers: { 'Authorization': `Bearer ${parsedUser.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(dto => {
          const vehicleParts = dto.vehicleInfo?.split('•') || [];
          const licensePlate = vehicleParts.length > 1 ? vehicleParts[1].trim() : (dto.vehicleInfo || 'Không rõ');
          const vehicleType = vehicleParts.length > 1 ? vehicleParts[0].trim() : 'Không rõ';
          
          let status = dto.status;
          if (status === 'Sắp đến' || status === 'Confirmed' || status === 'Pending') {
            status = 'Pending';
            // Auto-cancel if the car is late (past the end time)
            if (dto.timeRange) {
              try {
                const parts = dto.timeRange.replace('\n', ' ').split(' ');
                if (parts.length >= 4) {
                  const endTimeStr = parts[2]; // "21:45"
                  const dateStr = parts[3]; // "16-06-2026"
                  const [day, month, year] = dateStr.split('-');
                  const [hours, mins] = endTimeStr.split(':');
                  const endTime = new Date(year, month - 1, day, hours, mins);
                  
                  if (new Date() > endTime) {
                     status = 'Cancelled';
                  }
                }
              } catch(e) {}
            }
          }
          else if (status === 'Đang rửa' || status === 'Checked-In') status = 'Washing';
          else if (status === 'Hoàn thành') status = 'Completed';
          else if (status === 'Đã hủy' || status === 'Đã hoãn') status = 'Cancelled';

          return {
            id: dto.id,
            licensePlate,
            vehicleType,
            packageName: dto.packageName,
            branchId: parsedUser.branchId || 'BRN-LD-01',
            timeRange: dto.timeRange?.replace('\n', ' '),
            status: status,
            hasInterior: (dto.services?.toLowerCase().includes('nội thất') || dto.packageName?.toLowerCase().includes('nội thất')),
            price: dto.totalPrice,
            customerName: 'Khách hàng',
            notes: dto.services || dto.extras,
            paymentMethod: dto.paymentMethod,
            rawDto: dto
          };
        });
        setBookings(mapped);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Check auth
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.tier !== 'Staff' && parsedUser.tier !== 'BranchManager') {
      navigate('/');
      return;
    }
    setUser(parsedUser);
    fetchBookings(parsedUser, selectedDate);
  }, [navigate, selectedDate]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // The API already filters bookings by branchId, so no need to filter again.
  const branchBookings = bookings;

  // Stats
  const countPending = branchBookings.filter(b => b.status === 'Pending').length;
  const countWashing = branchBookings.filter(b => b.status === 'Washing').length;
  const countCompleted = branchBookings.filter(b => b.status === 'Completed').length;

  // Search & Filter
  const filteredBookings = branchBookings.filter(b => {
    const matchesSearch = b.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.vehicleType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateBookingStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/staff/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        if (newStatus === 'Washing') toast.success('Đã bắt đầu rửa xe!');
        else if (newStatus === 'Completed') toast.success('Đã check-out hoàn thành!');
        fetchBookings(user);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Có lỗi xảy ra');
      }
    } catch (e) {
      toast.error('Lỗi kết nối đến server');
    }
    setActiveMenuId(null);
  };

  const handleConfirmAddInterior = async () => {
    if (!addingInteriorBooking) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/staff/bookings/${addingInteriorBooking.id}/add-interior-cleaning`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Thêm dịch vụ thành công!');
        setAddingInteriorBooking(null);
        fetchBookings(user);
      } else {
        alert(data.message || 'Không thể thêm dịch vụ.');
      }
    } catch (e) {
      alert('Lỗi kết nối đến server');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Đang chờ</span>;
      case 'Washing':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">Đang rửa</span>;
      case 'Completed':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Hoàn thành</span>;
      case 'Cancelled':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200">Đã hủy</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-50 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  return (
    <>
    <Toaster position="top-right" />
    <main className="min-h-screen bg-background pt-28 pb-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-xl">store</span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Khu vực làm việc</span>
            </div>
            <div className="flex flex-col mb-4">
              <h1 className="font-headline-lg text-headline-lg text-[#00236f] leading-tight">
                {BRANCH_DETAILS[branchId]?.name || branchName}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-on-surface-variant font-medium">
                <span className="material-symbols-outlined text-base text-primary">location_on</span>
                {BRANCH_DETAILS[branchId]?.address || 'Chi nhánh này chưa có địa chỉ'}
                <span className="text-outline-variant ml-2 mr-2">|</span>
                <span className="material-symbols-outlined text-base text-primary">call</span>
                {BRANCH_DETAILS[branchId]?.phone || 'Đang cập nhật'}
              </div>
            </div>
            <p className="text-sm text-on-surface-variant/80 mt-1">
              Vai trò: <span className="font-extrabold text-secondary">{user.tier === 'BranchManager' ? 'Quản lý Chi nhánh' : 'Nhân viên kỹ thuật'}</span>
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
          {/* Card Đang chờ */}
          <div className="glass-card rounded-[24px] p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-blue-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl font-bold">schedule</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-outline tracking-wider">Đang chờ rửa</p>
              <h3 className="text-2xl font-black text-[#00236f] mt-1">{countPending} xe</h3>
            </div>
          </div>

          {/* Card Đang rửa */}
          <div className="glass-card rounded-[24px] p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-amber-500 animate-pulse"></div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl font-bold">local_car_wash</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-outline tracking-wider">Đang trong buồng</p>
              <h3 className="text-2xl font-black text-amber-700 mt-1">{countWashing} xe</h3>
            </div>
          </div>

          {/* Card Hoàn thành */}
          <div className="glass-card rounded-[24px] p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-emerald-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl font-bold">check_circle</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-outline tracking-wider">Hoàn thành hôm nay</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">{countCompleted} xe</h3>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass-card rounded-3xl p-6 mb-8 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center z-10 relative">
          <div className="flex gap-4 w-full md:max-w-xl items-center">
            {/* Date Picker Toggle */}
            <div className="relative" ref={datePickerRef}>
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center justify-between min-w-[150px] px-4 py-3 bg-surface-container-low/75 border border-outline-variant/50 rounded-xl hover:bg-surface-container-low transition-all font-bold text-sm text-[#00236f]"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  {selectedDate === today.toISOString().split('T')[0] ? 'Hôm nay' : selectedDate}
                </div>
                <span className="material-symbols-outlined text-[18px] ml-2">expand_more</span>
              </button>

              {/* Date Picker Dropdown */}
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 p-4 bg-surface rounded-3xl shadow-xl border border-outline-variant/20 min-w-[280px] z-50">
                  {/* Calendar Header */}
                  <div className="flex justify-between items-center mb-4">
                    <button type="button" onClick={prevMonth} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[20px] font-bold">chevron_left</span>
                    </button>
                    <div className="font-black text-sm">Tháng {calendarMonth + 1}, {calendarYear}</div>
                    <button type="button" onClick={nextMonth} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[20px] font-bold">chevron_right</span>
                    </button>
                  </div>

                  {/* Day of Week Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-outline/60 mb-2">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>

                  {/* Day Grid */}
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

                  {/* Footer today link */}
                  <div className="flex justify-end border-t border-outline-variant/20 pt-3 mt-3">
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

            <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              type="text"
              placeholder="Tìm kiếm biển số, gói rửa..."
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low/75 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['All', 'Pending', 'Washing', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                  statusFilter === status 
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-on-surface-variant border-outline-variant/50 hover:bg-surface-container-low'
                }`}
              >
                {status === 'All' ? 'Tất cả' : 
                 status === 'Pending' ? 'Đang chờ' :
                 status === 'Washing' ? 'Đang rửa' :
                 status === 'Completed' ? 'Hoàn thành' : 'Đã hủy'}
              </button>
            ))}
          </div>
        </div>

        {/* Queue Table */}
        <div className="glass-card rounded-[32px] overflow-hidden border border-outline-variant/30 shadow-md">
          <div className="overflow-x-auto min-h-[350px] pb-32">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-outline-variant/20">
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Biển Số Xe</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Loại Xe</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Dịch Vụ Đặt</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Giờ Hẹn</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Trạng Thái</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant text-center">Nội Thất</th>
                  <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-on-surface-variant/60 font-medium">
                      Không có lịch đặt xe nào trong hàng đợi.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-800 font-mono font-bold border border-slate-300 rounded-lg text-sm shadow-sm">
                          {b.licensePlate}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-on-surface">{b.vehicleType}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-primary">{b.packageName}</p>
                          <p className="text-xs text-outline leading-tight mt-0.5">{b.notes}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-on-surface-variant">{b.timeRange}</td>
                      <td className="px-6 py-4">{getStatusBadge(b.status)}</td>
                      <td className="px-6 py-4 text-center">
                        {b.hasInterior ? (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-xs">
                            Có
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-50 text-slate-400 border border-slate-200 rounded-lg font-medium text-xs">
                            Không
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        {user.tier === 'Staff' ? (
                          <div className="flex gap-2 justify-end">
                            {b.status === 'Pending' && !b.hasInterior && (
                              <button
                                onClick={() => setAddingInteriorBooking(b)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition-all text-xs"
                              >
                                Tùy chọn thêm
                              </button>
                            )}
                            {b.status === 'Pending' ? (
                              <button
                                onClick={() => updateBookingStatus(b.id, 'Washing')}
                                className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-container shadow-sm active:scale-95 transition-all text-xs flex items-center gap-1.5 ml-auto"
                              >
                                <span className="material-symbols-outlined text-sm">play_arrow</span>
                                Bắt đầu
                              </button>
                            ) : b.status === 'Washing' ? (
                              <button
                                onClick={() => updateBookingStatus(b.id, 'Completed')}
                                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-sm active:scale-95 transition-all text-xs flex items-center gap-1.5 ml-auto"
                              >
                                <span className="material-symbols-outlined text-sm">check</span>
                                Check-out
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end">
                                <span className="material-symbols-outlined text-base">task_alt</span>
                                Hoàn tất
                              </span>
                            )}
                          </div>
                        ) : (
                          /* Manager: Dropdown Action Menu ... */
                          <div className="relative inline-block text-left" ref={dropdownRef}>
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === b.id ? null : b.id)}
                              className="p-2 hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center select-none"
                              title="Tùy chọn quản lý"
                            >
                              <span className="material-symbols-outlined text-xl">more_vert</span>
                            </button>

                            {activeMenuId === b.id && (
                              <div className="absolute right-0 mt-1 w-52 min-w-[200px] rounded-xl bg-white shadow-xl border border-outline-variant/30 z-50 p-2 animate-fadeIn text-left">
                                {b.status === 'Pending' && !b.hasInterior && (
                                  <button
                                    onClick={() => { setAddingInteriorBooking(b); setActiveMenuId(null); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all whitespace-nowrap"
                                  >
                                    <span className="material-symbols-outlined text-base text-blue-500">add_circle</span>
                                    Tùy chọn thêm
                                  </button>
                                )}
                                {b.status === 'Pending' && (
                                  <button
                                    onClick={() => updateBookingStatus(b.id, 'Washing')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-all whitespace-nowrap"
                                  >
                                    <span className="material-symbols-outlined text-base text-primary">play_arrow</span>
                                    Bắt đầu ca rửa
                                  </button>
                                )}
                                {b.status === 'Washing' && (
                                  <button
                                    onClick={() => updateBookingStatus(b.id, 'Completed')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-all whitespace-nowrap"
                                  >
                                    <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                                    Hoàn thành rửa
                                  </button>
                                )}
                                {b.status !== 'Completed' && b.status !== 'Delayed' && (
                                  <button
                                    onClick={() => updateBookingStatus(b.id, 'Delayed')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-all whitespace-nowrap"
                                  >
                                    <span className="material-symbols-outlined text-base text-amber-500">warning</span>
                                    Báo hoãn xe
                                  </button>
                                )}
                                {b.status === 'Delayed' && (
                                  <button
                                    onClick={() => updateBookingStatus(b.id, 'Pending')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-all whitespace-nowrap"
                                  >
                                    <span className="material-symbols-outlined text-base text-blue-500">restore</span>
                                    Phục hồi hàng chờ
                                  </button>
                                )}
                                <button
                                  onClick={() => alert(`Chi tiết xe: ${b.licensePlate}\nKhách hàng: ${b.customerName}\nGói rửa: ${b.packageName}\nGiá tiền: ${b.price}\nGhi chú: ${b.notes}`)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low rounded-lg transition-all border-t border-outline-variant/10 mt-1 pt-1 whitespace-nowrap"
                                >
                                  <span className="material-symbols-outlined text-base text-outline">info</span>
                                  Xem chi tiết xe
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* POPUP THÊM VỆ SINH NỘI THẤT */}
        {addingInteriorBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-fadeIn">
              <button 
                onClick={() => setAddingInteriorBooking(null)}
                className="absolute top-4 right-4 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <h2 className="text-xl font-black text-[#00236f] mb-2 text-center">THÊM DỊCH VỤ NỘI THẤT</h2>
              <p className="text-sm text-center text-on-surface-variant mb-6">
                Kiểm tra thông tin trước khi thêm dịch vụ cho xe {addingInteriorBooking.licensePlate}
              </p>

              <div className="bg-surface-container-low rounded-2xl p-4 mb-6 border border-outline-variant/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-on-surface-variant">Giá trị ban đầu:</span>
                  <span className="font-bold text-on-surface">{addingInteriorBooking.price}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-on-surface-variant">Thanh toán VNPay:</span>
                  <span className="font-bold text-emerald-600">
                    {addingInteriorBooking.paymentMethod === 'vnpay' ? 'Đã thanh toán đủ gốc' : 'Chưa thu tiền'}
                  </span>
                </div>
                <hr className="border-outline-variant/30 my-3" />
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-on-surface-variant">Phí Vệ sinh nội thất:</span>
                  <span className="font-bold text-amber-600">Tùy loại xe (+Thời gian)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#00236f]">SẼ THU THÊM TẠI QUẦY:</span>
                  <span className="font-black text-lg text-rose-600">Thu tiền mặt chênh lệch</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setAddingInteriorBooking(null)}
                  className="flex-1 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-outline-variant/20 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleConfirmAddInterior}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all flex justify-center items-center gap-2 shadow-md"
                >
                  <span className="material-symbols-outlined text-sm">add_task</span>
                  Xác nhận thêm
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
    </>
  );
}
