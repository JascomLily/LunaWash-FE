import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    revenueByBranch: [],
    recentBookings: []
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';

      const res = await fetch(import.meta.env.VITE_API_URL + '/api/Dashboard/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Không thể lấy dữ liệu tổng quan');
      
      const dashboardData = await res.json();
      
      setData(dashboardData);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const dateString = `Hôm nay, ${today.getDate()} Tháng ${today.getMonth() + 1}`;

  if (loading) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-on-surface-variant font-bold">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Tổng quan hệ thống</h1>
          <p className="text-sm text-on-surface-variant">Theo dõi hiệu suất vận hành toàn hệ thống LunaWash.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl hover:bg-surface-container transition-colors text-sm font-bold text-on-surface shadow-sm">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            {dateString}
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all font-bold shadow-md text-sm">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-2">TỔNG DOANH THU</p>
          <div className="flex items-end gap-2 relative z-10">
            <h3 className="text-3xl font-black text-on-surface">{data.totalRevenue.toLocaleString('vi-VN')}đ</h3>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-2">TỔNG ĐƠN HÀNG</p>
          <div className="flex items-end gap-2 relative z-10">
            <h3 className="text-3xl font-black text-on-surface">{data.totalBookings}</h3>
            <span className="text-on-surface-variant text-xs font-bold mb-1">đơn hoàn tất</span>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-2">TỔNG KHÁCH HÀNG</p>
          <div className="flex items-end gap-2 relative z-10">
            <h3 className="text-3xl font-black text-on-surface">{data.totalCustomers}</h3>
            <span className="text-on-surface-variant text-xs font-bold mb-1">thành viên</span>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-[10px] font-extrabold text-outline uppercase tracking-widest mb-2">NHÂN SỰ</p>
          <div className="flex items-end gap-2 relative z-10">
            <h3 className="text-3xl font-black text-on-surface">{data.totalEmployees}</h3>
            <span className="text-on-surface-variant text-xs font-bold mb-1">nhân viên</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Revenue by Branch */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">store</span>
            Doanh thu theo chi nhánh
          </h2>
          
          {data.revenueByBranch.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 text-center text-on-surface-variant font-medium shadow-sm">
              Chưa có dữ liệu doanh thu chi nhánh.
            </div>
          ) : (
            <div className="space-y-4">
              {data.revenueByBranch.map(branch => (
                <div key={branch.branchId} className={`bg-white rounded-2xl p-5 shadow-sm border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-all ${branch.isActive ? 'border-gray-100' : 'border-red-100 relative overflow-hidden'}`}>
                  {/* Nếu bảo trì thì hiện vạch đỏ bên trái */}
                  {!branch.isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>}
                  
                  {/* Thông tin chi nhánh */}
                  <div className="w-full md:w-1/4 z-10">
                    <h4 className="font-bold text-gray-800 text-base">{branch.branchName}</h4>
                    <p className="text-xs text-gray-500 mb-2">{branch.address}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider ${branch.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {branch.status}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">{branch.activeStations}</span>
                    </div>
                  </div>
                  
                  {/* Doanh thu */}
                  <div className="w-full md:w-1/5 z-10">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Doanh thu ngày</p>
                    <p className="font-black text-gray-800 text-lg">{branch.revenue.toLocaleString('vi-VN')}đ</p>
                  </div>
                  
                  {/* Sparkline Chart */}
                  <div className="w-full md:w-1/3 h-12 z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={branch.sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={branch.isActive ? "#6366f1" : "#ef4444"} 
                          fill={branch.isActive ? "#e0e7ff" : "#fee2e2"} 
                          strokeWidth={2}
                          isAnimationActive={true}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Đánh giá */}
                  <div className="w-full md:w-1/6 md:text-right z-10">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 md:text-right text-left">Đánh giá</p>
                    <div className="flex items-center justify-start md:justify-end gap-1">
                      <span className="font-bold text-gray-800 text-lg">{branch.rating}</span>
                      <span className="text-amber-400 text-lg">★</span>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Bookings & System Map */}
        <div className="space-y-6">
          
          {/* Recent Bookings */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b border-outline-variant/20 bg-surface/50 flex justify-between items-center">
              <h2 className="font-bold text-on-surface text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                Giao dịch gần đây
              </h2>
            </div>
            <div className="p-2">
              {data.recentBookings.length === 0 ? (
                <div className="p-6 text-center text-on-surface-variant text-sm">Chưa có giao dịch nào.</div>
              ) : (
                data.recentBookings.map((booking, idx) => (
                  <div key={booking.id} className={`p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors rounded-2xl ${idx !== data.recentBookings.length - 1 ? 'border-b border-outline-variant/10' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                        {booking.customerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface truncate max-w-[120px]">{booking.customerName}</h4>
                        <p className="text-[10px] text-on-surface-variant">{booking.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600">+{booking.amount.toLocaleString('vi-VN')}đ</p>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant mt-1 inline-block">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Map mock */}
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col h-[250px] relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 pointer-events-none"></div>
            
            <div className="absolute top-4 left-4 z-10">
              <h2 className="font-bold text-white text-sm">Hệ thống mạng lưới</h2>
              <p className="text-[10px] text-white/50">{data.revenueByBranch.length} chi nhánh</p>
            </div>
            
            {/* Markers */}
            <div className="absolute top-[40%] left-[30%] w-6 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--color-primary),0.8)] flex items-center justify-center border-2 border-white/20 animate-pulse"></div>
            <div className="absolute top-[60%] left-[50%] w-8 h-8 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] flex items-center justify-center border-2 border-white/20"></div>
            <div className="absolute top-[70%] left-[65%] w-6 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--color-primary),0.8)] flex items-center justify-center border-2 border-white/20"></div>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;
