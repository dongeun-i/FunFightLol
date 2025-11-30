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

---

# 6️⃣ 사용자 데이터 저장 문제

### 옵션

| 저장 방식          | 특징           | 비고                 |
| -------------- | ------------ | ------------------ |
| LocalStorage   | 새로고침 유지      | PC방 환경에서는 흔적 남아 위험 |
| SessionStorage | 새 탭/창 닫으면 삭제 | 새로고침은 유지됨          |
| 쿠키             | 새로고침 유지      | API 키 노출 X         |
| DB             | 가장 안전        | 토이 프로젝트면 과함        |

### 결론

로그인 없고 토이 프로젝트 기준:
→ **SessionStorage** 또는 **URL 파라미터/해시 기반 임시 저장**이 가장 적합
(PC방에서 개인정보 남을 가능성 최소화)

---

# 7️⃣ Data Dragon 정리

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

# 8️⃣ FunFight LoL Product Description (영문/국문 버전)

## 🇺🇸 English

FunFight LoL is a lightweight companion tool designed to make League of Legends more enjoyable when playing with friends. Users can register up to five summoners and set friendly challenges based on various in-game metrics. The app tracks recent matches through periodic Riot API updates or manual refresh.

FunFight LoL does not provide competitive advantages or shame players; instead, it encourages fun and positive competition among friends.

## 🇰🇷 Korean

FunFight LoL은 친구들과 함께 리그 오브 레전드를 더욱 재미있게 즐길 수 있도록 만들어진 보조 도구입니다. 최대 5명의 소환사를 등록하고 딜량·피해량·CS·포탑 기여도 등 다양한 지표를 기준으로 친선 경쟁을 진행할 수 있습니다.

플레이어 비난 요소는 전혀 포함하지 않으며, 긍정적이고 즐거운 경쟁을 유도하는 것이 목표입니다.

---

# 💾 9️⃣ 최종 결론

* **Next.js 기반**으로 개발하면 “비동기 + 시각화 + 배포" 모두 완벽
* Data Dragon 사용하면 챔피언 이미지/UI 제작 편리
* 주기적 데이터 업데이트는 Polling으로 구현
* 저장은 SessionStorage 또는 URL 기반 임시 저장
* Production 키 필요 시 Riot 검토 신청
* 일단은 토이 프로젝트 → DB 없이도 충분



