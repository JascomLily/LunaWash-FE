import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AdminTransactions = () => {
  const [methods, setMethods] = useState({
    cash: true,
    vnpay: false
  });

  // API State
  const [apiKeys, setApiKeys] = useState({ tmnCode: 'LUNAWASH99', hashSecret: 'LUNA_SECRET_KEY_9999' });
  const [tempKeys, setTempKeys] = useState({ tmnCode: '', hashSecret: '' });
  
  // UI State
  const [isEditingApi, setIsEditingApi] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [showKeys, setShowKeys] = useState(false);

  const handleToggle = (key) => {
    if (methods[key]) {
      const activeCount = Object.values(methods).filter(Boolean).length;
      if (activeCount <= 1) {
        toast.error('Phải giữ lại ít nhất 1 phương thức thanh toán!');
        return;
      }
    }
    
    setMethods(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    if (!methods[key]) {
      toast.success('Đã bật phương thức thanh toán');
    } else {
      toast.success('Đã tắt phương thức thanh toán');
    }
  };

  const handleAddClick = () => {
    toast('Vui lòng liên hệ bộ phận Kỹ thuật (Dev) để lập trình tích hợp thêm cổng thanh toán mới.', {
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

  const confirmSave = () => {
    setApiKeys({ ...tempKeys });
    setIsEditingApi(false);
    setShowWarningModal(false);
    setShowKeys(false);
    toast.success('Đã cập nhật mã API thanh toán!');
  };

  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto min-h-full space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Phương thức thanh toán</h1>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            Quản lý các cổng thanh toán đang được phép sử dụng trên hệ thống LunaWash. 
            Bạn có thể bật/tắt tùy theo tình trạng hoạt động của đối tác.
          </p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all w-fit"
        >
          <span className="material-symbols-outlined">add</span>
          Thêm phương thức
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tiền mặt */}
        <div className={`bg-surface-container-lowest rounded-3xl p-6 border transition-all duration-300 ${methods.cash ? 'border-primary/50 shadow-md ring-1 ring-primary/10' : 'border-outline-variant/30 shadow-sm opacity-70'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <span className="material-symbols-outlined text-3xl">payments</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">Tiền mặt</h3>
                <p className="text-sm text-on-surface-variant">Thanh toán tại quầy</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={methods.cash} onChange={() => handleToggle('cash')} />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="bg-surface-container-low rounded-xl p-4 text-sm text-on-surface-variant border border-outline-variant/20 h-[100px] flex items-center">
            Khách hàng sẽ thanh toán bằng tiền mặt sau khi hoàn tất dịch vụ tại chi nhánh. Không yêu cầu cấu hình API.
          </div>
        </div>

        {/* VNPay */}
        <div className={`bg-surface-container-lowest rounded-3xl p-6 border transition-all duration-300 ${methods.vnpay ? 'border-primary/50 shadow-md ring-1 ring-primary/10' : 'border-outline-variant/30 shadow-sm opacity-70'}`}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                <span className="material-symbols-outlined text-3xl">account_balance</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">VNPay</h3>
                <p className="text-sm text-on-surface-variant">Cổng thanh toán điện tử</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={methods.vnpay} onChange={() => handleToggle('vnpay')} />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 space-y-3 min-h-[100px]">
            <p className="text-sm text-on-surface-variant">Thanh toán qua mã QR, thẻ ATM, thẻ quốc tế. Tiền về thẳng tài khoản doanh nghiệp.</p>
            {methods.vnpay && (
              <div className="space-y-3 mt-3 pt-3 border-t border-outline-variant/20 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Terminal ID (vnp_TmnCode)</label>
                  <input 
                    type={isEditingApi || showKeys ? "text" : "password"} 
                    value={isEditingApi ? tempKeys.tmnCode : apiKeys.tmnCode}
                    onChange={(e) => setTempKeys({...tempKeys, tmnCode: e.target.value})}
                    readOnly={!isEditingApi} 
                    className={`w-full bg-background border ${isEditingApi ? 'border-primary/50 ring-1 ring-primary/20' : 'border-outline-variant/40'} rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none`} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Secret Key (vnp_HashSecret)</label>
                  <div className="relative">
                    <input 
                      type={showKeys ? "text" : "password"} 
                      value={isEditingApi ? tempKeys.hashSecret : apiKeys.hashSecret}
                      onChange={(e) => setTempKeys({...tempKeys, hashSecret: e.target.value})}
                      readOnly={!isEditingApi} 
                      className={`w-full bg-background border ${isEditingApi ? 'border-primary/50 ring-1 ring-primary/20' : 'border-outline-variant/40'} rounded-lg px-3 py-1.5 pr-10 text-sm text-on-surface focus:outline-none`} 
                    />
                    {isEditingApi && (
                      <button 
                        onClick={() => setShowKeys(!showKeys)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[18px]">{showKeys ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end mt-2 pt-2">
                  {!isEditingApi ? (
                    <button onClick={handleEditClick} className="text-xs font-bold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      Chỉnh sửa cấu hình
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditingApi(false)} className="text-xs font-bold text-on-surface-variant hover:underline bg-surface-variant px-3 py-1.5 rounded-md">
                        Hủy
                      </button>
                      <button onClick={handleSaveClick} className="text-xs font-bold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">save</span>
                        Lưu thay đổi
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest p-6 rounded-3xl w-[90%] max-w-sm shadow-2xl border border-outline-variant/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <h3 className="font-bold text-lg text-on-surface">Yêu cầu bảo mật</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">Vui lòng nhập mật khẩu quản trị (Mật khẩu: admin123) để xem hoặc chỉnh sửa mã API.</p>
            <input 
              type="password" 
              placeholder="Nhập mật khẩu..." 
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full border border-outline-variant/40 rounded-xl px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none mb-6"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowAuthModal(false)} className="px-4 py-2 rounded-full text-sm font-bold text-on-surface-variant hover:bg-surface-container">Hủy</button>
              <button onClick={submitAuth} className="px-4 py-2 rounded-full text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest p-6 rounded-3xl w-[90%] max-w-md shadow-2xl border border-error/30">
            <div className="flex items-center gap-3 mb-4 text-error">
              <span className="material-symbols-outlined text-4xl">warning</span>
              <h3 className="font-bold text-xl">Cảnh báo nghiêm trọng</h3>
            </div>
            <div className="bg-error-container/30 text-on-surface p-4 rounded-xl border border-error/20 mb-6 space-y-3">
              <p className="text-sm">
                Việc thay đổi cấu hình API sẽ <strong>trực tiếp ảnh hưởng đến dòng tiền</strong> của doanh nghiệp.
              </p>
              <p className="text-sm">
                Nếu cấu hình sai lệch, tiền của khách hàng có thể bị chuyển nhầm hoặc giao dịch không thể thực hiện.
              </p>
              <div className="p-3 bg-error/10 border-l-4 border-error rounded-r-lg mt-2">
                <p className="text-sm font-bold text-error">Bạn (Tài khoản Admin) phải chịu hoàn toàn trách nhiệm pháp lý và đền bù tổn thất nếu việc thay đổi này gây ra hậu quả sai lệch tài chính.</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowWarningModal(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-on-surface-variant hover:bg-surface-container border border-outline-variant/30">Hủy, tôi chưa chắc chắn</button>
              <button onClick={confirmSave} className="px-5 py-2.5 rounded-full text-sm font-bold bg-error text-white hover:bg-error/90 shadow-md shadow-error/20">Tôi đồng ý rủi ro và Lưu</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTransactions;
