import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

// CẤU HÌNH DỮ LIỆU TẬP TRUNG - Cực kỳ dễ sửa đổi, nâng cấp và tích hợp API BE
const BRANCHES = [
  { id: 'BRN-LD-01', name: 'LunaWash Linh Đông', address: 'Thủ Đức, HCM' },
  { id: 'BRN-TTH-01', name: 'LunaWash Tân Thới Hiệp', address: 'Quận 12, HCM' },
  { id: 'BRN-Q1-01', name: 'LunaWash Quan 1 - Chi nhanh Trung Tam', address: '123 Nguyen Hue, Quan 1, TP HCM' },
  { id: 'BRN-Q7-01', name: 'LunaWash Quận 7', address: '456 Nguyễn Văn Linh' },
  { id: 'BRN-TB-01', name: 'LunaWash Tân Bình', address: '789 Cộng Hòa, Phường 13' }
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
  for (let i = 0; i < 27; i++) {
    const totalMinutes = 240 + i * 45; // Start at 04:00 (240 mins)
    const hours = Math.floor(totalMinutes / 60) % 24;
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

// Cấu hình dịch vụ vệ sinh nội thất cho từng loại xe
const INTERIOR_CLEAN_SPECS = {
  'VT-OTO-2C': { typeName: 'Ô tô 2 chỗ', price: 500000, priceStr: '500.000đ', duration: 120, slots: 3, blockedTime: 135 },
  'VT-OTO-4C': { typeName: 'Ô tô 4 chỗ', price: 700000, priceStr: '700.000đ', duration: 150, slots: 4, blockedTime: 180 },
  'VT-OTO-7C': { typeName: 'Ô tô 7 chỗ', price: 1000000, priceStr: '1.000.000đ', duration: 210, slots: 5, blockedTime: 225 },
  'VT-OTO-BT': { typeName: 'Xe bán tải', price: 1100000, priceStr: '1.100.000đ', duration: 240, slots: 6, blockedTime: 270 },
  'VT-OTO-SUV': { typeName: 'SUV', price: 1100000, priceStr: '1.100.000đ', duration: 240, slots: 6, blockedTime: 270 }
};

/**
 * Trang Đặt Lịch Rửa Xe Thông Minh (Booking) - LunaWash.
 * Thiết kế khớp hoàn hảo với Ảnh 4.
 */
export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state || {};

  // Cuộn lên đầu trang khi component được mount (đặc biệt khi chuyển từ trang chủ sang)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // BƯỚC THIẾT LẬP STATE
  const [selectedBranch, setSelectedBranch] = useState(navState.branchId || 'BRN-LD-01');
  const [selectedWashSlot, setSelectedWashSlot] = useState('SL-01');
  const [selectedPackage, setSelectedPackage] = useState(navState.packageId || 'PK-CB');
  const [includeInteriorClean, setIncludeInteriorClean] = useState(false);

  // Xe và Thông tin xe (lấy từ Backend)
  const [userVehicles, setUserVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

  // Lấy cấu hình dịch vụ vệ sinh nội thất cho loại xe đang chọn
  const activeVehicle = userVehicles.find(v => v.id === selectedVehicleId);
  const selectedVehicleTypeId = activeVehicle?.vehicleTypeId || 'VT-OTO-4C';
  const interiorSpecs = INTERIOR_CLEAN_SPECS[selectedVehicleTypeId] || INTERIOR_CLEAN_SPECS['VT-OTO-4C'];

  const numSlots = includeInteriorClean ? interiorSpecs.slots : 1;

  // Lỗi khi chọn slot giờ không hợp lệ
  const [slotError, setSlotError] = useState(null);

  const getSlotSelectionError = (idx) => {
    if (idx + numSlots > TIME_SLOTS.length) {
      const slotsRemaining = TIME_SLOTS.length - idx;
      return `Loại xe của bạn (${interiorSpecs.typeName}) khi vệ sinh nội thất cần đăng ký ${numSlots} slot liên tiếp (tổng cộng ${numSlots * 45} phút). Tuy nhiên, nếu bắt đầu từ Lượt ${idx + 1} (${TIME_SLOTS[idx].time}), từ đây đến cuối ngày chỉ còn lại ${slotsRemaining} slot, không đủ để hoàn thành dịch vụ. Vui lòng chọn khung giờ bắt đầu sớm hơn.`;
    }
    for (let i = 0; i < numSlots; i++) {
      if (occupiedSlots.has(idx + i)) {
        return `Không thể đặt lịch bắt đầu từ Lượt ${idx + 1} (${TIME_SLOTS[idx].time}) vì trong chuỗi ${numSlots} slot liên tiếp cần thiết, Lượt ${idx + i + 1} (${TIME_SLOTS[idx + i].time}) đã bị khách hàng khác đặt trước. Quy định vệ sinh nội thất yêu cầu các slot phải liên tục và không bị gián đoạn. Vui lòng chọn khung giờ trống liền mạch khác.`;
      }
    }
    return null;
  };

  // Trạng thái modal thêm xe mới
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const requireLogin = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      setShowLoginPrompt(true);
      return true;
    }
    return false;
  };
  const [carName, setCarName] = useState('');
  const [carLicense, setCarLicense] = useState('');
  const [carColor, setCarColor] = useState('');
  const [carTypeId, setCarTypeId] = useState('');
  const [isAddingCar, setIsAddingCar] = useState(false);

  // Khung giờ và Phụ trội
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('T-0900');
  const [paymentMethod, setPaymentMethod] = useState('tien-mat');

  const [showNoVehicleAlert, setShowNoVehicleAlert] = useState(false);
  const [highlightVehicleSection, setHighlightVehicleSection] = useState(false);

  const scrollToVehicleSection = () => {
    setShowNoVehicleAlert(false);
    setHighlightVehicleSection(true);
    const el = document.getElementById('vehicle-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => setHighlightVehicleSection(false), 2000);
  };

  // Lấy danh sách xe thật của người dùng từ BE khi mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.token) {
          setIsLoadingVehicles(true);
          fetch('http://localhost:5010/api/vehicles', {
            headers: {
              'Authorization': `Bearer ${parsed.token}`
            }
          })
          .then(res => {
            if (res.ok) return res.json();
            throw new Error('Không thể lấy danh sách xe.');
          })
          .then(data => {
            setUserVehicles(data);
            if (data.length > 0) {
              setSelectedVehicleId(data[0].id);
            }
          })
          .catch(err => console.error('Lỗi lấy danh sách xe:', err))
          .finally(() => setIsLoadingVehicles(false));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveNewCar = (e) => {
    e.preventDefault();
    if (!carName || !carLicense || !carTypeId) {
      alert('Vui lòng điền đầy đủ Tên xe, Biển số và Loại xe.');
      return;
    }
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.token) {
          setIsAddingCar(true);
          fetch('http://localhost:5010/api/vehicles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${parsed.token}`
            },
            body: JSON.stringify({
              name: carName,
              license: carLicense,
              color: carColor || 'Chưa xác định',
              vehicleTypeId: carTypeId
            })
          })
          .then(res => {
            if (res.ok) return res.json();
            return res.json().then(data => {
              throw new Error(data.message || 'Thêm xe thất bại.');
            });
          })
          .then(newCar => {
            alert('Đã thêm xe mới thành công!');
            setUserVehicles(prev => [...prev, newCar]);
            setSelectedVehicleId(newCar.id);
            // Reset form and close
            setCarName('');
            setCarLicense('');
            setCarColor('');
            setCarTypeId('');
            setShowAddCarModal(false);
          })
          .catch(err => {
            console.error(err);
            alert(err.message || 'Không thể kết nối đến máy chủ.');
          })
          .finally(() => setIsAddingCar(false));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Khởi tạo ngày hôm nay dạng YYYY-MM-DD
  const getTodayStr = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);

  // Tính toán giới hạn ngày đặt lịch dựa trên hạng thành viên
  const getUserMaxBookingDays = () => {
    const storedUser = localStorage.getItem('user');
    let tier = 'Đồng';
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        tier = parsed.tier || 'Đồng';
      } catch(e) {}
    }
    const t = tier.toLowerCase();
    if (t.includes('platinum')) return { days: 30, tier };
    if (t.includes('vàng') || t.includes('gold')) return { days: 21, tier };
    if (t.includes('bạc') || t.includes('silver')) return { days: 14, tier };
    return { days: 7, tier }; // Đồng / Member / Chưa đăng nhập
  };

  const { days: maxBookingDays, tier: currentTier } = getUserMaxBookingDays();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const maxAllowedDate = new Date();
  maxAllowedDate.setDate(maxAllowedDate.getDate() + maxBookingDays);
  maxAllowedDate.setHours(23, 59, 59, 999);


  // Lấy năm và tháng từ selectedDate để hiển thị lịch ban đầu
  const [calendarYear, setCalendarYear] = useState(() => {
    const parts = selectedDate.split('-');
    return parts[0] ? parseInt(parts[0], 10) : new Date().getFullYear();
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const parts = selectedDate.split('-');
    return parts[1] ? parseInt(parts[1], 10) - 1 : new Date().getMonth();
  });

  // Tính toán danh sách các slot đã bị chiếm cho ngày và trạm hiện tại (được để trống để các slot đều trống theo yêu cầu của bạn)
  const occupiedSlots = React.useMemo(() => {
    return new Set();
  }, [selectedDate, selectedWashSlot]);

  // Tự động chuyển slot giờ được chọn sang slot còn trống đầu tiên nếu bị trùng vào slot đã đặt
  useEffect(() => {
    const startIndex = TIME_SLOTS.findIndex(t => t.id === selectedTimeSlotId);
    const isSlotOccupied = (idx) => occupiedSlots.has(idx);
    
    let isCurrentValid = startIndex !== -1 && startIndex + numSlots <= TIME_SLOTS.length;
    if (isCurrentValid) {
      for (let i = 0; i < numSlots; i++) {
        if (isSlotOccupied(startIndex + i)) {
          isCurrentValid = false;
          break;
        }
      }
    }
    
    if (!isCurrentValid) {
      let foundSlotId = null;
      for (let i = 0; i <= TIME_SLOTS.length - numSlots; i++) {
        let isSequenceValid = true;
        for (let j = 0; j < numSlots; j++) {
          if (isSlotOccupied(i + j)) {
            isSequenceValid = false;
            break;
          }
        }
        if (isSequenceValid) {
          foundSlotId = TIME_SLOTS[i].id;
          break;
        }
      }
      if (foundSlotId) {
        setSelectedTimeSlotId(foundSlotId);
      }
    }
  }, [selectedDate, selectedWashSlot, occupiedSlots, numSlots]);

  const generateCalendarDays = () => {
    const days = [];
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevTotalDays = new Date(calendarYear, calendarMonth, 0).getDate();
    
    // 1. Thêm các ngày của tháng trước (in mờ)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevTotalDays - i;
      let m = calendarMonth - 1;
      let y = calendarYear;
      if (m < 0) { m = 11; y--; }
      days.push({ day: dayNum, month: m, year: y, isCurrentMonth: false });
    }
    
    // 2. Thêm các ngày của tháng hiện tại
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, month: calendarMonth, year: calendarYear, isCurrentMonth: true });
    }
    
    // 3. Thêm các ngày của tháng sau để lấp đầy grid (42 ô cho 6 tuần)
    const totalCells = 42; 
    const nextDaysCount = totalCells - days.length;
    for (let i = 1; i <= nextDaysCount; i++) {
      let m = calendarMonth + 1;
      let y = calendarYear;
      if (m > 11) { m = 0; y++; }
      days.push({ day: i, month: m, year: y, isCurrentMonth: false });
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const handleSelectDay = (dayObj) => {
    const y = dayObj.year;
    const m = String(dayObj.month + 1).padStart(2, '0');
    const d = String(dayObj.day).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
    setShowCalendarPopup(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
    setCalendarMonth(today.getMonth());
    setCalendarYear(today.getFullYear());
    setShowCalendarPopup(false);
  };

  // Cấu hình số lượng trạm theo từng chi nhánh
  const getBranchSlots = (branchId) => {
    switch (branchId) {
      case 'BRN-LD-01': // LunaWash Linh Đông: 3 trạm
      case 'BRN-Q1-01': // LunaWash Quận 1: 3 trạm
        return WASH_SLOTS;
      case 'BRN-Q7-01': // LunaWash Quận 7: 2 trạm
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
  const interiorCost = includeInteriorClean ? interiorSpecs.price : 0;
  const baseCost = activePackage.price;
  const totalCost = baseCost + interiorCost;
  
  const totalDuration = activePackage.time + (includeInteriorClean ? interiorSpecs.duration : 0);
  const displayDuration = numSlots * 45 - 5; // mỗi slot 40 phút, break 5 phút
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
    if (startIndex === -1) return '08:00 - 08:40';
    
    const endIdx = Math.min(startIndex + numSlots - 1, TIME_SLOTS.length - 1);
    const startStr = TIME_SLOTS[startIndex].time;
    const endStr = TIME_SLOTS[endIdx].time;
    
    const [startH, startM] = startStr.split(':').map(Number);
    const totalStartM = startH * 60 + startM;
    const finalStartH = Math.floor(totalStartM / 60) % 24;
    const finalStartM = totalStartM % 60;
    const formattedStart = `${String(finalStartH).padStart(2, '0')}:${String(finalStartM).padStart(2, '0')}`;
    
    const [endH, endM] = endStr.split(':').map(Number);
    const totalEndM = endH * 60 + endM + 40; // mỗi slot 40 phút
    const finalEndH = Math.floor(totalEndM / 60) % 24;
    const finalEndM = totalEndM % 60;
    const formattedEnd = `${String(finalEndH).padStart(2, '0')}:${String(finalEndM).padStart(2, '0')}`;
    return `${formattedStart} - ${formattedEnd}`;
  })();

  // Định dạng hiển thị tiền VNĐ
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const handleCheckout = async () => {
    if (requireLogin()) return;
    if (!selectedVehicleId) {
      setShowNoVehicleAlert(true);
      return;
    }

    const activeVeh = userVehicles.find(v => v.id === selectedVehicleId);
    if (!activeVeh) return;

    let serviceIds = [];
    if (selectedPackage === 'PK-CB') serviceIds.push('PRC-4C-BSC');
    else if (selectedPackage === 'PK-NC') serviceIds.push('PRC-4C-ADV');
    else if (selectedPackage === 'PK-CC') serviceIds.push('PRC-4C-PRE');
    if (includeInteriorClean) serviceIds.push('PRC-INT-01');

    const startIndex = TIME_SLOTS.findIndex(t => t.id === selectedTimeSlotId);
    const startStr = startIndex !== -1 ? TIME_SLOTS[startIndex].time : '08:00';
    const scheduledStartTime = `${selectedDate}T${startStr}:00.000Z`;
    
    const notesStr = paymentMethod === 'vnpay' ? 'VNPay' : '';

    const bookingPayload = {
      BranchId: selectedBranch,
      VehicleTypeId: activeVeh.vehicleTypeId || 'VT-OTO-4C',
      LicensePlate: activeVeh.license,
      VehicleBrand: activeVeh.brand || '',
      VehicleModel: activeVeh.model || '',
      ScheduledStartTime: scheduledStartTime,
      Notes: notesStr,
      ServicePriceIds: serviceIds
    };

    const bookingState = {
      paymentMethod,
      packageName: `GÓI ${activePackage.name.toUpperCase()}${includeInteriorClean ? ' + VỆ SINH NỘI THẤT' : ''}`,
      services: `${activePackage.name}${includeInteriorClean ? ' + Vệ sinh nội thất' : ''}`,
      formattedPrice: formatCurrency(totalCost),
      activeBranchName,
      address: BRANCHES.find(b => b.id === selectedBranch)?.address || 'Thủ Đức, HCM',
      activeSlotName,
      expectedTimeRange,
      vehicleLicense: activeVeh ? `${activeVeh.name} - ${activeVeh.license} (${activeVeh.color})` : 'Chưa chọn xe',
      bookingDate: selectedDate,
      bookingPayload
    };
    
    if (paymentMethod === 'vnpay') {
      navigate('/payment', { state: bookingState });
    } else {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const parsed = JSON.parse(storedUser);

        toast.loading('Đang xử lý đặt lịch...', { id: 'booking' });
        const response = await fetch('http://localhost:5010/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${parsed.token}`
          },
          body: JSON.stringify(bookingPayload)
        });

        if (!response.ok) {
          let errText = 'Không thể tạo lịch đặt.';
          try {
            const errData = await response.json();
            if (errData.message) errText = errData.message;
          } catch(e){}
          throw new Error(errText);
        }

        toast.success('Đặt lịch thành công!', { id: 'booking' });
        navigate('/history', { state: bookingState });
      } catch (err) {
        console.error(err);
        toast.error(err.message, { id: 'booking' });
      }
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
                onClick={() => { setSelectedBranch(b.id); }}
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
                onClick={() => { setSelectedWashSlot(s.id); }}
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
                onClick={() => { setSelectedPackage(pkg.id); }}
                className={`relative p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between h-full ${
                  pkg.id === 'PK-CC' ? 'overflow-hidden group' : ''
                } ${
                  selectedPackage === pkg.id 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow-lg' 
                    : 'border-outline-variant hover:border-primary/50 hover:shadow-md'
                }`}
              >
                {pkg.id === 'PK-CC' && (
                  <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#00236f]/10 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none z-10" />
                )}
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

        </section>

        {/* 4. THÔNG TIN XE */}
        <section 
          id="vehicle-section"
          className={`bg-surface-container-lowest border rounded-3xl p-6 transition-all duration-500 space-y-4 ${
            highlightVehicleSection 
              ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
              : 'border-outline-variant/40 shadow-sm'
          }`}
        >
          <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">directions_car</span>
            Thông tin xe
          </h2>

          <div className="space-y-4">
            {isLoadingVehicles ? (
              <p className="text-xs text-on-surface-variant font-medium">Đang tải danh sách xe...</p>
            ) : userVehicles.length > 0 ? (
              <div className="max-w-md space-y-2 border-t border-outline-variant/20 pt-6">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Chọn xe</label>
                <div className="flex gap-2">
                  <select 
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface"
                  >
                    {userVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} - {v.license} ({v.color || 'Không có màu'})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => { if (requireLogin()) return; setShowAddCarModal(true); }}
                    className="px-4 bg-[#00236f] hover:bg-primary-container text-white font-bold rounded-xl text-sm transition-all whitespace-nowrap shadow flex items-center justify-center active:scale-95"
                    title="Thêm xe mới"
                  >
                    <span className="material-symbols-outlined text-base font-bold">add</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-surface-container-low/40 border border-dashed border-outline-variant/60 rounded-2xl text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-outline animate-bounce">directions_car</span>
                <div>
                  <p className="font-bold text-sm text-on-surface">Chưa có thông tin xe nào</p>
                  <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Vui lòng thêm thông tin xe của bạn để tiếp tục đặt lịch.</p>
                </div>
                <button
                  type="button"
                  onClick={() => { if (requireLogin()) return; setShowAddCarModal(true); }}
                  className="px-6 py-2.5 bg-[#00236f] hover:bg-primary-container text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow active:scale-95"
                >
                  Thêm thông tin xe
                </button>
              </div>
            )}
          </div>
        </section>

        {/* DỊCH VỤ VỆ SINH NỘI THẤT */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="mb-6 border-b border-outline-variant/20 pb-4">
            <h2 className="text-sm font-extrabold text-outline uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-base">cleaning_services</span>
              Dịch vụ vệ sinh nội thất kèm theo
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Dưới đây là bảng thông số dịch vụ vệ sinh nội thất chi tiết cho từng loại xe. Hệ thống tự động nhận diện loại xe hiện tại của bạn để áp dụng mức giá và số slot phù hợp.
            </p>

            {/* Bảng so sánh giá và thời gian */}
            <div className="overflow-x-auto border border-outline-variant/30 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs font-semibold min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-outline-variant/30 text-outline text-[10px] uppercase tracking-wider font-extrabold">
                    <th className="p-4">Loại xe</th>
                    <th className="p-4 text-right">Giá đề xuất</th>
                    <th className="p-4 text-center">Thời gian ước tính</th>
                    <th className="p-4 text-center">Số slot (45 phút / slot)</th>
                    <th className="p-4 text-right">Thời gian bị giữ trên lịch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {Object.entries(INTERIOR_CLEAN_SPECS).map(([typeId, spec]) => {
                    const isCurrentType = selectedVehicleId !== '' && selectedVehicleTypeId === typeId;
                    return (
                      <tr 
                        key={typeId}
                        className={`transition-colors ${
                          isCurrentType 
                            ? 'bg-primary/5 text-primary font-bold border-l-4 border-l-primary' 
                            : 'text-on-surface hover:bg-surface-container-low/20'
                        }`}
                      >
                        <td className="p-4 flex items-center gap-2">
                          {isCurrentType && (
                            <span className="bg-primary text-white text-[8px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded shadow-sm">
                              Xe đang chọn
                            </span>
                          )}
                          <span>{spec.typeName}</span>
                        </td>
                        <td className="p-4 text-right font-bold">{spec.priceStr}</td>
                        <td className="p-4 text-center">{spec.duration} phút</td>
                        <td className="p-4 text-center">{spec.slots} slot</td>
                        <td className="p-4 text-right text-outline">{spec.blockedTime} phút</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Hộp lưu ý quan trọng */}
            <div className="flex gap-3 bg-amber-50 border border-amber-200/60 rounded-2xl p-4 text-amber-900 text-xs">
              <span className="material-symbols-outlined text-amber-600 text-lg select-none font-bold">warning</span>
              <div className="space-y-1">
                <p className="font-extrabold text-amber-800 text-sm">Lưu ý quan trọng khi chọn dịch vụ</p>
                <p className="text-xs leading-relaxed text-amber-900/80 font-medium">
                  Khi chọn thêm dịch vụ vệ sinh nội thất, các slot đặt lịch bắt buộc phải chọn <strong>liên tiếp và liền kề nhau</strong>. Nếu trong hàng định chọn trước đó đã có 1 slot người khác đặt trước chen ngang rồi thì hệ thống sẽ tự động vô hiệu hóa và bạn không thể lựa chọn khoảng giờ đó.
                </p>
              </div>
            </div>
            
            {/* Nút chọn đồng ý vệ sinh nội thất (chuyển xuống dưới cùng, căn trái) */}
            <div className="flex justify-start pt-2">
              <div 
                onClick={() => {
                  if (!selectedVehicleId) {
                    setShowNoVehicleAlert(true);
                    return;
                  }
                  setIncludeInteriorClean(!includeInteriorClean);
                }}
                className={`px-8 py-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 select-none ${
                  includeInteriorClean 
                    ? 'bg-[#00236f] text-white border-[#00236f] shadow-lg ring-4 ring-[#00236f]/20 font-bold scale-[1.02]' 
                    : 'bg-white border-outline-variant hover:border-[#00236f]/50 text-on-surface font-semibold hover:bg-surface-container-lowest shadow-sm'
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${includeInteriorClean ? 'text-white' : 'text-outline'}`}>
                  {includeInteriorClean ? 'check_box' : 'check_box_outline_blank'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold uppercase tracking-wider">
                    Thêm gói vệ sinh nội thất
                  </span>
                  {includeInteriorClean && (
                    <span className="text-sm font-black text-[#4cd7f6] uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded select-none">
                      Đang chọn
                    </span>
                  )}
                </div>
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
                40 phút / lượt
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 pb-4 relative">
              {/* Trạm TAB selector */}
              <div className="flex gap-2 bg-surface-container-low/60 p-1 rounded-2xl border border-outline-variant/30">
                {availableSlots.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setSelectedWashSlot(s.id); }}
                    className={`px-5 py-2 rounded-xl font-extrabold text-xs transition-all ${
                      selectedWashSlot === s.id 
                        ? 'bg-white text-[#00236f] shadow' 
                        : 'text-on-surface-variant hover:bg-white/40'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              {/* Date Picker Input & Pop-up */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCalendarPopup(!showCalendarPopup)}
                  className="flex items-center gap-3 px-4 py-2 bg-surface-container-low/60 border border-outline-variant/60 rounded-xl hover:border-primary/50 transition-all font-bold text-sm text-on-surface shadow-sm"
                >
                  <span className="material-symbols-outlined text-base text-outline">calendar_month</span>
                  <span>{selectedDate}</span>
                  <span className="material-symbols-outlined text-base text-outline">calendar_today</span>
                </button>

                {showCalendarPopup && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowCalendarPopup(false)}
                    ></div>
                    
                    <div className="absolute right-0 mt-2 z-50 bg-white border border-outline-variant/40 rounded-3xl p-5 shadow-2xl w-[310px] text-on-surface animate-fade-in">
                      {/* Calendar Header */}
                      <div className="flex justify-between items-center mb-4">
                        <button 
                          type="button" 
                          onClick={handlePrevMonth}
                          className="p-1.5 hover:bg-surface-container-low rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">arrow_back_ios</span>
                        </button>
                        <span className="font-extrabold text-sm text-on-surface">
                          Tháng {calendarMonth + 1}, {calendarYear}
                        </span>
                        <button 
                          type="button" 
                          onClick={handleNextMonth}
                          className="p-1.5 hover:bg-surface-container-low rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">arrow_forward_ios</span>
                        </button>
                      </div>

                      {/* Day of Week Headers */}
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-outline/60 mb-2">
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
                          <div key={d}>{d}</div>
                        ))}
                      </div>

                      {/* Day Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
                        {generateCalendarDays().map((dayObj, idx) => {
                          const y = dayObj.year;
                          const m = String(dayObj.month + 1).padStart(2, '0');
                          const d = String(dayObj.day).padStart(2, '0');
                          const dateStr = `${y}-${m}-${d}`;
                          const isSelected = selectedDate === dateStr;
                          
                          const cellDate = new Date(y, dayObj.month, dayObj.day, 0, 0, 0, 0);
                          const isPast = cellDate < todayStart;
                          const isTooFar = cellDate > maxAllowedDate;
                          const isDisabled = isPast || isTooFar;
                          
                          let dayClasses = "h-8 w-8 flex items-center justify-center rounded-xl mx-auto transition-all ";
                          if (isDisabled) {
                            dayClasses += "text-outline/20 cursor-not-allowed bg-surface-container-lowest opacity-50";
                          } else {
                            dayClasses += "cursor-pointer ";
                            if (isSelected) {
                              dayClasses += "bg-[#00236f] text-white shadow";
                            } else if (!dayObj.isCurrentMonth) {
                              dayClasses += "text-outline/40 hover:bg-surface-container-low";
                            } else {
                              dayClasses += "text-on-surface hover:bg-[#00236f]/10";
                            }
                          }
                          
                          return (
                            <div 
                              key={idx}
                              onClick={() => {
                                if (isDisabled) {
                                  if (isTooFar) {
                                    toast.error(`Hạng ${currentTier} chỉ được đặt trước tối đa ${maxBookingDays} ngày.`);
                                  }
                                  return;
                                }
                                handleSelectDay(dayObj);
                              }}
                              className={dayClasses}
                            >
                              {dayObj.day}
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer today link */}
                      <div className="flex justify-end border-t border-outline-variant/20 pt-3 mt-3">
                        <button
                          type="button"
                          onClick={handleSelectToday}
                          className="text-xs font-black text-[#00236f] hover:underline"
                        >
                          Hôm nay
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Danh sách khung giờ */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {TIME_SLOTS.map((t, idx) => {
                const startIndex = TIME_SLOTS.findIndex(item => item.id === selectedTimeSlotId);
                const isStart = selectedTimeSlotId === t.id;
                const isOccupied = startIndex !== -1 && idx >= startIndex && idx < startIndex + numSlots;
                
                // Trạng thái bị disabled nếu:
                // 1. Không đủ số slot đến hết ngày (vượt quá độ dài TIME_SLOTS)
                // 2. Hoặc CÓ BẤT KỲ slot nào trong số các slot liên tiếp đó đã bị đặt trước
                let isDisabled = idx + numSlots > TIME_SLOTS.length;
                if (!isDisabled) {
                  for (let i = 0; i < numSlots; i++) {
                    if (occupiedSlots.has(idx + i)) {
                      isDisabled = true;
                      break;
                    }
                  }
                }
                const isSlotBooked = occupiedSlots.has(idx);
                
                let btnClasses = "py-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ";
                if (isSlotBooked) {
                  btnClasses += "border-outline-variant/30 bg-surface-container-low/40 text-outline/30 cursor-not-allowed opacity-60";
                } else if (isStart) {
                  btnClasses += "bg-[#00236f] text-white border-[#00236f] shadow-lg ring-2 ring-primary/20 scale-105 z-10";
                } else if (isOccupied) {
                  btnClasses += "bg-[#00236f]/10 text-[#00236f] border-[#00236f]/40 border-dashed";
                } else if (isDisabled) {
                  btnClasses += "border-outline-variant/40 bg-surface-container-low/20 text-outline/50 cursor-pointer hover:border-amber-300/80 opacity-70";
                } else {
                  btnClasses += "border-outline-variant/60 hover:border-primary/50 text-on-surface hover:bg-surface-container-low/30";
                }

                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={isSlotBooked}
                    onClick={() => {
                      if (isDisabled) {
                        const errorMsg = getSlotSelectionError(idx);
                        setSlotError(errorMsg);
                      } else {
                        setSelectedTimeSlotId(t.id);
                      }
                    }}
                    className={btnClasses}
                    title={isSlotBooked ? "Khung giờ này đã được đặt" : isDisabled ? "Không đủ slot liền kề còn lại trong ngày" : `Lượt thứ ${idx + 1}`}
                  >
                    <span className={`text-[9px] font-bold ${
                      isSlotBooked ? 'text-outline/40' : 
                      isStart ? 'text-white/80' : 
                      isOccupied ? 'text-primary/70' : 
                      'text-outline/80'
                    }`}>
                      Lượt {idx + 1}
                    </span>
                    <span className="text-sm font-extrabold">{t.time}</span>
                    <span className={`text-[9px] font-bold ${
                      isSlotBooked ? 'text-red-500/80' : 
                      isStart ? 'text-white font-black' : 
                      isOccupied ? 'text-[#00236f] font-black' : 
                      isDisabled ? 'text-amber-600/80 font-bold' :
                      'text-emerald-600/80'
                    }`}>
                      {isSlotBooked ? 'Đã đặt' : 
                       isStart ? 'Bắt đầu' : 
                       isOccupied ? 'Đang giữ' : 
                       isDisabled ? 'Không khả dụng' :
                       'Còn trống'}
                    </span>
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
                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                  <p className="font-bold text-white">Tổng tiền dịch vụ</p>
                  <p className="text-[#4cd7f6] text-xl font-black">{formatCurrency(totalCost)}</p>
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
              {/* Ô NHẬP MÃ GIẢM GIÁ */}
              <div className="space-y-2 border-b border-white/10 pb-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Mã giảm giá</p>
                  <div className="text-[10px] text-[#4cd7f6] font-bold flex items-center gap-1 cursor-default select-none">
                    <span className="material-symbols-outlined text-xs">local_activity</span>
                    <span>Xem thêm mã giảm giá</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#4cd7f6] text-xs font-semibold text-white placeholder-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => alert("Tính năng áp dụng mã giảm giá đang được phát triển.")}
                    className="px-4 py-2 bg-[#4cd7f6] hover:bg-[#57dffe] text-[#001f26] font-bold rounded-xl text-xs uppercase transition-all whitespace-nowrap active:scale-95"
                  >
                    Áp mã
                  </button>
                </div>
              </div>

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

      {showNoVehicleAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setShowNoVehicleAlert(false)}
          ></div>
          <div className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in text-on-surface z-50 p-6 text-center">
            <span className="material-symbols-outlined text-5xl text-amber-500 mb-4 block">directions_car</span>
            <h3 className="font-extrabold text-lg text-[#00236f] mb-2">Chưa có thông tin xe</h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              Bạn cần cung cấp thông tin xe để có thể sử dụng dịch vụ vệ sinh nội thất hoặc tiến hành đặt lịch.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowNoVehicleAlert(false)}
                className="flex-1 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={scrollToVehicleSection}
                className="flex-[2] py-3 bg-[#00236f] hover:bg-primary-container text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95"
              >
                Thêm xe ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up modal thêm xe mới theo thiết kế ảnh 2 */}
      {showAddCarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => !isAddingCar && setShowAddCarModal(false)}
          ></div>
          
          {/* Modal Box */}
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-on-surface z-50">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-outline-variant/35 bg-surface-container-lowest">
              <h3 className="font-extrabold text-base text-[#00236f]">Thêm thông tin xe mới</h3>
              <button
                type="button"
                disabled={isAddingCar}
                onClick={() => setShowAddCarModal(false)}
                className="p-1 hover:bg-surface-container-low rounded-lg transition-all text-outline"
              >
                <span className="material-symbols-outlined text-xl font-bold">close</span>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveNewCar} className="p-6 space-y-5">
              
              {/* Tên xe */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Tên xe</label>
                <input
                  type="text"
                  required
                  disabled={isAddingCar}
                  placeholder="e.g., Toyota Vios"
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold"
                />
              </div>

              {/* Biển số & Màu xe */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Biển số xe</label>
                  <input
                    type="text"
                    required
                    disabled={isAddingCar}
                    placeholder="e.g., 51H-123.45"
                    value={carLicense}
                    onChange={(e) => setCarLicense(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Màu xe</label>
                  <input
                    type="text"
                    disabled={isAddingCar}
                    placeholder="e.g., Trắng"
                    value={carColor}
                    onChange={(e) => setCarColor(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Loại xe */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-outline uppercase tracking-wider ml-1">Loại xe</label>
                <select
                  required
                  disabled={isAddingCar}
                  value={carTypeId}
                  onChange={(e) => setCarTypeId(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-bold text-on-surface"
                >
                  <option value="">Chọn loại xe</option>
                  <option value="VT-OTO-2C">Ô tô 2 chỗ</option>
                  <option value="VT-OTO-4C">Ô tô 4 chỗ</option>
                  <option value="VT-OTO-7C">Ô tô 7 chỗ</option>
                  <option value="VT-OTO-BT">Xe bán tải</option>
                  <option value="VT-OTO-SUV">SUV</option>
                </select>
              </div>

              {/* Confidentiality Banner */}
              <div className="relative rounded-2xl overflow-hidden min-h-[90px] flex items-center border border-outline-variant/30 p-4 bg-cover bg-center" style={{ backgroundImage: "url('/car_secure_banner.png')" }}>
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-white/85"></div>
                <div className="relative z-10 flex items-center gap-3.5 text-[#00236f]">
                  <span className="material-symbols-outlined text-2xl font-bold">verified</span>
                  <p className="text-[11px] font-bold text-[#00236f] leading-relaxed">
                    Thông tin của bạn sẽ được bảo mật tuyệt đối
                  </p>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end items-center gap-3 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  disabled={isAddingCar}
                  onClick={() => setShowAddCarModal(false)}
                  className="px-6 py-2.5 text-sm font-bold text-on-surface-variant hover:underline"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isAddingCar}
                  className="px-6 py-3 bg-[#00236f] hover:bg-[#00236f]/90 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  {isAddingCar ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Pop-up modal thông báo lỗi chọn slot do không đủ slot liên tiếp */}
      {slotError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setSlotError(null)}
          ></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-on-surface z-50 p-6 space-y-6">
            <div className="flex items-center gap-3 text-amber-600 border-b border-outline-variant/20 pb-4">
              <span className="material-symbols-outlined text-3xl font-bold select-none">warning</span>
              <h3 className="font-extrabold text-base text-[#00236f] uppercase tracking-tight">Khung giờ không khả dụng</h3>
            </div>
            
            <p className="text-sm font-semibold leading-relaxed text-on-surface-variant">
              {slotError}
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSlotError(null)}
                className="px-6 py-2.5 bg-[#00236f] hover:bg-[#00236f]/90 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[24px] w-full max-w-sm shadow-2xl overflow-hidden animate-slideUp border border-outline-variant/20 flex flex-col relative">
            <button 
              onClick={() => setShowLoginPrompt(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="p-6 text-center mt-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-blue-600 text-3xl">login</span>
              </div>
              <h3 className="font-black text-xl text-primary mb-2">Yêu cầu đăng nhập</h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                Bạn cần đăng nhập tài khoản để có thể tiếp tục thao tác.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 py-3 bg-surface-container hover:bg-outline-variant/20 text-on-surface font-bold rounded-xl transition-all"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#001d5c] shadow-md hover:shadow-lg transition-all"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
