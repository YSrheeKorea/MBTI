import React, { useState, useCallback } from 'react';
import { ChevronLeft, Trash2, Clock, ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';
import { TestId, AnyPsychResult } from '../types/psychTests';
import { TestResult } from '../types/mbti';
import { getPsychHistory } from '../utils/psychStorage';
import { getHistoryList } from '../utils/storage';

interface HistoryScreenProps {
  onGoHome: () => void;
  onRerunTest: (testId: TestId | 'mbti') => void;
}

const TEST_META: Record<string, { label: string; emoji: string; color: string }> = {
  mbti: { label: 'MBTI', emoji: '🎭', color: 'from-violet-500 to-purple-600' },
  big5: { label: 'Big 5 성격', emoji: '🧭', color: 'from-blue-500 to-cyan-500' },
  attachment: { label: '애착 유형', emoji: '💞', color: 'from-pink-500 to-rose-500' },
  enneagram: { label: '에니어그램', emoji: '🔮', color: 'from-indigo-500 to-violet-500' },
  burnout: { label: '번아웃 지수', emoji: '🔋', color: 'from-orange-500 to-amber-500' },
  disc: { label: 'DISC', emoji: '💼', color: 'from-emerald-500 to-teal-500' },
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return iso;
  }
}

function getResultSummary(result: AnyPsychResult | TestResult): string {
  if ('testId' in result) {
    const r = result as AnyPsychResult;
    if (r.testId === 'big5') {
      const scores = r.scores as unknown as Record<string, number>;
      return `주성향: ${r.dominantTrait} | O:${scores.O}% C:${scores.C}% E:${scores.E}% A:${scores.A}% N:${scores.N}%`;
    }
    if (r.testId === 'attachment') return `${r.typeName} (불안 ${r.anxietyScore}% / 회피 ${r.avoidanceScore}%)`;
    if (r.testId === 'enneagram') return `${r.primaryType}번 유형 · ${r.typeName}`;
    if (r.testId === 'burnout') return `배터리 ${r.batteryPercent}% (${r.title})`;
    if (r.testId === 'disc') return `${r.primaryStyle}형 · ${r.styleName}`;
  }
  // MBTI TestResult
  const mbtiR = result as TestResult;
  return `${mbtiR.mbti} (E/I: ${mbtiR.ratios?.EI?.r1 ?? '?'}% / ${mbtiR.ratios?.EI?.r2 ?? '?'}%)`;
}

interface ResultCardProps {
  testId: string;
  result: AnyPsychResult | TestResult;
  onRerun: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ testId, result, onRerun }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = TEST_META[testId] || { label: testId, emoji: '📋', color: 'from-gray-500 to-gray-600' };
  const date = ('date' in result ? (result as AnyPsychResult).date : undefined)
    || ('timestamp' in result ? (result as TestResult).timestamp : undefined)
    || '';

  return (
    <div className="bg-surface-container rounded-2xl overflow-hidden shadow-sm border border-surface-container-high">
      {/* Header */}
      <div className={`bg-gradient-to-r ${meta.color} px-3 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{meta.emoji}</span>
          <div>
            <p className="text-white text-xs font-bold">{meta.label}</p>
            <div className="flex items-center gap-1 text-white/70">
              <Clock className="w-2.5 h-2.5" />
              <span className="text-[10px]">{formatDate(date)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onRerun}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            title="다시 검사하기"
          >
            <RefreshCcw className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            {expanded
              ? <ChevronUp className="w-3 h-3 text-white" />
              : <ChevronDown className="w-3 h-3 text-white" />}
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="px-3 py-2 text-[11px] text-on-surface-variant">
        {getResultSummary(result)}
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-3 pb-3 text-[11px] text-on-surface-variant space-y-1 border-t border-surface-container-high pt-2">
          <pre className="whitespace-pre-wrap break-words font-sans text-[10px] bg-surface-container-lowest rounded-xl p-2 max-h-40 overflow-y-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

type TabId = 'mbti' | 'big5' | 'attachment' | 'enneagram' | 'burnout' | 'disc';
const TABS: TabId[] = ['mbti', 'big5', 'attachment', 'enneagram', 'burnout', 'disc'];

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onGoHome, onRerunTest }) => {
  const [activeTab, setActiveTab] = useState<TabId>('mbti');

  const getHistory = useCallback((tab: TabId): (AnyPsychResult | TestResult)[] => {
    if (tab === 'mbti') return getHistoryList();
    return getPsychHistory(tab as TestId);
  }, []);

  const history = getHistory(activeTab);
  const meta = TEST_META[activeTab];

  return (
    <div className="flex flex-col min-h-full bg-surface">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-surface/95 backdrop-blur px-4 pt-4 pb-2 border-b border-surface-container-high">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={onGoHome}
            className="p-1.5 rounded-full hover:bg-surface-container transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-on-surface">검사 기록 보관함</h1>
            <p className="text-[10px] text-on-surface-variant">6가지 검사의 이력을 모두 확인하세요</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => {
            const m = TEST_META[tab];
            const count = getHistory(tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                  activeTab === tab
                    ? `bg-gradient-to-r ${m.color} text-white shadow-sm`
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
                {count > 0 && (
                  <span className={`${activeTab === tab ? 'bg-white/30' : 'bg-surface-container-high'} rounded-full px-1 text-[9px]`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <span className="text-5xl opacity-30">{meta.emoji}</span>
            <p className="text-sm text-on-surface-variant font-medium">
              아직 {meta.label} 기록이 없어요
            </p>
            <button
              onClick={() => onRerunTest(activeTab)}
              className={`mt-2 bg-gradient-to-r ${meta.color} text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm hover:opacity-90 transition-opacity`}
            >
              지금 검사 시작하기
            </button>
          </div>
        ) : (
          <>
            <p className="text-[11px] text-on-surface-variant text-center">
              총 <span className="font-bold text-primary">{history.length}회</span> 기록 • 최신순
            </p>
            {history.map((r, i) => (
              <ResultCard
                key={i}
                testId={activeTab}
                result={r}
                onRerun={() => onRerunTest(activeTab)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
