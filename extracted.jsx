import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function TechnicalPage() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const getUserIdFromToken = (token) => {
    try {
      if(!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).sub;
    } catch(e) { return null; }
  };
  
  const currentUserId = storedUser.id || getUserIdFromToken(storedUser.token);
  const isManager = storedUser?.role === 'BranchManager' || storedUser?.role === 'Admin';
  const isTechnical = storedUser?.role === 'TechnicalStaff';
  const isStaff = storedUser?.role === 'Staff';
  
  const bId = storedUser?.branchId || 'BRN-Q1-01';

  const getInitialTab = () => {
    if(isManager) return 'overview';
    if(isTechnical) return 'incidents';
    return 'overview';
  };

  const [stations, setStations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  
  const [activeTab, setActiveTab] = useState(getInitialTab()); 
  const [techTab, setTechTab] = useState('my-tasks'); // 'my-tasks' | 'pool'

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ stationId: '', issueName: '', desc: '', brokenPartSuggest: '' });
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewData, setReviewData] = useState({ priority: 'Trung bình', note: '', updateStationTable: true });

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTask, setRejectTask] = useState(null);
  const [rejectNote, setRejectNote] = useState('');

  // Lấy dữ liệu API
  const fetchData = async () => {
    if (!storedUser?.token) return;
    const headers = { 'Authorization': `Bearer ${storedUser.token}` };
    
    try {
      // 1. Lấy Stations
      const resEq = await fetch(import.meta.env.VITE_API_URL + '/api/Equipments/branch/' + bId, { headers });
      if (resEq.ok) {
        const data = await resEq.json();
        setStations(data.equipments.map(e => ({
          id: e.id, machine: e.name, status: e.status,
          brokenPart: e.brokenPart || '', lastFixed: e.lastMaintenance ? new Date(e.lastMaintenance).toLocaleDateString('vi-VN') : 'Không rõ',
          statusColor: e.status === 'Tốt' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 
                       e.status === 'Đang bảo trì' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                       'border-rose-200 text-rose-700 bg-rose-50'
        })));
      }

      // 2. Lấy Tasks (Cho Manager & Tech)
      if (isManager || isTechnical) {
        const resTasks = await fetch(import.meta.env.VITE_API_URL + '/api/Maintenance/branch/' + bId, { headers });
        if (resTasks.ok) {
          const data = await resTasks.json();
          setTasks(data.map(t => ({
             id: t.id, name: t.taskName, stationId: t.equipmentId || 'Không rõ', machineName: t.equipmentName || 'Máy rửa xe',
             status: t.status, description: t.description, type: 'incident', requestedBy: 'Manager', createdAt: new Date(t.createdAt).toLocaleString('vi-VN'),
             assigneeId: t.assigneeId, reviewNote: t.reviewNote
          })));
        }
      }

      // 3. Lấy Reports
      if (isManager || isStaff) {
        const resInc = await fetch(import.meta.env.VITE_API_URL + '/api/Incidents/branch/' + bId, { headers });
        if (resInc.ok) {
          const data = await resInc.json();
          setReports(data.map(r => ({
            id: r.id, stationId: r.equipmentId, machineName: r.equipmentName || 'Trạm rửa',
            issueName: 'Báo cáo sự cố', desc: r.description,
            reportedBy: r.reporterName || 'Nhân viên', role: 'Staff',
            time: new Date(r.createdAt).toLocaleString('vi-VN'), status: r.status,
            brokenPartSuggest: ''
          })));
        }
      }
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const incidentTasks = tasks.filter(t => t.type === 'incident');
  const myTasks = incidentTasks.filter(t => t.assigneeId === currentUserId);
  const unassignedTasks = incidentTasks.filter(t => !t.assigneeId && t.status === 'Chưa làm');

  // Quản lý Nghiệm thu
  const handleManagerCompleteTask = async (taskId) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/Maintenance/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedUser.token}` },
        body: JSON.stringify({ status: 'Hoàn thành' })
      });
      if (response.ok) {
        toast.success("Nghiệm thu thành công! Trạm đã được cập nhật thành 'Tốt'.");
        fetchData();
      } else {
        toast.error("Lỗi khi nghiệm thu");
      }
    } catch(err) {
      toast.error("Lỗi kết nối API");
    }
  };

  // Quản lý Từ chối Nghiệm thu
  const submitRejectTask = async (e) => {
    e.preventDefault();
    if(!rejectTask) return;
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/Maintenance/${rejectTask.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedUser.token}` },
        body: JSON.stringify({ status: 'Từ chối nghiệm thu', reviewNote: rejectNote })
      });
      if (response.ok) {
        toast.success("Đã từ chối nghiệm thu và trả lại cho Kỹ thuật!");
        setShowRejectModal(false);
        setRejectTask(null);
        setRejectNote('');
        fetchData();
      } else {
        toast.error("Lỗi khi từ chối nghiệm thu");
      }
    } catch(err) {
      toast.error("Lỗi kết nối API");
    }
  };

  // Tech cập nhật trạng thái Task
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/Maintenance/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedUser.token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        toast.success(`Cập nhật task thành "${newStatus}" thành công!`);
        fetchData();
      } else {
        toast.error("Lỗi cập nhật trạng thái");
      }
    } catch(err) {
      toast.error("Lỗi kết nối API");
    }
  };

  // Nhận việc
  const claimTask = async (taskId) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/Maintenance/${taskId}/assign`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${storedUser.token}` }
      });
      if (response.ok) {
        toast.success("Nhận việc thành công!");
        fetchData();
      } else {
        toast.error("Không thể nhận việc này. Có thể ai đó đã nhận rồi.");
      }
    } catch (err) {
      toast.error("Lỗi hệ thống");
    }
  };

  // Staff Báo Cáo
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/Incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedUser.token}` },
        body: JSON.stringify({
          branchId: bId,
          equipmentId: reportData.stationId,
          description: reportData.desc
        })
      });
      if (response.ok) {
        toast.success("Đã gửi báo cáo sự cố thành công!");
        setShowReportModal(false);
        setReportData({ stationId: '', issueName: '', desc: '', brokenPartSuggest: '' });
        fetchData();
      } else {
        toast.error("Lỗi gửi báo cáo");
      }
    } catch (err) {
      toast.error("Lỗi kết nối");
    }
  };

  // Manager Duyệt báo cáo
  const handleReviewReport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/api/Incidents/${selectedReport.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedUser.token}` },
        body: JSON.stringify({ status: 'Đã giải quyết' }) // Actually, this should just create a Task. For now, mark as resolved if converted to task. Wait, LunaWash BE expects status update to create tasks? Actually we can call Maintenance Create.
      });
      
      const createResponse = await fetch(import.meta.env.VITE_API_URL + '/api/Maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedUser.token}` },
        body: JSON.stringify({
          branchId: bId,
          equipmentId: selectedReport.stationId,
          taskName: 'Xử lý sự cố: ' + selectedReport.desc,
          description: reviewData.note,
          priority: reviewData.priority === 'Khẩn cấp' ? 'High' : (reviewData.priority === 'Cao' ? 'High' : 'Medium'),
          incidentReportId: selectedReport.id
        })
      });

      if (createResponse.ok) {
        toast.success("Duyệt báo cáo và tạo Task thành công!");
        setShowReviewModal(false);
        fetchData();
      } else {
        toast.error("Lỗi tạo Task");
      }
    } catch (err) {
      toast.error("Lỗi kết nối");
    }
  };

  return (
    <main className="pt-24 pb-12 bg-slate-50 min-h-screen px-4 md:px-margin-desktop font-title-sm text-slate-700">
      <div className="max-w-container-max mx-auto animate-fade-in">
        
        {/* HEADER & QUAN LY TABS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
              {isManager ? 'Quản lý Trạm & Bảo trì' : isTechnical ? 'Khu vực Kỹ Thuật' : 'Báo cáo Sự cố'}
            </h1>
            <p className="text-slate-500 font-medium mt-1">Chi nhánh: <strong className="text-blue-600">{bId}</strong></p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 overflow-x-auto w-full md:w-auto">
            {isManager && (
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-[#001f3f] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Tổng quan Trạm
              </button>
            )}
            {(isManager || isTechnical) && (
              <button 
                onClick={() => setActiveTab('incidents')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'incidents' ? 'bg-[#001f3f] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Xử lý Sự cố 
                {incidentTasks.length > 0 && <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{incidentTasks.length}</span>}
              </button>
            )}
            {(isManager || isStaff) && (
              <button 
                onClick={() => setActiveTab('reports')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'reports' ? 'bg-[#001f3f] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Hộp thư Báo cáo
                {reports.filter(r => r.status === 'Chờ xử lý').length > 0 && <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{reports.filter(r => r.status === 'Chờ xử lý').length}</span>}
              </button>
            )}
          </div>
          
          {isStaff && (
            <button 
              onClick={() => setShowReportModal(true)}
              className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white text-sm font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">campaign</span>
              Báo cáo khẩn
            </button>
          )}
        </div>

        {/* VIEW 1: OVERVIEW & THỐNG KÊ (Manager Only) */}
        {activeTab === 'overview' && isManager && (
          <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500 bg-blue-50 rounded-full p-1 text-sm">ev_station</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tổng số trạm</span>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-black text-slate-800 leading-none">{stations.length}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500 bg-emerald-50 rounded-full p-1 text-sm">check_circle</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Hoạt động tốt</span>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-black text-emerald-600 leading-none">{stations.filter(st => st.status === 'Tốt').length}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-50 rounded-full"></div>
                <div className="flex items-center gap-2 relative z-10">
                  <span className="material-symbols-outlined text-rose-500 bg-rose-100 rounded-full p-1 text-sm">warning</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Đang hỏng / Chờ sửa</span>
                </div>
                <div className="flex items-end justify-between relative z-10">
                  <p className="text-4xl font-black text-rose-600 leading-none">{stations.filter(st => st.status !== 'Tốt').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-extrabold text-slate-700 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">format_list_bulleted</span>
                  DANH SÁCH THIẾT BỊ (TRẠM)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-3 font-bold">Trạm</th>
                      <th className="px-6 py-3 font-bold">Hệ thống máy</th>
                      <th className="px-6 py-3 font-bold">Trạng thái</th>
                      <th className="px-6 py-3 font-bold">Ngày sửa cuối</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stations.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700 text-sm">{st.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{st.machine}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border select-none ${st.statusColor}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {st.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">{st.lastFixed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: XỬ LÝ SỰ CỐ / THEO DÕI TASK (Tech / Manager) */}
        {activeTab === 'incidents' && (
          <div className="animate-fade-in space-y-6">
            {/* TABS CON CỦA TECH */}
            {isTechnical && (
              <div className="flex bg-slate-100 p-1 rounded-xl mb-4 w-fit shadow-inner">
                <button 
                  onClick={() => setTechTab('my-tasks')}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${techTab === 'my-tasks' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Việc của tôi 
                  <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">{myTasks.length}</span>
                </button>
                <button 
                  onClick={() => setTechTab('pool')}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${techTab === 'pool' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Việc chung
                  <span className="ml-2 bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[10px]">{unassignedTasks.length}</span>
                </button>
              </div>
            )}

            {/* DANH SÁCH TASK CHÍNH */}
            {(!isTechnical || techTab === 'my-tasks') && (
              <div className="space-y-4">
                {isTechnical && (
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500">person</span>
                    Việc của tôi đang xử lý
                  </h2>
                )}
                {((isTechnical ? myTasks : incidentTasks).length === 0) ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">check_circle</span>
                    <p className="text-slate-500 font-medium">Hiện không có sự cố nào cần xử lý!</p>
                  </div>
                ) : (
                  (isTechnical ? myTasks : incidentTasks).map(task => (
                    <div key={task.id} className={`bg-white rounded-2xl shadow-sm border p-5 transition-colors ${task.status === 'Chờ nghiệm thu' ? 'border-emerald-300 bg-emerald-50/30' : task.status === 'Từ chối nghiệm thu' ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-blue-300'}`}>
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase tracking-wider ${
                              task.status === 'Chưa làm' ? 'bg-slate-100 text-slate-600' :
                              task.status === 'Đang làm' ? 'bg-blue-100 text-blue-700' :
                              task.status === 'Chờ nghiệm thu' ? 'bg-emerald-500 text-white animate-pulse' :
                              task.status === 'Từ chối nghiệm thu' ? 'bg-rose-500 text-white' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {task.status}
                            </span>
                            <span className="text-xs font-bold text-slate-400"># {task.id}</span>
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span> {task.createdAt}
                            </span>
                          </div>
                          <h3 className="text-lg font-extrabold text-slate-800 mt-2">{task.name}</h3>
                          <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-blue-500">ev_station</span>
                            Trạm: <strong className="text-slate-700">{task.stationId}</strong> ({task.machineName})
                          </p>
                        </div>

                        {/* Các nút hành động */}
                        {isTechnical ? (
                          <div className="flex flex-wrap gap-2">
                            {(task.status === 'Chưa làm' || task.status === 'Từ chối nghiệm thu') && (
                              <button onClick={() => updateTaskStatus(task.id, 'Đang làm')} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95">
                                <span className="material-symbols-outlined text-lg">play_arrow</span>
                                Bắt đầu sửa
                              </button>
                            )}
                            {task.status === 'Đang làm' && (
                              <button onClick={() => updateTaskStatus(task.id, 'Chờ nghiệm thu')} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95">
                                <span className="material-symbols-outlined text-lg">done_all</span>
                                Hoàn tất, Gửi nghiệm thu
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            {task.status === 'Chờ nghiệm thu' ? (
                              <div className="flex items-center gap-2">
                                <button onClick={() => { setRejectTask(task); setShowRejectModal(true); }} className="px-5 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-sm font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-lg">cancel</span>
                                  Từ chối
                                </button>
                                <button onClick={() => handleManagerCompleteTask(task.id)} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2">
                                  <span className="material-symbols-outlined text-lg">verified</span>
                                  Duyệt Nghiệm thu
                                </button>
                              </div>
                            ) : task.status === 'Hoàn thành' ? (
                              <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined">check_circle</span> Đã nghiệm thu
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium text-sm italic">
                                {task.status === 'Từ chối nghiệm thu' ? 'Kỹ thuật đang sửa lại...' : 'Đang chờ Kỹ thuật...'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-xl text-sm font-medium text-slate-600 whitespace-pre-line border border-slate-100">
                        <p className="font-bold text-slate-700 mb-1">Nội dung / Chỉ đạo:</p>
                        {task.description}
                      </div>

                      {task.reviewNote && task.status === 'Từ chối nghiệm thu' && (
                        <div className="mt-4 bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-start gap-3">
                           <span className="material-symbols-outlined text-rose-500 text-xl">error</span>
                           <div>
                             <p className="font-bold text-rose-700 mb-1">Quản lý từ chối nghiệm thu:</p>
                             <p className="text-sm font-medium text-rose-600 whitespace-pre-line">{task.reviewNote}</p>
                           </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* VÙNG CHỨA VIỆC CHUNG */}
            {isTechnical && techTab === 'pool' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">list_alt</span>
                  Bể công việc chung chưa ai nhận
                </h2>
                {unassignedTasks.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">coffee</span>
                    <p className="text-slate-500 font-medium">Tuyệt vời! Không còn việc chung nào tồn đọng.</p>
                  </div>
                ) : (
                  unassignedTasks.map(task => (
                    <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 p-5 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="px-2.5 py-1 text-[10px] font-black rounded-md uppercase tracking-wider bg-rose-100 text-rose-700">
                              Cần người nhận
                            </span>
                            <span className="text-xs font-bold text-slate-400"># {task.id}</span>
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span> {task.createdAt}
                            </span>
                          </div>
                          <h3 className="text-lg font-extrabold text-slate-800 mt-2">{task.name}</h3>
                          <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px] text-blue-500">ev_station</span>
                            Trạm: <strong className="text-slate-700">{task.stationId}</strong> ({task.machineName})
                          </p>
                        </div>
                        <button onClick={() => claimTask(task.id)} className="px-5 py-2.5 bg-[#001f3f] hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2 self-start md:self-center">
                          <span className="material-symbols-outlined text-lg">pan_tool</span>
                          Nhận việc này
                        </button>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl text-sm font-medium text-slate-600 whitespace-pre-line border border-slate-100">
                        <p className="font-bold text-slate-700 mb-1">Mô tả sự cố:</p>
                        {task.description}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: HỘP THƯ BÁO CÁO */}
        {activeTab === 'reports' && (isManager || isStaff) && (
          <div className="space-y-4 animate-fade-in">
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
                    
                    <div className="flex items-center gap-2 self-start md:self-center mt-2 md:mt-0">
                      {rep.status === 'Chờ xử lý' ? (
                        isManager ? (
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
                          <span className="text-sm font-medium text-slate-400 italic">Đang chờ Quản lý duyệt...</span>
                        )
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
      </div>

      {/* MODAL TỪ CHỐI NGHIỆM THU */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRejectModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in z-50">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-rose-50">
              <h3 className="font-extrabold text-base text-rose-700 flex items-center gap-2">
                <span className="material-symbols-outlined">cancel</span>
                Từ chối nghiệm thu
              </h3>
              <button type="button" onClick={() => setShowRejectModal(false)} className="p-1 hover:bg-rose-100 rounded-lg text-rose-700 transition-all">
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>
            <form onSubmit={submitRejectTask} className="p-6 space-y-4">
              <p className="text-sm font-medium text-slate-600">
                Hãy cho biết lý do từ chối để Kỹ thuật viên khắc phục lại:
              </p>
              <textarea
                required
                autoFocus
                placeholder="VD: Máy bơm vẫn còn kêu, vui lòng siết lại ốc..."
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium h-28 resize-none"
              />
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowRejectModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:underline">Hủy</button>
                <button type="submit" className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95">
                  Xác nhận Từ chối
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DUYỆT BÁO CÁO (Manager) */}
      {showReviewModal && selectedReport && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in z-50">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-[#001f3f]">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-300">verified_user</span>
                Duyệt báo cáo & Tạo Task
              </h3>
              <button onClick={() => setShowReviewModal(false)} className="p-1 hover:bg-white/10 rounded-lg text-white transition-all">
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>
            
            <form id="reviewForm" onSubmit={handleReviewReport} className="p-6 space-y-5">
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Chỉ đạo từ Quản lý</label>
                <textarea
                  required
                  placeholder="VD: Kiểm tra kỹ phần motor..."
                  value={reviewData.note}
                  onChange={(e) => setReviewData({...reviewData, note: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium h-24 resize-none"
                />
              </div>
            </form>
            
            <div className="flex justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50">
              <button type="button" onClick={() => setShowReviewModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:underline">Hủy</button>
              <button type="submit" form="reviewForm" className="px-6 py-3 bg-[#001f3f] hover:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95">
                Tạo Task Giao Việc
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BÁO LỖI (Staff) */}
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Chọn trạm đang hỏng</label>
                <select
                  required
                  value={reportData.stationId}
                  onChange={(e) => setReportData({...reportData, stationId: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-slate-700"
                >
                  <option value="" disabled>-- Chọn trạm --</option>
                  {stations.map(st => (
                    <option key={st.id} value={st.id}>{st.id} - {st.machine}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mô tả tình trạng</label>
                <textarea
                  required
                  placeholder="Mô tả ngắn gọn sự cố để quản lý nắm tình hình..."
                  value={reportData.desc}
                  onChange={(e) => setReportData({...reportData, desc: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium h-24 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowReportModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:underline">Hủy</button>
                <button type="submit" className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-95 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">send</span>
                  Gửi báo cáo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
