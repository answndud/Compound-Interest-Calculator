import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages 배포를 위한 Vite 설정
// 배포 시 base 경로를 레포지토리 이름으로 설정해야 합니다
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages 배포 시 '/레포지토리-이름/' 형태로 설정
  // 로컬 개발 시에는 '/'로 자동 설정됨
  base: process.env.NODE_ENV === 'production' 
    ? '/Compound-Interest-Calculator/' 
    : '/',
  build: {
    // 빌드 출력 디렉토리
    outDir: 'dist',
    // 소스맵 생성 (디버깅용)
    sourcemap: false,
  },
})
