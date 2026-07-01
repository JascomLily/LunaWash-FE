import React, { useState } from 'react';
import toast from 'react-hot-toast';

// --- MOCK DATA ---
const mockEquipments = [
  { id: 'EQ-001', name: 'Máy rửa xe tự động Karcher', category: 'Máy rửa tự động', status: 'Hoạt động', lastMaintenance: '15/06/2026', nextMaintenance: '15/07/2026', priority: 'Bình thường', statusColor: 'border-emerald-200 text-emerald-700 bg-emerald-50' },
  { id: 'EQ-002', name: 'Máy nén khí Pegasus', category: 'Thiết bị phụ trợ', status: 'Lỗi', lastMaintenance: '10/06/2026', nextMaintenance: '10/07/2026', priority: 'Cao', statusColor: 'border-rose-200 text-rose-700 bg-rose-50' },
  { id: 'EQ-003', name: 'Hệ thống bơm áp lực', category: 'Hệ thống bơm', status: 'Cần kiểm tra', lastMaintenance: '01/06/2026', nextMaintenance: '01/07/2026', priority: 'Trung bình', statusColor: 'border-amber-200 text-amber-700 bg-amber-50' }
];

const mockTasks = [
  { id: 'TASK-101', name: 'Máy nén khí kêu to, tụt áp', equipmentId: 'EQ-002', equipmentName: 'Máy nén khí Pegasus', status: 'Chưa làm', description: 'Nhân viên báo máy nén khí kêu to thất thường, áp lực yếu không đủ bọt tuyết.', type: 'incident', requestedBy: 'Staff', createdAt: '01/07/2026 08:30' },
  { id: 'TASK-102', name: 'Bảo dưỡng định kỳ tháng 7', equipmentId: 'EQ-001', equipmentName: 'Máy rửa xe tự động Karcher', status: 'Đang làm', description: 'Tra dầu mỡ ray trượt, vệ sinh béc phun.', type: 'maintenance', requestedBy: 'Manager', createdAt: '01/07/2026 07:00' }
];

const mockReports = [
  { id: 'REP-089', issueName: 'Bơm nước yếu quá', eqId: 'EQ-003', eqName: 'Hệ thống bơm áp lực', reportedBy: 'Nhân viên CSX 1', role: 'Staff', desc: 'Sáng nay em bật máy thấy nước ra yếu xìu, không trôi được xà phòng sếp ơi.', time: '01/07/2026 10:00', status: 'Chờ xử lý' },
  { id: 'REP-090', issueName: 'Dây curoa bị mòn', eqId: 'EQ-001', eqName: 'Máy rửa xe tự động Karcher', reportedBy: 'Kỹ thuật A', role: 'TechnicalStaff', desc: 'Đi kiểm tra định kỳ phát hiện dây curoa số 2 bị mòn nặng, đề xuất thay sớm kẻo đứt.', time: '01/07/2026 09:30', status: 'Chờ xử lý' }
];

