import React, { useEffect } from 'react';
import AIChatBox from '../components/AIChatBox';

const QUICK_PROMPTS = [
  "Làm sao để đặt lịch rửa xe?",
  "Có những phương thức thanh toán nào?",
  "Gói dịch vụ Cao cấp bao gồm những gì?",
  "Bảng giá vệ sinh nội thất cho xe 7 chỗ?"
];

export default function Support() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuickPrompt = (prompt) => {
    // Phóng event để báo cho AIChatBox biết có câu hỏi mồi được chọn
    window.dispatchEvent(new CustomEvent('send-ai-message', { detail: prompt }));
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-6">
      <div className="max-w-container-max mx-auto h-[calc(100vh-120px)] p-4 md:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: AI CHATBOX */}
        <div className="flex-1 flex flex-col shadow-2xl shadow-slate-300/60 rounded-3xl overflow-hidden ring-1 ring-slate-900/10">
          <AIChatBox className="w-full h-full" />
        </div>

        {/* RIGHT COLUMN: INFO PANEL */}
        <aside className="w-full lg:w-[350px] flex flex-col gap-5 h-full pb-0">
          
          {/* Quick Prompts */}
          <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-slate-300/60 ring-1 ring-slate-900/10 flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <span className="material-symbols-outlined text-amber-500">lightbulb</span>
              <h3 className="font-extrabold text-slate-800">Câu hỏi gợi ý</h3>
            </div>
            <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 pb-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="text-left px-4 py-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl text-[13px] font-medium text-slate-700 hover:text-blue-700 transition-all group flex items-start gap-2 shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px] mt-0.5 text-slate-400 group-hover:text-blue-500">chat_bubble</span>
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-br from-[#00236f] to-blue-800 rounded-3xl p-5 shadow-2xl shadow-blue-900/40 ring-1 ring-blue-900/20 shrink-0">
            <h3 className="font-extrabold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-400">support_agent</span>
              Liên hệ trực tiếp
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white shadow-inner">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Hotline</p>
                  <p className="text-[15px] font-extrabold text-white">1900 8888</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white shadow-inner">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Email</p>
                  <p className="text-[15px] font-bold text-white">support@lunawash.vn</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white shadow-inner">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Trụ sở</p>
                  <p className="text-[13px] font-bold text-white">Bình Thạnh, TP.HCM</p>
                </div>
              </li>
            </ul>
          </div>

        </aside>
      </div>
    </main>
  );
}
