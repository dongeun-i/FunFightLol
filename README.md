# 🎮 FunFight LoL — Project Planning Summary

**(Summary of discussion with ChatGPT)**


## 📌 개요

FunFight LoL은 친구들과 LoL 플레이를 하면서 **딜량·받은 피해량·CS·포탑 기여도**와 같은 지표를 기반으로 **친선 챌린지**를 진행할 수 있도록 하는 웹 기반 도구다.
공식 경쟁 시스템과는 무관하며, Riot 정책에 맞게 **긍정적 경쟁**을 유도하고 **플레이어 비난 요소는 포함하지 않는다**.

---

# 1️⃣ 프로젝트 목표

* 친구들끼리 **즐겁게 경쟁할 수 있는 게임 데이터 기반 챌린지 앱**
* 특정 지표(딜량/피해량/CS/포탑 등)를 기준으로 **몇 판 동안 누가 더 잘했는지 비교**
* **주기적 업데이트** 또는 유저가 직접 “새로고침”을 누르면 최신 데이터 반영
* **반응형 UI** + **PC 환경 최적화**

---

# 2️⃣ Riot API 활용 정책 핵심 정리

### ❌ 하면 안 되는 것 (중요)

* 공식 로고 사용
* Riot과 제휴/승인 오해를 주는 표현 금지
* Development/Interim 키로 공개 서비스 운영
* Production 키를 여러 프로젝트에 재사용
* 플레이어 능력 비난, shame 기능
* MMR/ELO 계산기 등 공식 시스템 대체
* undocumented endpoint 스크래핑
* League Client/Chat 등 미지원 시스템 접근
* UI를 Riot/GAME 인게임 UI처럼 만들기

### ✅ 해도 되는 것

* 게임 데이터 기반 분석
* 챔피언/아이템 등 **Data Dragon** 아트 자산 자유 사용
* 플레이어 스스로의 플레이 개선 도움
* 친구끼리 즐기는 긍정적 경쟁 기능

---

# 3️⃣ API Key 관련 정리

### 🔑 Development Key

* 24시간마다 자동 만료
* **프로토타입/로컬 개발용**
* 공개 서비스에 사용 금지

### 🔑 Production Key

* 만료 없음
* **실제 서비스 운영용**
* 프로젝트 검토 후 승인 시 발급됨

---

# 4️⃣ 기술 스택 추천

## 🥇 가장 추천: **Next.js + TypeScript + TailwindCSS**

* 프런트 + 백엔드를 동시에 해결
* 서버 컴포넌트가 async 지원 → 비동기에 매우 강함
* Vercel 배포 최적화
* 챔피언 이미지/데이터를 SSR로 빠르게 렌더 가능
* Riot API IO bound 작업과 잘 맞음

## 대안

* React + Node.js(Express/NestJS)
* Python(FastAPI) + React
* Vue/Nuxt (취향)

---

# 5️⃣ 핵심 기능 기술 설계

## ⭐ 1) 주기적 데이터 수집(Polling)

* Riot API는 Webhook이 없음 → **Polling 기반**
* 선택지:

  * Vercel Cron → `/api/update` 자동 실행
  * 유저 수동 새로고침
  * 서버 캐싱(Upstash Redis 등)
* 흐름

  1. 등록된 puuid 목록 조회
  2. 최신 matchId 리스트 GET
  3. 새로운 매치만 상세 요청
  4. 필요한 데이터만 저장 후 프런트 전달

---

## ⭐ 2) 데이터 시각화(UI/그래프)

### 추천 라이브러리

* **Chart.js + react-chartjs-2**
* Recharts
* (고급) D3.js

### 표시용 카드 UI

* 챔피언 스플래시 이미지
* 소환사명 / 챔피언명
* 주요 지표
* 미니 그래프
* 반응형 카드 레이아웃



# 6️⃣  Data Dragon 정리

* Riot이 제공하는 **정적 데이터 + 이미지 리소스** 저장소
* 챔피언/아이템/룬/스펠/아이콘 전부 포함
* URL 형태로 바로 접근 가능
* 여러 언어 지원 (`ko_KR` 추천)
* 패치별 버전 제공

예시:

```
https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/Ahri.png
https://ddragon.leagueoflegends.com/cdn/{version}/data/ko_KR/champion/Ahri.json
```

---

# 7️⃣ FunFight LoL Product Description (영문/국문 버전)

## 🇺🇸 English

FunFight LoL is a lightweight companion tool designed to make League of Legends more enjoyable when playing with friends. Users can register up to five summoners and set friendly challenges based on various in-game metrics. The app tracks recent matches through periodic Riot API updates or manual refresh.

FunFight LoL does not provide competitive advantages or shame players; instead, it encourages fun and positive competition among friends.

## 🇰🇷 Korean

FunFight LoL은 친구들과 함께 리그 오브 레전드를 더욱 재미있게 즐길 수 있도록 만들어진 보조 도구입니다. 최대 5명의 소환사를 등록하고 딜량·피해량·CS·포탑 기여도 등 다양한 지표를 기준으로 친선 경쟁을 진행할 수 있습니다.

플레이어 비난 요소는 전혀 포함하지 않으며, 긍정적이고 즐거운 경쟁을 유도하는 것이 목표입니다.

