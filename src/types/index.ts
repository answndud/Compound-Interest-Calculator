import type { ReactNode } from 'react';

/**
 * 복리 계산기 타입 정의
 * 모든 인터페이스와 타입을 여기서 중앙 관리합니다
 */

// 지원 통화 코드
export type CurrencyCode = 'USDT' | 'KRW' | 'EUR';

// 계산기 입력 파라미터 인터페이스
export interface CalculatorInputs {
  seedMoney: number;        // 시드머니 (초기 자본금)
  dailyReturn: number;      // 일일 평균 수익률 (%)
  stopLossPercent: number;  // 손절 비율 (%)
  stopLossFrequency: number; // 손절 발생 빈도 (며칠마다)
  totalPeriod: number;      // 총 투자 기간 (일)
  targetGoal: number;       // 목표 금액
}

// 일별 데이터 포인트 (차트용)
export interface DailyDataPoint {
  day: number;              // 투자 일수
  balance: number;          // 해당 일의 잔고
  isStopLoss: boolean;      // 손절 발생 여부
  percentGain: number;      // 누적 수익률 (%)
}

// 계산 결과 인터페이스
export interface CalculationResult {
  finalBalance: number;           // 최종 잔고
  totalReturn: number;            // 총 수익률 (%)
  totalProfit: number;            // 총 수익금
  goalProgress: number;           // 목표 달성률 (%)
  isGoalAchieved: boolean;        // 목표 달성 여부
  goalAchievedDay: number | null; // 목표 달성 일자 (달성한 경우)
  stopLossCount: number;          // 손절 발생 횟수
  maxDrawdown: number;            // 최대 낙폭 (%)
  dailyData: DailyDataPoint[];    // 일별 데이터 배열
}

// 서머리 카드 데이터 타입
export interface SummaryCardData {
  label: string;
  value: string | number;
  subValue?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color: 'primary' | 'success' | 'warning' | 'danger' | 'gold';
}

// 입력 필드 설정 타입
export interface InputFieldConfig {
  id: keyof CalculatorInputs;
  label: string;
  placeholder: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
}


