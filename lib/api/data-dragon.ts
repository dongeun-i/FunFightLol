/**
 * Riot Games Data Dragon CDN
 * 정적 게임 데이터 (챔피언, 아이템, 소환사 주문, 프로필 아이콘 등)
 * 
 * 문서: https://developer.riotgames.com/docs/lol#data-dragon
 */

/**
 * Data Dragon 버전 정보
 * 주기적으로 업데이트 필요 (패치마다 변경됨)
 */
const LATEST_VERSION = "14.24.1"; // 2024년 12월 기준

/**
 * Data Dragon CDN 기본 URL
 */
const DATA_DRAGON_BASE_URL = "https://ddragon.leagueoflegends.com/cdn";
const COMMUNITY_DRAGON_BASE_URL = "https://raw.communitydragon.org/latest";

/**
 * 최신 Data Dragon 버전 조회
 */
export async function getLatestVersion(): Promise<string> {
  try {
    const response = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    const versions = await response.json();
    return versions[0]; // 첫 번째가 최신 버전
  } catch (error) {
    console.error("Failed to fetch latest version:", error);
    return LATEST_VERSION; // 폴백
  }
}

/**
 * 프로필 아이콘 이미지 URL
 * @param iconId 프로필 아이콘 ID
 */
export function getProfileIconUrl(iconId: number): string {
  return `${DATA_DRAGON_BASE_URL}/${LATEST_VERSION}/img/profileicon/${iconId}.png`;
}

/**
 * 챔피언 초상화 이미지 URL
 * @param championName 챔피언 영문명 (예: "Ahri", "LeeSin")
 */
export function getChampionIconUrl(championName: string): string {
  return `${DATA_DRAGON_BASE_URL}/${LATEST_VERSION}/img/champion/${championName}.png`;
}

/**
 * 챔피언 스플래시 아트 URL (로딩 화면)
 * @param championId 챔피언 ID
 * @param skinNum 스킨 번호 (0 = 기본 스킨)
 */
export function getChampionSplashUrl(championId: string, skinNum: number = 0): string {
  return `${DATA_DRAGON_BASE_URL}/img/champion/splash/${championId}_${skinNum}.jpg`;
}

/**
 * 챔피언 스프라이트 이미지 URL (게임 내 작은 아이콘)
 * @param championId 챔피언 ID
 */
export function getChampionSquareUrl(championId: string): string {
  return `${COMMUNITY_DRAGON_BASE_URL}/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`;
}

/**
 * 아이템 이미지 URL
 * @param itemId 아이템 ID
 */
export function getItemIconUrl(itemId: number): string {
  return `${DATA_DRAGON_BASE_URL}/${LATEST_VERSION}/img/item/${itemId}.png`;
}

/**
 * 소환사 주문 ID를 이름으로 매핑
 */
const SUMMONER_SPELL_MAP: Record<number, string> = {
  1: "SummonerBoost", // 정화
  3: "SummonerExhaust", // 탈진
  4: "SummonerFlash", // 점멸
  6: "SummonerHaste", // 유체화
  7: "SummonerHeal", // 회복
  11: "SummonerSmite", // 강타
  12: "SummonerTeleport", // 순간이동
  13: "SummonerMana", // 명상
  14: "SummonerDot", // 점화
  21: "SummonerBarrier", // 방어막
  30: "SummonerPoroRecall", // 포로 소환
  31: "SummonerPoroThrow", // 포로 던지기
  32: "SummonerSnowball", // 마크/돌진
  39: "SummonerSnowURFSnowball_Mark", // URF 마크
  54: "Summoner_UltBookPlaceholder", // 궁극기 책 (아레나)
  55: "Summoner_UltBookSmitePlaceholder", // 궁극기 책 강타
};

/**
 * 소환사 주문 ID를 이름으로 변환
 */
export function getSummonerSpellName(spellId: number): string {
  return SUMMONER_SPELL_MAP[spellId] || "SummonerFlash";
}

/**
 * 소환사 주문 이미지 URL
 * @param spellName 소환사 주문 이름 (예: "SummonerFlash", "SummonerDot")
 */
export function getSummonerSpellIconUrl(spellName: string): string {
  return `${DATA_DRAGON_BASE_URL}/${LATEST_VERSION}/img/spell/${spellName}.png`;
}

/**
 * 소환사 주문 ID로 이미지 URL 가져오기
 */
export function getSummonerSpellIconUrlById(spellId: number): string {
  const spellName = getSummonerSpellName(spellId);
  return getSummonerSpellIconUrl(spellName);
}

/**
 * 룬 이미지 URL
 * @param runeId 룬 ID
 */
export function getRuneIconUrl(runeId: number): string {
  return `${COMMUNITY_DRAGON_BASE_URL}/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/styles/${getRunePathFromId(runeId)}`;
}

/**
 * 티어 엠블럼 이미지 URL
 * @param tier 티어 (예: "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER")
 * @param rank 랭크 (예: "I", "II", "III", "IV") - Master 이상은 null
 */
export function getRankEmblemUrl(tier: string, rank?: string): string {
  const tierLower = tier.toLowerCase();
  if (["master", "grandmaster", "challenger"].includes(tierLower)) {
    return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/${tierLower}.png`;
  }
  return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/${tierLower}_${rank?.toLowerCase()}.png`;
}

/**
 * 룬 ID로부터 경로 추출 (내부 헬퍼 함수)
 */
function getRunePathFromId(runeId: number): string {
  // 주 룬 트리
  if (runeId >= 8000 && runeId < 8100) return "precision/electrocute/electrocute.png";
  if (runeId >= 8100 && runeId < 8200) return "domination/electrocute/electrocute.png";
  if (runeId >= 8200 && runeId < 8300) return "sorcery/arcanecomet/arcanecomet.png";
  if (runeId >= 8300 && runeId < 8400) return "inspiration/glacialaugment/glacialaugment.png";
  if (runeId >= 8400 && runeId < 8500) return "resolve/graspoftheundying/graspoftheundying.png";
  
  // 폴백
  return "precision/electrocute/electrocute.png";
}

/**
 * 챔피언 데이터 조회
 */
export async function getChampionData() {
  const version = await getLatestVersion();
  const response = await fetch(
    `${DATA_DRAGON_BASE_URL}/${version}/data/ko_KR/champion.json`
  );
  return response.json();
}

/**
 * 아이템 데이터 조회
 */
export async function getItemData() {
  const version = await getLatestVersion();
  const response = await fetch(
    `${DATA_DRAGON_BASE_URL}/${version}/data/ko_KR/item.json`
  );
  return response.json();
}

/**
 * 소환사 주문 데이터 조회
 */
export async function getSummonerSpellData() {
  const version = await getLatestVersion();
  const response = await fetch(
    `${DATA_DRAGON_BASE_URL}/${version}/data/ko_KR/summoner.json`
  );
  return response.json();
}

/**
 * Data Dragon 이미지 프리로드 (성능 최적화)
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

