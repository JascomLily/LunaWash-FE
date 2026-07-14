import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AdminFeedback = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';

      const res = await fetch(import.meta.env.VITE_API_URL + '/api/Tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Lỗi khi tải dữ liệu ticket');
      
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';

      const res = await fetch(import.meta.env.VITE_API_URL + `/api/Tickets/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!res.ok) throw new Error('Không thể cập nhật trạng thái');
      toast.success(`Đã cập nhật thành: ${status}`);
      fetchTickets();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Khẩn cấp') return 'bg-error text-white shadow-error/30';
    if (status === 'Chờ duyệt') return 'bg-amber-500 text-white shadow-amber-500/30';
    if (status === 'Đã xử lý') return 'bg-emerald-500 text-white shadow-emerald-500/30';
    if (status === 'Đã từ chối') return 'bg-slate-400 text-white shadow-slate-400/30';
    return 'bg-primary text-white';
  };

  const getCategoryColor = (category) => {
    if (category.includes('Sự cố')) return 'text-error bg-error/10 border-error/20';
    if (category.includes('phê duyệt')) return 'text-primary bg-primary/10 border-primary/20';
    if (category.includes('Nhân sự')) return 'text-slate-600 bg-slate-100 border-slate-200';
    return 'text-slate-600 bg-slate-100 border-slate-200';
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col space-y-6 relative pb-24 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Thông báo & Phản hồi</h1>
        <p className="text-sm text-on-surface-variant">Quản lý và xử lý các báo cáo từ chi nhánh, yêu cầu phê duyệt và phản hồi sự cố vận hành.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-[28px]">assignment</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Chờ xử lý</p>
            <h3 className="text-3xl font-black text-on-surface">12</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-14 w-14 rounded-full bg-error/10 text-error flex items-center justify-center border border-error/20">
            <span className="material-symbols-outlined text-[28px]">build</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Sự cố thiết bị</p>
            <h3 className="text-3xl font-black text-on-surface">05</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
          <div className="h-14 w-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200">
            <span className="material-symbols-outlined text-[28px]">verified</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Yêu cầu duyệt</p>
            <h3 className="text-3xl font-black text-on-surface">07</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-4 items-center bg-surface-container-lowest p-4 rounded-3xl border border-outline-variant/30 shadow-sm">
        <div className="relative w-full xl:w-[40%]">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm tiêu đề, người gửi..." 
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-2xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex-1 w-full flex gap-3 overflow-x-auto pb-1 xl:pb-0 hide-scrollbar">
          <select className="min-w-[150px] flex-1 px-4 py-3 bg-transparent border border-outline-variant/50 rounded-2xl text-sm text-on-surface font-semibold focus:outline-none focus:border-primary appearance-none cursor-pointer hover:bg-surface-container-low transition-colors">
            <option>Tất cả chi nhánh</option>
            <option>Linh Đông</option>
            <option>Quận 1</option>
          </select>
          <select className="min-w-[150px] flex-1 px-4 py-3 bg-transparent border border-outline-variant/50 rounded-2xl text-sm text-on-surface font-semibold focus:outline-none focus:border-primary appearance-none cursor-pointer hover:bg-surface-container-low transition-colors">
            <option>Trạng thái</option>
            <option>Khẩn cấp</option>
            <option>Chờ duyệt</option>
            <option>Đã xử lý</option>
          </select>
          <button className="min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-on-secondary rounded-2xl hover:bg-secondary/90 transition-all font-bold shadow-md whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Lọc kết quả
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex-1">
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant font-bold">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-extrabold uppercase tracking-wider border-b border-outline-variant/20">
                  <th className="p-5 w-[12%]">CHI NHÁNH</th>
                  <th className="p-5 w-[15%]">PHÂN LOẠI</th>
                  <th className="p-5 w-[30%]">TIÊU ĐỀ</th>
                  <th className="p-5 w-[15%]">NGƯỜI YÊU CẦU</th>
                  <th className="p-5 w-[10%]">THỜI GIAN</th>
                  <th className="p-5 w-[10%] text-center">TRẠNG THÁI</th>
                  <th className="p-5 w-[8%] text-center">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tickets.map(ticket => (
                  <tr key={ticket.id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="p-5 font-bold text-on-surface">{ticket.branchName}</td>
                    <td className="p-5">
                      <span className={`text-[11px] font-bold border px-3 py-1.5 rounded-lg ${getCategoryColor(ticket.category)}`}>
                        {ticket.category}
                      </span>
                    </td>
                    <td className="p-5">
                      <h4 className="font-bold text-on-surface text-sm line-clamp-1">{ticket.title}</h4>
                      <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-1">{ticket.description}</p>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container font-bold text-xs flex items-center justify-center">
                          {ticket.requesterName.split(' ').pop().charAt(0)}
                        </div>
                        <span className="text-sm text-on-surface-variant font-medium">{ticket.requesterName}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-on-surface text-sm">{ticket.time}</p>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`inline-block font-bold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center gap-2">
                        {ticket.status === 'Đã xử lý' || ticket.status === 'Đã từ chối' ? (
                           <button disabled className="w-9 h-9 rounded-xl text-slate-300 flex items-center justify-center bg-surface-variant/30 cursor-not-allowed">
                             <span className="material-symbols-outlined text-[20px]">check_circle</span>
                           </button>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateStatus(ticket.id, 'Đã xử lý')} className="w-9 h-9 rounded-xl hover:bg-emerald-500 hover:text-white bg-emerald-50 text-emerald-600 transition-all flex items-center justify-center shadow-sm">
                              <span className="material-symbols-outlined text-[20px]">check_circle</span>
                            </button>
                            <button onClick={() => handleUpdateStatus(ticket.id, 'Đã từ chối')} className="w-9 h-9 rounded-xl hover:bg-error hover:text-white bg-error-container text-error transition-all flex items-center justify-center shadow-sm">
                              <span className="material-symbols-outlined text-[20px]">cancel</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminFeedback;
