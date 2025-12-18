/**
 * Riot Games API 클라이언트
 * 
 * API 문서: https://developer.riotgames.com/
 */

// 환경 변수를 함수로 래핑하여 실행 시점에 읽도록 함
const getRiotApiKey = () => process.env.RIOT_API_KEY || process.env.NEXT_PUBLIC_RIOT_API_KEY || "";
const getRiotRegion = () => process.env.RIOT_API_REGION || "kr";

const RIOT_PLATFORM = "asia"; // 아시아 리전 (계정 정보용)

/**
 * API 기본 URL
 */
const getApiBaseUrls = () => ({
  // 계정 정보 (Riot ID 기반)
  account: `https://${RIOT_PLATFORM}.api.riotgames.com`,
  // 게임 데이터 (소환사, 매치 등)
  game: `https://${getRiotRegion()}.api.riotgames.com`,
} as const);

/**
 * API 응답 타입
 */
export interface RiotAccount {
  puuid: string;
  gameName: string; // 소환사명
  tagLine: string; // 태그 (#뒤의 부분)
}

export interface RiotSummoner {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface RiotMatch {
  metadata: {
    matchId: string;
    participants: string[]; // puuid 배열
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameMode: string;
    participants: RiotParticipant[];
  };
}

export interface RiotParticipant {
  puuid: string;
  summonerName: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  totalDamageDealtToChampions: number;
  goldEarned: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  win: boolean;
}

/**
 * API 호출 공통 함수
 */
async function fetchRiotAPI<T>(url: string): Promise<T> {
  const apiKey = getRiotApiKey();
  
  if (!apiKey) {
    throw new Error("RIOT_API_KEY가 설정되지 않았습니다.");
  }
  
  const response = await fetch(url, {
    headers: {
      "X-Riot-Token": apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Riot API Error (${response.status}): ${errorText || response.statusText}`
    );
  }

  return response.json();
}

/**
 * Riot ID로 계정 정보 조회
 * @param gameName 소환사명 (예: "Hide on bush")
 * @param tagLine 태그 (예: "KR1")
 */
export async function getAccountByRiotId(
  gameName: string,
  tagLine: string
): Promise<RiotAccount> {
  const encodedGameName = encodeURIComponent(gameName);
  const encodedTagLine = encodeURIComponent(tagLine);
  const baseUrls = getApiBaseUrls();
  const url = `${baseUrls.account}/riot/account/v1/accounts/by-riot-id/${encodedGameName}/${encodedTagLine}`;
  
  return fetchRiotAPI<RiotAccount>(url);
}

/**
 * PUUID로 소환사 정보 조회
 */
export async function getSummonerByPUUID(puuid: string): Promise<RiotSummoner> {
  const baseUrls = getApiBaseUrls();
  const url = `${baseUrls.game}/lol/summoner/v4/summoners/by-puuid/${puuid}`;
  return fetchRiotAPI<RiotSummoner>(url);
}

/**
 * PUUID로 최근 매치 ID 목록 조회
 * @param puuid 플레이어 고유 ID
 * @param count 조회할 매치 수 (기본 20)
 */
export async function getMatchIdsByPUUID(
  puuid: string,
  count: number = 20
): Promise<string[]> {
  const baseUrls = getApiBaseUrls();
  const url = `${baseUrls.game}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;
  return fetchRiotAPI<string[]>(url);
}

/**
 * 매치 ID로 상세 정보 조회
 */
export async function getMatchById(matchId: string): Promise<RiotMatch> {
  const baseUrls = getApiBaseUrls();
  const url = `${baseUrls.game}/lol/match/v5/matches/${matchId}`;
  return fetchRiotAPI<RiotMatch>(url);
}

/**
 * 여러 매치 정보를 한번에 조회 (순차 처리)
 */
export async function getMatches(matchIds: string[]): Promise<RiotMatch[]> {
  const matches: RiotMatch[] = [];
  
  for (const matchId of matchIds) {
    try {
      const match = await getMatchById(matchId);
      matches.push(match);
      // Rate limiting 방지를 위한 딜레이 (100ms)
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to fetch match ${matchId}:`, error);
    }
  }
  
  return matches;
}

