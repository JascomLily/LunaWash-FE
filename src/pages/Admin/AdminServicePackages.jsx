import React from 'react';

const AVAILABLE_ICONS = [
  'water_drop', 'cool_to_dry', 'diamond', 'star', 
  'local_car_wash', 'directions_car', 'build', 'settings',
  'airline_seat_recline_normal', 'fact_check', 'layers', 'shield',
  'auto_awesome', 'verified', 'workspace_premium', 'speed'
];

const PromotionSetup = ({ mainPackages }) => {
  const [discount, setDiscount] = React.useState(10);
  
  // Format price helper (e.g. 50.000 -> 50k)
  const formatShortPrice = (priceStr) => {
    if (!priceStr) return '0k';
    const num = parseInt(priceStr.replace(/\./g, ''));
    if (isNaN(num)) return '0k';
    return (num / 1000) + 'k';
  };

  const calculateDiscount = (priceStr, percent) => {
    if (!priceStr) return '0k';
    const num = parseInt(priceStr.replace(/\./g, ''));
    if (isNaN(num)) return '0k';
    const discounted = num * (1 - percent / 100);
    return (discounted / 1000) + 'k';
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-6 md:p-8 shadow-sm flex flex-col transition-all max-w-2xl mt-12">
      <div className="flex items-center gap-2 mb-6 text-on-surface">
        <span className="material-symbols-outlined text-[24px] text-[#00687a]">add_circle</span>
        <h2 className="text-xl font-black tracking-tight">Thiết lập Khuyến mãi</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-on-surface-variant mb-2">Tên chương trình</label>
          <input type="text" placeholder="Vd: Ưu đãi Hè 2024" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00687a] transition-all text-on-surface" />
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface-variant mb-2">Mã code</label>
          <input type="text" placeholder="SUMMER24" className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00687a] transition-all text-on-surface uppercase placeholder:normal-case" />
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface-variant mb-2">Giảm giá (%)</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00687a] transition-all text-on-surface" />
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface-variant mb-2">Thời hạn (Ngày)</label>
          <input type="number" defaultValue={30} className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00687a] transition-all text-on-surface" />
        </div>
      </div>

      <div className="bg-surface-container-low rounded-2xl p-5 md:p-6 mb-8 border border-outline-variant/30">
        <h3 className="text-sm font-black text-on-surface mb-4">Ví dụ: Với mức giảm {discount || 0}%:</h3>
        <div className="space-y-3">
          {mainPackages.filter(p => p.title.trim() !== '').map(pkg => (
            <div key={pkg.id} className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant font-medium">Gói {pkg.title} ({formatShortPrice(pkg.basePrice)})</span>
              <span className="font-black text-[#004d6e] text-base">{calculateDiscount(pkg.basePrice, discount || 0)}</span>
            </div>
          ))}
          {mainPackages.filter(p => p.title.trim() !== '').length === 0 && (
             <div className="text-sm text-outline italic">Chưa có gói dịch vụ nào để hiển thị ví dụ.</div>
          )}
        </div>
      </div>

      <button className="w-full bg-[#00687a] hover:bg-[#004d6e] text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95 text-lg">
        Set up Chương trình
      </button>
    </div>
  );
};

