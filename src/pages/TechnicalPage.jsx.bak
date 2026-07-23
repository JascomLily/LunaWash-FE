import React, { useState } from 'react';
import toast from 'react-hot-toast';

// --- MOCK DATA ---
const mockStations = [
  { id: 'Trạm 1', machine: 'Máy rửa xe tự động Karcher', status: 'Tốt', brokenPart: '', lastFixed: '15/06/2026', statusColor: 'border-emerald-200 text-emerald-700 bg-emerald-50' },
  { id: 'Trạm 2', machine: 'Hệ thống rửa gầm', status: 'Hỏng', brokenPart: 'Motor quay', lastFixed: '10/06/2026', statusColor: 'border-rose-200 text-rose-700 bg-rose-50' },
  { id: 'Trạm 3', machine: 'Hệ thống xịt bọt tuyết', status: 'Trục trặc', brokenPart: 'Bơm áp lực', lastFixed: '01/06/2026', statusColor: 'border-amber-200 text-amber-700 bg-amber-50' }
];

const mockTasks = [
  { id: 'TASK-101', name: 'Trạm 2 kêu to, tụt áp', stationId: 'Trạm 2', machineName: 'Hệ thống rửa gầm', status: 'Chờ nghiệm thu', description: 'Nhân viên báo máy nén khí kêu to thất thường, áp lực yếu không đủ bọt tuyết.', type: 'incident', requestedBy: 'Manager', createdAt: '01/07/2026 08:30' },
  { id: 'TASK-102', name: 'Bảo dưỡng định kỳ tháng 7', stationId: 'Trạm 1', machineName: 'Máy rửa xe tự động Karcher', status: 'Đang làm', description: 'Tra dầu mỡ ray trượt, vệ sinh béc phun.', type: 'maintenance', requestedBy: 'Manager', createdAt: '01/07/2026 07:00' }
];

const mockReports = [
  { id: 'REP-089', issueName: 'Bơm nước yếu quá', stationId: 'Trạm 3', machineName: 'Hệ thống xịt bọt tuyết', reportedBy: 'Nhân viên CSX 1', role: 'Staff', desc: 'Sáng nay em bật máy thấy nước ra yếu xìu, không trôi được xà phòng sếp ơi.', time: '01/07/2026 10:00', status: 'Chờ xử lý', brokenPartSuggest: 'Bơm áp lực' }
];

