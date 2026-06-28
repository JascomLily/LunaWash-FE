import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Tổng quan hệ thống</h1>
          <p className="text-sm text-on-surface-variant">Theo dõi hiệu suất vận hành thời gian thực của các chi nhánh LunaWash.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl hover:bg-surface-container transition-colors text-sm font-bold text-on-surface">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            Hôm nay, 24 Tháng 5
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-secondary text-on-secondary rounded-xl hover:bg-secondary/90 transition-all font-bold shadow-md text-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm">
          <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-2">TỔNG DOANH THU NGÀY</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-black text-on-surface">15.400.000đ</h3>
            <span className="text-emerald-500 text-xs font-bold flex items-center mb-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm">
          <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-2">CHI NHÁNH HOẠT ĐỘNG</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-black text-on-surface">4/5</h3>
            <span className="text-on-surface-variant text-xs font-bold mb-1">vận hành tốt</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm">
          <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-2">TỔNG LƯỢT RỬA HÔM NAY</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-black text-on-surface">128</h3>
            <span className="text-emerald-500 text-xs font-bold mb-1">+ 8</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm">
          <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-2">ĐÁNH GIÁ TRUNG BÌNH</p>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-black text-on-surface">4.7</h3>
            <div className="flex text-amber-500 mb-1">
              <span className="material-symbols-outlined text-[14px] fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[14px] fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[14px] fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[14px] fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined text-[14px] fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
            </div>
          </div>
        </div>
      </div>

      {/* List of Branches */}
      <div className="space-y-4">
        
        {/* Branch 1 */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md transition-shadow">
          <div className="min-w-[200px]">
            <h4 className="font-bold text-on-surface text-sm">Chi nhánh Linh Đông</h4>
            <p className="text-xs text-on-surface-variant mb-2">Thủ Đức, HCM</p>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Đang hoạt động</span>
              <span className="text-[11px] text-on-surface-variant font-bold">3/3 trạm</span>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:w-auto grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="col-span-2 md:col-span-1">
              <p className="text-[10px] text-outline uppercase font-extrabold mb-1">Doanh thu ngày</p>
              <p className="font-bold text-on-surface text-base">5.200.000đ</p>
            </div>
            
            <div className="col-span-2 md:col-span-2 h-10 flex items-center justify-center">
              {/* Fake chart */}
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                <path d="M0 30 Q 20 25, 40 30 T 80 25 T 120 30 T 160 20 T 200 15" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/60" />
                <path d="M0 30 Q 20 25, 40 30 T 80 25 T 120 30 T 160 20 T 200 15 L 200 40 L 0 40 Z" fill="currentColor" className="text-primary/10" />
              </svg>
            </div>

            <div className="col-span-2 md:col-span-1 text-right lg:text-left">
              <p className="text-[10px] text-outline uppercase font-extrabold mb-1">Đánh giá</p>
              <p className="font-bold text-on-surface text-base flex items-center justify-end lg:justify-start gap-1">
                4.8 <span className="material-symbols-outlined text-[14px] text-amber-500 fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full lg:w-auto justify-end">
            <button className="w-9 h-9 rounded-lg border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </button>
            <button className="w-9 h-9 rounded-lg border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>
        </div>

        {/* Branch 2 */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md transition-shadow">
          <div className="min-w-[200px]">
            <h4 className="font-bold text-on-surface text-sm">Chi nhánh Tân Thới Hiệp</h4>
            <p className="text-xs text-on-surface-variant mb-2">Quận 12, HCM</p>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Đang hoạt động</span>
              <span className="text-[11px] text-on-surface-variant font-bold">2/2 trạm</span>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:w-auto grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="col-span-2 md:col-span-1">
              <p className="text-[10px] text-outline uppercase font-extrabold mb-1">Doanh thu ngày</p>
              <p className="font-bold text-on-surface text-base">3.800.000đ</p>
            </div>
            
            <div className="col-span-2 md:col-span-2 h-10 flex items-center justify-center">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                <path d="M0 35 Q 20 30, 40 35 T 80 30 T 120 35 T 160 25 T 200 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/60" />
                <path d="M0 35 Q 20 30, 40 35 T 80 30 T 120 35 T 160 25 T 200 20 L 200 40 L 0 40 Z" fill="currentColor" className="text-primary/10" />
              </svg>
            </div>

            <div className="col-span-2 md:col-span-1 text-right lg:text-left">
              <p className="text-[10px] text-outline uppercase font-extrabold mb-1">Đánh giá</p>
              <p className="font-bold text-on-surface text-base flex items-center justify-end lg:justify-start gap-1">
                4.7 <span className="material-symbols-outlined text-[14px] text-amber-500 fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full lg:w-auto justify-end">
            <button className="w-9 h-9 rounded-lg border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </button>
            <button className="w-9 h-9 rounded-lg border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>
        </div>

        {/* Branch 3 */}
        <div className="bg-surface-container-lowest rounded-2xl border border-error/40 p-5 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
          <div className="min-w-[200px]">
            <h4 className="font-bold text-on-surface text-sm">Chi nhánh Bình Thạnh</h4>
            <p className="text-xs text-on-surface-variant mb-2">Bình Thạnh, HCM</p>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-error-container text-error text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Bảo trì trạm 1</span>
              <span className="text-[11px] text-on-surface-variant font-bold">0/1 trạm</span>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:w-auto grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="col-span-2 md:col-span-1">
              <p className="text-[10px] text-outline uppercase font-extrabold mb-1">Doanh thu ngày</p>
              <p className="font-bold text-on-surface text-base">2.100.000đ</p>
            </div>
            
            <div className="col-span-2 md:col-span-2 h-10 flex items-center justify-center">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                <path d="M0 10 L 100 20 L 200 35" fill="none" stroke="currentColor" strokeWidth="2" className="text-error/60" />
                <path d="M0 10 L 100 20 L 200 35 L 200 40 L 0 40 Z" fill="currentColor" className="text-error/10" />
              </svg>
            </div>

            <div className="col-span-2 md:col-span-1 text-right lg:text-left">
              <p className="text-[10px] text-outline uppercase font-extrabold mb-1">Đánh giá</p>
              <p className="font-bold text-on-surface text-base flex items-center justify-end lg:justify-start gap-1">
                4.9 <span className="material-symbols-outlined text-[14px] text-amber-500 fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full lg:w-auto justify-end">
            <button className="w-9 h-9 rounded-lg border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </button>
            <button className="w-9 h-9 rounded-lg border border-error/30 flex items-center justify-center text-error hover:bg-error-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">build</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Layout: Map & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface/50">
            <h2 className="font-bold text-on-surface text-sm">Phân bổ hệ thống tại TP. HCM</h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hoạt động tốt
            </span>
          </div>
          <div className="flex-1 min-h-[300px] bg-slate-800 relative flex items-center justify-center overflow-hidden">
            {/* Map Placeholder */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
            
            {/* Map markers mock */}
            <div className="absolute top-[40%] left-[30%] w-8 h-8 bg-primary rounded-full shadow-lg shadow-primary/50 flex items-center justify-center text-white border-2 border-white/20 animate-pulse">
              <span className="material-symbols-outlined text-[16px]">local_car_wash</span>
            </div>
            <div className="absolute top-[60%] left-[50%] w-10 h-10 bg-primary rounded-full shadow-lg shadow-primary/50 flex items-center justify-center text-white border-2 border-white/20">
              <span className="material-symbols-outlined text-[20px]">local_car_wash</span>
            </div>
            <div className="absolute top-[70%] left-[65%] w-8 h-8 bg-error rounded-full shadow-lg shadow-error/50 flex items-center justify-center text-white border-2 border-white/20 animate-bounce">
              <span className="material-symbols-outlined text-[16px]">build</span>
            </div>
            <div className="absolute top-[30%] left-[60%] w-6 h-6 bg-primary/80 rounded-full flex items-center justify-center text-white/80 border border-white/10">
              <span className="material-symbols-outlined text-[12px]">local_car_wash</span>
            </div>
            
            <p className="relative z-10 text-white/50 text-xs font-mono uppercase tracking-widest pointer-events-none">Interactive Map Component</p>
          </div>
        </div>

        {/* Right Column: Alerts & Top Employee */}
        <div className="space-y-6">
          
          {/* Cảnh báo hệ thống */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col">
            <div className="p-4 border-b border-outline-variant/20">
              <h2 className="font-bold text-on-surface text-sm">Cảnh báo hệ thống</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-error/5 border border-error/20 rounded-xl p-3 flex gap-3">
                <span className="material-symbols-outlined text-error mt-0.5 text-[18px]">warning</span>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Bảo trì tại Bình Thạnh</h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Trạm 1 cần thay thế vòi phun cao áp.</p>
                </div>
              </div>
              <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-3 flex gap-3">
                <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">info</span>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Ưu đãi mùa hè sắp kết thúc</h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Còn 2 ngày cho chương trình giảm 20%.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nhân viên xuất sắc */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col">
            <div className="p-4 border-b border-outline-variant/20">
              <h2 className="font-bold text-on-surface text-sm">Nhân viên xuất sắc tháng</h2>
            </div>
            <div className="p-5 flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur opacity-50"></div>
                <img src="https://i.pravatar.cc/150?u=11" alt="Top Employee" className="relative w-16 h-16 rounded-full border-2 border-amber-400" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white">TOP 1</div>
              </div>
              <h3 className="font-bold text-on-surface text-sm">Nguyễn Văn An</h3>
              <p className="text-[11px] text-on-surface-variant mb-4">Chi nhánh Linh Đông</p>
              
              <div className="w-full bg-surface-container-low rounded-xl p-3 flex justify-between items-center mb-4 border border-outline-variant/20">
                <span className="text-[10px] font-extrabold text-outline uppercase tracking-widest">LƯỢT RỬA</span>
                <span className="font-black text-emerald-600 text-lg">450</span>
              </div>
              
              <button className="w-full py-2 bg-surface-container hover:bg-surface-container-high transition-colors rounded-xl text-xs font-bold text-on-surface border border-outline-variant/30">
                Xem bảng xếp hạng
              </button>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
