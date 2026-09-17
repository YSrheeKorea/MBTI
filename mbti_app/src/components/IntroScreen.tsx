import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Circle, Settings2 } from 'lucide-react';

interface IntroScreenProps {
  mode: 100 | 12;
  setMode: (mode: 100 | 12) => void;
  onStart: () => void;
  onGoHome?: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ mode, setMode, onStart, onGoHome }) => {
  return (
    <div className="flex flex-col min-h-full">
      {/* Top App Bar */}
      <header className="sticky top-0 w-full z-40 pt-7 bg-surface/85 backdrop-blur-xl shadow-[0_4px_20px_rgba(139,124,248,0.06)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="p-1 -ml-1 text-slate-500 hover:text-primary transition-colors text-xs font-bold flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full"
                title="전체 검사 목록으로"
              >
                <span>← 검사 허브</span>
              </button>
            )}
            <span className="text-2xl">🎭</span>
            <span className="text-lg text-primary tracking-tight font-extrabold">MBTI 검사</span>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-xs font-bold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>정밀 진단</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-5 pt-3 pb-8 space-y-4">
        {/* Title & Tag */}
        <div className="flex flex-col items-center text-center pt-2 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed shadow-sm text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>현실 시나리오 100문항 & 12문항 스피드</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl text-on-surface font-extrabold tracking-tight leading-snug">
              진짜 내 마음의 성향은?<br />
              <span className="text-primary">초정밀 MBTI 분석</span>
            </h1>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              카톡, 주말, 여행, 팀플, 고민상담 등 일상의 생생한 딜레마로<br />
              나의 진짜 성격 유형을 명확하게 찾아보세요! ✨
            </p>
          </div>
        </div>

        {/* Mascot Card */}
        <div className="relative w-full rounded-3xl bg-surface-container-lowest p-4 shadow-[0_12px_32px_-6px_rgba(139,124,248,0.16)] flex flex-col items-center overflow-hidden border border-primary-fixed/40">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary-fixed/40 blur-2xl pointer-events-none" />

          <div className="relative w-28 h-28 flex items-center justify-center my-1 z-10">
            <span className="text-6xl select-none animate-bounce" style={{ animationDuration: '2.5s' }}>☁️</span>
            <span className="absolute top-1 right-2 text-xl select-none animate-pulse">💖</span>
            <span className="absolute bottom-1 left-2 text-lg select-none">✨</span>
          </div>

          <div className="text-center z-10 space-y-1">
            <h2 className="text-base text-on-surface font-bold">4대 선호지표 현실 딜레마 진단</h2>
            <p className="text-[11px] text-on-surface-variant">외향/내향 · 감각/직관 · 사고/감정 · 판단/인식</p>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-3 z-10">
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] font-bold">#에너지방향</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] font-bold">#인식방식</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] font-bold">#판단근거</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] font-bold">#생활양식</span>
          </div>
        </div>

        {/* Mode Select Buttons */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-on-surface px-1 flex items-center gap-1">
            <Settings2 className="w-3.5 h-3.5 text-primary" />
            <span>검사 모드 선택</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* 100 Questions Mode */}
            <button
              type="button"
              onClick={() => setMode(100)}
              className={`p-3.5 rounded-2xl text-left transition-all shadow-sm flex flex-col justify-between ${
                mode === 100
                  ? 'bg-primary-fixed border-2 border-primary shadow-md'
                  : 'bg-surface-container-lowest border-2 border-transparent hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-primary">초정밀 진단</span>
                {mode === 100 ? (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                ) : (
                  <Circle className="w-4 h-4 text-outline" />
                )}
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-on-surface">100문항 풀코스</div>
                <div className="text-[11px] text-on-surface-variant">지표별 25문항 현실 밀착</div>
              </div>
            </button>

            {/* 12 Questions Speed Mode */}
            <button
              type="button"
              onClick={() => setMode(12)}
              className={`p-3.5 rounded-2xl text-left transition-all shadow-sm flex flex-col justify-between ${
                mode === 12
                  ? 'bg-secondary-fixed border-2 border-secondary shadow-md'
                  : 'bg-surface-container-lowest border-2 border-transparent hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-secondary">빠른 진단</span>
                {mode === 12 ? (
                  <CheckCircle2 className="w-4 h-4 text-secondary" />
                ) : (
                  <Circle className="w-4 h-4 text-outline" />
                )}
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-on-surface">12문항 스피드</div>
                <div className="text-[11px] text-on-surface-variant">핵심 딜레마 3분 퀵테스트</div>
              </div>
            </button>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onStart}
            className="w-full h-14 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_25px_-4px_rgba(89,72,194,0.5)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>검사 시작하기</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center pt-1 text-[11px] text-outline leading-tight">
          본 검사는 MBTI® 이론을 참고하여 독자 설계된<br />비공식 자가진단 및 성향 탐색 프로그램입니다.
        </div>
      </main>
    </div>
  );
};
