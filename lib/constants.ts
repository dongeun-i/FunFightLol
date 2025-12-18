import { ChallengeOption } from "./types";

/**
 * 챌린지 옵션 목록
 */
export const CHALLENGE_OPTIONS: ChallengeOption[] = [
  {
    id: "damage",
    name: "딜량",
    description: "가장 높은 딜량을 기록한 소환사",
    icon: "⚔️",
  },
  {
    id: "gold",
    name: "골드 획득량",
    description: "가장 많은 골드를 획득한 소환사",
    icon: "🪙",
  },
  {
    id: "score",
    name: "점수",
    description: "K/D/A/CS에 따른 점수를 계산한 소환사",
    icon: "⭐",
  },
  {
    id: "kda",
    name: "KDA",
    description: "가장 높은 KDA를 기록한 소환사",
    icon: "📊",
  },
];

/**
 * 기본 점수 설정
 */
export const DEFAULT_SCORE_CONFIG = {
  kill: 300,
  death: -100,
  assist: 150,
  cs: 1,
  csPerPoint: 10,
};

/**
 * 챌린지 라벨 매핑
 */
export const CHALLENGE_LABELS: Record<string, string> = {
  damage: "딜량",
  gold: "골드 획득량",
  score: "점수",
  kda: "KDA",
};

/**
 * 최대 소환사 수
 */
export const MAX_SUMMONERS = 5;

/**
 * 최소 소환사 수
 */
export const MIN_SUMMONERS = 2;

