import React from 'react';
import { ChevronLeft, Home, Sparkles } from 'lucide-react';
import { GenericQuestion, TestMeta } from '../types/psychTests';

interface GenericTestScreenProps {
  meta: TestMeta;
  questions: GenericQuestion[];
  currentIndex: number;
  answers: Record<number, number>;
  onSelectAnswer: (scoreVal: number) => void;
  onPrev: () => void;
  onGoHome: () => void;
}

const SCALE_OPTIONS = [
  {
    score: 5,
    label: '완전 공감해요!',
    sub: '평소 내 모습과 정확히 일치함',
    activeClass: 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/30',
    indicator: 'bg-indigo-600',
  },
  {
    score: 4,
    label: '그런 편이에요',
    sub: '대체로 그렇다고 느낌',
    activeClass: 'border-indigo-400 bg-indigo-50/60 text-indigo-900',
    indicator: 'bg-indigo-400',
  },
  {
    score: 3,
    label: '상황 따라 보통이에요',
    sub: '반반이거나 때에 따라 다름',
    activeClass: 'border-slate-400 bg-slate-100 text-slate-800',
    indicator: 'bg-slate-400',
  },
  {
    score: 2,
    label: '별로 그렇지 않아요',
    sub: '내 모습과는 다소 거리가 있음',
    activeClass: 'border-rose-400 bg-rose-50/60 text-rose-900',
    indicator: 'bg-rose-400',
  },
  {
    score: 1,
    label: '전혀 아니에요!',
    sub: '나와 완전히 반대임',
    activeClass: 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-500/30',
    indicator: 'bg-rose-600',
  },
];

export const GenericTestScreen: React.FC<GenericTestScreenProps> = ({
  meta,
  questions,
  currentIndex,
  answers,
  onSelectAnswer,
  onPrev,
  onGoHome,
}) => {
  const currentQ = questions[currentIndex];
  const total = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);
  const selectedScore = answers[currentIndex];

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* 상단 네비게이션 & 프로그레스 */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <button
              onClick={onPrev}
              className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="이전 문항"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onGoHome}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="검사 목록(홈)으로"
            >
              <Home className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 ml-1 truncate max-w-[170px]">
              {meta.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            <span>{currentIndex + 1}</span>
            <span className="text-indigo-300">/</span>
            <span className="text-indigo-400">{total}</span>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 질문 본문 카드 */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* 카테고리 태그 */}
          {currentQ.category && (
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50/80 px-2.5 py-0.5 rounded-md border border-indigo-100">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                {currentQ.category}
              </span>
            </div>
          )}

          {/* 질문 내용 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs mb-5">
            <span className="text-xs font-black text-slate-500 block mb-1">
              Q{currentQ.number}
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-800 leading-snug">
              {currentQ.text}
            </h2>
          </div>

          {/* 블라인드 5지선다 선택지 */}
          <div className="space-y-2.5">
            {SCALE_OPTIONS.map((opt) => {
              const isSelected = selectedScore === opt.score;

              return (
                <button
                  key={opt.score}
                  onClick={() => onSelectAnswer(opt.score)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between group active:scale-[0.99] ${
                    isSelected
                      ? opt.activeClass
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="pr-2">
                    <div className="text-sm font-bold tracking-tight">
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {opt.sub}
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? `${opt.indicator} border-transparent`
                        : 'border-slate-300 group-hover:border-indigo-400'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 하단 점수 비노출 안내 캡션 */}
        <div className="mt-6 text-center text-[11px] text-slate-500">
          💡 첫 느낌대로 솔직하게 선택하실 때 가장 정확한 심리 지표가 도출됩니다.
        </div>
      </div>
    </div>
  );
};
