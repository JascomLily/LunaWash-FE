import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function AdminAds() {
  const [banners, setBanners] = useState([
    { id: 1, url: '/promo_1.png', voucherId: '' },
    { id: 2, url: '/promo_2.png', voucherId: '' },
    { id: 3, url: '/promo_3.png', voucherId: '' },
  ]);
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/api/vouchers/all`);
        const data = await response.json();
        if (data.success) {
          setVouchers(data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải vouchers:', error);
      }
    };

    const fetchBanners = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/api/banners`);
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          const newBanners = data.data.map((b, idx) => ({
            id: idx + 1,
            url: b.imageUrl,
            voucherId: b.voucherId || ''
          }));
          setBanners(prev => prev.map((p, i) => newBanners[i] || p));
        }
      } catch (error) {
        console.error('Lỗi khi tải banners:', error);
      }
    };

    fetchVouchers();
    fetchBanners();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = banners.map(b => ({
        ImageUrl: b.url,
        VoucherId: b.voucherId || null
      }));
      const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/api/banners/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Đã lưu cấu hình quảng cáo vào máy chủ!');
      } else {
        toast.error('Có lỗi xảy ra khi lưu quảng cáo.');
      }
    } catch (error) {
      toast.error('Lỗi kết nối máy chủ!');
    }
    setIsLoading(false);
  };

  const handleUpdateBanner = (index, field, value) => {
    const newBanners = [...banners];
    newBanners[index][field] = value;
    setBanners(newBanners);
  };

  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateBanner(index, 'url', reader.result);
        toast.success('Đã tải ảnh lên thành công! Nhớ bấm Lưu thiết lập.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Quản lý Quảng Cáo</h1>
        <p className="text-sm text-on-surface-variant">
          Thiết lập tối đa 3 ảnh quảng cáo chạy trên trang chủ và mã giảm giá tương ứng.
        </p>
      </div>

      <div className="space-y-6">
        {banners.map((banner, index) => (
          <div key={banner.id} className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-on-surface uppercase">Quảng cáo {index + 1}</h3>
              <div className="relative group">
                <span className="material-symbols-outlined text-[16px] text-outline-variant hover:text-primary cursor-help transition-colors">info</span>
                <div className="absolute left-0 bottom-full mb-2 w-64 bg-surface-container-highest text-on-surface text-xs rounded-xl p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-outline-variant/20">
                  <p className="font-bold mb-1 text-primary">Thông số khuyến nghị:</p>
                  <ul className="list-disc pl-4 space-y-1 text-on-surface-variant">
                    <li>Định dạng: <span className="font-bold">JPG, PNG, WEBP</span></li>
                    <li>Dung lượng: <span className="font-bold">Tối đa 2MB</span></li>
                    <li>Kích thước: Tỷ lệ ngang <span className="font-bold">~2.5:1</span><br/>(Ví dụ: 1000x400px hoặc 1200x480px) để hiển thị đẹp nhất không bị méo.</li>
                  </ul>
                  <div className="absolute left-1.5 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-surface-container-highest"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Đường dẫn ảnh hoặc Tải lên</label>
                <div className="flex gap-2 h-[42px]">
                  <input 
                    type="text" 
                    value={banner.url} 
                    onChange={(e) => handleUpdateBanner(index, 'url', e.target.value)}
                    className="flex-1 px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-sm focus:outline-none focus:border-primary h-full"
                    placeholder="/promo_1.png hoặc https://..."
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRefs[index]} 
                    onChange={(e) => handleImageUpload(index, e)} 
                  />
                  <button 
                    onClick={() => fileInputRefs[index].current.click()}
                    className="bg-surface-container hover:bg-primary/10 text-primary px-4 rounded-xl text-sm font-bold border border-outline-variant/40 hover:border-primary/40 transition-all flex items-center justify-center gap-1 h-full whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    Tải ảnh
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-outline uppercase tracking-wider mb-2">Mã Giảm Giá (Tự động điền)</label>
                <div className="relative h-[42px]">
                  <select 
                    value={banner.voucherId} 
                    onChange={(e) => handleUpdateBanner(index, 'voucherId', e.target.value)}
                    className="w-full h-full px-3 bg-surface-container-low border border-outline-variant/60 rounded-xl text-sm focus:outline-none focus:border-primary uppercase appearance-none cursor-pointer"
                  >
                    <option value="">-- Không đính kèm mã --</option>
                    {vouchers.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.voucherName} - Giảm {v.discountValue}%
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>
            {banner.url && (
               <div className="mt-5 rounded-2xl overflow-hidden border border-outline-variant/20 h-[180px] w-full relative group shadow-sm">
                 <img src={banner.url} alt={`Banner ${index+1}`} className="w-full h-full object-cover" />
               </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-outline-variant/20">
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95 text-sm uppercase tracking-wider"
        >
          {isLoading ? 'Đang lưu...' : 'Lưu thiết lập'}
        </button>
      </div>
    </div>
  );
}
