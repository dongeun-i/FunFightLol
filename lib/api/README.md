# 🎮 Riot API 연동 가이드

## 📁 파일 구조

```
lib/api/
├── index.ts              # API 모듈 진입점
├── riot-api.ts           # Riot API 클라이언트 (저수준 HTTP 호출)
├── riot-adapter.ts       # Riot API 데이터 → 앱 타입 변환
├── summoner-service.ts   # 소환사 관련 비즈니스 로직
└── README.md            # 이 파일
```

## 🔑 API 키 설정

1. [Riot Developer Portal](https://developer.riotgames.com/)에서 API 키 발급
2. 프로젝트 루트에 `.env.local` 파일 생성:

```bash
NEXT_PUBLIC_RIOT_API_KEY=RGAPI-your-api-key-here
```

⚠️ **주의사항**:
- Development 키는 24시간마다 만료됩니다
- Production 배포 시 Production 키 신청 필요
- API 키는 절대 GitHub에 커밋하지 마세요!

## 📝 사용 예시

### 1. 소환사 검색

```typescript
import { searchSummoner } from "@/lib/api";

try {
  const result = await searchSummoner("Hide on bush#KR1");
  console.log(result.summoner); // { name, puuid }
  console.log(result.summonerLevel); // 소환사 레벨
} catch (error) {
  console.error("소환사를 찾을 수 없습니다");
}
```

### 2. 매치 데이터 조회

```typescript
import { fetchSummonerMatches } from "@/lib/api";

const matches = await fetchSummonerMatches(puuid, 20); // 최근 20게임
console.log(matches); // MatchStats[]
```

### 3. 여러 소환사 매치 조회

```typescript
import { fetchMultipleSummonersMatches } from "@/lib/api";

const results = await fetchMultipleSummonersMatches(summoners, 10);
// [{ summoner, matches }, ...]
```

## 🎯 Riot ID 형식

롤은 2024년부터 **Riot ID** 시스템을 사용합니다:

- **형식**: `소환사명#태그` (예: `Hide on bush#KR1`)
- **태그 생략**: 태그를 생략하면 자동으로 `#KR1` 적용
- **유효성**:
  - 소환사명: 3-16자
  - 태그: 3-5자 (숫자/영문)

## 🔄 데이터 흐름

```
1. 사용자 입력 ("Hide on bush#KR1")
   ↓
2. parseRiotId() → { gameName, tagLine }
   ↓
3. getAccountByRiotId() → RiotAccount (puuid 획득)
   ↓
4. getSummonerByPUUID() → RiotSummoner (레벨, 아이콘 등)
   ↓
5. getMatchIdsByPUUID() → string[] (매치 ID 목록)
   ↓
6. getMatchById() → RiotMatch[] (매치 상세 정보)
   ↓
7. convertRiotMatchToMatchStats() → MatchStats[] (앱 형식)
```

## ⚡ Rate Limiting

Riot API는 Rate Limit이 있습니다:

- **Development 키**: 20 requests/1 second, 100 requests/2 minutes
- **Production 키**: 더 높은 제한

현재 구현:
- 매치 조회 시 100ms 딜레이 적용
- 에러 발생 시 재시도 없음 (향후 개선 필요)

## 🛠️ 향후 개선 사항

- [ ] Rate limit 재시도 로직
- [ ] 캐싱 (React Query 도입)
- [ ] 에러 처리 개선
- [ ] 로딩 상태 관리
- [ ] API 호출 로깅/모니터링
- [ ] TypeScript 타입 개선
- [ ] 유닛 테스트 작성

## 📚 참고 자료

- [Riot API 공식 문서](https://developer.riotgames.com/apis)
- [Riot ID 시스템](https://developer.riotgames.com/docs/lol#account-v1)
- [Match v5 API](https://developer.riotgames.com/apis#match-v5)

