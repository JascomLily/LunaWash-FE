import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminSettingsLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-outline-variant/30 bg-surface-container-lowest flex flex-col shadow-sm sticky top-20 h-[calc(100vh-5rem)] z-10">
        <div className="p-6 border-b border-outline-variant/20 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-white font-light text-[22px]">settings</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-on-surface">Cài đặt hệ thống</h2>
            <p className="text-xs text-on-surface-variant font-medium">Configuration Hub</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavLink
            to="/admin/settings/ads"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-primary/5 text-primary shadow-sm border border-primary/20 ring-1 ring-primary/10'
                  : 'text-on-surface-variant border border-transparent hover:bg-surface-container hover:text-on-surface hover:border-outline-variant/30'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">ad_units</span>
            Quảng cáo
          </NavLink>

          <NavLink
            to="/admin/settings/promotions"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-primary/5 text-primary shadow-sm border border-primary/20 ring-1 ring-primary/10'
                  : 'text-on-surface-variant border border-transparent hover:bg-surface-container hover:text-on-surface hover:border-outline-variant/30'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">campaign</span>
            Khuyến mãi
          </NavLink>
          
          <NavLink
            to="/admin/settings/services"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-primary/5 text-primary shadow-sm border border-primary/20 ring-1 ring-primary/10'
                  : 'text-on-surface-variant border border-transparent hover:bg-surface-container hover:text-on-surface hover:border-outline-variant/30'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">package_2</span>
            Gói dịch vụ
          </NavLink>

          <NavLink
            to="/admin/settings/membership"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-primary/5 text-primary shadow-sm border border-primary/20 ring-1 ring-primary/10'
                  : 'text-on-surface-variant border border-transparent hover:bg-surface-container hover:text-on-surface hover:border-outline-variant/30'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">stars</span>
            Hạng thành viên
          </NavLink>

          <NavLink
            to="/admin/settings/transactions"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-primary/5 text-primary shadow-sm border border-primary/20 ring-1 ring-primary/10'
                  : 'text-on-surface-variant border border-transparent hover:bg-surface-container hover:text-on-surface hover:border-outline-variant/30'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            Giao dịch
          </NavLink>
        </nav>

        <div className="p-4 border-t border-outline-variant/20 space-y-2">
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors border border-transparent">
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
            Hỗ trợ kỹ thuật
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminSettingsLayout;
