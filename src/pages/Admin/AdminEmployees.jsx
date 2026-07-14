import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editSalary, setEditSalary] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/Employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Không thể tải danh sách nhân viên');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (emp) => {
    setSelectedEmployee(emp);
    setEditSalary(emp.salary.toString());
    setShowEditModal(true);
  };

  const handleUpdateSalary = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    try {
      setIsUpdating(true);
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';

      const res = await fetch(import.meta.env.VITE_API_URL + `/api/Employees/${selectedEmployee.id}/salary`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ salary: parseFloat(editSalary) })
      });

      if (!res.ok) throw new Error('Cập nhật lương thất bại');
      
      toast.success('Đã cập nhật lương thành công');
      setShowEditModal(false);
      fetchEmployees(); // Tải lại danh sách
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFireEmployee = async () => {
    if (!selectedEmployee) return;
    if (!window.confirm(`Bạn có chắc chắn muốn SA THẢI nhân viên ${selectedEmployee.fullName}? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      setIsUpdating(true);
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';

      const res = await fetch(import.meta.env.VITE_API_URL + `/api/Employees/${selectedEmployee.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: false })
      });

      if (!res.ok) throw new Error('Sa thải thất bại');
      
      toast.success('Đã sa thải nhân viên');
      setShowEditModal(false);
      fetchEmployees();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter ? emp.roleName === roleFilter : true;
    const matchBranch = branchFilter ? emp.branchId === branchFilter : true;
    return matchSearch && matchRole && matchBranch;
  });

  // Calculate stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.isActive).length;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col space-y-6 relative">
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
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-[42px]"
            />
          </div>
          
          <div className="relative w-full md:w-48">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">badge</span>
            <select 
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-[42px] appearance-none text-on-surface-variant font-medium cursor-pointer"
            >
              <option value="">Tất cả vai trò</option>
              <option value="BranchManager">Quản lý chi nhánh</option>
              <option value="Staff">Nhân viên</option>
              <option value="TechnicalStaff">Kỹ thuật</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
          </div>

          <div className="relative w-full md:w-48">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">store</span>
            <select 
              value={branchFilter}
              onChange={e => setBranchFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-[42px] appearance-none text-on-surface-variant font-medium cursor-pointer"
            >
              <option value="">Tất cả chi nhánh</option>
              {/* Could fetch branches dynamically here, hardcoded for now or derived from data */}
              {[...new Set(employees.map(e => e.branchId))].filter(Boolean).map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
          </div>
        </div>

        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-secondary text-on-secondary rounded-xl hover:bg-secondary/90 transition-all font-bold shadow-md h-[42px]">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Thêm nhân sự mới
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
                <th className="p-4 text-center">Lương</th>
                <th className="p-4 text-center">Ngày phép</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-on-surface-variant">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-on-surface-variant">Không tìm thấy nhân viên nào</td>
                </tr>
              ) : (
                filteredEmployees.map(emp => (
                  <tr key={emp.id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg border border-primary/30">
                          {emp.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface">{emp.fullName}</h4>
                          <p className="text-xs text-on-surface-variant">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-full ${
                        emp.roleName === 'BranchManager' ? 'bg-secondary text-on-secondary' :
                        emp.roleName === 'TechnicalStaff' ? 'bg-amber-100 text-amber-700' :
                        'bg-primary/20 text-primary'
                      }`}>
                        {emp.roleName === 'BranchManager' ? 'Quản lý' :
                         emp.roleName === 'TechnicalStaff' ? 'Kỹ thuật' : 'Nhân viên'}
                      </span>
                    </td>
                    <td className="p-4 text-on-surface-variant font-medium">{emp.branchId || 'N/A'}</td>
                    <td className="p-4 text-center font-bold text-emerald-600">
                      {emp.salary.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block bg-surface-container text-on-surface-variant font-bold text-xs px-2 py-0.5 rounded">
                        {emp.leaveDays}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {emp.isActive ? (
                        <span className="inline-block bg-emerald-100 text-emerald-700 font-bold text-xs px-2 py-0.5 rounded uppercase">Hoạt động</span>
                      ) : (
                        <span className="inline-block bg-error-container text-error font-bold text-xs px-2 py-0.5 rounded uppercase">Đã nghỉ</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEditClick(emp)}
                          className="text-on-surface-variant hover:text-primary transition-colors bg-surface-container-low p-2 rounded-lg hover:shadow-sm"
                          title="Chỉnh sửa (Lương/Sa thải)"
                        >
                          <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">groups</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-0.5">Tổng nhân sự</p>
            <h3 className="text-2xl font-black text-on-surface">{totalEmployees}</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined">how_to_reg</span>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-0.5">Đang làm việc</p>
            <h3 className="text-2xl font-black text-on-surface">{activeEmployees}</h3>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-outline-variant/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-on-surface">Quản lý Nhân sự</h3>
              <button onClick={() => setShowEditModal(false)} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl mb-6">
              <p className="font-bold text-on-surface">{selectedEmployee.fullName}</p>
              <p className="text-xs text-on-surface-variant">{selectedEmployee.email}</p>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-on-surface-variant">Vai trò: {selectedEmployee.roleName}</span>
                <span className="font-bold text-primary">Phép: {selectedEmployee.leaveDays} ngày</span>
              </div>
            </div>

            <form onSubmit={handleUpdateSalary} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-1">Mức lương (VNĐ)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={editSalary}
                    onChange={(e) => setEditSalary(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-transparent border border-outline-variant/50 rounded-xl text-on-surface font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">đ</span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  {isUpdating ? 'Đang lưu...' : 'Lưu mức lương'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-outline-variant/20">
              <h4 className="text-xs font-extrabold text-error uppercase tracking-widest mb-3">Khu vực nguy hiểm</h4>
              <p className="text-xs text-on-surface-variant mb-4">Hành động sa thải sẽ lập tức vô hiệu hóa tài khoản của nhân viên này trên hệ thống.</p>
              <button 
                onClick={handleFireEmployee}
                disabled={isUpdating || !selectedEmployee.isActive}
                className="w-full bg-error/10 text-error border border-error/30 py-3 rounded-xl font-bold hover:bg-error hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">person_remove</span>
                {selectedEmployee.isActive ? 'Sa thải nhân viên' : 'Đã sa thải'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEmployees;
