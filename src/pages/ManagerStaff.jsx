import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BRANCH_NAMES = {
  'BRN-LD-01': 'LunaWash Bình Thạnh - Chi nhánh Bờ Sông',
  'BRN-Q1-01': 'LunaWash Quận 1 - Chi nhánh Trung Tâm'
};

// DEMO: Dữ liệu nhân viên mẫu để test UI. Sau này sẽ gọi API lấy từ DB.
const DEFAULT_EMPLOYEES = [
  { id: 'EMP-001', fullName: 'Nguyễn Văn Nhân Viên', role: 'Kỹ thuật', wages: '7.500.000đ', leaveDays: 1, status: 'Active', checkIn: '07:55 AM', note: 'Đúng giờ' },
  { id: 'EMP-002', fullName: 'Phạm Hoàng Nam', role: 'Kỹ thuật', wages: '7.800.000đ', leaveDays: 0, status: 'Active', checkIn: '07:58 AM', note: 'Đúng giờ' },
  { id: 'EMP-003', fullName: 'Nguyễn Thị Thu', role: 'Chăm sóc xe', wages: '8.000.000đ', leaveDays: 2, status: 'Active', checkIn: '08:12 AM', note: 'Hỏng xe giữa đường' },
  { id: 'EMP-004', fullName: 'Lê Văn Tài', role: 'Kỹ thuật', wages: '7.500.000đ', leaveDays: 0, status: 'Active', checkIn: '08:00 AM', note: 'Đúng giờ' },
  { id: 'EMP-005', fullName: 'Hoàng Quốc Việt', role: 'Kỹ thuật', wages: '7.500.000đ', leaveDays: 1, status: 'Active', checkIn: '08:02 AM', note: 'Đúng giờ' },
  { id: 'EMP-006', fullName: 'Đặng Minh Châu', role: 'Chăm sóc xe', wages: '8.200.000đ', leaveDays: 3, status: 'Active', checkIn: null, note: 'Có phép (Khám bệnh)' },
  { id: 'EMP-007', fullName: 'Vũ Quốc Bảo', role: 'Kỹ thuật', wages: '7.500.000đ', leaveDays: 0, status: 'Inactive', checkIn: null, note: 'Nghỉ không phép' }
];

