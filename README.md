# 🚀 복리 계산기 (Compound Interest Calculator)

손절(Stop-Loss) 전략과 목표 금액 추적 기능이 포함된 고급 복리 수익 시뮬레이터입니다.

![Preview](./preview.png)

## ✨ 주요 기능

### 📊 핵심 계산 기능
- **복리 계산**: 일일 수익률 기반 복리 성장 시뮬레이션
- **손절(Stop-Loss) 로직**: 주기적인 손절 발생을 시뮬레이션
- **목표 달성 추적**: 설정한 목표 금액 대비 진행률 표시
- **최대 낙폭(MDD)**: 투자 기간 중 최대 손실폭 계산

### 🎨 UI/UX 특징
- **글라스모피즘 디자인**: 모던하고 세련된 다크 테마 UI
- **반응형 레이아웃**: 데스크톱/태블릿/모바일 모두 지원
- **애니메이션**: Framer Motion을 활용한 부드러운 인터랙션
- **컨페티 효과**: 목표 달성 시 축하 애니메이션
- **실시간 차트**: Recharts로 구현한 자산 성장 곡선

### 📈 차트 기능
- 일별 잔고 추이 시각화
- 목표 금액 참조선 (Reference Line)
- 손절 발생 지점 표시
- 목표 달성 지점 하이라이트

---

## 🛠 기술 스택

- **React 19** + **TypeScript**
- **Vite** - 빌드 도구
- **Tailwind CSS v4** - 스타일링
- **Recharts** - 차트 라이브러리
- **Framer Motion** - 애니메이션
- **react-confetti** - 축하 효과

---

## 📦 설치 및 실행

### 1. 저장소 클론 또는 프로젝트 디렉토리 이동

```bash
cd Compound-Interest-Calculator
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 4. 프로덕션 빌드

```bash
npm run build
```

### 5. 빌드 결과물 미리보기

```bash
npm run preview
```