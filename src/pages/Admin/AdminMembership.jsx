import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AdminMembership = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';

      const res = await fetch(import.meta.env.VITE_API_URL + '/api/Membership/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Không thể tải cấu hình hạng thành viên');
      
      const data = await res.json();
      setTiers(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setTiers(tiers.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';

      // Promise.all to save all tiers sequentially or parallel
      const updatePromises = tiers.map(tier => 
        fetch(import.meta.env.VITE_API_URL + `/api/Membership/settings/${tier.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            minPoints: parseInt(tier.minPoints) || 0,
            minMaintainPoints: parseInt(tier.minMaintainPoints) || 0,
            pointsMultiplier: parseFloat(tier.pointsMultiplier) || 1,
            priorityLevel: parseInt(tier.priorityLevel) || 1,
            discountPercent: parseFloat(tier.discountPercent) || 0,
            maxBookingDays: parseInt(tier.maxBookingDays) || 3
          })
        })
      );

      const results = await Promise.all(updatePromises);
      const hasError = results.some(r => !r.ok);

      if (hasError) throw new Error('Có lỗi xảy ra khi lưu một số hạng thành viên.');
      
      // Đồng bộ lại hạng của khách hàng dựa trên cấu hình mới
      const syncRes = await fetch(import.meta.env.VITE_API_URL + '/api/Membership/sync', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!syncRes.ok) throw new Error('Lưu cấu hình thành công nhưng không thể đồng bộ khách hàng.');

      toast.success('Đã lưu cấu hình và đồng bộ dữ liệu thành viên thành công!');
      setShowConfirm(false);
      fetchTiers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getTierColor = (tierName) => {
    const name = tierName.toLowerCase();
    if (name.includes('member') || name.includes('đồng') || name.includes('bronze')) return 'border-[#cd7f32] text-[#8c521f] bg-[#fdf3eb]';
    if (name.includes('bạc') || name.includes('silver')) return 'border-slate-400 text-slate-700 bg-slate-200';
    if (name.includes('vàng') || name.includes('gold')) return 'border-amber-400 text-amber-700 bg-amber-100';
    if (name.includes('platinum')) return 'border-slate-800 text-white bg-gradient-to-r from-slate-700 to-slate-900';
    return 'border-primary text-primary bg-primary/10';
  };

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant font-bold">Đang tải cấu hình...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Quản lý Thành viên & Điểm thưởng</h1>
          <p className="text-sm text-on-surface-variant">Thiết lập lộ trình thăng hạng và đặc quyền cho khách hàng LunaWash.</p>
        </div>
        <button 
          onClick={() => setShowConfirm(true)} 
          disabled={saving || showConfirm}
          className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-on-secondary rounded-xl hover:bg-secondary/90 transition-all font-bold shadow-md disabled:opacity-50"
        >
          {saving ? <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> : <span className="material-symbols-outlined text-[18px]">save</span>}
          {saving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
        </button>
      </div>

      {/* 1. Mốc điểm thăng hạng */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">trending_up</span>
          <h2 className="text-lg font-bold text-on-surface">Mốc điểm thăng hạng</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => {
            const colors = getTierColor(tier.tierName);
            const isBase = tier.minPoints === 0;
            return (
              <div key={`points-${tier.id}`} className={`bg-surface-container-lowest rounded-2xl border-l-4 p-5 shadow-sm border border-outline-variant/30 flex flex-col items-center relative ${colors.split(' ')[0]}`}>
                
                {/* Hiển thị số lượng khách hàng */}
                <div className="absolute top-[-10px] right-[-10px] bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md">
                  {tier.customerCount} thành viên
                </div>

                <div className="flex justify-between w-full items-center mb-4 mt-2">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase shadow-sm ${colors.split(' ').slice(1).join(' ')}`}>
                    {tier.tierName}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant">military_tech</span>
                </div>
                <div className="w-full mb-3">
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Điểm yêu cầu</label>
                  <input 
                    type="number" 
                    value={tier.minPoints}
                    onChange={(e) => handleInputChange(tier.id, 'minPoints', e.target.value)}
                    disabled={isBase}
                    className={`w-full px-4 py-2.5 bg-transparent border border-outline-variant/50 rounded-xl text-on-surface font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center ${isBase ? 'opacity-50' : ''}`} 
                  />
                </div>
                {!isBase && (
                  <div className="w-full mb-3">
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Điểm giữ hạng</label>
                    <input 
                      type="number" 
                      value={tier.minMaintainPoints || 0}
                      onChange={(e) => handleInputChange(tier.id, 'minMaintainPoints', e.target.value)}
                      className="w-full px-4 py-2.5 bg-transparent border border-outline-variant/50 rounded-xl text-on-surface font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center" 
                    />
                  </div>
                )}
                {isBase ? (
                  <p className="text-[11px] text-on-surface-variant mt-auto text-center italic">Mốc khởi đầu mặc định.</p>
                ) : (
                  <button className="text-primary font-bold text-xs hover:underline mt-auto opacity-0 pointer-events-none">Cập nhật mốc</button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Cấu hình chiết khấu & hệ số điểm */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">price_change</span>
          <h2 className="text-lg font-bold text-on-surface">Cấu hình Chiết khấu & Hệ số điểm</h2>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-extrabold">
                  <th className="p-4 border-b border-outline-variant/20">Hạng Thành Viên</th>
                  <th className="p-4 border-b border-outline-variant/20 text-center">Giảm giá (%)</th>
                  <th className="p-4 border-b border-outline-variant/20 text-center">Hệ số tích điểm (x)</th>
                  <th className="p-4 border-b border-outline-variant/20 text-center">Đặc quyền đặt lịch (Ngày)</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold">
                {tiers.map((tier) => (
                  <tr key={`details-${tier.id}`} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50">
                    <td className="p-4 text-on-surface font-bold">{tier.tierName}</td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <input 
                          type="number" 
                          step="0.1"
                          value={tier.discountPercent} 
                          onChange={(e) => handleInputChange(tier.id, 'discountPercent', e.target.value)}
                          className="w-20 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary font-mono text-emerald-600" 
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <input 
                          type="number" 
                          step="0.1"
                          value={tier.pointsMultiplier} 
                          onChange={(e) => handleInputChange(tier.id, 'pointsMultiplier', e.target.value)}
                          className="w-20 px-2 py-1.5 border border-outline-variant/50 rounded bg-transparent text-center focus:border-primary focus:ring-1 focus:ring-primary font-mono text-primary" 
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-3">
                        <input 
                          type="range" 
                          min="1" 
                          max="30" 
                          value={tier.maxBookingDays || 3}
                          onChange={(e) => handleInputChange(tier.id, 'maxBookingDays', e.target.value)}
                          className="w-24 h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-surface-variant"
                        />
                        <span className="font-bold text-on-surface-variant w-14 text-right">{tier.maxBookingDays || 3} ngày</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer Alert / Confirm Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out transform ${showConfirm ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-8 pb-6 pt-2">
          <div className="bg-sky-50 border border-sky-100 text-[#00236f] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl relative">
            
            <button onClick={() => setShowConfirm(false)} className="absolute top-4 right-4 text-sky-400 hover:text-sky-700 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                <span className="material-symbols-outlined text-[24px]">info</span>
              </div>
              <div className="pr-8">
                <h3 className="font-bold text-lg">Lưu ý khi cập nhật</h3>
                <p className="text-sm opacity-90">Những thay đổi trên đây sẽ lập tức ảnh hưởng đến quyền lợi của tất cả khách hàng. Hãy kiểm tra thật kỹ trước khi lưu.</p>
              </div>
            </div>
            <button 
              onClick={handleSaveAll}
              disabled={saving}
              className="w-full md:w-auto px-8 py-3 bg-[#00236f] text-white rounded-xl font-bold hover:bg-[#00236f]/90 transition-colors shadow-md disabled:opacity-50 whitespace-nowrap"
            >
              {saving ? 'Đang lưu...' : 'Xác nhận Lưu'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminMembership;
