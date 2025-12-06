import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { CalculationResult } from '../types';
import { formatNumber, formatCompactNumber } from '../hooks/useCalculator';

/**
 * Summary 컴포넌트 Props 인터페이스
 */
interface SummaryProps {
  result: CalculationResult;
  seedMoney: number;
  targetGoal: number;
  currencyLabel: string;
}

/**
 * 서머리 컴포넌트
 * 계산 결과를 카드 형태로 표시하고, 목표 달성 진행률 바를 포함
 */
export function Summary({ result, seedMoney, targetGoal, currencyLabel }: SummaryProps) {
  const {
    finalBalance,
    totalReturn,
    totalProfit,
    goalProgress,
    isGoalAchieved,
    goalAchievedDay,
    stopLossCount,
    maxDrawdown,
  } = result;

  return (
    <div className="space-y-6">
      {/* 목표 달성 진행률 바 */}
      {targetGoal > 0 && (
        <GoalProgressBar
          progress={goalProgress}
          isAchieved={isGoalAchieved}
          achievedDay={goalAchievedDay}
          targetGoal={targetGoal}
          currentBalance={finalBalance}
          currencyLabel={currencyLabel}
        />
      )}

      {/* 서머리 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 최종 잔고 */}
        <SummaryCard
          label="최종 잔고"
          value={`${formatCompactNumber(finalBalance)} ${currencyLabel}`}
          subValue={`${formatNumber(finalBalance)} ${currencyLabel}`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color={isGoalAchieved ? 'gold' : 'primary'}
          animate={isGoalAchieved}
        />

        {/* 총 수익률 */}
        <SummaryCard
          label="총 수익률"
          value={`${totalReturn >= 0 ? '+' : ''}${formatNumber(totalReturn)}%`}
          subValue={`시드머니 ${formatNumber(seedMoney)} ${currencyLabel}`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          color={totalReturn >= 0 ? 'success' : 'danger'}
          trend={totalReturn >= 0 ? 'up' : 'down'}
        />

        {/* 총 수익금 */}
        <SummaryCard
          label="총 수익금"
          value={`${totalProfit >= 0 ? '+' : ''}${formatCompactNumber(totalProfit)} ${currencyLabel}`}
          subValue={`${formatNumber(totalProfit)} ${currencyLabel}`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color={totalProfit >= 0 ? 'success' : 'danger'}
        />

        {/* 손절 & 최대 낙폭 */}
        <SummaryCard
          label="손절 / 최대 낙폭"
          value={`${stopLossCount}회`}
          subValue={`MDD ${formatNumber(maxDrawdown)}%`}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          color={maxDrawdown > 20 ? 'danger' : maxDrawdown > 10 ? 'warning' : 'primary'}
        />
      </div>
    </div>
  );
}

/**
 * 목표 달성 진행률 바 컴포넌트
 * 애니메이션과 색상 변화를 포함한 프로그레스 바
 */
interface GoalProgressBarProps {
  progress: number;
  isAchieved: boolean;
  achievedDay: number | null;
  targetGoal: number;
  currentBalance: number;
  currencyLabel: string;
}

function GoalProgressBar({
  progress,
  isAchieved,
  achievedDay,
  targetGoal,
  currentBalance,
  currencyLabel,
}: GoalProgressBarProps) {
  // 애니메이션을 위한 상태
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // 진행률 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(Math.min(progress, 100)); // 최대 100%까지만 바에 표시
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  // 진행률에 따른 색상 결정
  const getProgressColor = () => {
    if (progress >= 100) return 'from-amber-400 via-yellow-400 to-amber-500'; // 금색 (달성)
    if (progress >= 50) return 'from-blue-400 via-indigo-500 to-blue-600'; // 파랑 (50-99%)
    return 'from-orange-400 via-amber-500 to-yellow-500'; // 주황/노랑 (<50%)
  };

  // 진행률에 따른 글로우 색상
  const getGlowColor = () => {
    if (progress >= 100) return 'rgba(251, 191, 36, 0.5)';
    if (progress >= 50) return 'rgba(99, 102, 241, 0.5)';
    return 'rgba(245, 158, 11, 0.5)';
  };

  return (
    <div className="glass-card p-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isAchieved
                ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30'
                : 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
            }`}
          >
            {isAchieved ? (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 text-amber-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </motion.svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">
              {isAchieved ? '🎉 목표 달성!' : '목표 진행률'}
            </h3>
            <p className="text-xs text-slate-400">
              목표: {formatNumber(targetGoal)} {currencyLabel}
            </p>
          </div>
        </div>

        {/* 진행률 숫자 표시 */}
        <div className="text-right">
          <motion.span
            key={progress}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-2xl font-bold ${
              isAchieved ? 'text-amber-400' : progress >= 50 ? 'text-indigo-400' : 'text-orange-400'
            }`}
          >
            {formatNumber(progress, 1)}%
          </motion.span>
          {achievedDay && (
            <p className="text-xs text-emerald-400 mt-1">
              {achievedDay}일 만에 달성
            </p>
          )}
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${animatedProgress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getProgressColor()}`}
          style={{
            boxShadow: `0 0 20px ${getGlowColor()}`,
          }}
        />
        
        {/* 쉬머 효과 */}
        <div
          className="absolute inset-0 animate-shimmer opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* 하단 정보 */}
      <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
        <span>현재: {formatCompactNumber(currentBalance)} {currencyLabel}</span>
        <span>
          {isAchieved
            ? `초과 달성: +${formatCompactNumber(currentBalance - targetGoal)} ${currencyLabel}`
            : `남은 금액: ${formatCompactNumber(Math.max(0, targetGoal - currentBalance))} ${currencyLabel}`}
        </span>
      </div>
    </div>
  );
}

/**
 * 서머리 카드 컴포넌트
 */
interface SummaryCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'gold';
  trend?: 'up' | 'down' | 'neutral';
  animate?: boolean;
}

function SummaryCard({
  label,
  value,
  subValue,
  icon,
  color,
  trend,
  animate,
}: SummaryCardProps) {
  // 색상 매핑
  const colorClasses = {
    primary: {
      bg: 'from-indigo-500/20 to-purple-500/20',
      border: 'border-indigo-500/30',
      text: 'text-indigo-400',
      icon: 'text-indigo-400',
    },
    success: {
      bg: 'from-emerald-500/20 to-green-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: 'text-emerald-400',
    },
    warning: {
      bg: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      icon: 'text-amber-400',
    },
    danger: {
      bg: 'from-red-500/20 to-rose-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: 'text-red-400',
    },
    gold: {
      bg: 'from-amber-400/20 to-yellow-500/20',
      border: 'border-amber-400/30',
      text: 'text-amber-300',
      icon: 'text-amber-400',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`glass-card p-4 relative overflow-hidden ${animate ? 'animate-pulse-glow' : ''}`}
    >
      {/* 배경 그라데이션 */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50`}
      />

      {/* 콘텐츠 */}
      <div className="relative">
        {/* 아이콘 */}
        <div
          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.bg} ${colors.border} border flex items-center justify-center mb-3`}
        >
          <span className={colors.icon}>{icon}</span>
        </div>

        {/* 라벨 */}
        <p className="text-xs text-slate-400 mb-1">{label}</p>

        {/* 메인 값 */}
        <div className="flex items-center gap-2">
          <motion.p
            key={value}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-xl font-bold ${colors.text}`}
          >
            {value}
          </motion.p>

          {/* 트렌드 아이콘 */}
          {trend && (
            <span className={trend === 'up' ? 'text-emerald-400' : 'text-red-400'}>
              {trend === 'up' ? '↑' : '↓'}
            </span>
          )}
        </div>

        {/* 서브 값 */}
        {subValue && (
          <p className="text-xs text-slate-500 mt-1 truncate" title={subValue}>
            {subValue}
          </p>
        )}
      </div>

      {/* 성공 시 반짝임 효과 */}
      {animate && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-2 right-2"
        >
          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}


