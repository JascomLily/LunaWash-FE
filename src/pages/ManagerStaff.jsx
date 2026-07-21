import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BRANCH_NAMES = {
  'BRN-LD-01': 'LunaWash Bình Thạnh - Chi nhánh Bờ Sông',
  'BRN-Q1-01': 'LunaWash Quận 1 - Chi nhánh Trung Tâm'
};


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
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
  const [scheduleTemplates, setScheduleTemplates] = useState([]);
  const [weeklyLeaves, setWeeklyLeaves] = useState([]);
  
  const DAYS_OFF = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật', 'Chưa xếp'];
  const SHIFTS = ['Ca sáng', 'Ca chiều', 'Ca bảo trì', 'Chưa xếp'];
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyLogs, setHistoryLogs] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ fullName: '', email: '', phoneNumber: '', roleId: 'ROL-02', salary: '', leaveDays: '' });


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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Employees/branch/${parsedUser.branchId || 'BRN-LD-01'}`, {
          headers: { 'Authorization': `Bearer ${parsedUser.token}` }
        });
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
          setEmployees([]); // Fallback to mock data
        }
      } catch (err) {
        console.log("Dùng dữ liệu mock do API lỗi: " + err.message);
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, [navigate]);



  useEffect(() => {
    const fetchTemplates = async () => {
      if (!user?.branchId) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/StaffManagement/branch/${user.branchId}/templates`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
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

  useEffect(() => {
    const loadAttendanceData = async () => {
      if (!user?.branchId || employees.length === 0) return;
      setIsAttendanceLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Employees/branch/${user.branchId}/attendance?date=${selectedDate}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        let recordedAtt = [];
        if (res.ok) {
          recordedAtt = await res.json();
        }

        const targetTemplates = scheduleTemplates.filter(t => t.shift === selectedShift);

        const newAttendance = targetTemplates.map(t => {
          const emp = employees.find(e => e.id === t.employeeId);
          if (!emp) return null;
          
          const record = recordedAtt.find(r => r.userId === t.employeeId);
          
          const getStatusText = (status) => {
            if (status === 'Present') return 'Có mặt';
            if (status === 'Late') return 'Vào muộn';
            if (status === 'Absent') return 'Vắng mặt';
            if (status === 'OnLeave') return 'Có phép';
            return 'Vắng mặt';
          };
          
          let checkInTime = '--:--';
          if (record?.checkInTime) {
              const d = new Date(record.checkInTime);
              checkInTime = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
          }

          return {
            id: emp.id,
            employeeId: emp.id,
            fullName: emp.fullName,
            role: emp.role,
            status: record?.status ? getStatusText(record.status) : '',
            checkInTime: checkInTime,
            note: record?.note || '',
            isConfirmed: !!record?.status
          };
        }).filter(Boolean);

        setAttendanceData(newAttendance);
        } catch (error) {
          toast.error("Lỗi khi lấy dữ liệu điểm danh: " + error.message);
        }
        
        try {
          const resLeaves = await fetch(`${import.meta.env.VITE_API_URL}/api/Employees/branch/${user.branchId}/weekly-leaves?date=${selectedDate}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          if (resLeaves.ok) {
            const leavesData = await resLeaves.json();
            setWeeklyLeaves(leavesData);
          }
        } catch (error) {
          console.error("Lỗi lấy dữ liệu nghỉ phép tuần:", error);
        } finally {
          setIsAttendanceLoading(false);
        }
      };

    loadAttendanceData();
  }, [selectedDate, selectedShift, scheduleTemplates, employees, user]);

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

  const getUserIdFromToken = (token) => {
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.nameid || payload.sub || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '';
    } catch (e) {
      return '';
    }
  };

  const handleSaveTemplates = async () => {
    const branchId = user?.branchId || 'BRN-LD-01';
    const managerId = getUserIdFromToken(user?.token);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/StaffManagement/templates?branchId=${branchId}&managerId=${managerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/StaffManagement/branch/${branchId}/history`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) setHistoryLogs(await response.json());
    } catch (error) { toast.error("Lỗi khi tải lịch sử sửa đổi: " + error.message); }
  };

  const handleSaveAttendance = async () => {
    try {
      const statusMap = { 'Có mặt': 'Present', 'Vào muộn': 'Late', 'Vắng mặt': 'Absent', 'Có phép': 'OnLeave' };
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/StaffManagement/attendance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({
          branchId: branchId,
          shift: selectedShift,
          attendances: attendanceData.map(a => ({ employeeId: a.id, status: statusMap[a.status] || 'Absent', note: a.note || '' }))
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ ...newEmployee, salary: Number(newEmployee.salary), leaveDays: Number(newEmployee.leaveDays), branchId: user.branchId || 'BRN-LD-01' })
      });
      if (response.ok) {
        toast.success("Thêm nhân viên thành công!");
        setShowAddModal(false);
        setNewEmployee({ fullName: '', email: '', phoneNumber: '', roleId: 'ROL-02', salary: '', leaveDays: '' });
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Employees/branch/${user.branchId || 'BRN-LD-01'}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
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
        const errorText = await response.text();
        toast.error(errorText || "Thêm nhân viên thất bại");
      }
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if(!confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Employees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
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

  const handleConfirmRow = async (empId, status) => {
    if (!status) {
      toast.error("Vui lòng chọn trạng thái trước khi xác nhận");
      return;
    }
    
    const isPresentOrLate = status === 'Có mặt' || status === 'Vào muộn';
    const time = isPresentOrLate ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--';
    const empData = attendanceData.find(a => a.id === empId);
    
    try {
      const statusMap = { 'Có mặt': 'Present', 'Vào muộn': 'Late', 'Vắng mặt': 'Absent', 'Có phép': 'OnLeave' };
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/StaffManagement/attendance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({
          branchId: branchId,
          shift: selectedShift,
          attendances: [{ employeeId: empId, status: statusMap[status] || 'Absent', note: empData?.note || '' }]
        })
      });

      if (response.ok) {
        setAttendanceData(prev => prev.map(a => a.id === empId ? { ...a, checkInTime: time, isConfirmed: true } : a));
        toast.success(`Đã lưu ${status} cho nhân viên`);
      } else {
        toast.error("Có lỗi xảy ra khi lưu trên server!");
      }
    } catch (error) {
      toast.error("Lỗi mạng: " + error.message);
    }
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
              </div>
            </div>

            {/* Main Content Area Grid */}
            <div className="grid grid-cols-1 gap-gutter">
              {/* Employee table */}
              <div className="glass-card rounded-[32px] overflow-hidden border border-outline-variant/30 shadow-md">
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
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant text-center">Trạng thái</th>
                        <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant text-right">Thao tác</th>
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
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                              emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-300'
                            }`}>
                              {emp.status === 'Active' ? 'Đang trực' : 'Đã nghỉ'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteEmployee(emp.id)}
                              className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors border border-rose-200 shadow-sm ml-auto"
                              title="Xóa nhân viên"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                            disabled={a.isConfirmed}
                            className={`bg-white border border-outline-variant/50 rounded-xl px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-primary outline-none transition-all ${a.isConfirmed ? 'opacity-70 cursor-not-allowed bg-slate-50' : ''}`}
                          >
                            <option value="" disabled>Chưa chọn</option>
                            <option value="Có mặt">Có mặt</option>
                            <option value="Vào muộn">Vào muộn</option>
                            <option value="Vắng mặt">Vắng mặt</option>
                            <option value="Có phép">Nghỉ có phép</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-on-surface-variant">
                          {!a.isConfirmed ? (
                            <button 
                              onClick={() => handleConfirmRow(a.employeeId, a.status)}
                              disabled={!a.status}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm whitespace-nowrap active:scale-95
                                ${a.status 
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white' 
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'}`}
                            >
                              Xác nhận
                            </button>
                          ) : (
                            <span className="text-[#00236f]">{a.checkInTime}</span>
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

            {/* Bottom Row: Weekly Leave Summary */}
            <div className="glass-card rounded-[32px] p-6 border border-outline-variant/30 shadow-md">
              <h3 className="font-bold text-primary text-base mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00236f] font-bold">event_busy</span>
                Tổng quan nhân viên nghỉ phép tuần này
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-outline-variant/20">
                      <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Nhân viên</th>
                      <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Vai Trò</th>
                      <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Ngày nghỉ</th>
                      <th className="px-6 py-4 font-black uppercase text-xs tracking-wider text-on-surface-variant">Lý do (Ghi chú)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {weeklyLeaves.length > 0 ? (
                      weeklyLeaves.map((leave, idx) => (
                        <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-on-surface">{leave.fullName}</td>
                          <td className="px-6 py-4 text-on-surface-variant">{leave.roleName}</td>
                          <td className="px-6 py-4 font-medium text-amber-700">
                            {new Date(leave.attendanceDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                          </td>
                          <td className="px-6 py-4 text-outline">{leave.note || (leave.status === 'Absent' ? 'Vắng mặt không phép' : 'Nghỉ có phép')}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-on-surface-variant italic">
                          Không có nhân viên nghỉ phép trong tuần này
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
      {/* Assign Shift Modal Removed */}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-xl">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-[#f8fafc]">
              <h2 className="text-lg font-bold text-[#00236f] flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                Thêm nhân viên mới
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleAddEmployee} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Họ và tên</label>
                  <input type="text" required value={newEmployee.fullName} onChange={e => setNewEmployee({...newEmployee, fullName: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-surface-container-lowest" placeholder="Nhập họ và tên..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Email</label>
                  <input type="email" required value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-surface-container-lowest" placeholder="Nhập email liên hệ..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Số điện thoại</label>
                  <input type="tel" required value={newEmployee.phoneNumber} onChange={e => setNewEmployee({...newEmployee, phoneNumber: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-surface-container-lowest" placeholder="Nhập số điện thoại..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Vai trò</label>
                  <select value={newEmployee.roleId} onChange={e => setNewEmployee({...newEmployee, roleId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-surface-container-lowest appearance-none">
                    <option value="ROL-02">Chăm sóc xe</option>
                    <option value="ROL-05">Kỹ thuật viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Chi nhánh</label>
                  <input type="text" disabled value={user.branchId || 'BRN-LD-01'} className="w-full px-4 py-2 rounded-xl border border-outline-variant/30 bg-slate-100 text-slate-500 cursor-not-allowed" />
                  <p className="text-xs text-slate-400 mt-1">Chi nhánh mặc định theo tài khoản Quản lý</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Mức lương (VNĐ)</label>
                    <input type="number" required min="0" step="100000" value={newEmployee.salary || ''} onChange={e => setNewEmployee({...newEmployee, salary: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-surface-container-lowest" placeholder="VD: 7000000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-1">Số ngày phép</label>
                    <input type="number" required min="0" value={newEmployee.leaveDays || ''} onChange={e => setNewEmployee({...newEmployee, leaveDays: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-surface-container-lowest" placeholder="VD: 12" />
                  </div>
                </div>
                <button type="submit" className="w-full mt-2 py-3 bg-primary hover:bg-primary-container text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98]">
                  Xác nhận thêm
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

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
