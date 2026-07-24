import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const BRANCH_DETAILS = {
  'BRN-Q1-01': { name: 'LunaWash Quận 1', address: '123 Lê Lợi, Bến Thành', phone: '1900 5678' },
  'BRN-TD-01': { name: 'LunaWash Thủ Đức', address: '45 Võ Văn Ngân, Thủ Đức', phone: '1900 1234' },
  'BRN-LD-01': { name: 'LunaWash Lâm Đồng', address: '12 Lâm Đồng', phone: '1900 4321' }
};

export default function ManagerRevenue() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [branchName, setBranchName] = useState('Chi nhánh của bạn');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week'); // 'week' or 'month'
  const [referenceDate, setReferenceDate] = useState(new Date().toISOString());

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.tier !== 'BranchManager') {
      navigate('/');
      return;
    }
    setUser(parsedUser);
    
    if (parsedUser.branchId) {
      setBranchName(BRANCH_DETAILS[parsedUser.branchId]?.name || `Chi nhánh ${parsedUser.branchId}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.branchId) {
      fetchRevenueData(user.branchId, period, referenceDate);
    }
  }, [user, period, referenceDate]);

  const fetchRevenueData = async (branchId, selectedPeriod, refDate) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5010/api/Dashboard/branch/${branchId}/revenue?period=${selectedPeriod}&referenceDate=${refDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error('Lỗi khi tải doanh thu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPeriod = () => {
    const date = new Date(referenceDate);
    if (period === 'month') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setDate(date.getDate() - 7);
    }
    setReferenceDate(date.toISOString());
  };

  const handleNextPeriod = () => {
    const date = new Date(referenceDate);
    if (period === 'month') {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setDate(date.getDate() + 7);
    }
    setReferenceDate(date.toISOString());
  };

  const handleToday = () => {
    setReferenceDate(new Date().toISOString());
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">storefront</span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Khu vực làm việc</span>
            </div>
            <div className="flex flex-col mb-4">
              <h1 className="font-headline-lg text-headline-lg text-[#00236f] leading-tight">
                {BRANCH_DETAILS[user.branchId]?.name || branchName}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-on-surface-variant font-medium">
                <span className="material-symbols-outlined text-base text-primary">location_on</span>
                {BRANCH_DETAILS[user.branchId]?.address || 'Chi nhánh này chưa có địa chỉ'}
                <span className="text-outline-variant ml-2 mr-2">|</span>
                <span className="material-symbols-outlined text-base text-primary">call</span>
                {BRANCH_DETAILS[user.branchId]?.phone || 'Đang cập nhật'}
              </div>
            </div>
            <p className="text-sm text-on-surface-variant/80 mt-1">
              Vai trò: <span className="font-extrabold text-secondary">Quản lý Chi nhánh</span>
            </p>
          </div>
        </div>

        {/* 3 Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
          <div className="glass-card rounded-[24px] p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-blue-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl font-bold">today</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-outline tracking-wider">Doanh thu hôm nay</p>
              <h3 className="text-2xl font-black text-[#00236f] mt-1">
                {data ? data.todayRevenue.toLocaleString('vi-VN') : 0} ₫
              </h3>
            </div>
          </div>

          <div className="glass-card rounded-[24px] p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-amber-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl font-bold">view_week</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-outline tracking-wider">Doanh thu tuần này</p>
              <h3 className="text-2xl font-black text-amber-700 mt-1">
                {data ? data.thisWeekRevenue.toLocaleString('vi-VN') : 0} ₫
              </h3>
            </div>
          </div>

          <div className="glass-card rounded-[24px] p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 bottom-0 w-2 bg-emerald-500"></div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl font-bold">calendar_month</span>
            </div>
            <div>
              <p className="text-xs font-black uppercase text-outline tracking-wider">Doanh thu tháng này</p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1">
                {data ? data.thisMonthRevenue.toLocaleString('vi-VN') : 0} ₫
              </h3>
            </div>
          </div>
        </div>

        {/* Filters & Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/20 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-on-surface">Thống Kê Doanh Thu</h2>
            <div className="flex items-center gap-4">
              <div className="flex bg-surface-variant rounded-full p-1">
                <button
                  onClick={() => setPeriod('week')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${period === 'week' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Theo Tuần
                </button>
                <button
                  onClick={() => setPeriod('month')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${period === 'month' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                >
                  Theo Tháng
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handlePrevPeriod} className="w-10 h-10 rounded-full border border-outline-variant/50 flex items-center justify-center hover:bg-surface-variant text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button onClick={handleToday} className="px-4 py-2 border border-outline-variant/50 rounded-full text-sm font-bold hover:bg-surface-variant transition-colors">
                  {data?.currentPeriodLabel || 'Hiện tại'}
                </button>
                <button onClick={handleNextPeriod} className="w-10 h-10 rounded-full border border-outline-variant/50 flex items-center justify-center hover:bg-surface-variant text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div className="h-80 w-full mt-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.chartData || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }} dx={-10} tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`} />
                  <Tooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`${value.toLocaleString('vi-VN')} ₫`, 'Doanh thu']}
                    labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}
                  />
                  <Bar dataKey="revenue" name="Doanh thu" fill="#00236f" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-[32px] p-2 md:p-4 shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-outline-variant/30">
                  <th className="py-4 px-6 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest w-1/3">Ngày</th>
                  <th className="py-4 px-6 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest text-center w-1/3">Số đơn hàng</th>
                  <th className="py-4 px-6 text-xs font-extrabold text-on-surface-variant uppercase tracking-widest text-right w-1/3">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {!loading && data?.details?.length > 0 ? (
                  data.details.map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-variant/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-on-surface">{row.date}</td>
                      <td className="py-4 px-6 text-center text-on-surface-variant font-medium">
                        <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-sm font-bold">
                          {row.totalBookings} đơn
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-black text-[#00236f]">{row.totalRevenue.toLocaleString('vi-VN')} ₫</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-on-surface-variant font-medium">
                      {!loading ? 'Không có dữ liệu doanh thu cho khoảng thời gian này.' : 'Đang tải dữ liệu...'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