export default function ManagerStaff() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('employees'); // 'employees' or 'attendance'
  const [selectedShift, setSelectedShift] = useState('Ca sáng');
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const getVietnamTime = () => {
    const vnTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
    return new Date(vnTimeStr);
  };
  const getTodayStr = (d = getVietnamTime()) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('Ca sáng');
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
  const [scheduleTemplates, setScheduleTemplates] = useState([]);
  
  const DAYS_OFF = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật', 'Chưa xếp'];
  const SHIFTS = ['Ca sáng', 'Ca chiều', 'Ca bảo trì', 'Chưa xếp'];
  const [incidentLog, setIncidentLog] = useState([
    { id: 'INC-001', title: 'Máy nén khí trạm 1 rò rỉ áp suất nhẹ', date: '05/06/2026', status: 'Đã khắc phục' },
    { id: 'INC-002', title: 'Thiếu hóa chất tạo bọt bóng Premium', date: '06/06/2026', status: 'Đang xử lý' }
  ]);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyLogs, setHistoryLogs] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ fullName: '', email: '', phoneNumber: '', roleId: 'ROL-02' });


  useEffect(() => {
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

  const fetchEmployees = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Users/branch/${parsedUser.branchId || 'BRN-LD-01'}`);
        if (res.ok) {
          const data = await res.json();
          const mappedData = data.map(emp => ({
            id: emp.id,
            fullName: emp.fullName,
            role: emp.roleName === 'TechnicalStaff' ? 'Kỹ thuật' : 'Chăm sóc xe',
            wages: emp.salary ? emp.salary.toLocaleString() + 'đ' : '0đ',
            leaveDays: emp.leaveDays || 0,
            status: emp.isActive ? 'Active' : 'Inactive',
            checkIn: null,
            note: ''
          }));
          setEmployees(mappedData);
        } else {
          setEmployees(DEFAULT_EMPLOYEES); // Fallback to mock data
        }
      } catch (err) {
        console.log("Dùng dữ liệu mock do API lỗi: " + err.message);
        setEmployees(DEFAULT_EMPLOYEES);
      }
    };

    fetchEmployees();
  }, [navigate]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?.branchId) return;
      setIsAttendanceLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/StaffManagement/branch/${user.branchId}/attendance?date=${selectedDate}&shift=${selectedShiftFilter}`);
        if (response.ok) {
          const data = await response.json();
          const mapped = data.map(item => ({
            id: item.employeeId,
            fullName: item.fullName,
            role: item.roleName,
            status: item.status,
            checkInTime: item.checkInTime,
            note: item.notes
          }));
          setAttendanceData(mapped);
        } else {
          // Fallback to mock data
          const fallbackAttendance = DEFAULT_EMPLOYEES.map(emp => ({
            id: emp.id,
            fullName: emp.fullName,
            role: emp.role,
            status: emp.status === 'Active' ? 'Có mặt' : 'Vắng mặt',
            checkInTime: emp.checkIn || '--:--',
            note: emp.note
          }));
          setAttendanceData(fallbackAttendance);
        }
      } catch (error) {
        console.log("Dùng dữ liệu điểm danh mock do lỗi API: " + error.message);
        const fallbackAttendance = DEFAULT_EMPLOYEES.map(emp => ({
          id: emp.id,
          fullName: emp.fullName,
          role: emp.role,
          status: emp.status === 'Active' ? 'Có mặt' : 'Vắng mặt',
          checkInTime: emp.checkIn || '--:--',
          note: emp.note
        }));
        setAttendanceData(fallbackAttendance);
      } finally {
        setIsAttendanceLoading(false);
      }
    };
    fetchAttendance();
  }, [user?.branchId, selectedDate, selectedShiftFilter]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user?.branchId) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/StaffManagement/branch/${user.branchId}/templates`);
        if (response.ok) {
          const data = await response.json();
          setScheduleTemplates(data.map(t => ({
            employeeId: t.id,
            shift: t.shift || 'Ca sáng',
            dayOff: t.dayOff || 'Thứ Hai'
          })));
        }
      } catch (error) {
        toast.error("Lỗi khi tải khuôn mẫu lịch: " + error.message);
      }
    };
    fetchTemplates();
  }, [user?.branchId]);

  if (!user) return null;

  const branchId = user.branchId || 'BRN-LD-01';
  const shortBranch = branchId.split('-')[1];
  const branchName = `Quản lí chi nhánh - ${shortBranch}`;

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const totalLeaveDays = employees.reduce((sum, e) => sum + e.leaveDays, 0);

  const getTemplateForEmployee = (empId) => {
    return scheduleTemplates.find(t => t.employeeId === empId) || { shift: 'Ca sáng', dayOff: 'Thứ Hai' };
  };

  const updateScheduleTemplate = (empId, field, value) => {
    setScheduleTemplates(prev => {
      const exists = prev.find(t => t.employeeId === empId);
      if (exists) {
        return prev.map(t => t.employeeId === empId ? { ...t, [field]: value } : t);
      }
      return [...prev, { employeeId: empId, shift: 'Ca sáng', dayOff: 'Thứ Hai', [field]: value }];
    });
  };

  const handleSaveTemplates = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/StaffManagement/templates?branchId=${branchId}&managerId=${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templates: scheduleTemplates })
      });
      if (response.ok) {
        toast.success("Lưu khuôn mẫu lịch thành công!");
        setIsEditingSchedule(false);
      } else {
        toast.error("Lưu thất bại: " + response.statusText);
      }
    } catch (error) {
      toast.error("Lỗi khi lưu khuôn mẫu: " + error.message);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/StaffManagement/branch/${branchId}/history`);
      if (response.ok) setHistoryLogs(await response.json());
    } catch (error) { toast.error("Lỗi khi tải lịch sử sửa đổi: " + error.message); }
  };

  const handleSaveAttendance = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/StaffManagement/attendance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: branchId,
          shift: selectedShiftFilter,
          attendances: attendanceData.map(a => ({ employeeId: a.id, status: a.status, note: a.note }))
        })
      });
      if (response.ok) {
        toast.success("Xác nhận điểm danh thành công!");
      } else {
        toast.error("Có lỗi xảy ra khi lưu điểm danh!");
      }
    } catch (error) { 
      toast.error("Lỗi khi lưu điểm danh: " + error.message);
    }
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

  const attTotal = attendanceData.length;
  const attPresent = attendanceData.filter(a => a.status === 'Có mặt').length;
  const attLate = attendanceData.filter(a => a.status === 'Vào muộn').length;
  const attAbsent = attendanceData.filter(a => a.status === 'Vắng mặt' || a.status === 'Có phép').length;
  const currentAttendance = attendanceData;

  const handleUpdateStatus = (empId, newStatus) => {
    setAttendanceData(prev => prev.map(a => a.id === empId ? { ...a, status: newStatus } : a));
  };

  const handleUpdateNote = (empId, newNote) => {
    setAttendanceData(prev => prev.map(a => a.id === empId ? { ...a, note: newNote } : a));
  };

