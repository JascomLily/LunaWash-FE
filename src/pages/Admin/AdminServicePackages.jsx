import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5010/api/services';

const AVAILABLE_ICONS = [
  'water_drop', 'cool_to_dry', 'diamond', 'star', 
  'local_car_wash', 'directions_car', 'build', 'settings',
  'airline_seat_recline_normal', 'fact_check', 'layers', 'shield',
  'auto_awesome', 'verified', 'workspace_premium', 'speed', 'add_box'
];

const CAR_TYPES = [
  { id: 'VT-OTO-2C', name: 'Ô tô 2 chỗ (Mini)', p: 1, t: 1 },
  { id: 'VT-OTO-4C', name: 'Ô tô 4 chỗ (Sedan)', p: 1.6666, t: 1.5 },
  { id: 'VT-OTO-7C', name: 'Ô tô 7 chỗ (MPV/Crossover)', p: 2, t: 1.6666 },
  { id: 'VT-OTO-BT', name: 'Xe bán tải (Pickup)', p: 2.3333, t: 2 },
  { id: 'VT-OTO-SUV', name: 'SUV cỡ lớn', p: 3, t: 2.5 }
];

const formatNumberInput = (val) => {
  if (val === undefined || val === null || val === '') return '';
  const num = val.toString().replace(/\D/g, '');
  if (!num) return '';
  return parseInt(num).toLocaleString('vi-VN');
};

const formatShortPrice = (priceStr) => {
  if (!priceStr) return '0k';
  const num = parseInt(priceStr.toString().replace(/\./g, ''));
  if (isNaN(num)) return '0k';
  return (num / 1000) + 'k';
};

const calculateDiscount = (priceStr, percent) => {
  if (!priceStr) return '0k';
  const num = parseInt(priceStr.toString().replace(/\./g, ''));
  if (isNaN(num)) return '0k';
  const discounted = num * (1 - percent / 100);
  return (discounted / 1000) + 'k';
};


