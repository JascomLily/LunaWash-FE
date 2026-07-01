import React from 'react';

const AdminFeedback = () => {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col space-y-6 relative pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Thông báo & Phản hồi</h1>
        <p className="text-sm text-on-surface-variant">Quản lý và xử lý các báo cáo từ chi nhánh, yêu cầu phê duyệt và phản hồi sự cố vận hành.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">assignment</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant mb-0.5">Chờ xử lý</p>
            <h3 className="text-2xl font-black text-on-surface">12</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-error/10 text-error flex items-center justify-center">
            <span className="material-symbols-outlined">build</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant mb-0.5">Sự cố thiết bị</p>
            <h3 className="text-2xl font-black text-on-surface">05</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined">verified</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant mb-0.5">Yêu cầu phê duyệt</p>
            <h3 className="text-2xl font-black text-on-surface">07</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-4 items-center bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="relative w-full xl:w-[40%]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm tiêu đề, người gửi..." 
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex-1 w-full flex gap-3 overflow-x-auto pb-1 xl:pb-0 hide-scrollbar">
          <select className="min-w-[150px] flex-1 px-3 py-2.5 bg-transparent border border-outline-variant/50 rounded-xl text-sm text-on-surface font-semibold focus:outline-none focus:border-primary appearance-none">
            <option>Tất cả chi nhánh</option>
            <option>Linh Đông</option>
            <option>Quận 1</option>
            <option>Tân Bình</option>
            <option>Quận 7</option>
          </select>
          <select className="min-w-[150px] flex-1 px-3 py-2.5 bg-transparent border border-outline-variant/50 rounded-xl text-sm text-on-surface font-semibold focus:outline-none focus:border-primary appearance-none">
            <option>Trạng thái</option>
            <option>Khẩn cấp</option>
            <option>Chờ duyệt</option>
            <option>Đã xử lý</option>
            <option>Đã từ chối</option>
          </select>
          <select className="min-w-[150px] flex-1 px-3 py-2.5 bg-transparent border border-outline-variant/50 rounded-xl text-sm text-on-surface font-semibold focus:outline-none focus:border-primary appearance-none">
            <option>Phân loại</option>
            <option>Sự cố thiết bị</option>
            <option>Yêu cầu phê duyệt</option>
            <option>Nhân sự</option>
            <option>Khác</option>
          </select>
          <button className="min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-on-secondary rounded-xl hover:bg-secondary/90 transition-all font-bold shadow-sm whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Lọc kết quả
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-extrabold uppercase tracking-wider border-b border-outline-variant/20">
                <th className="p-4 w-[12%]">CHI NHÁNH</th>
                <th className="p-4 w-[15%]">PHÂN LOẠI</th>
                <th className="p-4 w-[30%]">TIÊU ĐỀ</th>
                <th className="p-4 w-[15%]">NGƯỜI YÊU CẦU</th>
                <th className="p-4 w-[10%]">THỜI GIAN</th>
                <th className="p-4 w-[10%] text-center">TRẠNG THÁI</th>
                <th className="p-4 w-[8%] text-center">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              
              {/* Row 1 */}
              <tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                <td className="p-4 font-bold text-on-surface">Linh Đông</td>
                <td className="p-4">
                  <span className="text-[11px] font-bold text-error bg-error/10 px-2.5 py-1 rounded">Sự cố thiết bị</span>
                </td>
                <td className="p-4">
                  <h4 className="font-bold text-on-surface text-sm line-clamp-1">Trạm 1 bị kẹt vòi phun áp lực</h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">Cần kỹ thuật kiểm tra gấp, ảnh hưởng tiến độ...</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">NA</div>
                    <span className="text-sm text-on-surface-variant font-medium">Nguyễn Văn A</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-on-surface text-sm">10:30</p>
                  <p className="text-[10px] text-on-surface-variant">Hôm nay</p>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block bg-error text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wide shadow-sm shadow-error/30">Khẩn cấp</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-1.5">
                    <button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                    <button className="w-8 h-8 rounded hover:bg-emerald-50 text-emerald-600 transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">check_circle</span></button>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                <td className="p-4 font-bold text-on-surface">Quận 1</td>
                <td className="p-4">
                  <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded">Yêu cầu phê duyệt</span>
                </td>
                <td className="p-4">
                  <h4 className="font-bold text-on-surface text-sm line-clamp-1">Đề xuất khuyến mãi đặc biệt khai trương...</h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">Giảm giá 30% cho khách hàng mới trong tuần đ...</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-900 text-white font-bold text-xs flex items-center justify-center">LB</div>
                    <span className="text-sm text-on-surface-variant font-medium">Lê Thị B</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-on-surface text-sm">08:15</p>
                  <p className="text-[10px] text-on-surface-variant">Hôm nay</p>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block bg-amber-500 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wide shadow-sm shadow-amber-500/30">Chờ duyệt</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-1.5">
                    <button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                    <button className="w-8 h-8 rounded hover:bg-emerald-50 text-emerald-600 transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">check_circle</span></button>
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                <td className="p-4 font-bold text-on-surface">Tân Bình</td>
                <td className="p-4">
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">Nhân sự</span>
                </td>
                <td className="p-4">
                  <h4 className="font-bold text-on-surface text-sm line-clamp-1">Báo cáo nghỉ phép đột xuất kỹ thuật ...</h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">Anh Hoàng xin nghỉ vì lý do gia đình, đã điều phó...</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center">VC</div>
                    <span className="text-sm text-on-surface-variant font-medium">Trần Văn C</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-on-surface text-sm">Hôm qua</p>
                  <p className="text-[10px] text-on-surface-variant">16:45</p>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block bg-emerald-500 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wide shadow-sm shadow-emerald-500/30">Đã xử lý</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-1.5">
                    <button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                    <button className="w-8 h-8 rounded text-slate-300 flex items-center justify-center cursor-not-allowed"><span className="material-symbols-outlined text-[18px]">check_circle</span></button>
                  </div>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-surface-container-lowest/50 transition-colors">
                <td className="p-4 font-bold text-on-surface">Quận 7</td>
                <td className="p-4">
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">Khác</span>
                </td>
                <td className="p-4">
                  <h4 className="font-bold text-on-surface text-sm line-clamp-1">Báo cáo tồn kho hóa chất tẩy rửa</h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">Lượng hóa chất loại A sắp hết, cần đặt thêm...</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center">PM</div>
                    <span className="text-sm text-on-surface-variant font-medium">Phạm Minh M</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-on-surface text-sm">2 ngày trước</p>
                  <p className="text-[10px] text-on-surface-variant">09:00</p>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block bg-slate-300 text-slate-700 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wide">Đã từ chối</span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-1.5">
                    <button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                    <button className="w-8 h-8 rounded text-slate-300 flex items-center justify-center cursor-not-allowed"><span className="material-symbols-outlined text-[18px]">check_circle</span></button>
                  </div>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">Hiển thị 4 trong tổng số 48 thông báo</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary text-white font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container font-bold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container font-bold">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="absolute bottom-8 right-8 w-14 h-14 bg-secondary text-white rounded-full shadow-lg shadow-secondary/40 flex items-center justify-center hover:bg-secondary/90 hover:scale-105 transition-all">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

    </div>
  );
};

export default AdminFeedback;
