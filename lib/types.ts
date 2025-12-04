export interface Summoner {
  name: string;
  avatar?: string;
  puuid?: string;
}

export interface ChallengeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface MatchStats {
  matchId: string;
  summonerName: string;
  champion: string;
  damage: number;
  cs: number;
  gold: number;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  timestamp: number;
}

export interface Handicap {
  optionId: string;
  summonerName: string;
  value: number; // 핸디캡 값 (예: 1000, -500 등)
}

export interface GameSession {
  summoners: Summoner[];
  challengeOptions: string; // 선택된 챌린지 옵션 ID (단일 선택)
  matches: MatchStats[];
  startTime: number;
  maxMatches?: number; // 최대 판수
  handicaps?: Handicap[]; // 핸디캡 설정
  scoreConfig?: {
    kill: number;
    death: number;
    assist: number;
    cs: number; // CS 몇 개당 몇 점
    csPerPoint: number; // CS 몇 개당 1점 (예: 10이면 CS 10개당 1점)
  };
  invalidMatches?: string[]; // 무효로 처리된 매치 ID 목록
}


