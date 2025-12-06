import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import type { DailyDataPoint } from '../types';
import { formatNumber, formatCompactNumber } from '../hooks/useCalculator';

/**
 * Chart 컴포넌트 Props 인터페이스
 */
interface ChartProps {
  data: DailyDataPoint[];
  targetGoal: number;
  goalAchievedDay: number | null;
  currencyLabel: string;
}

/**
 * 커스텀 툴팁 Props 인터페이스
 * Recharts 툴팁에서 전달받는 props 타입 정의
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: DailyDataPoint;
    value: number;
  }>;
  label?: number;
  currencyLabel?: string;
}

/**
 * 차트 컴포넌트
 * 복리 성장 곡선과 목표 금액 참조선을 표시
 */
export function Chart({ data, targetGoal, goalAchievedDay, currencyLabel }: ChartProps) {
  // 목표 달성 시점의 데이터 포인트 찾기
  const goalAchievedPoint = useMemo(() => {
    if (goalAchievedDay === null) return null;
    return data.find((d) => d.day === goalAchievedDay);
  }, [data, goalAchievedDay]);

  // Y축 도메인 계산 (목표선과 데이터를 모두 표시하기 위해)
  const yAxisDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    
    const maxBalance = Math.max(...data.map((d) => d.balance));
    const minBalance = Math.min(...data.map((d) => d.balance));
    
    // 목표 금액도 고려
    const maxValue = Math.max(maxBalance, targetGoal || 0);
    const minValue = Math.min(minBalance, 0);
    
    // 여유 공간 추가
    const padding = (maxValue - minValue) * 0.1;
    
    return [Math.floor(minValue - padding), Math.ceil(maxValue + padding)];
  }, [data, targetGoal]);

  // 손절 발생 일자들
  const stopLossDays = useMemo(() => {
    return data.filter((d) => d.isStopLoss);
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="glass-card p-6">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      {/* 차트 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border border-emerald-500/30">
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">자산 성장 곡선</h2>
            <p className="text-xs text-slate-400">
              일별 잔고 추이 및 목표 달성 현황
            </p>
          </div>
        </div>

        {/* 범례 */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            <span className="text-slate-400">잔고</span>
          </div>
          {targetGoal > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-amber-400 rounded" style={{ borderStyle: 'dashed' }} />
              <span className="text-slate-400">목표</span>
            </div>
          )}
          {stopLossDays.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500" />
              <span className="text-slate-400">손절</span>
            </div>
          )}
        </div>
      </div>

      {/* 차트 컨테이너 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-80"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            {/* 그리드 */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />

            {/* X축 (일수) */}
            <XAxis
              dataKey="day"
              stroke="rgba(255, 255, 255, 0.3)"
              tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
              tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              label={{
                value: '투자 일수',
                position: 'bottom',
                offset: 0,
                fill: 'rgba(255, 255, 255, 0.4)',
                fontSize: 12,
              }}
            />

            {/* Y축 (잔고) */}
            <YAxis
              domain={yAxisDomain}
              stroke="rgba(255, 255, 255, 0.3)"
              tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
              tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              tickFormatter={(value) => formatCompactNumber(value)}
              width={80}
            />

            {/* 커스텀 툴팁 */}
            <Tooltip content={<CustomTooltip currencyLabel={currencyLabel} />} />

            {/* 그라데이션 정의 */}
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* 목표 금액 참조선 */}
            {targetGoal > 0 && (
              <ReferenceLine
                y={targetGoal}
                stroke="#fbbf24"
                strokeDasharray="8 4"
                strokeWidth={2}
                label={{
                  value: `목표: ${formatCompactNumber(targetGoal)} ${currencyLabel}`,
                  position: 'right',
                  fill: '#fbbf24',
                  fontSize: 12,
                }}
              />
            )}

            {/* 잔고 영역 차트 */}
            <Area
              type="monotone"
              dataKey="balance"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              fill="url(#balanceGradient)"
              animationDuration={1500}
              animationEasing="ease-out"
            />

            {/* 손절 발생 지점 표시 */}
            {stopLossDays.map((point) => (
              <ReferenceDot
                key={point.day}
                x={point.day}
                y={point.balance}
                r={6}
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}

            {/* 목표 달성 지점 하이라이트 */}
            {goalAchievedPoint && (
              <ReferenceDot
                x={goalAchievedPoint.day}
                y={goalAchievedPoint.balance}
                r={10}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth={3}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 차트 하단 통계 */}
      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
        <ChartStat
          label="시작 잔고"
          value={data.length > 0 ? `${formatCompactNumber(data[0].balance)} ${currencyLabel}` : '-'}
        />
        <ChartStat
          label="최종 잔고"
          value={data.length > 0 ? `${formatCompactNumber(data[data.length - 1].balance)} ${currencyLabel}` : '-'}
        />
        <ChartStat
          label="손절 횟수"
          value={`${stopLossDays.length}회`}
          highlight={stopLossDays.length > 0}
        />
      </div>
    </div>
  );
}

/**
 * 커스텀 툴팁 컴포넌트
 * 차트 위에 마우스를 올렸을 때 표시되는 상세 정보
 */
function CustomTooltip({ active, payload, label, currencyLabel }: CustomTooltipProps & { currencyLabel: string }) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="glass-card p-3 min-w-48">
      <div className="flex items-center justify-between gap-4 mb-2">
        <span className="text-xs text-slate-400">Day {label}</span>
        {data.isStopLoss && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            손절 발생
          </span>
        )}
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">잔고</span>
          <span className="text-sm font-semibold text-white">
            {formatNumber(data.balance)} {currencyLabel}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">수익률</span>
          <span
            className={`text-sm font-semibold ${
              data.percentGain >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {data.percentGain >= 0 ? '+' : ''}
            {formatNumber(data.percentGain)}%
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 차트 하단 통계 아이템
 */
interface ChartStatProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function ChartStat({ label, value, highlight }: ChartStatProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p
        className={`text-sm font-semibold ${
          highlight ? 'text-red-400' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * 빈 상태 컴포넌트
 * 데이터가 없을 때 표시되는 안내 메시지
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-300 mb-2">
        데이터가 없습니다
      </h3>
      <p className="text-sm text-slate-500">
        시드머니와 투자 기간을 입력하면
        <br />
        차트가 표시됩니다
      </p>
    </div>
  );
}