export default function TechnicalPage() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isManager = storedUser?.tier === 'BranchManager' || storedUser?.tier === 'Admin';
  const isTechnical = storedUser?.tier === 'TechnicalStaff';
  const isStaff = storedUser?.tier === 'Staff';
  
  // State for Demo
  const [stations, setStations] = useState(mockStations);
  const [tasks, setTasks] = useState(mockTasks);
  const [reports, setReports] = useState(mockReports);
  
  // Default Tabs
  const getInitialTab = () => {
    if(isManager) return 'overview';
    if(isTechnical) return 'incidents';
    return 'overview';
  }
  const [activeTab, setActiveTab] = useState(getInitialTab()); 

  // Modals
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ stationId: '', issueName: '', desc: '', brokenPartSuggest: '' });

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportData, setSupportData] = useState({ taskId: '', requestType: 'Linh kiện', note: '' });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewData, setReviewData] = useState({ priority: 'Trung bình', note: '', updateStationTable: true });

  // 1. Gửi Báo cáo (Staff / Tech -> Manager)
  const handleSubmitReport = (e) => {
    e.preventDefault();
    if(!reportData.stationId || !reportData.issueName) return;
    
    const newReport = {
      id: `REP-${Math.floor(Math.random() * 1000)}`,
      issueName: reportData.issueName,
      stationId: reportData.stationId,
      machineName: stations.find(s => s.id === reportData.stationId)?.machine || '',
      reportedBy: storedUser?.name || 'Nhân viên',
      role: storedUser?.tier || 'Staff',
      desc: reportData.desc,
      brokenPartSuggest: isTechnical ? reportData.brokenPartSuggest : '',
      time: new Date().toLocaleString('vi-VN'),
      status: 'Chờ xử lý'
    };

    setReports([newReport, ...reports]);
    toast.success("Đã gửi báo cáo lên Hộp thư của Quản lý!");
    setShowReportModal(false);
    setReportData({ stationId: '', issueName: '', desc: '', brokenPartSuggest: '' });
  };

  // 2. Quản lý duyệt Báo cáo & Tạo Task
  const handleReviewReport = (e) => {
    e.preventDefault();
    
    // Đổi trạng thái Report
    setReports(reports.map(r => r.id === selectedReport.id ? { ...r, status: 'Đã giao Task' } : r));
    
    // Auto Update Bảng Trạm
    if (reviewData.updateStationTable) {
      setStations(stations.map(st => {
        if (st.id === selectedReport.stationId) {
          const newStatus = reviewData.priority === 'Khẩn cấp' || reviewData.priority === 'Cao' ? 'Hỏng' : 'Trục trặc';
          const newColor = newStatus === 'Hỏng' ? 'border-rose-200 text-rose-700 bg-rose-50' : 'border-amber-200 text-amber-700 bg-amber-50';
          return {
            ...st,
            status: newStatus,
            brokenPart: selectedReport.brokenPartSuggest || selectedReport.issueName,
            statusColor: newColor
          };
        }
        return st;
      }));
    }
    
    // Tạo Task
    const newTask = {
      id: `TASK-${Math.floor(Math.random() * 1000)}`,
      name: selectedReport.issueName,
      stationId: selectedReport.stationId,
      machineName: selectedReport.machineName,
      status: 'Chưa làm',
      description: `[Từ báo cáo của ${selectedReport.reportedBy} - Mức độ: ${reviewData.priority}] - ${selectedReport.desc} \n\nGhi chú của Quản lý: ${reviewData.note}`,
      type: 'incident',
      requestedBy: 'Manager',
      createdAt: new Date().toLocaleString('vi-VN')
    };
    
    setTasks([newTask, ...tasks]);
    toast.success("Đã giao Task và cập nhật tình trạng Trạm thành Hỏng/Trục trặc!");
    setShowReviewModal(false);
  };

  // 3. Kỹ thuật cập nhật Task
  const handleTechUpdateTask = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    if(newStatus === 'Cần hỗ trợ') {
      toast.success(`Đã cập nhật trạng thái: ${newStatus}`);
      setSupportData({ taskId: taskId, requestType: 'Linh kiện', note: '' });
      setShowSupportModal(true);
    } else if (newStatus === 'Chờ nghiệm thu') {
      toast.success("Đã báo cáo sửa xong! Chờ Quản lý nghiệm thu.");
    } else {
      toast.success(`Đã cập nhật trạng thái: ${newStatus}`);
    }
  };

  // 4. Quản lý Nghiệm thu Task -> Auto Update Bảng Trạm về "Tốt"
  const handleManagerCompleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if(!task) return;

    // Đổi Task thành Hoàn thành
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Hoàn thành' } : t));
    
    // Set Trạm về Tốt
    setStations(stations.map(st => st.id === task.stationId ? { 
      ...st, 
      status: 'Tốt', 
      brokenPart: '', 
      statusColor: 'border-emerald-200 text-emerald-700 bg-emerald-50', 
      lastFixed: new Date().toLocaleDateString('vi-VN') 
    } : st));

    toast.success("Nghiệm thu thành công! Trạm đã được cập nhật thành 'Tốt'.");
  };

  const handleSubmitSupport = (e) => {
    e.preventDefault();
    toast.success(`Đã gửi yêu cầu cấp ${supportData.requestType} lên Quản lý!`);
    setShowSupportModal(false);
  };

  const incidentTasks = tasks.filter(t => t.type === 'incident');
  const pendingReportsCount = reports.filter(r => r.status === 'Chờ xử lý').length;
  const pendingReviewTasksCount = tasks.filter(t => t.status === 'Chờ nghiệm thu').length;

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-28 pb-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">Kỹ thuật thiết bị</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full">
                Chi nhánh Quận 1
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {isStaff ? 'Xem tình trạng các Trạm và báo cáo sự cố' : 
               isTechnical ? 'Quy trình bảo trì và xử lý sự cố Trạm' : 
               'Theo dõi tổng quan tình trạng các Trạm tại chi nhánh'}
            </p>
          </div>
          
          <button 
            onClick={() => {
              setReportData({ stationId: '', issueName: '', desc: '', brokenPartSuggest: '' });
              setShowReportModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg transition-all active:scale-95 shadow-md bg-rose-600 text-white hover:bg-rose-700"
          >
            <span className="material-symbols-outlined text-xl">warning</span>
            {isTechnical ? 'Báo cáo sự cố thiết bị' : 'Báo cáo sự cố khẩn'}
          </button>
        </div>

        {/* TABS MENU */}
        <div className="flex gap-4 border-b border-slate-200">
          {(isManager || isStaff) && (
            <button 
              className={`pb-3 px-4 font-bold text-sm transition-colors ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              Tổng quan Thiết bị
            </button>
          )}

          {isManager && (
            <button 
              className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === 'reports' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('reports')}
            >
              Hộp thư Báo cáo
              {pendingReportsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  {pendingReportsCount}
                </span>
              )}
            </button>
          )}

          {(isTechnical || isManager) && (
            <button 
              className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === 'incidents' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('incidents')}
            >
              {isManager ? 'Theo dõi Task' : 'Xử lý sự cố'}
              {(isManager ? pendingReviewTasksCount : incidentTasks.filter(t => t.status !== 'Hoàn thành').length) > 0 && (
                <span className={`${isManager ? 'bg-emerald-500' : 'bg-rose-500'} text-white text-[10px] px-2 py-0.5 rounded-full font-black`}>
                  {isManager ? pendingReviewTasksCount : incidentTasks.filter(t => t.status !== 'Hoàn thành').length}
                </span>
              )}
            </button>
          )}

          {isTechnical && (
            <button 
              className={`pb-3 px-4 font-bold text-sm transition-colors ${activeTab === 'maintenance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('maintenance')}
            >
              Bảo trì định kỳ
            </button>
          )}
        </div>

        {/* NỘI DUNG THEO TABS VÀ ROLE */}
        
        {/* VIEW 1: BẢO TRÍ HẰNG NGÀY HOẶC OVERVIEW (Cho Manager/Staff/Tech) */}
        {(activeTab === 'maintenance' || activeTab === 'overview') && (
          <>
            {/* THỐNG KÊ (Chỉ Manager hoặc Tech xem) */}
            {(isManager || isTechnical) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-500 text-xl">precision_manufacturing</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tổng số Trạm</span>
                  </div>
                  <p className="text-[2.5rem] font-black text-slate-800 leading-none">03</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 rounded-full p-1 text-sm">check_circle</span>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Tốt</span>
                  </div>
                  <p className="text-[2.5rem] font-black text-emerald-600 leading-none">{stations.filter(s => s.status === 'Tốt').length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-600 bg-rose-50 rounded-full p-1 text-sm">error</span>
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">Hỏng/Trục trặc</span>
                  </div>
                  <p className="text-[2.5rem] font-black text-rose-600 leading-none">{stations.filter(s => s.status !== 'Tốt').length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 bg-blue-50 rounded-full p-1 text-sm">assignment</span>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Task Sự cố</span>
                  </div>
                  <p className="text-[2.5rem] font-black text-blue-600 leading-none">{incidentTasks.length}</p>
                </div>
              </div>
            )}

            {/* DANH SÁCH THIẾT BỊ (TRẠM) - READ ONLY */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-700">Danh sách Trạm / Máy rửa</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Chế độ Xem (Tự động cập nhật qua Báo cáo)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trạm</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tên Máy</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tình trạng</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bộ phận hỏng</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ngày sửa gần nhất</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stations.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4"><span className="text-sm font-black text-slate-800">{st.id}</span></td>
                        <td className="px-6 py-4 font-bold text-slate-700">{st.machine}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border select-none ${st.statusColor}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {st.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {st.brokenPart ? (
                            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100">{st.brokenPart}</span>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium italic">Không có</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">{st.lastFixed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: HỘP THƯ BÁO CÁO (Chỉ Manager) */}
        {activeTab === 'reports' && isManager && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">mark_email_read</span>
                <p className="text-slate-500 font-medium">Hộp thư báo cáo đang trống!</p>
              </div>
            ) : (
              reports.map(rep => (
                <div key={rep.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:border-blue-300 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase tracking-wider ${
                          rep.status === 'Chờ xử lý' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {rep.status}
                        </span>
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span> {rep.time}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-800 mt-2">{rep.issueName}</h3>
                      <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-blue-500">ev_station</span>
                        Nơi hỏng: <strong className="text-slate-700">{rep.stationId}</strong> ({rep.machineName})
                      </p>
                      {rep.brokenPartSuggest && (
                        <p className="text-sm font-medium text-rose-600 mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">build</span>
                          Kỹ thuật chẩn đoán hư: <strong>{rep.brokenPartSuggest}</strong>
                        </p>
                      )}
                      
                      <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-slate-500">person</span>
                          </div>
                          <span className="text-sm font-bold text-slate-700">{rep.reportedBy}</span>
                          <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">{rep.role}</span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium">{rep.desc}</p>
                      </div>
                    </div>
                    
                    {/* Hành động cập nhật */}
                    <div className="flex items-center gap-2 self-start md:self-center mt-2 md:mt-0">
                      {rep.status === 'Chờ xử lý' ? (
                        <button 
                          onClick={() => {
                            setSelectedReport(rep);
                            setReviewData({ priority: 'Trung bình', note: '', updateStationTable: true });
                            setShowReviewModal(true);
                          }}
                          className="px-5 py-2.5 bg-[#001f3f] hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-lg">assignment_add</span>
                          Duyệt & Giao Task
                        </button>
                      ) : (
                        <button disabled className="px-5 py-2.5 bg-slate-100 text-slate-400 text-sm font-bold rounded-xl flex items-center gap-2 cursor-not-allowed">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                          Đã chuyển thành Task
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* VIEW 3: XỬ LÝ SỰ CỐ / THEO DÕI TASK (Tech / Manager) */}
        {activeTab === 'incidents' && (
          <div className="space-y-4">
            {incidentTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">check_circle</span>
                <p className="text-slate-500 font-medium">Hiện không có sự cố nào cần xử lý!</p>
              </div>
            ) : (
              incidentTasks.map(task => (
                <div key={task.id} className={`bg-white rounded-2xl shadow-sm border p-5 transition-colors ${task.status === 'Chờ nghiệm thu' ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 hover:border-blue-300'}`}>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase tracking-wider ${
                          task.status === 'Chưa làm' ? 'bg-slate-100 text-slate-600' :
                          task.status === 'Đang làm' ? 'bg-blue-100 text-blue-700' :
                          task.status === 'Cần hỗ trợ' ? 'bg-amber-100 text-amber-700' :
                          task.status === 'Chờ nghiệm thu' ? 'bg-emerald-500 text-white animate-pulse' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {task.status}
                        </span>
                        <span className="text-xs font-bold text-slate-400"># {task.id}</span>
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span> {task.createdAt}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-800">{task.name}</h3>
                      <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-blue-500">ev_station</span>
                        Nơi hỏng: <strong className="text-slate-700">{task.stationId}</strong> ({task.machineName})
                      </p>
                    </div>
                    
                    {/* Hành động cập nhật dựa theo Role */}
                    {task.status !== 'Hoàn thành' && (
                      <div className="flex flex-wrap items-center gap-2">
                        
                        {/* Hành động cho KỸ THUẬT */}
                        {isTechnical && (
                          <>
                            {task.status === 'Chưa làm' && (
                              <button onClick={() => handleTechUpdateTask(task.id, 'Đang làm')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">play_arrow</span> Bắt đầu sửa
                              </button>
                            )}
                            {(task.status === 'Đang làm' || task.status === 'Cần hỗ trợ') && (
                              <>
                                <button onClick={() => handleTechUpdateTask(task.id, 'Cần hỗ trợ')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95">
                                  Yêu cầu hỗ trợ (Linh kiện)
                                </button>
                                <button onClick={() => handleTechUpdateTask(task.id, 'Chờ nghiệm thu')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">done_all</span> Sửa xong, Yêu cầu Quản lý xem
                                </button>
                              </>
                            )}
                            {task.status === 'Chờ nghiệm thu' && (
                              <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                                <span className="material-symbols-outlined">hourglass_top</span> Đang đợi Quản lý duyệt...
                              </span>
                            )}
                          </>
                        )}

                        {/* Hành động cho QUẢN LÝ */}
                        {isManager && (
                          <>
                            {task.status === 'Chờ nghiệm thu' ? (
                              <button onClick={() => handleManagerCompleteTask(task.id)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">verified</span>
                                Nghiệm thu Hoàn tất (Đã sửa xong)
                              </button>
                            ) : (
                              <span className="text-sm font-medium text-slate-400 italic">Kỹ thuật đang xử lý...</span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white/50 p-4 rounded-xl text-sm font-medium text-slate-600 whitespace-pre-line border border-slate-100">
                    <p className="font-bold text-slate-700 mb-1">Nội dung từ Quản lý:</p>
                    {task.description}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* MODAL BÁO LỖI (Dành cho Staff/Tech) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in z-50">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-rose-50">
              <h3 className="font-extrabold text-base text-rose-700 flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span>
                Báo cáo sự cố khẩn
              </h3>
              <button type="button" onClick={() => setShowReportModal(false)} className="p-1 hover:bg-rose-100 rounded-lg text-rose-700 transition-all">
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="p-6 space-y-5">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-start gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">info</span>
                <p className="text-xs font-medium text-blue-800">
                  Lưu ý: Báo cáo này sẽ được gửi trực tiếp lên Hộp thư của <strong className="font-bold">Quản lý chi nhánh</strong> để phân công xử lý.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Chọn Trạm hỏng</label>
                <select
                  required
                  value={reportData.stationId}
                  onChange={(e) => setReportData({...reportData, stationId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 text-sm font-bold text-slate-700"
                >
                  <option value="">-- Chọn Trạm --</option>
                  {stations.map(st => <option key={st.id} value={st.id}>{st.id} ({st.machine})</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tóm tắt sự cố</label>
                <input
                  required
                  type="text"
                  placeholder="VD: Máy kêu to, xịt nước yếu..."
                  value={reportData.issueName}
                  onChange={(e) => setReportData({...reportData, issueName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 text-sm font-bold text-slate-700"
                />
              </div>

              {isTechnical && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider ml-1">Dự đoán bộ phận hỏng (Dành cho Kỹ thuật)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Mòn dây curoa, Cháy motor..."
                    value={reportData.brokenPartSuggest}
                    onChange={(e) => setReportData({...reportData, brokenPartSuggest: e.target.value})}
                    className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm font-bold text-amber-800"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mô tả chi tiết</label>
                <textarea
                  required
                  placeholder="Mô tả cụ thể hiện tượng gặp phải..."
                  value={reportData.desc}
                  onChange={(e) => setReportData({...reportData, desc: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium h-24 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowReportModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:underline">Hủy</button>
                <button type="submit" className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95">
                  Gửi Hộp thư Quản lý
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DUYỆT BÁO CÁO (Dành cho Manager) */}
      {showReviewModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in z-50 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-[#001f3f]">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span className="material-symbols-outlined">assignment_add</span>
                Duyệt & Giao Task Kỹ thuật
              </h3>
              <button type="button" onClick={() => setShowReviewModal(false)} className="p-1 hover:bg-slate-700 rounded-lg text-slate-300 transition-all">
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Báo cáo từ {selectedReport.reportedBy}</p>
                <h4 className="font-bold text-slate-800 mb-1">{selectedReport.issueName}</h4>
                {selectedReport.brokenPartSuggest && (
                  <p className="text-sm font-bold text-rose-600 mt-1 mb-2">Chẩn đoán: {selectedReport.brokenPartSuggest}</p>
                )}
                <p className="text-sm text-slate-600">{selectedReport.desc}</p>
              </div>

              <form id="reviewForm" onSubmit={handleReviewReport} className="space-y-5">
                
                <label className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={reviewData.updateStationTable} 
                    onChange={(e) => setReviewData({...reviewData, updateStationTable: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div>
                    <p className="text-sm font-bold text-blue-800">Tự động cập nhật vào Bảng Trạm</p>
                    <p className="text-[10px] text-blue-600">Sẽ tự động khóa Trạm và ghi nhận bộ phận bị hư theo báo cáo.</p>
                  </div>
                </label>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phân loại & Mức độ</label>
                  <select
                    required
                    value={reviewData.priority}
                    onChange={(e) => setReviewData({...reviewData, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700"
                  >
                    <option value="Khẩn cấp">🔴 Khẩn cấp (Sửa ngay lập tức)</option>
                    <option value="Cao">🟠 Cao (Sửa trong ngày)</option>
                    <option value="Trung bình">🟡 Trung bình (Đưa vào lịch bảo trì)</option>
                    <option value="Thấp">🟢 Thấp (Chưa ảnh hưởng vận hành)</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Người đảm nhận</label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700"
                  >
                    <option value="team">Team Kỹ thuật chung (Ai rảnh nhận)</option>
                    <option value="tech1">Nguyễn Văn Kỹ Thuật (Đang trực)</option>
                    <option value="tech2">Trần Thợ Máy (Nghỉ ca)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Chỉ đạo từ Quản lý</label>
                  <textarea
                    placeholder="VD: Kiểm tra kỹ phần motor, nếu hỏng nặng thì báo giá anh ngay..."
                    value={reviewData.note}
                    onChange={(e) => setReviewData({...reviewData, note: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium h-24 resize-none"
                  />
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50">
              <button type="button" onClick={() => setShowReviewModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:underline">Hủy</button>
              <button type="submit" form="reviewForm" className="px-6 py-3 bg-[#001f3f] hover:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95">
                Xác nhận Giao Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL YÊU CẦU HỖ TRỢ (Cho Tech) */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSupportModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in z-50">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-amber-50">
              <h3 className="font-extrabold text-base text-amber-700 flex items-center gap-2">
                <span className="material-symbols-outlined">help_center</span>
                Yêu cầu hỗ trợ từ Quản lý
              </h3>
              <button type="button" onClick={() => setShowSupportModal(false)} className="p-1 hover:bg-amber-100 rounded-lg text-amber-700 transition-all">
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitSupport} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Loại hỗ trợ</label>
                <select
                  value={supportData.requestType}
                  onChange={(e) => setSupportData({...supportData, requestType: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm font-bold text-slate-700"
                >
                  <option value="Linh kiện">Cần cấp vật tư / Linh kiện thay thế</option>
                  <option value="Kinh phí">Cần duyệt kinh phí mua ngoài</option>
                  <option value="Thợ ngoài">Cần gọi thợ chuyên nghiệp bên ngoài</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nội dung / Số tiền đề xuất</label>
                <textarea
                  required
                  placeholder="VD: Đề xuất thay nguyên cụm motor giá 2tr, hoặc xin xuất kho 1 bơm áp lực..."
                  value={supportData.note}
                  onChange={(e) => setSupportData({...supportData, note: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium h-24 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowSupportModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:underline">Hủy</button>
                <button type="submit" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95">
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
