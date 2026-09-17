import React from 'react';
import { ChevronLeft, Star, Sparkles } from 'lucide-react';
import { TestId, AnyPsychResult, Big5Result, AttachmentResult, EnneagramResult, BurnoutResult, DiscResult } from '../types/psychTests';
import { TestResult } from '../types/mbti';
import { getPsychHistory } from '../utils/psychStorage';
import { getHistoryList } from '../utils/storage';

interface MindDashboardProps {
  onGoHome: () => void;
  onRerunTest: (testId: TestId | 'mbti') => void;
}

// ──────────────────────────────────────────
// 개별 요약 카드
// ──────────────────────────────────────────

interface SummaryCardProps {
  emoji: string;
  label: string;
  value: string;
  sub: string;
  color: string;
  done: boolean;
  onAction: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ emoji, label, value, sub, color, done, onAction }) => (
  <div
    onClick={onAction}
    className={`relative rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-95 ${
      done ? '' : 'opacity-50 grayscale'
    }`}
  >
    <div className={`bg-gradient-to-br ${color} p-3`}>
      <div className="flex items-start justify-between">
        <span className="text-2xl">{emoji}</span>
        {done && <Star className="w-3 h-3 text-white/70 fill-white/70 mt-0.5" />}
      </div>
      <p className="text-white/70 text-[10px] font-medium mt-1">{label}</p>
      {done ? (
        <>
          <p className="text-white text-sm font-extrabold leading-tight mt-0.5">{value}</p>
          <p className="text-white/60 text-[10px] mt-0.5 leading-tight">{sub}</p>
        </>
      ) : (
        <p className="text-white text-xs font-bold mt-1">검사 미완료</p>
      )}
    </div>
  </div>
);

// ──────────────────────────────────────────
// 배터리 바
// ──────────────────────────────────────────

const BatteryBar: React.FC<{ percent: number }> = ({ percent }) => {
  const color =
    percent >= 70 ? 'bg-emerald-400' :
    percent >= 40 ? 'bg-amber-400' : 'bg-red-500';

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2.5 rounded-full bg-surface-container-high overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs font-bold text-on-surface w-10 text-right">{percent}%</span>
    </div>
  );
};

// ──────────────────────────────────────────
// Big 5 레이더 (간이 SVG)
// ──────────────────────────────────────────

