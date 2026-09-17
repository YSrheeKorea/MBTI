import { AnyPsychResult, TestId } from '../types/psychTests';

const STORAGE_PREFIX = 'mindlab_result_';

export function savePsychResult(result: AnyPsychResult): void {
  try {
    const key = `${STORAGE_PREFIX}${result.testId}`;
    const list = getPsychHistory(result.testId);
    const updated = [result, ...list].slice(0, 10);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save psych result:', e);
  }
}

export function getPsychHistory(testId: TestId): AnyPsychResult[] {
  try {
    const key = `${STORAGE_PREFIX}${testId}`;
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data) as AnyPsychResult[];
  } catch (e) {
    console.error('Failed to read psych history:', e);
    return [];
  }
}

export function getLatestPsychResult(testId: TestId): AnyPsychResult | null {
  const list = getPsychHistory(testId);
  return list.length > 0 ? list[0] : null;
}

export function getAllSavedTestCounts(): Record<TestId, number> {
  const tests: TestId[] = [
    'mbti', 'big5', 'attachment', 'enneagram', 'burnout', 'disc',
    'ideal_looks', 'ideal_personality', 'self_esteem', 'stress_coping', 'social_style',
  ];
  const counts: Record<TestId, number> = {
    mbti: 0,
    big5: 0,
    attachment: 0,
    enneagram: 0,
    burnout: 0,
    disc: 0,
    ideal_looks: 0,
    ideal_personality: 0,
    self_esteem: 0,
    stress_coping: 0,
    social_style: 0,
  };

  try {
    const mbtiData = localStorage.getItem('MIND_MBTI_HISTORY_V1');
    if (mbtiData) {
      counts.mbti = JSON.parse(mbtiData).length || 0;
    }
    tests.forEach((t) => {
      if (t !== 'mbti') {
        const d = localStorage.getItem(`${STORAGE_PREFIX}${t}`);
        if (d) counts[t] = JSON.parse(d).length || 0;
      }
    });
  } catch (e) {
    // ignore
  }

  return counts;
}
