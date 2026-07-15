/**
 * Cấu hình tập trung cho toàn bộ ứng dụng.
 * VITE_API_URL đã bao gồm path "/api" ở cuối.
 * Khi gọi endpoint, chỉ thêm phần path sau /api, ví dụ: /vouchers, /services ...
 */
const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') // bỏ dấu / cuối nếu có
  : 'https://lunawash-be.onrender.com/api';           // fallback hardcode

export default API_BASE;