const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/Employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEmployee, branchId: user.branchId || 'BRN-LD-01' })
      });
      if (response.ok) {
        toast.success("Thêm nhân viên thành công!");
        setShowAddModal(false);
        setNewEmployee({ fullName: '', email: '', phoneNumber: '', roleId: 'ROL-02' });
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/Employees/branch/${user.branchId || 'BRN-LD-01'}`);
        if (res.ok) {
            const data = await res.json();
            setEmployees(data.map(emp => ({
                id: emp.id,
                fullName: emp.fullName,
                role: emp.roleName === 'TechnicalStaff' ? 'Kỹ thuật' : 'Chăm sóc xe',
                wages: '0đ',
                leaveDays: 0,
                status: emp.isActive ? 'Active' : 'Inactive',
                checkIn: null,
                note: ''
            })));
        }
      } else {
        toast.error("Thêm nhân viên thất bại");
      }
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if(!confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/Employees/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success("Xóa nhân viên thành công!");
        setEmployees(employees.filter(e => e.id !== id));
      } else {
        toast.error("Xóa thất bại!");
      }
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const handleRealtimeCheckIn = async (empId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/Employees/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: empId, branchId: user.branchId || 'BRN-LD-01' })
      });
      if (res.ok) {
        toast.success("Điểm danh thành công!");
        const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        setAttendanceData(prev => prev.map(a => a.id === empId ? { ...a, checkInTime: time, status: 'Có mặt' } : a));
      } else {
        toast.error("Check-in thất bại (đã check-in rồi hoặc lỗi server)");
      }
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };  return (
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
                  <button onClick={() => setShowAddModal(true)} className="px-3.5 py-1.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-container text-xs transition-all shadow-sm flex items-center gap-1">
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

            {/* Fixed Schedule Template Setup */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Thiết lập Khuôn mẫu Lịch làm việc</h2>
                  <p className="text-sm text-slate-500 mt-1">Chọn ca làm và ngày nghỉ cố định hàng tuần cho từng nhân viên.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowHistoryModal(true)}
                    className="px-4 py-2 bg-white text-primary border border-primary/50 font-bold rounded-xl hover:bg-blue-50 text-xs shadow-sm transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">history</span>
                    Lịch sử sửa đổi
                  </button>
                  {isEditingSchedule ? (
                    <>
                      <button 
                        onClick={() => setIsEditingSchedule(false)}
                        className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 text-xs shadow-sm transition-all flex items-center gap-2"
                      >
                        Hủy
                      </button>
                      <button 
                        onClick={handleSaveTemplates}
                        className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-container text-xs shadow-sm transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">save</span>
                        Lưu thay đổi
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditingSchedule(true)}
                      className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-container text-xs shadow-sm transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Chỉnh sửa lịch
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-[20px] shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="border-b border-outline-variant/20 bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-500">Mã NV</th>
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-500">Họ & Tên</th>
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-500">Vai trò</th>
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-500">Ca cố định</th>
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-slate-500">Ngày nghỉ (1 buổi/tuần)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {employees.map(emp => {
                        const template = scheduleTemplates.find(t => t.employeeId === emp.id) || { shift: 'Chưa xếp', dayOff: 'Chưa xếp' };
                        return (
                          <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-slate-500 text-sm">{emp.id}</td>
                            <td className="px-6 py-4 font-bold text-slate-800 text-sm">{emp.fullName}</td>
                            <td className="px-6 py-4 text-slate-600 text-sm">
                              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${
                                emp.role.includes('Kỹ thuật') ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {emp.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {isEditingSchedule ? (
                                <select 
                                  value={template.shift}
                                  onChange={(e) => updateScheduleTemplate(emp.id, 'shift', e.target.value)}
                                  className="bg-white border border-outline-variant/40 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary outline-none cursor-pointer hover:border-primary/50 transition-colors w-full max-w-[150px]"
                                >
                                  {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              ) : (
                                <span className="font-medium text-slate-700 text-sm px-3 py-2 inline-block border border-transparent">{template.shift}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {isEditingSchedule ? (
                                <select 
                                  value={template.dayOff}
                                  onChange={(e) => updateScheduleTemplate(emp.id, 'dayOff', e.target.value)}
                                  className="bg-white border border-outline-variant/40 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary outline-none cursor-pointer hover:border-primary/50 transition-colors w-full max-w-[150px]"
                                >
                                  {DAYS_OFF.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                              ) : (
                                <span className="font-medium text-slate-700 text-sm px-3 py-2 inline-block border border-transparent">{template.dayOff}</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Attendance Table & Checklist Grid */}
            <div className="glass-card rounded-[32px] overflow-hidden border border-outline-variant/30 shadow-md mb-8">
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-[#f8fafc]">
                <div>
                  <h3 className="font-bold text-primary text-base">Điểm danh {selectedShift.toLowerCase()} hôm nay</h3>
                  <p className="text-xs text-outline mt-0.5">Chọn trạng thái điểm danh và điền ghi chú thích hợp.</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 border border-outline-variant/30 shadow-sm mx-auto md:mx-4 hidden md:flex">
                  {['Ca sáng', 'Ca chiều', 'Ca bảo trì'].map(shift => (
                    <button
                      key={shift}
                      onClick={() => setSelectedShift(shift)}
                      className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                        selectedShift === shift
                          ? 'bg-blue-100 text-blue-700 shadow-sm'
                          : 'text-outline hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {shift}
                    </button>
                  ))}
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
                    {currentAttendance.map((a) => (
                      <tr key={a.employeeId} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-on-surface">{a.fullName}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{a.role}</td>
                        <td className="px-6 py-4 font-medium text-outline">
                          {selectedShift === 'Ca chiều' ? 'Ca chiều (14:30 - 00:15)' : selectedShift === 'Ca bảo trì' ? 'Ca bảo trì (00:15 - 04:00)' : 'Ca sáng (04:00 - 14:30)'}
                        </td>
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
                        <td className="px-6 py-4 font-mono font-bold text-on-surface-variant">
                          {a.checkInTime === '--:--' ? (
                            <button 
                              onClick={() => handleRealtimeCheckIn(a.employeeId)}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
                            >
                              Điểm danh
                            </button>
                          ) : (
                            a.checkInTime
                          )}
                        </td>
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
      {/* Assign Shift Modal Removed */}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-xl">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-[#f8fafc]">
              <h2 className="text-lg font-bold text-[#00236f] flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                Lịch sử sửa đổi lịch làm việc
              </h2>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50">
              <div className="space-y-4">
                {historyLogs.length === 0 ? (
                  <p className="text-center text-slate-500 py-4">Chưa có lịch sử thay đổi nào.</p>
                ) : (
                  historyLogs.map((log, index) => (
                    <div key={log.id} className="bg-white p-4 rounded-2xl border border-outline-variant/20 shadow-sm relative pl-10">
                      <div className={`absolute left-4 top-5 w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                      {index !== historyLogs.length - 1 && (
                        <div className="absolute left-[19px] top-8 bottom-[-24px] w-[2px] bg-slate-100"></div>
                      )}
                      <p className="text-xs text-slate-500 font-bold mb-1">{new Date(log.createdAt).toLocaleString('vi-VN')}</p>
                      <p className="text-sm text-slate-800">
                        <span className="font-bold text-primary">{log.modifiedByFullName}</span> đã <span className="font-bold">{(log.action || '').toLowerCase()}</span> của <span className="font-bold">{log.employeeFullName}</span>
                        {log.oldValue && log.newValue ? (
                          <> từ <span className="text-rose-600 line-through">{log.oldValue}</span> thành <span className="text-emerald-600 font-bold">{log.newValue}</span>.</>
                        ) : (
                          <> thành <span className="text-emerald-600 font-bold">{log.newValue}</span>.</>
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
