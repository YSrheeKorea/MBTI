import { TestResult, ComparisonDiff } from '../types/mbti';

const STORAGE_KEY = 'MIND_MBTI_HISTORY_V1';

export function getHistoryList(): TestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.error('Failed to load history:', e);
    return [];
  }
}

export function saveResultToHistory(result: TestResult): TestResult[] {
  try {
    const current = getHistoryList();
    // 중복 방지 (같은 id가 있으면 갱신, 아니면 맨 앞 추가)
    const filtered = current.filter((item) => item.id !== result.id);
    const updated = [result, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save history:', e);
    return [];
  }
}

export function deleteHistoryItem(id: string): TestResult[] {
  try {
    const current = getHistoryList();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete history item:', e);
    return [];
  }
}

export function compareTwoResults(current: TestResult, prev: TestResult): ComparisonDiff {
  const calcDim = (
    key1: string,
    key2: string,
    currR1: number,
    prevR1: number
  ) => {
    const delta = currR1 - prevR1;
    let text = '';
    if (delta > 0) {
      text = `${key1} 성향이 ${delta}%p 증가했습니다!`;
    } else if (delta < 0) {
      text = `${key2} 성향이 ${Math.abs(delta)}%p 증가했습니다!`;
    } else {
      text = '이전 결과와 동일한 비율을 유지하고 있습니다.';
    }
    return { key: `${key1}/${key2}`, change: delta, text };
  };

  return {
    prevResult: prev,
    currentResult: current,
    mbtiChanged: current.mbti !== prev.mbti,
    diffs: {
      EI: calcDim('E', 'I', current.ratios.EI.r1, prev.ratios.EI.r1),
      SN: calcDim('S', 'N', current.ratios.SN.r1, prev.ratios.SN.r1),
      TF: calcDim('T', 'F', current.ratios.TF.r1, prev.ratios.TF.r1),
      JP: calcDim('J', 'P', current.ratios.JP.r1, prev.ratios.JP.r1),
    },
  };
}
