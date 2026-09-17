import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TestId } from '../types/psychTests';

interface LoadingScreenProps {
  onComplete: () => void;
  testId?: TestId | 'mbti';
}

const LOADING_STEPS: Record<string, { title: string; desc: string; p: number }[]> = {
  mbti: [
    { p: 25, title: "1단계: 응답 데이터 팩트 검증", desc: "현실 딜레마 응답 신뢰도와 척도 점수를 집계하고 있어요." },
    { p: 55, title: "2단계: 4대 성향 에너지 지표 분석", desc: "외향/내향, 감각/직관, 사고/감정, 판단/인식 비율 계산 중..." },
    { p: 85, title: "3단계: 심층 행동 메커니즘 도출", desc: "업무 스타일, 스트레스 요인, 성장 치트키를 대조하고 있어요." },
    { p: 100, title: "4단계: 나만의 MBTI 유형 완성!", desc: "최종 성격유형 결과를 출력합니다 ✨" }
  ],
  big5: [
    { p: 25, title: "1단계: OCEAN 5대 축 분광 수집", desc: "개방성, 성실성, 외향성, 친화성, 신경증 점수 집계 중..." },
    { p: 55, title: "2단계: 역채점 보정 및 정규화", desc: "정방향·역방향 문항을 교차 검증하고 0~100 점수로 변환 중..." },
    { p: 85, title: "3단계: 핵심 성격 스펙트럼 도출", desc: "5개 차원의 상호 관계를 분석하고 주 성향 프로파일 확정 중..." },
    { p: 100, title: "4단계: OCEAN 성격 리포트 완성!", desc: "나만의 5대 성격 스펙트럼 차트를 그리고 있어요 🧭" }
  ],
  attachment: [
    { p: 25, title: "1단계: 불안·회피 두 축 측정", desc: "관계에서의 불안도와 회피도 원점수를 집계하고 있어요." },
    { p: 55, title: "2단계: 역채점 보정 & 좌표 계산", desc: "안정형 역문항을 보정하고 2D 4사분면 위치를 계산 중..." },
    { p: 85, title: "3단계: 애착 스타일 분류", desc: "안정형·불안형·회피형·혼란형 중 나의 위치를 확정하고 있어요." },
    { p: 100, title: "4단계: 관계 지도 완성!", desc: "나의 사랑 방식을 꼼꼼히 분석한 리포트를 준비했어요 💞" }
  ],
  enneagram: [
    { p: 25, title: "1단계: 9가지 핵심 동기 집계", desc: "본능·가슴·머리 삼원 중심 27개 문항 응답을 분류 중..." },
    { p: 55, title: "2단계: 유형별 원점수 순위 산출", desc: "1번부터 9번 유형의 점수를 내림차순으로 정렬하고 있어요." },
    { p: 85, title: "3단계: 주 유형 및 날개 성향 탐색", desc: "가장 높은 1~2순위 유형으로 핵심 동기와 두려움을 분석 중..." },
    { p: 100, title: "4단계: 에니어그램 결과 완성!", desc: "9각 유형 중 나의 위치와 성장 방향이 나왔어요 🔮" }
  ],
  burnout: [
    { p: 25, title: "1단계: 3대 고갈 영역 측정", desc: "신체적·정신적·감정적 방전 지수를 각각 집계하고 있어요." },
    { p: 55, title: "2단계: 번아웃 총량 계산", desc: "15개 문항 합산 점수로 마음 배터리 잔량%를 계산 중..." },
    { p: 85, title: "3단계: 번아웃 단계 판정", desc: "안전·주의·경고·위험 4단계 중 현재 상태를 분류하고 있어요." },
    { p: 100, title: "4단계: 마음 배터리 리포트 완성!", desc: "현재 심리 에너지 상태와 힐링 처방전이 준비됐어요 🔋" }
  ],
  disc: [
    { p: 25, title: "1단계: D·I·S·C 4색 점수 집계", desc: "주도·사교·안정·신중 4개 스타일 응답을 분류하고 있어요." },
    { p: 55, title: "2단계: 행동 스타일 역량 정규화", desc: "각 스타일의 0~100% 강도 비율을 계산하고 있어요." },
    { p: 85, title: "3단계: 주·부 스타일 콤비네이션 탐색", desc: "1·2위 스타일의 시너지와 협업 궁합을 분석하고 있어요." },
    { p: 100, title: "4단계: DISC 일잘러 프로필 완성!", desc: "나의 업무 스타일과 최고 파트너 궁합이 나왔어요 💼" }
  ],
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, testId = 'mbti' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 35);

    return () => clearInterval(timer);
  }, [onComplete]);

  const steps = LOADING_STEPS[testId] || LOADING_STEPS.mbti;
  const currentStep = steps.find((s) => progress <= s.p) || steps[steps.length - 1];

  const EMOJI_MAP: Record<string, string> = {
    mbti: '🎭', big5: '🧭', attachment: '💞', enneagram: '🔮', burnout: '🔋', disc: '💼'
  };
  const emoji = EMOJI_MAP[testId] || '☁️';

  return (
    <div className="flex flex-col min-h-full items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 -left-12 w-44 h-44 bg-primary-fixed/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-12 w-44 h-44 bg-secondary-fixed/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-xs space-y-5">
        {/* Mascot Animation */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <span className="text-7xl animate-pulse select-none">{emoji}</span>
          <span className="absolute top-1 right-2 text-2xl animate-bounce" style={{ animationDuration: '1.5s' }}>
            ✨
          </span>
          <span className="absolute bottom-2 left-2 text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
            💖
          </span>
        </div>

        {/* Progress Number */}
        <div className="space-y-1">
          <span className="text-4xl font-extrabold text-primary">{progress}%</span>
          <p className="text-sm font-bold text-on-surface">마음 성향을 심층 분석하고 있어요</p>
        </div>

        {/* Dynamic Message Box */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-md border border-primary-fixed/30 text-xs text-on-surface-variant space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-primary font-bold">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{currentStep.title}</span>
          </div>
          <p className="text-[11px] text-outline">{currentStep.desc}</p>
        </div>

        {/* Mini Progress Bar */}
        <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-secondary-container via-primary to-tertiary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
