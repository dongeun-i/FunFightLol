import { GameSession, MatchStats, Summoner, Handicap } from "./types";
import { DEFAULT_SCORE_CONFIG } from "./constants";
import { applyHandicap } from "./handicap";

/**
 * 소환사별 통계 결과 인터페이스
 */
export interface SummonerStats {
  summoner: Summoner;
  total: number;
  average: number;
  matches: number;
  wins: number;
  winRate: number;
}

/**
 * 챌린지 옵션에 따라 매치 통계를 계산
 */
export function calculateMatchValue(
  match: MatchStats,
  optionId: string,
  scoreConfig?: GameSession["scoreConfig"]
): number {
  switch (optionId) {
    case "damage":
      return match.damage;

    case "gold":
      return match.gold;

    case "score": {
      const config = scoreConfig || DEFAULT_SCORE_CONFIG;
      const kdaScore =
        match.kills * config.kill +
        match.deaths * config.death +
        match.assists * config.assist;
      const csScore = Math.floor(match.cs / config.csPerPoint) * config.cs;
      return kdaScore + csScore;
    }

    case "kda": {
      const kdaValue =
        match.deaths === 0
          ? match.kills + match.assists
          : (match.kills + match.assists) / match.deaths;
      return parseFloat(kdaValue.toFixed(2));
    }

    default:
      return 0;
  }
}

/**
 * 소환사의 총합 통계 계산
 */
export function calculateSummonerTotal(
  matches: MatchStats[],
  optionId: string,
  scoreConfig?: GameSession["scoreConfig"]
): number {
  if (optionId === "kda") {
    // KDA는 특별 처리 (전체 킬/데스/어시스트 합산 후 계산)
    const kills = matches.reduce((sum, m) => sum + m.kills, 0);
    const deaths = matches.reduce((sum, m) => sum + m.deaths, 0);
    const assists = matches.reduce((sum, m) => sum + m.assists, 0);
    const kdaValue = deaths === 0 ? kills + assists : (kills + assists) / deaths;
    return parseFloat(kdaValue.toFixed(2));
  }

  // 다른 옵션들은 각 매치의 값을 합산
  return matches.reduce((sum, match) => {
    return sum + calculateMatchValue(match, optionId, scoreConfig);
  }, 0);
}

/**
 * 리더보드 생성 (통계 계산 + 핸디캡 적용 + 정렬)
 */
export function generateLeaderboard(
  session: Partial<GameSession>
): SummonerStats[] {
  if (!session.challengeOptions || !session.summoners || !session.matches) {
    return [];
  }

  const invalidMatches = session.invalidMatches || [];
  const optionId = session.challengeOptions;

  const stats: SummonerStats[] = session.summoners.map((summoner) => {
    // 유효한 매치만 필터링
    const summonerMatches = session.matches!.filter(
      (m) => m.summonerName === summoner.name && !invalidMatches.includes(m.matchId)
    );

    // 기본 통계 계산
    let total = calculateSummonerTotal(summonerMatches, optionId, session.scoreConfig);

    // 핸디캡 적용
    const handicap = session.handicaps?.find(
      (h) => h.optionId === optionId && h.summonerName === summoner.name
    );
    if (handicap) {
      total = applyHandicap(total, handicap, optionId);
    }

    // 평균 계산
    let average = 0;
    if (optionId === "kda") {
      average = total; // KDA는 평균이 total과 동일
    } else {
      average = summonerMatches.length > 0 ? total / summonerMatches.length : 0;
    }

    // 승률 계산
    const wins = summonerMatches.filter((m) => m.win).length;
    const winRate =
      summonerMatches.length > 0 ? (wins / summonerMatches.length) * 100 : 0;

    return {
      summoner,
      total,
      average,
      matches: summonerMatches.length,
      wins,
      winRate,
    };
  });

  // 총합 기준으로 내림차순 정렬
  return stats.sort((a, b) => b.total - a.total);
}

/**
 * 전체 우승자 반환
 */
export function getOverallWinner(session: Partial<GameSession>): {
  name: string;
  score: number;
} | null {
  const leaderboard = generateLeaderboard(session);
  if (leaderboard.length === 0) return null;

  return {
    name: leaderboard[0].summoner.name,
    score: leaderboard[0].total,
  };
}

/**
 * 게임 진행 시간 계산 (분 단위)
 */
export function calculateGameDuration(startTime: number): number {
  return Math.floor((Date.now() - startTime) / 1000 / 60);
}

