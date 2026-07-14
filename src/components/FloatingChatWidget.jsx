import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AIChatBox from './AIChatBox';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const location = useLocation();

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasMoved(false);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    let newX = e.clientX - offsetRef.current.x;
    let newY = e.clientY - offsetRef.current.y;
    
    // Constrain to window bounds
    const elementWidth = isOpen ? 380 : 64; // popup width vs button width
    const elementHeight = isOpen ? 600 : 64; // popup height vs button height
    
    const maxX = window.innerWidth - elementWidth;
    const maxY = window.innerHeight - elementHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    // Determine if it actually moved significantly to not trigger click
    if (Math.abs(e.clientX - startPosRef.current.x) > 5 || Math.abs(e.clientY - startPosRef.current.y) > 5) {
      setHasMoved(true);
    }
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleToggle = (opening) => {
    setIsOpen(opening);
    setPosition(prev => {
      if (opening) {
        // Expand up and left: keep bottom-right corner fixed
        let newX = prev.x + 64 - 380;
        let newY = prev.y + 64 - 600;
        // Constrain so it doesn't overflow top-left
        return { x: Math.max(0, newX), y: Math.max(0, newY) };
      } else {
        // Collapse down and right: keep bottom-right corner fixed
        let newX = prev.x + 380 - 64;
        let newY = prev.y + 600 - 64;
        // Constrain so it doesn't overflow bottom-right
        const maxX = window.innerWidth - 64;
        const maxY = window.innerHeight - 64;
        return { 
          x: Math.min(maxX, Math.max(0, newX)), 
          y: Math.min(maxY, Math.max(0, newY)) 
        };
      }
    });
  };

  const toggleOpen = () => {
    // Only toggle if we didn't just drag it
    if (!hasMoved) {
      handleToggle(true);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  // Handle window resize constraints
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        const elementWidth = isOpen ? 380 : 64;
        const elementHeight = isOpen ? 600 : 64;
        const maxX = window.innerWidth - elementWidth;
        const maxY = window.innerHeight - elementHeight;
        return {
          x: Math.min(prev.x, Math.max(0, maxX)),
          y: Math.min(prev.y, Math.max(0, maxY))
        };
      });
    };
    window.addEventListener('resize', handleResize);
    
    // Initial position on mount
    setPosition({
      x: window.innerWidth - 80, 
      y: window.innerHeight - 80
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array to only attach listener once

  // Hide on support page to prevent double chat boxes
  // Must be after all hooks to obey React Rules of Hooks
  const userString = localStorage.getItem('user');
  let userRole = 'Customer';
  if (userString) {
    try {
      userRole = JSON.parse(userString).role || 'Customer';
    } catch (e) {}
  }
  
  if (userRole !== 'Customer') return null;
  if (location.pathname === '/support') return null;

  return (
    <div className="fixed z-50">
      {/* Floating Button */}
      {!isOpen && (
        <div 
          onMouseDown={handleMouseDown}
          onClick={toggleOpen}
          className="fixed w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-[#0c317c] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 z-[9999] border-2 border-white cursor-grab active:cursor-grabbing"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transition: isDragging ? 'none' : 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          <span className="material-symbols-outlined text-3xl">smart_toy</span>
          {/* Notification dot */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-white"></span>
          </span>
        </div>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div 
          className="fixed shadow-2xl bg-white rounded-3xl overflow-hidden flex flex-col border border-slate-200 z-[9999]"
          style={{
            width: '380px',
            height: '600px',
            left: `${position.x}px`,
            top: `${position.y}px`,
            maxWidth: '100vw',
            maxHeight: '100vh',
            // Disable transition during drag for smoothness
            transition: isDragging ? 'none' : 'box-shadow 0.2s',
          }}
        >
          {/* Drag Handle & Close Button */}
          <div 
            className="h-10 bg-slate-800 w-full flex justify-between items-center px-4 cursor-move shrink-0 select-none"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2 pointer-events-none">
              <span className="material-symbols-outlined text-white/50 text-sm">drag_indicator</span>
              <span className="text-white/80 text-[11px] font-bold tracking-widest uppercase">Kéo để di chuyển</span>
            </div>
            <button 
              onClick={() => handleToggle(false)}
              className="text-white/60 hover:text-white hover:bg-white/20 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Reuse the chat box component */}
          <AIChatBox className="flex-1 w-full h-[calc(100%-40px)] rounded-none shadow-none" />
        </div>
      )}
    </div>
  );
}
