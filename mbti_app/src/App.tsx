import { useState, useRef, useEffect } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { TestHubScreen, TEST_CATALOG } from './components/TestHubScreen';
import { IntroScreen } from './components/IntroScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultScreen } from './components/ResultScreen';
import { ComparisonModal } from './components/ComparisonModal';
import { GenericTestScreen } from './components/GenericTestScreen';
import { GenericResultScreen } from './components/GenericResultScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { MindDashboard } from './components/MindDashboard';

import { Question, TestResult, Scores } from './types/mbti';
import {
  TestId,
  TestMeta,
  GenericQuestion,
  AnyPsychResult,
} from './types/psychTests';

import { getHistoryList, saveResultToHistory, deleteHistoryItem } from './utils/storage';
import {
  savePsychResult,
  getLatestPsychResult,
} from './utils/psychStorage';
import {
  calculateBig5,
  calculateAttachment,
  calculateEnneagram,
  calculateBurnout,
  calculateDisc,
  calculateIdealLooks,
  calculateIdealPersonality,
  calculateSelfEsteem,
  calculateStressCoping,
  calculateSocialStyle,
} from './utils/testCalculators';

// 데이터 파일 임포트
import questionsRaw from './data/questions.json';
import big5Raw from './data/tests/big5.json';
import attachmentRaw from './data/tests/attachment.json';
import enneagramRaw from './data/tests/enneagram.json';
import burnoutRaw from './data/tests/burnout.json';
import discRaw from './data/tests/disc.json';
import idealLooksRaw from './data/tests/ideal_type_looks.json';
import idealPersonalityRaw from './data/tests/ideal_type_personality.json';
import selfEsteemRaw from './data/tests/self_esteem.json';
import stressCopingRaw from './data/tests/stress_coping.json';
import socialStyleRaw from './data/tests/social_style.json';

const ALL_MBTI_QUESTIONS = questionsRaw as unknown as Question[];

