/**
 * 클라이언트 사이드 API 호출
 * 서버의 API 라우트를 통해 Riot API와 통신
 */

import { Summoner } from "./types";

export interface SearchSummonerResult {
  summoner: Summoner;
  profileIconId: number;
  summonerLevel: number;
}

/**
 * 소환사 검색 (클라이언트 -> 서버 API 라우트)
 */
export async function searchSummonerClient(riotId: string): Promise<SearchSummonerResult> {
  const response = await fetch('/api/summoner/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ riotId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '소환사 검색에 실패했습니다.');
  }

  return response.json();
}

