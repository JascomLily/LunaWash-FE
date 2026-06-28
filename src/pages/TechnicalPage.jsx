import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function TechnicalPage() {
  const [equipments, setEquipments] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [incidentEqId, setIncidentEqId] = useState('');
  const [incidentPriority, setIncidentPriority] = useState('Bình thường');
  const [incidentDesc, setIncidentDesc] = useState('');

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isReadOnly = storedUser?.tier !== 'BranchManager';

  // Report Modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportEqId, setReportEqId] = useState('');
  const [reportIssueName, setReportIssueName] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportStatus, setReportStatus] = useState('Cần kiểm tra');
  const [reportTaskStatus, setReportTaskStatus] = useState('Cần kiểm tra');

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const branchId = storedUser?.branchId || 'BR-HCM-01';
  const baseUrl = `${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5010`}/api/equipments`;

  const fetchData = async () => {
    try {
      await fetch(`${baseUrl}/seed?branchId=${branchId}`, { method: 'POST' });
      const res = await fetch(`${baseUrl}/branch/${branchId}`);
      if (res.ok) {
        const data = await res.json();
        setEquipments(data.equipments || []);
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. Toggle Task Status
  const toggleTaskStatus = async (id) => {
    if (isReadOnly) return;
    try {
      const res = await fetch(`${baseUrl}/tasks/${id}/toggle?branchId=${branchId}`, { method: 'PUT' });
      if (res.ok) {
        fetchData();
        toast.success("Đổi trạng thái công việc thành công");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Change Priority Status
  const handleChangePriority = async (id, newPriority) => {
    if (isReadOnly) return;
    try {
      const res = await fetch(`${baseUrl}/${id}/priority?branchId=${branchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority })
      });
      if (res.ok) {
        fetchData();
        toast.success("Đã lưu ưu tiên mới");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Change Next Maintenance Date
  const handleChangeNextDate = async (id, newDateStr) => {
    if (isReadOnly) return;
    if (!newDateStr) return;
    const [year, month, day] = newDateStr.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    try {
      const res = await fetch(`${baseUrl}/${id}/schedule?branchId=${branchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextMaintenance: formattedDate })
      });
      if (res.ok) {
        fetchData();
        toast.success("Đã lưu ngày bảo trì");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 2. Change Equipment Status
  const handleChangeEqStatus = async (id) => {
    if (isReadOnly) return;
    const eq = equipments.find(e => e.id === id);
    if (!eq) return;

    const states = ['Hoạt động', 'Cần kiểm tra', 'Đang bảo trì', 'Lỗi'];
    const currIdx = states.indexOf(eq.status);
    const nextStatus = states[(currIdx + 1) % states.length];

    try {
      const res = await fetch(`${baseUrl}/${id}/status?branchId=${branchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchData();
        toast.success("Cập nhật trạng thái thành công");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Handle Submit Incident Ticket
  const handleCreateIncident = async (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!incidentEqId || !incidentDesc) return;
    
    try {
      const res = await fetch(`${baseUrl}/incidents?branchId=${branchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: incidentEqId,
          priority: incidentPriority,
          description: incidentDesc
        })
      });

      if (res.ok) {
        fetchData();
        toast.success("Tạo phiếu sự cố thành công");
        setShowModal(false);
        setIncidentEqId('');
        setIncidentDesc('');
        setIncidentPriority('Bình thường');
      } else {
        toast.error("Lỗi khi tạo phiếu");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối server");
    }
  };

  const handleOpenReport = (eqId) => {
    const eq = equipments.find(e => e.id === eqId);
    setReportEqId(eqId);
    setReportIssueName(`Báo cáo: ${eq?.name || eqId}`);
    setReportDesc('');
    setReportStatus(eq ? eq.status : 'Cần kiểm tra');
    setReportTaskStatus('Cần kiểm tra');
    setShowReportModal(true);
  };

  const handleOpenDetail = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleChangeTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${baseUrl}/tasks/${taskId}/status?branchId=${branchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData();
        toast.success("Cập nhật trạng thái báo cáo thành công");
        setSelectedTask(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!reportEqId || !reportDesc) return;
    
    try {
      const res = await fetch(`${baseUrl}/${reportEqId}/report?branchId=${branchId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueName: reportIssueName, description: reportDesc, status: reportStatus, taskStatus: reportTaskStatus })
      });

      if (res.ok) {
        fetchData();
        toast.success("Gửi báo cáo thành công");
        setShowReportModal(false);
        setReportEqId('');
        setReportIssueName('');
        setReportDesc('');
      } else {
        toast.error("Lỗi khi gửi báo cáo");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối server");
    }
  };

  // Tính toán số lượng thống kê động dựa vào state
  const totalEq = equipments.length;
  const countActive = equipments.filter(eq => eq.status === 'Hoạt động').length;
  const countWarning = equipments.filter(eq => eq.status === 'Cần kiểm tra').length;
  const countError = equipments.filter(eq => eq.status === 'Lỗi').length;

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-28 pb-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">Kỹ thuật thiết bị</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full">
                Chi nhánh Bình Thạnh
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Theo dõi tình trạng, lịch bảo trì và sự cố thiết bị tại chi nhánh
            </p>
          </div>
          {!isReadOnly && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#001f3f] text-white font-bold rounded-lg hover:bg-slate-800 transition-all active:scale-95 shadow-md"
            >
              <span className="material-symbols-outlined text-xl">add_circle</span>
              Tạo phiếu sự cố
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT: STATS */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-xl">precision_manufacturing</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tổng thiết bị</span>
              </div>
              <p className="text-[2.5rem] font-black text-slate-800 leading-none">{totalEq.toString().padStart(2, '0')}</p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 rounded-full p-1 text-sm">check_circle</span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Hoạt động</span>
              </div>
              <p className="text-[2.5rem] font-black text-emerald-600 leading-none">{countActive.toString().padStart(2, '0')}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 bg-amber-50 rounded-full p-1 text-sm">build</span>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">Cần kiểm tra</span>
              </div>
              <p className="text-[2.5rem] font-black text-amber-500 leading-none">{countWarning.toString().padStart(2, '0')}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between h-32">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600 bg-rose-50 rounded-full p-1 text-sm">error</span>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">Khẩn cấp</span>
              </div>
              <p className="text-[2.5rem] font-black text-rose-600 leading-none">{countError.toString().padStart(2, '0')}</p>
            </div>
          </div>

          {/* RIGHT: TODAY TASKS -> REPORTS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-full">
            <div className="flex items-center gap-2 text-slate-700 mb-4 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-lg">assignment</span>
              <h3 className="font-bold text-sm">Danh sách Báo cáo</h3>
            </div>
            <ul className="space-y-4 h-[250px] overflow-y-auto pr-2">
              {tasks.length === 0 && (
                <p className="text-xs text-slate-400 italic">Không có báo cáo nào.</p>
              )}
              {tasks.map((task) => (
                <li key={task.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 bg-slate-300"></div>
                  <div 
                    className="cursor-pointer group flex-1"
                    onClick={() => handleOpenDetail(task)}
                    title="Nhấn để xem chi tiết"
                  >
                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{task.name}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5"><span className="material-symbols-outlined text-[12px] align-middle mr-1">precision_manufacturing</span>{task.equipmentName || task.equipmentId}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* DATA TABLE SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input 
                  type="text" 
                  placeholder="Tìm mã hoặc tên thiết bị..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 w-64"
                />
              </div>
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
                Tất cả trạng thái
              </button>
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
                Ưu tiên: Tất cả
              </button>
            </div>
            <p className="text-xs text-slate-400">Hiển thị {equipments.length} / {equipments.length} kết quả</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mã thiết bị</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tên thiết bị</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bảo trì gần nhất</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lịch tiếp theo</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ưu tiên</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipments.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-slate-800">{eq.id}</span>
                    </td>
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
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                      {eq.lastMaintenance}
                    </td>
                    <td className={`px-6 py-4 text-xs font-semibold text-slate-600 relative group ${isReadOnly ? '' : 'cursor-pointer hover:bg-blue-50/50'} transition-colors`} title={isReadOnly ? '' : 'Nhấn để đổi ngày'}>
                      <div className="flex items-center gap-2">
                        <span className={eq.nextMaintenanceColor || ''}>{eq.nextMaintenance}</span>
                        <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">edit_calendar</span>
                      </div>
                      <input 
                        type="date"
                        onChange={(e) => handleChangeNextDate(eq.id, e.target.value)}
                        disabled={isReadOnly}
                        className={`absolute inset-0 opacity-0 ${isReadOnly ? 'cursor-default' : 'cursor-pointer'} w-full h-full`}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={eq.priority}
                        onChange={(e) => handleChangePriority(eq.id, e.target.value)}
                        disabled={isReadOnly}
                        className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold outline-none border-none appearance-none text-center ${eq.priorityColor} ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <option value="Bình thường" className="text-slate-600 bg-white">Bình thường</option>
                        <option value="Trung bình" className="text-sky-700 bg-white">Trung bình</option>
                        <option value="Cao" className="text-blue-700 bg-white">Cao</option>
                        <option value="Khẩn cấp" className="text-rose-600 bg-white">Khẩn cấp</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {!isReadOnly ? (
                        <button 
                          onClick={() => handleChangeEqStatus(eq.id)}
                          className="text-slate-400 hover:text-[#00236f] hover:bg-slate-100 p-2 rounded-full transition-all active:scale-90"
                          title="Đổi trạng thái bảo trì"
                        >
                          <span className="material-symbols-outlined text-xl">swap_horiz</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleOpenReport(eq.id)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition-all active:scale-90"
                          title="Báo cáo thiết bị"
                        >
                          <span className="material-symbols-outlined text-xl">report</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POP-UP MODAL TẠO PHIẾU SỰ CỐ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-on-surface z-50">
            <div className="flex justify-between items-center px-6 py-5 border-b border-outline-variant/35 bg-surface-container-lowest">
              <h3 className="font-extrabold text-base text-[#00236f]">Tạo phiếu sự cố thiết bị</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-surface-container-low rounded-lg transition-all text-outline"
              >
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Chọn thiết bị gặp sự cố</label>
                <select
                  required
                  value={incidentEqId}
                  onChange={(e) => setIncidentEqId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-bold text-slate-700"
                >
                  <option value="">-- Chọn thiết bị --</option>
                  {equipments.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.id} - {eq.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mức độ ưu tiên</label>
                <select
                  required
                  value={incidentPriority}
                  onChange={(e) => setIncidentPriority(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-bold text-slate-700"
                >
                  <option value="Bình thường">Bình thường</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Cao">Cao</option>
                  <option value="Khẩn cấp">Khẩn cấp</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mô tả sự cố / Triệu chứng</label>
                <textarea
                  required
                  placeholder="Ví dụ: Máy bơm có tiếng kêu to bất thường, rỉ nước..."
                  value={incidentDesc}
                  onChange={(e) => setIncidentDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium h-24 resize-none"
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:underline"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#00236f] hover:bg-[#00236f]/90 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">assignment_add</span>
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP MODAL BÁO CÁO THIẾT BỊ */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowReportModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-on-surface z-50">
            <div className="flex justify-between items-center px-6 py-5 border-b border-outline-variant/35 bg-surface-container-lowest">
              <h3 className="font-extrabold text-base text-[#00236f]">Báo cáo thiết bị</h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="p-1 hover:bg-surface-container-low rounded-lg transition-all text-outline"
              >
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mã thiết bị</label>
                <input
                  type="text"
                  readOnly
                  value={reportEqId}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-sm font-bold text-slate-600 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Vấn đề cần báo cáo</label>
                <input
                  required
                  type="text"
                  placeholder="Ví dụ: Máy bơm kêu to, rỉ nước..."
                  value={reportIssueName}
                  onChange={(e) => setReportIssueName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-bold text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Trạng thái thiết bị</label>
                <select
                  required
                  value={reportStatus}
                  onChange={(e) => setReportStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-bold text-slate-700"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Cần kiểm tra">Cần kiểm tra</option>
                  <option value="Đang bảo trì">Đang bảo trì</option>
                  <option value="Lỗi">Lỗi</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Trạng thái xử lý</label>
                <select
                  required
                  value={reportTaskStatus}
                  onChange={(e) => setReportTaskStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-bold text-slate-700"
                >
                  <option value="Cần kiểm tra">Cần kiểm tra</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nội dung báo cáo</label>
                <textarea
                  required
                  placeholder="Ví dụ: Cần tra thêm dầu mỡ, máy kêu to..."
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium h-24 resize-none"
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:underline"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#00236f] hover:bg-[#00236f]/90 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  Gửi báo cáo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP MODAL CHI TIẾT BÁO CÁO */}
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowDetailModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-on-surface z-50">
            <div className="flex justify-between items-center px-6 py-5 border-b border-outline-variant/35 bg-surface-container-lowest">
              <h3 className="font-extrabold text-base text-[#00236f]">Chi tiết báo cáo</h3>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="p-1 hover:bg-surface-container-low rounded-lg transition-all text-outline"
              >
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tên báo cáo</label>
                <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                  {selectedTask.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mã thiết bị</label>
                  <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                    {selectedTask.equipmentId || 'Không xác định'}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Trạng thái xử lý</label>
                  {!isReadOnly ? (
                    <select
                      value={selectedTask.status}
                      onChange={(e) => handleChangeTaskStatus(selectedTask.id, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="Chưa làm">Chưa làm</option>
                      <option value="Cần kiểm tra">Cần kiểm tra</option>
                      <option value="Đang làm">Đang làm</option>
                      <option value="Đã hoàn thành">Đã hoàn thành</option>
                      <option value="Trễ hạn">Trễ hạn</option>
                    </select>
                  ) : (
                    <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2">
                      <span className={selectedTask.statusColor || "text-slate-700"}>{selectedTask.status}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nội dung chi tiết</label>
                <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 min-h-[6rem] whitespace-pre-wrap">
                  {selectedTask.description || 'Không có mô tả'}
                </div>
              </div>

              <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:underline"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
