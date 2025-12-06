import { motion } from 'framer-motion';
import type { CalculatorInputs, InputFieldConfig, CurrencyCode } from '../types';

/**
 * Controls 컴포넌트 Props 인터페이스
 */
interface ControlsProps {
  inputs: CalculatorInputs;
  onChange: (key: keyof CalculatorInputs, value: number) => void;
  currency: CurrencyCode;
  currencyLabel: string;
  onCurrencyChange: (currency: CurrencyCode) => void;
}

/**
 * 입력 필드 설정 배열
 * 각 필드의 라벨, 플레이스홀더, 단위, 유효성 검사 범위 등을 정의
 */
const inputFields: InputFieldConfig[] = [
  {
    id: 'seedMoney',
    label: '시드머니 (Seed Money)',
    placeholder: '1000',
    suffix: 'USDT',
    min: 1,
    tooltip: '투자를 시작할 초기 자본금입니다',
  },
  {
    id: 'dailyReturn',
    label: '일일 평균 수익률',
    placeholder: '2',
    suffix: '%',
    min: 0,
    max: 100,
    step: 0.1,
    tooltip: '하루 평균 예상 수익률입니다',
  },
  {
    id: 'stopLossPercent',
    label: '손절 비율 (Stop-Loss)',
    placeholder: '5',
    suffix: '%',
    min: 0,
    max: 100,
    step: 0.5,
    tooltip: '손절 발생 시 잃게 되는 비율입니다',
  },
  {
    id: 'stopLossFrequency',
    label: '손절 빈도',
    placeholder: '7',
    suffix: '일마다',
    min: 0,
    step: 1,
    tooltip: '며칠마다 손절이 발생하는지 설정합니다 (0 = 손절 없음)',
  },
  {
    id: 'totalPeriod',
    label: '투자 기간',
    placeholder: '30',
    suffix: '일',
    min: 1,
    max: 3650,
    step: 1,
    tooltip: '총 투자 기간 (일 단위)',
  },
  {
    id: 'targetGoal',
    label: '목표 금액 (Target Goal)',
    placeholder: '10000',
    min: 0,
    tooltip: '달성하고자 하는 목표 금액입니다',
  },
];

/**
 * 입력 컨트롤 패널 컴포넌트
 * 복리 계산에 필요한 모든 입력값을 관리합니다
 */
export function Controls({ inputs, onChange, currency, currencyLabel, onCurrencyChange }: ControlsProps) {
  return (
    <div className="glass-card p-6 h-full">
      {/* 패널 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
          <svg
            className="w-5 h-5 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">파라미터 설정</h2>
          <p className="text-xs text-slate-400">투자 조건을 입력하세요</p>
        </div>
      </div>

      {/* 통화 선택 토글 */}
      <div className="mb-5">
        <p className="text-xs text-slate-400 mb-2">통화 선택</p>
        <div className="grid grid-cols-3 gap-2">
          {(['USDT', 'KRW', 'EUR'] as CurrencyCode[]).map((code) => (
            <motion.button
              key={code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCurrencyChange(code)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                currency === code
                  ? 'bg-indigo-500/20 border-indigo-400 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {code === 'USDT' ? 'USDT' : code === 'KRW' ? 'KRW (원화)' : 'EUR (유로)'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 입력 필드 목록 */}
      <div className="space-y-5">
        {inputFields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <InputField
              config={field}
              value={inputs[field.id]}
              currencyLabel={currencyLabel}
              onChange={(value) => onChange(field.id, value)}
            />
          </motion.div>
        ))}
      </div>

      {/* 프리셋 버튼들 */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs text-slate-400 mb-3">빠른 설정 (Quick Presets)</p>
        <div className="grid grid-cols-2 gap-2">
          <PresetButton
            label="보수적"
            onClick={() => {
              onChange('dailyReturn', 1);
              onChange('stopLossPercent', 3);
              onChange('stopLossFrequency', 10);
            }}
          />
          <PresetButton
            label="적극적"
            onClick={() => {
              onChange('dailyReturn', 3);
              onChange('stopLossPercent', 7);
              onChange('stopLossFrequency', 5);
            }}
          />
          <PresetButton
            label="단기 (7일)"
            onClick={() => onChange('totalPeriod', 7)}
          />
          <PresetButton
            label="장기 (365일)"
            onClick={() => onChange('totalPeriod', 365)}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 개별 입력 필드 컴포넌트
 */
interface InputFieldProps {
  config: InputFieldConfig;
  value: number;
  currencyLabel: string;
  onChange: (value: number) => void;
}

function InputField({ config, value, onChange, currencyLabel }: InputFieldProps) {
  const { id, label, placeholder, suffix, min, max, step, tooltip } = config;
  const dynamicSuffix =
    id === 'seedMoney' || id === 'targetGoal' ? currencyLabel : suffix;

  return (
    <div className="group">
      {/* 라벨 */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2"
      >
        {label}
        {tooltip && (
          <span
            className="text-slate-500 cursor-help"
            title={tooltip}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        )}
      </label>

      {/* 입력 필드 컨테이너 */}
      <div className="relative">
        <input
          id={id}
          type="number"
          value={value || ''}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value) || 0;
            onChange(newValue);
          }}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step || 1}
          className="glass-input w-full px-4 py-3 pr-16 text-white font-medium"
        />
        
        {/* 단위 표시 */}
        {dynamicSuffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
            {dynamicSuffix}
          </span>
        )}

        {/* 포커스 시 글로우 효과 */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
        </div>
      </div>

      {/* 특수 필드에 대한 추가 힌트 */}
      {id === 'stopLossFrequency' && value === 0 && (
        <p className="mt-1 text-xs text-emerald-400">✓ 손절 없이 계산됩니다</p>
      )}
      {id === 'targetGoal' && value === 0 && (
        <p className="mt-1 text-xs text-slate-500">목표 금액을 설정하면 달성률을 추적합니다</p>
      )}
    </div>
  );
}

/**
 * 프리셋 버튼 컴포넌트
 */
interface PresetButtonProps {
  label: string;
  onClick: () => void;
}

function PresetButton({ label, onClick }: PresetButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="px-3 py-2 text-xs font-medium rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-200"
    >
      {label}
    </motion.button>
  );
}


