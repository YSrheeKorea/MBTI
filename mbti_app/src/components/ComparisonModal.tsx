import React, { useState } from 'react';
import { TestResult, ComparisonDiff } from '../types/mbti';
import { compareTwoResults } from '../utils/storage';
import { X, ArrowRight, TrendingUp, Calendar, Trash2, GitCompare } from 'lucide-react';

interface ComparisonModalProps {
  currentResult: TestResult;
  historyList: TestResult[];
  onClose: () => void;
  onDeleteHistory: (id: string) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  currentResult,
  historyList,
  onClose,
  onDeleteHistory,
}) => {
  // 비교 대상: 기본값은 가장 최근의 이전 기록
  const pastRecords = historyList.filter((item) => item.id !== currentResult.id);
  const [selectedPrevId, setSelectedPrevId] = useState<string>(
    pastRecords.length > 0 ? pastRecords[0].id : ''
  );

  const selectedPrev = pastRecords.find((item) => item.id === selectedPrevId);
  const comparison: ComparisonDiff | null = selectedPrev
    ? compareTwoResults(currentResult, selectedPrev)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-surface rounded-3xl shadow-2xl p-5 border border-primary-fixed/40 max-h-[85vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2 text-primary font-extrabold text-sm">
            <GitCompare className="w-4 h-4" />
            <span>이전 검사 결과 비교 분석</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scroll Body */}
        <div className="flex-1 overflow-y-auto pt-3 space-y-4 pr-0.5 scrollbar-none">
          {pastRecords.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <span className="text-4xl">🌱</span>
              <p className="text-xs font-bold text-on-surface">비교할 이전 검사 기록이 아직 없어요</p>
              <p className="text-[11px] text-on-surface-variant">
                이번 검사 결과가 자동으로 보관되었으니,<br />다음에 다시 검사할 때 성향 변화를 비교해보실 수 있어요!
              </p>
            </div>
          ) : (
            <>
              {/* Previous Record Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-on-surface flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-secondary" />
                  <span>비교할 이전 검사 선택</span>
                </label>
                <select
                  value={selectedPrevId}
                  onChange={(e) => setSelectedPrevId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-primary-fixed/40 text-xs font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {pastRecords.map((rec) => (
                    <option key={rec.id} value={rec.id}>
                      {new Date(rec.timestamp).toLocaleDateString()} ({rec.mbti} - {rec.mode}문항)
                    </option>
                  ))}
                </select>
              </div>

              {/* Comparison Card */}
              {comparison && selectedPrev && (
                <div className="space-y-3">
                  {/* Type Change Banner */}
                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-primary-fixed/30 shadow-sm flex items-center justify-between">
                    <div className="text-center">
                      <span className="text-[10px] text-outline font-bold">이전 결과</span>
                      <div className="text-base font-extrabold text-on-surface-variant">
                        {selectedPrev.mbti}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <ArrowRight className="w-5 h-5 text-primary" />
                      <span className="text-[10px] font-bold text-primary">
                        {comparison.mbtiChanged ? '유형 전환!' : '유형 유지'}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-primary font-bold">현재 결과</span>
                      <div className="text-base font-extrabold text-primary">
                        {currentResult.mbti}
                      </div>
                    </div>
                  </div>

                  {/* 4-Dimension Diff Bars */}
                  <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-primary-fixed/30 shadow-sm space-y-3">
                    <div className="flex items-center gap-1 text-xs font-bold text-on-surface">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span>지표별 성향 변화 추이</span>
                    </div>

                    {/* EI Diff */}
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between font-bold">
                        <span>외향(E) ↔ 내향(I)</span>
                        <span className={comparison.diffs.EI.change >= 0 ? 'text-secondary font-extrabold' : 'text-primary font-extrabold'}>
                          {comparison.diffs.EI.change >= 0 ? `+${comparison.diffs.EI.change}%p E` : `${comparison.diffs.EI.change}%p I`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                        <span>이전 {selectedPrev.ratios.EI.r1}%</span>
                        <div className="flex-1 h-1.5 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-secondary-container"
                            style={{ width: `${currentResult.ratios.EI.r1}%` }}
                          />
                        </div>
                        <span>현재 {currentResult.ratios.EI.r1}%</span>
                      </div>
                    </div>

                    {/* SN Diff */}
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between font-bold">
                        <span>감각(S) ↔ 직관(N)</span>
                        <span className={comparison.diffs.SN.change >= 0 ? 'text-secondary font-extrabold' : 'text-primary font-extrabold'}>
                          {comparison.diffs.SN.change >= 0 ? `+${comparison.diffs.SN.change}%p S` : `${comparison.diffs.SN.change}%p N`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                        <span>이전 {selectedPrev.ratios.SN.r1}%</span>
                        <div className="flex-1 h-1.5 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-primary-container"
                            style={{ width: `${currentResult.ratios.SN.r1}%` }}
                          />
                        </div>
                        <span>현재 {currentResult.ratios.SN.r1}%</span>
                      </div>
                    </div>

                    {/* TF Diff */}
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between font-bold">
                        <span>사고(T) ↔ 감정(F)</span>
                        <span className={comparison.diffs.TF.change >= 0 ? 'text-secondary font-extrabold' : 'text-tertiary font-extrabold'}>
                          {comparison.diffs.TF.change >= 0 ? `+${comparison.diffs.TF.change}%p T` : `${comparison.diffs.TF.change}%p F`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                        <span>이전 {selectedPrev.ratios.TF.r1}%</span>
                        <div className="flex-1 h-1.5 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-tertiary"
                            style={{ width: `${currentResult.ratios.TF.r1}%` }}
                          />
                        </div>
                        <span>현재 {currentResult.ratios.TF.r1}%</span>
                      </div>
                    </div>

                    {/* JP Diff */}
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between font-bold">
                        <span>판단(J) ↔ 인식(P)</span>
                        <span className={comparison.diffs.JP.change >= 0 ? 'text-primary font-extrabold' : 'text-secondary font-extrabold'}>
                          {comparison.diffs.JP.change >= 0 ? `+${comparison.diffs.JP.change}%p J` : `${comparison.diffs.JP.change}%p P`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                        <span>이전 {selectedPrev.ratios.JP.r1}%</span>
                        <div className="flex-1 h-1.5 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-secondary-fixed-dim"
                            style={{ width: `${currentResult.ratios.JP.r1}%` }}
                          />
                        </div>
                        <span>현재 {currentResult.ratios.JP.r1}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Feedback */}
                  <div className="p-3 rounded-xl bg-primary-fixed/30 border border-primary/20 text-xs text-primary leading-relaxed">
                    💡 <span className="font-bold">성향 변화 총평: </span>
                    {comparison.mbtiChanged
                      ? `시간이 지나며 나의 마음 에너지가 새로운 방향(${currentResult.mbti})으로 유연하게 진화하고 있습니다.`
                      : `시간이 흘러도 나의 핵심 성향(${currentResult.mbti})이 일관성 있게 확고하게 유지되고 있습니다.`}
                  </div>
                </div>
              )}

              {/* Past History List Management */}
              <div className="pt-2 space-y-1.5">
                <div className="text-[11px] font-bold text-outline">저장된 전체 검사 기록 ({historyList.length}개)</div>
                <div className="space-y-1">
                  {historyList.map((rec) => (
                    <div
                      key={rec.id}
                      className={`p-2 rounded-xl flex items-center justify-between text-xs border ${
                        rec.id === currentResult.id
                          ? 'bg-primary-fixed/30 border-primary font-bold'
                          : 'bg-surface-container-lowest border-surface-container-high'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-primary">{rec.mbti}</span>
                        <span className="text-[10px] text-on-surface-variant">
                          {new Date(rec.timestamp).toLocaleDateString()} ({rec.mode}문항)
                        </span>
                        {rec.id === currentResult.id && (
                          <span className="text-[9px] bg-primary text-on-primary px-1.5 py-0.2 rounded-full">
                            현재
                          </span>
                        )}
                      </div>
                      {rec.id !== currentResult.id && (
                        <button
                          type="button"
                          onClick={() => onDeleteHistory(rec.id)}
                          className="text-outline hover:text-error transition-colors p-1 cursor-pointer"
                          title="기록 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-surface-container-high">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-full bg-primary text-on-primary font-bold text-xs active:scale-95 transition-all shadow-md cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