const MainPackageCard = ({ pkg, onSave, onDelete, editingCardId, setEditingCardId }) => {
  const [details, setDetails] = useState(pkg.serviceFeatures || []);
  const [currentIcon, setCurrentIcon] = useState(pkg.iconName || 'water_drop');
  const [showIconPicker, setShowIconPicker] = useState(false);
  
  const [title, setTitle] = useState(pkg.serviceName || '');
  const [basePrice, setBasePrice] = useState(pkg.prices?.[0]?.price ? formatNumberInput(pkg.prices[0].price) : '');
  const [baseTime, setBaseTime] = useState(pkg.prices?.[0]?.durationMinutes ? pkg.prices[0].durationMinutes.toString() : '');
  const [basePoints, setBasePoints] = useState(pkg.prices?.[0]?.pointsRewarded ? formatNumberInput(pkg.prices[0].pointsRewarded) : '');
  const [description, setDescription] = useState(pkg.description || '');
  const [isPopular, setIsPopular] = useState(pkg.isPopular || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditChange = () => {
    if (editingCardId && editingCardId !== pkg.id) return;
    setEditingCardId(pkg.id);
  };

  const isLocked = editingCardId && editingCardId !== pkg.id;

  const handleAddDetail = () => setDetails([...details, ""]);
  const handleRemoveDetail = (index) => setDetails(details.filter((_, i) => i !== index));
  const handleDetailChange = (index, val) => {
    const newDetails = [...details];
    newDetails[index] = val;
    setDetails(newDetails);
  };

  const handleSave = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn lưu thay đổi này không?")) return;
    setIsSaving(true);
    const updatedPkg = {
      id: pkg.id,
      serviceName: title,
      description: description,
      serviceType: 'Package',
      iconName: currentIcon,
      isPopular: isPopular,
      isActive: true,
      serviceFeatures: details.filter(d => d.trim() !== ''),
      prices: CAR_TYPES.map(car => ({
        vehicleTypeId: car.id,
        price: parseFloat(basePrice.toString().replace(/\D/g, '')) || 0,
        durationMinutes: parseInt(baseTime.toString().replace(/\D/g, '')) || 0,
        pointsRewarded: parseInt(basePoints.toString().replace(/\D/g, '')) || 0
      }))
    };
    await onSave(updatedPkg);
    setEditingCardId(null);
    setIsSaving(false);
  };

  const iconBg = 'bg-primary/10';
  const iconColor = 'text-primary';

  return (
    <div className={`bg-surface-container-lowest rounded-3xl border ${isPopular ? 'border-primary shadow-md' : 'border-outline-variant/40 shadow-sm'} p-4 flex flex-col transition-all relative overflow-hidden group ${isLocked ? 'opacity-50 pointer-events-none' : 'hover:shadow-md hover:border-primary/50'}`} onChange={handleEditChange} onClick={() => { if (!isLocked && !editingCardId) setEditingCardId(pkg.id); }}>
      {isLocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface/40 backdrop-blur-[1px]">
          <div className="bg-white px-3 py-1.5 rounded-lg shadow font-bold text-xs text-error border border-error/20">
            Vui lòng lưu gói đang sửa!
          </div>
        </div>
      )}
      {isPopular && (
        <span className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-3xl shadow-sm z-10">
          Phổ biến
        </span>
      )}
      <div className="absolute top-2 right-2 z-20">
         <label className="flex items-center gap-1 cursor-pointer">
           <input type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} className="accent-primary w-3 h-3 cursor-pointer" />
           <span className="text-[9px] font-bold text-outline">Gắn nhãn phổ biến</span>
         </label>
      </div>
      <div className="relative z-10 flex flex-col h-full mt-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div onClick={() => setShowIconPicker(!showIconPicker)} className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} shadow-inner cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all group/icon`} title="Đổi biểu tượng">
              <span className="material-symbols-outlined text-[22px] font-light group-hover/icon:scale-110 transition-transform">{currentIcon}</span>
            </div>
            {showIconPicker && (
              <div className="absolute top-12 left-0 bg-surface-container-high border border-outline-variant/50 rounded-xl p-2 shadow-xl z-50 grid grid-cols-4 gap-1 w-48 animate-fade-in">
                {AVAILABLE_ICONS.map(ic => (
                  <button key={ic} onClick={() => { setCurrentIcon(ic); setShowIconPicker(false); }} className={`p-2 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors ${currentIcon === ic ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    <span className="material-symbols-outlined text-[20px]">{ic}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-[9px] font-extrabold text-outline uppercase tracking-widest mb-0.5">TÊN GÓI</div>
            <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Nhập tên gói" className="text-lg font-black text-on-surface bg-transparent focus:outline-none focus:border-b-2 focus:border-primary w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest mb-1.5">GIÁ (VND)</label>
            <input type="text" value={basePrice} placeholder="0" onChange={e=>setBasePrice(formatNumberInput(e.target.value))} className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" />
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest mb-1.5">THỜI GIAN (PHÚT)</label>
            <input type="text" value={baseTime} placeholder="0" onChange={e=>setBaseTime(e.target.value.replace(/\D/g, ''))} className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-[9px] font-extrabold text-amber-600 uppercase tracking-widest mb-1.5 flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">stars</span> ĐIỂM TÍCH LŨY</label>
          <input type="text" value={basePoints} placeholder="0" onChange={e=>setBasePoints(formatNumberInput(e.target.value))} className="w-full px-3 py-1.5 bg-amber-50/50 border border-amber-200 rounded-xl text-amber-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow" />
        </div>

        <div className="mb-4 flex-1 flex flex-col gap-3">
          <div>
            <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest mb-1.5">MÔ TẢ NGẮN</label>
            <textarea rows="2" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Nhập mô tả..." className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-shadow leading-relaxed"></textarea>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest">CHI TIẾT DỊCH VỤ</label>
              <button onClick={handleAddDetail} className="text-primary hover:bg-primary/10 rounded-full p-0.5 transition-colors" title="Thêm chi tiết">
                <span className="material-symbols-outlined text-[14px]">add</span>
              </button>
            </div>
            <div className="space-y-1.5">
              {details.map((detail, index) => (
                <div key={index} className="flex items-center gap-2 group animate-fade-in">
                  <span className="material-symbols-outlined text-[14px] text-green-600">check</span>
                  <input type="text" value={detail} onChange={(e) => handleDetailChange(index, e.target.value)} placeholder="Nhập chi tiết..." className="flex-1 bg-transparent text-xs text-on-surface font-medium border-b border-transparent focus:border-primary focus:outline-none py-0.5" />
                  <button onClick={() => handleRemoveDetail(index)} className="text-outline-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity" title="Xóa">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-auto pt-3 border-t border-outline-variant/20">
          <button onClick={(e) => { e.stopPropagation(); handleSave(); }} disabled={isSaving} className="flex-1 bg-primary hover:bg-primary-container text-white font-bold py-2 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider disabled:opacity-50">
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(pkg.id); }} className="p-2 border border-outline-variant text-on-surface-variant hover:text-error hover:border-error hover:bg-error-container/20 rounded-xl transition-all active:scale-95 shadow-sm" title="Xóa gói">
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ToppingCard = ({ pkg, onSave, onDelete, editingCardId, setEditingCardId }) => {
  const isOriginallyVariable = pkg.prices?.length > 1 && !pkg.prices.every(p => p.price === pkg.prices[0].price && p.durationMinutes === pkg.prices[0].durationMinutes);
  const [isVariable, setIsVariable] = useState(isOriginallyVariable);
  const [currentIcon, setCurrentIcon] = useState(pkg.iconName || 'build');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const [title, setTitle] = useState(pkg.serviceName || '');
  const [description, setDescription] = useState(pkg.description || '');
  const [basePrice, setBasePrice] = useState(pkg.prices?.[0]?.price ? formatNumberInput(pkg.prices[0].price) : '');
  const [baseTime, setBaseTime] = useState(pkg.prices?.[0]?.durationMinutes ? pkg.prices[0].durationMinutes.toString() : '');
  const [basePoints, setBasePoints] = useState(pkg.prices?.[0]?.pointsRewarded ? formatNumberInput(pkg.prices[0].pointsRewarded) : '');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditChange = () => {
    if (editingCardId && editingCardId !== pkg.id) return;
    setEditingCardId(pkg.id);
  };

  const isLocked = editingCardId && editingCardId !== pkg.id;

  // Variable price state
  const [varPrices, setVarPrices] = useState(CAR_TYPES.map(car => {
    const existingPrice = pkg.prices?.find(p => p.vehicleTypeId === car.id);
    return {
      vehicleTypeId: car.id,
      price: existingPrice?.price ? formatNumberInput(existingPrice.price) : (basePrice ? formatNumberInput(Math.round(parseFloat(basePrice.toString().replace(/\D/g, '')) * car.p)) : ''),
      durationMinutes: existingPrice?.durationMinutes ? existingPrice.durationMinutes.toString() : (baseTime ? Math.round(parseInt(baseTime) * car.t).toString() : '')
    };
  }));

  const handleVarPriceChange = (id, field, val) => {
    setVarPrices(varPrices.map(v => v.vehicleTypeId === id ? { ...v, [field]: val } : v));
  };

  const handleSave = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn lưu thay đổi này không?")) return;
    setIsSaving(true);
    let finalPrices = [];
    if (isVariable) {
      finalPrices = varPrices.map(v => ({
        vehicleTypeId: v.vehicleTypeId,
        price: parseFloat(v.price.toString().replace(/\D/g, '')) || 0,
        durationMinutes: parseInt(v.durationMinutes.toString().replace(/\D/g, '')) || 0,
        pointsRewarded: parseInt(basePoints.toString().replace(/\D/g, '')) || 0
      }));
    } else {
      finalPrices = CAR_TYPES.map(car => ({
        vehicleTypeId: car.id,
        price: parseFloat(basePrice.toString().replace(/\D/g, '')) || 0,
        durationMinutes: parseInt(baseTime.toString().replace(/\D/g, '')) || 0,
        pointsRewarded: parseInt(basePoints.toString().replace(/\D/g, '')) || 0
      }));
    }

    const updatedPkg = {
      id: pkg.id,
      serviceName: title,
      description: description,
      serviceType: 'AddOn',
      iconName: currentIcon,
      isPopular: false,
      isActive: true,
      serviceFeatures: [],
      prices: finalPrices
    };
    await onSave(updatedPkg);
    setEditingCardId(null);
    setIsSaving(false);
  };

  return (
    <div className={`bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-sm flex flex-col transition-all ${isLocked ? 'opacity-50 pointer-events-none' : 'hover:shadow-md hover:border-primary/30'} h-full`} onClick={() => { if (!isLocked && !editingCardId) setEditingCardId(pkg.id); }}>
      {isLocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-surface/40 backdrop-blur-[1px]">
          <div className="bg-white px-3 py-1.5 rounded-lg shadow font-bold text-xs text-error border border-error/20">
            Vui lòng lưu gói đang sửa!
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-outline-variant/30 pb-3">
        <input type="text" value={title} onChange={e=>setTitle(e.target.value)} className="flex-1 bg-transparent text-base font-black text-on-surface uppercase tracking-wide focus:outline-none focus:border-b-2 focus:border-primary px-1 py-0.5 w-full" placeholder="Tên dịch vụ" />
        <div className="relative">
          <div onClick={() => setShowIconPicker(!showIconPicker)} className="flex items-center gap-1 group/icon cursor-pointer p-1 rounded-lg hover:bg-surface-container transition-colors" title="Đổi biểu tượng">
            <span className="material-symbols-outlined text-primary text-[22px] group-hover/icon:scale-110 transition-transform">{currentIcon}</span>
          </div>
          {showIconPicker && (
            <div className="absolute top-10 right-0 bg-surface-container-high border border-outline-variant/50 rounded-xl p-2 shadow-xl z-50 grid grid-cols-4 gap-1 w-48 animate-fade-in">
              {AVAILABLE_ICONS.map(ic => (
                <button key={ic} onClick={() => { setCurrentIcon(ic); setShowIconPicker(false); }} className={`p-2 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors ${currentIcon === ic ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  <span className="material-symbols-outlined text-[20px]">{ic}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-3">
          <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest mb-1.5">MÔ TẢ NGẮN</label>
          <input type="text" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Mô tả dịch vụ kèm theo" className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-medium text-xs focus:outline-none focus:border-primary transition-shadow" />
      </div>

      <div className="space-y-4 mb-5 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <input type="checkbox" id={`vType-${pkg.id}`} checked={isVariable} onChange={(e) => setIsVariable(e.target.checked)} className="w-4 h-4 text-primary border-outline-variant/60 rounded focus:ring-primary cursor-pointer transition-all" />
          <label htmlFor={`vType-${pkg.id}`} className="text-[10px] font-bold text-on-surface select-none cursor-pointer">Giá theo loại xe</label>
        </div>
        
        {isVariable ? (
          <div className="bg-surface-container p-2 rounded-xl border border-outline-variant/30 space-y-2 animate-fade-in">
            <div className="grid grid-cols-12 gap-2 pb-1 border-b border-outline-variant/20 px-1">
              <div className="col-span-5 text-[8px] font-extrabold text-outline uppercase tracking-widest">Loại xe</div>
              <div className="col-span-4 text-[8px] font-extrabold text-outline uppercase tracking-widest">Giá (VND)</div>
              <div className="col-span-3 text-[8px] font-extrabold text-outline uppercase tracking-widest text-right">Phút</div>
            </div>
            {CAR_TYPES.map((car) => {
              const varPriceItem = varPrices.find(v => v.vehicleTypeId === car.id) || {price: '0', durationMinutes: '0'};
              return (
                <div key={car.id} className="grid grid-cols-12 gap-2 items-center px-1">
                  <div className="col-span-5 text-[10px] font-bold text-on-surface truncate pr-1" title={car.name}>{car.name}</div>
                  <input type="text" value={varPriceItem.price} placeholder="0" onChange={e => handleVarPriceChange(car.id, 'price', formatNumberInput(e.target.value))} className="col-span-4 px-1.5 py-1 bg-surface-container-lowest border border-outline-variant/60 rounded md:text-xs text-[10px] font-bold focus:outline-none focus:border-primary transition-colors" />
                  <input type="text" value={varPriceItem.durationMinutes} placeholder="0" onChange={e => handleVarPriceChange(car.id, 'durationMinutes', e.target.value.replace(/\D/g, ''))} className="col-span-3 px-1.5 py-1 bg-surface-container-lowest border border-outline-variant/60 rounded md:text-xs text-[10px] font-bold focus:outline-none focus:border-primary text-center transition-colors" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div>
              <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest mb-1">ĐƠN GIÁ (VND)</label>
              <input type="text" value={basePrice} placeholder="0" onChange={e=>setBasePrice(formatNumberInput(e.target.value))} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-on-surface font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest mb-1">THỜI GIAN (PHÚT)</label>
              <input type="text" value={baseTime} placeholder="0" onChange={e=>setBaseTime(e.target.value.replace(/\D/g, ''))} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-on-surface font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors" />
            </div>
          </div>
        )}
        <div className="pt-2 border-t border-outline-variant/20 mt-4">
          <label className="block text-[9px] font-extrabold text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">stars</span> ĐIỂM TÍCH LŨY</label>
          <input type="text" value={basePoints} placeholder="0" onChange={e=>setBasePoints(formatNumberInput(e.target.value))} className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-lg text-amber-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors" />
        </div>
      </div>
      <div className="flex gap-2 mt-auto">
        <button onClick={(e) => { e.stopPropagation(); handleSave(); }} disabled={isSaving} className="flex-1 bg-primary hover:bg-primary-container text-white font-bold py-2.5 rounded-lg transition-all text-xs uppercase tracking-wider shadow-sm active:scale-95 disabled:opacity-50">
          {isSaving ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(pkg.id); }} className="px-2 border border-outline-variant text-on-surface-variant hover:text-error hover:border-error hover:bg-error-container/20 rounded-lg transition-all shadow-sm active:scale-95" title="Xóa dịch vụ">
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  );
};

const AdminServicePackages = () => {
  const [mainPackages, setMainPackages] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCardId, setEditingCardId] = useState(null);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_BASE_URL);
      if (res.ok) {
        const data = await res.json();
        setMainPackages(data.filter(s => s.serviceType === 'Package'));
        setToppings(data.filter(s => s.serviceType === 'AddOn'));
      } else {
        alert("Lỗi khi tải danh sách dịch vụ!");
      }
    } catch (e) {
      console.error(e);
      alert("Không thể kết nối đến Backend API!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSaveService = async (pkgData) => {
    try {
      let isNew = String(pkgData.id).startsWith('temp_');
      let url = isNew ? API_BASE_URL : `${API_BASE_URL}/${pkgData.id}`;
      let method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkgData)
      });

      if (!res.ok) {
        alert('Lưu dịch vụ thất bại!');
        return;
      }

      let savedService = null;
      if (isNew) {
        savedService = await res.json();
      } else {
        savedService = pkgData; // For PUT, return might be 204 NoContent
      }

      const serviceId = isNew ? savedService.id : pkgData.id;

      // Save prices
      for (const price of pkgData.prices) {
        await fetch(`${API_BASE_URL}/${serviceId}/prices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(price)
        });
      }

      alert('Lưu thay đổi thành công!');
      fetchServices(); // Reload all to get latest DB state
    } catch (e) {
      console.error(e);
      alert('Lỗi khi lưu!');
    }
  };

  const handleDeleteService = async (id) => {
    if (String(id).startsWith('temp_')) {
      setMainPackages(mainPackages.filter(p => p.id !== id));
      setToppings(toppings.filter(p => p.id !== id));
      setEditingCardId(null);
      return;
    }
    
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (res.ok || res.status === 204) {
        alert('Xóa thành công!');
        fetchServices();
      } else {
        alert('Xóa thất bại!');
      }
    } catch (e) {
      console.error(e);
      alert('Lỗi kết nối khi xóa!');
    } finally {
      setEditingCardId(null);
    }
  };

  const handleAddMainPackage = () => {
    if (editingCardId) {
      alert("Vui lòng lưu gói đang sửa trước khi thêm gói mới!");
      return;
    }
    const newId = `temp_${Date.now()}`;
    setEditingCardId(newId);
    setMainPackages([...mainPackages, { id: newId, serviceName: '', description: '', serviceType: 'Package', iconName: 'water_drop', isPopular: false, prices: [], serviceFeatures: [] }]);
  };

  const handleAddTopping = () => {
    if (editingCardId) {
      alert("Vui lòng lưu gói đang sửa trước khi thêm dịch vụ kèm theo mới!");
      return;
    }
    const newId = `temp_${Date.now()}`;
    setEditingCardId(newId);
    setToppings([...toppings, { id: newId, serviceName: '', description: '', serviceType: 'AddOn', iconName: 'build', prices: [] }]);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-outline">Đang tải dữ liệu từ Database...</div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Quản lý Gói dịch vụ</h1>
        <p className="text-sm text-on-surface-variant max-w-3xl">
          Thiết lập và tùy chỉnh các gói rửa xe tự động cùng dịch vụ gia tăng cho hệ thống LunaWash. (Đã kết nối API)
        </p>
      </div>

      {/* Dịch vụ tự động */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 text-primary">
          <span className="material-symbols-outlined text-[24px]">local_laundry_service</span>
          <h2 className="text-base font-black uppercase tracking-wider">Dịch vụ tự động</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mainPackages.map(pkg => (
            <MainPackageCard key={pkg.id} pkg={pkg} onSave={handleSaveService} onDelete={handleDeleteService} editingCardId={editingCardId} setEditingCardId={setEditingCardId} />
          ))}
          <button onClick={handleAddMainPackage} className="rounded-3xl border-2 border-dashed border-outline-variant/50 hover:border-primary/50 bg-surface-container-low/30 hover:bg-primary/5 p-4 flex flex-col items-center justify-center min-h-[280px] transition-all group active:scale-95">
            <div className="h-12 w-12 rounded-full bg-surface-container group-hover:bg-primary/10 flex items-center justify-center text-outline group-hover:text-primary mb-3 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[28px]">add</span>
            </div>
            <span className="font-extrabold text-xs uppercase tracking-wider text-outline group-hover:text-primary transition-colors">Thêm gói tự động</span>
          </button>
        </div>
      </div>

      {/* Dịch vụ kèm thêm */}
      <div>
        <div className="flex items-center gap-3 mb-6 text-primary">
          <span className="material-symbols-outlined text-[28px]">add_circle</span>
          <h2 className="text-xl font-black uppercase tracking-wider">Dịch vụ kèm thêm</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {toppings.map(topping => (
            <ToppingCard key={topping.id} pkg={topping} onSave={handleSaveService} onDelete={handleDeleteService} editingCardId={editingCardId} setEditingCardId={setEditingCardId} />
          ))}
          <button onClick={() => {
            if (editingCardId) {
              alert("Vui lòng lưu gói đang sửa trước khi thêm dịch vụ kèm theo mới!");
              return;
            }
            const newId = `temp_${Date.now()}`;
            setEditingCardId(newId);
            setToppings([...toppings, {
              id: newId,
              serviceName: '',
              serviceType: 'AddOn',
              prices: []
            }])
          }} className="rounded-2xl border-2 border-dashed border-outline-variant/50 hover:border-primary/50 bg-surface-container-low/30 hover:bg-primary/5 p-5 flex flex-col items-center justify-center min-h-[240px] transition-all group active:scale-95">
            <div className="h-12 w-12 rounded-full bg-surface-container group-hover:bg-primary/10 flex items-center justify-center text-outline group-hover:text-primary mb-3 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[24px]">add</span>
            </div>
            <span className="font-extrabold text-xs uppercase tracking-wider text-outline group-hover:text-primary transition-colors text-center">Thêm dịch vụ</span>
          </button>
        </div>
      </div>


    </div>
  );
};

export default AdminServicePackages;
