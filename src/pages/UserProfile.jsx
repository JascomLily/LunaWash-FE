import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Trang thông tin cá nhân (UserProfile) - Hệ thống Rửa xe Thông minh LunaWash.
 * Thiết kế khớp hoàn hảo với ảnh thiết kế số 2.
 */
export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvan@example.com',
    phone: '0901 234 567',
    address: 'Quận 1, TP. Hồ Chí Minh',
    tier: 'Gold',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANzqhG_Tzu8OPe4kgRPOywPIRx3IZFdjvUn5hGcksArjuRtsGdOvyGOjMyk9BFyyFr2vLUCVMouY3q8wRveQC3s2LPKiw7c6VR4dD9A3CFojp1p_2U_lYE6dJhj8sqSk-SIz6KUe0cfqKDNcTagXJQRrbYBpotUQWDzpjwHi_P1pAGTmj1P08bKe-N3if7guTZt3GBGRaAOCHecxkxamD5LnlRv1F-ireaAdO8OjaO414aab20qz85EZT6YVtpAiTUc8YJsTaC8a8'
  });

  const [cars, setCars] = useState([
    { id: 1, name: 'Toyota Vios', license: '51H - 123.45', color: 'Màu trắng' },
    { id: 2, name: 'Honda Civic', license: '51K - 987.65', color: 'Màu đen' }
  ]);

  const [bookings] = useState([
    {
      date: '22/10/2024',
      service: 'Gói Cao Cấp - Toyota Vios',
      location: 'LunaWash Quận 1',
      status: 'Hoàn thành',
      price: '250.000đ'
    },
    {
      date: '15/10/2024',
      service: 'Gói Cơ Bản - Toyota Vios',
      location: 'LunaWash Quận 7',
      status: 'Đang chờ',
      price: '150.000đ'
    },
    {
      date: '08/10/2024',
      service: 'Vệ sinh nội thất - Honda Civic',
      location: 'LunaWash Quận 2',
      status: 'Hoàn thành',
      price: '450.000đ'
    }
  ]);

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
          fetch('http://localhost:5010/api/Auth/me', {
            headers: {
              'Authorization': `Bearer ${parsed.token}`
            }
          })
          .then(res => {
            if (res.ok) return res.json();
            throw new Error('Đồng bộ không thành công.');
          })
          .then(data => {
            setUser(prev => ({
              ...prev,
              fullName: data.fullName || prev.fullName,
              email: data.email || prev.email,
              tier: data.role === 'Admin' ? 'Admin' : (data.role === 'Staff' ? 'Staff' : prev.tier)
            }));
          })
          .catch(err => console.warn('Đồng bộ API thất bại, dùng dữ liệu phiên đăng nhập hiện tại:', err));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleDeleteCar = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa xe này khỏi danh sách?')) {
      setCars(cars.filter(car => car.id !== id));
    }
  };

  const handleAddCar = () => {
    const name = window.prompt('Nhập tên xe (Ví dụ: Mazda 3):');
    const license = window.prompt('Nhập biển số xe (Ví dụ: 51H - 999.99):');
    const color = window.prompt('Nhập màu xe (Ví dụ: Màu đỏ):');
    
    if (name && license && color) {
      setCars([...cars, { id: Date.now(), name, license, color }]);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-4 gap-gutter items-start">
        
        {/* CỘT TRÁI - SIDEBAR HỒ SƠ */}
        <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-8 shadow-xl flex flex-col items-center">
          {/* Avatar với nút Chỉnh sửa */}
          <div className="relative w-32 h-32 mb-6">
            <img 
              src={user.avatarUrl} 
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
          <p className="text-on-surface-variant font-medium text-center mb-8">
            Thành viên Vàng
          </p>

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
                onClick={() => alert('Chức năng cập nhật thông tin cá nhân đang phát triển.')}
                className="flex items-center gap-1.5 text-primary hover:text-primary-container font-bold text-sm transition-colors select-none"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                Chỉnh sửa
              </button>
            </div>

            {/* Banner Hạng thành viên hiện tại */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex items-center justify-between shadow-sm mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md select-none">
                  <span className="material-symbols-outlined text-2xl font-bold">military_tech</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-outline tracking-wider uppercase">
                    Hạng thành viên hiện tại
                  </p>
                  <p className="font-bold text-lg text-primary leading-tight">
                    Thành viên Vàng
                  </p>
                </div>
              </div>
              <button 
                onClick={() => alert('Quyền lợi hội viên Vàng: Giảm 10% các dịch vụ rửa chuyên sâu, đặt lịch ưu tiên.')}
                className="flex items-center gap-1 text-primary hover:underline font-bold text-sm transition-all"
              >
                Xem ưu đãi
                <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
              </button>
            </div>

            {/* Lưới các trường thông tin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Họ và tên</p>
                <p className="font-bold text-on-surface text-base">{user.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Email</p>
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

          {/* PHẦN 2: QUẢN LÝ XE */}
          <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-8 shadow-xl">
            {/* Header Quản lý xe */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-primary">Quản lý xe</h3>
              <button 
                onClick={handleAddCar}
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
          <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-8 shadow-xl">
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
                    <th className="pb-3 text-xs font-bold text-outline uppercase tracking-wider">Ngày</th>
                    <th className="pb-3 text-xs font-bold text-outline uppercase tracking-wider">Dịch vụ</th>
                    <th className="pb-3 text-xs font-bold text-outline uppercase tracking-wider">Địa điểm</th>
                    <th className="pb-3 text-xs font-bold text-outline uppercase tracking-wider">Trạng thái</th>
                    <th className="pb-3 text-xs font-bold text-outline uppercase tracking-wider">Số tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {bookings.map((booking, index) => (
                    <tr key={index} className="hover:bg-surface-container-low/20 transition-colors">
                      <td className="py-4 text-on-surface font-semibold text-sm">{booking.date}</td>
                      <td className="py-4 text-on-surface font-semibold text-sm">{booking.service}</td>
                      <td className="py-4 text-on-surface-variant font-medium text-sm">{booking.location}</td>
                      <td className="py-4">
                        {booking.status === 'Hoàn thành' ? (
                          <span className="inline-flex items-center px-3 py-1 bg-emerald-100/70 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold shadow-sm select-none">
                            • Hoàn thành
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-sky-100/70 text-sky-800 border border-sky-200 rounded-full text-xs font-bold shadow-sm select-none">
                            • Đang chờ
                          </span>
                        )}
                      </td>
                      <td className="py-4 font-black text-primary text-base">{booking.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

        </section>

      </div>
    </main>
  );
}
