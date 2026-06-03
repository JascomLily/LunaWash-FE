import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// CẤU HÌNH DỮ LIỆU TẬP TRUNG - Cực kỳ dễ sửa đổi, nâng cấp và tích hợp API BE
const BRANCHES = [
  { id: 'BR-LD', name: 'LunaWash Linh Đông', address: 'Thủ Đức, HCM' },
  { id: 'BR-TTH', name: 'LunaWash Tân Thới Hiệp', address: 'Quận 12, HCM' },
  { id: 'BR-Q1', name: 'LunaWash Quận 1', address: '123 Lê Lợi, Bến Thành' },
  { id: 'BR-Q7', name: 'LunaWash Quận 7', address: '456 Nguyễn Văn Linh' },
  { id: 'BR-TB', name: 'LunaWash Tân Bình', address: '789 Cộng Hòa, Phường 13' }
];

const WASH_SLOTS = [
  { id: 'SL-01', name: 'Trạm 1', status: 'Sẵn sàng', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'SL-02', name: 'Trạm 2', status: 'Sẵn sàng', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'SL-03', name: 'Trạm 3', status: 'Sẵn sàng', color: 'text-emerald-600 bg-emerald-50' }
];

const SERVICE_PACKAGES = [
  {
    id: 'PK-CB',
    name: 'Cơ bản',
    desc: 'Rửa sạch ngoại thất, làm khô tự động và xịt bóng lốp.',
    price: 150000,
    priceStr: '150.000đ',
    time: 15,
    features: ['Rửa vòi áp lực cao', 'Sấy khô nhiệt', 'Làm bóng lốp']
  },
  {
    id: 'PK-NC',
    name: 'Nâng cao',
    desc: 'Dịch vụ cơ bản kết hợp vệ sinh gầm và tẩy ố lazang.',
    price: 250000,
    priceStr: '250.000đ',
    time: 20,
    features: ['Tất cả gói Cơ bản', 'Vệ sinh gầm xe', 'Tẩy ố lazang chuyên sâu'],
    isPopular: true
  },
  {
    id: 'PK-CC',
    name: 'Cao cấp',
    desc: 'Chăm sóc toàn diện với phủ Nano Ceramic bảo vệ sơn xe.',
    price: 500000,
    priceStr: '500.000đ',
    time: 30,
    features: ['Tất cả gói Nâng cao', 'Phủ Nano bảo vệ sơn', 'Đánh bóng']
  }
];

const MOCK_SAVED_VEHICLES = [
  { id: 'V-01', license: 'Toyota Vios - 51H-123.45', type: 'xe-o-to', brand: 'Toyota', model: 'Vios 1.5G' },
  { id: 'V-02', license: 'Honda Civic - 51K-987.65', type: 'xe-o-to', brand: 'Honda', model: 'Civic RS' }
];

