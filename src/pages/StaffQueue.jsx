import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Seed data for bookings if not already in localStorage
const DEFAULT_BOOKINGS = [
  // Binh Thanh Branch (BRN-BT-01)
  {
    id: 'BKG-001',
    licensePlate: '51K-999.88',
    vehicleType: 'Ô tô 4 chỗ',
    packageName: 'Gói Cao Cấp',
    branchId: 'BRN-BT-01',
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
    branchId: 'BRN-BT-01',
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
    branchId: 'BRN-BT-01',
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
    branchId: 'BRN-BT-01',
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

const BRANCH_NAMES = {
  'BRN-BT-01': 'LunaWash Bình Thạnh - Chi nhánh Bờ Sông',
  'BRN-Q1-01': 'LunaWash Quận 1 - Chi nhánh Trung Tâm'
};

export default function StaffQueue() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const dropdownRef = useRef(null);

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

    // Initialize bookings
    const storedBookings = localStorage.getItem('lunaWash_bookings');
    if (!storedBookings) {
      localStorage.setItem('lunaWash_bookings', JSON.stringify(DEFAULT_BOOKINGS));
      setBookings(DEFAULT_BOOKINGS);
    } else {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (e) {
        setBookings(DEFAULT_BOOKINGS);
      }
    }
  }, [navigate]);

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

  const branchId = user.branchId || 'BRN-BT-01';
  const branchName = BRANCH_NAMES[branchId] || 'Chi nhánh LunaWash';

  // Filter bookings belonging to this branch
  const branchBookings = bookings.filter(b => b.branchId === branchId);

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

  const updateBookingStatus = (id, newStatus) => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    localStorage.setItem('lunaWash_bookings', JSON.stringify(updated));
    setBookings(updated);
    setActiveMenuId(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">Đang chờ</span>;
      case 'Washing':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">Đang rửa</span>;
      case 'Completed':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Hoàn thành</span>;
      case 'Delayed':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200">Báo hoãn</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-50 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-xl">store</span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Khu vực làm việc</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-[#00236f] leading-tight">
              {branchName}
            </h1>
            <p className="text-sm text-on-surface-variant/80 mt-1">
              Vai trò: <span className="font-extrabold text-secondary">{user.tier === 'BranchManager' ? 'Quản lý Chi nhánh' : 'Nhân viên kỹ thuật'}</span> • Hôm nay: {new Date().toLocaleDateString('vi-VN')}
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
        <div className="glass-card rounded-3xl p-6 mb-8 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input 
              type="text"
              placeholder="Tìm kiếm biển số, gói rửa..."
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low/75 border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['All', 'Pending', 'Washing', 'Completed', 'Delayed'].map((status) => (
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
                 status === 'Completed' ? 'Hoàn thành' : 'Đã hoãn'}
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
                          /* Staff: Direct Actions */
                          b.status === 'Pending' ? (
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
                          )
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

      </div>
    </main>
  );
}
