import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/geminiService';

export default function AIChatBox({ className = '' }) {
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('luna_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Lỗi khi đọc lịch sử chat:", e);
      }
    }
    return [
      {
        id: "1",
        sender: 'ai',
        text: 'Xin chào! Tôi là Trợ lý AI của LunaWash. Tôi có thể giúp gì cho bạn hôm nay?',
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('luna_chat_history', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    if (!text || !text.trim()) return;

    const newUserMsg = { id: Date.now().toString(), sender: 'user', text: text.trim() };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponseText = await sendChatMessage(messages, text.trim());
      const newAiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText
      };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Xin lỗi, tôi đang bị gián đoạn kết nối. Vui lòng thử lại sau!'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  // Listen for custom events from anywhere (e.g. Quick Prompts in Support page)
  useEffect(() => {
    const handleCustomSend = (e) => {
      if (e.detail) {
        handleSendMessage(e.detail);
      }
    };
    window.addEventListener('send-ai-message', handleCustomSend);
    return () => window.removeEventListener('send-ai-message', handleCustomSend);
  }, [messages]); // need messages dependency to use current state

  return (
    <section className={`flex flex-col bg-white overflow-hidden relative ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 z-10 shrink-0">
        <div className="w-12 h-12 bg-white text-blue-600 shadow-sm rounded-full flex items-center justify-center shrink-0 border border-blue-100">
          <span className="material-symbols-outlined text-2xl">robot_2</span>
        </div>
        <div>
          <h2 className="font-extrabold text-lg text-slate-800 leading-tight">Luna AI Assistant</h2>
          <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Đang trực tuyến
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[90%] md:max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00236f] to-blue-600 flex items-center justify-center shrink-0 mt-1 shadow-md">
                  <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                </div>
              )}
              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1 border border-slate-300">
                  <span className="material-symbols-outlined text-slate-600 text-sm">person</span>
                </div>
              )}
              <div 
                className={`px-4 py-3 md:px-5 md:py-3.5 text-[14px] md:text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-white text-slate-700 border-l-4 border-blue-500 rounded-2xl rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00236f] to-blue-600 flex items-center justify-center shrink-0 mt-1 shadow-md">
                <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
              </div>
              <div className="px-5 py-4 bg-white border-l-4 border-blue-500 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-3 md:p-4 bg-blue-50/30 border-t border-blue-100 z-10 shrink-0">
        <div className="flex items-end gap-2 bg-white border border-blue-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn tại đây..."
            className="flex-1 max-h-32 min-h-[44px] bg-transparent outline-none resize-none px-2 py-2 md:px-3 md:py-2.5 text-slate-700 text-[14px] md:text-[15px]"
            rows="1"
          />
          <button 
            onClick={() => handleSendMessage(inputMessage)}
            disabled={!inputMessage.trim()}
            className="w-10 h-10 md:w-11 md:h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 disabled:bg-slate-300 hover:bg-blue-700 transition-colors mb-0.5 mr-0.5 shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] md:text-[20px] ml-1">send</span>
          </button>
        </div>
        <p className="text-center text-[10px] md:text-[11px] text-slate-500 mt-2 md:mt-3 mb-1 font-medium px-2">
          AI có thể mắc lỗi. Vui lòng liên hệ trực tiếp nếu bạn cần hỗ trợ chính xác nhất.
        </p>
      </div>
    </section>
  );
}
