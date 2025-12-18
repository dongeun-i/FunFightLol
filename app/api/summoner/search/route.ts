/**
 * 소환사 검색 API 라우트
 * POST /api/summoner/search
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchSummoner } from '@/lib/api/summoner-service';

export async function POST(request: NextRequest) {
  try {
    const { riotId } = await request.json();

    if (!riotId || typeof riotId !== 'string') {
      return NextResponse.json(
        { error: 'Riot ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 소환사 검색
    const result = await searchSummoner(riotId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Summoner search error:', error);

    // 에러 메시지 파싱
    let statusCode = 500;
    let errorMessage = '소환사 검색 중 오류가 발생했습니다.';

    if (error.message.includes('소환사를 찾을 수 없습니다')) {
      statusCode = 404;
      errorMessage = '소환사를 찾을 수 없습니다. Riot ID를 확인해주세요.';
    } else if (error.message.includes('API 키가 유효하지 않습니다')) {
      statusCode = 401;
      errorMessage = 'API 키 오류입니다. 관리자에게 문의해주세요.';
    } else if (error.message.includes('요청이 너무 많습니다')) {
      statusCode = 429;
      errorMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

