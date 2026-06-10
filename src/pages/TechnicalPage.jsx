import React, { useState } from 'react';

const INITIAL_EQUIPMENTS = [
  {
    id: 'EQ-001',
    name: 'Máy rửa tự động 01',
    category: 'Máy rửa chính',
    status: 'Hoạt động',
    statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    statusIcon: 'check_circle',
    lastMaintenance: '01/06/2026',
    nextMaintenance: '08/06/2026',
    priority: 'Bình thường',
    priorityColor: 'text-slate-600 bg-slate-100'
  },
  {
    id: 'EQ-002',
    name: 'Máy bơm áp lực cao',
    category: 'Bơm nước',
    status: 'Cần kiểm tra',
    statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
    statusIcon: 'build',
    lastMaintenance: '30/05/2026',
    nextMaintenance: 'Hôm nay',
    nextMaintenanceColor: 'text-amber-600 font-bold',
    priority: 'Cao',
    priorityColor: 'text-blue-700 bg-blue-100'
  },
  {
    id: 'EQ-003',
    name: 'Cảm biến nhận diện xe',
    category: 'Cảm biến',
    status: 'Lỗi',
    statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
    statusIcon: 'error',
    lastMaintenance: '05/06/2026',
    nextMaintenance: 'Ngay lập tức',
    nextMaintenanceColor: 'text-rose-600 font-bold',
    priority: 'Khẩn cấp',
    priorityColor: 'text-white bg-rose-600'
  },
  {
    id: 'EQ-004',
    name: 'Hệ thống phun bọt',
    category: 'Hóa chất',
    status: 'Đang bảo trì',
    statusColor: 'text-sky-700 bg-sky-50 border-sky-200',
    statusIcon: 'settings',
    lastMaintenance: '03/06/2026',
    nextMaintenance: '10/06/2026',
    priority: 'Trung bình',
    priorityColor: 'text-sky-700 bg-sky-100'
  },
  {
    id: 'EQ-005',
    name: 'Máy sấy / quạt thổi khô',
    category: 'Sấy khô',
    status: 'Hoạt động',
    statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    statusIcon: 'check_circle',
    lastMaintenance: '02/06/2026',
    nextMaintenance: '09/06/2026',
    priority: 'Bình thường',
    priorityColor: 'text-slate-600 bg-slate-100'
  }
];

const INITIAL_TASKS = [
  { id: 1, name: 'Kiểm tra máy bơm', status: 'Đang làm', statusColor: 'text-blue-600' },
  { id: 2, name: 'Vệ sinh đầu phun', status: 'Chưa làm', statusColor: 'text-slate-400' },
  { id: 3, name: 'Cảm biến nhận diện', status: 'Trễ hạn', statusColor: 'text-rose-600 font-bold' },
  { id: 4, name: 'Kiểm tra hóa chất', status: 'Hoàn thành', statusColor: 'text-emerald-600' }
];

