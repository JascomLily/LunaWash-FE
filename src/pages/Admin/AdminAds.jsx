import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import API_BASE from '../../config';

const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || null;
  } catch { return null; }
};

export default function AdminAds() {
  const [activeTab, setActiveTab] = useState('Web'); // 'Web' or 'App'
  
  const defaultBanners = [
    { id: 1, url: '', voucherId: '', isHidden: false, platformType: 'Web' },
    { id: 2, url: '', voucherId: '', isHidden: false, platformType: 'Web' },
    { id: 3, url: '', voucherId: '', isHidden: false, platformType: 'Web' }
  ];

  const defaultAppBanners = [
    { id: 1, url: '', voucherId: '', isHidden: false, platformType: 'App' },
    { id: 2, url: '', voucherId: '', isHidden: false, platformType: 'App' },
    { id: 3, url: '', voucherId: '', isHidden: false, platformType: 'App' }
  ];

  const [webBanners, setWebBanners] = useState([...defaultBanners]);
  const [appBanners, setAppBanners] = useState([...defaultAppBanners]);
  
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const baseUrl = API_BASE;
        const response = await fetch(`${baseUrl}/api/vouchers/all`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        const data = await response.json();
        if (data.success) {
          setVouchers(data.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải vouchers:', error);
      }
    };

    const fetchBanners = async (platform, setter) => {
      try {
        const baseUrl = API_BASE;
        const response = await fetch(`${baseUrl}/api/banners?platform=${platform}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const newBanners = data.data.map((b, idx) => ({
            id: idx + 1,
            url: b.imageUrl,
            voucherId: b.voucherId || '',
            isHidden: b.isHidden,
            platformType: b.platformType
          }));
          
          setter(prev => prev.map((p, i) => newBanners[i] || p));
        }
      } catch (error) {
        console.error(`Lỗi khi tải banners ${platform}:`, error);
      }
    };

    fetchVouchers();
    fetchBanners('Web', setWebBanners);
    fetchBanners('App', setAppBanners);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const allBanners = [...webBanners, ...appBanners];
      const payload = allBanners.map(b => ({
        ImageUrl: b.url,
        VoucherId: b.voucherId || null,
        PlatformType: b.platformType,
        IsHidden: b.isHidden
      }));

      const baseUrl = API_BASE;
      const response = await fetch(`${baseUrl}/api/banners/save`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
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

  const currentBanners = activeTab === 'Web' ? webBanners : appBanners;
  const setCurrentBanners = activeTab === 'Web' ? setWebBanners : setAppBanners;

  const handleUpdateBanner = (index, field, value) => {
    const newBanners = [...currentBanners];
    newBanners[index][field] = value;
    setCurrentBanners(newBanners);
  };

  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB!');
        return;
      }
      
      setIsUploading(true);
      const loadingToast = toast.loading('Đang tải ảnh lên Cloudinary...');
      
      try {
        const formData = new FormData();
        formData.append('file', file);

        const baseUrl = API_BASE;
        const response = await fetch(`${baseUrl}/api/banners/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          },
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          handleUpdateBanner(index, 'url', data.url);
          toast.success('Tải ảnh lên thành công!', { id: loadingToast });
        } else {
          toast.error('Lỗi khi tải ảnh lên server.', { id: loadingToast });
        }
      } catch (error) {
        console.error(error);
        toast.error('Lỗi kết nối khi tải ảnh.', { id: loadingToast });
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto min-h-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Quản lý Quảng Cáo</h1>
          <p className="text-sm text-on-surface-variant">
            Thiết lập tối đa 3 ảnh quảng cáo chạy trên trang chủ Web và 3 cho App.
          </p>
        </div>
        <div className="flex bg-surface-container p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('Web')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'Web' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Banner Web
          </button>
          <button
            onClick={() => setActiveTab('App')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'App' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Banner App
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {currentBanners.map((banner, index) => (
          <div key={banner.id} className={`bg-surface-container-lowest border ${banner.isHidden ? 'border-error/40 bg-error-container/5' : 'border-outline-variant/40'} rounded-2xl p-5 shadow-sm transition-colors`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-bold uppercase ${banner.isHidden ? 'text-error' : 'text-on-surface'}`}>Quảng cáo {index + 1} {banner.isHidden && '(Đang Ẩn)'}</h3>
                <div className="relative group">
                  <span className="material-symbols-outlined text-[16px] text-outline-variant hover:text-primary cursor-help transition-colors">info</span>
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-surface-container-highest text-on-surface text-xs rounded-xl p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-outline-variant/20">
                    <p className="font-bold mb-1 text-primary">Thông số khuyến nghị:</p>
                    <ul className="list-disc pl-4 space-y-1 text-on-surface-variant">
                      <li>Định dạng: <span className="font-bold">JPG, PNG, WEBP</span></li>
                      <li>Kích thước tối ưu: Tỷ lệ ngang <span className="font-bold">~2.5:1</span></li>
                    </ul>
                    <div className="absolute left-1.5 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-surface-container-highest"></div>
                  </div>
                </div>
              </div>
              <label className="flex items-center cursor-pointer gap-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase">Hiển thị</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={!banner.isHidden} onChange={(e) => handleUpdateBanner(index, 'isHidden', !e.target.checked)} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${!banner.isHidden ? 'bg-primary' : 'bg-surface-container-highest'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${!banner.isHidden ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
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
                    placeholder="https://..."
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
                    disabled={isUploading}
                    className="bg-surface-container hover:bg-primary/10 disabled:opacity-50 text-primary px-4 rounded-xl text-sm font-bold border border-outline-variant/40 hover:border-primary/40 transition-all flex items-center justify-center gap-1 h-full whitespace-nowrap"
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
               <div className="mt-5 rounded-2xl overflow-hidden border border-outline-variant/20 h-[180px] w-full relative group shadow-sm bg-surface-container">
                 <img src={banner.url} alt={`Banner ${index+1}`} className={`w-full h-full object-cover transition-all ${banner.isHidden ? 'opacity-40 grayscale' : ''}`} />
                 {banner.isHidden && <div className="absolute inset-0 flex items-center justify-center"><span className="bg-error text-white px-4 py-2 rounded-xl font-bold text-sm">ĐÃ ẨN</span></div>}
               </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isLoading || isUploading}
          className="bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95 text-sm uppercase tracking-wider flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          {isLoading ? 'Đang lưu...' : 'Lưu thiết lập Banners'}
        </button>
      </div>
    </div>
  );
}
