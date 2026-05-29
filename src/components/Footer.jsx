import React from 'react';

/**
 * Footer component dùng chung cho toàn bộ giao diện LunaWash.
 * 
 */
export default function Footer() {
  return (
    <footer className="w-full bg-on-background dark:bg-inverse-surface mt-16 text-surface-bright font-body-md text-body-md border-t border-outline-variant/10 py-12">
      <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-start gap-gutter">
        
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="max-w-sm">
          <div className="mb-6">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMIHwZp8RLc19nD4KtDTiu2Q4Nfx7irfa6j_R-1Cel5RXbphsnQnvgVnZk42WxpmbzInAHYM11SRsJDI2Vp8k74kreh2jUhGvsm0YkwUKn4m2KbN1qy9siwvSSQUGmk6arV6AcHgzQ2o8l26YiRZdItVWCMkAPPqZORnpv3MSrKdX0mbqFdWa2CiA65ioUN4VlN0bi3leO-qXk8jgudqm56MsW4gVgQXOkH-PScpiJ2aQItKCWjdLS77HETiuOPKOmywUITMCVN9g"
              alt="LunaWash Logo"
              className="h-16 w-auto object-contain brightness-0 invert"
            />
          </div>
          <p className="text-surface-variant mb-6 font-body-md">
            Hệ thống chăm sóc xe thông minh hàng đầu Việt Nam, ứng dụng công nghệ tự động hóa và quản lý tối ưu.
          </p>
          <p className="text-surface-variant text-sm">
            © 2026 LunaWash Technologies. All rights reserved.
          </p>
        </div>

        {/* Khối các liên kết nhanh */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          {/* Cột khám phá */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-secondary-fixed uppercase text-sm tracking-widest text-white">
              Khám phá
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a className="text-surface-variant hover:text-secondary-fixed transition-colors hover:underline" href="#">
                  Rửa cơ bản
                </a>
              </li>
              <li>
                <a className="text-surface-variant hover:text-secondary-fixed transition-colors hover:underline" href="#">
                  Rửa chuyên sâu
                </a>
              </li>
              <li>
                <a className="text-surface-variant hover:text-secondary-fixed transition-colors hover:underline" href="#">
                  Phủ Ceramic
                </a>
              </li>
            </ul>
          </div>

          {/* Cột hỗ trợ */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-secondary-fixed uppercase text-sm tracking-widest text-white">
              Hỗ trợ
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a className="text-surface-variant hover:text-secondary-fixed transition-colors hover:underline" href="#">
                  FAQ
                </a>
              </li>
              <li>
                <a className="text-surface-variant hover:text-secondary-fixed transition-colors hover:underline" href="#">
                  Liên hệ
                </a>
              </li>
              <li>
                <a className="text-surface-variant hover:text-secondary-fixed transition-colors hover:underline" href="#">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>

          {/* Cột pháp lý */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-secondary-fixed uppercase text-sm tracking-widest text-white">
              Pháp lý
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a className="text-surface-variant hover:text-secondary-fixed transition-colors hover:underline" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="text-surface-variant hover:text-secondary-fixed transition-colors hover:underline" href="#">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Kết nối mạng xã hội */}
        <div className="flex flex-col gap-6">
          <h4 className="font-bold text-secondary-fixed uppercase text-sm tracking-widest text-white">
            Kết nối
          </h4>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-surface-variant/10 flex items-center justify-center hover:bg-secondary-fixed hover:text-on-background transition-all" href="#">
              <span className="material-symbols-outlined text-white hover:text-black">public</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-surface-variant/10 flex items-center justify-center hover:bg-secondary-fixed hover:text-on-background transition-all" href="#">
              <span className="material-symbols-outlined text-white hover:text-black">mail</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-surface-variant/10 flex items-center justify-center hover:bg-secondary-fixed hover:text-on-background transition-all" href="#">
              <span className="material-symbols-outlined text-white hover:text-black">share</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