export default function TechnicalPage() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isManager = storedUser?.tier === 'BranchManager' || storedUser?.tier === 'Admin';
  const isTechnical = storedUser?.tier === 'TechnicalStaff';
  const isStaff = storedUser?.tier === 'Staff';
  
  // State for Demo
  const [equipments, setEquipments] = useState(mockEquipments);
  const [tasks, setTasks] = useState(mockTasks);
  const [reports, setReports] = useState(mockReports);
  
  // Default Tabs
  const getInitialTab = () => {
    if(isManager) return 'overview';
    if(isTechnical) return 'maintenance';
    return 'overview';
  }
  const [activeTab, setActiveTab] = useState(getInitialTab()); 

  // Modals
  const [showReportModal, setShowReportModal] = useState(false); // Cho Nhân viên / Kỹ thuật báo lỗi
  const [reportData, setReportData] = useState({ eqId: '', issueName: '', desc: '' });

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportData, setSupportData] = useState({ taskId: '', requestType: 'Linh kiện', note: '' });

  const [showReviewModal, setShowReviewModal] = useState(false); // Cho Quản lý duyệt báo cáo thành Task
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewData, setReviewData] = useState({ priority: 'Trung bình', note: '' });

  // 1. Gửi Báo cáo (Staff / Tech -> Manager)
  const handleSubmitReport = (e) => {
    e.preventDefault();
    if(!reportData.eqId || !reportData.issueName) return;
    
    const newReport = {
      id: `REP-${Math.floor(Math.random() * 1000)}`,
      issueName: reportData.issueName,
      eqId: reportData.eqId,
      eqName: equipments.find(eq => eq.id === reportData.eqId)?.name || '',
      reportedBy: storedUser?.name || 'Nhân viên',
      role: storedUser?.tier || 'Staff',
      desc: reportData.desc,
      time: new Date().toLocaleString('vi-VN'),
      status: 'Chờ xử lý'
    };

    setReports([newReport, ...reports]);
    toast.success("Đã gửi báo cáo lên Hộp thư của Quản lý!");
    setShowReportModal(false);
    setReportData({ eqId: '', issueName: '', desc: '' });
  };

  // 2. Quản lý duyệt Báo cáo & Tạo Task
  const handleReviewReport = (e) => {
    e.preventDefault();
    
    // Đổi trạng thái Report
    setReports(reports.map(r => r.id === selectedReport.id ? { ...r, status: 'Đã giao Task' } : r));
    
    // Tạo Task mới cho Kỹ thuật
    const newTask = {
      id: `TASK-${Math.floor(Math.random() * 1000)}`,
      name: selectedReport.issueName,
      equipmentId: selectedReport.eqId,
      equipmentName: selectedReport.eqName,
      status: 'Chưa làm',
      description: `[Từ báo cáo của ${selectedReport.reportedBy} - Mức độ: ${reviewData.priority}] - ${selectedReport.desc} \n\nGhi chú của Quản lý: ${reviewData.note}`,
      type: 'incident',
      requestedBy: 'Manager',
      createdAt: new Date().toLocaleString('vi-VN')
    };
    
    setTasks([newTask, ...tasks]);
    toast.success("Đã duyệt báo cáo và giao Task cho Kỹ thuật!");
    setShowReviewModal(false);
  };

  // 3. Kỹ thuật cập nhật trạng thái Task
  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    toast.success(`Đã cập nhật trạng thái: ${newStatus}`);
    
    if(newStatus === 'Cần hỗ trợ') {
      setSupportData({ taskId: taskId, requestType: 'Linh kiện', note: '' });
      setShowSupportModal(true);
    }
  };

  const handleSubmitSupport = (e) => {
    e.preventDefault();
    toast.success(`Đã gửi yêu cầu cấp ${supportData.requestType} lên Quản lý!`);
    setShowSupportModal(false);
  };

  const incidentTasks = tasks.filter(t => t.type === 'incident');
  const pendingReportsCount = reports.filter(r => r.status === 'Chờ xử lý').length;

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
              {isStaff ? 'Xem tình trạng máy và báo cáo sự cố' : 
               isTechnical ? 'Quy trình bảo trì và xử lý sự cố thiết bị' : 
               'Theo dõi tổng quan tình trạng thiết bị tại chi nhánh'}
            </p>
          </div>
          
          <button 
            onClick={() => {
              setReportData({ eqId: '', issueName: '', desc: '' });
              setShowReportModal(true);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-lg transition-all active:scale-95 shadow-md ${
              isManager ? 'bg-[#001f3f] text-white hover:bg-slate-800 hidden' : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            {!isManager && (
              <>
                <span className="material-symbols-outlined text-xl">warning</span>
                Báo cáo sự cố khẩn
              </>
            )}
          </button>
        </div>

        {/* TABS CHO KỸ THUẬT VIÊN */}
        {isTechnical && (
          <div className="flex gap-4 border-b border-slate-200">
            <button 
              className={`pb-3 px-4 font-bold text-sm transition-colors ${activeTab === 'maintenance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('maintenance')}
            >
              Bảo trì hằng ngày
            </button>
            <button 
              className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === 'incidents' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('incidents')}
            >
              Xử lý sự cố
              {incidentTasks.filter(t => t.status !== 'Hoàn thành').length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  {incidentTasks.filter(t => t.status !== 'Hoàn thành').length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* TABS CHO QUẢN LÝ */}
        {isManager && (
          <div className="flex gap-4 border-b border-slate-200">
            <button 
              className={`pb-3 px-4 font-bold text-sm transition-colors ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              Tổng quan Thiết bị
            </button>
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
          </div>
        )}

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
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tổng thiết bị</span>
                  </div>
                  <p className="text-[2.5rem] font-black text-slate-800 leading-none">03</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 rounded-full p-1 text-sm">check_circle</span>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Hoạt động</span>
                  </div>
                  <p className="text-[2.5rem] font-black text-emerald-600 leading-none">01</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-600 bg-rose-50 rounded-full p-1 text-sm">error</span>
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">Đang lỗi</span>
                  </div>
                  <p className="text-[2.5rem] font-black text-rose-600 leading-none">01</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 bg-blue-50 rounded-full p-1 text-sm">assignment</span>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Task Đang xử lý</span>
                  </div>
                  <p className="text-[2.5rem] font-black text-blue-600 leading-none">{incidentTasks.length}</p>
                </div>
              </div>
            )}

            {/* DANH SÁCH THIẾT BỊ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-700">Danh sách Thiết bị / Máy móc</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mã thiết bị</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tên thiết bị</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                      {(isManager || isTechnical) && (
                        <>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bảo trì gần nhất</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lịch tiếp theo</th>
                        </>
                      )}
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {equipments.map((eq) => (
                      <tr key={eq.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4"><span className="text-xs font-black text-slate-800">{eq.id}</span></td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{eq.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{eq.category}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border select-none ${eq.statusColor}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {eq.status}
                          </span>
                        </td>
                        {(isManager || isTechnical) && (
                          <>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-600">{eq.lastMaintenance}</td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-600">{eq.nextMaintenance}</td>
                          </>
                        )}
                        <td className="px-6 py-4 text-center">
                          {isManager ? (
                            <button className="text-slate-400 hover:text-blue-600 p-2 rounded-full transition-all" title="Cập nhật thông số">
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                setReportData({ eqId: eq.id, issueName: '', desc: '' });
                                setShowReportModal(true);
                              }}
                              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-full transition-all font-bold text-xs flex items-center justify-center gap-1 mx-auto"
                            >
                              <span className="material-symbols-outlined text-lg">report</span>
                              Báo lỗi
                            </button>
                          )}
                        </td>
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
                        <span className="material-symbols-outlined text-[16px] text-blue-500">precision_manufacturing</span>
                        Thiết bị: <strong className="text-slate-700">{rep.eqName}</strong>
                      </p>
                      
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
                            setReviewData({ priority: 'Trung bình', note: '' });
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

        {/* VIEW 3: XỬ LÝ SỰ CỐ (Chỉ Technical) */}
        {activeTab === 'incidents' && isTechnical && (
          <div className="space-y-4">
            {incidentTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">check_circle</span>
                <p className="text-slate-500 font-medium">Hiện không có sự cố nào cần xử lý!</p>
              </div>
            ) : (
              incidentTasks.map(task => (
                <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:border-blue-300 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase tracking-wider ${
                          task.status === 'Chưa làm' ? 'bg-slate-100 text-slate-600' :
                          task.status === 'Đang làm' ? 'bg-blue-100 text-blue-700' :
                          task.status === 'Cần hỗ trợ' ? 'bg-amber-100 text-amber-700' :
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
                        <span className="material-symbols-outlined text-[16px] text-blue-500">precision_manufacturing</span>
                        Thiết bị: <strong className="text-slate-700">{task.equipmentName}</strong> ({task.equipmentId})
                      </p>
                    </div>
                    
                    {/* Hành động cập nhật */}
                    {task.status !== 'Hoàn thành' && (
                      <div className="flex flex-wrap items-center gap-2">
                        {task.status === 'Chưa làm' && (
                          <button onClick={() => handleUpdateTaskStatus(task.id, 'Đang làm')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95">
                            Bắt đầu sửa
                          </button>
                        )}
                        {(task.status === 'Đang làm' || task.status === 'Cần hỗ trợ') && (
                          <>
                            <button onClick={() => handleUpdateTaskStatus(task.id, 'Cần hỗ trợ')} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95">
                              Yêu cầu hỗ trợ (Linh kiện/Kinh phí)
                            </button>
                            <button onClick={() => handleUpdateTaskStatus(task.id, 'Hoàn thành')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95">
                              Xác nhận Hoàn thành
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl text-sm font-medium text-slate-600 whitespace-pre-line">
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
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Thiết bị hỏng</label>
                <select
                  required
                  value={reportData.eqId}
                  onChange={(e) => setReportData({...reportData, eqId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 text-sm font-bold text-slate-700"
                >
                  <option value="">-- Chọn thiết bị --</option>
                  {equipments.map(eq => <option key={eq.id} value={eq.id}>{eq.name} ({eq.id})</option>)}
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
              {/* Nội dung báo cáo cũ */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Báo cáo từ {selectedReport.reportedBy}</p>
                <h4 className="font-bold text-slate-800 mb-1">{selectedReport.issueName}</h4>
                <p className="text-sm text-slate-600">{selectedReport.desc}</p>
              </div>

              <form id="reviewForm" onSubmit={handleReviewReport} className="space-y-5">
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