// Tạo danh sách 30 khung giờ, mỗi slot kéo dài 40 phút và cách nhau 5 phút (khoảng cách giữa các giờ bắt đầu là 45 phút)
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 30; i++) {
    const totalMinutes = i * 45;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    slots.push({
      id: `T-${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}`,
      time: timeStr
    });
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

/**
 * Trang Đặt Lịch Rửa Xe Thông Minh (Booking) - LunaWash.
 * Thiết kế khớp hoàn hảo với Ảnh 4.
 */
export default function Booking() {
  const navigate = useNavigate();

  // BƯỚC THIẾT LẬP STATE
  const [selectedBranch, setSelectedBranch] = useState('BR-LD');
  const [selectedWashSlot, setSelectedWashSlot] = useState('SL-01');
  const [selectedPackage, setSelectedPackage] = useState('PK-CB');
  const [includeInteriorClean, setIncludeInteriorClean] = useState(false);

  // Xe và Thông tin xe
  const [selectedSavedVehicleId, setSelectedSavedVehicleId] = useState('V-01');
  const [vehicleType, setVehicleType] = useState('xe-o-to');
  const [vehicleBrand, setVehicleBrand] = useState('Toyota');
  const [vehicleModel, setVehicleModel] = useState('Vios');
  const [licensePlate, setLicensePlate] = useState('51H-123.45');

  // Khung giờ và Phụ trội
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('T-0900');
  const [paymentMethod, setPaymentMethod] = useState('tien-mat');

  // Khi chọn xe đã lưu, đồng bộ hóa các ô nhập liệu bên dưới
  useEffect(() => {
    const veh = MOCK_SAVED_VEHICLES.find(v => v.id === selectedSavedVehicleId);
    if (veh) {
      setVehicleType(veh.type);
      setVehicleBrand(veh.brand);
      setVehicleModel(veh.model);
      const plate = veh.license.split(' - ')[1] || '';
      setLicensePlate(plate);
    }
  }, [selectedSavedVehicleId]);

  // Cấu hình số lượng trạm theo từng chi nhánh
  const getBranchSlots = (branchId) => {
    switch (branchId) {
      case 'BR-LD': // LunaWash Linh Đông: 3 trạm
      case 'BR-Q1': // LunaWash Quận 1: 3 trạm
        return WASH_SLOTS;
      case 'BR-Q7': // LunaWash Quận 7: 2 trạm
        return WASH_SLOTS.slice(0, 2);
      default: // Còn lại (Tân Thới Hiệp, Tân Bình): 1 trạm
        return WASH_SLOTS.slice(0, 1);
    }
  };

  const availableSlots = getBranchSlots(selectedBranch);

  // Tự động chuyển trạm về trạm hợp lệ đầu tiên nếu trạm hiện tại không thuộc chi nhánh mới chọn
  useEffect(() => {
    const validSlots = getBranchSlots(selectedBranch);
    if (!validSlots.some(s => s.id === selectedWashSlot)) {
      setSelectedWashSlot(validSlots[0]?.id || 'SL-01');
    }
  }, [selectedBranch]);

  const numSlots = includeInteriorClean ? 6 : 1;

  // Đảm bảo slot đã chọn không vượt quá số slot còn lại khi thay đổi số slot yêu cầu (khi chọn vệ sinh nội thất)
  useEffect(() => {
    const startIndex = TIME_SLOTS.findIndex(t => t.id === selectedTimeSlotId);
    if (startIndex !== -1 && startIndex + numSlots > TIME_SLOTS.length) {
      const lastValidIndex = TIME_SLOTS.length - numSlots;
      if (lastValidIndex >= 0) {
        setSelectedTimeSlotId(TIME_SLOTS[lastValidIndex].id);
      }
    }
  }, [includeInteriorClean, selectedTimeSlotId, numSlots]);

  // TÍNH TOÁN DỮ LIỆU TÓM TẮT DỊCH VỤ ĐỘNG
  const activePackage = SERVICE_PACKAGES.find(p => p.id === selectedPackage) || SERVICE_PACKAGES[0];
  const interiorCost = includeInteriorClean ? 1000000 : 0;
  const baseCost = activePackage.price;
  const totalCost = baseCost + interiorCost;
  
  const totalDuration = activePackage.time + (includeInteriorClean ? 15 : 0);
  const displayDuration = numSlots > 1 ? numSlots * 40 : totalDuration;
  const activeBranchName = BRANCHES.find(b => b.id === selectedBranch)?.name || 'Linh Đông';
  const activeSlotName = WASH_SLOTS.find(s => s.id === selectedWashSlot)?.name || 'Trạm 1';
  const activeTimeStr = TIME_SLOTS.find(t => t.id === selectedTimeSlotId)?.time || '08:00';

  // Định dạng danh sách slot được chọn
  const getSelectedSlotsDisplay = () => {
    const startIndex = TIME_SLOTS.findIndex(t => t.id === selectedTimeSlotId);
    if (startIndex === -1) return '';
    
    if (numSlots === 1) {
      return `Lượt ${startIndex + 1} (${TIME_SLOTS[startIndex].time})`;
    } else {
      const endIdx = Math.min(startIndex + numSlots - 1, TIME_SLOTS.length - 1);
      const slotNumbers = Array.from({ length: endIdx - startIndex + 1 }, (_, i) => startIndex + i + 1).join(', ');
      const startTime = TIME_SLOTS[startIndex].time;
      const endTime = TIME_SLOTS[endIdx].time;
      return `Lượt ${slotNumbers} (${startTime} - ${endTime})`;
    }
  };

  // Tính khoảng thời gian dự kiến
  const expectedTimeRange = (() => {
    const startIndex = TIME_SLOTS.findIndex(t => t.id === selectedTimeSlotId);
    if (startIndex === -1) return '08:00 - 08:15';
    
    const endIdx = Math.min(startIndex + numSlots - 1, TIME_SLOTS.length - 1);
    const startStr = TIME_SLOTS[startIndex].time;
    const endStr = TIME_SLOTS[endIdx].time;
    
    const [startH, startM] = startStr.split(':').map(Number);
    const totalStartM = startH * 60 + startM;
    const finalStartH = Math.floor(totalStartM / 60) % 24;
    const finalStartM = totalStartM % 60;
    const formattedStart = `${String(finalStartH).padStart(2, '0')}:${String(finalStartM).padStart(2, '0')}`;
    
    if (numSlots === 1) {
      const totalEndM = totalStartM + totalDuration;
      const finalEndH = Math.floor(totalEndM / 60) % 24;
      const finalEndM = totalEndM % 60;
      const formattedEnd = `${String(finalEndH).padStart(2, '0')}:${String(finalEndM).padStart(2, '0')}`;
      return `${formattedStart} - ${formattedEnd}`;
    } else {
      const [endH, endM] = endStr.split(':').map(Number);
      const totalEndM = endH * 60 + endM + 40; // mỗi slot 40 phút
      const finalEndH = Math.floor(totalEndM / 60) % 24;
      const finalEndM = totalEndM % 60;
      const formattedEnd = `${String(finalEndH).padStart(2, '0')}:${String(finalEndM).padStart(2, '0')}`;
      return `${formattedStart} - ${formattedEnd}`;
    }
  })();

  // Định dạng hiển thị tiền VNĐ
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const handleCheckout = () => {
    const bookingState = {
      paymentMethod,
      packageName: `GÓI ${activePackage.name.toUpperCase()}`,
      services: activePackage.name,
      formattedPrice: formatCurrency(totalCost),
      activeBranchName,
      address: BRANCHES.find(b => b.id === selectedBranch)?.address || 'Thủ Đức, HCM',
      activeSlotName,
      expectedTimeRange,
      vehicleLicense: `${vehicleBrand} ${vehicleModel} - ${licensePlate}`
    };
    
    if (paymentMethod === 'vnpay') {
      navigate('/payment', { state: bookingState });
    } else {
      alert(`Xác nhận đặt lịch tại ${activeBranchName} (${activeSlotName}).\n- Phương thức: Tiền mặt tại quầy\n- Lượt đặt: ${getSelectedSlotsDisplay()}\n- Tổng tiền: ${formatCurrency(totalCost)}.`);
      navigate('/history', { state: bookingState });
    }
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-16 text-on-background">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-8">
        
        {/* TIÊU ĐỀ */}
        <div className="text-center py-6">
          <h1 className="text-2xl md:text-3xl font-black text-[#00236f] uppercase tracking-tight">
            LunaWash - Đặt Lịch Rửa Xe Thông Minh
          </h1>
        </div>

        {/* 1. CHỌN CHI NHÁNH */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">location_on</span>
            Chọn chi nhánh
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {BRANCHES.map((b) => (
              <div 
                key={b.id}
                onClick={() => setSelectedBranch(b.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedBranch === b.id 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20' 
                    : 'border-outline-variant hover:border-primary/50'
                }`}
              >
                <div>
                  <p className="font-extrabold text-sm leading-snug">{b.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium mt-1">{b.address}</p>
                </div>
                {selectedBranch === b.id && (
                  <span className="material-symbols-outlined text-sm font-bold text-primary mt-2 self-end">check_circle</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 2. CHỌN TRẠM RỬA */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">local_laundry_service</span>
            Chọn trạm rửa
          </h2>
          <p className="text-xs text-on-surface-variant -mt-2">Mỗi trạm có 30 lượt phục vụ trong ngày. Vui lòng chọn trạm còn trống.</p>
          <div className={`grid grid-cols-1 gap-4 ${
            availableSlots.length === 3 ? 'sm:grid-cols-3' : availableSlots.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1 max-w-sm'
          }`}>
            {availableSlots.map((s) => (
              <div 
                key={s.id}
                onClick={() => setSelectedWashSlot(s.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${
                  selectedWashSlot === s.id 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20' 
                    : 'border-outline-variant hover:border-primary/50'
                }`}
              >
                <div>
                  <p className="font-extrabold text-sm">{s.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1.5 inline-block ${s.color}`}>
                    {s.status}
                  </span>
                </div>
                {selectedWashSlot === s.id && (
                  <span className="material-symbols-outlined text-sm font-bold text-primary">check_circle</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3. CHỌN GÓI DỊCH VỤ */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">cleaning_services</span>
            Chọn gói dịch vụ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICE_PACKAGES.map((pkg) => (
              <div 
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between h-full ${
                  selectedPackage === pkg.id 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow-lg' 
                    : 'border-outline-variant hover:border-primary/50 hover:shadow-md'
                }`}
              >
                {pkg.isPopular && (
                  <span className="absolute top-0 right-0 bg-[#00236f] text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl select-none">
                    Phổ biến
                  </span>
                )}

                <div className="space-y-4">
                  <span className="material-symbols-outlined text-3xl font-light text-primary">
                    {pkg.id === 'PK-CB' ? 'water_drop' : (pkg.id === 'PK-NC' ? 'cool_to_dry' : 'diamond')}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-lg">{pkg.name}</h3>
                    <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">{pkg.desc}</p>
                  </div>
                  <ul className="space-y-2 border-t border-outline-variant/20 pt-4 text-xs font-semibold text-on-surface-variant">
                    {pkg.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-600 text-sm font-bold">check</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <p className="text-2xl font-black">{pkg.priceStr}</p>
                    <p className="text-[10px] text-outline font-bold">~{pkg.time} phút</p>
                  </div>
                  
                  {/* Ô checkbox vệ sinh nội thất đặc trưng */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIncludeInteriorClean(!includeInteriorClean);
                    }}
                    className="flex items-center gap-2.5 p-3 bg-surface-container-low/50 hover:bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs font-bold"
                  >
                    <input 
                      type="checkbox" 
                      checked={includeInteriorClean}
                      onChange={() => {}} // Đã được xử lý bởi click container
                      className="w-4 h-4 text-primary rounded border-outline-variant/50 focus:ring-primary cursor-pointer"
                    />
                    <label className="cursor-pointer select-none">Kèm theo vệ sinh nội thất (+1.000.000đ)</label>
                  </div>

                  <button 
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all uppercase tracking-wider ${
                      selectedPackage === pkg.id 
                        ? 'bg-primary text-white hover:bg-primary-container shadow-md' 
                        : 'border border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {selectedPackage === pkg.id ? 'Đã chọn' : 'Chọn gói này'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl flex items-start gap-3">
            <span className="material-symbols-outlined text-sky-600 text-lg">info</span>
            <p className="text-xs text-sky-800 leading-relaxed font-semibold">
              Lưu ý: Khi chọn thêm vệ sinh nội thất, thời gian thực hiện sẽ tăng 15 phút và bạn cần chọn lịch bắt đầu sớm hơn.
            </p>
          </div>
        </section>

        {/* 4. THÔNG TIN XE */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">directions_car</span>
            Thông tin xe
          </h2>

          <div className="space-y-6">
            <div className="max-w-md space-y-2">
              <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Chọn xe đã lưu</label>
              <select 
                value={selectedSavedVehicleId}
                onChange={(e) => setSelectedSavedVehicleId(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold"
              >
                {MOCK_SAVED_VEHICLES.map((v) => (
                  <option key={v.id} value={v.id}>{v.license}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 border-t border-outline-variant/20 pt-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Loại xe</label>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setVehicleType('xe-o-to')}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${
                      vehicleType === 'xe-o-to' 
                        ? 'bg-primary text-white border-primary shadow' 
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/60 hover:bg-surface-container-low/80'
                    }`}
                  >
                    Xe ô tô
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setVehicleType('xe-ban-tai')}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${
                      vehicleType === 'xe-ban-tai' 
                        ? 'bg-primary text-white border-primary shadow' 
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant/60 hover:bg-surface-container-low/80'
                    }`}
                  >
                    Xe bán tải
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Thương hiệu</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Toyota, Mazda..." 
                  value={vehicleBrand}
                  onChange={(e) => setVehicleBrand(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Mẫu xe</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Vios, CX-5..." 
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Biển số xe</label>
                <input 
                  type="text" 
                  placeholder="51H-123.45" 
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold uppercase"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5. CHỌN KHUNG GIỜ VÀ TÓM TẮT DỊCH VỤ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
          
          {/* Chọn khung giờ (2 cột rộng) */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
              <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-base">schedule</span>
                Chọn khung giờ (30 lượt/trạm)
              </h2>
              <span className="bg-sky-100 text-sky-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                {totalDuration} phút / lượt
              </span>
            </div>

            {/* Trạm TAB selector */}
            <div className="flex gap-2 border-b border-outline-variant/20 pb-4">
              {availableSlots.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedWashSlot(s.id)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    selectedWashSlot === s.id 
                      ? 'bg-primary text-white shadow' 
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-low/80'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Danh sách khung giờ */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {TIME_SLOTS.map((t, idx) => {
                const startIndex = TIME_SLOTS.findIndex(item => item.id === selectedTimeSlotId);
                const isStart = selectedTimeSlotId === t.id;
                const isOccupied = startIndex !== -1 && idx >= startIndex && idx < startIndex + numSlots;
                const isDisabled = idx + numSlots > TIME_SLOTS.length;
                
                let btnClasses = "py-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ";
                if (isDisabled) {
                  btnClasses += "border-outline-variant/30 bg-surface-container-low/40 text-outline/40 cursor-not-allowed opacity-50";
                } else if (isStart) {
                  btnClasses += "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow";
                } else if (isOccupied) {
                  btnClasses += "border-primary/50 bg-primary/5 text-primary/80 ring-1 ring-primary/10";
                } else {
                  btnClasses += "border-outline-variant/60 hover:border-primary/50 text-on-surface";
                }

                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setSelectedTimeSlotId(t.id)}
                    className={btnClasses}
                    title={isDisabled ? "Không đủ 6 slot liền kề còn lại trong ngày" : `Lượt thứ ${idx + 1}`}
                  >
                    <span className={`text-[9px] font-bold ${isStart || isOccupied ? 'text-primary/70' : 'text-outline/80'}`}>Lượt {idx + 1}</span>
                    <span className="text-sm font-extrabold">{t.time}</span>
                    <span className={`text-[9px] font-semibold ${isStart || isOccupied ? 'text-primary/60' : 'text-outline/60'}`}>Còn trống</span>
                  </button>
                );
              })}
            </div>


          </div>

          {/* Tóm tắt dịch vụ (1 cột) */}
          <div className="bg-[#00236f] text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[450px]">
            <div className="space-y-6">
              <h3 className="font-black text-lg border-b border-white/20 pb-4 tracking-tight">Tóm tắt dịch vụ</h3>
              
              <div className="space-y-4 text-xs font-semibold text-white/80">
                <div className="flex justify-between">
                  <p>Tổng thời gian</p>
                  <p className="text-white font-extrabold">{displayDuration} phút</p>
                </div>
                <div className="flex justify-between">
                  <p>Số lượng slot đặt</p>
                  <p className="text-white font-extrabold">{numSlots} slot</p>
                </div>
                <div className="flex justify-between">
                  <p>Tổng tiền dịch vụ</p>
                  <p className="text-[#4cd7f6] text-sm font-black">{formatCurrency(totalCost)}</p>
                </div>
                
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <p>Địa điểm & Trạm</p>
                    <p className="text-white font-extrabold text-right">{activeBranchName}<br /><span className="text-[10px] text-white/60">{activeSlotName}</span></p>
                  </div>
                  <div className="flex justify-between">
                    <p>Số Slot</p>
                    <p className="text-white font-extrabold text-right">{getSelectedSlotsDisplay()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Thời gian dự kiến</p>
                    <p className="text-[#4cd7f6] font-extrabold text-right">
                      {expectedTimeRange}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {/* Lựa chọn phương thức thanh toán */}
              <div className="space-y-2">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Phương thức thanh toán</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tien-mat')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'tien-mat'
                        ? 'bg-[#4cd7f6] text-[#001f26] border-[#4cd7f6] shadow-md'
                        : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">payments</span>
                    <span>Tiền mặt tại quầy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vnpay')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                      paymentMethod === 'vnpay'
                        ? 'bg-[#4cd7f6] text-[#001f26] border-[#4cd7f6] shadow-md'
                        : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base font-bold">qr_code_2</span>
                    <span>Thanh toán VN Pay</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-[#4cd7f6] hover:bg-[#57dffe] text-[#001f26] rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-cyan-400/25 active:scale-95"
              >
                Thanh toán ngay
              </button>
              <p className="text-[10px] text-center text-white/50 italic">
                Giao dịch được bảo mật bởi Luna Gateway
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
