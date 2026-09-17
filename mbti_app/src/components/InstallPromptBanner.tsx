import React, { useEffect, useState } from 'react';
import { Download, Check, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPromptBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. 이미 스탠드얼론 PWA로 실행 중인지 확인
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // 2. 안드로이드/브라우저 PWA 설치 가능 이벤트 감지
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 3. 설치 완료 이벤트
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // 이벤트 미지원 브라우저일 때 안내 툴팁
      alert("브라우저 메뉴(⋮ 또는 공유)에서 '홈 화면에 추가' 또는 '앱 설치'를 누르면 스마트폰 앱처럼 설치할 수 있습니다.");
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Install prompt error:', err);
    }
  };

  // 이미 설치되었거나 닫은 경우 표시 안 함
  if (isInstalled || dismissed) {
    return null;
  }

  return (
    <div className="mx-4 mt-3 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-3 rounded-2xl shadow-md border border-indigo-400/30 flex items-center justify-between gap-2.5 animate-fade-in">
      <div className="flex items-center gap-2.5">
        <img
          src="./icon-192.png"
          alt="마음MBTI 로고"
          className="w-10 h-10 rounded-xl shadow-xs border border-white/20 object-cover shrink-0"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs font-black tracking-tight truncate">마음MBTI 앱 설치</span>
            <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">모바일 전용</span>
          </div>
          <p className="text-[10px] text-indigo-200 truncate mt-0.5">
            홈 화면에 추가하여 전체화면 앱으로 즐기세요
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1 bg-white text-indigo-900 hover:bg-indigo-50 px-2.5 py-1.5 rounded-xl text-xs font-black shadow-xs transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-indigo-600" />
          <span>앱 설치</span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-indigo-300 hover:text-white rounded-lg transition-colors"
          title="닫기"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
