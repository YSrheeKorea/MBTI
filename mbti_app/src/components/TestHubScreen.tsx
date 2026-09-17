import React from 'react';
import { 
  Compass, 
  HeartHandshake, 
  BrainCircuit, 
  BatteryCharging, 
  Briefcase, 
  UserCheck, 
  ArrowRight, 
  History, 
  Sparkles,
  CheckCircle2,
  LayoutDashboard,
  BookOpen,
  Eye,
  Heart,
  Star,
  Wind,
  Users,
} from 'lucide-react';
import { TestId, TestMeta } from '../types/psychTests';
import { getAllSavedTestCounts } from '../utils/psychStorage';
import { InstallPromptBanner } from './InstallPromptBanner';

interface TestHubScreenProps {
  onSelectTest: (testId: TestId) => void;
  onOpenMbtiHistory: () => void;
  onOpenTestResult: (testId: TestId) => void;
  onOpenHistory: () => void;
  onOpenDashboard: () => void;
}

export const TEST_CATALOG: TestMeta[] = [
  {
    id: 'mbti',
    title: 'MBTI 성격유형 검사',
    subtitle: '16가지 성격 유형 & 현실 딜레마',
    badge: '심층 100문항 & 스피드 12문항',
    duration: '3~10분',
    questionCount: 100,
    emoji: '🎭',
    gradient: 'from-blue-600 to-indigo-600',
    description: 'E/I, S/N, T/F, J/P 4개 선호 축으로 나의 타고난 성격 유형과 강약점을 입체적으로 분석합니다.',
  },
  {
    id: 'big5',
    title: 'Big 5 성격 특성 검사',
    subtitle: '현대 심리학 표준 OCEAN 5대 스펙트럼',
    badge: '학계 표준 진단',
    duration: '약 4분',
    questionCount: 20,
    emoji: '🧭',
    gradient: 'from-emerald-600 to-teal-600',
    description: '개방성·성실성·외향성·친화성·신경증 5대 축으로 나의 진짜 심리 지도를 레이더 차트로 확인합니다.',
  },
  {
    id: 'attachment',
    title: '성인 애착 유형 검사',
    subtitle: '연애와 인간관계 속 내 마음의 방어기제',
    badge: '연애 & 관계',
    duration: '약 3분',
    questionCount: 16,
    emoji: '💞',
    gradient: 'from-rose-500 to-pink-600',
    description: '불안도와 회피도 2개 축으로 연인·친구 관계에서 내가 취하는 4대 애착 스타일을 정밀 진단합니다.',
  },
  {
    id: 'enneagram',
    title: '에니어그램 9가지 성격 유형',
    subtitle: '본능·가슴·머리 3원 중심과 내면의 동기',
    badge: '심층 내면 탐구',
    duration: '약 5분',
    questionCount: 27,
    emoji: '🔮',
    gradient: 'from-purple-600 to-violet-600',
    description: '내가 무의식중에 두려워하고 갈망하는 진짜 핵심 동기와 9가지 성격 유형 중 주 유형을 도출합니다.',
  },
  {
    id: 'burnout',
    title: '마음 배터리 & 번아웃 지수',
    subtitle: '신체·정신·감정 3중 방전도 진단',
    badge: '멘탈 케어 & 힐링',
    duration: '약 3분',
    questionCount: 15,
    emoji: '🔋',
    gradient: 'from-amber-500 to-orange-600',
    description: '현재 나의 심리적 잔여 배터리 잔량을 측정하고 번아웃 단계별 맞춤 심리 처방전을 처방합니다.',
  },
  {
    id: 'disc',
    title: 'DISC 행동 & 업무 스타일',
    subtitle: '주도·사교·안정·신중 4대 일잘러 프로필',
    badge: '커리어 & 협업 궁합',
    duration: '약 3분',
    questionCount: 16,
    emoji: '💼',
    gradient: 'from-cyan-600 to-blue-600',
    description: '직장에서의 의사결정 방식과 스트레스 대처 스타일, 동료와의 최고의 협업 케미를 파악합니다.',
  },
  {
    id: 'ideal_looks',
    title: '이상형 외모 취향 검사',
    subtitle: '내 눈이 끌리는 첫인상의 패턴',
    badge: '연애 & 관계',
    duration: '약 4분',
    questionCount: 20,
    emoji: '👁️',
    gradient: 'from-pink-500 to-rose-500',
    description: '첫눈에 끌리는 외모·인상·스타일 패턴을 분석하여 나만의 이상형 외모 코드를 도출합니다.',
  },
  {
    id: 'ideal_personality',
    title: '이상형 성격 유형 검사',
    subtitle: '내가 끌리는 파트너의 심리 코드',
    badge: '연애 & 관계',
    duration: '약 4분',
    questionCount: 20,
    emoji: '💘',
    gradient: 'from-red-400 to-pink-500',
    description: '나도 모르게 끌리는 이성의 성격·행동 패턴을 분석하여 이상형의 심리적 프로파일을 도출합니다.',
  },
  {
    id: 'self_esteem',
    title: '자존감 & 자기가치감 검사',
    subtitle: '나를 얼마나 사랑하고 있나요?',
    badge: '멘탈 헬스케어',
    duration: '약 3분',
    questionCount: 20,
    emoji: '🌟',
    gradient: 'from-yellow-400 to-amber-500',
    description: 'Rosenberg 자존감 척도 기반. 나 자신에 대한 존중감과 자기 가치감을 4단계로 정밀 진단합니다.',
  },
  {
    id: 'stress_coping',
    title: '스트레스 대처 유형 검사',
    subtitle: '나는 힘들 때 어떻게 반응하는가?',
    badge: '멘탈 헬스케어',
    duration: '약 4분',
    questionCount: 20,
    emoji: '🌊',
    gradient: 'from-sky-500 to-cyan-500',
    description: '스트레스 상황에서 나의 무의식적 반응 패턴을 분석하고 맞춤 회복 전략을 제안합니다.',
  },
  {
    id: 'social_style',
    title: '사회적 에너지 & 관계 스타일',
    subtitle: '사람 속에서 나는 어떤 존재인가?',
    badge: '관계 & 소통',
    duration: '약 4분',
    questionCount: 20,
    emoji: '🌐',
    gradient: 'from-violet-500 to-purple-600',
    description: '사회적 상황에서 내 역할, 에너지 패턴, 관계 유지 방식을 분석하여 나만의 사회적 스타일을 진단합니다.',
  },
];

