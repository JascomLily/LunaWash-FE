import React from 'react';

/**
 * Footer component dùng chung cho toàn bộ giao diện LunaWash.
 * Khớp hoàn hảo với thiết kế chân trang trong hình ảnh số 1.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-[#111625] text-surface-bright font-body-md text-body-md py-12">
      <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col lg:flex-row justify-between items-start gap-12">
        
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="max-w-sm flex flex-col gap-4">
          <div className="mb-2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMIHwZp8RLc19nD4KtDTiu2Q4Nfx7irfa6j_R-1Cel5RXbphsnQnvgVnZk42WxpmbzInAHYM11SRsJDI2Vp8k74kreh2jUhGvsm0YkwUKn4m2KbN1qy9siwvSSQUGmk6arV6AcHgzQ2o8l26YiRZdItVWCMkAPPqZORnpv3MSrKdX0mbqFdWa2CiA65ioUN4VlN0bi3leO-qXk8jgudqm56MsW4gVgQXOkH-PScpiJ2aQItKCWjdLS77HETiuOPKOmywUITMCVN9g"
              alt="LunaWash Logo"
              className="h-12 w-auto object-contain brightness-0 invert"
            />
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Hệ thống chăm sóc xe thông minh hàng đầu Việt Nam, ứng dụng công nghệ tự động hóa và quản lý tối ưu.
          </p>
          <p className="text-white/40 text-xs mt-4">
            © 2024 LunaWash. All rights reserved.
          </p>
        </div>

        {/* Khối các liên kết nhanh (Khớp chính xác ảnh 1) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter lg:flex-grow lg:justify-end">
          
          {/* Cột khám phá */}
          <div className="flex flex-col gap-4 min-w-[120px]">
            <h4 className="font-bold text-white uppercase text-xs tracking-widest">
              Khám phá
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a className="text-white/60 hover:text-white transition-colors" href="#about">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a className="text-white/60 hover:text-white transition-colors" href="#packages">
                  Bảng giá
                </a>
              </li>
              <li>
                <a className="text-white/60 hover:text-white transition-colors" href="#locations">
                  Chi nhánh
                </a>
              </li>
            </ul>
          </div>

          {/* Cột hỗ trợ */}
          <div className="flex flex-col gap-4 min-w-[120px]">
            <h4 className="font-bold text-white uppercase text-xs tracking-widest">
              Hỗ trợ
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a className="text-white/60 hover:text-white transition-colors" href="#support-center">
                  Trung tâm hỗ trợ
                </a>
              </li>
              <li>
                <a className="text-white/60 hover:text-white transition-colors" href="#faq">
                  FAQ
                </a>
              </li>
              <li>
                <a className="text-white/60 hover:text-white transition-colors" href="#contact">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Cột chính sách */}
          <div className="flex flex-col gap-4 min-w-[120px]">
            <h4 className="font-bold text-white uppercase text-xs tracking-widest">
              Chính sách
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a className="text-white/60 hover:text-white transition-colors" href="#privacy">
                  Bảo mật
                </a>
              </li>
              <li>
                <a className="text-white/60 hover:text-white transition-colors" href="#terms">
                  Điều khoản
                </a>
              </li>
            </ul>
          </div>

          {/* Cột Kết nối */}
          <div className="flex flex-col gap-4 min-w-[120px]">
            <h4 className="font-bold text-white uppercase text-xs tracking-widest">
              Kết nối
            </h4>
            <div className="flex gap-3">
              <a 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all text-white" 
                href="#globe"
                title="Website"
              >
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
              <a 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all text-white" 
                href="mailto:support@lunawash.vn"
                title="Email"
              >
                <span className="material-symbols-outlined text-lg">mail</span>
              </a>
              <a 
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-105 transition-all text-white" 
                href="#share"
                title="Chia sẻ"
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
