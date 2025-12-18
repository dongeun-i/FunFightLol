/**
 * 소환사 매치 데이터 조회 API 라우트
 * POST /api/summoner/matches
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchSummonerMatches } from '@/lib/api/summoner-service';

export async function POST(request: NextRequest) {
  try {
    const { puuid, count = 3 } = await request.json();

    if (!puuid || typeof puuid !== 'string') {
      return NextResponse.json(
        { error: 'PUUID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 최근 매치 데이터 조회
    const matches = await fetchSummonerMatches(puuid, count);

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error('Matches fetch error:', error);

    let statusCode = 500;
    let errorMessage = '매치 데이터를 불러오는데 실패했습니다.';

    if (error.message.includes('매치 데이터를 불러오는데 실패')) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

