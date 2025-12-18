import { Summoner } from "./types";
import { MAX_SUMMONERS, MIN_SUMMONERS } from "./constants";

/**
 * 소환사 목록 유효성 검사 결과
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * 소환사 추가 가능 여부 확인
 */
export function canAddSummoner(
  currentSummoners: Summoner[]
): ValidationResult {
  if (currentSummoners.length >= MAX_SUMMONERS) {
    return {
      isValid: false,
      message: `최대 ${MAX_SUMMONERS}명까지만 등록할 수 있습니다.`,
    };
  }
  return { isValid: true };
}

/**
 * 게임 시작 가능 여부 확인
 */
export function canStartGame(currentSummoners: Summoner[]): ValidationResult {
  if (currentSummoners.length < MIN_SUMMONERS) {
    return {
      isValid: false,
      message: `최소 ${MIN_SUMMONERS}명 이상의 소환사를 등록해주세요.`,
    };
  }
  return { isValid: true };
}

/**
 * 챌린지 옵션 선택 여부 확인
 */
export function isChallengeSelected(selectedOption: string): ValidationResult {
  if (!selectedOption) {
    return {
      isValid: false,
      message: "챌린지 항목을 선택해주세요.",
    };
  }
  return { isValid: true };
}

/**
 * 소환사명 유효성 검사
 */
export function isValidSummonerName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      message: "소환사명을 입력해주세요.",
    };
  }
  return { isValid: true };
}

/**
 * 중복 소환사 확인
 */
export function isDuplicateSummoner(
  name: string,
  existingSummoners: Summoner[]
): ValidationResult {
  const isDuplicate = existingSummoners.some(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  );
  if (isDuplicate) {
    return {
      isValid: false,
      message: "이미 등록된 소환사입니다.",
    };
  }
  return { isValid: true };
}

