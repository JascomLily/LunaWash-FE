import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API_BASE from '../../config';

const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || null;
  } catch { return null; }
};

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [isLimited, setIsLimited] = useState(false);
  const [maxUsage, setMaxUsage] = useState('');
  
  // Set default dates (today to next 30 days)
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 30);
  
  const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(nextMonth.toISOString().split('T')[0]);

  // Fetch promotions
  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.warn('Không có token - chưa đăng nhập hoặc session hết hạn');
        return;
      }
      const baseUrl = API_BASE;
      const response = await fetch(`${baseUrl}/api/vouchers/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        console.error('Lỗi lấy vouchers:', response.status, response.statusText);
        return;
      }
      const data = await response.json();
      if (data.success) {
        setPromotions(data.data);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const handleCreatePromotion = async () => {
    if (!name || !code || !discountPercent || !startDate || !endDate) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (isLimited && !maxUsage) {
      toast.error('Vui lòng nhập số lượng giới hạn!');
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        Id: code,
        VoucherName: name,
        Description: `${name} - Giảm ${discountPercent}%`,
        DiscountValue: parseInt(discountPercent),
        PointsRequired: 0,
        ExpiryDate: new Date(endDate).toISOString(),
        IsActive: true
      };

      const baseUrl = API_BASE;
      const response = await fetch(`${baseUrl}/api/vouchers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      // Xử lý 401 riêng để tránh crash khi body rỗng
      if (response.status === 401) {
        toast.error('Không có quyền thực hiện. Vui lòng đăng nhập lại với tài khoản Admin!');
        return;
      }

      const data = await response.json();
      if (data.success) {
        toast.success(data.message || 'Tạo mã thành công!');
        fetchPromotions();
        // Reset form
        setName('');
        setCode('');
        setDiscountPercent(10);
        setIsLimited(false);
        setMaxUsage('');
      } else {
        toast.error(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Lỗi tạo voucher:', error);
      toast.error('Lỗi kết nối máy chủ: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const calculateDiscount = (originalPrice) => {
    const percent = parseInt(discountPercent) || 0;
    const discounted = originalPrice - (originalPrice * percent / 100);
    return formatCurrency(discounted);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Quản lý Khuyến mãi</h1>
          <p className="text-sm text-on-surface-variant">Điều hành các chương trình ưu đãi giảm giá.</p>
        </div>
      </div>

      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Thiết lập Khuyến mãi */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">add_circle</span>
            <h2 className="text-lg font-bold text-on-surface">Thiết lập Khuyến mãi</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Tên chương trình</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vd: Ưu đãi Hè 2024" 
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Mã code</label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SUMMER24" 
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary uppercase" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Giảm giá (%)</label>
              <input 
                type="number" 
                min="1"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={isLimited} onChange={(e) => setIsLimited(e.target.checked)} />
                  Giới hạn số lượng?
                </div>
              </label>
              <input 
                type="number" 
                disabled={!isLimited}
                value={maxUsage}
                onChange={(e) => setMaxUsage(e.target.value)}
                placeholder={isLimited ? "Nhập số lượng" : "Không giới hạn"} 
                className={`w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary ${!isLimited && 'opacity-50'}`} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Ngày bắt đầu</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Ngày kết thúc</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary" 
              />
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-4 mb-6">
            <h4 className="text-xs font-bold text-on-surface mb-2">Ví dụ: Với mức giảm {discountPercent || 0}%:</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Hóa đơn 100k</span>
                <span className="font-bold text-primary">{calculateDiscount(100000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Hóa đơn 500k</span>
                <span className="font-bold text-primary">{calculateDiscount(500000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Hóa đơn 2.000k</span>
                <span className="font-bold text-primary">{calculateDiscount(2000000)}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleCreatePromotion}
            disabled={isLoading}
            className="w-full mt-auto py-2.5 bg-secondary text-on-secondary rounded-xl font-bold hover:bg-secondary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : 'Tạo Chương trình Khuyến mãi'}
          </button>
        </div>
      </div>

      {/* Danh sách Chương trình Đang chạy */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-on-surface">Danh sách Chương trình</h2>
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">{promotions.length} Hoạt động</span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-wider font-extrabold">
                <th className="p-4 border-b border-outline-variant/20">Tên Chương Trình</th>
                <th className="p-4 border-b border-outline-variant/20">Mã Code</th>
                <th className="p-4 border-b border-outline-variant/20">Mức giảm</th>
                <th className="p-4 border-b border-outline-variant/20">Đã dùng</th>
                <th className="p-4 border-b border-outline-variant/20">Thời gian</th>
                <th className="p-4 border-b border-outline-variant/20">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {promotions.map(promo => (
                <tr key={promo.id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">celebration</span>
                      </div>
                      <span className="font-bold text-on-surface">{promo.voucherName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono bg-surface-container px-2.5 py-1 rounded-md font-bold text-on-surface text-xs">{promo.id}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-error font-bold">-{promo.discountValue}%</span>
                  </td>
                  <td className="p-4">
                    <span className="text-on-surface-variant text-xs">- / -</span>
                  </td>
                  <td className="p-4">
                    <div className="text-xs space-y-0.5">
                      <p><span className="text-on-surface-variant">Kết thúc:</span> <span className="font-bold">{new Date(promo.expiryDate).toLocaleDateString('vi-VN')}</span></p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                      promo.status === 'Đang chạy' ? 'bg-emerald-100 text-emerald-700' : 
                      promo.status === 'Hết lượt' || promo.status === 'Đã kết thúc' ? 'bg-error/10 text-error' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${promo.status === 'Đang chạy' ? 'bg-emerald-500' : 'bg-current'}`}></span> {promo.status}
                    </span>
                  </td>
                </tr>
              ))}
              {promotions.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-on-surface-variant">
                    Chưa có chương trình khuyến mãi nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default AdminPromotions;
