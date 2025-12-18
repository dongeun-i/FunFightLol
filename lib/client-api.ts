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

export interface RecentPlayer {
  puuid: string;
  name: string;
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

/**
 * 최근 함께 플레이한 소환사 목록 조회
 */
export async function getRecentPlayersClient(puuid: string, count: number = 3): Promise<RecentPlayer[]> {
  const response = await fetch('/api/summoner/recent-players', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ puuid, count }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '최근 플레이어 조회에 실패했습니다.');
  }

  const data = await response.json();
  return data.players;
}

/**
 * 테스트용 매치 데이터 조회 (모든 소환사가 함께한 최근 매치)
 */
export async function getTestMatchClient(puuids: string[]) {
  const response = await fetch('/api/match/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ puuids }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '테스트 매치 조회에 실패했습니다.');
  }

  const data = await response.json();
  return data.match;
}