type ScreenState =
  | 'hub'
  | 'mbti-intro'
  | 'mbti-question'
  | 'mbti-loading'
  | 'mbti-result'
  | 'generic-question'
  | 'generic-loading'
  | 'generic-result'
  | 'history'
  | 'dashboard';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('hub');

  // MBTI 상태
  const [testMode, setTestMode] = useState<100 | 12>(100);
  const [activeMbtiQuestions, setActiveMbtiQuestions] = useState<Question[]>([]);
  const [mbtiIndex, setMbtiIndex] = useState<number>(0);
  const [mbtiAnswers, setMbtiAnswers] = useState<Record<number, number>>({});
  const [currentMbtiResult, setCurrentMbtiResult] = useState<TestResult | null>(null);
  const [historyList, setHistoryList] = useState<TestResult[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // 5대 심리 검사 공통 상태
  const [activeTestId, setActiveTestId] = useState<TestId>('big5');
  const [genericQuestions, setGenericQuestions] = useState<GenericQuestion[]>([]);
  const [genericIndex, setGenericIndex] = useState<number>(0);
  const [genericAnswers, setGenericAnswers] = useState<Record<number, number>>({});
  const [currentGenericResult, setCurrentGenericResult] = useState<AnyPsychResult | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 초기 이력 로드
  useEffect(() => {
    setHistoryList(getHistoryList());
  }, []);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // --- 네비게이션 핸들러 ---
  const handleSelectTestFromHub = (testId: TestId) => {
    if (testId === 'mbti') {
      setCurrentScreen('mbti-intro');
      scrollToTop();
      return;
    }

    setActiveTestId(testId);
    let qs: GenericQuestion[] = [];
    if (testId === 'big5') qs = (big5Raw.questions as unknown) as GenericQuestion[];
    else if (testId === 'attachment') qs = (attachmentRaw.questions as unknown) as GenericQuestion[];
    else if (testId === 'enneagram') qs = (enneagramRaw.questions as unknown) as GenericQuestion[];
    else if (testId === 'burnout') qs = (burnoutRaw.questions as unknown) as GenericQuestion[];
    else if (testId === 'disc') qs = (discRaw.questions as unknown) as GenericQuestion[];
    else if (testId === 'ideal_looks') qs = (idealLooksRaw.questions as unknown) as GenericQuestion[];
    else if (testId === 'ideal_personality') qs = (idealPersonalityRaw.questions as unknown) as GenericQuestion[];
    else if (testId === 'self_esteem') qs = (selfEsteemRaw.questions as unknown) as GenericQuestion[];
    else if (testId === 'stress_coping') qs = (stressCopingRaw.questions as unknown) as GenericQuestion[];
    else if (testId === 'social_style') qs = (socialStyleRaw.questions as unknown) as GenericQuestion[];

    setGenericQuestions(qs);
    setGenericIndex(0);
    setGenericAnswers({});
    setCurrentScreen('generic-question');
    scrollToTop();
  };

  const handleOpenLatestGenericResult = (testId: TestId) => {
    const latest = getLatestPsychResult(testId);
    if (latest) {
      setActiveTestId(testId);
      setCurrentGenericResult(latest);
      setCurrentScreen('generic-result');
      scrollToTop();
    } else {
      showToast('아직 저장된 검사 결과가 없습니다.');
    }
  };

  const handleGoHome = () => {
    setCurrentScreen('hub');
    scrollToTop();
  };

  // --- MBTI 로직 ---
  const handleStartMbti = () => {
    if (testMode === 12) {
      const speedSet = [
        ALL_MBTI_QUESTIONS[0], ALL_MBTI_QUESTIONS[4], ALL_MBTI_QUESTIONS[16],
        ALL_MBTI_QUESTIONS[25], ALL_MBTI_QUESTIONS[27], ALL_MBTI_QUESTIONS[38],
        ALL_MBTI_QUESTIONS[50], ALL_MBTI_QUESTIONS[51], ALL_MBTI_QUESTIONS[63],
        ALL_MBTI_QUESTIONS[75], ALL_MBTI_QUESTIONS[76], ALL_MBTI_QUESTIONS[89]
      ];
      setActiveMbtiQuestions(speedSet);
    } else {
      setActiveMbtiQuestions(ALL_MBTI_QUESTIONS);
    }

    setMbtiIndex(0);
    setMbtiAnswers({});
    setCurrentScreen('mbti-question');
    scrollToTop();
  };

  const handleSelectMbtiAnswer = (scoreVal: number) => {
    setMbtiAnswers((prev) => ({
      ...prev,
      [mbtiIndex]: scoreVal,
    }));

    setTimeout(() => {
      if (mbtiIndex < activeMbtiQuestions.length - 1) {
        setMbtiIndex((prev) => prev + 1);
        scrollToTop();
      } else {
        setCurrentScreen('mbti-loading');
        scrollToTop();
      }
    }, 300);
  };

  const handlePrevMbtiQuestion = () => {
    if (mbtiIndex > 0) {
      setMbtiIndex((prev) => prev - 1);
      scrollToTop();
    } else {
      setCurrentScreen('mbti-intro');
      scrollToTop();
    }
  };

  const handleMbtiLoadingComplete = () => {
    const scores: Scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    activeMbtiQuestions.forEach((q, idx) => {
      const ans = mbtiAnswers[idx] || 3;
      const [type1, type2] = q.dimension.split('') as [keyof Scores, keyof Scores];

      if (ans === 1) scores[type1] += 2;
      else if (ans === 2) scores[type1] += 1;
      else if (ans === 4) scores[type2] += 1;
      else if (ans === 5) scores[type2] += 2;
    });

    const mbti = [
      scores.E >= scores.I ? 'E' : 'I',
      scores.S >= scores.N ? 'S' : 'N',
      scores.T >= scores.F ? 'T' : 'F',
      scores.J >= scores.P ? 'J' : 'P',
    ].join('');

    const calcRatio = (s1: number, s2: number) => {
      const tot = s1 + s2;
      if (tot === 0) return { r1: 50, r2: 50 };
      const r1 = Math.round((s1 / tot) * 100);
      return { r1, r2: 100 - r1 };
    };

    const ratios = {
      EI: calcRatio(scores.E, scores.I),
      SN: calcRatio(scores.S, scores.N),
      TF: calcRatio(scores.T, scores.F),
      JP: calcRatio(scores.J, scores.P),
    };

    const newResult: TestResult = {
      id: String(Date.now()),
      timestamp: new Date().toISOString(),
      mbti,
      scores,
      mode: testMode,
      ratios,
    };

    saveResultToHistory(newResult);
    setHistoryList(getHistoryList());
    setCurrentMbtiResult(newResult);
    setCurrentScreen('mbti-result');
    scrollToTop();
  };

  // --- 5대 검사 로직 ---
  const handleSelectGenericAnswer = (scoreVal: number) => {
    setGenericAnswers((prev) => ({
      ...prev,
      [genericIndex]: scoreVal,
    }));

    setTimeout(() => {
      if (genericIndex < genericQuestions.length - 1) {
        setGenericIndex((prev) => prev + 1);
        scrollToTop();
      } else {
        setCurrentScreen('generic-loading');
        scrollToTop();
      }
    }, 300);
  };

  const handlePrevGenericQuestion = () => {
    if (genericIndex > 0) {
      setGenericIndex((prev) => prev - 1);
      scrollToTop();
    } else {
      setCurrentScreen('hub');
      scrollToTop();
    }
  };

  const handleGenericLoadingComplete = () => {
    let resultObj: AnyPsychResult;

    if (activeTestId === 'big5') {
      resultObj = calculateBig5(genericAnswers, genericQuestions);
    } else if (activeTestId === 'attachment') {
      resultObj = calculateAttachment(genericAnswers, genericQuestions);
    } else if (activeTestId === 'enneagram') {
      resultObj = calculateEnneagram(genericAnswers, genericQuestions);
    } else if (activeTestId === 'burnout') {
      resultObj = calculateBurnout(genericAnswers, genericQuestions);
    } else if (activeTestId === 'disc') {
      resultObj = calculateDisc(genericAnswers, genericQuestions);
    } else if (activeTestId === 'ideal_looks') {
      resultObj = calculateIdealLooks(genericAnswers, genericQuestions);
    } else if (activeTestId === 'ideal_personality') {
      resultObj = calculateIdealPersonality(genericAnswers, genericQuestions);
    } else if (activeTestId === 'self_esteem') {
      resultObj = calculateSelfEsteem(genericAnswers, genericQuestions);
    } else if (activeTestId === 'stress_coping') {
      resultObj = calculateStressCoping(genericAnswers, genericQuestions);
    } else {
      resultObj = calculateSocialStyle(genericAnswers, genericQuestions);
    }

    savePsychResult(resultObj);
    setCurrentGenericResult(resultObj);
    setCurrentScreen('generic-result');
    scrollToTop();
  };

  // 활성 검사 메타데이터
  const activeMeta: TestMeta =
    TEST_CATALOG.find((t) => t.id === activeTestId) || TEST_CATALOG[0];

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-900 overflow-hidden font-sans">
      <MobileFrame scrollRef={scrollRef}>
        {/* 1. 홈: 6대 검사 허브 대시보드 */}
        {currentScreen === 'hub' && (
          <TestHubScreen
            onSelectTest={handleSelectTestFromHub}
            onOpenMbtiHistory={() => {
              if (historyList.length > 0) {
                setCurrentMbtiResult(historyList[0]);
                setCurrentScreen('mbti-result');
                scrollToTop();
              } else {
                showToast('아직 진행한 MBTI 검사 결과가 없습니다.');
              }
            }}
            onOpenTestResult={handleOpenLatestGenericResult}
            onOpenHistory={() => { setCurrentScreen('history'); scrollToTop(); }}
            onOpenDashboard={() => { setCurrentScreen('dashboard'); scrollToTop(); }}
          />
        )}

        {/* 2. MBTI 인트로 */}
        {currentScreen === 'mbti-intro' && (
          <IntroScreen
            mode={testMode}
            setMode={setTestMode}
            onStart={handleStartMbti}
            onGoHome={handleGoHome}
          />
        )}

        {/* 3. MBTI 질문 */}
        {currentScreen === 'mbti-question' && activeMbtiQuestions.length > 0 && (
          <QuestionScreen
            question={activeMbtiQuestions[mbtiIndex]}
            currentIndex={mbtiIndex}
            totalQuestions={activeMbtiQuestions.length}
            currentAnswer={mbtiAnswers[mbtiIndex]}
            onSelectAnswer={handleSelectMbtiAnswer}
            onPrev={handlePrevMbtiQuestion}
            onNext={() => {
              if (mbtiIndex < activeMbtiQuestions.length - 1) {
                setMbtiIndex((prev) => prev + 1);
                scrollToTop();
              }
            }}
            onGoHome={handleGoHome}
          />
        )}

        {/* 4. MBTI 로딩 */}
        {currentScreen === 'mbti-loading' && (
          <LoadingScreen onComplete={handleMbtiLoadingComplete} testId="mbti" />
        )}

        {/* 5. MBTI 결과 */}
        {currentScreen === 'mbti-result' && currentMbtiResult && (
          <ResultScreen
            result={currentMbtiResult}
            historyList={historyList}
            onOpenCompare={() => setIsCompareOpen(true)}
            onRestart={handleStartMbti}
            showToast={showToast}
            onGoHome={handleGoHome}
          />
        )}

        {/* 6. 5대 검사 질문 */}
        {currentScreen === 'generic-question' && genericQuestions.length > 0 && (
          <GenericTestScreen
            meta={activeMeta}
            questions={genericQuestions}
            currentIndex={genericIndex}
            answers={genericAnswers}
            onSelectAnswer={handleSelectGenericAnswer}
            onPrev={handlePrevGenericQuestion}
            onGoHome={handleGoHome}
          />
        )}

        {/* 7. 5대 검사 분석 로딩 */}
        {currentScreen === 'generic-loading' && (
          <LoadingScreen onComplete={handleGenericLoadingComplete} testId={activeTestId} />
        )}

        {/* 8. 심리 검사 맞춤형 결과 */}
        {currentScreen === 'generic-result' && (
          currentGenericResult ? (
            <GenericResultScreen
              meta={activeMeta}
              result={currentGenericResult}
              onRestart={() => handleSelectTestFromHub(activeTestId)}
              onGoHome={handleGoHome}
              onShowToast={showToast}
            />
          ) : (
            <div className="p-8 text-center text-slate-800 space-y-4 flex flex-col items-center justify-center min-h-[60vh]">
              <p className="text-sm font-bold">결과 데이터를 불러오는 중입니다...</p>
              <button
                onClick={handleGoHome}
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                검사 허브로 이동
              </button>
            </div>
          )
        )}

        {/* 9. 검사 기록 보관함 */}
        {currentScreen === 'history' && (
          <HistoryScreen
            onGoHome={handleGoHome}
            onRerunTest={(testId) => {
              handleGoHome();
              if (testId === 'mbti') {
                setCurrentScreen('mbti-intro');
              } else {
                handleSelectTestFromHub(testId as TestId);
              }
            }}
          />
        )}

        {/* 10. 종합 마음 대시보드 */}
        {currentScreen === 'dashboard' && (
          <MindDashboard
            onGoHome={handleGoHome}
            onRerunTest={(testId) => {
              handleGoHome();
              if (testId === 'mbti') {
                setCurrentScreen('mbti-intro');
              } else {
                handleSelectTestFromHub(testId as TestId);
              }
            }}
          />
        )}

        {/* MBTI 과거 비교 모달 */}
        {isCompareOpen && currentMbtiResult && (
          <ComparisonModal
            currentResult={currentMbtiResult}
            historyList={historyList}
            onClose={() => setIsCompareOpen(false)}
            onDeleteHistory={(id) => {
              deleteHistoryItem(id);
              const updated = getHistoryList();
              setHistoryList(updated);
              if (currentMbtiResult?.id === id) {
                if (updated.length > 0) setCurrentMbtiResult(updated[0]);
                else setCurrentScreen('mbti-intro');
              }
              showToast('기록이 삭제되었습니다.');
            }}
          />
        )}

        {/* 토스트 팝업 */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2.5 rounded-full shadow-lg backdrop-blur flex items-center gap-1.5 transition-all">
            <span>{toastMessage}</span>
          </div>
        )}
      </MobileFrame>
    </div>
  );
}
export default App;
