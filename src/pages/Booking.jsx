import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

// CẤU HÌNH DỮ LIỆU TẬP TRUNG - Cực kỳ dễ sửa đổi, nâng cấp và tích hợp API BE
const BRANCHES = [
  { 
    id: 'BRN-LD-01', 
    name: 'LunaWash Linh Đông', 
    address: 'Thủ Đức, HCM',
    phone: '090 123 4567',
    hours: '06:00 - 22:00',
    description: 'Chi nhánh Linh Đông sở hữu hệ thống rửa xe tự động vòi phun đa điểm hiện đại bậc nhất Thủ Đức, công suất lớn, phòng chờ lạnh và quầy café phục vụ khách.',
    image: '/linh-dong-branch.jpg',
    mapUrl: 'https://maps.google.com/maps?q=10.852445,106.748364&z=16&ie=UTF8&iwloc=&output=embed',
    lat: 10.852445,
    lng: 106.748364
  },
  { 
    id: 'BRN-TTH-01', 
    name: 'LunaWash Tân Thới Hiệp', 
    address: 'Quận 12, HCM',
    phone: '090 234 5678',
    hours: '06:00 - 22:00',
    description: 'Chi nhánh Quận 12 trang bị máy sấy phản lực gió siêu tốc và quy trình rửa gầm chuyên sâu, tối ưu cho dòng xe SUV và xe bán tải.',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=400&q=80',
    mapUrl: 'https://maps.google.com/maps?q=10.861789,106.657512&z=16&ie=UTF8&iwloc=&output=embed',
    lat: 10.861789,
    lng: 106.657512
  },
  { 
    id: 'BRN-Q1-01', 
    name: 'LunaWash Quận 1', 
    address: '123 Lê Lợi, Bến Thành',
    phone: '090 345 6789',
    hours: '07:00 - 23:00',
    description: 'Vị trí đắc địa ngay trung tâm thành phố. Chi nhánh Quận 1 cung cấp dịch vụ rửa xe kết hợp đánh bóng nhanh và sáp phủ bóng Ceramic cao cấp.',
    image: 'https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&w=400&q=80',
    mapUrl: 'https://maps.google.com/maps?q=10.772564,106.698047&z=16&ie=UTF8&iwloc=&output=embed',
    lat: 10.772564,
    lng: 106.698047
  },
  { 
    id: 'BRN-Q7-01', 
    name: 'LunaWash Quận 7', 
    address: '456 Nguyễn Văn Linh',
    phone: '090 456 7890',
    hours: '06:00 - 22:00',
    description: 'Trạm rửa siêu rộng rãi tại khu đô thị Phú Mỹ Hưng với 3 làn rửa chạy song song, rút ngắn tối đa thời gian chờ đợi của quý khách.',
    image: 'https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?auto=format&fit=crop&w=400&q=80',
    mapUrl: 'https://maps.google.com/maps?q=10.729351,106.702983&z=16&ie=UTF8&iwloc=&output=embed',
    lat: 10.729351,
    lng: 106.702983
  },
  { 
    id: 'BRN-TB-01', 
    name: 'LunaWash Tân Bình', 
    address: '789 Cộng Hòa, Phường 13',
    phone: '090 567 8901',
    hours: '06:00 - 22:30',
    description: 'Chi nhánh Cộng Hòa nổi bật với khu vực chăm sóc nội thất chuyên sâu và hệ thống lọc nước RO tiêu chuẩn, bảo vệ tối đa lớp sơn bóng của xe.',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
    mapUrl: 'https://maps.google.com/maps?q=10.801648,106.640954&z=16&ie=UTF8&iwloc=&output=embed',
    lat: 10.801648,
    lng: 106.640954
  }
];

// Hàm tính khoảng cách Haversine giữa 2 tọa độ (trả về km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
};

const WASH_SLOTS = [
  { id: 'SL-01', name: 'Trạm 1', status: 'Sẵn sàng', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'SL-02', name: 'Trạm 2', status: 'Sẵn sàng', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'SL-03', name: 'Trạm 3', status: 'Sẵn sàng', color: 'text-emerald-600 bg-emerald-50' }
];

// Removed static SERVICE_PACKAGES

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
// Removed static INTERIOR_CLEAN_SPECS

/**
 * Trang Đặt Lịch Rửa Xe Thông Minh (Booking) - LunaWash.
 * Thiết kế khớp hoàn hảo với Ảnh 4.
 */