---

# 💾 8️⃣ 주요 기능

## 🎯 핵심 기능

### 1. 소환사 등록 및 관리
* 최대 5명의 소환사 등록 가능
* 소환사명 검색 및 추가
* 등록된 소환사 목록 확인 및 삭제
* 최소 2명 이상 등록 필요

### 2. 챌린지 설정
* **딜량**: 가장 높은 딜량을 기록한 소환사
* **골드 획득량**: 가장 많은 골드를 획득한 소환사
* **점수**: K/D/A/CS에 따른 커스텀 점수 계산
  * 킬/데스/어시스트/CS 점수 개별 설정 가능
  * CS 몇 개당 1점 설정 가능
* **KDA**: 가장 높은 KDA를 기록한 소환사 (소수점 2자리까지)

### 3. 고급 설정
* **최대 판수 설정**: 0으로 설정 시 무제한
* **핸디캡 설정**: 각 소환사별로 핸디캡 값 설정 가능
  * 실력 차이가 있을 때 공정한 경쟁을 위해 사용

### 4. 게임 진행
* 매치 히스토리 실시간 확인
* 새로고침 버튼으로 최신 매치 추가
* **무효판 설정**: 특정 매치를 무효로 처리하여 통계에서 제외
* 리더보드 실시간 업데이트
* 막대 그래프로 시각화

### 5. 통계 및 결과
* 챌린지별 리더보드
* 등수 간 격차 표시 (1등과의 차이)
* 매치별 상세 통계
* 승률 및 평균 통계
* 최종 결과 페이지

### 6. 사용자 경험
* **다크모드 지원**: 화면 오른쪽 상단 토글 버튼
* 반응형 디자인 (모바일/태블릿/PC)
* 부드러운 애니메이션 효과
* 사용 설명 툴팁 (챌린지 설정 페이지)

## 📊 데이터 표시 형식

* **큰 숫자**: 천 단위 구분자 사용 (예: 1,234,567)
* **Y축**: 1k, 1M 형식으로 표시
* **KDA**: 소수점 2자리까지 표시
* **격차**: 1등과의 차이를 작은 글씨로 표시

---

# 📸 이미지 사용 방법

## 정적 이미지 파일

Next.js에서는 **`public` 폴더**에 이미지를 넣으면 됩니다.

### 폴더 구조
```
public/
  ├── imgs/          # 이미지 파일들
  │   ├── logo.png
  │   └── icon.svg
  └── favicon.ico
```

### 사용 방법

#### 1. 일반 img 태그 사용
```tsx
// public/imgs/logo.png 파일이 있다면
<img src="/imgs/logo.png" alt="로고" />

// public/logo.png 파일이 있다면
<img src="/logo.png" alt="로고" />
```

#### 2. Next.js Image 컴포넌트 사용 (권장)
```tsx
import Image from 'next/image';

<Image 
  src="/imgs/logo.png" 
  alt="로고" 
  width={200} 
  height={200}
/>
```

### 주의사항
- `public` 폴더의 파일은 루트 경로(`/`)로 접근 가능
- `public/imgs/logo.png` → `/imgs/logo.png`
- 빌드 시 `public` 폴더의 모든 파일이 그대로 배포됨
- Vercel 배포 시에도 `public` 폴더의 이미지가 자동으로 포함됨

### 외부 이미지 URL 사용
```tsx
// 외부 URL 직접 사용 가능
<img src="https://example.com/image.png" alt="외부 이미지" />

// Data Dragon 이미지 사용 예시
<img 
  src="https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png" 
  alt="Ahri"
/>
```

---

# 🚀 9️⃣ Vercel 배포 가이드

## 배포 준비

### 1. GitHub에 프로젝트 푸시
```bash
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercel 배포

#### 방법 1: Vercel 웹사이트에서 배포
1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `.next` (기본값)
5. "Deploy" 클릭

#### 방법 2: Vercel CLI로 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 3. 환경 변수 설정 (필요한 경우)
Vercel 대시보드에서:
1. 프로젝트 선택
2. Settings → Environment Variables
3. 필요한 환경 변수 추가 (예: API 키 등)

### 4. 배포 확인
- 배포 완료 후 제공되는 URL로 접속
- 모든 페이지가 정상 작동하는지 확인

## 배포 후 확인 사항

✅ 빌드 성공 여부 확인
✅ 모든 페이지 라우팅 정상 작동
✅ 다크모드 토글 정상 작동
✅ SessionStorage 기능 정상 작동
✅ 반응형 디자인 확인

## 주의사항

⚠️ **SessionStorage 사용**: 현재 프로젝트는 브라우저의 SessionStorage를 사용하므로, 새 탭이나 브라우저를 닫으면 데이터가 초기화됩니다.

⚠️ **데이터 영구 저장 필요 시**: 실제 서비스에서는 데이터베이스(예: Vercel Postgres, Supabase) 또는 API 서버를 연동해야 합니다.

---

# 💾 🔟 요약

* **Next.js 기반**으로 개발
* Data Dragon 사용하면 챔피언 이미지/UI 제작 편리
* 주기적 데이터 업데이트는 Polling으로 구현
* Production 키 필요 시 Riot 검토 신청
* **Vercel 배포 가능** (빌드 테스트 완료)



