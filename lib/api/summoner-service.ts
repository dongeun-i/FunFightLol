/**
 * 소환사 관련 비즈니스 로직을 담당하는 서비스
 */

import { Summoner } from "../types";
import {
  getAccountByRiotId,
  getSummonerByPUUID,
  getMatchIdsByPUUID,
  getMatches,
} from "./riot-api";
import {
  parseRiotId,
  createSummonerFromRiotId,
  convertRiotMatchesToMatchStats,
} from "./riot-adapter";

/**
 * 소환사 검색 결과
 */
export interface SearchSummonerResult {
  summoner: Summoner;
  profileIconId: number;
  summonerLevel: number;
}

/**
 * Riot ID로 소환사 검색
 * @param input "소환사명#태그" 또는 "소환사명" (태그 생략 시 기본값 사용)
 */
export async function searchSummoner(
  input: string
): Promise<SearchSummonerResult> {
  try {
    // 입력값 파싱
    const { gameName, tagLine } = parseRiotId(input);

    // 1. Riot ID로 계정 정보 조회
    const account = await getAccountByRiotId(gameName, tagLine);

    // 2. PUUID로 소환사 정보 조회
    const summonerInfo = await getSummonerByPUUID(account.puuid);

    // 3. Summoner 객체 생성
    const summoner = createSummonerFromRiotId(
      account.gameName,
      account.tagLine,
      account.puuid
    );

    return {
      summoner,
      profileIconId: summonerInfo.profileIconId,
      summonerLevel: summonerInfo.summonerLevel,
    };
  } catch (error) {
    if (error instanceof Error) {
      // API 에러 메시지를 사용자 친화적으로 변환
      if (error.message.includes("404")) {
        throw new Error("소환사를 찾을 수 없습니다. 소환사명과 태그를 확인해주세요.");
      }
      if (error.message.includes("403")) {
        throw new Error("API 키가 유효하지 않습니다.");
      }
      if (error.message.includes("429")) {
        throw new Error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      }
    }
    throw error;
  }
}

/**
 * 소환사의 최근 매치 데이터 조회
 * @param puuid 소환사 PUUID
 * @param count 조회할 매치 수
 */
export async function fetchSummonerMatches(puuid: string, count: number = 20) {
  try {
    // 1. 매치 ID 목록 조회
    const matchIds = await getMatchIdsByPUUID(puuid, count);

    if (matchIds.length === 0) {
      return [];
    }

    // 2. 매치 상세 정보 조회
    const matches = await getMatches(matchIds);

    // 3. 앱 내부 형식으로 변환
    const matchStats = convertRiotMatchesToMatchStats(matches, puuid);

    return matchStats;
  } catch (error) {
    console.error("Failed to fetch summoner matches:", error);
    throw new Error("매치 데이터를 불러오는데 실패했습니다.");
  }
}

/**
 * 여러 소환사의 매치 데이터를 동시에 조회
 */
export async function fetchMultipleSummonersMatches(
  summoners: Summoner[],
  matchCount: number = 20
) {
  const results = await Promise.allSettled(
    summoners.map(async (summoner) => {
      if (!summoner.puuid) {
        throw new Error(`${summoner.name}의 PUUID가 없습니다.`);
      }
      const matches = await fetchSummonerMatches(summoner.puuid, matchCount);
      return { summoner, matches };
    })
  );

  const successful = results
    .filter((result): result is PromiseFulfilledResult<any> => result.status === "fulfilled")
    .map((result) => result.value);

  const failed = results
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) => result.reason);

  if (failed.length > 0) {
    console.error("Some summoners failed to load:", failed);
  }

  return successful;
}