export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [promoCode, setPromoCode] = useState(location.state?.promoCode || '');
  const navState = location.state || {};

  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const handleFindNearestBranch = () => {
    if (!navigator.geolocation) {
      toast.error('Trình duyệt của bạn không hỗ trợ định vị GPS!');
      return;
    }
    
    setIsFindingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let nearestBranch = null;
        let minDistance = Infinity;

        BRANCHES.forEach(branch => {
          if (branch.lat && branch.lng) {
            const distance = calculateDistance(latitude, longitude, branch.lat, branch.lng);
            if (distance < minDistance) {
              minDistance = distance;
              nearestBranch = branch;
            }
          }
        });

        if (nearestBranch) {
          setSelectedBranch(nearestBranch.id);
          toast.success(`Đã tự động chọn chi nhánh gần nhất: ${nearestBranch.name} (cách bạn khoảng ${minDistance.toFixed(1)} km)`, { duration: 5000, icon: '📍' });
        }
        setIsFindingLocation(false);
      },
      (error) => {
        toast.error('Không thể lấy vị trí. Vui lòng cho phép quyền truy cập Vị trí!');
        setIsFindingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [activeBookingInfo, setActiveBookingInfo] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);

  useEffect(() => {
    const checkActiveBooking = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const res = await fetch(import.meta.env.VITE_API_URL + '/api/bookings/history', {
            headers: { 'Authorization': `Bearer ${parsed.token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const validData = data.filter(b => !(b.paymentMethod === 'vnpay_pending' && (b.status === 'Sắp đến' || b.status === 'Pending')));
            const active = validData.find(b => ['Pending', 'Confirmed', 'InProgress', 'Sắp đến', 'Đang rửa'].includes(b.status));
            if (active) {
              setHasActiveBooking(true);
              setActiveBookingInfo(active);
            }
          }
        } catch (e) {
          console.error('Error checking active booking:', e);
        }
      }
    };
    checkActiveBooking();
  }, []);


  // Cuộn lên đầu trang khi component được mount (đặc biệt khi chuyển từ trang chủ sang)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Dọn dẹp booking rác nếu user bấm nút BACK từ trang thanh toán VNPay
  useEffect(() => {
    const checkAbortedPayment = async () => {
      const pendingId = localStorage.getItem('pendingVnpayBooking');
      if (pendingId) {
        localStorage.removeItem('pendingVnpayBooking');
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${pendingId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${parsed.token}`
              }
            });
            setTimeout(() => {
              toast.error('Bạn đã hủy thanh toán. Lịch đặt chưa được ghi nhận!', { id: 'vnpay-abort', duration: 5000 });
            }, 500);
          } catch(e) {}
        }
      }
    };
    checkAbortedPayment();
  }, []);

  const [highlightPromo, setHighlightPromo] = useState(false);
  const toastShownRef = React.useRef(false);

  // Promo Code Verification
  const [discountInfo, setDiscountInfo] = useState(null);
  const [isVerifyingPromo, setIsVerifyingPromo] = useState(false);
  const [promoError, setPromoError] = useState(null);

  const handleApplyPromo = async (codeToApply) => {
    // If called from button onClick, codeToApply is an Event object
    const code = (typeof codeToApply === 'string' ? codeToApply : promoCode)?.trim();
    if (!code) {
      setDiscountInfo(null);
      setPromoError(null);
      return;
    }

    setIsVerifyingPromo(true);
    setDiscountInfo(null);
    setPromoError(null);
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setPromoError("Vui lòng đăng nhập để sử dụng mã.");
        setIsVerifyingPromo(false);
        return;
      }
      const parsed = JSON.parse(storedUser);
      const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');
      
      const res = await fetch(`${baseUrl}/api/vouchers/my-vouchers`, {
        headers: { 'Authorization': `Bearer ${parsed.token}` }
      });
      
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error(`Server returned non-JSON. Status: ${res.status}`);
      }

      if (res.ok) {
        const vouchers = data.data || [];
        const found = vouchers.find(v => (v.voucherId === code || v.id === code));
        
        if (found) {
          const isExpired = new Date(found.expiryDate) < new Date();
          if (isExpired) {
            setPromoError("Mã giảm giá đã hết hạn.");
          } else {
            setDiscountInfo({
              discountPercent: found.discountValue || null,
              discountAmount: found.discountAmount || null,
              name: found.voucherName || code
            });
            toast.success(`Áp dụng mã ${found.voucherName || code} thành công!`, {
              icon: '🎁',
              duration: 4000,
              style: {
                borderRadius: '16px',
                background: '#ffffff',
                color: '#00236f',
                fontWeight: '900',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '2px solid #4cd7f6'
              },
            });
            setHighlightPromo(true);
            setTimeout(() => setHighlightPromo(false), 3000);
          }
        } else {
          setPromoError("Mã giảm giá không hợp lệ hoặc bạn chưa lưu mã này.");
        }
      } else {
        setPromoError(data.message || "Không thể xác thực mã giảm giá.");
      }
    } catch (error) {
      console.error('Lỗi khi check mã:', error);
      setPromoError(`Lỗi kết nối: ${error.message}`);
    } finally {
      setIsVerifyingPromo(false);
    }
  };

  useEffect(() => {
    if (location.state?.promoCode && !toastShownRef.current) {
      toastShownRef.current = true;
      handleApplyPromo(location.state.promoCode);
      
      // Clear the promoCode from history state so it doesn't trigger again on reload
      navigate(location.pathname, { replace: true, state: { ...navState, promoCode: undefined } });
    }
  }, [location.state, location.pathname, navigate, navState]);

  // BƯỚC THIẾT LẬP STATE
  const [selectedBranch, setSelectedBranch] = useState(navState.branchId || '');
  const [selectedWashSlot, setSelectedWashSlot] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(navState.packageId || '');
  
  const [mainPackages, setMainPackages] = useState([]);
  const [addOnServices, setAddOnServices] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [serviceFetchError, setServiceFetchError] = useState(false);

  useEffect(() => {
    // Gọi API lấy danh sách dịch vụ động (nếu backend đang chạy)
    const fetchServices = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/services');
        if (res.ok) {
          const data = await res.json();
          setMainPackages(data.filter(s => s.serviceType === 'Package' && s.isActive));
          setAddOnServices(data.filter(s => s.serviceType === 'AddOn' && s.isActive));
          setServiceFetchError(false);
        } else {
          setServiceFetchError(true);
        }
      } catch (err) {
        setServiceFetchError(true);
      }
    };
    fetchServices();
  }, []);


  // Xe và Thông tin xe (lấy từ Backend)
  const [userVehicles, setUserVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

  // Lấy cấu hình dịch vụ vệ sinh nội thất cho loại xe đang chọn
  const activeVehicle = userVehicles.find(v => v.id === selectedVehicleId);
  const selectedVehicleTypeId = activeVehicle?.vehicleTypeId || 'VT-OTO-4C';
    // --- Tính toán số slot ---
  const activeMainPackage = mainPackages.find(p => p.id === selectedPackage);
  let mainDuration = 0;
  if (activeMainPackage && activeMainPackage.prices) {
    const pInfo = activeMainPackage.prices.find(p => p.vehicleTypeId === selectedVehicleTypeId) || activeMainPackage.prices[0];
    mainDuration = pInfo?.durationMinutes || 0;
  }

  let addOnsDuration = 0;
  selectedAddOns.forEach(id => {
    const addon = addOnServices.find(a => a.id === id);
    if (addon && addon.prices) {
      const pInfo = addon.prices.find(p => p.vehicleTypeId === selectedVehicleTypeId) || addon.prices[0];
      addOnsDuration += (pInfo?.durationMinutes || 0);
    }
  });

  const totalDurationMinutes = mainDuration + addOnsDuration;
  
  // Tính số lượng slot cần thiết (mỗi slot kéo dài tương đương 45 phút thực tế cho booking)
  const numSlots = totalDurationMinutes > 0 ? Math.ceil(totalDurationMinutes / 45) : 1;
  // -------------------------



  // Lỗi khi chọn slot giờ không hợp lệ
  const [slotError, setSlotError] = useState(null);

  const getSlotSelectionError = (idx) => {
    if (idx + numSlots > TIME_SLOTS.length) {
      const slotsRemaining = TIME_SLOTS.length - idx;
      return `Các dịch vụ bạn chọn cần đăng ký ${numSlots} slot liên tiếp (tổng cộng ${totalDurationMinutes} phút). Tuy nhiên, nếu bắt đầu từ Lượt ${idx + 1} (${TIME_SLOTS[idx].time}), từ đây đến cuối ngày chỉ còn lại ${slotsRemaining} slot, không đủ để hoàn thành dịch vụ. Vui lòng chọn khung giờ bắt đầu sớm hơn.`;
    }
    for (let i = 0; i < numSlots; i++) {
      if (occupiedSlots.has(idx + i)) {
        return `Không thể đặt lịch bắt đầu từ Lượt ${idx + 1} (${TIME_SLOTS[idx].time}) vì trong chuỗi ${numSlots} slot liên tiếp cần thiết, Lượt ${idx + i + 1} (${TIME_SLOTS[idx + i].time}) đã bị khách hàng khác đặt trước. Quy định yêu cầu các slot phải liên tục và không bị gián đoạn. Vui lòng chọn khung giờ trống liền mạch khác.`;
      }
    }
    return null;
  };

  // Trạng thái modal thêm xe mới
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Trạng thái modal voucher
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [myVouchers, setMyVouchers] = useState([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);

  const handleOpenVoucherModal = async () => {
    if (requireLogin()) return;
    setShowVoucherModal(true);
    setIsLoadingVouchers(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      const parsed = JSON.parse(storedUser);
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/vouchers/my-vouchers', {
        headers: { 'Authorization': `Bearer ${parsed.token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setMyVouchers(result.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingVouchers(false);
    }
  };

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
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('tien-mat');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const [activeStep, setActiveStep] = useState('step-1');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (window.scrollY < 20) {
        setActiveStep('step-1');
        return;
      }
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveStep(entry.target.id);
        }
      });
    }, { rootMargin: '-25% 0px -45% 0px' });

    ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 20) {
        setActiveStep('step-1');
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lấy danh sách xe thật của người dùng từ BE khi mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.token) {
          setIsLoadingVehicles(true);
          fetch(import.meta.env.VITE_API_URL + '/api/vehicles', {
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
            setSelectedVehicleId(''); // Bắt buộc người dùng tự chọn xe
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
          fetch(import.meta.env.VITE_API_URL + '/api/vehicles', {
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

  // Lấy thời gian hiện tại chuẩn GMT+7 (Giờ Việt Nam)
  const getVietnamTime = () => {
    const vnTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
    return new Date(vnTimeStr);
  };

  // Khởi tạo ngày hôm nay dạng YYYY-MM-DD theo giờ VN
  const getTodayStr = (d = getVietnamTime()) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);

  // Tính toán giới hạn ngày đặt lịch dựa trên hạng thành viên
  const [maxBookingDays, setMaxBookingDays] = useState(3);
  const [currentTier, setCurrentTier] = useState('Đồng');

  useEffect(() => {
    const fetchTierSettings = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      try {
        const parsed = JSON.parse(storedUser);
        const userTier = parsed.tier || 'Đồng';
        setCurrentTier(userTier);
        
        // Cố gắng đọc từ localStorage trước để render nhanh
        const localDays = parseInt(parsed.maxBookingDays, 10);
        if (localDays) setMaxBookingDays(localDays);

        // Fetch API để cập nhật chính xác cấu hình mới nhất
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/Membership/settings', {
          headers: { 'Authorization': `Bearer ${parsed.token}` }
        });
        if (res.ok) {
          const tiers = await res.json();
          // Tìm tier khớp (xử lý ngoại lệ "Member" == "Đồng")
          const checkTier = userTier.toLowerCase() === 'member' ? 'đồng' : userTier.toLowerCase();
          const match = tiers.find(t => {
            const tName = t.tierName.toLowerCase();
            return tName === checkTier || (tName.includes('đồng') && checkTier.includes('member'));
          });
          
          if (match && match.maxBookingDays) {
            setMaxBookingDays(match.maxBookingDays);
            
            // Cập nhật lại vào localStorage
            parsed.maxBookingDays = match.maxBookingDays;
            localStorage.setItem('user', JSON.stringify(parsed));
          }
        }
      } catch (err) {
        console.error('Error fetching tier settings:', err);
      }
    };
    fetchTierSettings();
  }, []);

  const todayStart = getVietnamTime();
  todayStart.setHours(0, 0, 0, 0);
  const maxAllowedDate = getVietnamTime();
  maxAllowedDate.setDate(maxAllowedDate.getDate() + maxBookingDays);
  maxAllowedDate.setHours(23, 59, 59, 999);

  // Lấy năm và tháng từ selectedDate để hiển thị lịch ban đầu
  const [calendarYear, setCalendarYear] = useState(() => {
    const parts = selectedDate.split('-');
    return parts[0] ? parseInt(parts[0], 10) : getVietnamTime().getFullYear();
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const parts = selectedDate.split('-');
    return parts[1] ? parseInt(parts[1], 10) - 1 : getVietnamTime().getMonth();
  });

  const [occupiedSlotsSet, setOccupiedSlotsSet] = useState(new Map());

  useEffect(() => {
    if (!selectedBranch || !selectedWashSlot) {
      setOccupiedSlotsSet(new Map());
      return;
    }
    const fetchOccupied = async () => {
      try {
        const slotNumber = selectedWashSlot.split('-')[1];
        if (!slotNumber) return;
        const washSlotId = `${selectedBranch}-WS-${slotNumber}`;
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/occupied-slots?date=${selectedDate}&washSlotId=${washSlotId}`);
        if (!res.ok) return;
        const data = await res.json();
        
        const blocked = new Map();
        
        // 1. Chặn các slot giờ đã qua trong ngày hôm nay
        const now = getVietnamTime();
        const localISOTime = getTodayStr(now);
        const isToday = selectedDate === localISOTime;
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        TIME_SLOTS.forEach((slot, index) => {
          if (isToday) {
            const [slotHour, slotMin] = slot.time.split(':').map(Number);
            if (slotHour < currentHour || (slotHour === currentHour && slotMin <= currentMinute)) {
              blocked.set(index, 'past');
            }
          }
        });

        // 2. Chặn các slot đã có người đặt từ Database
        data.forEach(booking => {
            const startD = new Date(booking.startTime);
            const startTotal = startD.getHours() * 60 + startD.getMinutes();
            
            const endD = new Date(booking.endTime);
            const endTotal = endD.getHours() * 60 + endD.getMinutes();
            
            TIME_SLOTS.forEach((slot, i) => {
               const [slotH, slotM] = slot.time.split(':').map(Number);
               const slotTotal = slotH * 60 + slotM;
               
               if (slotTotal >= startTotal && slotTotal < endTotal) {
                   blocked.set(i, 'booked');
               }
            });
        });
        
        setOccupiedSlotsSet(blocked);
      } catch(e) { console.error(e); }
    };
    fetchOccupied();
  }, [selectedDate, selectedWashSlot, selectedBranch]);

  const occupiedSlots = React.useMemo(() => occupiedSlotsSet, [occupiedSlotsSet]);

  // Tự động chuyển slot giờ được chọn sang slot còn trống đầu tiên nếu bị trùng vào slot đã đặt
  useEffect(() => {
    if (!selectedTimeSlotId) return; // Không tự chọn khi chưa chọn gì
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
      } else {
        setSelectedTimeSlotId(null);
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
    const today = getVietnamTime();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
    setCalendarMonth(today.getMonth());
    setCalendarYear(today.getFullYear());
    setShowCalendarPopup(false);
  };

  const getBranchSlots = (branchId) => {
    if (!branchId) return [];
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
    if (!selectedBranch) {
      setSelectedWashSlot('');
      return;
    }
    const validSlots = getBranchSlots(selectedBranch);
    if (selectedWashSlot && !validSlots.some(s => s.id === selectedWashSlot)) {
      setSelectedWashSlot(validSlots[0]?.id || '');
    }
  }, [selectedBranch]);



  // TÍNH TOÁN DỮ LIỆU TÓM TẮT DỊCH VỤ ĐỘNG
  const activePackage = mainPackages.find(p => p.id === selectedPackage) || null;
  const activePackagePrice = activePackage?.prices?.find(p => p.vehicleTypeId === selectedVehicleTypeId)?.price || activePackage?.prices?.[0]?.price || 0;
  const baseCost = activePackage ? activePackagePrice : 0;
  
  const activeAddOnList = addOnServices.filter(a => selectedAddOns.includes(a.id));
  const interiorCost = activeAddOnList.reduce((sum, a) => sum + (a.prices?.find(p => p.vehicleTypeId === selectedVehicleTypeId)?.price || a.prices?.[0]?.price || 0), 0);
  
  const baseTotal = baseCost + interiorCost;
  const actualDiscountPercent = discountInfo?.discountPercent || 0;
  const totalCost = baseTotal - (baseTotal * actualDiscountPercent / 100);

  const activePackageDuration = activePackage?.prices?.find(p => p.vehicleTypeId === selectedVehicleTypeId)?.durationMinutes || activePackage?.prices?.[0]?.durationMinutes || 0;
  const interiorDuration = activeAddOnList.reduce((sum, a) => sum + (a.prices?.find(p => p.vehicleTypeId === selectedVehicleTypeId)?.durationMinutes || a.prices?.[0]?.durationMinutes || 0), 0);
  const totalDuration = activePackageDuration + interiorDuration;
  const displayDuration = selectedPackage ? (numSlots * 45 - 5) : 0;
  const activeBranchName = BRANCHES.find(b => b.id === selectedBranch)?.name || 'Chưa chọn';
  const activeSlotName = selectedWashSlot ? (WASH_SLOTS.find(s => s.id === selectedWashSlot)?.name || 'Chưa chọn') : 'Chưa chọn';
  const selectedBranchData = BRANCHES.find(b => b.id === selectedBranch) || null;
  const selectedBranchIdx = BRANCHES.findIndex(b => b.id === selectedBranch);
  const allStepsCompleted = !!selectedBranch && !!selectedWashSlot && !!selectedPackage && !!selectedVehicleId && !!selectedTimeSlotId;

  // Định dạng danh sách slot được chọn
  const getSelectedSlotsDisplay = () => {
    const startIndex = TIME_SLOTS.findIndex(t => t.id === selectedTimeSlotId);
    if (startIndex === -1) return 'Chưa chọn';
    
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
    if (startIndex === -1) return 'Chưa chọn';
    
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

  const handleOpenPaymentModal = () => {
    if (requireLogin()) return;
    if (hasActiveBooking) {
      setShowBlockModal(true);
      return;
    }
    if (!selectedBranch) {
      toast.error('Vui lòng chọn chi nhánh!');
      return;
    }
    if (!selectedWashSlot) {
      toast.error('Vui lòng chọn trạm rửa!');
      return;
    }
    if (!selectedPackage) {
      toast.error('Vui lòng chọn gói dịch vụ!');
      return;
    }
    if (!selectedVehicleId) {
      setShowNoVehicleAlert(true);
      return;
    }

    const activeVeh = userVehicles.find(v => v.id === selectedVehicleId);
    if (!activeVeh) return;

    const startIndex = TIME_SLOTS.findIndex(t => t.id === selectedTimeSlotId);
    if (startIndex === -1) {
      toast.error('Vui lòng chọn khung giờ hợp lệ!');
      return;
    }

    setShowPaymentModal(true);
  };

  const handleExecuteCheckout = async (selectedMethod) => {
    const activeVeh = userVehicles.find(v => v.id === selectedVehicleId);
    if (!activeVeh) return;

    let serviceIds = [];
    if (activePackage) {
      const pkgPriceInfo = activePackage.prices?.find(p => p.vehicleTypeId === selectedVehicleTypeId) || activePackage.prices?.[0];
      if (pkgPriceInfo?.id) {
        serviceIds.push(pkgPriceInfo.id);
      }
    }

    activeAddOnList.forEach(a => {
      const addonPriceInfo = a.prices?.find(p => p.vehicleTypeId === selectedVehicleTypeId) || a.prices?.[0];
      if (addonPriceInfo?.id) {
        serviceIds.push(addonPriceInfo.id);
      }
    });

    const startIndex = TIME_SLOTS.findIndex(t => t.id === selectedTimeSlotId);
    if (startIndex === -1) {
      toast.error('Vui lòng chọn khung giờ hợp lệ!');
      return;
    }
    const startStr = TIME_SLOTS[startIndex].time;
    const scheduledStartTime = `${selectedDate}T${startStr}:00`;
    
    const notesStr = selectedMethod === 'vnpay' ? 'VNPay' : '';

    const slotNumber = selectedWashSlot.split('-')[1];
    const washSlotId = `${selectedBranch}-WS-${slotNumber}`;

    const bookingPayload = {
      BranchId: selectedBranch,
      WashSlotId: washSlotId,
      VehicleTypeId: activeVeh.vehicleTypeId || 'VT-OTO-4C',
      LicensePlate: activeVeh.license,
      VehicleBrand: activeVeh.brand || '',
      VehicleModel: activeVeh.model || '',
      ScheduledStartTime: scheduledStartTime,
      Duration: totalDuration,
      Notes: notesStr,
      ServicePriceIds: serviceIds,
      PromoCode: discountInfo ? promoCode : undefined
    };

    const bookingState = {
      paymentMethod: selectedMethod,
      packageName: `GÓI ${activePackage.serviceName.toUpperCase()}${activeAddOnList.length > 0 ? ' + DỊCH VỤ KÈM' : ''}`,
      services: `${activePackage.serviceName}${activeAddOnList.length > 0 ? ' + Dịch vụ kèm' : ''}`, 
      formattedPrice: formatCurrency(totalCost),
      activeBranchName,
      address: BRANCHES.find(b => b.id === selectedBranch)?.address || 'Thủ Đức, HCM',
      activeSlotName,
      expectedTimeRange,
      vehicleLicense: activeVeh ? `${activeVeh.name} - ${activeVeh.license} (${activeVeh.color})` : 'Chưa chọn xe',
      bookingDate: selectedDate,
      bookingPayload
    };
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      const parsed = JSON.parse(storedUser);

      toast.loading('Đang xử lý đặt lịch...', { id: 'booking' });
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/bookings', {
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
        } catch {}
        throw new Error(errText);
      }

      const responseData = await response.json();
      
      if (selectedMethod === 'vnpay') {
        toast.loading('Đang khởi tạo thanh toán VNPAY...', { id: 'booking' });
        try {
          // Gọi API tạo URL thanh toán VNPAY từ Backend
          const payRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-vnpay-url/${responseData.id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${parsed.token}`
            }
          });
          if (payRes.ok) {
            const payData = await payRes.json();
            if (payData.url) {
              // Lưu tạm ID để xử lý nếu user bấm nút Back ở trình duyệt (hủy ngang)
              localStorage.setItem('pendingVnpayBooking', responseData.id);
              // Chuyển hướng sang cổng thanh toán VNPAY (Hiển thị QR & thẻ ngân hàng)
              window.location.href = payData.url;
              return;
            }
          }
          throw new Error('Không thể tạo liên kết thanh toán VNPAY.');
        } catch (payErr) {
          console.error(payErr);
          toast.error('Đặt lịch thành công nhưng không tạo được liên kết thanh toán. Vui lòng thanh toán tại quầy.', { id: 'booking' });
          navigate('/history', { state: bookingState });
        }
      } else {
        toast.success('Đặt lịch thành công!', { id: 'booking' });
        navigate('/history', { state: bookingState });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message, { id: 'booking' });
    }
  };


  return (
    <main className="min-h-screen bg-background relative w-full pt-[80px]">
      <style>{`
        @keyframes shimmer-glow {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        @keyframes gentle-bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 15px 20px -5px rgba(6, 182, 212, 0.45), 0 8px 8px -5px rgba(6, 182, 212, 0.4);
          }
        }
        .shimmer-bounce-btn {
          background: linear-gradient(90deg, #4cd7f6 0%, #a5f3fc 25%, #4cd7f6 50%, #a5f3fc 75%, #4cd7f6 100%);
          background-size: 200% auto;
          animation: shimmer-glow 1.8s linear infinite, gentle-bounce 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div className="flex flex-col lg:flex-row w-full min-h-[calc(100vh-80px)] lg:justify-between relative">
      
      {/* NARROW LEFT SIDEBAR (PROGRESS) */}
      <div className="hidden lg:flex sticky top-[80px] h-[calc(100vh-80px)] w-[120px] shrink-0 bg-background z-[40] flex-col items-center py-8 border-r border-outline-variant/30">
        <div className="flex-1 flex flex-col items-center gap-12 relative w-full pt-4">
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-12 w-[2px] bg-outline-variant/30"></div>
          {['1', '2', '3', '4', '5'].map((num) => {
             const stepId = `step-${num}`;
             const isActive = activeStep === stepId;
             const labels = ['Chi nhánh', 'Trạm rửa', 'Gói dịch vụ', 'Thông tin xe', 'Khung giờ'];
             const isCompleted = (() => {
               if (num === '1') return !!selectedBranch;
               if (num === '2') return !!selectedWashSlot;
               if (num === '3') return !!selectedPackage;
               if (num === '4') return !!selectedVehicleId;
               if (num === '5') return !!selectedTimeSlotId;
               return false;
             })();
             return (
               <div 
                 key={stepId}
                 onClick={() => document.getElementById(stepId)?.scrollIntoView({behavior: 'smooth', block: 'center'})}
                 className="flex flex-col items-center gap-2 relative z-10 cursor-pointer group"
               >
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                   isCompleted 
                     ? `bg-emerald-500 text-white shadow-md ${isActive ? 'scale-125 ring-4 ring-emerald-500/30' : 'ring-2 ring-emerald-500/20'}`
                     : isActive 
                       ? 'bg-[#00236f] text-white scale-125 shadow-lg ring-4 ring-[#00236f]/20' 
                       : 'bg-surface-container text-outline ring-2 ring-outline-variant/50 group-hover:ring-[#00236f]/50'
                 }`}>
                   {isCompleted ? (
                     <span className="material-symbols-outlined text-xl font-bold block select-none">check</span>
                   ) : (
                     num
                   )}
                 </div>
                 <span className={`text-[10px] font-bold text-center px-1 leading-tight transition-all duration-300 ${
                   isActive 
                     ? 'text-[#00236f] mt-1' 
                     : isCompleted 
                       ? 'text-emerald-600' 
                       : 'text-outline-variant group-hover:text-outline'
                 }`}>
                   {labels[num-1]}
                 </span>
               </div>
             )
          })}
        </div>
      </div>

      {/* CỘT GIỮA (MAIN CONTENT) */}
      <div className="flex-1 w-full min-w-0 flex flex-col relative pb-32 lg:pb-0">
        {/* MOBILE PROGRESS BAR (HORIZONTAL) */}
        <div className="lg:hidden w-full px-6 pt-8 pb-2">
          <h1 className="text-xl md:text-3xl font-black text-[#00236f] uppercase tracking-tight text-center mb-6">
            LunaWash - Đặt Lịch
          </h1>
          <div className="flex justify-between items-center relative max-w-[400px] mx-auto">
            <div className="absolute left-4 right-4 top-4 h-[2px] bg-outline-variant/30 z-0"></div>
            {['1', '2', '3', '4', '5'].map((num) => {
              const stepId = `step-${num}`;
              const isActive = activeStep === stepId;
              const isCompleted = (() => {
                if (num === '1') return !!selectedBranch;
                if (num === '2') return !!selectedWashSlot;
                if (num === '3') return !!selectedPackage;
                if (num === '4') return !!selectedVehicleId;
                if (num === '5') return !!selectedTimeSlotId;
                return false;
              })();
              return (
                <div 
                  key={`mobile-${stepId}`}
                  onClick={() => document.getElementById(stepId)?.scrollIntoView({behavior: 'smooth', block: 'start'})}
                  className="flex flex-col items-center gap-1 relative z-10 cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white shadow-md'
                      : isActive 
                        ? 'bg-[#00236f] text-white scale-110 shadow-lg ring-2 ring-[#00236f]/30' 
                        : 'bg-surface-container text-outline ring-1 ring-outline-variant/50'
                  }`}>
                    {isCompleted ? <span className="material-symbols-outlined text-sm font-bold block">check</span> : num}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="pt-2 lg:pt-8 pb-16 px-margin-mobile md:px-12 relative z-10 w-full max-w-[1000px] mx-auto">
          <div className="space-y-8 pb-32">

        {/* 1. CHỌN CHI NHÁNH */}
        <section id="step-1" className={`transition-all duration-500 rounded-3xl p-6 space-y-4 scroll-m-24 ${activeStep === 'step-1' ? 'ring-4 ring-[#4cd7f6] ring-offset-4 ring-offset-background scale-[1.02] shadow-[0_0_30px_rgba(76,215,246,0.15)] z-20 bg-white' : 'border border-outline-variant/40 shadow-sm opacity-60 hover:opacity-100 bg-surface-container-lowest'}`}>
          <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">location_on</span>
              Chọn chi nhánh
            </div>
            <button 
              onClick={handleFindNearestBranch}
              disabled={isFindingLocation}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-all text-xs border border-primary/20 normal-case tracking-normal"
            >
              {isFindingLocation ? (
                <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
              ) : (
                <span className="material-symbols-outlined text-sm">my_location</span>
              )}
              {isFindingLocation ? 'Đang định vị...' : 'Gợi ý gần nhất'}
            </button>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {BRANCHES.map((b) => (
              <div 
                key={b.id}
                onClick={() => { setSelectedBranch(b.id); }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedBranch === b.id 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20' 
                    : 'border-outline-variant hover:border-primary/50 bg-surface-container-lowest'
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

          {selectedBranchData && (
            <div className="bg-[#00236f] text-white rounded-2xl p-5 mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-inner animate-fade-in">
              {/* 1. Ảnh chi nhánh */}
              <div className="relative w-full min-h-[12rem] rounded-xl overflow-hidden shadow-md group">
                <img 
                  src={selectedBranchData.image} 
                  alt={selectedBranchData.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3.5 pointer-events-none">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#4cd7f6] text-[#001f26] px-2 py-0.5 rounded pointer-events-auto">
                    Hình ảnh thực tế
                  </span>
                </div>
              </div>

              {/* 2. Thông tin chi nhánh */}
              <div className="flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-base text-[#4cd7f6] uppercase tracking-wide">
                    {selectedBranchData.name}
                  </h3>
                  <p className="text-white/80 text-xs mt-1.5 leading-relaxed font-medium">
                    {selectedBranchData.description}
                  </p>
                </div>
                <div className="space-y-1.5 text-xs border-t border-white/10 pt-3">
                  <p className="flex items-center gap-2 text-white/90">
                    <span className="material-symbols-outlined text-sm text-[#4cd7f6] font-bold">location_on</span>
                    <span>{selectedBranchData.address}</span>
                  </p>
                  <p className="flex items-center gap-2 text-white/90">
                    <span className="material-symbols-outlined text-sm text-[#4cd7f6] font-bold">call</span>
                    <span>Hotline: {selectedBranchData.phone}</span>
                  </p>
                  <p className="flex items-center gap-2 text-white/90">
                    <span className="material-symbols-outlined text-sm text-[#4cd7f6] font-bold">schedule</span>
                    <span>Giờ mở cửa: {selectedBranchData.hours}</span>
                  </p>
                </div>
              </div>

              {/* 3. Bản đồ */}
              <div className="relative w-full min-h-[12rem] rounded-xl overflow-hidden shadow-md border border-white/10 group z-10">
                <iframe
                  title={`Bản đồ ${selectedBranchData.name}`}
                  src={selectedBranchData.mapUrl}
                  className="absolute inset-0 w-full h-full border-0 filter brightness-95 z-0"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
                <a
                  href={selectedBranchData.mapUrl.replace('&output=embed', '').replace('output=embed', '')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 left-3 bg-white hover:bg-slate-100 text-[#00236f] hover:text-primary text-[10px] md:text-[11px] font-black px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 z-20"
                >
                  <span>Mở trong Maps</span>
                  <span className="material-symbols-outlined text-[13px] font-bold">open_in_new</span>
                </a>
              </div>
            </div>
          )}
        </section>

        {/* 2. CHỌN TRẠM RỬA */}
        <section id="step-2" className={`transition-all duration-500 rounded-3xl p-6 space-y-4 scroll-m-24 ${activeStep === 'step-2' ? 'ring-4 ring-[#4cd7f6] ring-offset-4 ring-offset-background scale-[1.02] shadow-[0_0_30px_rgba(76,215,246,0.15)] z-20 bg-white' : 'border border-outline-variant/40 shadow-sm opacity-60 hover:opacity-100 bg-surface-container-lowest'}`}>
          <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">local_laundry_service</span>
            Chọn trạm rửa
          </h2>
          <p className="text-xs text-on-surface-variant -mt-2">Mỗi trạm có 30 lượt phục vụ trong ngày. Vui lòng chọn trạm còn trống.</p>
          <div className={`grid grid-cols-1 gap-4 ${
            availableSlots.length === 3 ? 'sm:grid-cols-3' : availableSlots.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1 max-w-sm'
          }`}>
            {availableSlots.length > 0 ? (
              availableSlots.map((s) => (
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
              ))
            ) : (
              <p className="text-xs text-on-surface-variant italic py-2">Vui lòng chọn chi nhánh trước.</p>
            )}
          </div>
        </section>

        {/* 3. CHỌN GÓI DỊCH VỤ */}
        <section id="step-3" className={`transition-all duration-500 rounded-3xl p-6 space-y-4 scroll-m-24 ${activeStep === 'step-3' ? 'ring-4 ring-[#4cd7f6] ring-offset-4 ring-offset-background scale-[1.02] shadow-[0_0_30px_rgba(76,215,246,0.15)] z-20 bg-white' : 'border border-outline-variant/40 shadow-sm opacity-60 hover:opacity-100 bg-surface-container-lowest'}`}>
          <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-base">cleaning_services</span>
            Chọn gói dịch vụ
          </h2>
          {serviceFetchError ? (
            <div className="p-8 text-center text-error border border-error/20 rounded-2xl bg-error/5">
              <span className="material-symbols-outlined text-3xl mb-2">cloud_off</span>
              <p className="text-sm font-bold">Lỗi kết nối Cơ sở dữ liệu!</p>
              <p className="text-xs mt-1">Vui lòng kiểm tra lại kết nối Backend hoặc Database.</p>
            </div>
          ) : mainPackages.length === 0 ? (
            <div className="p-8 text-center text-outline-variant border border-dashed border-outline-variant/30 rounded-2xl bg-surface-container-lowest">
              <p className="text-sm italic font-medium">Hiện chưa có gói dịch vụ nào được thiết lập.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 pt-2" style={{ scrollbarWidth: 'thin' }}>
                {mainPackages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    id={`pkg-card-${pkg.id}`}
                    onClick={() => { setSelectedPackage(pkg.id); }}
                    className={`relative p-6 min-w-[280px] md:min-w-[320px] snap-center shrink-0 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
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
                      {pkg.iconName || 'water_drop'}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-lg">{pkg.serviceName}</h3>
                      <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">{pkg.description}</p>
                    </div>
                    <ul className="space-y-2 border-t border-outline-variant/20 pt-4 text-xs font-semibold text-on-surface-variant">
                      {pkg.serviceFeatures.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-emerald-600 text-sm font-bold">check</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 space-y-4">
                    {(() => {
                      const sp = pkg.prices?.find(p => p.vehicleTypeId === selectedVehicleTypeId) || pkg.prices?.[0];
                      const pts = sp?.pointsRewarded || 0;
                      return (
                        <div className="flex flex-col gap-2">
                          {pts > 0 && (
                            <div className="flex items-center gap-1 w-max px-2 py-0.5 bg-amber-50 rounded text-amber-600 border border-amber-100">
                              <span className="material-symbols-outlined text-[14px]">stars</span>
                              <span className="text-[11px] font-bold">+{pts} điểm</span>
                            </div>
                          )}
                          <div className="flex justify-between items-baseline">
                            <p className="text-2xl font-black">{(sp?.price || 0).toLocaleString('vi-VN') + 'đ'}</p>
                            <p className="text-[10px] text-outline font-bold">~{(sp?.durationMinutes || 0)} phút</p>
                          </div>
                        </div>
                      );
                    })()}


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
              <div className="flex justify-center gap-2 mt-2 border-t border-outline-variant/10 pt-4">
                {mainPackages.map((pkg) => (
                  <button 
                    key={`dot-${pkg.id}`}
                    onClick={(e) => {
                       e.stopPropagation();
                       document.getElementById(`pkg-card-${pkg.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${selectedPackage === pkg.id ? 'bg-primary scale-125' : 'bg-outline-variant/30 hover:bg-outline-variant/60'}`}
                    title={pkg.serviceName}
                  />
                ))}
              </div>
            </div>
          )}

        </section>

        {/* 4. THÔNG TIN XE */}
        <section 
          id="step-4"
          className={`transition-all duration-500 rounded-3xl p-6 space-y-4 scroll-m-24 ${
            activeStep === 'step-4' 
              ? 'ring-4 ring-[#4cd7f6] ring-offset-4 ring-offset-background scale-[1.02] shadow-[0_0_30px_rgba(76,215,246,0.15)] z-20 bg-white' 
              : 'border border-outline-variant/40 shadow-sm opacity-60 hover:opacity-100 bg-surface-container-lowest'
          } ${highlightVehicleSection ? 'ring-4 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}`}
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
                    <option value="">-- Chọn xe của bạn --</option>
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

        {/* DỊCH VỤ KÈM THEO */}
        <section 
          id="interior-section"
          className="border border-outline-variant/40 shadow-sm rounded-3xl p-6 space-y-6 bg-surface-container-lowest"
        >
          <div className="mb-6 border-b border-outline-variant/20 pb-4">
            <h2 className="text-sm font-extrabold text-outline uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-base">add_box</span>
              DỊCH VỤ KÈM THEO
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">Chọn thêm các dịch vụ vệ sinh và chăm sóc chuyên sâu. <span className="italic text-primary/80 font-medium">(giá tiền có thể thay đổi theo loại xe)</span></p>
          </div>

          {serviceFetchError ? (
            <div className="p-6 text-center text-error border border-error/20 rounded-2xl bg-error/5">
              <span className="material-symbols-outlined text-3xl mb-2">cloud_off</span>
              <p className="text-sm font-bold">Lỗi kết nối Cơ sở dữ liệu!</p>
            </div>
          ) : addOnServices.length === 0 ? (
            <div className="p-6 text-center text-outline-variant border border-dashed border-outline-variant/30 rounded-2xl bg-surface-container-lowest">
              <p className="text-sm italic font-medium">Hiện chưa có dịch vụ kèm theo nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addOnServices.map((addon) => {
                const isSelected = selectedAddOns.includes(addon.id);
                const price = addon.prices?.find(p => p.vehicleTypeId === selectedVehicleTypeId)?.price || addon.prices?.[0]?.price || 0;
                const duration = addon.prices?.find(p => p.vehicleTypeId === selectedVehicleTypeId)?.durationMinutes || addon.prices?.[0]?.durationMinutes || 0;
                return (
                  <div 
                    key={addon.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAddOns(selectedAddOns.filter(id => id !== addon.id));
                      } else {
                        setSelectedAddOns([...selectedAddOns, addon.id]);
                      }
                    }}
                    className={`cursor-pointer transition-all duration-300 rounded-2xl p-5 border-2 flex items-start gap-4 ${isSelected ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10 scale-[1.02]' : 'bg-surface border-outline/30 hover:border-primary/50 hover:bg-surface-container-low'}`}
                  >
                    <div className={`mt-1 flex items-center justify-center transition-colors ${isSelected ? 'text-primary' : 'text-outline/50'}`}>
                      <span className="material-symbols-outlined text-2xl">
                        {isSelected ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`material-symbols-outlined text-xl ${isSelected ? 'text-primary' : 'text-outline/70'}`}>
                          {addon.iconName || 'build'}
                        </span>
                        <h4 className={`font-bold text-lg ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{addon.serviceName}</h4>
                      </div>
                      <p className="text-sm text-on-surface-variant mb-3">{addon.description}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-auto">
                        <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold text-sm">
                          +{price.toLocaleString('vi-VN')}đ
                        </div>
                        <div className="bg-surface-variant text-on-surface-variant px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          +{duration}p
                        </div>
                        {(() => {
                          const pts = addon.prices?.find(p => p.vehicleTypeId === selectedVehicleTypeId)?.pointsRewarded || addon.prices?.[0]?.pointsRewarded || 0;
                          if (pts > 0) {
                            return (
                              <div className="bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">stars</span>
                                +{pts} điểm
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LƯU Ý TỔNG THỜI GIAN VÀ SLOT */}
          <div className="mt-6 bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <span className="material-symbols-outlined text-amber-600 mt-0.5">info</span>
            <div>
              <h4 className="font-bold text-amber-900 text-sm mb-1">
                Tổng thời gian phục vụ dự kiến: <span className="text-amber-700 font-black">{totalDurationMinutes} phút</span> ({numSlots} slot)
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Mỗi lượt (slot) đặt lịch tương đương 45 phút. Khi bạn đặt nhiều loại hình dịch vụ hoặc các gói cao cấp, hệ thống sẽ tự động tính toán và yêu cầu <strong className="text-amber-900">chọn {numSlots} slot liền kề nhau</strong> để đảm bảo nhân viên có đủ thời gian chăm sóc tốt nhất cho xe của bạn.
              </p>
            </div>
          </div>
        </section>

        {/* 5. CHỌN KHUNG GIỜ VÀ TÓM TẮT DỊCH VỤ */}
        <div className="flex flex-col gap-gutter items-start">
          
          {/* Chọn khung giờ */}
          <section id="step-5" className={`w-full transition-all duration-500 rounded-3xl p-6 space-y-6 scroll-m-24 ${activeStep === 'step-5' ? 'ring-4 ring-[#4cd7f6] ring-offset-4 ring-offset-background scale-[1.02] shadow-[0_0_30px_rgba(76,215,246,0.15)] z-20 bg-white' : 'border border-outline-variant/40 shadow-sm opacity-60 hover:opacity-100 bg-surface-container-lowest'}`}>
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
              {availableSlots.length > 0 ? (
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
              ) : (
                <span className="text-xs text-on-surface-variant italic font-semibold">Chưa có trạm (vui lòng chọn chi nhánh)</span>
              )}

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
            {!selectedBranch || !selectedWashSlot ? (
              <div className="py-8 text-center border border-dashed border-outline-variant/60 rounded-2xl w-full">
                <span className="material-symbols-outlined text-4xl text-outline-variant/60 mb-2 block">schedule</span>
                <p className="text-xs text-on-surface-variant font-bold italic">Vui lòng chọn Chi nhánh và Trạm rửa ở các bước trước để xem danh sách khung giờ.</p>
              </div>
            ) : (
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
                  
                  const isSlotBooked = occupiedSlots.has(idx) && occupiedSlots.get(idx) === 'booked';
                  const isSlotPast = occupiedSlots.has(idx) && occupiedSlots.get(idx) === 'past';
                  const isSlotUnavailable = isSlotBooked || isSlotPast;
                  
                  let btnClasses = "py-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ";
                  if (isSlotUnavailable) {
                    btnClasses += "border-outline-variant/30 bg-surface-container-low/40 text-outline/30 cursor-not-allowed opacity-60";
                  } else if (isStart) {
                    btnClasses += "bg-[#00236f] text-white border-[#00236f] shadow-lg ring-2 ring-primary/20 scale-105 z-10";
                  } else if (isOccupied) {
                    btnClasses += "bg-[#00236f]/10 text-[#00236f] border-[#00236f]/40 border-dashed";
                  } else if (isDisabled) {
                    btnClasses += "border-outline-variant/50 text-outline-variant/70 cursor-not-allowed opacity-80 hover:bg-red-50";
                  } else {
                    btnClasses += "border-outline-variant hover:border-primary/50 hover:bg-primary/5 text-on-surface-variant";
                  }

                  return (
                    <button
                      key={t.id}
                      type="button"
                      disabled={isSlotUnavailable}
                      onClick={() => {
                        if (isDisabled) {
                          const errorMsg = getSlotSelectionError(idx);
                          setSlotError(errorMsg);
                        } else {
                          setSelectedTimeSlotId(t.id);
                        }
                      }}
                      className={btnClasses}
                      title={isSlotBooked ? "Khung giờ này đã được đặt" : isSlotPast ? "Khung giờ này đã qua" : isDisabled ? "Không đủ slot liền kề còn lại trong ngày" : `Lượt thứ ${idx + 1}`}
                    >
                      <span className={`text-[9px] font-bold ${
                        isSlotUnavailable ? 'text-outline/40' : 
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
            )}


          </section>

        </div>
      </div>
      
      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#00236f] text-white px-5 py-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.25)] z-50 flex items-center justify-between border-t border-white/10 pb-[max(1rem,env(safe-area-inset-bottom))]">
         <div className="flex flex-col">
            <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider mb-0.5">Tổng thanh toán</span>
            <span className="text-[#4cd7f6] text-xl font-black leading-none">{selectedPackage ? formatCurrency(totalCost) : '0đ'}</span>
         </div>
         <button 
            onClick={handleOpenPaymentModal}
            className={`px-6 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 ${
              allStepsCompleted 
                ? 'shimmer-bounce-btn text-[#001f26]' 
                : 'bg-[#4cd7f6] hover:bg-[#57dffe] text-[#001f26] shadow-lg shadow-cyan-400/20'
            }`}
          >
            ĐẶT LỊCH NGAY
          </button>
      </div>

    </div>
      </div> {/* End Center Content Wrapper */}

      {/* RIGHT SIDEBAR (ORDER SUMMARY) */}
      <div className="flex flex-col w-full lg:w-[350px] shrink-0 bg-[#00236f] z-[40] lg:shadow-[-10px_0_30px_rgba(0,0,0,0.1)] text-white overflow-visible lg:overflow-hidden relative lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] mt-8 lg:mt-0">
        <div className="p-6 flex-1 flex flex-col overflow-visible lg:overflow-hidden">
          
          <h2 className="font-black text-2xl tracking-tight mb-4">Tóm tắt dịch vụ</h2>
          
          {/* Main Info */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-white/80">Tổng thời gian</span>
              <span className="text-white font-bold">
                {selectedPackage ? `${displayDuration} phút` : 'Chưa chọn'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-white/80">Số lượng slot đặt</span>
              <span className="text-white font-bold">
                {selectedPackage ? `${numSlots} slot` : 'Chưa chọn'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center py-3.5 border-y border-white/10 mb-4">
            <span className="text-sm font-bold text-white">Tổng tiền dịch vụ</span>
            <span className="text-[#4cd7f6] text-2xl font-black">
              {selectedPackage ? formatCurrency(totalCost) : 'Chưa chọn'}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-start text-sm font-semibold">
              <span className="text-white/80">Địa điểm & Trạm</span>
              <div className="text-right">
                <p className="text-white font-bold">{activeBranchName}</p>
                {selectedWashSlot ? (
                  <p className="text-white/60 text-xs mt-1">{activeSlotName}</p>
                ) : (
                  <p className="text-white/40 text-xs mt-1 italic">Chưa chọn trạm</p>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-white/80">Số Slot</span>
              <span className="text-white font-bold">{getSelectedSlotsDisplay()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-white/80">Thời gian dự kiến</span>
              <span className="text-[#4cd7f6] font-bold">{expectedTimeRange}</span>
            </div>
          </div>

          {/* Discount Code */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/60">Mã giảm giá</span>
              <button 
                onClick={handleOpenVoucherModal}
                className="flex items-center gap-0.5 text-[10px] font-bold text-[#4cd7f6] hover:underline"
              >
                <span className="material-symbols-outlined text-[12px]">local_activity</span>
                Xem thêm mã giảm giá
              </button>
            </div>
            <div className="flex gap-1.5 mb-1.5">
              <input 
                type="text" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Nhập mã giảm giá..." 
                className={`flex-1 bg-white/5 border rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none transition-all uppercase ${
                  highlightPromo 
                    ? 'border-[#4cd7f6] ring-2 ring-[#4cd7f6]/50 shadow-[0_0_15px_rgba(76,215,246,0.3)] bg-[#4cd7f6]/10' 
                    : discountInfo
                      ? 'border-emerald-400 focus:border-emerald-400 bg-emerald-400/5'
                      : 'border-white/10 focus:border-[#4cd7f6]/50'
                }`}
              />
              <button 
                onClick={handleApplyPromo}
                className="bg-[#4cd7f6] hover:bg-[#57dffe] text-[#001f26] font-black text-xs px-3.5 py-1.5 rounded-lg transition-colors active:scale-95">
                ÁP MÃ
              </button>
            </div>
            {/* Discount info text */}
            <div className="h-4">
              {isVerifyingPromo ? (
                <span className="text-[10px] text-white/60 italic flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[12px]">sync</span>
                  Đang kiểm tra mã...
                </span>
              ) : discountInfo ? (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 animate-fade-in-up">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  Mã hợp lệ! Bạn được giảm {discountInfo.discountPercent ? `${discountInfo.discountPercent}%` : `${discountInfo.discountAmount?.toLocaleString('vi-VN')}đ`} cho dịch vụ này.
                </span>
              ) : promoError ? (
                <span className="text-[10px] text-error font-bold flex items-center gap-1 animate-fade-in-up text-red-400">
                  <span className="material-symbols-outlined text-[12px]">error</span>
                  {promoError}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-auto pt-4 space-y-3">
            <button 
              onClick={handleOpenPaymentModal}
              className={`w-full py-3.5 rounded-2xl font-black text-[15px] transition-all active:scale-95 ${
                allStepsCompleted 
                  ? 'shimmer-bounce-btn text-[#001f26]' 
                  : 'bg-[#4cd7f6] hover:bg-[#57dffe] text-[#001f26] shadow-lg hover:shadow-cyan-400/25'
              }`}
            >
              Thanh toán
            </button>
            <p className="text-[10px] text-center text-white/40 italic">
              Giao dịch được bảo mật bởi Luna Gateway
            </p>
          </div>
        </div>
      </div>
      
      </div> {/* End Flex Wrapper */}

      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setShowBlockModal(false)}
          ></div>
          <div className="relative bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center border border-outline-variant/30 z-50">
            <span className="material-symbols-outlined text-6xl text-amber-500 mb-4 animate-bounce">warning</span>
            <h2 className="text-2xl font-black text-[#00236f] mb-2">Đang có lịch hẹn chưa hoàn thành!</h2>
            <p className="text-on-surface-variant mb-6 text-sm">
              Bạn hiện đang có một lịch đặt dịch vụ <strong>{activeBookingInfo?.status === 'Pending' ? 'đang chờ xác nhận' : 'đang thực hiện'}</strong>. Để đảm bảo chất lượng dịch vụ và tránh tình trạng đặt quá tải, vui lòng hoàn thành hoặc hủy lịch hẹn hiện tại trước khi đặt lịch mới.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/history')}
                className="w-full py-3 bg-[#00236f] text-white rounded-xl font-bold shadow-md hover:bg-[#001b54] transition-all"
              >
                Xem lịch đặt hiện tại
              </button>
              <button 
                onClick={() => setShowBlockModal(false)}
                className="w-full py-3 bg-white text-[#00236f] border border-[#00236f] rounded-xl font-bold hover:bg-[#00236f]/5 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setShowPaymentModal(false)}
          ></div>
          <div className="relative bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl text-[#081b3e] z-50 p-6 flex flex-col border border-slate-100">
            
            {/* Close Button */}
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-base block font-bold">close</span>
            </button>

            {/* Icon & Title */}
            <div className="text-center mb-5 mt-2">
              <span className="material-symbols-outlined text-4xl text-[#00236f] bg-slate-100 p-3.5 rounded-2xl mb-3 inline-block">account_balance_wallet</span>
              <h3 className="font-extrabold text-lg text-[#00236f]">Phương thức thanh toán</h3>
              <p className="text-xs text-slate-500 mt-1">Vui lòng chọn phương thức thanh toán của bạn</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {/* Option 1: VNPay */}
              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentMethod('vnpay');
                  handleExecuteCheckout('vnpay');
                }}
                className="w-full group p-3.5 border border-slate-100 hover:border-[#4cd7f6] hover:bg-[#4cd7f6]/5 rounded-2xl flex items-center justify-between transition-all duration-300 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-[#4cd7f6]/20 transition-colors">
                    <span className="material-symbols-outlined text-xl block">qr_code_scanner</span>
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-sm text-[#00236f]">Thanh toán VN Pay</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Ví điện tử, Thẻ nội địa/Quốc tế</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-[#4cd7f6] text-lg transition-colors">chevron_right</span>
              </button>

              {/* Option 2: Cash */}
              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentMethod('tien-mat');
                  handleExecuteCheckout('tien-mat');
                }}
                className="w-full group p-3.5 border border-slate-100 hover:border-[#4cd7f6] hover:bg-[#4cd7f6]/5 rounded-2xl flex items-center justify-between transition-all duration-300 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-[#4cd7f6]/20 transition-colors">
                    <span className="material-symbols-outlined text-xl block">payments</span>
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-sm text-[#00236f]">Tiền mặt tại quầy</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Thanh toán trực tiếp sau dịch vụ</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-[#4cd7f6] text-lg transition-colors">chevron_right</span>
              </button>
            </div>
            
          </div>
        </div>
      )}

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

      {/* Pop-up modal voucher */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowVoucherModal(false)}></div>
          <div className="relative bg-[#0b132b] border border-white/10 rounded-2xl w-full max-w-md flex flex-col max-h-[80vh] shadow-2xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-[#0b132b] to-[#1a295c] rounded-t-2xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6]">local_activity</span>
                Mã giảm giá của bạn
              </h3>
              <button onClick={() => setShowVoucherModal(false)} className="text-white/50 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
              {isLoadingVouchers ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4cd7f6]"></div>
                </div>
              ) : myVouchers.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">money_off</span>
                  <p>Bạn chưa có mã giảm giá nào</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {myVouchers.map((voucher, index) => (
                    <div 
                      key={voucher.id || voucher.voucherId || `voucher-${index}`} 
                      onClick={() => {
                        const code = voucher.voucherId || voucher.id;
                        setPromoCode(code);
                        handleApplyPromo(code);
                        setShowVoucherModal(false);
                      }}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 cursor-pointer transition-all flex justify-between items-center group hover:border-[#4cd7f6]/50"
                    >
                      <div>
                        <div className="font-bold text-[#4cd7f6]">{voucher.voucherName || voucher.voucherId || voucher.id}</div>
                        <div className="text-xs text-white/70 mt-1">{voucher.description}</div>
                        <div className="text-[10px] text-emerald-400 mt-2">Hết hạn: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}</div>
                      </div>
                      <div className="bg-[#4cd7f6]/10 text-[#4cd7f6] p-2 rounded-lg group-hover:bg-[#4cd7f6] group-hover:text-[#0b132b] transition-colors">
                        <span className="text-xs font-bold whitespace-nowrap">ÁP DỤNG</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
