import React from 'react';
import { Question } from '../types/mbti';
import { ChevronLeft, ChevronRight, Sparkles, Heart, Check, Smile, Meh, Frown } from 'lucide-react';

interface QuestionScreenProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  currentAnswer?: number;
  onSelectAnswer: (score: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onGoHome?: () => void;
}

// 점수나 숫자가 전혀 노출되지 않는 순수 공감 기반 블라인드 선택지
const BLIND_LIKERT_OPTIONS = [
  {
    val: 1,
    title: "완전 공감해요!",
    sub: "내 일상 이야기 그 자체예요",
    color: "bg-tertiary-fixed text-tertiary",
    activeColor: "bg-tertiary-fixed/30 border-tertiary",
    icon: Smile
  },
  {
    val: 2,
    title: "그런 편이에요",
    sub: "대체로 고개가 끄덕여져요",
    color: "bg-surface-container-high text-tertiary",
    activeColor: "bg-primary-fixed/40 border-primary",
    icon: Smile
  },
  {
    val: 3,
    title: "상황 따라 반반이에요",
    sub: "때와 장소, 기분에 따라 달라요",
    color: "bg-surface-container-high text-on-surface-variant",
    activeColor: "bg-surface-container-high border-outline",
    icon: Meh
  },
  {
    val: 4,
    title: "별로 그렇지 않아요",
    sub: "나와는 조금 거리가 있어요",
    color: "bg-secondary-fixed text-secondary",
    activeColor: "bg-secondary-fixed/40 border-secondary",
    icon: Frown
  },
  {
    val: 5,
    title: "전혀 아니에요!",
    sub: "나와 완전히 딴판인 이야기예요",
    color: "bg-secondary-container text-on-secondary",
    activeColor: "bg-secondary-container/30 border-secondary",
    icon: Frown
  },
];

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  currentIndex,
  totalQuestions,
  currentAnswer,
  onSelectAnswer,
  onPrev,
  onNext,
  onGoHome,
}) => {
  const currentNum = currentIndex + 1;
  const percent = Math.round(((currentNum - 1) / totalQuestions) * 100);

  const dimNameMap: Record<string, string> = {
    EI: "#에너지방향 #E vs I",
    SN: "#인식방식 #S vs N",
    TF: "#판단근거 #T vs F",
    JP: "#생활양식 #J vs P",
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-7 bg-surface/85 backdrop-blur-xl shadow-[0_4px_20px_rgba(139,124,248,0.06)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrev}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container active:scale-95 transition-all cursor-pointer"
              title="이전 문항"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {onGoHome && (
              <button
                type="button"
                onClick={onGoHome}
                className="text-[11px] font-bold px-2 py-1 rounded-md bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                title="전체 검사 허브로"
              >
                검사 목록
              </button>
            )}
            <span className="text-base text-primary font-extrabold">MBTI</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-on-surface-variant">
            <Heart className="w-4 h-4 text-secondary fill-secondary" />
            <span>{currentNum} / {totalQuestions}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-5 pt-3 pb-8 gap-3.5">
        {/* Progress Bar & Badges */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-xs font-bold shadow-sm">
                Q {currentNum < 10 ? `0${currentNum}` : currentNum}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-bold">
                {dimNameMap[question.dimension] || `#${question.dimension}`}
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{percent}% 완료</span>
            </div>
          </div>

          <div className="relative w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-secondary-container via-primary-container to-primary transition-all duration-300 ease-out"
              style={{ width: `${Math.max(4, percent)}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="relative rounded-3xl bg-surface-container-lowest p-4 shadow-[0_12px_32px_-6px_rgba(89,72,194,0.12)] flex flex-col gap-2 border border-primary-fixed/30">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
              <span>{question.category ? `#${question.category}` : '#현실딜레마'}</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-primary text-xs">
              ☁️
            </div>
          </div>

          <h2 className="text-sm font-extrabold text-on-surface leading-snug break-keep min-h-[58px] flex items-center">
            {question.text}
          </h2>
          <p className="text-[10px] text-on-surface-variant">
            점수 계산을 의식하지 않고 마음에 와닿는 느낌대로 솔직하게 골라주세요 ✨
          </p>
        </div>

        {/* 점수가 보이지 않는 블라인드 선택지 리스트 */}
        <div className="flex flex-col gap-1.5">
          {BLIND_LIKERT_OPTIONS.map((opt) => {
            const isSelected = currentAnswer === opt.val;
            const Icon = opt.icon;

            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => onSelectAnswer(opt.val)}
                className={`choice-btn group w-full text-left p-3 rounded-2xl shadow-sm flex items-center justify-between border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-fixed border-primary shadow-md scale-[1.01]'
                    : 'bg-surface-container-lowest border-transparent hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${opt.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface group-hover:text-primary">
                      {opt.title}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">{opt.sub}</span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${
                    isSelected
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Guidance & Nav Row */}
        <div className="flex items-center justify-center gap-1 text-[10px] text-on-surface-variant py-0.5">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>선택하면 보이지 않게 점수가 누적되어 다음 질문으로 넘어가요 ☁️</span>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <button
            type="button"
            onClick={onPrev}
            className="px-4 h-10 rounded-full bg-surface-container text-on-surface text-xs font-bold active:scale-95 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>이전 문항</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-5 h-10 rounded-full bg-primary text-on-primary text-xs font-bold active:scale-95 transition-all flex items-center gap-1 shadow-md cursor-pointer"
          >
            <span>다음 문항</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
