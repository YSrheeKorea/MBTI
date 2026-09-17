import React from 'react';
import { 
  Home, 
  RotateCcw, 
  CheckCircle, 
  Share2, 
  AlertTriangle, 
  Sparkles, 
  Heart, 
  Zap, 
  BatteryMedium,
  Award,
  Users,
  ShieldCheck,
  Check,
  Compass,
  MessageCircleHeart,
  TrendingUp,
  Star
} from 'lucide-react';
import { 
  AnyPsychResult, 
  Big5Result, 
  AttachmentResult, 
  EnneagramResult, 
  BurnoutResult, 
  DiscResult,
  TypeResult,
  SelfEsteemResult,
  TestMeta 
} from '../types/psychTests';

interface GenericResultScreenProps {
  meta: TestMeta;
  result: AnyPsychResult;
  onRestart: () => void;
  onGoHome: () => void;
  onShowToast: (msg: string) => void;
}

export const GenericResultScreen: React.FC<GenericResultScreenProps> = ({
  meta,
  result,
  onRestart,
  onGoHome,
  onShowToast,
}) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onShowToast('결과 링크가 클립보드에 복사되었습니다.');
  };

  // 1. Big 5 렌더링
  const renderBig5 = (res: Big5Result) => {
    const traits = [
      { key: 'O', label: '개방성 (Openness)', val: res.scores.O, color: 'bg-amber-500', desc: '새로운 호기심과 창의성' },
      { key: 'C', label: '성실성 (Conscientiousness)', val: res.scores.C, color: 'bg-emerald-500', desc: '목표 지향적 끈기와 책임감' },
      { key: 'E', label: '외향성 (Extraversion)', val: res.scores.E, color: 'bg-blue-500', desc: '사회적 에너지와 적극성' },
      { key: 'A', label: '친화성 (Agreeableness)', val: res.scores.A, color: 'bg-pink-500', desc: '타인에 대한 공감과 이타심' },
      { key: 'N', label: '정서민감성 (Neuroticism)', val: res.scores.N, color: 'bg-purple-500', desc: '스트레스와 위험 신호 민감도' },
    ];

    return (
      <div className="space-y-4">
        {/* 응답 일관성 / 묵종 편향 알림 */}
        {res.validityNote && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-2.5 text-amber-900 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-black block text-amber-800 mb-0.5">💡 응답 신뢰도 & 정규화 안내</span>
              {res.validityNote}
            </div>
          </div>
        )}

        {/* 주 특성 요약 카드 */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-md">
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-2">
            가장 두드러진 핵심 성향
          </span>
          <h2 className="text-2xl font-black">{res.dominantTrait}</h2>
          <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
            {res.summary}
          </p>
        </div>

        {/* 5대 축 점수 바 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            OCEAN 5대 지표 스펙트럼
          </h3>
          {traits.map((t) => (
            <div key={t.key} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">{t.label}</span>
                <span className="text-indigo-600 font-extrabold">{t.val}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`${t.color} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${t.val}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 2. 애착 유형 렌더링
  const renderAttachment = (res: AttachmentResult) => {
    const anxietyScore = res.anxietyScore ?? 50;
    const avoidanceScore = res.avoidanceScore ?? 50;

    const dist = res.typeDistribution || {
      secure: res.typeKey === 'secure' ? 55 : 15,
      anxious: res.typeKey === 'anxious' ? 55 : 15,
      avoidant: res.typeKey === 'avoidant' ? 55 : 15,
      fearful: res.typeKey === 'fearful' ? 55 : 15,
    };

    return (
      <div className="space-y-4">
        {/* 응답 일관성 안내 */}
        {res.validityNote && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-2.5 text-amber-900 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-black block text-amber-800 mb-0.5">💡 응답 신뢰도 & 정규화 안내</span>
              {res.validityNote}
            </div>
          </div>
        )}

        {/* 1. 상단 메인 유형 배너 카드 */}
        <div className="bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{res.emoji || '💞'}</span>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
              나의 성인 애착 스타일
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">{res.typeName}</h2>
          <div className="text-xs font-semibold text-rose-100 mt-1">
            "{res.tagline}"
          </div>
          <p className="text-xs text-white/95 mt-2.5 leading-relaxed font-normal bg-black/10 rounded-xl p-3 border border-white/10">
            {res.desc}
          </p>
        </div>

        {/* 2. 2D 관계 4사분면 인터랙티브 지도 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-rose-500" />
              관계 4사분면 지도
            </div>
            <div className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
              불안 {anxietyScore}% · 회피 {avoidanceScore}%
            </div>
          </div>

          <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-2 grid grid-cols-2 grid-rows-2 gap-1.5 text-[11px] font-bold">
            {/* 4개 분면 카드 */}
            <div className={`p-2.5 rounded-lg flex flex-col justify-between transition-all ${
              res.typeKey === 'anxious'
                ? 'bg-rose-100/90 text-rose-900 border-2 border-rose-400 shadow-sm'
                : 'bg-white/70 text-slate-500 border border-slate-100'
            }`}>
              <div className="flex items-center gap-1">
                <span>🌸 불안형</span>
                {res.typeKey === 'anxious' && <span className="text-[9px] bg-rose-600 text-white px-1 rounded">나</span>}
              </div>
              <span className="text-[9px] font-normal text-slate-500">높은불안 / 낮은회피</span>
            </div>

            <div className={`p-2.5 rounded-lg flex flex-col justify-between text-right transition-all ${
              res.typeKey === 'fearful'
                ? 'bg-rose-100/90 text-rose-900 border-2 border-rose-400 shadow-sm'
                : 'bg-white/70 text-slate-500 border border-slate-100'
            }`}>
              <div className="flex items-center justify-end gap-1">
                {res.typeKey === 'fearful' && <span className="text-[9px] bg-rose-600 text-white px-1 rounded">나</span>}
                <span>🦊 혼란형</span>
              </div>
              <span className="text-[9px] font-normal text-slate-500">높은불안 / 높은회피</span>
            </div>

            <div className={`p-2.5 rounded-lg flex flex-col justify-between transition-all ${
              res.typeKey === 'secure'
                ? 'bg-emerald-100/90 text-emerald-900 border-2 border-emerald-400 shadow-sm'
                : 'bg-white/70 text-slate-500 border border-slate-100'
            }`}>
              <span className="text-[9px] font-normal text-slate-500">낮은불안 / 낮은회피</span>
              <div className="flex items-center gap-1">
                <span>⚓ 안정형</span>
                {res.typeKey === 'secure' && <span className="text-[9px] bg-emerald-600 text-white px-1 rounded">나</span>}
              </div>
            </div>

            <div className={`p-2.5 rounded-lg flex flex-col justify-between text-right transition-all ${
              res.typeKey === 'avoidant'
                ? 'bg-rose-100/90 text-rose-900 border-2 border-rose-400 shadow-sm'
                : 'bg-white/70 text-slate-500 border border-slate-100'
            }`}>
              <span className="text-[9px] font-normal text-slate-500">낮은불안 / 높은회피</span>
              <div className="flex items-center justify-end gap-1">
                {res.typeKey === 'avoidant' && <span className="text-[9px] bg-rose-600 text-white px-1 rounded">나</span>}
                <span>🏰 회피형</span>
              </div>
            </div>

            {/* 내 위치 핑 (X: avoidance, Y: 100 - anxiety) */}
            <div
              className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center animate-pulse z-10"
              style={{
                left: `${Math.min(90, Math.max(10, avoidanceScore))}%`,
                top: `${Math.min(90, Math.max(10, 100 - anxietyScore))}%`,
              }}
              title={`불안도 ${anxietyScore}%, 회피도 ${avoidanceScore}%`}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* 3. 2대 핵심 축 정밀 스펙트럼 (불안 지수 & 회피 지수) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3.5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            애착 2대 핵심 축 분석
          </h3>

          {/* 불안도 바 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">관계 불안도 (버림받을 두려움·확인 욕구)</span>
              <span className="text-rose-600 font-extrabold">{anxietyScore}% ({res.anxietyLevel || (anxietyScore >= 50 ? '민감' : '안정')})</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-400 to-rose-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${anxietyScore}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              {anxietyScore >= 50
                ? '연락 지연이나 사소한 표정 변화에 민감하게 반응할 수 있습니다.'
                : '관계 속에서 비교적 편안한 신뢰와 심리적 여유를 유지합니다.'}
            </p>
          </div>

          {/* 회피도 바 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-800">친밀 회피도 (속마음 개방·독립 성향)</span>
              <span className="text-indigo-600 font-extrabold">{avoidanceScore}% ({res.avoidanceLevel || (avoidanceScore >= 50 ? '신중/방어' : '친밀/개방')})</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-400 to-violet-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${avoidanceScore}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              {avoidanceScore >= 50
                ? '지나친 친밀감이나 의존을 부담스러워하며 혼자만의 동굴을 선호합니다.'
                : '가까운 사람에게 감정을 솔직하게 표현하고 서로 기대는 것을 편안해합니다.'}
            </p>
          </div>
        </div>

        {/* 4. 나의 핵심 행동 특징 (traits) */}
        {res.traits && res.traits.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              나의 주요 관계 행동 패턴
            </h3>
            <div className="space-y-2">
              {res.traits.map((trait, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Check className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{trait}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. 최고의 파트너 케미 & 팁 (partner_tip) */}
        {res.partner_tip && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              최고의 파트너 궁합 & 소통 팁
            </div>
            <p className="text-xs text-indigo-950 leading-relaxed">
              {res.partner_tip}
            </p>
          </div>
        )}

        {/* 6. 성장과 치유 조언 (growth) */}
        {res.growth && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              더 성숙한 사랑을 위한 마음 훈련
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              {res.growth}
            </p>
          </div>
        )}

        {/* 7. 더 행복한 관계를 위한 마음 처방전 (relationship_tip) */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 mb-1.5">
            <MessageCircleHeart className="w-4 h-4 text-rose-600" />
            연애 & 관계 마음 처방전
          </div>
          <p className="text-xs text-rose-900 leading-relaxed font-medium">
            {res.relationship_tip}
          </p>
        </div>

        {/* 8. 4가지 애착 유형 상대 분포 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-purple-600" />
            4대 애착 성향 잠재 분포
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="font-semibold text-slate-700">⚓ 안정형</span>
              <span className="font-bold text-emerald-600">{dist.secure}%</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="font-semibold text-slate-700">🌸 불안형</span>
              <span className="font-bold text-rose-600">{dist.anxious}%</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="font-semibold text-slate-700">🏰 회피형</span>
              <span className="font-bold text-indigo-600">{dist.avoidant}%</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex justify-between items-center">
              <span className="font-semibold text-slate-700">🦊 혼란형</span>
              <span className="font-bold text-amber-600">{dist.fearful}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 3. 에니어그램 렌더링
  const renderEnneagram = (res: EnneagramResult) => {
    const sortedTypes = Object.entries(res.scores)
      .map(([type, score]) => ({ type: Number(type), score }))
      .sort((a, b) => b.score - a.score);

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-purple-600 to-violet-800 text-white rounded-2xl p-5 shadow-md">
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-2">
            에니어그램 나의 주 유형
          </span>
          <h2 className="text-2xl font-black">
            {res.primaryType}번 유형: {res.title}
          </h2>
          <div className="text-xs font-medium text-purple-200 mt-0.5">
            {res.typeName}
          </div>
          <p className="text-xs text-purple-100 mt-2 leading-relaxed">
            {res.desc}
          </p>
        </div>

        {/* 강점과 성장 방향 */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <div className="flex items-center gap-1 text-xs font-bold text-purple-700 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              나의 핵심 강점
            </div>
            <p className="text-xs text-slate-700 leading-snug">
              {res.strength}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 mb-1">
              <Zap className="w-3.5 h-3.5" />
              통합과 성장 조언
            </div>
            <p className="text-xs text-slate-700 leading-snug">
              {res.growth}
            </p>
          </div>
        </div>

        {/* 9개 유형 순위 리스트 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            9개 성격 유형 공감 순위
          </h3>
          <div className="space-y-2">
            {sortedTypes.map((item, idx) => (
              <div key={item.type} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {idx === 0 ? '🏆 ' : ''}{item.type}번 유형
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${idx === 0 ? 'bg-purple-600' : 'bg-slate-300'}`}
                      style={{ width: `${Math.min(100, (item.score / 15) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 4. 번아웃 렌더링
  const renderBurnout = (res: BurnoutResult) => {
    const isBatteryLow = res.batteryPercent < 30;
    const isBatteryMid = res.batteryPercent >= 30 && res.batteryPercent < 70;

    const batteryBg = isBatteryLow
      ? 'from-red-500 to-rose-600'
      : isBatteryMid
      ? 'from-amber-500 to-orange-600'
      : 'from-emerald-500 to-teal-600';

    return (
      <div className="space-y-4">
        {/* 마음 배터리 잔량 카드 */}
        <div className={`bg-gradient-to-br ${batteryBg} text-white rounded-2xl p-5 shadow-md`}>
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-2">
            현재 나의 마음 배터리 잔량
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black">{res.batteryPercent}%</h2>
            <span className="text-sm font-bold text-white/90">
              (번아웃 위험도 {res.burnoutScore}%)
            </span>
          </div>
          <div className="text-base font-bold mt-1 text-white/95">
            상태: {res.title}
          </div>
          <p className="text-xs text-white/90 mt-1 leading-relaxed">
            {res.desc}
          </p>
        </div>

        {/* 3대 영역 방전 지수 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            영역별 고갈 지수
          </h3>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>신체적 방전 (만성 피로/수면)</span>
                <span className="font-bold text-slate-800">{res.dimensionScores.physical}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${res.dimensionScores.physical}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>정신적 고갈 (집중력/의욕)</span>
                <span className="font-bold text-slate-800">{res.dimensionScores.mental}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${res.dimensionScores.mental}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>감정적 탈진 (예민함/무기력)</span>
                <span className="font-bold text-slate-800">{res.dimensionScores.emotional}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${res.dimensionScores.emotional}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 힐링 처방전 */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
            <BatteryMedium className="w-4 h-4 text-emerald-600" />
            긴급 마음 회복 처방전
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed font-medium">
            {res.prescription}
          </p>
        </div>
      </div>
    );
  };

  // 5. DISC 렌더링
  const renderDisc = (res: DiscResult) => {
    const discItems = [
      { key: 'D', label: '주도형 (Dominance)', val: res.scores.D, color: 'bg-red-500', desc: '결단력, 성취 지향' },
      { key: 'I', label: '사교형 (Influence)', val: res.scores.I, color: 'bg-amber-500', desc: '열정, 사람과의 소통' },
      { key: 'S', label: '안정형 (Steadiness)', val: res.scores.S, color: 'bg-emerald-500', desc: '배려, 팀워크, 끈기' },
      { key: 'C', label: '신중형 (Conscientiousness)', val: res.scores.C, color: 'bg-blue-500', desc: '정확성, 논리와 분석' },
    ];

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-2xl p-5 shadow-md">
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-2">
            나의 업무 & 행동 프로필
          </span>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black">{res.styleName}</h2>
            <span className="bg-white/30 text-white text-xs font-black px-2 py-0.5 rounded-md">
              {res.primaryStyle}{res.secondaryStyle}형
            </span>
          </div>
          <p className="text-xs text-cyan-100 mt-2 leading-relaxed">
            {res.desc}
          </p>
        </div>

        {/* 4대 DISC 역량 막대 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            DISC 4대 행동 지수
          </h3>
          {discItems.map((item) => (
            <div key={item.key} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-800">{item.label}</span>
                <span className="text-indigo-600 font-extrabold">{item.val}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 업무 스타일 & 협업 궁합 */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <div className="flex items-center gap-1 text-xs font-bold text-blue-700 mb-1">
              <Award className="w-3.5 h-3.5" />
              업무 스타일
            </div>
            <p className="text-xs text-slate-700 leading-snug">
              {res.work_style}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 mb-1">
              <Users className="w-3.5 h-3.5" />
              최고의 협업 궁합
            </div>
            <p className="text-xs text-slate-700 leading-snug">
              {res.best_chemistry}
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
          <div className="font-bold flex items-center gap-1 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            업무 시 유의사항
          </div>
          {res.warning}
        </div>
      </div>
    );
  };

  // 6. 단일 유형 판별형 공통 렌더러 (이상형 외모/성격, 스트레스 대처, 사회 스타일)
  const renderTypeTest = (res: TypeResult) => {
    const sortedScores = Object.entries(res.typeScores || {}).sort((a, b) => b[1] - a[1]);

    return (
      <div className="space-y-4">
        {/* 주 유형 배너 카드 */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{res.emoji || '✨'}</span>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
              {meta.title}
            </span>
          </div>
          <h2 className="text-2xl font-black">{res.typeName}</h2>
          {res.title && <div className="text-xs font-semibold text-indigo-100 mt-1">"{res.title}"</div>}
          {res.description && (
            <p className="text-xs text-white/95 mt-2.5 leading-relaxed bg-black/10 rounded-xl p-3 border border-white/10">
              {res.description}
            </p>
          )}
        </div>

        {/* 세부 특성 / 강점 */}
        {res.traits && res.traits.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              핵심 특징 및 포인트
            </h3>
            <div className="space-y-2">
              {res.traits.map((trait, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Check className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{trait}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 매칭 궁합 / 매력 포인트 */}
        {(res.attraction_point || res.match) && (
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-4 shadow-xs space-y-2">
            {res.attraction_point && (
              <div>
                <div className="text-xs font-bold text-pink-900 mb-0.5 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-pink-600" /> 핵심 매력 포인트
                </div>
                <p className="text-xs text-pink-950 leading-relaxed">{res.attraction_point}</p>
              </div>
            )}
            {res.match && (
              <div className="pt-2 border-t border-pink-200/60">
                <div className="text-xs font-bold text-rose-900 mb-0.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-rose-600" /> 잘 어울리는 추천 궁합
                </div>
                <p className="text-xs text-rose-950 leading-relaxed font-semibold">{res.match}</p>
              </div>
            )}
          </div>
        )}

        {/* 조언 및 주의점 */}
        {(res.caution || res.recovery_tips) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-xs space-y-2">
            <div className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> 성장을 위한 마음 팁
            </div>
            {res.caution && <p className="text-xs text-amber-950 leading-relaxed">{res.caution}</p>}
            {res.recovery_tips && res.recovery_tips.length > 0 && (
              <ul className="text-xs text-amber-950 list-disc list-inside space-y-1 pt-1">
                {res.recovery_tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 전체 유형별 점수 스펙트럼 */}
        {sortedScores.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              전체 유형 공감 스펙트럼
            </h3>
            {sortedScores.map(([key, val], idx) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{idx === 0 ? '🏆 ' : ''}{key}</span>
                  <span className="text-indigo-600 font-extrabold">{val}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${idx === 0 ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 7. 자존감 진단 렌더러
  const renderSelfEsteem = (res: SelfEsteemResult) => {
    const levelColors = {
      VERY_HIGH: 'from-emerald-600 to-teal-700',
      HIGH: 'from-blue-600 to-indigo-700',
      LOW: 'from-amber-600 to-orange-700',
      VERY_LOW: 'from-rose-600 to-red-700',
    };
    const bg = levelColors[res.levelKey] || 'from-indigo-600 to-purple-700';

    return (
      <div className="space-y-4">
        <div className={`bg-gradient-to-br ${bg} text-white rounded-2xl p-5 shadow-lg relative overflow-hidden`}>
          <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-2">
            로젠버그 척도 기반 자존감 점수
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-black">{res.score}점</h2>
            <span className="text-sm font-bold text-white/90">/ 100점</span>
          </div>
          <div className="text-lg font-bold mt-1 text-white">{res.title}</div>
          <p className="text-xs text-white/90 mt-2 leading-relaxed bg-black/10 rounded-xl p-3">
            {res.description}
          </p>
        </div>

        {/* 강점 */}
        {res.strengths && res.strengths.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> 나의 내면 강점
            </h3>
            <div className="space-y-1.5">
              {res.strengths.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 조언 */}
        {res.advice && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-xs">
            <div className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1">
              <Heart className="w-4 h-4 text-emerald-600" /> 나를 더 사랑하는 마음 연습
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">{res.advice}</p>
          </div>
        )}
      </div>
    );
  };

  // 8. 안전망 Fallback 렌더러
  const renderFallback = () => {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl">
          {meta.emoji || '✨'}
        </div>
        <h2 className="text-lg font-black text-slate-800">{meta.title} 완료</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          검사가 정상적으로 완료되고 결과가 안전하게 저장되었습니다.
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      {/* 상단 액션바 */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onGoHome}
          className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          검사 허브로
        </button>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <CheckCircle className="w-3.5 h-3.5" />
          결과 저장 완료
        </div>
      </div>

      {/* 결과 콘텐츠 본체 */}
      <div className="p-4 space-y-5">
        {result.testId === 'big5' && renderBig5(result as Big5Result)}
        {result.testId === 'attachment' && renderAttachment(result as AttachmentResult)}
        {result.testId === 'enneagram' && renderEnneagram(result as EnneagramResult)}
        {result.testId === 'burnout' && renderBurnout(result as BurnoutResult)}
        {result.testId === 'disc' && renderDisc(result as DiscResult)}
        {['ideal_looks', 'ideal_personality', 'stress_coping', 'social_style'].includes(result.testId) &&
          renderTypeTest(result as TypeResult)}
        {result.testId === 'self_esteem' && renderSelfEsteem(result as SelfEsteemResult)}
        {!['big5', 'attachment', 'enneagram', 'burnout', 'disc', 'ideal_looks', 'ideal_personality', 'stress_coping', 'social_style', 'self_esteem'].includes(result.testId) &&
          renderFallback()}

        {/* 하단 버튼 그룹 */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onRestart}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            이 검사 다시 시작하기
          </button>

          <div className="flex gap-2">
            <button
              onClick={onGoHome}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Home className="w-4 h-4" />
              다른 심리 검사 하러 가기
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              title="결과 공유"
            >
              <Share2 className="w-4 h-4" />
              공유
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