const MainPackageCard = ({ id, title, icon, iconBg, iconColor, basePrice, baseTime, basePoints, description, initialDetails, isPopular, onDelete }) => {
  const [details, setDetails] = React.useState(initialDetails);
  const [currentIcon, setCurrentIcon] = React.useState(icon);
  const [showIconPicker, setShowIconPicker] = React.useState(false);

  const handleAddDetail = () => {
    setDetails([...details, ""]);
  };

  const handleRemoveDetail = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index, val) => {
    const newDetails = [...details];
    newDetails[index] = val;
    setDetails(newDetails);
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 p-4 shadow-sm flex flex-col transition-all hover:shadow-md hover:border-primary/30 relative overflow-hidden group">
      {isPopular && (
        <span className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl rounded-tr-3xl shadow-sm z-10">
          Phổ biến
        </span>
      )}
      {icon === 'diamond' && (
         <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-[-20deg] group-hover:animate-shimmer pointer-events-none z-0" />
      )}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div 
              onClick={() => setShowIconPicker(!showIconPicker)}
              className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} shadow-inner cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all group/icon`}
              title="Đổi biểu tượng"
            >
              <span className="material-symbols-outlined text-[22px] font-light group-hover/icon:scale-110 transition-transform">{currentIcon}</span>
            </div>
            
            {showIconPicker && (
              <div className="absolute top-12 left-0 bg-surface-container-high border border-outline-variant/50 rounded-xl p-2 shadow-xl z-50 grid grid-cols-4 gap-1 w-48 animate-fade-in">
                {AVAILABLE_ICONS.map(ic => (
                  <button 
                    key={ic}
                    onClick={() => { setCurrentIcon(ic); setShowIconPicker(false); }}
                    className={`p-2 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors ${currentIcon === ic ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{ic}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="text-[9px] font-extrabold text-outline uppercase tracking-widest mb-0.5">TÊN GÓI</div>
            <input type="text" defaultValue={title} placeholder="Nhập tên gói" className="text-lg font-black text-on-surface bg-transparent focus:outline-none focus:border-b-2 focus:border-primary w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest mb-1.5">GIÁ (VND)</label>
            <input type="text" defaultValue={basePrice} className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" />
          </div>
          <div>
            <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest mb-1.5">THỜI GIAN (PHÚT)</label>
            <input type="text" defaultValue={baseTime} className="w-full px-3 py-1.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-shadow" />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-[9px] font-extrabold text-amber-600 uppercase tracking-widest mb-1.5 flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">stars</span> ĐIỂM TÍCH LŨY</label>
          <input type="text" defaultValue={basePoints} className="w-full px-3 py-1.5 bg-amber-50/50 border border-amber-200 rounded-xl text-amber-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow" />
        </div>

        <div className="mb-4 flex-1 flex flex-col gap-3">
          <div>
            <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest mb-1.5">MÔ TẢ NGẮN</label>
            <textarea rows="2" defaultValue={description} placeholder="Nhập mô tả..." className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-shadow leading-relaxed"></textarea>
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
          <button className="flex-1 bg-primary hover:bg-primary-container text-white font-bold py-2 rounded-xl transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider">
            Lưu thay đổi
          </button>
          <button onClick={onDelete} className="p-2 border border-outline-variant text-on-surface-variant hover:text-error hover:border-error hover:bg-error-container/20 rounded-xl transition-all active:scale-95 shadow-sm" title="Xóa gói">
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ToppingCard = ({ title, icon, defaultVariable, basePrice, baseTime, basePoints, onDelete }) => {
  const [isVariable, setIsVariable] = React.useState(defaultVariable);
  const [currentIcon, setCurrentIcon] = React.useState(icon);
  const [showIconPicker, setShowIconPicker] = React.useState(false);

  const carTypes = [
    { name: 'Ô tô 2 chỗ', p: 1, t: 1 },
    { name: 'Ô tô 4 chỗ', p: 1.6666, t: 1.5 },
    { name: 'Ô tô 7 chỗ', p: 2, t: 1.6666 },
    { name: 'Xe bán tải', p: 2.3333, t: 2 },
    { name: 'SUV', p: 3, t: 2.5 }
  ];

  const calcPrice = (baseStr, multi) => {
    const base = parseInt(baseStr.replace(/\./g, ''));
    const calc = Math.round((base * multi) / 10000) * 10000;
    return calc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-sm flex flex-col transition-all hover:shadow-md hover:border-primary/30">
      <div className="flex items-center justify-between gap-3 mb-5 border-b border-outline-variant/30 pb-3">
        <input type="text" defaultValue={title} className="flex-1 bg-transparent text-base font-black text-on-surface uppercase tracking-wide focus:outline-none focus:border-b-2 focus:border-primary px-1 py-0.5 w-full" placeholder="Tên dịch vụ" />
        <div className="relative">
          <div 
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="flex items-center gap-1 group/icon cursor-pointer p-1 rounded-lg hover:bg-surface-container transition-colors"
            title="Đổi biểu tượng"
          >
            <span className="material-symbols-outlined text-primary text-[22px] group-hover/icon:scale-110 transition-transform">{currentIcon}</span>
          </div>
          
          {showIconPicker && (
            <div className="absolute top-10 right-0 bg-surface-container-high border border-outline-variant/50 rounded-xl p-2 shadow-xl z-50 grid grid-cols-4 gap-1 w-48 animate-fade-in">
              {AVAILABLE_ICONS.map(ic => (
                <button 
                  key={ic}
                  onClick={() => { setCurrentIcon(ic); setShowIconPicker(false); }}
                  className={`p-2 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors ${currentIcon === ic ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{ic}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4 mb-5 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <input type="checkbox" id={`vType-${title}`} checked={isVariable} onChange={(e) => setIsVariable(e.target.checked)} className="w-4 h-4 text-primary border-outline-variant/60 rounded focus:ring-primary cursor-pointer transition-all" />
          <label htmlFor={`vType-${title}`} className="text-[10px] font-bold text-on-surface select-none cursor-pointer">Giá theo loại xe</label>
        </div>
        
        {isVariable ? (
          <div className="bg-surface-container p-2 rounded-xl border border-outline-variant/30 space-y-2 animate-fade-in">
            <div className="grid grid-cols-12 gap-2 pb-1 border-b border-outline-variant/20 px-1">
              <div className="col-span-5 text-[8px] font-extrabold text-outline uppercase tracking-widest">Loại xe</div>
              <div className="col-span-4 text-[8px] font-extrabold text-outline uppercase tracking-widest">Giá (VND)</div>
              <div className="col-span-3 text-[8px] font-extrabold text-outline uppercase tracking-widest text-right">Phút</div>
            </div>
            
            {carTypes.map((car, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center px-1">
                <div className="col-span-5 text-[10px] font-bold text-on-surface">{car.name}</div>
                <input type="text" defaultValue={calcPrice(basePrice, car.p)} className="col-span-4 px-1.5 py-1 bg-surface-container-lowest border border-outline-variant/60 rounded md:text-xs text-[10px] font-bold focus:outline-none focus:border-primary transition-colors" />
                <input type="text" defaultValue={Math.round(baseTime * car.t)} className="col-span-3 px-1.5 py-1 bg-surface-container-lowest border border-outline-variant/60 rounded md:text-xs text-[10px] font-bold focus:outline-none focus:border-primary text-center transition-colors" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div>
              <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest mb-1">ĐƠN GIÁ (VND)</label>
              <input type="text" defaultValue={basePrice} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-on-surface font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors" />
            </div>
            <div>
              <label className="block text-[9px] font-extrabold text-outline uppercase tracking-widest mb-1">THỜI GIAN (PHÚT)</label>
              <input type="text" defaultValue={baseTime} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-on-surface font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors" />
            </div>
          </div>
        )}
        <div className="pt-2 border-t border-outline-variant/20 mt-4">
          <label className="block text-[9px] font-extrabold text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">stars</span> ĐIỂM TÍCH LŨY</label>
          <input type="text" defaultValue={basePoints} className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-lg text-amber-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors" />
        </div>
      </div>
      <div className="flex gap-2 mt-auto">
        <button className="flex-1 bg-primary hover:bg-primary-container text-white font-bold py-2.5 rounded-lg transition-all text-xs uppercase tracking-wider shadow-sm active:scale-95">
          Lưu
        </button>
        <button onClick={onDelete} className="px-2 border border-outline-variant text-on-surface-variant hover:text-error hover:border-error hover:bg-error-container/20 rounded-lg transition-all shadow-sm active:scale-95" title="Xóa dịch vụ">
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  );
};

const AdminServicePackages = () => {
  const [mainPackages, setMainPackages] = React.useState([
    {
      id: 1, title: 'Cơ bản', icon: 'water_drop', iconBg: 'bg-primary/10', iconColor: 'text-primary',
      basePrice: '50.000', baseTime: '15', basePoints: '10',
      description: 'Rửa thân vỏ cơ bản bằng vòi phun áp lực cao và sấy khô.',
      initialDetails: ['Rửa vòi áp lực cao', 'Sấy khô nhiệt', 'Làm bóng lốp'],
      isPopular: false
    },
    {
      id: 2, title: 'Nâng cao', icon: 'cool_to_dry', iconBg: 'bg-[#4cd7f6]/20', iconColor: 'text-[#00687a]',
      basePrice: '80.000', baseTime: '20', basePoints: '20',
      description: 'Rửa vỏ, gầm, phủ bóng nano và sấy khô kỹ thuật cao.',
      initialDetails: ['Tất cả gói Cơ bản', 'Vệ sinh gầm xe', 'Tẩy ố lazang chuyên sâu'],
      isPopular: true
    },
    {
      id: 3, title: 'Cao cấp', icon: 'diamond', iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
      basePrice: '150.000', baseTime: '30', basePoints: '50',
      description: 'Gói toàn diện: Rửa vỏ, gầm, làm sạch mâm, wax bóng, khử mùi nội thất.',
      initialDetails: ['Tất cả gói Nâng cao', 'Phủ Nano bảo vệ sơn', 'Đánh bóng'],
      isPopular: false
    }
  ]);

  const [toppings, setToppings] = React.useState([
    { id: 1, title: 'Thay nhớt', icon: 'build', defaultVariable: false, basePrice: '120.000', baseTime: 15, basePoints: 5 },
    { id: 2, title: 'Vệ sinh ghế', icon: 'airline_seat_recline_normal', defaultVariable: true, basePrice: '150.000', baseTime: 30, basePoints: 15 },
    { id: 3, title: 'KT tổng quát', icon: 'fact_check', defaultVariable: false, basePrice: '100.000', baseTime: 10, basePoints: 5 },
    { id: 4, title: 'Phủ Ceramic', icon: 'layers', defaultVariable: true, basePrice: '300.000', baseTime: 45, basePoints: 30 },
  ]);

  const handleAddMainPackage = () => {
    setMainPackages([
      ...mainPackages,
      {
        id: Date.now(),
        title: '',
        icon: 'star',
        iconBg: 'bg-surface-container',
        iconColor: 'text-outline',
        basePrice: '0',
        baseTime: '0',
        basePoints: '0',
        description: '',
        initialDetails: [''],
        isPopular: false
      }
    ]);
  };

  const handleDeleteMainPackage = (id) => {
    setMainPackages(mainPackages.filter(p => p.id !== id));
  };

  const handleAddTopping = () => {
    setToppings([
      ...toppings,
      {
        id: Date.now(),
        title: '',
        icon: 'stars',
        defaultVariable: false,
        basePrice: '0',
        baseTime: 0,
        basePoints: 0
      }
    ]);
  };

  const handleDeleteTopping = (id) => {
    setToppings(toppings.filter(t => t.id !== id));
  };

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-on-surface tracking-tight mb-1">Quản lý Gói dịch vụ</h1>
        <p className="text-sm text-on-surface-variant max-w-3xl">
          Thiết lập và tùy chỉnh các gói rửa xe tự động cùng dịch vụ gia tăng cho hệ thống LunaWash.
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
            <MainPackageCard key={pkg.id} {...pkg} onDelete={() => handleDeleteMainPackage(pkg.id)} />
          ))}

          {/* Add New Card */}
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
            <ToppingCard key={topping.id} {...topping} onDelete={() => handleDeleteTopping(topping.id)} />
          ))}

          {/* Add New Topping Card */}
          <button onClick={handleAddTopping} className="rounded-2xl border-2 border-dashed border-outline-variant/50 hover:border-primary/50 bg-surface-container-low/30 hover:bg-primary/5 p-5 flex flex-col items-center justify-center min-h-[240px] transition-all group active:scale-95">
            <div className="h-12 w-12 rounded-full bg-surface-container group-hover:bg-primary/10 flex items-center justify-center text-outline group-hover:text-primary mb-3 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[24px]">add</span>
            </div>
            <span className="font-extrabold text-xs uppercase tracking-wider text-outline group-hover:text-primary transition-colors text-center">Thêm dịch vụ</span>
          </button>
        </div>
      </div>

      {/* Thiết lập khuyến mãi */}
      <PromotionSetup mainPackages={mainPackages} />
    </div>
  );
};

export default AdminServicePackages;
