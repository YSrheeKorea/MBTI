import React, { useEffect, useState } from 'react';
import { TestResult, MBTITypeDetail } from '../types/mbti';
import mbtiDataRaw from '../data/mbtiTypes.json';
import {
  Download,
  Share2,
  RotateCcw,
  GitCompare,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  Heart,
  SlidersHorizontal,
  Check,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MBTI_INFO = mbtiDataRaw as unknown as Record<string, MBTITypeDetail>;

interface ResultScreenProps {
  result: TestResult;
  historyList: TestResult[];
  onOpenCompare: () => void;
  onRestart: () => void;
  showToast: (msg: string) => void;
  onGoHome?: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  historyList,
  onOpenCompare,
  onRestart,
  showToast,
  onGoHome,
}) => {
  const [copied, setCopied] = useState(false);
  const info = MBTI_INFO[result.mbti] || MBTI_INFO['ENFP'];

  // 마운트 시 화려한 축하 컨페티 효과
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7262dd', '#ff85a2', '#4ddcc6', '#ffd9df'],
      });
    } catch (e) {
      // confetti fallback
    }
  }, []);

  const hasHistory = historyList.filter((item) => item.id !== result.id).length > 0;

  // TXT 파일 다운로드
  const handleDownloadTxt = () => {
    const dateStr = new Date(result.timestamp).toLocaleString();
    const txtContent = `============================================================
              마음MBTI 성격유형 심층 분석 보고서
============================================================
검사 일시 : ${dateStr}
검사 모드 : ${result.mode}문항 ${result.mode === 100 ? '정밀 진단' : '스피드 진단'}
MBTI 유형 : [ ${result.mbti} ] - ${info.name} (${info.nickname})
핵심 키워드 : ${(info.keywords || []).join(' ')}
------------------------------------------------------------
[ 4대 성향 지표 세부 점수 및 비율 ]
- E(외향) ${result.scores.E}점 (${result.ratios.EI.r1}%) vs I(내향) ${result.scores.I}점 (${result.ratios.EI.r2}%)
- S(감각) ${result.scores.S}점 (${result.ratios.SN.r1}%) vs N(직관) ${result.scores.N}점 (${result.ratios.SN.r2}%)
- T(사고) ${result.scores.T}점 (${result.ratios.TF.r1}%) vs F(감정) ${result.scores.F}점 (${result.ratios.TF.r2}%)
- J(판단) ${result.scores.J}점 (${result.ratios.JP.r1}%) vs P(인식) ${result.scores.P}점 (${result.ratios.JP.r2}%)
------------------------------------------------------------
[ 성격 개요 ]
${info.description}

[ 현실 일상 행동 특징 ]
${(info.traits || []).map((t) => ' - ' + t).join('\n')}

[ 업무 및 학습 스타일 ]
${info.workStyle}

[ 스트레스 요인 및 번아웃 신호 ]
${info.stressFactor}

[ 더 나은 나를 위한 성장 치트키 ]
★ ${info.growthTip}

[ 마음 케미 궁합 분석 ]
- 최고의 찰떡 궁합 : ${info.bestMatch?.name} (${info.bestMatch?.desc})
- 서로 배려가 필요한 궁합 : ${info.worstMatch?.name} (${info.worstMatch?.desc})
============================================================
본 검사는 MBTI® 이론을 참고하여 독자 설계된 비공식 자가진단 검사입니다.
`;

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `마음MBTI_심층보고서_${result.mbti}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('심층 결과 보고서 텍스트 파일이 저장되었습니다! 📥');
  };

  // 링크 복사
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopied(true);
    showToast('테스트 링크가 클립보드에 복사되었어요! 💌');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Header */}
      <header className="sticky top-0 w-full z-40 pt-7 bg-surface/85 backdrop-blur-xl shadow-[0_4px_20px_rgba(139,124,248,0.06)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☁️</span>
            <span className="text-lg text-primary font-extrabold">마음MBTI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>결과 자동저장됨</span>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-5 pt-3 pb-12 gap-4">
        {/* Compare Previous Banner Button */}
        {hasHistory && (
          <button
            type="button"
            onClick={onOpenCompare}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-primary-fixed via-surface-container-high to-secondary-fixed border border-primary/20 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <GitCompare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-extrabold text-on-surface">이전 검사 결과와 비교하기</div>
                <div className="text-[10px] text-on-surface-variant">성향 변화와 지표별 차이를 확인해보세요</div>
              </div>
            </div>
            <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-full bg-surface/80 shadow-sm">
              비교 뷰
            </span>
          </button>
        )}

        {/* Result Bento Box Card */}
        <div className="w-full bg-surface-container-lowest rounded-3xl p-5 shadow-xl flex flex-col items-center text-center relative overflow-hidden border border-primary-fixed/40">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-fixed/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-fixed/40 rounded-full blur-2xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary-container px-4 py-1 rounded-full shadow-md z-10 mb-2">
            <span className="text-base font-extrabold tracking-wider">{result.mbti}</span>
            <span className="w-1 h-1 rounded-full bg-on-primary-container/60" />
            <span className="text-xs font-medium">{info.subBadge}</span>
          </div>

          {/* Emoji */}
          <div className="relative my-1.5 w-24 h-24 flex items-center justify-center z-10">
            <span className="text-7xl select-none animate-bounce" style={{ animationDuration: '3s' }}>
              {info.emoji}
            </span>
          </div>

          {/* Titles */}
          <div className="z-10 flex flex-col items-center gap-0.5">
            <h2 className="text-xl font-extrabold text-on-surface tracking-tight">{info.name}</h2>
            <p className="text-sm font-bold text-primary">{info.nickname}</p>
          </div>

          {/* Keyword Tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 z-10">
            {(info.keywords || []).map((kw, idx) => {
              const colors = [
                'bg-secondary-fixed text-on-secondary-fixed-variant',
                'bg-primary-fixed text-on-primary-fixed-variant',
                'bg-tertiary-fixed text-on-tertiary-fixed-variant',
                'bg-surface-container-high text-primary',
              ];
              return (
                <span
                  key={idx}
                  className={`${colors[idx % colors.length]} px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm`}
                >
                  {kw}
                </span>
              );
            })}
          </div>

          {/* Description */}
          <div className="w-full bg-surface-container-low rounded-2xl p-3.5 mt-3 text-left z-10 shadow-sm border border-primary-fixed/20">
            <p className="text-xs text-on-surface leading-relaxed break-keep">{info.description}</p>
          </div>
        </div>

        {/* 4-Dimension Percentage Sliders */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-md flex flex-col gap-3 border border-primary-fixed/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-primary">
              <SlidersHorizontal className="w-4 h-4" />
              <h3 className="text-xs font-bold text-on-surface">마음 에너지 및 행동 지표 수치</h3>
            </div>
            <span className="text-[10px] text-outline font-medium">초정밀 분석 결과</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* EI */}
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-secondary font-bold">외향형 (E) {result.ratios.EI.r1}%</span>
                <span className="text-on-surface-variant font-medium">내향형 (I) {result.ratios.EI.r2}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container flex overflow-hidden p-0.5">
                <div
                  className="h-full bg-secondary-container rounded-full transition-all duration-700"
                  style={{ width: `${result.ratios.EI.r1}%` }}
                />
                <div
                  className="h-full bg-surface-variant rounded-full ml-0.5 transition-all duration-700"
                  style={{ width: `${result.ratios.EI.r2}%` }}
                />
              </div>
            </div>

            {/* SN */}
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-on-surface-variant font-medium">감각형 (S) {result.ratios.SN.r1}%</span>
                <span className="text-primary font-bold">직관형 (N) {result.ratios.SN.r2}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container flex overflow-hidden p-0.5">
                <div
                  className="h-full bg-surface-variant rounded-full transition-all duration-700"
                  style={{ width: `${result.ratios.SN.r1}%` }}
                />
                <div
                  className="h-full bg-primary-container rounded-full ml-0.5 transition-all duration-700"
                  style={{ width: `${result.ratios.SN.r2}%` }}
                />
              </div>
            </div>

            {/* TF */}
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-on-surface-variant font-medium">사고형 (T) {result.ratios.TF.r1}%</span>
                <span className="text-tertiary font-bold">감정형 (F) {result.ratios.TF.r2}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container flex overflow-hidden p-0.5">
                <div
                  className="h-full bg-surface-variant rounded-full transition-all duration-700"
                  style={{ width: `${result.ratios.TF.r1}%` }}
                />
                <div
                  className="h-full bg-tertiary rounded-full ml-0.5 transition-all duration-700"
                  style={{ width: `${result.ratios.TF.r2}%` }}
                />
              </div>
            </div>

            {/* JP */}
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-on-surface-variant font-medium">판단형 (J) {result.ratios.JP.r1}%</span>
                <span className="text-secondary font-bold">인식형 (P) {result.ratios.JP.r2}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container flex overflow-hidden p-0.5">
                <div
                  className="h-full bg-surface-variant rounded-full transition-all duration-700"
                  style={{ width: `${result.ratios.JP.r1}%` }}
                />
                <div
                  className="h-full bg-secondary-fixed-dim rounded-full ml-0.5 transition-all duration-700"
                  style={{ width: `${result.ratios.JP.r2}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Key Traits */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-md flex flex-col gap-2 border border-primary-fixed/30">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <h3 className="text-xs font-bold text-on-surface">현실 일상 행동 특징</h3>
          </div>
          <div className="flex flex-col gap-1.5">
            {(info.traits || []).map((trait, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 rounded-xl bg-surface-container-low/70 border border-primary-fixed/20"
              >
                <div className="w-4 h-4 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 mt-0.5 text-primary">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <p className="text-[11px] text-on-surface leading-tight">{trait}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Analysis Cards */}
        {/* 1. Work Style */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-md flex flex-col gap-1.5 border border-primary-fixed/30">
          <div className="flex items-center gap-1.5 text-primary">
            <Briefcase className="w-4 h-4" />
            <h3 className="text-xs font-bold text-on-surface">업무 및 학습 스타일</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed break-keep">{info.workStyle}</p>
        </div>

        {/* 2. Stress Factor */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-md flex flex-col gap-1.5 border border-primary-fixed/30">
          <div className="flex items-center gap-1.5 text-secondary">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-xs font-bold text-on-surface">스트레스 요인 및 번아웃 신호</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed break-keep">{info.stressFactor}</p>
        </div>

        {/* 3. Growth Tip */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-md flex flex-col gap-1.5 border border-primary-fixed/30">
          <div className="flex items-center gap-1.5 text-tertiary">
            <Lightbulb className="w-4 h-4" />
            <h3 className="text-xs font-bold text-on-surface">더 나은 나를 위한 성장 치트키</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed break-keep">{info.growthTip}</p>
        </div>

        {/* Chemistry Cards */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center gap-1 px-1">
            <Heart className="w-3.5 h-3.5 text-secondary fill-secondary" />
            <h3 className="text-xs font-bold text-on-surface">마음 케미 궁합</h3>
          </div>
          <div className="grid grid-cols-1 gap-2 w-full">
            {/* Best Match */}
            <div className="w-full bg-surface-container-lowest rounded-2xl p-3 shadow-md flex items-center justify-between border border-primary-fixed/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-lg shadow-sm">
                  🌟
                </div>
                <div>
                  <span className="text-[10px] font-bold text-secondary">최고의 찰떡 궁합</span>
                  <h4 className="text-xs font-bold text-on-surface">{info.bestMatch?.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{info.bestMatch?.desc}</p>
                </div>
              </div>
              <span className="bg-secondary-container/20 text-secondary px-2 py-0.5 rounded-full text-xs font-extrabold">
                98%
              </span>
            </div>

            {/* Caution Match */}
            <div className="w-full bg-surface-container-lowest rounded-2xl p-3 shadow-md flex items-center justify-between border border-primary-fixed/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-lg shadow-sm">
                  🌱
                </div>
                <div>
                  <span className="text-[10px] font-bold text-outline">서로 배려가 필요한 궁합</span>
                  <h4 className="text-xs font-bold text-on-surface">{info.worstMatch?.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{info.worstMatch?.desc}</p>
                </div>
              </div>
              <span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full text-xs font-bold">
                55%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 pt-1">
          {/* Compare Button (if history exists) */}
          {hasHistory && (
            <button
              type="button"
              onClick={onOpenCompare}
              className="w-full h-12 rounded-full bg-surface-container-high text-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer border border-primary/20"
            >
              <GitCompare className="w-4 h-4" />
              <span>이전 검사 결과와 비교해보기</span>
            </button>
          )}

          {/* Download TXT */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="w-full h-12 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>심층 결과 보고서 파일(TXT) 다운로드</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Share Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full h-11 rounded-full bg-surface-container-high text-primary text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? '복사 완료!' : '링크 공유'}</span>
            </button>

            {/* Restart */}
            <button
              type="button"
              onClick={onRestart}
              className="w-full h-11 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 검사하기</span>
            </button>
          </div>

          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              className="w-full h-12 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer mt-1"
            >
              <span>다른 심리 검사 하러 가기 (홈)</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
