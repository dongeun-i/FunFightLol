/**
 * 최근 함께 플레이한 소환사 목록 조회 API
 * POST /api/summoner/recent-players
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  getMatchIdsByPUUID, 
  getMatches, 
  getSummonerByPUUID 
} from '@/lib/api/riot-api';

export async function POST(request: NextRequest) {
  try {
    const { puuid, count = 3 } = await request.json();

    if (!puuid || typeof puuid !== 'string') {
      return NextResponse.json(
        { error: 'PUUID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 1. 최근 매치 ID 조회
    const matchIds = await getMatchIdsByPUUID(puuid, count);

    if (matchIds.length === 0) {
      return NextResponse.json({ players: [] });
    }

    // 2. 매치 상세 정보 조회
    const matches = await getMatches(matchIds);

    // 3. 같은 팀에서 플레이한 소환사들 추출
    const recentPlayerPuuids = new Set<string>();
    
    for (const match of matches) {
      // 현재 소환사의 팀 찾기
      const currentPlayer = match.info.participants.find(p => p.puuid === puuid);
      if (!currentPlayer) continue;

      const currentTeam = currentPlayer.teamId;

      // 같은 팀의 다른 소환사들 추가
      match.info.participants
        .filter(p => p.teamId === currentTeam && p.puuid !== puuid)
        .forEach(p => recentPlayerPuuids.add(p.puuid));
    }

    // 4. 각 소환사의 정보 조회 (중복 제거)
    const uniquePuuids = Array.from(recentPlayerPuuids).slice(0, 10); // 최대 10명
    const playerInfos = await Promise.allSettled(
      uniquePuuids.map(async (playerPuuid) => {
        const summonerInfo = await getSummonerByPUUID(playerPuuid);
        return {
          puuid: playerPuuid,
          name: summonerInfo.name,
          profileIconId: summonerInfo.profileIconId,
          summonerLevel: summonerInfo.summonerLevel,
        };
      })
    );

    // 성공한 결과만 추출
    const players = playerInfos
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);

    return NextResponse.json({ players });
  } catch (error: any) {
    console.error('Recent players fetch error:', error);

    return NextResponse.json(
      { error: '최근 플레이어 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

