import { Handicap } from "./types";

/**
 * 핸디캡을 적용하여 최종 값을 반환
 */
export function applyHandicap(
  value: number,
  handicap: Handicap,
  optionId: string
): number {
  if (optionId === "damage" || optionId === "gold") {
    // 딜량/골드는 %로 적용 (예: 10 입력 시 10% 증가 = 1.1배)
    return value * (1 + handicap.value / 100);
  } else if (optionId === "kda") {
    // KDA는 직접 더하기
    const result = value + handicap.value;
    return parseFloat(result.toFixed(2));
  } else {
    // 점수는 직접 더하기
    return value + handicap.value;
  }
}

/**
 * 핸디캡 단위 레이블 반환
 */
export function getHandicapUnit(optionId: string): string {
  if (optionId === "damage" || optionId === "gold") {
    return "%";
  } else if (optionId === "kda") {
    return "KDA";
  } else {
    return "";
  }
}

/**
 * 핸디캡 placeholder 텍스트 반환
 */
export function getHandicapPlaceholder(optionId: string): string {
  if (optionId === "damage" || optionId === "gold") {
    return "0%";
  } else if (optionId === "kda") {
    return "0.00";
  } else {
    return "0";
  }
}

/**
 * 핸디캡 설명 텍스트 반환
 */
export function getHandicapDescription(optionId: string): string {
  if (optionId === "damage" || optionId === "gold") {
    return "딜량/골드에 비율로 적용됩니다 (예: 10 = 10% 증가)";
  } else if (optionId === "kda") {
    return "KDA에 직접 더해집니다 (예: 1.5 입력 시 KDA +1.5)";
  } else {
    return "점수에 직접 더해집니다";
  }
}

/**
 * 핸디캡 입력 step 값 반환
 */
export function getHandicapStep(optionId: string): string {
  return optionId === "kda" ? "0.01" : "1";
}

