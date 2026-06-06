import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BRANCH_NAMES = {
  'BRN-BT-01': 'LunaWash Bình Thạnh - Chi nhánh Bờ Sông',
  'BRN-Q1-01': 'LunaWash Quận 1 - Chi nhánh Trung Tâm'
};

const DEFAULT_EMPLOYEES = [
  { id: 'EMP-001', fullName: 'Nguyễn Văn Nhân Viên', role: 'Kỹ thuật', wages: '7.500.000đ', leaveDays: 1, status: 'Active', checkIn: '07:55 AM', note: 'Đúng giờ' },
  { id: 'EMP-002', fullName: 'Phạm Hoàng Nam', role: 'Kỹ thuật', wages: '7.800.000đ', leaveDays: 0, status: 'Active', checkIn: '07:58 AM', note: 'Đúng giờ' },
  { id: 'EMP-003', fullName: 'Nguyễn Thị Thu', role: 'Thu ngân', wages: '8.000.000đ', leaveDays: 2, status: 'Active', checkIn: '08:12 AM', note: 'Hỏng xe giữa đường' },
  { id: 'EMP-004', fullName: 'Lê Văn Tài', role: 'Kỹ thuật', wages: '7.500.000đ', leaveDays: 0, status: 'Active', checkIn: '08:00 AM', note: 'Đúng giờ' },
  { id: 'EMP-005', fullName: 'Hoàng Quốc Việt', role: 'Kỹ thuật', wages: '7.500.000đ', leaveDays: 1, status: 'Active', checkIn: '08:02 AM', note: 'Đúng giờ' },
  { id: 'EMP-006', fullName: 'Đặng Minh Châu', role: 'Thu ngân', wages: '8.200.000đ', leaveDays: 3, status: 'Active', checkIn: null, note: 'Có phép (Khám bệnh)' },
  { id: 'EMP-007', fullName: 'Vũ Quốc Bảo', role: 'Kỹ thuật', wages: '7.500.000đ', leaveDays: 0, status: 'Inactive', checkIn: null, note: 'Nghỉ không phép' }
];