export const TestHubScreen: React.FC<TestHubScreenProps> = ({
  onSelectTest,
  onOpenMbtiHistory,
  onOpenTestResult,
  onOpenHistory,
  onOpenDashboard,
}) => {
  const savedCounts = getAllSavedTestCounts();
  // 각 검사 완료 여부 (1회 이상 진행했으면 완료 처리)
  const completedTests = Object.values(savedCounts).filter((c) => c > 0).length;
  const totalCompleted = Object.values(savedCounts).reduce((a, b) => a + b, 0);

  const getIcon = (id: TestId) => {
    switch (id) {
      case 'mbti': return <UserCheck className="w-5 h-5" />;
      case 'big5': return <Compass className="w-5 h-5" />;
      case 'attachment': return <HeartHandshake className="w-5 h-5" />;
      case 'enneagram': return <BrainCircuit className="w-5 h-5" />;
      case 'burnout': return <BatteryCharging className="w-5 h-5" />;
      case 'disc': return <Briefcase className="w-5 h-5" />;
      case 'ideal_looks': return <Eye className="w-5 h-5" />;
      case 'ideal_personality': return <Heart className="w-5 h-5" />;
      case 'self_esteem': return <Star className="w-5 h-5" />;
      case 'stress_coping': return <Wind className="w-5 h-5" />;
      case 'social_style': return <Users className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      {/* 상단 히어로 헤더 */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-b-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              마인드 랩 • 6대 심리 검사 센터
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenHistory}
                className="flex items-center gap-1 text-xs text-indigo-300 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors"
              >
                <BookOpen className="w-3 h-3" />
                기록
              </button>
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-1 text-xs text-indigo-300 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors"
              >
                <LayoutDashboard className="w-3 h-3" />
                포트폴리오
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight leading-snug">
            나를 이해하는<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-indigo-200 to-pink-300">
              6가지 심리·성향 검사
            </span>
          </h1>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            점수 계산 노출 없는 100% 블라인드 문항으로 진행되며, 언제든 이전 결과와 비교해 볼 수 있습니다.
          </p>

          {/* 진행률 바 */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-indigo-300">{completedTests}/6 검사 완료</span>
              {completedTests === 6 && (
                <span className="text-[10px] text-amber-300 font-bold flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> 포트폴리오 완성!
                </span>
              )}
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-300 rounded-full transition-all duration-700"
                style={{ width: `${(completedTests / 6) * 100}%` }}
              />
            </div>
            {completedTests > 0 && completedTests < 6 && (
              <p className="text-[10px] text-indigo-400">
                나머지 {6 - completedTests}개 검사를 마치면 종합 마음 포트폴리오를 확인할 수 있어요!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 안드로이드 / 모바일 앱 설치 프롬프트 배너 */}
      <InstallPromptBanner />

      {/* 검사 선택 목록 */}
      <div className="p-4 space-y-3.5 mt-1">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            진행할 검사를 선택하세요
          </h2>
          <span className="text-xs text-indigo-600 font-semibold">총 6개 검사 제공</span>
        </div>

        {TEST_CATALOG.map((test) => {
          const count = savedCounts[test.id] || 0;
          const hasRecord = count > 0;

          return (
            <div
              key={test.id}
              className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between relative overflow-hidden ${
                hasRecord ? 'border-indigo-100' : 'border-slate-200/90'
              }`}
            >
              {/* 완료 배지 */}
              {hasRecord && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" />
                  {count}회 완료
                </div>
              )}

              {/* 상단 배지 & 기본 정보 */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${test.gradient} flex items-center justify-center text-white shadow-md text-xl`}>
                    {test.emoji}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {test.badge}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base mt-0.5 group-hover:text-indigo-600 transition-colors">
                      {test.title}
                    </h3>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500 font-medium mt-6">
                  <div>{test.questionCount}문항</div>
                  <div className="text-slate-500">{test.duration}</div>
                </div>
              </div>

              {/* 설명 */}
              <p className="text-xs text-slate-600 leading-relaxed my-2 pl-1">
                {test.description}
              </p>

              {/* 하단 액션 버튼 영역 */}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
                {hasRecord && (
                  <button
                    onClick={() => {
                      if (test.id === 'mbti') onOpenMbtiHistory();
                      else onOpenTestResult(test.id);
                    }}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    이전 결과
                  </button>
                )}

                <button
                  onClick={() => onSelectTest(test.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-white rounded-xl text-xs font-bold transition-all shadow-sm group-hover:shadow ${
                    hasRecord
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-slate-900 hover:bg-indigo-600'
                  }`}
                >
                  <span>{hasRecord ? '다시 검사하기' : '검사 시작하기'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 바닥 안내 + 버튼 */}
      <div className="p-4 space-y-2.5">
        <div className="flex gap-2">
          <button
            onClick={onOpenHistory}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            검사 기록 보관함
          </button>
          <button
            onClick={onOpenDashboard}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            마음 포트폴리오
          </button>
        </div>
        <p className="text-center text-xs text-slate-400">
          모든 검사 데이터는 사용자 기기에만 안전하게 보관됩니다.
        </p>
      </div>
    </div>
  );
};
