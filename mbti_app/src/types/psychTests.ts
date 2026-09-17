export type TestId = 
  | 'mbti' | 'big5' | 'attachment' | 'enneagram' | 'burnout' | 'disc'
  | 'ideal_looks' | 'ideal_personality' | 'self_esteem' | 'stress_coping' | 'social_style';

export interface TestMeta {
  id: TestId;
  title: string;
  subtitle: string;
  badge: string;
  duration: string;
  questionCount: number;
  emoji: string;
  gradient: string;
  description: string;
}

export interface GenericQuestion {
  number: number;
  text: string;
  category?: string;
  trait?: string;      // for Big 5 (O, C, E, A, N)
  axis?: string;       // for Attachment (ANX, AVD)
  type?: number | string; // for Enneagram (1..9) | for categorical tests
  dimension?: string;  // for Burnout (physical, mental, emotional)
  style?: string;      // for DISC (D, I, S, C)
  domain?: string;     // for Burnout domain / self-esteem domain
  reverse?: boolean;   // 역채점 문항 여부 (6 - score)
}

export interface Big5Result {
  testId: 'big5';
  date: string;
  scores: {
    O: number; // 0~100
    C: number;
    E: number;
    A: number;
    N: number;
  };
  dominantTrait: string;
  summary: string;
  isInconsistent?: boolean;
  validityNote?: string;
}

export interface AttachmentResult {
  testId: 'attachment';
  date: string;
  anxietyScore: number; // 0~100
  avoidanceScore: number; // 0~100
  typeKey: 'secure' | 'anxious' | 'avoidant' | 'fearful';
  typeName: string;
  emoji?: string;
  tagline: string;
  desc: string;
  relationship_tip: string;
  traits?: string[];
  partner_tip?: string;
  growth?: string;
  anxietyLevel?: string;
  avoidanceLevel?: string;
  typeDistribution?: Record<'secure' | 'anxious' | 'avoidant' | 'fearful', number>;
  isInconsistent?: boolean;
  validityNote?: string;
}

export interface EnneagramResult {
  testId: 'enneagram';
  date: string;
  scores: Record<number, number>; // 1~9: 점수
  primaryType: number;
  typeName: string;
  title: string;
  desc: string;
  strength: string;
  growth: string;
}

export interface BurnoutResult {
  testId: 'burnout';
  date: string;
  batteryPercent: number; // 잔여 배터리 (100 - burnout%)
  burnoutScore: number;   // 0~100
  levelKey: 'safe' | 'caution' | 'warning' | 'severe';
  dimensionScores: {
    physical: number;
    mental: number;
    emotional: number;
  };
  title: string;
  desc: string;
  prescription: string;
}

export interface DiscResult {
  testId: 'disc';
  date: string;
  scores: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  primaryStyle: 'D' | 'I' | 'S' | 'C';
  secondaryStyle: 'D' | 'I' | 'S' | 'C';
  styleName: string;
  desc: string;
  work_style: string;
  best_chemistry: string;
  warning: string;
}

// 신규: 단일 유형 판별 공통 결과 (이상형·스트레스·사회스타일)
export interface TypeResult {
  testId: 'ideal_looks' | 'ideal_personality' | 'stress_coping' | 'social_style';
  date: string;
  typeScores: Record<string, number>; // 각 유형별 점수
  dominantType: string;               // 가장 높은 유형 키
  secondaryType?: string;             // 두 번째 유형
  typeName: string;
  emoji: string;
  title: string;
  description: string;
  traits?: string[];
  caution?: string;
  advice?: string;
  attraction_point?: string;
  match?: string;
  recovery_tips?: string[];
  strengths?: string[];
  blind_spot?: string;
  work_style?: string;
  [key: string]: unknown;
}

// 신규: 자존감 결과
export interface SelfEsteemResult {
  testId: 'self_esteem';
  date: string;
  score: number;          // 0~100
  levelKey: 'VERY_HIGH' | 'HIGH' | 'LOW' | 'VERY_LOW';
  title: string;
  description: string;
  strengths: string[];
  advice: string;
}

export type AnyPsychResult = 
  | Big5Result | AttachmentResult | EnneagramResult | BurnoutResult | DiscResult
  | TypeResult | SelfEsteemResult;
