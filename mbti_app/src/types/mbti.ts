export type Dimension = 'EI' | 'SN' | 'TF' | 'JP';
export type PreferenceType = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface Question {
  number: number;
  dimension: Dimension;
  type: PreferenceType;
  reverse: boolean;
  category?: string;
  text: string;
}

export interface MBTIMatch {
  name: string;
  desc: string;
}

export interface MBTITypeDetail {
  name: string;
  nickname: string;
  emoji: string;
  subBadge: string;
  keyword: string;
  keywords: string[];
  description: string;
  traits: string[];
  workStyle: string;
  stressFactor: string;
  strengths: string;
  cautions: string;
  growthTip: string;
  bestMatch: MBTIMatch;
  worstMatch: MBTIMatch;
}

export interface Scores {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

export interface DimensionRatio {
  r1: number;
  r2: number;
}

export interface TestResult {
  id: string;
  timestamp: string;
  mbti: string;
  mode: 100 | 12;
  scores: Scores;
  ratios: {
    EI: DimensionRatio;
    SN: DimensionRatio;
    TF: DimensionRatio;
    JP: DimensionRatio;
  };
}

export interface ComparisonDiff {
  prevResult: TestResult;
  currentResult: TestResult;
  mbtiChanged: boolean;
  diffs: {
    EI: { key: string; change: number; text: string };
    SN: { key: string; change: number; text: string };
    TF: { key: string; change: number; text: string };
    JP: { key: string; change: number; text: string };
  };
}