export default function TechnicalPage() {
  const [equipments, setEquipments] = useState(INITIAL_EQUIPMENTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [incidentEqId, setIncidentEqId] = useState('');
  const [incidentPriority, setIncidentPriority] = useState('Bình thường');
  const [incidentDesc, setIncidentDesc] = useState('');

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isReadOnly = storedUser?.tier === 'BranchManager' || storedUser?.tier === 'Admin';

  // 1. Toggle Task Status
  const toggleTaskStatus = (id) => {
    if (isReadOnly) return;
    setTasks(tasks.map(task => {
      if (task.id === id) {
        let newStatus = '';
        let newColor = '';
        if (task.status === 'Chưa làm') {
          newStatus = 'Đang làm'; newColor = 'text-blue-600';
        } else if (task.status === 'Đang làm') {
          newStatus = 'Hoàn thành'; newColor = 'text-emerald-600';
        } else if (task.status === 'Hoàn thành') {
          newStatus = 'Trễ hạn'; newColor = 'text-rose-600 font-bold';
        } else {
          newStatus = 'Chưa làm'; newColor = 'text-slate-400';
        }
        return { ...task, status: newStatus, statusColor: newColor };
      }
      return task;
    }));
  };

  // Change Priority Status
  const handleChangePriority = (id, newPriority) => {
    if (isReadOnly) return;
    setEquipments(equipments.map(eq => {
      if (eq.id === id) {
        let pColor = 'text-slate-600 bg-slate-100';
        if (newPriority === 'Trung bình') pColor = 'text-sky-700 bg-sky-100';
        if (newPriority === 'Cao') pColor = 'text-blue-700 bg-blue-100';
        if (newPriority === 'Khẩn cấp') pColor = 'text-white bg-rose-600';
        return { ...eq, priority: newPriority, priorityColor: pColor };
      }
      return eq;
    }));
  };

  // Change Next Maintenance Date
  const handleChangeNextDate = (id, newDateStr) => {
    if (isReadOnly) return;
    if (!newDateStr) return;
    const [year, month, day] = newDateStr.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    setEquipments(equipments.map(eq => {
      if (eq.id === id) {
        return { ...eq, nextMaintenance: formattedDate, nextMaintenanceColor: '' };
      }
      return eq;
    }));
  };

  // 2. Change Equipment Status
  const handleChangeEqStatus = (id) => {
    if (isReadOnly) return;
    const states = ['Hoạt động', 'Cần kiểm tra', 'Đang bảo trì', 'Lỗi'];
    
    setEquipments(equipments.map(eq => {
      if (eq.id === id) {
        const currIdx = states.indexOf(eq.status);
        const nextStatus = states[(currIdx + 1) % states.length];
        let newColor = '';
        if (nextStatus === 'Hoạt động') newColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
        else if (nextStatus === 'Cần kiểm tra') newColor = 'text-amber-700 bg-amber-50 border-amber-200';
        else if (nextStatus === 'Đang bảo trì') newColor = 'text-sky-700 bg-sky-50 border-sky-200';
        else if (nextStatus === 'Lỗi') newColor = 'text-rose-700 bg-rose-50 border-rose-200';
        
        return { ...eq, status: nextStatus, statusColor: newColor };
      }
      return eq;
    }));
  };

  // 3. Handle Submit Incident Ticket
  const handleCreateIncident = (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!incidentEqId || !incidentDesc) return;
    
    const targetEq = equipments.find(eq => eq.id === incidentEqId);
    if (!targetEq) return;

    // Add new Task
    const newTask = {
      id: Date.now(),
      name: `Khắc phục: ${targetEq.name}`,
      status: 'Chưa làm',
      statusColor: 'text-slate-400'
    };
    setTasks([...tasks, newTask]);

    // Update Equipment to Error
    setEquipments(equipments.map(eq => {
      if (eq.id === incidentEqId) {
        let pColor = 'text-slate-600 bg-slate-100';
        if (incidentPriority === 'Trung bình') pColor = 'text-sky-700 bg-sky-100';
        if (incidentPriority === 'Cao') pColor = 'text-blue-700 bg-blue-100';
        if (incidentPriority === 'Khẩn cấp') pColor = 'text-white bg-rose-600';

        return { 
          ...eq, 
          status: 'Lỗi', 
          statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
          priority: incidentPriority,
          priorityColor: pColor
        };
      }
      return eq;
    }));

    setShowModal(false);
    setIncidentEqId('');
    setIncidentDesc('');
    setIncidentPriority('Bình thường');
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

          {/* RIGHT: TODAY TASKS */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-full">
            <div className="flex items-center gap-2 text-slate-700 mb-4 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-lg">assignment</span>
              <h3 className="font-bold text-sm">Công việc hôm nay</h3>
            </div>
            <ul className="space-y-4">
              {tasks.length === 0 && (
                <p className="text-xs text-slate-400 italic">Không có công việc nào.</p>
              )}
              {tasks.map((task) => (
                <li key={task.id} className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${task.status === 'Hoàn thành' ? 'bg-emerald-500' : task.status === 'Trễ hạn' ? 'bg-rose-500' : task.status === 'Đang làm' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                  <div 
                    className={`${isReadOnly ? 'cursor-default' : 'cursor-pointer'} group flex-1`}
                    onClick={() => toggleTaskStatus(task.id)}
                    title="Nhấn để đổi trạng thái công việc"
                  >
                    <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{task.name}</p>
                    <p className={`text-xs mt-0.5 select-none ${task.statusColor}`}>{task.status}</p>
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
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Đổi TT</th>
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
                      {!isReadOnly && (
                        <button 
                          onClick={() => handleChangeEqStatus(eq.id)}
                          className="text-slate-400 hover:text-[#00236f] hover:bg-slate-100 p-2 rounded-full transition-all active:scale-90"
                          title="Đổi trạng thái bảo trì"
                        >
                          <span className="material-symbols-outlined text-xl">swap_horiz</span>
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
    </main>
  );
}
