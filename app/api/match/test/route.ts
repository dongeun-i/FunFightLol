/**
 * 테스트용 매치 데이터 조회 API
 * POST /api/match/test
 * 등록된 소환사들의 최근 공통 매치 조회
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMatchIdsByPUUID, getMatchById } from '@/lib/api/riot-api';

export async function POST(request: NextRequest) {
  try {
    const { puuids } = await request.json();

    if (!puuids || !Array.isArray(puuids) || puuids.length === 0) {
      return NextResponse.json(
        { error: 'PUUID 목록이 필요합니다.' },
        { status: 400 }
      );
    }

    // 첫 번째 소환사의 최근 매치 ID 조회 (최대 50개까지 확인)
    const matchIds = await getMatchIdsByPUUID(puuids[0], 50);

    if (matchIds.length === 0) {
      return NextResponse.json(
        { error: '최근 매치를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log(`[Test Match] 총 ${matchIds.length}개의 매치를 검색합니다...`);

    // 각 매치를 확인하여 모든 소환사가 참여한 매치 찾기
    let checkedCount = 0;
    for (const matchId of matchIds) {
      checkedCount++;
      
      try {
        const match = await getMatchById(matchId);
        
        // 매치에 참여한 소환사들의 PUUID 목록
        const participantPuuids = match.info.participants.map(p => p.puuid);
        
        // 모든 소환사가 이 매치에 참여했는지 확인
        const allParticipated = puuids.every(puuid => 
          participantPuuids.includes(puuid)
        );

        if (allParticipated) {
          // 공통 매치를 찾았으면 반환
          const matchDate = new Date(match.info.gameCreation).toLocaleString('ko-KR');
          console.log(`[Test Match] ✅ 공통 매치 발견! (${checkedCount}/${matchIds.length}) - ${matchDate}`);
          return NextResponse.json({ match });
        }
      } catch (error) {
        console.error(`[Test Match] 매치 ${matchId} 조회 실패:`, error);
        // 계속 진행
      }
    }

    // 공통 매치를 찾지 못한 경우
    console.log(`[Test Match] ❌ ${checkedCount}개의 매치 중 공통 매치를 찾지 못했습니다.`);
    return NextResponse.json(
      { 
        error: `최근 ${checkedCount}경기를 확인했지만 모든 소환사가 함께한 매치를 찾을 수 없습니다. 더 최근에 함께 게임을 해주세요.` 
      },
      { status: 404 }
    );

  } catch (error: any) {
    console.error('Test match fetch error:', error);

    return NextResponse.json(
      { error: '매치 데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

