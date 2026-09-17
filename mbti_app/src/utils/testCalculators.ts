import {
  GenericQuestion,
  Big5Result,
  AttachmentResult,
  EnneagramResult,
  BurnoutResult,
  DiscResult,
  TypeResult,
  SelfEsteemResult,
} from '../types/psychTests';
import big5Data from '../data/tests/big5.json';
import attachmentData from '../data/tests/attachment.json';
import enneagramData from '../data/tests/enneagram.json';
import burnoutData from '../data/tests/burnout.json';
import discData from '../data/tests/disc.json';
import idealLooksData from '../data/tests/ideal_type_looks.json';
import idealPersonalityData from '../data/tests/ideal_type_personality.json';
import selfEsteemData from '../data/tests/self_esteem.json';
import stressCopingData from '../data/tests/stress_coping.json';
import socialStyleData from '../data/tests/social_style.json';

// Big 5 계산기
export function calculateBig5(
  answers: Record<number, number>,
  questions: GenericQuestion[]
): Big5Result {
  const sums: Record<string, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  const counts: Record<string, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };

  const answerValues = questions.map((_, idx) => answers[idx] ?? 3);
  const isAllSame = answerValues.length > 0 && answerValues.every((v) => v === answerValues[0]);
  const isAllMax = isAllSame && answerValues[0] === 5;
  const isAllMin = isAllSame && answerValues[0] === 1;

  questions.forEach((q, idx) => {
    const trait = q.trait || 'O';
    const rawScore = answers[idx] ?? 3;
    const effectiveScore = q.reverse ? (6 - rawScore) : rawScore;
    sums[trait] = (sums[trait] || 0) + effectiveScore;
    counts[trait] = (counts[trait] || 0) + 1;
  });

  const normalize = (val: number, count: number) => {
    const min = count * 1;
    const max = count * 5;
    if (max === min) return 50;
    return Math.round(((val - min) / (max - min)) * 100);
  };

  const scores = {
    O: normalize(sums.O, counts.O || 4),
    C: normalize(sums.C, counts.C || 4),
    E: normalize(sums.E, counts.E || 4),
    A: normalize(sums.A, counts.A || 4),
    N: normalize(sums.N, counts.N || 4),
  };

  const traitEntries = Object.entries(scores) as [keyof typeof scores, number][];
  traitEntries.sort((a, b) => b[1] - a[1]);
  const dominantKey = traitEntries[0][0];
  const traitInfo = (big5Data.traits_info as Record<string, { name: string; desc: string }>)[dominantKey];

  let isInconsistent = false;
  let validityNote: string | undefined = undefined;
  if (isAllMax) {
    isInconsistent = true;
    validityNote = '모든 문항에 동일한 최고점을 선택하셨습니다. 역채점 보정이 적용되었습니다.';
  } else if (isAllMin) {
    isInconsistent = true;
    validityNote = '모든 문항에 동일한 최저점을 선택하셨습니다. 역채점 보정이 적용되었습니다.';
  }

  return {
    testId: 'big5',
    date: new Date().toISOString(),
    scores,
    dominantTrait: traitInfo ? traitInfo.name : dominantKey,
    summary: traitInfo ? traitInfo.desc : '균형 잡힌 성향입니다.',
    isInconsistent,
    validityNote,
  };
}

