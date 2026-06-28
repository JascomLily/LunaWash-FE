import React from 'react';

const AdminPromotions = () => {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Quản lý Khuyến mãi</h1>
          <p className="text-sm text-on-surface-variant">Điều hành các chương trình ưu đãi và hệ thống credit khách hàng.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-on-secondary rounded-xl hover:bg-secondary/90 transition-all font-bold shadow-md">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tạo chương trình mới
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-0.5">ĐANG CHẠY</p>
            <h3 className="text-xl font-black text-on-surface">12 Chương trình</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined">group</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-0.5">KHÁCH THAM GIA</p>
            <h3 className="text-xl font-black text-on-surface">1,482 Người</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-0.5">CREDIT ĐÃ PHÁT</p>
            <h3 className="text-xl font-black text-on-surface">45,000,000đ</h3>
          </div>
        </div>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Thiết lập Khuyến mãi */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">add_circle</span>
            <h2 className="text-lg font-bold text-on-surface">Thiết lập Khuyến mãi</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Tên chương trình</label>
              <input type="text" placeholder="Vd: Ưu đãi Hè 2024" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Mã code</label>
              <input type="text" placeholder="SUMMER24" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary uppercase" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Giảm giá (%)</label>
              <input type="text" defaultValue="10" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Thời hạn (Ngày)</label>
              <input type="text" defaultValue="30" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-4 mb-6">
            <h4 className="text-xs font-bold text-on-surface mb-2">Ví dụ: Với mức giảm 10%:</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Gói Cơ Bản (150k)</span>
                <span className="font-bold text-primary">135k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Gói Nâng Cao (250k)</span>
                <span className="font-bold text-primary">225k</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Gói Cao Cấp (500k)</span>
                <span className="font-bold text-primary">450k</span>
              </div>
            </div>
          </div>

          <button className="w-full mt-auto py-2.5 bg-secondary text-on-secondary rounded-xl font-bold hover:bg-secondary/90 transition-colors">
            Set up Chương trình
          </button>
        </div>

        {/* Thiết lập tặng điểm */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            <h2 className="text-lg font-bold text-on-surface">Thiết lập tặng điểm</h2>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Tên sự kiện</label>
            <input type="text" placeholder="Vd: Tri ân khách hàng buổi sáng" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Giờ bắt đầu</label>
              <div className="relative">
                <input type="time" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Giờ kết thúc</label>
              <div className="relative">
                <input type="time" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Ngày bắt đầu</label>
              <div className="relative">
                <input type="date" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Ngày kết thúc</label>
              <div className="relative">
                <input type="date" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Số credit (điểm)</label>
            <div className="relative">
              <input type="text" defaultValue="0" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant">1 credit = 500 VND</span>
            </div>
          </div>

          <p className="text-[11px] text-on-surface-variant italic mb-4">
            Hệ thống sẽ tự động cộng điểm cho khách hàng khi đặt lịch vào đúng khung giờ hoặc ngày đã thiết lập.
          </p>

          <button className="w-full mt-auto py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
            Lưu thiết lập
          </button>
        </div>
      </div>

      {/* Danh sách Chương trình Đang chạy */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-on-surface">Danh sách Chương trình Đang chạy</h2>
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">8 Hoạt động</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-wider font-extrabold">
                <th className="p-4 border-b border-outline-variant/20">Tên Chương Trình</th>
                <th className="p-4 border-b border-outline-variant/20">Mã Code</th>
                <th className="p-4 border-b border-outline-variant/20">Thời gian</th>
                <th className="p-4 border-b border-outline-variant/20">Trạng thái</th>
                <th className="p-4 border-b border-outline-variant/20 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">celebration</span>
                    </div>
                    <span className="font-bold text-on-surface">Khách hàng mới Q2</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-surface-container px-2 py-1 rounded text-xs font-mono font-bold">WELCOME20</span>
                </td>
                <td className="p-4 text-on-surface-variant text-xs">01/04 - 30/06</td>
                <td className="p-4">
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Đang chạy
                  </span>
                </td>
                <td className="p-4 text-center text-on-surface-variant">...</td>
              </tr>
              <tr className="hover:bg-surface-container-lowest/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                    </div>
                    <span className="font-bold text-on-surface">Flash Sale Cuối Tuần</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-surface-container px-2 py-1 rounded text-xs font-mono font-bold">FLASH50</span>
                </td>
                <td className="p-4 text-on-surface-variant text-xs">10/05 - 12/05</td>
                <td className="p-4">
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Sắp diễn ra
                  </span>
                </td>
                <td className="p-4 text-center text-on-surface-variant">...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Số dư Credit Khách hàng */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-on-surface">Số dư Credit Khách hàng</h2>
          <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
            <span className="material-symbols-outlined text-[16px]">download</span>
            Xuất báo cáo
          </button>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/20">
            
            {/* User 1 */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=1" alt="Avatar" className="w-10 h-10 rounded-full border border-outline-variant/30" />
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Lê Văn Hải</h4>
                    <p className="text-[10px] text-on-surface-variant">090 123 4567</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-black text-lg">520k</p>
                  <p className="text-[9px] font-extrabold text-outline uppercase">Credit</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-surface-container hover:bg-surface-container-high py-1.5 rounded text-xs font-bold transition-colors">Lịch sử</button>
                <button className="flex-1 bg-transparent border border-error text-error hover:bg-error/5 py-1.5 rounded text-xs font-bold transition-colors">Thu hồi</button>
              </div>
            </div>

            {/* User 2 */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=2" alt="Avatar" className="w-10 h-10 rounded-full border border-outline-variant/30" />
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Nguyễn Thu Thủy</h4>
                    <p className="text-[10px] text-on-surface-variant">098 765 4321</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-black text-lg">150k</p>
                  <p className="text-[9px] font-extrabold text-outline uppercase">Credit</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-surface-container hover:bg-surface-container-high py-1.5 rounded text-xs font-bold transition-colors">Lịch sử</button>
                <button className="flex-1 bg-transparent border border-error text-error hover:bg-error/5 py-1.5 rounded text-xs font-bold transition-colors">Thu hồi</button>
              </div>
            </div>

            {/* User 3 */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src="https://i.pravatar.cc/150?u=3" alt="Avatar" className="w-10 h-10 rounded-full border border-outline-variant/30" />
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">Trần Minh Tâm</h4>
                    <p className="text-[10px] text-on-surface-variant">091 222 3333</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-black text-lg">85k</p>
                  <p className="text-[9px] font-extrabold text-outline uppercase">Credit</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-surface-container hover:bg-surface-container-high py-1.5 rounded text-xs font-bold transition-colors">Lịch sử</button>
                <button className="flex-1 bg-transparent border border-error text-error hover:bg-error/5 py-1.5 rounded text-xs font-bold transition-colors">Thu hồi</button>
              </div>
            </div>

          </div>
          <div className="bg-surface-container-low p-3 text-center border-t border-outline-variant/20">
            <button className="text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">Xem tất cả 1,482 khách hàng</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AdminPromotions;
