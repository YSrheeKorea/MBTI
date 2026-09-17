import React, { ReactNode } from 'react';

interface MobileFrameProps {
  children: ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children, scrollRef }) => {
  return (
    <div className="w-full max-w-[440px] h-[94vh] max-h-[900px] bg-surface rounded-[46px] shadow-[0_25px_60px_-15px_rgba(89,72,194,0.3),0_0_0_10px_#2a2538,0_0_0_12px_#4b4560] relative flex flex-col overflow-hidden transition-all duration-300 max-[500px]:max-w-full max-[500px]:h-screen max-[500px]:max-h-screen max-[500px]:rounded-none max-[500px]:shadow-none">
      {/* 상단 다이내믹 아일랜드 / 노치 */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1626] rounded-full z-50 flex items-center justify-between px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)] max-[500px]:hidden">
        <div className="w-9 h-1 rounded-full bg-[#252033]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#0f0d17] border border-[#332b4a]" />
      </div>

      {/* 하단 홈 인디케이터 바 */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-[#2b2540] z-50 pointer-events-none max-[500px]:hidden" />

      {/* 내부 스크롤 컨테이너 */}
      <div
        ref={scrollRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col relative bg-surface scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};