const Big5Chart: React.FC<{ scores: Record<string, number> }> = ({ scores }) => {
  const labels = ['O', 'C', 'E', 'A', 'N'];
  const SIZE = 90;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 34;
  const INNER_R = R * 0.15;

  const points = labels.map((_, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const val = (scores[labels[i]] ?? 50) / 100;
    return {
      x: CX + R * val * Math.cos(angle),
      y: CY + R * val * Math.sin(angle),
      lx: CX + (R + 10) * Math.cos(angle),
      ly: CY + (R + 10) * Math.sin(angle),
      label: labels[i],
      score: scores[labels[i]] ?? 50,
    };
  });

  // background axes
  const bgPoints = labels.map((_, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
  });

  const polyStr = points.map((p) => `${p.x},${p.y}`).join(' ');
  const bgStr = bgPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-24 h-24 mx-auto">
      <polygon points={bgStr} fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
      {bgPoints.map((p, i) => (
        <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth="0.5" />
      ))}
      <circle cx={CX} cy={CY} r={INNER_R} fill="#e2e8f0" />
      <polygon points={polyStr} fill="#818cf8" fillOpacity="0.35" stroke="#6366f1" strokeWidth="1.2" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="1.5" fill="#6366f1" />
          <text x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="middle" fontSize="5.5" fill="#64748b" fontWeight="bold">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

// ──────────────────────────────────────────
// Main Dashboard
// ──────────────────────────────────────────

export const MindDashboard: React.FC<MindDashboardProps> = ({ onGoHome, onRerunTest }) => {
  const mbtiHistory = getHistoryList();
  const big5History = getPsychHistory('big5');
  const attachHistory = getPsychHistory('attachment');
  const ennHistory = getPsychHistory('enneagram');
  const burnHistory = getPsychHistory('burnout');
  const discHistory = getPsychHistory('disc');

  const mbti = mbtiHistory[0] as TestResult | undefined;
  const big5 = big5History[0] as Big5Result | undefined;
  const attach = attachHistory[0] as AttachmentResult | undefined;
  const enn = ennHistory[0] as EnneagramResult | undefined;
  const burn = burnHistory[0] as BurnoutResult | undefined;
  const disc = discHistory[0] as DiscResult | undefined;

  const completedCount = [mbti, big5, attach, enn, burn, disc].filter(Boolean).length;
  const allDone = completedCount === 6;

  return (
    <div className="flex flex-col min-h-full bg-surface">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-surface/95 backdrop-blur px-4 pt-4 pb-3 border-b border-surface-container-high">
        <div className="flex items-center gap-2">
          <button
            onClick={onGoHome}
            className="p-1.5 rounded-full hover:bg-surface-container transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-on-surface">나의 마음 포트폴리오</h1>
              {allDone && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <p className="text-[10px] text-on-surface-variant">6대 검사 종합 대시보드 · {completedCount}/6 완료</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2.5 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 rounded-full transition-all duration-700"
            style={{ width: `${(completedCount / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* 완료 배너 */}
        {allDone && (
          <div className="bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 rounded-2xl p-4 text-white text-center shadow-lg">
            <p className="text-lg font-extrabold">🎉 6대 검사 완료!</p>
            <p className="text-xs opacity-80 mt-0.5">나만의 마음 포트폴리오가 완성되었어요</p>
          </div>
        )}

        {/* 2×3 요약 카드 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            emoji="🎭" label="MBTI" color="from-violet-500 to-purple-600"
            done={!!mbti}
            value={mbti?.mbti ?? '?'}
            sub={mbti ? `E/I ${mbti.ratios.EI.r1}% / ${mbti.ratios.EI.r2}%` : ''}
            onAction={() => onRerunTest('mbti')}
          />
          <SummaryCard
            emoji="🧭" label="Big 5 주성향" color="from-blue-500 to-cyan-500"
            done={!!big5}
            value={big5?.dominantTrait ?? '?'}
            sub={big5 ? `O${big5.scores.O} C${big5.scores.C} E${big5.scores.E} A${big5.scores.A} N${big5.scores.N}` : ''}
            onAction={() => onRerunTest('big5')}
          />
          <SummaryCard
            emoji="💞" label="애착 유형" color="from-pink-500 to-rose-500"
            done={!!attach}
            value={attach?.typeName ?? '?'}
            sub={attach ? `불안 ${attach.anxietyScore}% / 회피 ${attach.avoidanceScore}%` : ''}
            onAction={() => onRerunTest('attachment')}
          />
          <SummaryCard
            emoji="🔮" label="에니어그램" color="from-indigo-500 to-violet-500"
            done={!!enn}
            value={enn ? `${enn.primaryType}번 · ${enn.typeName}` : '?'}
            sub={enn?.title ?? ''}
            onAction={() => onRerunTest('enneagram')}
          />
          <SummaryCard
            emoji="🔋" label="번아웃 배터리" color="from-orange-500 to-amber-500"
            done={!!burn}
            value={burn ? `${burn.batteryPercent}%` : '?'}
            sub={burn?.title ?? ''}
            onAction={() => onRerunTest('burnout')}
          />
          <SummaryCard
            emoji="💼" label="DISC 스타일" color="from-emerald-500 to-teal-500"
            done={!!disc}
            value={disc ? `${disc.primaryStyle}형 · ${disc.styleName}` : '?'}
            sub={disc?.work_style ?? ''}
            onAction={() => onRerunTest('disc')}
          />
        </div>

        {/* Big 5 레이더 차트 섹션 */}
        {big5 && (
          <div className="bg-surface-container rounded-2xl p-4">
            <p className="text-xs font-bold text-on-surface mb-3 text-center">🧭 Big 5 OCEAN 레이더</p>
            <Big5Chart scores={big5.scores} />
            <div className="grid grid-cols-5 gap-1 mt-3">
              {(['O', 'C', 'E', 'A', 'N'] as const).map((k) => (
                <div key={k} className="text-center">
                  <p className="text-[9px] text-on-surface-variant">{k}</p>
                  <p className="text-[11px] font-bold text-primary">{big5.scores[k]}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 번아웃 배터리 시각화 */}
        {burn && (
          <div className="bg-surface-container rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-on-surface">🔋 번아웃 세부 지표</p>
            {([
              { label: '신체 에너지', val: 100 - burn.dimensionScores.physical },
              { label: '정신 에너지', val: 100 - burn.dimensionScores.mental },
              { label: '감정 에너지', val: 100 - burn.dimensionScores.emotional },
            ] as { label: string; val: number }[]).map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-[10px] text-on-surface-variant mb-0.5">
                  <span>{item.label}</span>
                </div>
                <BatteryBar percent={Math.round(item.val)} />
              </div>
            ))}
          </div>
        )}

        {/* 성격 통합 인사이트 */}
        {completedCount >= 3 && (
          <div className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-on-surface flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 마음 통합 인사이트
            </p>
            {mbti && big5 && (
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                • MBTI <span className="font-bold text-on-surface">{mbti.mbti}</span> 유형은 Big 5에서{' '}
                <span className="font-bold text-on-surface">{big5.dominantTrait}</span> 축이 두드러집니다.
              </p>
            )}
            {attach && (
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                • 관계에서 <span className="font-bold text-on-surface">{attach.typeName}</span> 스타일이 나타나며, {attach.relationship_tip}
              </p>
            )}
            {enn && (
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                • 에니어그램 <span className="font-bold text-on-surface">{enn.primaryType}번 ({enn.typeName})</span>의 핵심 동기가 성격 전반에 영향을 줍니다.
              </p>
            )}
            {burn && burn.batteryPercent < 40 && (
              <p className="text-[11px] text-rose-400 leading-relaxed font-medium">
                ⚠️ 번아웃 경보: 현재 심리 에너지가 낮습니다. 잠시 쉬어가세요.
              </p>
            )}
            {disc && (
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                • 업무 스타일은 <span className="font-bold text-on-surface">{disc.styleName}</span>으로, {disc.work_style}
              </p>
            )}
          </div>
        )}

        {/* 미완료 유도 */}
        {!allDone && (
          <div className="bg-surface-container-lowest rounded-2xl p-4 text-center space-y-2 border border-dashed border-surface-container-high">
            <p className="text-xs font-bold text-on-surface-variant">
              {6 - completedCount}개 검사 남음
            </p>
            <p className="text-[10px] text-on-surface-variant">
              모든 검사를 완료하면 통합 인사이트를 완성할 수 있어요!
            </p>
            <button
              onClick={onGoHome}
              className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[11px] font-bold px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              검사하러 가기
            </button>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
};