// 애착 유형 계산기
export function calculateAttachment(
  answers: Record<number, number>,
  questions: GenericQuestion[]
): AttachmentResult {
  let anxSum = 0;
  let anxCount = 0;
  let avdSum = 0;
  let avdCount = 0;

  const validQuestions = questions && questions.length > 0 ? questions : (attachmentData.questions as unknown as GenericQuestion[]);
  const answerValues = validQuestions.map((_, idx) => answers[idx] ?? 3);
  const isAllMax = answerValues.length > 0 && answerValues.every((v) => v === 5);
  const isAllMin = answerValues.length > 0 && answerValues.every((v) => v === 1);

  validQuestions.forEach((q, idx) => {
    const rawScore = answers[idx] ?? 3;
    const effectiveScore = q.reverse ? (6 - rawScore) : rawScore;
    if (q.axis === 'ANX') {
      anxSum += effectiveScore;
      anxCount++;
    } else {
      avdSum += effectiveScore;
      avdCount++;
    }
  });

  const norm = (sum: number, count: number) => {
    const safeCount = Math.max(1, count);
    const min = safeCount * 1;
    const max = safeCount * 5;
    if (max === min) return 50;
    const score = Math.round(((sum - min) / (max - min)) * 100);
    return Math.max(0, Math.min(100, score));
  };

  const anxietyScore = norm(anxSum, anxCount || 8);
  const avoidanceScore = norm(avdSum, avdCount || 8);

  let typeKey: 'secure' | 'anxious' | 'avoidant' | 'fearful' = 'secure';
  let jsonKey = 'SECURE';

  if (anxietyScore < 50 && avoidanceScore < 50) { typeKey = 'secure'; jsonKey = 'SECURE'; }
  else if (anxietyScore >= 50 && avoidanceScore < 50) { typeKey = 'anxious'; jsonKey = 'ANXIOUS'; }
  else if (anxietyScore < 50 && avoidanceScore >= 50) { typeKey = 'avoidant'; jsonKey = 'AVOIDANT'; }
  else { typeKey = 'fearful'; jsonKey = 'FEARFUL'; }

  const typesInfo = (attachmentData.types_info as Record<string, any>) || {};
  const resMeta = typesInfo[jsonKey] || {
    name: '안정형 (Secure)',
    title: '마음의 균형을 잡는 신뢰의 항해사',
    emoji: '⚓',
    description: '자신에 대한 긍정과 타인에 대한 신뢰가 균형을 이루는 가장 건강한 애착 유형입니다.',
    traits: [
      '상대방의 답장이 늦어도 여유 있게 기다려요.',
      '서운한 점이 생기면 감정적으로 폭발하지 않고 솔직하게 대화로 풀어요.',
      '연인 관계에서도 서로의 사생활과 개인 시간을 존중해 줘요.'
    ],
    advice: '현재의 건강한 소통 방식을 유지하세요.',
    growth: '이미 훌륭한 관계 방식을 갖고 있습니다. 파트너의 미숙한 방어기제도 따스하게 감싸안아주세요.',
    partner_tip: '어떤 애착 유형과도 원만하게 어울리며, 파트너에게 심리적 안전감을 선물할 수 있습니다.'
  };

  // 불안 수준 및 회피 수준 판정
  const anxietyLevel = anxietyScore < 35 ? '낮음 (안정)' : anxietyScore <= 65 ? '보통 (민감)' : '높음 (주의)';
  const avoidanceLevel = avoidanceScore < 35 ? '낮음 (친밀)' : avoidanceScore <= 65 ? '보통 (신중)' : '높음 (방어)';

  // 4대 유형 상대적 분포 추정 계산
  const secWeight = Math.max(5, (100 - anxietyScore) * (100 - avoidanceScore) / 100);
  const anxWeight = Math.max(5, anxietyScore * (100 - avoidanceScore) / 100);
  const avdWeight = Math.max(5, (100 - anxietyScore) * avoidanceScore / 100);
  const feaWeight = Math.max(5, anxietyScore * avoidanceScore / 100);
  const totalWeight = secWeight + anxWeight + avdWeight + feaWeight;

  const typeDistribution = {
    secure: Math.round((secWeight / totalWeight) * 100),
    anxious: Math.round((anxWeight / totalWeight) * 100),
    avoidant: Math.round((avdWeight / totalWeight) * 100),
    fearful: Math.round((feaWeight / totalWeight) * 100),
  };

  let validityNote: string | undefined = undefined;
  if (isAllMax) {
    validityNote = '모든 문항에 최고점을 선택하셨으나 역채점 보정이 정밀하게 적용되었습니다.';
  } else if (isAllMin) {
    validityNote = '모든 문항에 최저점을 선택하셨으나 역채점 보정이 정밀하게 적용되었습니다.';
  }

  return {
    testId: 'attachment',
    date: new Date().toISOString(),
    anxietyScore,
    avoidanceScore,
    typeKey,
    typeName: resMeta.name,
    emoji: resMeta.emoji || '💞',
    tagline: resMeta.title,
    desc: resMeta.description,
    relationship_tip: resMeta.advice,
    traits: resMeta.traits || [],
    growth: resMeta.growth || resMeta.advice,
    partner_tip: resMeta.partner_tip || '서로의 공간과 감정을 솔직하게 나눌 수 있는 파트너와 좋은 궁합을 이룹니다.',
    anxietyLevel,
    avoidanceLevel,
    typeDistribution,
    isInconsistent: isAllMax || isAllMin,
    validityNote,
  };
}


