import React from 'react';

const AdminEmployees = () => {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Quản lý nhân viên</h1>
        <p className="text-sm text-on-surface-variant">Theo dõi và quản lý đội ngũ nhân sự toàn hệ thống</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full md:max-w-[300px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên..." 
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-[42px]"
            />
          </div>
          
          {/* Lọc Vai trò */}
          <div className="relative w-full md:w-48">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">badge</span>
            <select className="w-full pl-9 pr-8 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-[42px] appearance-none text-on-surface-variant font-medium cursor-pointer">
              <option value="">Tất cả vai trò</option>
              <option value="manager">Quản lý chi nhánh</option>
              <option value="cashier">Thu ngân</option>
              <option value="technician">Kỹ thuật</option>
              <option value="staff">Nhân viên</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
          </div>

          {/* Lọc Chi nhánh */}
          <div className="relative w-full md:w-48">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">store</span>
            <select className="w-full pl-9 pr-8 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-[42px] appearance-none text-on-surface-variant font-medium cursor-pointer">
              <option value="">Tất cả chi nhánh</option>
              <option value="linh-dong">Linh Đông</option>
              <option value="tan-thoi-hiep">Tân Thới Hiệp</option>
              <option value="tan-phu">Tân Phú</option>
              <option value="binh-loi">Bình Lợi</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
          </div>
        </div>

        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-secondary text-on-secondary rounded-xl hover:bg-secondary/90 transition-all font-bold shadow-md h-[42px]">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Register New Employee
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs font-bold border-b border-outline-variant/20">
                <th className="p-4">Nhân viên</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Chi nhánh</th>
                <th className="p-4">Lịch làm việc</th>
                <th className="p-4 text-center">Ngày nghỉ</th>
                <th className="p-4 text-center">Đánh giá</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Row 1 */}
              <tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=11" alt="Avatar" className="w-10 h-10 rounded-full border border-outline-variant/30" />
                    <div>
                      <h4 className="font-bold text-on-surface">Nguyễn Văn An</h4>
                      <p className="text-xs text-on-surface-variant">an.nv@lunawash.com</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-on-secondary text-[11px] font-bold rounded-full">
                    <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                    Quản lý chi nhánh
                  </span>
                </td>
                <td className="p-4 text-on-surface-variant font-medium">Linh Đông</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    Ca sáng: 08:00 - 16:00
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block bg-error-container text-error font-bold text-xs px-2 py-0.5 rounded">02</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px] text-amber-500 fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    4.9/5
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit_square</span></button>
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                  </div>
                </td>
              </tr>
              
              {/* Row 2 */}
              <tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=12" alt="Avatar" className="w-10 h-10 rounded-full border border-outline-variant/30" />
                    <div>
                      <h4 className="font-bold text-on-surface">Trần Thị Bích</h4>
                      <p className="text-xs text-on-surface-variant">bich.tt@lunawash.com</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 text-[11px] font-bold rounded-full">
                    Thu ngân
                  </span>
                </td>
                <td className="p-4 text-on-surface-variant font-medium">Tân Thới Hiệp</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    Ca chiều: 13:00 - 21:00
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block bg-surface-container text-on-surface-variant font-bold text-xs px-2 py-0.5 rounded">00</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px] text-amber-500 fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    4.8/5
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit_square</span></button>
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=13" alt="Avatar" className="w-10 h-10 rounded-full border border-outline-variant/30" />
                    <div>
                      <h4 className="font-bold text-on-surface">Lê Hoàng Nam</h4>
                      <p className="text-xs text-on-surface-variant">nam.lh@lunawash.com</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 bg-primary text-white text-[11px] font-bold rounded-full">
                    Kỹ thuật
                  </span>
                </td>
                <td className="p-4 text-on-surface-variant font-medium">Linh Đông</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    Ca sáng: 08:00 - 16:00
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block bg-error-container text-error font-bold text-xs px-2 py-0.5 rounded">01</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px] text-amber-500 fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    5.0/5
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit_square</span></button>
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                  </div>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=14" alt="Avatar" className="w-10 h-10 rounded-full border border-outline-variant/30" />
                    <div>
                      <h4 className="font-bold text-on-surface">Phạm Minh Tâm</h4>
                      <p className="text-xs text-on-surface-variant">tam.pm@lunawash.com</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 bg-primary/20 text-primary text-[11px] font-bold rounded-full">
                    Nhân viên
                  </span>
                </td>
                <td className="p-4 text-on-surface-variant font-medium">Tân Phú</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    Ca gãy: 08:00 - 12:00
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block bg-surface-container text-on-surface-variant font-bold text-xs px-2 py-0.5 rounded">00</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px] text-amber-500 fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    4.7/5
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit_square</span></button>
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                  </div>
                </td>
              </tr>

              {/* Row 5 */}
              <tr className="hover:bg-surface-container-lowest/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=15" alt="Avatar" className="w-10 h-10 rounded-full border border-outline-variant/30" />
                    <div>
                      <h4 className="font-bold text-on-surface">Đặng Quốc Trung</h4>
                      <p className="text-xs text-on-surface-variant">trung.dq@lunawash.com</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 bg-primary/20 text-primary text-[11px] font-bold rounded-full">
                    Nhân viên
                  </span>
                </td>
                <td className="p-4 text-on-surface-variant font-medium">Bình Lợi</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    Ca chiều: 13:00 - 21:00
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block bg-error-container text-error font-bold text-xs px-2 py-0.5 rounded">03</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px] text-amber-500 fill-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    4.5/5
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit_square</span></button>
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">Hiển thị 5 trên 48 nhân viên</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-secondary text-white font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container font-bold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container font-bold">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">groups</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-0.5">Tổng nhân sự</p>
            <h3 className="text-2xl font-black text-on-surface">48</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined">how_to_reg</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-0.5">Đang làm việc</p>
            <h3 className="text-2xl font-black text-on-surface">32</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined fill-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-0.5">Điểm hài lòng TB</p>
            <h3 className="text-2xl font-black text-on-surface">4.82</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmployees;
