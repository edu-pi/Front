# Haeya 팀 프론트

## 실행 방법

### 1. 의존성 설치

```bash
npm i
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.development` 파일을 생성하고 다음 내용을 추가하세요:

```env
# msw 사용
VITE_APP_NODE_ENV=development
VITE_APP_USE_MSW=true
```

### 3. 개발 서버 실행

```bash
npm run dev
```
