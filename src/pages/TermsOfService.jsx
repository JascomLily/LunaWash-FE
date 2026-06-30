import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
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
            Điều Khoản <span className="text-primary">Dịch Vụ</span>
          </h1>
          <p className="text-on-surface-variant text-lg">Cập nhật lần cuối: Tháng 6, 2026</p>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-3xl shadow-xl border border-outline-variant/30 space-y-8 text-on-surface">
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="material-symbols-outlined mr-3 text-3xl">calendar_month</span>
              1. Quy định về đặt lịch và hủy lịch
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
              <li>Quý khách vui lòng đến trạm rửa xe đúng giờ hoặc sớm hơn 5 phút so với khung giờ đã đặt.</li>
              <li>Hệ thống sẽ giữ chỗ cho Quý khách tối đa <strong>15 phút</strong>. Sau thời gian này, lịch đặt sẽ tự động bị hủy để nhường chỗ cho khách hàng khác.</li>
              <li>Nếu muốn hủy lịch, Quý khách vui lòng thao tác trên ứng dụng/website ít nhất 30 phút trước giờ hẹn.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="material-symbols-outlined mr-3 text-3xl">local_car_wash</span>
              2. Trách nhiệm về tài sản
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
              <li>Quý khách vui lòng chủ động thu dọn và tự bảo quản các tài sản cá nhân có giá trị (điện thoại, tiền bạc, trang sức, giấy tờ...) trước khi giao xe cho nhân viên LunaWash.</li>
              <li>LunaWash sẽ <strong>không chịu trách nhiệm</strong> đối với việc mất mát các tài sản cá nhân để lại trên xe trong quá trình dọn dẹp nội thất.</li>
              <li>Đối với các hư hỏng về vỏ xe, lớp sơn phát sinh TRONG quá trình rửa xe tại trạm (có đối chiếu qua camera), LunaWash cam kết bồi thường theo tỷ lệ thỏa thuận và chính sách bảo hiểm.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="material-symbols-outlined mr-3 text-3xl">payments</span>
              3. Quy định thanh toán và hoàn tiền
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
              <li>LunaWash hỗ trợ thanh toán linh hoạt qua tiền mặt tại trạm, chuyển khoản ngân hàng hoặc ví điện tử (VNPAY, Momo).</li>
              <li>Đối với khách hàng thanh toán trước nhưng bị hủy lịch (do đến trễ hoặc tự hủy hợp lệ), số tiền sẽ được hoàn lại vào ví LunaWash hoặc tài khoản ngân hàng trong vòng 3-5 ngày làm việc tùy thuộc vào ngân hàng phát hành.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="material-symbols-outlined mr-3 text-3xl">gavel</span>
              4. Hành vi bị nghiêm cấm
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant leading-relaxed">
              <li>Sử dụng dịch vụ LunaWash vào các mục đích vi phạm pháp luật.</li>
              <li>Cố tình phá hoại thiết bị, cơ sở vật chất tại trạm rửa xe.</li>
              <li>Spam đặt lịch ảo, đánh giá ảo gây ảnh hưởng đến hệ thống vận hành. LunaWash có quyền khóa tài khoản vĩnh viễn đối với các hành vi này.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
