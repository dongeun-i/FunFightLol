/**
 * Riot API 데이터를 앱 내부 타입으로 변환하는 어댑터
 */

import { MatchStats, Summoner } from "../types";
import { RiotMatch, RiotParticipant } from "./riot-api";

/**
 * Riot API의 매치 데이터를 앱의 MatchStats로 변환
 */
export function convertRiotMatchToMatchStats(
  match: RiotMatch,
  targetPuuid: string
): MatchStats | null {
  // 참가자 찾기
  const participant = match.info.participants.find(
    (p) => p.puuid === targetPuuid
  );

  if (!participant) {
    return null;
  }

  // 맵 정보 파싱
  const getMapName = (gameMode: string) => {
    const mapNames: Record<string, string> = {
      "CLASSIC": "소환사의 협곡",
      "ARAM": "칼바람 나락",
      "ONEFORALL": "단일 챔피언",
      "URF": "U.R.F",
      "TUTORIAL": "튜토리얼",
      "NEXUSBLITZ": "돌격 넥서스",
    };
    return mapNames[gameMode] || gameMode;
  };

  // 아이템 배열 생성 (0이 아닌 아이템만)
  const items = [
    participant.item0,
    participant.item1,
    participant.item2,
    participant.item3,
    participant.item4,
    participant.item5,
  ].filter(itemId => itemId !== 0);

  return {
    matchId: match.metadata.matchId,
    summonerName: participant.summonerName,
    champion: participant.championName,
    damage: participant.totalDamageDealtToChampions,
    cs: participant.totalMinionsKilled + participant.neutralMinionsKilled,
    gold: participant.goldEarned,
    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,
    win: participant.win,
    timestamp: match.info.gameCreation,
    gameMode: match.info.gameMode,
    mapName: getMapName(match.info.gameMode),
    summoner1Id: participant.summoner1Id,
    summoner2Id: participant.summoner2Id,
    items,
    champLevel: participant.champLevel,
  };
}

/**
 * 여러 매치 데이터를 한번에 변환
 */
export function convertRiotMatchesToMatchStats(
  matches: RiotMatch[],
  targetPuuid: string
): MatchStats[] {
  return matches
    .map((match) => convertRiotMatchToMatchStats(match, targetPuuid))
    .filter((stats): stats is MatchStats => stats !== null);
}

/**
 * Riot ID를 소환사 객체로 변환
 */
export function createSummonerFromRiotId(
  gameName: string,
  tagLine: string,
  puuid: string
): Summoner {
  return {
    name: `${gameName}#${tagLine}`,
    puuid,
  };
}

/**
 * 소환사명에서 gameName과 tagLine 분리
 * @param fullName "소환사명#태그" 형식
 * @returns { gameName, tagLine }
 */
export function parseRiotId(fullName: string): {
  gameName: string;
  tagLine: string;
} {
  const parts = fullName.split("#");
  
  if (parts.length === 1) {
    // 태그가 없으면 기본값 "KR1" 사용
    return {
      gameName: parts[0].trim(),
      tagLine: "KR1",
    };
  }
  
  return {
    gameName: parts[0].trim(),
    tagLine: parts[1].trim(),
  };
}

/**
 * 소환사명 유효성 검사
 */
export function validateRiotId(input: string): {
  isValid: boolean;
  message?: string;
} {
  if (!input || input.trim().length === 0) {
    return {
      isValid: false,
      message: "소환사명을 입력해주세요.",
    };
  }

  const { gameName, tagLine } = parseRiotId(input);

  // gameName 검증 (3-16자)
  if (gameName.length < 3 || gameName.length > 16) {
    return {
      isValid: false,
      message: "소환사명은 3-16자여야 합니다.",
    };
  }

  // tagLine 검증 (3-5자)
  if (tagLine.length < 3 || tagLine.length > 5) {
    return {
      isValid: false,
      message: "태그는 3-5자여야 합니다. (예: #KR1)",
    };
  }

  return { isValid: true };
}

