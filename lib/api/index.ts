/**
 * API 모듈 진입점
 * 
 * 사용 예시:
 * ```typescript
 * import { searchSummoner, fetchSummonerMatches } from '@/lib/api';
 * 
 * const result = await searchSummoner('Hide on bush#KR1');
 * const matches = await fetchSummonerMatches(result.summoner.puuid);
 * ```
 */

export * from "./riot-api";
export * from "./riot-adapter";
export * from "./summoner-service";
export * from "./data-dragon";

