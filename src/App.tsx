import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';

import { Controls } from './components/Controls';
import { Summary } from './components/Summary';
import { Chart } from './components/Chart';
import { useCalculator } from './hooks/useCalculator';
import type { CalculatorInputs, CurrencyCode } from './types';

/**
 * 복리 계산기 메인 앱 컴포넌트
 * 손절(Stop-Loss) 로직과 목표 달성 추적 기능을 포함한 고급 계산기
 */
function App() {
  // 계산기 입력값 상태
  const [inputs, setInputs] = useState<CalculatorInputs>({
    seedMoney: 1000,        // 시드머니 1,000 USDT
    dailyReturn: 2,         // 일일 수익률 2%
    stopLossPercent: 5,     // 손절 비율 5%
    stopLossFrequency: 7,   // 7일마다 손절
    totalPeriod: 30,        // 총 30일
    targetGoal: 10000,      // 목표 금액 10,000 USDT
  });

  // 통화 선택 상태
  const [currency, setCurrency] = useState<CurrencyCode>('USDT');

  // 테마 상태 (라이트/다크)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // 컨페티 표시 상태
  const [showConfetti, setShowConfetti] = useState(false);
  
  // 이전 목표 달성 상태 (컨페티 트리거용)
  const [wasGoalAchieved, setWasGoalAchieved] = useState(false);

  // 윈도우 크기 (컨페티용)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 계산 결과 가져오기
  const result = useCalculator(inputs);

  // 윈도우 리사이즈 핸들러
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 테마 적용 (HTML, Body에 클래스 토글)
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.toggle('theme-light', theme === 'light');
    body.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  // 목표 달성 시 컨페티 효과 트리거
  useEffect(() => {
    // 목표가 새로 달성되었을 때만 컨페티 표시
    if (result.isGoalAchieved && !wasGoalAchieved) {
      setShowConfetti(true);
      // 5초 후 컨페티 숨기기
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
    setWasGoalAchieved(result.isGoalAchieved);
  }, [result.isGoalAchieved, wasGoalAchieved]);

  // 입력값 업데이트 핸들러
  const handleInputChange = (key: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 통화 라벨
  const currencyLabel =
    currency === 'KRW' ? 'KRW' : currency === 'EUR' ? 'EUR' : 'USDT';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <BackgroundDecorations />

      {/* 목표 달성 시 컨페티 효과 */}
      <AnimatePresence>
        {showConfetti && (
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
            colors={['#fbbf24', '#f59e0b', '#10b981', '#6366f1', '#ec4899']}
          />
        )}
      </AnimatePresence>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* 상단 우측 액션 (테마 전환) */}
        <div className="flex justify-end mb-4">
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          />
        </div>

        {/* 헤더 */}
        <Header />

        {/* 메인 레이아웃 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* 좌측: 입력 컨트롤 패널 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <Controls
              inputs={inputs}
              onChange={handleInputChange}
              currency={currency}
              currencyLabel={currencyLabel}
              onCurrencyChange={setCurrency}
            />
          </motion.div>

          {/* 우측: 결과 표시 영역 */}
          <div className="lg:col-span-8 space-y-6">
            {/* 서머리 카드 + 진행률 바 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Summary
                result={result}
                seedMoney={inputs.seedMoney}
                targetGoal={inputs.targetGoal}
                currencyLabel={currencyLabel}
              />
            </motion.div>

            {/* 차트 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Chart
                data={result.dailyData}
                targetGoal={inputs.targetGoal}
                goalAchievedDay={result.goalAchievedDay}
                currencyLabel={currencyLabel}
              />
            </motion.div>
          </div>
        </div>

        {/* 푸터 */}
        <Footer />
      </div>
    </div>
  );
}

/**
 * 배경 장식 컴포넌트
 * 글라스모피즘 효과를 위한 블러 원형들
 */
function BackgroundDecorations() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 좌상단 원형 */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* 우하단 원형 */}
      <div
        className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* 중앙 원형 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
    </div>
  );
}

/**
 * 헤더 컴포넌트
 */
function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="inline-flex items-center gap-3 mb-4">
        {/* 로고 아이콘 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
        >
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </motion.div>
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            복리 계산기
          </h1>
          <p className="text-sm text-slate-400">
            Compound Interest Calculator
          </p>
        </div>
      </div>
      <p className="text-slate-400 max-w-2xl mx-auto">
        손절(Stop-Loss) 전략과 목표 금액 추적 기능이 포함된 고급 복리 수익 시뮬레이터
      </p>
    </motion.header>
  );
}

/**
 * 푸터 컴포넌트
 */
function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="mt-12 text-center text-slate-500 text-sm"
    >
      <p>
        ⚠️ 본 계산기는 교육 목적으로 제작되었습니다. 실제 투자 결과와 다를 수 있습니다.
      </p>
      <p className="mt-2">
        Built with React, TypeScript, Tailwind CSS & Framer Motion
      </p>
    </motion.footer>
  );
}

/**
 * 테마 토글 버튼 (라이트 / 다크)
 */
function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: 'dark' | 'light';
  onToggle: () => void;
}) {
  const isLight = theme === 'light';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className="glass-card px-4 py-2 flex items-center gap-2 border border-white/10 text-sm text-white"
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isLight
            ? 'bg-amber-400/20 text-amber-400'
            : 'bg-indigo-500/20 text-indigo-300'
        }`}
      >
        {isLight ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95l-1.414 1.414M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            />
          </svg>
        )}
      </div>
      <div className="text-left">
        <p className="text-xs text-slate-400">테마</p>
        <p className="text-sm font-semibold">{isLight ? '라이트 모드' : '다크 모드'}</p>
      </div>
    </motion.button>
  );
}

export default App;