// 에니어그램 계산기
export function calculateEnneagram(
  answers: Record<number, number>,
  questions: GenericQuestion[]
): EnneagramResult {
  const typeSums: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) typeSums[i] = 0;

  questions.forEach((q, idx) => {
    const t = (typeof q.type === 'number' ? q.type : 1);
    const score = answers[idx] ?? 3;
    typeSums[t] = (typeSums[t] || 0) + score;
  });

  let topType = 1;
  let topScore = -1;
  for (let i = 1; i <= 9; i++) {
    if (typeSums[i] > topScore) { topScore = typeSums[i]; topType = i; }
  }

  const typeMeta = (enneagramData.types_info as Record<string, any>)[String(topType)] || {
    name: `${topType}번 유형`, title: '탐구자',
    description: '자신만의 방식으로 세상을 살아가는 성향입니다.',
    traits: ['독창성과 깊은 몰입'], advice: '더 넓은 시야로 수용하기',
  };

  return {
    testId: 'enneagram',
    date: new Date().toISOString(),
    scores: typeSums,
    primaryType: topType,
    typeName: typeMeta.name,
    title: typeMeta.title,
    desc: typeMeta.description,
    strength: Array.isArray(typeMeta.traits) ? typeMeta.traits[0] : '깊은 집중력과 통찰',
    growth: typeMeta.advice,
  };
}

// 번아웃 계산기
export function calculateBurnout(
  answers: Record<number, number>,
  questions: GenericQuestion[]
): BurnoutResult {
  const dimSums: Record<string, number> = { physical: 0, mental: 0, emotional: 0 };
  const dimCounts: Record<string, number> = { physical: 0, mental: 0, emotional: 0 };
  let totalScore = 0;

  questions.forEach((q, idx) => {
    let dim = 'physical';
    if (q.dimension === 'mental' || (q as any).domain === 'CYN') dim = 'mental';
    else if (q.dimension === 'emotional' || (q as any).domain === 'EFF') dim = 'emotional';
    const score = answers[idx] ?? 3;
    dimSums[dim] = (dimSums[dim] || 0) + score;
    dimCounts[dim] = (dimCounts[dim] || 0) + 1;
    totalScore += score;
  });

  const totalMin = questions.length * 1;
  const totalMax = questions.length * 5;
  const burnoutScore = Math.round(((totalScore - totalMin) / (totalMax - totalMin)) * 100);
  const batteryPercent = Math.max(0, 100 - burnoutScore);

  let levelKey: 'safe' | 'caution' | 'warning' | 'severe' = 'safe';
  let jsonKey = 'STABLE';
  if (batteryPercent >= 75) { levelKey = 'safe'; jsonKey = 'FULL'; }
  else if (batteryPercent >= 50) { levelKey = 'safe'; jsonKey = 'STABLE'; }
  else if (batteryPercent >= 25) { levelKey = 'caution'; jsonKey = 'WARNING'; }
  else { levelKey = 'severe'; jsonKey = 'DANGER'; }

  const lvlMeta = (burnoutData.levels_info as Record<string, any>)[jsonKey] || {
    title: '배터리 양호 상태', description: '에너지가 잘 유지되고 있습니다.', advice: '적절한 휴식을 이어가세요.',
  };

  const normDim = (dim: string) => {
    const count = dimCounts[dim] || 5;
    return Math.round(((dimSums[dim] - count * 1) / (count * 4)) * 100);
  };

  return {
    testId: 'burnout',
    date: new Date().toISOString(),
    batteryPercent,
    burnoutScore,
    levelKey,
    dimensionScores: { physical: normDim('physical'), mental: normDim('mental'), emotional: normDim('emotional') },
    title: lvlMeta.title,
    desc: lvlMeta.advice,
    prescription: lvlMeta.advice,
  };
}

// DISC 계산기
export function calculateDisc(
  answers: Record<number, number>,
  questions: GenericQuestion[]
): DiscResult {
  const sums: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };
  const counts: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };

  questions.forEach((q, idx) => {
    const style = (q.style || (q as any).type || 'D') as 'D' | 'I' | 'S' | 'C';
    const score = answers[idx] ?? 3;
    sums[style] = (sums[style] || 0) + score;
    counts[style] = (counts[style] || 0) + 1;
  });

  const norm = (s: string) => {
    const cnt = counts[s] || 4;
    return Math.round(((sums[s] - cnt * 1) / (cnt * 4)) * 100);
  };

  const scores = { D: norm('D'), I: norm('I'), S: norm('S'), C: norm('C') };
  const styleKeys: ('D' | 'I' | 'S' | 'C')[] = ['D', 'I', 'S', 'C'];
  styleKeys.sort((a, b) => scores[b] - scores[a]);
  const primaryStyle = styleKeys[0];
  const secondaryStyle = styleKeys[1];

  const styleMeta = (discData.types_info as Record<string, any>)[primaryStyle] || {
    name: '주도형 (Dominance)', description: '목표 달성과 결단력을 중시합니다.',
    style: '신속하고 도전적인 실행', bestOfficeMatch: '안정형 동료와 상호 보완', caution: '타인의 페이스를 배려할 것',
  };

  return {
    testId: 'disc',
    date: new Date().toISOString(),
    scores,
    primaryStyle,
    secondaryStyle,
    styleName: styleMeta.name,
    desc: styleMeta.description,
    work_style: styleMeta.style,
    best_chemistry: styleMeta.bestOfficeMatch,
    warning: styleMeta.caution,
  };
}

