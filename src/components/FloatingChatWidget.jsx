import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AIChatBox from './AIChatBox';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Hide on support page to prevent double chat boxes
  const userString = localStorage.getItem('user');
  let isStaffOrAdmin = false;
  if (userString) {
    try {
      const user = JSON.parse(userString);
      const tier = user.tier || '';
      if (['Admin', 'Staff', 'BranchManager', 'TechnicalStaff'].includes(tier)) {
        isStaffOrAdmin = true;
      }
    } catch (e) {}
  }
  
  if (isStaffOrAdmin) return null;
  if (location.pathname === '/support') return null;

  return (
    <div className="fixed z-[9999] bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col items-end">
      
      {/* Chat Popup */}
      {isOpen && (
        <div 
          className="shadow-2xl bg-white rounded-3xl overflow-hidden flex flex-col border border-slate-200 mb-4 animate-fade-in-up origin-bottom-right"
          style={{
            width: '380px',
            height: '600px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 120px)',
          }}
        >
          {/* Header & Close Button */}
          <div className="h-10 bg-slate-800 w-full flex justify-between items-center px-4 shrink-0 select-none">
            <div className="flex items-center gap-2 pointer-events-none">
              <span className="material-symbols-outlined text-white/50 text-sm">smart_toy</span>
              <span className="text-white/80 text-[11px] font-bold tracking-widest uppercase">Trợ lý LunaWash</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white hover:bg-white/20 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Reuse the chat box component */}
          <AIChatBox className="flex-1 w-full h-[calc(100%-40px)] rounded-none shadow-none" />
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <div 
          onClick={toggleOpen}
          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-[#0c317c] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 border-2 border-white cursor-pointer relative transition-transform duration-200"
        >
          <span className="material-symbols-outlined text-3xl">smart_toy</span>
          {/* Notification dot */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-white"></span>
          </span>
        </div>
      )}
    </div>
  );
}
