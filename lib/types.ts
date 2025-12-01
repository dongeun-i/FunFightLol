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
  damageTaken: number;
  cs: number;
  turretDamage: number;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  timestamp: number;
}

export interface GameSession {
  summoners: Summoner[];
  challengeOptions: string[]; // 선택된 챌린지 옵션 ID들
  matches: MatchStats[];
  startTime: number;
}

