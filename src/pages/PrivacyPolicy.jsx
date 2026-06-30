import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-16 bg-background">
      <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary-hover transition-colors mb-6 font-bold">
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Trở về trang chủ
          </Link>
          <h1 className="text-4xl md:text-5xl font-display-lg font-black text-on-surface mb-4 leading-tight">
            Chính Sách <span className="text-primary">Bảo Mật</span>
          </h1>
          <p className="text-on-surface-variant text-lg">Cập nhật lần cuối: Tháng 6, 2026</p>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-3xl shadow-xl border border-outline-variant/30 space-y-8 text-on-surface">
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="material-symbols-outlined mr-3 text-3xl">privacy_tip</span>
              1. Mục đích thu thập thông tin
            </h2>
            <p className="mb-4 text-on-surface-variant leading-relaxed">
              LunaWash thu thập thông tin của Quý khách nhằm mục đích mang lại trải nghiệm dịch vụ chăm sóc xe thông minh, an toàn và tối ưu nhất. Cụ thể:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant">
              <li>Xác nhận lịch đặt rửa xe, bảo dưỡng xe để tránh trùng lặp tại các chi nhánh.</li>
              <li>Quản lý lịch sử giao dịch và tích điểm thưởng nâng hạng thành viên.</li>
              <li>Liên hệ với Quý khách trong trường hợp có sự cố phát sinh tại trạm.</li>
              <li>Nhận diện biển số xe tự động khi tiến vào trạm rửa (dành cho khách hàng thân thiết).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="material-symbols-outlined mr-3 text-3xl">database</span>
              2. Phạm vi thông tin thu thập
            </h2>
            <p className="mb-4 text-on-surface-variant leading-relaxed">
              Chúng tôi chỉ thu thập những thông tin cần thiết nhất cho nghiệp vụ dịch vụ, bao gồm:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant">
              <li><strong>Thông tin cá nhân:</strong> Họ tên, Số điện thoại, Địa chỉ Email.</li>
              <li><strong>Thông tin phương tiện:</strong> Biển số xe, Loại xe (4 chỗ, 7 chỗ, xe máy...).</li>
              <li><strong>Dữ liệu an ninh:</strong> Hình ảnh từ hệ thống camera giám sát tại các trạm LunaWash nhằm bảo vệ tài sản của Quý khách.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="material-symbols-outlined mr-3 text-3xl">shield_locked</span>
              3. Cam kết bảo mật dữ liệu
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              Mọi dữ liệu cá nhân của khách hàng đều được mã hóa và lưu trữ an toàn trên máy chủ của LunaWash. Chúng tôi cam kết:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant">
              <li><strong>KHÔNG</strong> bán, trao đổi hoặc cho thuê thông tin cá nhân của Quý khách cho bất kỳ bên thứ ba nào vì mục đích thương mại.</li>
              <li>Chỉ chia sẻ dữ liệu với các đối tác thanh toán (VNPAY, Momo, Ngân hàng) trong khuôn khổ thực hiện giao dịch an toàn.</li>
              <li>Có thể cung cấp dữ liệu hình ảnh camera cho cơ quan chức năng khi có yêu cầu hợp pháp để giải quyết các vấn đề an ninh, trật tự.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="material-symbols-outlined mr-3 text-3xl">security_update_good</span>
              4. Quyền lợi của khách hàng
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              Quý khách có toàn quyền kiểm soát dữ liệu cá nhân của mình. Bất cứ lúc nào, Quý khách cũng có thể đăng nhập vào ứng dụng/website LunaWash để chỉnh sửa thông tin hồ sơ, hoặc yêu cầu tổng đài viên hỗ trợ xóa toàn bộ tài khoản và lịch sử giao dịch khỏi hệ thống.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