// ─── 신규 계산기: 유형 판별형 공통 로직 ─────────────────────────────────────────

function calculateTypeTest(
  answers: Record<number, number>,
  questions: GenericQuestion[],
  typesInfo: Record<string, any>,
  testId: TypeResult['testId']
): TypeResult {
  const typeScores: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};

  questions.forEach((q, idx) => {
    const typeKey = String(q.type || 'A');
    const score = answers[idx] ?? 3;
    typeScores[typeKey] = (typeScores[typeKey] || 0) + score;
    typeCounts[typeKey] = (typeCounts[typeKey] || 0) + 1;
  });

  // 평균 점수로 정규화 (0~100)
  const normalizedScores: Record<string, number> = {};
  for (const key of Object.keys(typeScores)) {
    const cnt = typeCounts[key] || 1;
    normalizedScores[key] = Math.round(((typeScores[key] / cnt) - 1) / 4 * 100);
  }

  // 최고 유형과 두 번째 유형
  const sorted = Object.entries(normalizedScores).sort((a, b) => b[1] - a[1]);
  const dominantType = sorted[0]?.[0] || Object.keys(typesInfo)[0];
  const secondaryType = sorted[1]?.[0];

  const meta = typesInfo[dominantType] || {};

  return {
    testId,
    date: new Date().toISOString(),
    typeScores: normalizedScores,
    dominantType,
    secondaryType,
    typeName: meta.name || dominantType,
    emoji: meta.emoji || '✨',
    title: meta.title || '',
    description: meta.description || '',
    traits: meta.traits,
    caution: meta.caution,
    attraction_point: meta.attraction_point,
    match: meta.match,
    recovery_tips: meta.recovery_tips,
    strengths: meta.strengths,
    blind_spot: meta.blind_spot,
    work_style: meta.work_style,
  };
}

export function calculateIdealLooks(
  answers: Record<number, number>,
  questions: GenericQuestion[]
): TypeResult {
  return calculateTypeTest(answers, questions, (idealLooksData as any).types_info, 'ideal_looks');
}

export function calculateIdealPersonality(
  answers: Record<number, number>,
  questions: GenericQuestion[]
): TypeResult {
  return calculateTypeTest(answers, questions, (idealPersonalityData as any).types_info, 'ideal_personality');
}

export function calculateStressCoping(
  answers: Record<number, number>,
  questions: GenericQuestion[]
): TypeResult {
  return calculateTypeTest(answers, questions, (stressCopingData as any).types_info, 'stress_coping');
}

export function calculateSocialStyle(
  answers: Record<number, number>,
  questions: GenericQuestion[]
): TypeResult {
  return calculateTypeTest(answers, questions, (socialStyleData as any).types_info, 'social_style');
}

// 자존감 계산기 (Rosenberg 척도 기반)
export function calculateSelfEsteem(
  answers: Record<number, number>,
  questions: GenericQuestion[]
): SelfEsteemResult {
  let totalScore = 0;

  questions.forEach((q, idx) => {
    const raw = answers[idx] ?? 3;
    const effective = q.reverse ? (6 - raw) : raw;
    totalScore += effective;
  });

  const totalMin = questions.length * 1;
  const totalMax = questions.length * 5;
  const score = Math.round(((totalScore - totalMin) / (totalMax - totalMin)) * 100);

  let levelKey: SelfEsteemResult['levelKey'] = 'HIGH';
  let jsonKey = 'HIGH';
  if (score >= 76) { levelKey = 'VERY_HIGH'; jsonKey = 'VERY_HIGH'; }
  else if (score >= 51) { levelKey = 'HIGH'; jsonKey = 'HIGH'; }
  else if (score >= 26) { levelKey = 'LOW'; jsonKey = 'LOW'; }
  else { levelKey = 'VERY_LOW'; jsonKey = 'VERY_LOW'; }

  const lvlMeta = (selfEsteemData as any).levels_info[jsonKey] || {
    title: '자존감 진단', description: '자신에 대한 인식을 확인해보세요.',
    strengths: [], advice: '자신을 더 사랑하는 연습을 해보세요.',
  };

  return {
    testId: 'self_esteem',
    date: new Date().toISOString(),
    score,
    levelKey,
    title: lvlMeta.title,
    description: lvlMeta.description,
    strengths: lvlMeta.strengths || [],
    advice: lvlMeta.advice,
  };
}
