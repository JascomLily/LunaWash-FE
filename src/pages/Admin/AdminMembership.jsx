import React, { useState } from 'react';

const AdminMembership = () => {
  const [bookingDays, setBookingDays] = useState({
    dong: 7,
    bac: 14,
    vang: 21,
    platinum: 28
  });

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Quản lý Thành viên & Điểm thưởng</h1>
          <p className="text-sm text-on-surface-variant">Thiết lập lộ trình thăng hạng và đặc quyền cho khách hàng LunaWash.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-on-secondary rounded-xl hover:bg-secondary/90 transition-all font-bold shadow-md">
          <span className="material-symbols-outlined text-[18px]">save</span>
          Lưu tất cả thay đổi
        </button>
      </div>

      {/* 1. Mốc điểm thăng hạng */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">trending_up</span>
          <h2 className="text-lg font-bold text-on-surface">Mốc điểm thăng hạng</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card: Đồng */}
          <div className="bg-surface-container-lowest rounded-2xl border-l-4 border-l-[#cd7f32] p-5 shadow-sm border border-outline-variant/30 flex flex-col items-center">
            <div className="flex justify-between w-full items-center mb-4">
              <span className="text-[10px] font-extrabold text-[#8c521f] bg-[#fdf3eb] border border-[#e6c1a1] px-3 py-1 rounded-full uppercase shadow-sm">Đồng</span>
              <span className="material-symbols-outlined text-[#cd7f32]">military_tech</span>
            </div>
            <div className="w-full">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Điểm yêu cầu</label>
              <input type="text" defaultValue="0" className="w-full px-4 py-2.5 bg-transparent border border-outline-variant/50 rounded-xl text-on-surface font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center" disabled />
            </div>
            <p className="text-[11px] text-on-surface-variant mt-3 text-center italic">Mốc khởi đầu mặc định cho khách hàng mới.</p>
          </div>

          {/* Card: Bạc */}
          <div className="bg-surface-container-lowest rounded-2xl border-l-4 border-l-slate-400 p-5 shadow-sm border border-outline-variant/30 flex flex-col items-center">
            <div className="flex justify-between w-full items-center mb-4">
              <span className="text-[10px] font-extrabold text-slate-700 bg-slate-200 px-3 py-1 rounded-full uppercase">Bạc</span>
              <span className="material-symbols-outlined text-on-surface-variant">military_tech</span>
            </div>
            <div className="w-full mb-3">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Điểm yêu cầu</label>
              <input type="text" defaultValue="1000" className="w-full px-4 py-2.5 bg-transparent border border-outline-variant/50 rounded-xl text-on-surface font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center" />
            </div>
            <button className="text-primary font-bold text-xs hover:underline mt-auto">Cập nhật mốc</button>
          </div>

          {/* Card: Vàng */}
          <div className="bg-surface-container-lowest rounded-2xl border-l-4 border-l-amber-400 p-5 shadow-sm border border-outline-variant/30 flex flex-col items-center">
            <div className="flex justify-between w-full items-center mb-4">
              <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase">Vàng</span>
              <span className="material-symbols-outlined text-on-surface-variant">military_tech</span>
            </div>
            <div className="w-full mb-3">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Điểm yêu cầu</label>
              <input type="text" defaultValue="5000" className="w-full px-4 py-2.5 bg-transparent border border-outline-variant/50 rounded-xl text-on-surface font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center" />
            </div>
            <button className="text-primary font-bold text-xs hover:underline mt-auto">Cập nhật mốc</button>
          </div>

          {/* Card: Platinum */}
          <div className="bg-surface-container-lowest rounded-2xl border-l-4 border-l-slate-800 p-5 shadow-sm border border-outline-variant/30 flex flex-col items-center">
            <div className="flex justify-between w-full items-center mb-4">
              <span className="text-[10px] font-extrabold text-white bg-gradient-to-r from-slate-700 to-slate-900 border border-slate-600 shadow-sm px-3 py-1 rounded-full uppercase">Platinum</span>
              <span className="material-symbols-outlined text-slate-800">verified</span>
            </div>
            <div className="w-full mb-3">
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Điểm yêu cầu</label>
              <input type="text" defaultValue="15000" className="w-full px-4 py-2.5 bg-transparent border border-outline-variant/50 rounded-xl text-on-surface font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center" />
            </div>
            <button className="text-primary font-bold text-xs hover:underline mt-auto">Cập nhật mốc</button>
          </div>

        </div>
      </section>

      {/* 2. Điều kiện giữ hạng */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">verified_user</span>
          <h2 className="text-lg font-bold text-on-surface">Điều kiện giữ hạng</h2>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">
                <th className="p-4 border-b border-outline-variant/20">Hạng Thành Viên</th>
                <th className="p-4 border-b border-outline-variant/20">Thời gian duy trì</th>
                <th className="p-4 border-b border-outline-variant/20">Đặt lịch tối thiểu</th>
                <th className="p-4 border-b border-outline-variant/20">Điểm tối thiểu</th>
                <th className="p-4 border-b border-outline-variant/20 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm font-semibold">
              <tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50">
                <td className="p-4 text-[#cd7f32] font-bold">Đồng</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="12" className="w-16 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                    <span className="text-on-surface-variant text-xs">tháng</span>
                  </div>
                </td>
                <td className="p-4">
                  <input type="text" defaultValue="0" className="w-16 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                </td>
                <td className="p-4">
                  <input type="text" defaultValue="0" className="w-24 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                </td>
                <td className="p-4 text-center">
                  <button className="text-primary hover:text-primary/80"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50">
                <td className="p-4 text-on-surface font-bold">Bạc</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="6" className="w-16 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                    <span className="text-on-surface-variant text-xs">tháng</span>
                  </div>
                </td>
                <td className="p-4">
                  <input type="text" defaultValue="4" className="w-16 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                </td>
                <td className="p-4">
                  <input type="text" defaultValue="500" className="w-24 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                </td>
                <td className="p-4 text-center">
                  <button className="text-primary hover:text-primary/80"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50">
                <td className="p-4 text-amber-600 font-bold">Vàng</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="6" className="w-16 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                    <span className="text-on-surface-variant text-xs">tháng</span>
                  </div>
                </td>
                <td className="p-4">
                  <input type="text" defaultValue="8" className="w-16 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                </td>
                <td className="p-4">
                  <input type="text" defaultValue="2000" className="w-24 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                </td>
                <td className="p-4 text-center">
                  <button className="text-primary hover:text-primary/80"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-lowest/50">
                <td className="p-4 text-slate-800 font-black">PLATINUM</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue="12" className="w-16 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                    <span className="text-on-surface-variant text-xs">tháng</span>
                  </div>
                </td>
                <td className="p-4">
                  <input type="text" defaultValue="12" className="w-16 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                </td>
                <td className="p-4">
                  <input type="text" defaultValue="8000" className="w-24 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary" />
                </td>
                <td className="p-4 text-center">
                  <button className="text-primary hover:text-primary/80"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Đặc quyền đặt lịch trước */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            <h2 className="text-lg font-bold text-on-surface">Đặc quyền đặt lịch trước</h2>
          </div>
          <span className="text-xs text-on-surface-variant">Cấu hình thời gian tối đa khách có thể đặt lịch trước ngày rửa.</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card left */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded border border-[#e6c1a1] bg-[#fdf3eb] flex items-center justify-center text-[#8c521f] font-bold">1</div>
                <div>
                  <h3 className="font-bold text-on-surface">Đồng</h3>
                  <p className="text-xs text-on-surface-variant">Hạng phổ thông</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-1 max-w-[200px] justify-end">
                <input 
                  type="range" 
                  min="1" 
                  max="180" 
                  value={bookingDays.dong}
                  onChange={(e) => setBookingDays({...bookingDays, dong: parseInt(e.target.value)})}
                  className="w-32 h-2 rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{ background: `linear-gradient(to right, #00236f ${(bookingDays.dong / 180) * 100}%, #eceef0 ${(bookingDays.dong / 180) * 100}%)` }}
                />
                <span className="font-bold text-primary w-12 text-right">{bookingDays.dong} ngày</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded border border-slate-300 bg-slate-100 flex items-center justify-center text-slate-600 font-bold">2</div>
                <div>
                  <h3 className="font-bold text-on-surface">Bạc</h3>
                  <p className="text-xs text-on-surface-variant">2 tuần đặt trước</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-1 max-w-[200px] justify-end">
                <input 
                  type="range" 
                  min="1" 
                  max="180" 
                  value={bookingDays.bac}
                  onChange={(e) => setBookingDays({...bookingDays, bac: parseInt(e.target.value)})}
                  className="w-32 h-2 rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{ background: `linear-gradient(to right, #00236f ${(bookingDays.bac / 180) * 100}%, #eceef0 ${(bookingDays.bac / 180) * 100}%)` }}
                />
                <span className="font-bold text-primary w-12 text-right">{bookingDays.bac} ngày</span>
              </div>
            </div>
          </div>

          {/* Card right */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded border border-amber-300 bg-amber-50 flex items-center justify-center text-amber-600 font-bold">3</div>
                <div>
                  <h3 className="font-bold text-on-surface">Vàng</h3>
                  <p className="text-xs text-on-surface-variant">3 tuần đặt trước</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-1 max-w-[200px] justify-end">
                <input 
                  type="range" 
                  min="1" 
                  max="180" 
                  value={bookingDays.vang}
                  onChange={(e) => setBookingDays({...bookingDays, vang: parseInt(e.target.value)})}
                  className="w-32 h-2 rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{ background: `linear-gradient(to right, #00236f ${(bookingDays.vang / 180) * 100}%, #eceef0 ${(bookingDays.vang / 180) * 100}%)` }}
                />
                <span className="font-bold text-primary w-12 text-right">{bookingDays.vang} ngày</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded border border-slate-600 bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold shadow-sm">4</div>
                <div>
                  <h3 className="font-bold text-on-surface">Platinum</h3>
                  <p className="text-xs text-on-surface-variant">Ưu tiên tối đa (4 tuần)</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-1 max-w-[200px] justify-end">
                <input 
                  type="range" 
                  min="1" 
                  max="180" 
                  value={bookingDays.platinum}
                  onChange={(e) => setBookingDays({...bookingDays, platinum: parseInt(e.target.value)})}
                  className="w-32 h-2 rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{ background: `linear-gradient(to right, #00236f ${(bookingDays.platinum / 180) * 100}%, #eceef0 ${(bookingDays.platinum / 180) * 100}%)` }}
                />
                <span className="font-bold text-primary w-12 text-right">{bookingDays.platinum} ngày</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Alert */}
      <div className="bg-secondary text-on-secondary rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-8 shadow-lg shadow-secondary/20">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">info</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">Bạn đang thực hiện thay đổi hệ thống</h3>
            <p className="text-sm opacity-90">Các thay đổi về mốc điểm sẽ được áp dụng ngay sau khi lưu. Khách hàng sẽ nhận được thông báo về chính sách mới.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-transparent border border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
            Hủy bỏ
          </button>
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md">
            Lưu thay đổi
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminMembership;
