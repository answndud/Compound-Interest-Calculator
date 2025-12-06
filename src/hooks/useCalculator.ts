import { useMemo } from 'react';
import type { CalculatorInputs, CalculationResult, DailyDataPoint } from '../types';

/**
 * 복리 계산 커스텀 훅
 * 손절(Stop-Loss) 로직과 목표 달성 추적 기능을 포함합니다
 * 
 * @param inputs - 계산기 입력값들
 * @returns 계산 결과 객체
 */
export function useCalculator(inputs: CalculatorInputs): CalculationResult {
  return useMemo(() => {
    const {
      seedMoney,
      dailyReturn,
      stopLossPercent,
      stopLossFrequency,
      totalPeriod,
      targetGoal,
    } = inputs;

    // 유효성 검사: 기본값 반환
    if (seedMoney <= 0 || totalPeriod <= 0) {
      return {
        finalBalance: 0,
        totalReturn: 0,
        totalProfit: 0,
        goalProgress: 0,
        isGoalAchieved: false,
        goalAchievedDay: null,
        stopLossCount: 0,
        maxDrawdown: 0,
        dailyData: [],
      };
    }

    // 일별 데이터를 저장할 배열
    const dailyData: DailyDataPoint[] = [];
    
    // 현재 잔고
    let currentBalance = seedMoney;
    
    // 최고점 (최대 낙폭 계산용)
    let peakBalance = seedMoney;
    
    // 최대 낙폭
    let maxDrawdown = 0;
    
    // 손절 발생 횟수
    let stopLossCount = 0;
    
    // 목표 달성 일자
    let goalAchievedDay: number | null = null;

    // 일일 수익률을 소수점으로 변환 (예: 2% → 0.02)
    const dailyReturnRate = dailyReturn / 100;
    
    // 손절 비율을 소수점으로 변환
    const stopLossRate = stopLossPercent / 100;

    // 매일 복리 계산 수행
    for (let day = 1; day <= totalPeriod; day++) {
      // 손절 발생 체크: stopLossFrequency일마다 손절
      const isStopLossDay = stopLossFrequency > 0 && day % stopLossFrequency === 0;

      if (isStopLossDay) {
        // 손절 발생: 잔고에서 손절 비율만큼 손실
        currentBalance = currentBalance * (1 - stopLossRate);
        stopLossCount++;
      } else {
        // 일반적인 복리 수익 적용
        currentBalance = currentBalance * (1 + dailyReturnRate);
      }

      // 최고점 업데이트
      if (currentBalance > peakBalance) {
        peakBalance = currentBalance;
      }

      // 현재 낙폭 계산 및 최대 낙폭 업데이트
      const currentDrawdown = ((peakBalance - currentBalance) / peakBalance) * 100;
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
      }

      // 목표 달성 체크 (첫 번째 달성 시점만 기록)
      if (targetGoal > 0 && goalAchievedDay === null && currentBalance >= targetGoal) {
        goalAchievedDay = day;
      }

      // 누적 수익률 계산
      const percentGain = ((currentBalance - seedMoney) / seedMoney) * 100;

      // 일별 데이터 저장
      dailyData.push({
        day,
        balance: Math.round(currentBalance * 100) / 100, // 소수점 2자리로 반올림
        isStopLoss: isStopLossDay,
        percentGain: Math.round(percentGain * 100) / 100,
      });
    }

    // 최종 결과 계산
    const finalBalance = currentBalance;
    const totalProfit = finalBalance - seedMoney;
    const totalReturn = ((finalBalance - seedMoney) / seedMoney) * 100;
    const goalProgress = targetGoal > 0 ? (finalBalance / targetGoal) * 100 : 0;
    const isGoalAchieved = targetGoal > 0 && finalBalance >= targetGoal;

    return {
      finalBalance: Math.round(finalBalance * 100) / 100,
      totalReturn: Math.round(totalReturn * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      goalProgress: Math.round(goalProgress * 100) / 100,
      isGoalAchieved,
      goalAchievedDay,
      stopLossCount,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      dailyData,
    };
  }, [inputs]);
}

/**
 * 숫자를 읽기 쉬운 형식으로 포맷팅
 * 예: 1234567.89 → "1,234,567.89"
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * 큰 숫자를 축약형으로 표시
 * 예: 1500000 → "1.5M"
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}