export default function ManagerStaff() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('employees'); // 'employees' or 'attendance'
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [incidentLog, setIncidentLog] = useState([
    { id: 'INC-001', title: 'Máy nén khí trạm 1 rò rỉ áp suất nhẹ', date: '05/06/2026', status: 'Đã khắc phục' },
    { id: 'INC-002', title: 'Thiếu hóa chất tạo bọt bóng Premium', date: '06/06/2026', status: 'Đang xử lý' }
  ]);

  useEffect(() => {
    // Check auth
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.tier !== 'BranchManager') {
      navigate('/staff/queue');
      return;
    }
    setUser(parsedUser);

    // Load employees
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`http://localhost:5010/api/Users/branch/${parsedUser.branchId || 'BRN-BT-01'}`);
        if (res.ok) {
          const data = await res.json();
          const mappedData = data.map(emp => ({
            id: emp.id,
            fullName: emp.fullName,
            role: emp.roleName === 'TechnicalStaff' ? 'Kỹ thuật' : 'Thu ngân',
            wages: emp.salary ? emp.salary.toLocaleString() + 'đ' : '0đ',
            leaveDays: emp.leaveDays || 0,
            status: emp.isActive ? 'Active' : 'Inactive',
            checkIn: '08:00 AM', // Check in logic would go here
            note: ''
          }));
          setEmployees(mappedData);
          initializeAttendance(mappedData);
        } else {
          console.error("Failed to fetch employees");
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchEmployees();
  }, [navigate]);

  const initializeAttendance = (empList) => {
    const todayAtt = empList.map(emp => ({
      employeeId: emp.id,
      fullName: emp.fullName,
      role: emp.role,
      shift: 'Ca sáng (08:00 - 12:00)',
      status: emp.checkIn ? (parseInt(emp.checkIn.split(':')[1]) > 0 ? 'Vào muộn' : 'Có mặt') : (emp.note && emp.note.includes('Có phép') ? 'Có phép' : 'Vắng mặt'),
      checkInTime: emp.checkIn || '--:--',
      note: emp.note || ''
    }));
    localStorage.setItem('lunaWash_attendance', JSON.stringify(todayAtt));
    setAttendanceData(todayAtt);
  };

  if (!user) return null;

  const branchId = user.branchId || 'BRN-BT-01';
  const branchName = BRANCH_NAMES[branchId] || 'Chi nhánh LunaWash';

  // Stats tab 1
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const totalLeaveDays = employees.reduce((sum, e) => sum + e.leaveDays, 0);

  // Stats tab 2
  const attTotal = attendanceData.length;
  const attPresent = attendanceData.filter(a => a.status === 'Có mặt' || a.status === 'Vào muộn').length;
  const attLate = attendanceData.filter(a => a.status === 'Vào muộn').length;
  const attAbsent = attendanceData.filter(a => a.status === 'Vắng mặt' || a.status === 'Có phép').length;

  const handleUpdateStatus = (empId, newStatus) => {
    const updated = attendanceData.map(a => {
      if (a.employeeId === empId) {
        return {
          ...a,
          status: newStatus,
          checkInTime: newStatus === 'Có mặt' ? '07:55 AM' : newStatus === 'Vào muộn' ? '08:15 AM' : '--:--'
        };
      }
      return a;
    });
    setAttendanceData(updated);
    localStorage.setItem('lunaWash_attendance', JSON.stringify(updated));
  };

  const handleUpdateNote = (empId, text) => {
    const updated = attendanceData.map(a => {
      if (a.employeeId === empId) {
        return { ...a, note: text };
      }
      return a;
    });
    setAttendanceData(updated);
    localStorage.setItem('lunaWash_attendance', JSON.stringify(updated));
  };

  const handleSaveAttendance = (type) => {
    alert(`Đã ${type === 'draft' ? 'lưu nháp' : 'xác nhận gửi'} bảng điểm danh ca sáng của chi nhánh ${branchName}!`);
  };

  const handleAddIncident = () => {
    const title = prompt('Nhập nội dung sự cố vận hành:');
    if (!title) return;
    const newIncident = {
      id: `INC-${Date.now().toString().slice(-3)}`,
      title,
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'Đang xử lý'
    };
    const updated = [newIncident, ...incidentLog];
    setIncidentLog(updated);
    alert('Đã thêm báo cáo sự cố thành công!');
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-outline-variant/20 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-xl font-bold">badge</span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Khu vực nhân sự</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-[#00236f] leading-tight">
              Quản Lý Nhân Sự & Điểm Danh
            </h1>
            <p className="text-sm text-on-surface-variant/80 mt-1">
              Trạm quản trị: <span className="font-extrabold text-secondary">{branchName}</span>
            </p>
          </div>

          {/* Sub Tab Navigation links */}
          <div className="flex bg-surface-container-low/75 border border-outline-variant/50 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'employees'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-base">group</span>
              Danh sách nhân viên
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'attendance'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-base">co_present</span>
              Phân ca & Điểm danh
            </button>
          </div>
        </div>

        {/* Tab 1 Content: Employees List */}
        {activeTab === 'employees' && (
          <div className="animate-fadeIn">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
              <div className="glass-card rounded-[24px] p-6 border border-outline-variant/30 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#00236f]"></div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">groups</span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-outline tracking-wider">Đội ngũ chi nhánh</p>
                  <h3 className="text-2xl font-black text-[#00236f] mt-1">{totalEmployees} nhân sự</h3>
                </div>
              </div>

              <div className="glass-card rounded-[24px] p-6 border border-outline-variant/30 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500"></div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">toggle_on</span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-outline tracking-wider">Nhân viên hoạt động</p>
                  <h3 className="text-2xl font-black text-emerald-700 mt-1">{activeEmployees} đang trực</h3>
                </div>
              </div>

              <div className="glass-card rounded-[24px] p-6 border border-outline-variant/30 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500"></div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">date_range</span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-outline tracking-wider">Nghỉ phép tích lũy</p>
                  <h3 className="text-2xl font-black text-amber-700 mt-1">{totalLeaveDays} ngày nghỉ</h3>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="glass-card rounded-[28px] p-6 border border-outline-variant/30 shadow-sm mb-8 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h4 className="font-bold text-on-surface text-base">Thao tác nghiệp vụ nhanh</h4>
                <p className="text-xs text-outline mt-0.5">Quản lý lương, phép và lập các văn bản vận hành chi nhánh.</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => alert("Đã mở form Đăng ký lịch phép nhân viên.")}
                  className="px-4 py-2 bg-white text-on-surface border border-outline-variant/50 hover:bg-surface-container-low font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">edit_calendar</span>
                  Đăng ký nghỉ phép
                </button>
                <button
                  onClick={() => alert("Báo cáo vận hành cuối ca làm việc đã được lưu trữ.")}
                  className="px-4 py-2 bg-white text-on-surface border border-outline-variant/50 hover:bg-surface-container-low font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">description</span>
                  Báo cáo vận hành
                </button>
                <button
                  onClick={handleAddIncident}
                  className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-base text-rose-600">report_problem</span>
                  Nhật ký sự cố
                </button>
              </div>
            </div>

            {/* Main Content Area Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
              {/* Employee table */}
              <div className="lg:col-span-2 glass-card rounded-[32px] overflow-hidden border border-outline-variant/30 shadow-md">
                <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-[#f8fafc]">
                  <h3 className="font-bold text-primary text-base">Danh sách nhân viên trạm</h3>
                  <button onClick={() => alert("Chức năng thêm tài khoản nhân sự mới sẽ kết nối DB.")} className="px-3.5 py-1.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-container text-xs transition-all shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    Thêm nhân viên
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-outline-variant/20">
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Mã NV</th>
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Họ & Tên</th>
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Vai Trò</th>
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Mức Lương</th>
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant text-center">Nghỉ phép</th>
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="px-6 py-4 font-mono text-outline">{emp.id}</td>
                          <td className="px-6 py-4 font-bold text-on-surface">{emp.fullName}</td>
                          <td className="px-6 py-4 font-medium text-on-surface-variant">{emp.role}</td>
                          <td className="px-6 py-4 font-mono font-bold">{emp.wages}</td>
                          <td className="px-6 py-4 text-center font-bold text-amber-700">{emp.leaveDays} ngày</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                              emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}>
                              {emp.status === 'Active' ? 'Đang trực' : 'Đã nghỉ'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Incidents logs */}
              <div className="glass-card rounded-[32px] p-6 border border-outline-variant/30 shadow-md">
                <h3 className="font-bold text-primary text-base mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-rose-600 font-bold">incident</span>
                  Nhật ký sự cố gần đây
                </h3>
                <div className="flex flex-col gap-4">
                  {incidentLog.map((inc) => (
                    <div key={inc.id} className="p-4 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 flex flex-col gap-2 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-outline">{inc.id} • {inc.date}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          inc.status === 'Đã khắc phục' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700 animate-pulse'
                        }`}>
                          {inc.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-on-surface leading-tight">
                        {inc.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 Content: Attendance and Schedules */}
        {activeTab === 'attendance' && (
          <div className="animate-fadeIn">
            
            {/* Upper Attendance Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-card rounded-[20px] p-4 border border-outline-variant/30 text-center shadow-sm">
                <p className="text-[10px] font-black uppercase text-outline tracking-wider">Tổng nhân sự ca</p>
                <h4 className="text-xl font-black text-primary mt-1">{attTotal} người</h4>
              </div>
              <div className="glass-card rounded-[20px] p-4 border border-outline-variant/30 text-center shadow-sm">
                <p className="text-[10px] font-black uppercase text-outline tracking-wider">Hiện diện</p>
                <h4 className="text-xl font-black text-emerald-700 mt-1">{attPresent} người</h4>
              </div>
              <div className="glass-card rounded-[20px] p-4 border border-outline-variant/30 text-center shadow-sm">
                <p className="text-[10px] font-black uppercase text-outline tracking-wider">Vào muộn</p>
                <h4 className="text-xl font-black text-amber-700 mt-1">{attLate} người</h4>
              </div>
              <div className="glass-card rounded-[20px] p-4 border border-outline-variant/30 text-center shadow-sm">
                <p className="text-[10px] font-black uppercase text-outline tracking-wider">Vắng ca / Phép</p>
                <h4 className="text-xl font-black text-rose-700 mt-1">{attAbsent} người</h4>
              </div>
            </div>

            {/* Attendance Table & Checklist Grid */}
            <div className="glass-card rounded-[32px] overflow-hidden border border-outline-variant/30 shadow-md mb-8">
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-[#f8fafc]">
                <div>
                  <h3 className="font-bold text-primary text-base">Điểm danh ca sáng hôm nay</h3>
                  <p className="text-xs text-outline mt-0.5">Chọn trạng thái điểm danh và điền ghi chú thích hợp.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveAttendance('draft')} className="px-3.5 py-2 bg-white text-on-surface border border-outline-variant/50 hover:bg-surface-container-low font-bold rounded-xl text-xs shadow-sm transition-all">
                    Lưu nháp
                  </button>
                  <button onClick={() => handleSaveAttendance('confirm')} className="px-3.5 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-container text-xs shadow-sm transition-all">
                    Xác nhận điểm danh
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-outline-variant/20">
                      <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Nhân viên</th>
                      <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Vai Trò</th>
                      <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Ca Trực</th>
                      <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Trạng Thái</th>
                      <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Check-In</th>
                      <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Ghi Chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {attendanceData.map((a) => (
                      <tr key={a.employeeId} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-on-surface">{a.fullName}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{a.role}</td>
                        <td className="px-6 py-4 font-medium text-outline">{a.shift}</td>
                        <td className="px-6 py-4">
                          <select
                            value={a.status}
                            onChange={(e) => handleUpdateStatus(a.employeeId, e.target.value)}
                            className="bg-white border border-outline-variant/50 rounded-xl px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                          >
                            <option value="Có mặt">Có mặt</option>
                            <option value="Vào muộn">Vào muộn</option>
                            <option value="Vắng mặt">Vắng mặt</option>
                            <option value="Có phép">Nghỉ có phép</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-on-surface-variant">{a.checkInTime}</td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            placeholder="Nhập ghi chú..."
                            value={a.note}
                            onChange={(e) => handleUpdateNote(a.employeeId, e.target.value)}
                            className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-lg px-3 py-1 text-xs outline-none focus:ring-1 focus:ring-primary transition-all"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Row: Custom SVG Chart & Weekly Performance Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
              {/* Custom interactive SVG bar chart for attendance rate */}
              <div className="lg:col-span-2 glass-card rounded-[32px] p-6 border border-outline-variant/30 shadow-md">
                <h3 className="font-bold text-primary text-base mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00236f] font-bold">bar_chart</span>
                  Tỷ lệ đi làm tuần này (01/06 - 07/06)
                </h3>
                
                {/* Custom SVG chart wrapper */}
                <div className="relative w-full h-64 flex items-center justify-center bg-white/30 rounded-2xl border border-outline-variant/10 p-4">
                  <svg className="w-full h-full" viewBox="0 0 600 220">
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00236f" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#00687a" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>

                    {/* Y-Axis lines */}
                    <line x1="50" y1="20" x2="550" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="50" y1="65" x2="550" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="50" y1="110" x2="550" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="50" y1="155" x2="550" y2="155" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="50" y1="180" x2="550" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

                    {/* Y-Axis labels */}
                    <text x="35" y="24" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="end">100%</text>
                    <text x="35" y="69" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="end">75%</text>
                    <text x="35" y="114" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="end">50%</text>
                    <text x="35" y="159" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="end">25%</text>
                    <text x="35" y="184" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="end">0%</text>

                    {/* Bars data */}
                    {/* Monday: 92%, Tuesday: 100%, Wednesday: 83%, Thursday: 92%, Friday: 75%, Saturday: 100%, Sunday: 92% */}
                    {/* Width of each bar is 32. Spacing is 40. Start x at 80. */}
                    {[
                      { label: 'T2', val: 92 },
                      { label: 'T3', val: 100 },
                      { label: 'T4', val: 83 },
                      { label: 'T5', val: 92 },
                      { label: 'T6', val: 75 },
                      { label: 'T7', val: 100 },
                      { label: 'CN', val: 92 }
                    ].map((bar, i) => {
                      const barHeight = (bar.val / 100) * 160;
                      const x = 75 + i * 66;
                      const y = 180 - barHeight;

                      return (
                        <g key={bar.label} className="cursor-pointer group">
                          {/* Main bar */}
                          <rect
                            x={x}
                            y={y}
                            width="32"
                            height={barHeight}
                            rx="6"
                            fill="url(#barGradient)"
                            className="transition-all duration-300 hover:fill-[#00236f] hover:opacity-100"
                          />
                          {/* Value bubble on hover */}
                          <rect
                            x={x - 4}
                            y={y - 25}
                            width="40"
                            height="18"
                            rx="4"
                            fill="#1e293b"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          />
                          <text
                            x={x + 16}
                            y={y - 13}
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            {bar.val}%
                          </text>
                          {/* Day label */}
                          <text
                            x={x + 16}
                            y="200"
                            fill="#334155"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {bar.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Attendance Quick Stats Panel */}
              <div className="glass-card rounded-[32px] p-6 border border-outline-variant/30 shadow-md flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-primary text-base mb-4">Thống kê chuyên cần tuần</h3>
                  <div className="flex flex-col gap-4">
                    {/* Đúng giờ */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-on-surface-variant">Đúng giờ</span>
                        <span className="text-emerald-700">84%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>

                    {/* Nghỉ phép */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-on-surface-variant">Nghỉ phép có lý do</span>
                        <span className="text-blue-700">12%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>

                    {/* Vi phạm */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                        <span className="text-on-surface-variant">Vi phạm (Muộn/Không phép)</span>
                        <span className="text-rose-700">4%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: '4%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert("Đang tải tệp báo cáo chi tiết chuyên cần tuần...")}
                  className="w-full mt-6 py-3 bg-[#f8fafc] hover:bg-surface-container-high text-primary border border-outline-variant/50 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">assignment</span>
                  Xem báo cáo chi tiết
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
