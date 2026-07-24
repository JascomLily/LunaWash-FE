import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AdminTransactions = () => {
  const [loading, setLoading] = useState(true);
  const [methods, setMethods] = useState({
    cash: true,
    vnpay: false,
    momo: false,
    zalopay: false
  });

  // API State
  const [apiKeys, setApiKeys] = useState({ tmnCode: '', hashSecret: '' });
  const [tempKeys, setTempKeys] = useState({ tmnCode: '', hashSecret: '' });
  
  // UI State
  const [isEditingApi, setIsEditingApi] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/Settings/payments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Không thể tải cấu hình thanh toán');
      const data = await res.json();
      
      setMethods({
        cash: data.isCashActive,
        vnpay: data.isVnpayActive,
        momo: data.isMomoActive,
        zalopay: data.isZaloPayActive
      });
      setApiKeys({
        tmnCode: data.vnpayTmnCode || '',
        hashSecret: data.vnpayHashSecret || ''
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSettingsAPI = async (newMethods, newKeys) => {
    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : '';
      
      const payload = {
        isCashActive: newMethods.cash,
        isVnpayActive: newMethods.vnpay,
        isMomoActive: newMethods.momo,
        isZaloPayActive: newMethods.zalopay,
        vnpayTmnCode: newKeys.tmnCode,
        vnpayHashSecret: newKeys.hashSecret
      };

      const res = await fetch(import.meta.env.VITE_API_URL + '/api/Settings/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Cập nhật cấu hình thất bại');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const handleToggle = async (key) => {
    const newMethods = { ...methods, [key]: !methods[key] };
    const activeCount = Object.values(newMethods).filter(Boolean).length;
    
    if (activeCount === 0) {
      toast.error('Phải giữ lại ít nhất 1 phương thức thanh toán!');
      return;
    }
    
    // Optimistic UI Update
    setMethods(newMethods);
    
    const success = await updateSettingsAPI(newMethods, apiKeys);
    if (success) {
      if (newMethods[key]) {
        toast.success(`Đã bật thanh toán bằng ${key.toUpperCase()}`);
      } else {
        toast.success(`Đã tắt thanh toán bằng ${key.toUpperCase()}`);
      }
    } else {
      // Revert if failed
      setMethods(methods);
    }
  };

  const handleAddClick = () => {
    toast('Vui lòng liên hệ Kỹ thuật (Dev) để tích hợp cổng thanh toán mới.', {
      icon: '👨‍💻',
      duration: 5000,
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  const handleEditClick = () => {
    setAuthPassword('');
    setShowAuthModal(true);
  };

  const submitAuth = () => {
    if (authPassword === 'admin123') {
      setShowAuthModal(false);
      setIsEditingApi(true);
      setTempKeys({ ...apiKeys });
      toast.success('Xác thực thành công');
    } else {
      toast.error('Mật khẩu không chính xác!');
    }
  };

  const handleSaveClick = () => {
    setShowWarningModal(true);
  };

  const confirmSave = async () => {
    const success = await updateSettingsAPI(methods, tempKeys);
    if (success) {
      setApiKeys({ ...tempKeys });
      setIsEditingApi(false);
      setShowWarningModal(false);
      setShowKeys(false);
      toast.success('Đã cập nhật mã API thanh toán!');
    } else {
      setShowWarningModal(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant font-bold">Đang tải cấu hình...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto min-h-full space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            Cổng Thanh Toán
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Quản lý các phương thức thanh toán trực tuyến và tại quầy. Việc thay đổi trạng thái sẽ lập tức có hiệu lực đối với mọi khách hàng đang đặt lịch trên hệ thống.
          </p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-secondary text-white px-5 py-3 rounded-xl font-bold shadow-md hover:bg-secondary/90 transition-all w-fit whitespace-nowrap"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Thêm cổng mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tiền mặt */}
        <div className={`relative overflow-hidden bg-surface-container-lowest rounded-3xl p-6 border transition-all duration-500 hover:shadow-lg ${methods.cash ? 'border-emerald-500/50 shadow-emerald-500/10' : 'border-outline-variant/30 opacity-70 grayscale-[30%]'}`}>
          {methods.cash && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-10 pointer-events-none"></div>}
          
          <div className="flex justify-between items-start mb-6 z-10 relative">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm transition-colors ${methods.cash ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-500' : 'bg-surface-variant text-on-surface-variant border-outline-variant/50'}`}>
                <span className="material-symbols-outlined text-3xl">payments</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-on-surface">Tiền mặt</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-medium bg-surface-container-low px-2 py-1 rounded w-fit">Thanh toán tại quầy</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={methods.cash} onChange={() => handleToggle('cash')} />
              <div className="w-12 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>
          </div>
          
          <div className="bg-surface-container-low/50 rounded-2xl p-5 text-sm text-on-surface-variant border border-outline-variant/20 h-[120px] flex items-center shadow-inner">
            <p className="leading-relaxed">Cho phép khách hàng thanh toán bằng tiền mặt trực tiếp cho nhân viên hoặc thu ngân sau khi sử dụng xong dịch vụ tại trung tâm.</p>
          </div>
        </div>

        {/* VNPay */}
        <div className={`relative overflow-hidden bg-surface-container-lowest rounded-3xl p-6 border transition-all duration-500 hover:shadow-lg ${methods.vnpay ? 'border-blue-500/50 shadow-blue-500/10' : 'border-outline-variant/30 opacity-70 grayscale-[30%]'}`}>
          {methods.vnpay && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10 pointer-events-none"></div>}
          
          <div className="flex justify-between items-start mb-6 z-10 relative">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm transition-colors ${methods.vnpay ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-600' : 'bg-surface-variant text-on-surface-variant border-outline-variant/50'}`}>
                <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
              </div>
              <div>
                <h3 className="font-bold text-xl text-on-surface">VNPAY</h3>
                <p className="text-xs text-on-surface-variant mt-1 font-medium bg-surface-container-low px-2 py-1 rounded w-fit">Cổng thanh toán điện tử</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={methods.vnpay} onChange={() => handleToggle('vnpay')} />
              <div className="w-12 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
          </div>
          
          <div className="bg-surface-container-low/50 rounded-2xl p-5 border border-outline-variant/20 shadow-inner min-h-[120px]">
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">Chấp nhận thanh toán bằng ứng dụng Mobile Banking của các ngân hàng, thẻ nội địa và thẻ quốc tế.</p>
            
            {methods.vnpay && (
              <div className="space-y-4 pt-4 border-t border-outline-variant/30 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Terminal ID (vnp_TmnCode)</label>
                  <input 
                    type={isEditingApi || showKeys ? "text" : "password"} 
                    value={isEditingApi ? tempKeys.tmnCode : apiKeys.tmnCode}
                    onChange={(e) => setTempKeys({...tempKeys, tmnCode: e.target.value})}
                    readOnly={!isEditingApi} 
                    className={`w-full bg-white border ${isEditingApi ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-outline-variant/40'} rounded-xl px-4 py-2.5 text-sm text-on-surface font-mono transition-all outline-none`} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Secret Key (vnp_HashSecret)</label>
                  <div className="relative">
                    <input 
                      type={showKeys ? "text" : "password"} 
                      value={isEditingApi ? tempKeys.hashSecret : apiKeys.hashSecret}
                      onChange={(e) => setTempKeys({...tempKeys, hashSecret: e.target.value})}
                      readOnly={!isEditingApi} 
                      className={`w-full bg-white border ${isEditingApi ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-outline-variant/40'} rounded-xl px-4 py-2.5 pr-12 text-sm text-on-surface font-mono transition-all outline-none`} 
                    />
                    {isEditingApi && (
                      <button 
                        onClick={() => setShowKeys(!showKeys)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-blue-600 transition-colors bg-surface-container-low p-1 rounded-md"
                      >
                        <span className="material-symbols-outlined text-[18px] block">{showKeys ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end pt-3">
                  {!isEditingApi ? (
                    <button onClick={handleEditClick} className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">edit_note</span>
                      Cấu hình API
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button onClick={() => setIsEditingApi(false)} className="text-sm font-bold text-on-surface-variant bg-surface-variant/50 hover:bg-surface-variant px-4 py-2 rounded-xl transition-colors">
                        Hủy
                      </button>
                      <button onClick={handleSaveClick} className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 px-5 py-2 rounded-xl flex items-center gap-2 transition-all">
                        <span className="material-symbols-outlined text-[16px]">save</span>
                        Lưu thiết lập
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>



      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-4">
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] w-full max-w-sm shadow-2xl border border-outline-variant/20">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-4 ring-8 ring-error-container/30">
                <span className="material-symbols-outlined text-3xl">security</span>
              </div>
              <h3 className="font-black text-xl text-on-surface mb-2">Bảo mật cấp cao</h3>
              <p className="text-sm text-on-surface-variant">Xác thực quyền Quản trị tối cao (Mật khẩu: admin123) để can thiệp mã API.</p>
            </div>
            
            <div className="space-y-6">
              <input 
                type="password" 
                placeholder="Nhập mật khẩu quản trị..." 
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                autoFocus
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-5 py-4 text-center tracking-widest text-lg font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAuthModal(false)} className="flex-1 py-3.5 rounded-xl text-sm font-bold text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-colors">Hủy</button>
                <button onClick={submitAuth} className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">Xác thực</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legal Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in p-4">
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] w-full max-w-md shadow-2xl border border-error/20">
            <div className="flex flex-col items-center text-center mb-6">
              <span className="material-symbols-outlined text-6xl text-error mb-4 animate-pulse">warning</span>
              <h3 className="font-black text-2xl text-error mb-2">Cảnh báo rủi ro!</h3>
            </div>
            
            <div className="bg-error-container/30 text-on-surface p-5 rounded-2xl border border-error/20 mb-8 space-y-4 shadow-inner">
              <p className="text-sm font-medium leading-relaxed">
                Hành động thay đổi API Key sẽ <strong>trực tiếp thay đổi tài khoản nhận tiền</strong> của toàn bộ hệ thống LunaWash.
              </p>
              <div className="p-4 bg-error/10 border-l-4 border-error rounded-r-xl">
                <p className="text-sm font-bold text-error leading-relaxed">Nếu mã cấu hình bị sai, khách hàng vẫn bị trừ tiền nhưng hệ thống sẽ không ghi nhận. Vui lòng kiểm tra kỹ lưỡng trước khi Lưu!</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => setShowWarningModal(false)} className="flex-1 py-3.5 rounded-xl text-sm font-bold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors">Kiểm tra lại</button>
              <button onClick={confirmSave} className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-error text-white hover:bg-error/90 shadow-lg shadow-error/20 transition-all">Lưu đè cấu hình</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTransactions;
