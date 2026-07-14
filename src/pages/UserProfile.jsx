import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Trang thông tin cá nhân (UserProfile) - Hệ thống Rửa xe Thông minh LunaWash.
 * Thiết kế khớp hoàn hảo với ảnh thiết kế số 2.
 */
export default function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [highlightHistorySection, setHighlightHistorySection] = useState(false);

  useEffect(() => {
    if (location.state?.scrollToHistory) {
      setTimeout(() => {
        const el = document.getElementById('history-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightHistorySection(true);
          setTimeout(() => setHighlightHistorySection(false), 2000);
          
          // Clear state so it doesn't re-trigger on refresh
          window.history.replaceState({}, document.title);
        }
      }, 300);
    }
  }, [location]);
  const [user, setUser] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvan@example.com',
    phone: '0901 234 567',
    address: 'Quận 1, TP. Hồ Chí Minh',
    tier: 'Gold',
    avatarUrl: ''
  });

  const [cars, setCars] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [showTierRulesModal, setShowTierRulesModal] = useState(false);

  // Edit Profile states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  // Modal thêm xe states
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [carName, setCarName] = useState('');
  const [carLicense, setCarLicense] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carTypeId, setCarTypeId] = useState('');

  // Lấy dữ liệu user thực tế từ localStorage và đồng bộ qua API Backend
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(prev => ({
          ...prev,
          fullName: parsed.fullName || prev.fullName,
          email: parsed.email || prev.email,
          tier: parsed.tier || prev.tier,
          avatarUrl: parsed.avatarUrl || prev.avatarUrl
        }));

        if (parsed.token) {
          // 1. Fetch user profile (/me)
          fetch(import.meta.env.VITE_API_URL + '/api/Auth/me', {
            headers: {
              'Authorization': `Bearer ${parsed.token}`
            }
          })
          .then(res => {
            if (res.ok) return res.json();
            throw new Error('Đồng bộ thông tin user không thành công.');
          })
          .then(data => {
            setUser(prev => {
              const updatedUser = {
                ...prev,
                fullName: data.fullName || prev.fullName,
                email: data.email || prev.email,
                tier: data.role === 'Customer' ? (data.loyalty?.tierName || prev.tier) : data.role,
                points: data.loyalty?.currentPoints || 0,
                maxBookingDays: data.loyalty?.maxBookingDays || 3,
                address: data.address || prev.address,
                phone: data.phone || data.phoneNumber || prev.phone,
                isActive: data.isActive
              };
            
            // Cập nhật localStorage để Navbar nhận được thông tin mới
            if (parsed) {
               localStorage.setItem('user', JSON.stringify({
                 ...parsed,
                 tier: updatedUser.tier,
                 points: updatedUser.points,
                 maxBookingDays: updatedUser.maxBookingDays
               }));
               // Dispatch custom event để Navbar tự động cập nhật
               window.dispatchEvent(new Event('userUpdated'));
            }

            return updatedUser;
            });
          })
          .catch(err => console.warn('Lỗi đồng bộ user:', err));

          // 2. Fetch user's cars
          fetch(import.meta.env.VITE_API_URL + '/api/Vehicles', {
            headers: {
              'Authorization': `Bearer ${parsed.token}`
            }
          })
          .then(res => {
            if (res.ok) return res.json();
            throw new Error('Lỗi lấy danh sách xe.');
          })
          .then(data => {
            setCars(data); // Expects array of { id, name, license, color, ... }
          })
          .catch(err => console.warn('Lỗi lấy xe:', err));

          // 3. Fetch bookings (/api/bookings/history)
          fetch(import.meta.env.VITE_API_URL + '/api/bookings/history', {
            headers: { 'Authorization': `Bearer ${parsed.token}` }
          })
          .then(res => res.ok ? res.json() : [])
          .then(data => {
            if (Array.isArray(data)) {
              // Map data similar to BookingHistory.jsx
              const mapped = data.slice(0, 3).map(b => ({
                id: b.id,
                packageName: b.packageName,
                vehicle: b.vehicleInfo,
                extras: b.extras,
                branch: b.branchInfo,
                slot: b.slotName,
                time: b.timeRange,
                totalPrice: b.totalPrice,
                status: b.status
              }));
              setBookings(mapped);
            }
          })
          .catch(err => console.warn('Lỗi lấy lịch sử:', err));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const openEditProfileModal = () => {
    setEditProfileForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const storedUserString = localStorage.getItem('user');
      const token = storedUserString ? JSON.parse(storedUserString).token : null;

      if (!token) throw new Error("No token found");

      const res = await fetch(import.meta.env.VITE_API_URL + '/api/Auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: editProfileForm.fullName,
          phone: editProfileForm.phone,
          address: editProfileForm.address
        })
      });

      if (!res.ok) throw new Error('Không thể cập nhật hồ sơ');

      const updatedUser = {
        ...user,
        fullName: editProfileForm.fullName,
        email: editProfileForm.email,
        phone: editProfileForm.phone,
        address: editProfileForm.address
      };
      
      setUser(updatedUser);
      
      // Update local storage
      if (storedUserString) {
        const parsed = JSON.parse(storedUserString);
        localStorage.setItem('user', JSON.stringify({
          ...parsed,
          fullName: updatedUser.fullName,
          email: updatedUser.email
        }));
      }
      
      setShowEditProfileModal(false);
      alert('Đã cập nhật thông tin cá nhân thành công!');
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa xe này khỏi danh sách?')) {
      try {
        const storedUser = localStorage.getItem('user');
        const token = storedUser ? JSON.parse(storedUser).token : null;
        if (!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Vehicles/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          setCars(cars.filter(car => car.id !== id));
        } else {
          alert('Không thể xóa xe lúc này.');
        }
      } catch (err) {
        console.error('Lỗi xóa xe:', err);
      }
    }
  };

  const handleSaveNewCar = async (e) => {
    e.preventDefault();
    if (!carName || !carLicense || !carTypeId) return;
    setIsAddingCar(true);
    
    try {
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : null;
      if (!token) return;

      const res = await fetch(import.meta.env.VITE_API_URL + '/api/Vehicles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: carName, license: carLicense, color: carColor, vehicleTypeId: carTypeId })
      });

      if (res.ok) {
        const newCar = await res.json();
        setCars([...cars, newCar]);
        setShowAddCarModal(false);
        setCarName('');
        setCarLicense('');
        setCarColor('');
        setCarTypeId('');
      } else {
        alert('Không thể thêm xe. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err) {
      console.error('Lỗi thêm xe:', err);
    } finally {
      setIsAddingCar(false);
    }
  };

  const userTier = user.tier?.toLowerCase() || '';
  const isBronze = userTier === 'bronze' || userTier === 'đồng' || userTier === 'dong';
  const isSilver = userTier === 'silver' || userTier === 'bạc' || userTier === 'bac';
  const isGold = userTier === 'gold' || userTier === 'vàng' || userTier === 'vang';
  const isPlatinum = userTier === 'platinum' || userTier === 'bạch kim' || userTier === 'bach kim';
  const isAdmin = userTier === 'admin';
  const isStaff = userTier === 'staff';
  const isBranchManager = userTier === 'branchmanager';
  const isTechnical = userTier === 'technicalstaff';
  const isCustomer = user && !['admin', 'staff', 'branchmanager', 'technicalstaff'].includes(userTier);

  // Hàm lấy thông tin hạng thành viên để hiển thị
  const getTierInfo = () => {
    if (isAdmin) return { label: 'Quản trị viên (Admin)', bg: 'from-rose-600 to-pink-500', icon: 'admin_panel_settings', textColor: 'text-rose-700', lightBg: 'bg-rose-50 border-rose-100' };
    if (isBranchManager) return { label: 'Quản lý Chi nhánh', bg: 'from-indigo-600 to-blue-500', icon: 'manage_accounts', textColor: 'text-indigo-700', lightBg: 'bg-indigo-50 border-indigo-100' };
    if (isTechnical) return { label: 'Kỹ Thuật Viên', bg: 'from-slate-700 to-slate-600', icon: 'engineering', textColor: 'text-slate-800', lightBg: 'bg-slate-50 border-slate-200' };
    if (isStaff) return { label: 'Nhân viên', bg: 'from-sky-600 to-sky-500', icon: 'support_agent', textColor: 'text-sky-700', lightBg: 'bg-sky-50 border-sky-100' };
    if (isPlatinum) return { label: 'Thành viên Bạch Kim', bg: 'from-slate-500 to-slate-400', icon: 'diamond', textColor: 'text-slate-700', lightBg: 'bg-slate-50 border-slate-200' };
    if (isGold) return { label: 'Thành viên Vàng', bg: 'from-amber-500 to-yellow-400', icon: 'military_tech', textColor: 'text-amber-700', lightBg: 'bg-amber-50 border-amber-100' };
    if (isSilver) return { label: 'Thành viên Bạc', bg: 'from-slate-400 to-gray-300', icon: 'military_tech', textColor: 'text-slate-600', lightBg: 'bg-slate-50 border-slate-200' };
    // Mặc định là Thành viên Đồng (Bronze) nếu không phải các hạng trên
    return { label: 'Thành viên Đồng', bg: 'from-orange-700 to-amber-600', icon: 'military_tech', textColor: 'text-orange-700', lightBg: 'bg-orange-50 border-orange-100' };
  };
  const tierInfo = getTierInfo();

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-4 gap-gutter items-start">
        
        {/* CỘT TRÁI - SIDEBAR HỒ SƠ */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-8 shadow-xl flex flex-col items-center">
          {/* Avatar với nút Chỉnh sửa */}
          <div className="relative w-32 h-32 mb-6">
            <img 
              src={user.avatarUrl || '/default-avatar.svg'} 
              alt={user.fullName}
              className="w-full h-full rounded-full object-cover border-4 border-primary/10 shadow-lg"
            />
            <button 
              onClick={() => alert('Chức năng tải lên ảnh đại diện mới đang được xây dựng.')}
              className="absolute bottom-1 right-1 w-9 h-9 bg-primary hover:bg-primary-container text-white rounded-full flex items-center justify-center shadow-lg border border-white hover:scale-105 active:scale-95 transition-all select-none"
              title="Chỉnh sửa ảnh"
            >
              <span className="material-symbols-outlined text-base font-bold">edit</span>
            </button>
          </div>

          {/* Tên & Hạng thành viên */}
          <h2 className="font-headline-lg text-2xl text-primary mb-1 text-center font-bold">
            {user.fullName}
          </h2>
          {/* Ribbon badge hạng thành viên - Chỉ hiện cho khách hàng */}
          {isCustomer ? (
            <div className="flex justify-center mb-8">
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-1 bg-gradient-to-r ${tierInfo.bg} text-white font-black text-[11px] uppercase tracking-widest shadow-md select-none rounded-sm`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)' }}
              >
                <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {tierInfo.icon}
                </span>
                {tierInfo.label}
              </span>
            </div>
          ) : (
            <p className="text-on-surface-variant font-medium text-center mb-8">
              {tierInfo.label}
            </p>
          )}

          {/* Menu Sidebar */}
          <nav className="w-full flex flex-col gap-2">
            <button className="w-full flex items-center gap-3 px-5 py-4 bg-primary text-white rounded-2xl shadow-md transition-all font-bold text-left">
              <span className="material-symbols-outlined text-xl">account_circle</span>
              Tổng quan hồ sơ
            </button>
            <button 
              onClick={() => alert('Cài đặt tài khoản sẽ được tích hợp cùng hệ thống máy chủ.')}
              className="w-full flex items-center gap-3 px-5 py-4 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-2xl transition-all font-medium text-left"
            >
              <span className="material-symbols-outlined text-xl">settings</span>
              Cài đặt tài khoản
            </button>
          </nav>
        </section>

        {/* CỘT PHẢI - NỘI DUNG CHÍNH */}
        <section className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          
          {/* PHẦN 1: THÔNG TIN CÁ NHÂN */}
          <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-8 shadow-xl">
            {/* Header thông tin cá nhân */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-primary">Thông tin cá nhân</h3>
              <button 
                onClick={openEditProfileModal}
                className="flex items-center gap-1.5 text-primary hover:text-primary-container font-bold text-sm transition-colors select-none"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                Chỉnh sửa
              </button>
            </div>

            {/* Banner Hạng thành viên hiện tại (Chỉ khách hàng mới có) */}
            {isCustomer && (
              <div className={`${tierInfo.lightBg} border rounded-2xl p-5 flex items-center justify-between shadow-sm mb-6 flex-wrap gap-4`}>
                <div className="flex items-center gap-4">
                  {/* Icon circle */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tierInfo.bg} text-white flex items-center justify-center shadow-md select-none flex-shrink-0`}>
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {tierInfo.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-outline tracking-widest uppercase mb-1">
                      Hạng thành viên hiện tại
                    </p>
                    {/* Ribbon badge dạng banner mũi tên */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-1 bg-gradient-to-r ${tierInfo.bg} text-white font-black text-[11px] uppercase tracking-widest shadow select-none rounded-sm`}
                      style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)' }}
                    >
                      <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {tierInfo.icon}
                      </span>
                      {tierInfo.label}
                    </span>
                  </div>
                  
                  {/* Điểm tích luỹ */}
                  <div className="ml-4 pl-4 border-l border-outline-variant/30 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-outline tracking-widest uppercase mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">stars</span>
                      Điểm tích lũy
                    </p>
                    <p className={`font-black text-lg leading-none ${tierInfo.textColor}`}>
                      {user.points || 0} <span className="text-[11px] font-bold text-outline">pt</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button 
                    onClick={() => alert(`Quyền lợi ${tierInfo.label}: Giảm 10% các dịch vụ rửa chuyên sâu, đặt lịch ưu tiên.`)}
                    className={`flex items-center gap-1 ${tierInfo.textColor} hover:underline font-bold text-sm transition-all select-none`}
                  >
                    Xem ưu đãi
                    <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
                  </button>
                  <span className="hidden sm:inline text-outline/40 select-none">|</span>
                  <button 
                    onClick={() => setShowTierRulesModal(true)}
                    className={`flex items-center gap-1 ${tierInfo.textColor} hover:underline font-bold text-sm transition-all select-none`}
                  >
                    Điều kiện xét hạng
                    <span className="material-symbols-outlined text-base font-bold">info</span>
                  </button>
                </div>
              </div>
            )}

            {/* Lưới các trường thông tin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Họ và tên</p>
                <p className="font-bold text-on-surface text-base">{user.fullName}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-bold text-outline uppercase tracking-wider">Email</p>
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0 bg-green-100 text-green-700 text-[9px] font-bold rounded border border-green-200 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[10px]">verified</span>
                      Đã xác minh
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0 bg-yellow-100 text-yellow-700 text-[9px] font-bold rounded border border-yellow-200 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[10px]">warning</span>
                      Chưa xác minh
                    </span>
                  )}
                </div>
                <p className="font-bold text-on-surface text-base">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Số điện thoại</p>
                <p className="font-bold text-on-surface text-base">{user.phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Địa chỉ</p>
                <p className="font-bold text-on-surface text-base">{user.address}</p>
              </div>
            </div>
          </article>

          {/* DÀNH CHO KHÁCH HÀNG */}
          {isCustomer && (
            <>
              {/* PHẦN 2: QUẢN LÝ XE */}
          <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-8 shadow-xl">
            {/* Header Quản lý xe */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-primary">Quản lý xe</h3>
              <button 
                onClick={() => setShowAddCarModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary-container hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-base font-bold">add</span>
                Thêm xe mới
              </button>
            </div>

            {/* Danh sách xe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cars.map((car) => (
                <div 
                  key={car.id} 
                  className="bg-background border border-outline-variant/30 hover:border-primary/30 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed/50 text-primary flex items-center justify-center select-none shadow-sm">
                      <span className="material-symbols-outlined text-2xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                        local_car_wash
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-base">{car.name}</p>
                      <p className="text-sm text-on-surface-variant font-medium">
                        {car.license} • {car.color}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteCar(car.id)}
                    className="text-on-surface-variant/60 hover:text-error hover:bg-error-container/20 transition-all p-2 rounded-full flex items-center justify-center opacity-80 hover:opacity-100"
                    title="Xóa xe"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              ))}

              {cars.length === 0 && (
                <div className="col-span-2 py-8 text-center text-on-surface-variant">
                  Chưa có xe nào trong danh mục. Vui lòng thêm xe mới.
                </div>
              )}
            </div>
          </article>

          {/* PHẦN 3: LỊCH SỬ ĐẶT LỊCH GẦN ĐÂY */}
          <article 
            id="history-section"
            className={`bg-surface-container-lowest border rounded-[32px] p-8 transition-all duration-500 ${
              highlightHistorySection
                ? 'border-[#00236f] shadow-[0_0_20px_rgba(0,35,111,0.3)] ring-2 ring-[#00236f]/20'
                : 'border-outline-variant/30 shadow-xl'
            }`}
          >
            {/* Header lịch sử */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-primary">Lịch sử đặt lịch gần đây</h3>
              <button 
                onClick={() => alert('Danh sách toàn bộ lịch sử sẽ sớm khả dụng.')}
                className="text-primary hover:underline font-bold text-sm transition-all"
              >
                Xem tất cả
              </button>
            </div>

            {/* Bảng lịch sử */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-outline-variant/50">
                    <th className="pb-3 text-xs font-bold text-outline uppercase tracking-wider">Dịch vụ & Phương tiện</th>
                    <th className="pb-3 text-xs font-bold text-outline uppercase tracking-wider">Địa điểm & Trạm</th>
                    <th className="pb-3 text-xs font-bold text-outline uppercase tracking-wider">Thời gian</th>
                    <th className="pb-3 text-xs font-bold text-outline uppercase tracking-wider">Tổng tiền</th>
                    <th className="pb-3 text-xs font-bold text-outline uppercase tracking-wider">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {bookings.length > 0 ? bookings.map((item, index) => (
                    <tr key={index} className="hover:bg-surface-container-low/20 transition-colors">
                      {/* Dịch vụ & xe */}
                      <td className="py-4 pr-4">
                        <p className="font-extrabold text-primary">{item.packageName}</p>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">{item.vehicle}</p>
                        {item.extras && (
                          <span className="inline-block bg-sky-100 text-sky-800 text-[9px] font-black px-2 py-0.5 rounded mt-1.5">
                            {item.extras}
                          </span>
                        )}
                      </td>
                      {/* Vị trí */}
                      <td className="py-4 pr-4 font-medium text-on-surface-variant">
                        <p className="font-semibold text-on-surface">{item.branch}</p>
                        <p className="text-xs text-outline">{item.slot}</p>
                      </td>
                      {/* Thời gian */}
                      <td className="py-4 pr-4 font-semibold text-on-surface whitespace-pre-line text-xs">
                        {item.time}
                      </td>
                      {/* Tiền */}
                      <td className="py-4 pr-4 font-black text-primary text-base">{item.totalPrice}</td>
                      {/* Trạng thái */}
                      <td className="py-4">
                        {item.status === 'Completed' || item.status === 'Hoàn thành' ? (
                          <span className="inline-flex items-center px-3 py-1 bg-emerald-100/70 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold shadow-sm select-none">
                            • Đã xong
                          </span>
                        ) : item.status === 'Cancelled' || item.status === 'Đã hủy' ? (
                          <span className="inline-flex items-center px-3 py-1 bg-rose-100/70 text-rose-800 border border-rose-200 rounded-full text-xs font-bold shadow-sm select-none">
                            • Đã hủy
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-sky-100/70 text-sky-800 border border-sky-200 rounded-full text-xs font-bold shadow-sm select-none">
                            • {item.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-on-surface-variant font-medium">
                        Không có lịch đặt nào gần đây.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
          </>
        )}

        {/* DÀNH CHO NHÂN VIÊN / QUẢN LÝ */}
        {!isCustomer && (
          <>
            {/* LỊCH LÀM VIỆC & CA TRỰC */}
            <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h3 className="font-bold text-xl text-primary">Lịch làm việc & Ca trực</h3>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                  Tuần này (15/05 - 21/05)
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { day: 'T2', date: '15/05', shift: 'Sáng', time: '08:00 - 12:00', status: 'Đã phân công', type: 'work' },
                  { day: 'T3', date: '16/05', shift: 'Chiều', time: '13:00 - 17:00', status: 'Đã phân công', type: 'work' },
                  { day: 'T4', date: '17/05', type: 'off' },
                  { day: 'T5', date: '18/05', shift: 'Sáng', time: '08:00 - 12:00', status: 'Đã phân công', type: 'work' },
                  { day: 'T6', date: '19/05', shift: 'Tối', time: '18:00 - 22:00', status: 'Đã phân công', type: 'work' },
                  { day: 'T7', date: '20/05', shift: 'Sáng', time: '08:00 - 12:00', status: 'Đã phân công', type: 'work' },
                  { day: 'CN', date: '21/05', type: 'off', isWeekend: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="bg-surface-container-low py-2 rounded-xl text-center">
                      <p className={`text-xs font-bold ${item.isWeekend ? 'text-error' : 'text-outline'}`}>{item.day}</p>
                      <p className={`text-sm font-black ${item.isWeekend ? 'text-error' : 'text-on-surface'}`}>{item.date}</p>
                    </div>
                    {item.type === 'work' ? (
                      <div className="border-l-4 border-cyan-600 bg-surface-container-lowest border-t border-r border-b border-outline-variant/30 rounded-r-xl p-3 shadow-sm flex flex-col h-full">
                        <p className="font-bold text-xs text-primary">{item.shift}</p>
                        <p className="font-bold text-on-surface text-xs mb-2">{item.time}</p>
                        <span className="mt-auto inline-flex items-center justify-center bg-cyan-50 text-cyan-700 px-2 py-1 rounded text-[10px] font-bold">
                          {item.status}
                        </span>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-outline-variant/40 rounded-xl p-3 flex items-center justify-center h-24 text-outline-variant/60 font-bold text-xs">
                        NGHỈ
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </article>

            {/* GỬI ĐƠN CHO QUẢN LÝ/ADMIN */}
            <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h3 className="font-bold text-xl text-primary">Gửi đơn cho quản lý/Admin</h3>
                <button 
                  onClick={() => alert('Chức năng tạo đơn mới đang được phát triển.')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-container transition-all shadow-md active:scale-95"
                >
                  <span className="material-symbols-outlined text-base font-bold">add</span>
                  Tạo đơn mới
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Item 1 */}
                <div className="border border-outline-variant/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:border-primary/30 transition-colors cursor-pointer group gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm border border-orange-100 flex-shrink-0">
                      <span className="material-symbols-outlined">event_note</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-base">Đơn xin nghỉ phép</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Gửi ngày 14/05/2023 • Nghỉ ngày 17/05/2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="px-3 py-1 bg-orange-50 text-orange-700 font-bold text-[11px] rounded-full border border-orange-200 whitespace-nowrap">
                      Đang chờ duyệt
                    </span>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors hidden sm:block">chevron_right</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="border border-outline-variant/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:border-primary/30 transition-colors cursor-pointer group gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm border border-rose-100 flex-shrink-0">
                      <span className="material-symbols-outlined">warning</span>
                    </div>
                    <div>
                      <p className="font-bold text-on-surface text-base">Đơn báo cáo sự cố</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Gửi ngày 10/05/2023 • Hỏng máy rửa áp lực cao</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-full border border-emerald-200 whitespace-nowrap">
                      Đã duyệt
                    </span>
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors hidden sm:block">chevron_right</span>
                  </div>
                </div>
              </div>
            </article>
          </>
        )}

        </section>

      </div>

      {showTierRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Custom Styles for shimmering pills */}
          <style>{`
            @keyframes shimmer {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-shimmer {
              background-size: 200% auto;
              animation: shimmer 3s linear infinite;
            }
          `}</style>

          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setShowTierRulesModal(false)}
          ></div>
          
          {/* Modal Box */}
          <div className="relative bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in text-on-surface z-50">
            
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-outline-variant/35 bg-surface-container-lowest">
              <div>
                <h3 className="font-extrabold text-base text-[#00236f] uppercase tracking-tight">Điều kiện xét hạng thành viên</h3>
                <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                  Thông tin các hạng mức chi tiêu tích lũy tại LunaWash
                </p>
              </div>
              <button 
                onClick={() => setShowTierRulesModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div className="overflow-x-auto border border-outline-variant/30 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs font-semibold min-w-[500px]">
                  <thead>
                    <tr className="bg-surface-container-low/50 border-b border-outline-variant/30 text-outline text-[10px] uppercase tracking-wider font-extrabold">
                      <th className="p-4">Hạng thành viên</th>
                      <th className="p-4">Điều kiện lên hạng</th>
                      <th className="p-4">Điều kiện giữ hạng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {/* Đồng */}
                    <tr className={`transition-all duration-200 ${isBronze ? 'bg-amber-50/90' : 'hover:bg-slate-50/50'}`}>
                      <td className={`p-4 pl-3 border-l-4 ${isBronze ? 'border-amber-600' : 'border-transparent'}`}>
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-28 inline-flex justify-center items-center px-3 py-1.5 rounded-full text-[11.5px] font-black uppercase tracking-wider bg-gradient-to-r from-[#7c2d12] via-[#fb923c] to-[#431407] text-white border-2 border-[#5c1d07] select-none"
                            style={{
                              boxShadow: 'inset 0 1.5px 3.5px rgba(255, 255, 255, 0.5), inset 0 -1.5px 3.5px rgba(0, 0, 0, 0.55), 0 2.5px 5px rgba(0, 0, 0, 0.15)'
                            }}
                          >
                            Đồng
                          </span>
                          {isBronze && (
                            <span className="text-[10px] font-bold text-amber-600 animate-pulse bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 select-none">
                              Hiện tại
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 font-extrabold text-[12.5px] md:text-[13.5px] border border-slate-200 rounded-xl shadow-sm">
                          Mặc định
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 font-extrabold text-[12.5px] md:text-[13.5px] border border-slate-200 rounded-xl shadow-sm">
                          Có phát sinh chi tiêu
                        </span>
                      </td>
                    </tr>
                    {/* Bạc */}
                    <tr className={`transition-all duration-200 ${isSilver ? 'bg-slate-100/90' : 'hover:bg-slate-50/50'}`}>
                      <td className={`p-4 pl-3 border-l-4 ${isSilver ? 'border-slate-500' : 'border-transparent'}`}>
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-28 inline-flex justify-center items-center px-3 py-1.5 rounded-full text-[11.5px] font-black uppercase tracking-wider bg-gradient-to-r from-[#475569] via-[#f1f5f9] to-[#334155] text-[#0f172a] border-2 border-[#334155] select-none"
                            style={{
                              boxShadow: 'inset 0 1.5px 3.5px rgba(255, 255, 255, 0.85), inset 0 -1.5px 3.5px rgba(0, 0, 0, 0.35), 0 2.5px 5px rgba(0, 0, 0, 0.15)'
                            }}
                          >
                            Bạc
                          </span>
                          {isSilver && (
                            <span className="text-[10px] font-bold text-slate-600 animate-pulse bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20 select-none">
                              Hiện tại
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-[#00236f] font-black text-[12.5px] md:text-[13.5px] border border-blue-200/60 rounded-xl shadow-sm">
                          Từ 1.000 pt
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1.5 bg-slate-50 text-slate-700 font-extrabold text-[12.5px] md:text-[13.5px] border border-slate-200 rounded-xl shadow-sm">
                          Từ 800 pt
                        </span>
                      </td>
                    </tr>
                    {/* Vàng */}
                    <tr className={`transition-all duration-200 ${isGold ? 'bg-yellow-50/90' : 'hover:bg-slate-50/50'}`}>
                      <td className={`p-4 pl-3 border-l-4 ${isGold ? 'border-yellow-600' : 'border-transparent'}`}>
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-28 inline-flex justify-center items-center px-3 py-1.5 rounded-full text-[11.5px] font-black uppercase tracking-wider bg-gradient-to-r from-[#854d0e] via-[#fde047] to-[#713f12] text-[#451a03] border-2 border-[#713f12] select-none"
                            style={{
                              boxShadow: 'inset 0 1.5px 3.5px rgba(255, 255, 255, 0.85), inset 0 -1.5px 3.5px rgba(0, 0, 0, 0.45), 0 2.5px 5px rgba(0, 0, 0, 0.15)'
                            }}
                          >
                            Vàng
                          </span>
                          {isGold && (
                            <span className="text-[10px] font-bold text-yellow-600 animate-pulse bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 select-none">
                              Hiện tại
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-[#00236f] font-black text-[12.5px] md:text-[13.5px] border border-blue-200/60 rounded-xl shadow-sm">
                          Từ 3.000 pt
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1.5 bg-slate-50 text-slate-700 font-extrabold text-[12.5px] md:text-[13.5px] border border-slate-200 rounded-xl shadow-sm">
                          Từ 2.400 pt
                        </span>
                      </td>
                    </tr>
                    {/* Platinum */}
                    <tr className={`transition-all duration-200 ${isPlatinum ? 'bg-indigo-50/90' : 'hover:bg-slate-50/50'}`}>
                      <td className={`p-4 pl-3 border-l-4 ${isPlatinum ? 'border-indigo-500' : 'border-transparent'}`}>
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-28 inline-flex justify-center items-center px-3 py-1.5 rounded-full text-[11.5px] font-black uppercase tracking-wider bg-gradient-to-r from-[#64748b] via-[#ffffff] to-[#475569] text-[#0f172a] border-2 border-[#475569] shadow-md animate-shimmer select-none"
                            style={{
                              boxShadow: 'inset 0 1.5px 3.5px rgba(255, 255, 255, 0.9), inset 0 -1.5px 3.5px rgba(0, 0, 0, 0.35), 0 3px 6px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            Platinum
                          </span>
                          {isPlatinum && (
                            <span className="text-[10px] font-bold text-indigo-600 animate-pulse bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 select-none">
                              Hiện tại
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-[#00236f] font-black text-[12.5px] md:text-[13.5px] border border-blue-200/60 rounded-xl shadow-sm">
                          Từ 5.000 pt
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1.5 bg-slate-50 text-slate-700 font-extrabold text-[12.5px] md:text-[13.5px] border border-slate-200 rounded-xl shadow-sm">
                          Từ 4.000 pt
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Note / Info */}
              <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-[#00236f] text-xs">
                <span className="material-symbols-outlined text-blue-600 text-lg select-none font-bold">info</span>
                <p className="text-[11px] leading-relaxed text-[#00236f]/80 font-medium">
                  <strong>Chu kỳ xét hạng:</strong> Hệ thống tự động kiểm tra tổng chi tiêu thực tế của bạn trong vòng 6 tháng gần nhất để nâng hạng hoặc giữ hạng theo các cột mốc quy định ở trên.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center px-8 py-5 border-t border-outline-variant/20 bg-surface-container-lowest">
              <button
                type="button"
                onClick={() => setShowTierRulesModal(false)}
                className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Pop-up modal chỉnh sửa thông tin cá nhân */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => !isSavingProfile && setShowEditProfileModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-on-surface z-50">
            <div className="flex justify-between items-center px-6 py-5 border-b border-outline-variant/35 bg-surface-container-lowest">
              <h3 className="font-extrabold text-base text-[#00236f]">Chỉnh sửa thông tin cá nhân</h3>
              <button
                type="button"
                disabled={isSavingProfile}
                onClick={() => setShowEditProfileModal(false)}
                className="p-1 hover:bg-surface-container-low rounded-lg transition-all text-outline"
              >
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  disabled={isSavingProfile}
                  placeholder="e.g., Nguyễn Văn A"
                  value={editProfileForm.fullName}
                  onChange={(e) => setEditProfileForm({...editProfileForm, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Email</label>
                <input
                  type="email"
                  required
                  disabled={isSavingProfile}
                  placeholder="e.g., example@gmail.com"
                  value={editProfileForm.email}
                  onChange={(e) => setEditProfileForm({...editProfileForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Số điện thoại</label>
                <input
                  type="tel"
                  required
                  disabled={isSavingProfile}
                  placeholder="e.g., 0901 234 567"
                  value={editProfileForm.phone}
                  onChange={(e) => setEditProfileForm({...editProfileForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Địa chỉ</label>
                <input
                  type="text"
                  required
                  disabled={isSavingProfile}
                  placeholder="e.g., Quận 1, TP. Hồ Chí Minh"
                  value={editProfileForm.address}
                  onChange={(e) => setEditProfileForm({...editProfileForm, address: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/20 flex gap-3">
                <button
                  type="button"
                  disabled={isSavingProfile}
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 px-4 py-3 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-bold rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex-1 px-4 py-3 bg-primary hover:bg-primary-container text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {isSavingProfile ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Pop-up modal thêm xe mới theo thiết kế ảnh 2 */}
      {showAddCarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => !isAddingCar && setShowAddCarModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-on-surface z-50">
            <div className="flex justify-between items-center px-6 py-5 border-b border-outline-variant/35 bg-surface-container-lowest">
              <h3 className="font-extrabold text-base text-[#00236f]">Thêm thông tin xe mới</h3>
              <button
                type="button"
                disabled={isAddingCar}
                onClick={() => setShowAddCarModal(false)}
                className="p-1 hover:bg-surface-container-low rounded-lg transition-all text-outline"
              >
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNewCar} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Tên xe</label>
                <input
                  type="text"
                  required
                  disabled={isAddingCar}
                  placeholder="e.g., Toyota Vios"
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Biển số xe</label>
                  <input
                    type="text"
                    required
                    disabled={isAddingCar}
                    placeholder="e.g., 51H-123.45"
                    value={carLicense}
                    onChange={(e) => setCarLicense(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Màu xe</label>
                  <input
                    type="text"
                    disabled={isAddingCar}
                    placeholder="e.g., Trắng"
                    value={carColor}
                    onChange={(e) => setCarColor(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Loại xe</label>
                <select
                  required
                  disabled={isAddingCar}
                  value={carTypeId}
                  onChange={(e) => setCarTypeId(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-bold text-on-surface"
                >
                  <option value="">Chọn loại xe</option>
                  <option value="VT-OTO-2C">Ô tô 2 chỗ</option>
                  <option value="VT-OTO-4C">Ô tô 4 chỗ</option>
                  <option value="VT-OTO-7C">Ô tô 7 chỗ</option>
                  <option value="VT-OTO-BT">Xe bán tải</option>
                  <option value="VT-OTO-SUV">SUV</option>
                </select>
              </div>

              <div className="relative rounded-2xl overflow-hidden min-h-[90px] flex items-center border border-outline-variant/30 p-4 bg-cover bg-center" style={{ backgroundImage: "url('/car_secure_banner.png')" }}>
                <div className="absolute inset-0 bg-white/85"></div>
                <div className="relative z-10 flex items-center gap-3.5 text-[#00236f]">
                  <span className="material-symbols-outlined text-2xl font-bold">verified</span>
                  <p className="text-[11px] font-bold text-[#00236f] leading-relaxed">
                    Thông tin của bạn sẽ được bảo mật tuyệt đối
                  </p>
                </div>
              </div>

              <div className="flex justify-end items-center gap-3 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  disabled={isAddingCar}
                  onClick={() => setShowAddCarModal(false)}
                  className="px-6 py-2.5 text-sm font-bold text-on-surface-variant hover:underline"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isAddingCar}
                  className="px-6 py-3 bg-[#00236f] hover:bg-[#00236f]/90 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  {isAddingCar ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
