"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import MatchRow from "@/components/MatchRow";
import StatChart from "@/components/StatChart";
import Header from "@/components/Header";
import { GameSession, MatchStats } from "@/lib/types";
import { getSession, saveSession } from "@/lib/storage";
import { generateLeaderboard } from "@/lib/calculations";
import { CHALLENGE_LABELS } from "@/lib/constants";

// 더미 매치 데이터 생성 함수
function generateDummyMatch(summonerName: string, matchNumber: number): MatchStats {
  const gameModes = ["CLASSIC", "ARAM"];
  const gameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
  
  // 소환사 주문 (플래시는 거의 필수, 나머지는 랜덤)
  const summonerSpells = [4, 11, 12, 14, 3, 7, 21]; // 플래시, 강타, 순간이동, 점화, 탈진, 힐, 방어막
  const spell1 = 4; // 플래시 고정
  const spell2 = summonerSpells[Math.floor(Math.random() * summonerSpells.length)];
  
  // 랜덤 아이템 (일반적인 아이템 ID들)
  const commonItems = [3153, 3006, 3031, 3094, 3033, 3036, 3074, 3078, 3089, 3100, 3135, 3142, 3508];
  const itemCount = Math.floor(Math.random() * 3) + 3; // 3~5개 아이템
  const items = Array(itemCount)
    .fill(0)
    .map(() => commonItems[Math.floor(Math.random() * commonItems.length)]);
  
  return {
    matchId: `match-${Date.now()}-${matchNumber}`,
    summonerName,
    champion: ["Aatrox", "Ahri", "Yasuo", "Jinx", "Thresh"][Math.floor(Math.random() * 5)],
    damage: Math.floor(Math.random() * 50000) + 10000,
    cs: Math.floor(Math.random() * 200) + 100,
    gold: Math.floor(Math.random() * 15000) + 8000,
    kills: Math.floor(Math.random() * 15),
    deaths: Math.floor(Math.random() * 10),
    assists: Math.floor(Math.random() * 20),
    win: Math.random() > 0.5,
    timestamp: Date.now() - (matchNumber * 1000 * 60 * 30), // 30분 간격
    gameMode,
    mapName: gameMode === "CLASSIC" ? "소환사의 협곡" : "칼바람 나락",
    summoner1Id: spell1,
    summoner2Id: spell2,
    items,
    champLevel: Math.floor(Math.random() * 6) + 13, // 13~18 레벨
  };
}

export default function GamePage() {
  const router = useRouter();
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = getSession();
    if (!saved || !saved.summoners || saved.summoners.length === 0) {
      router.push("/");
      return;
    }
    if (!saved.challengeOptions || saved.challengeOptions === "") {
      router.push("/settings");
      return;
    }

    const gameSession: GameSession = {
      summoners: saved.summoners || [],
      challengeOptions: saved.challengeOptions || "",
      matches: saved.matches || [],
      startTime: saved.startTime || Date.now(),
      maxMatches: saved.maxMatches,
      scoreConfig: saved.scoreConfig,
      handicaps: saved.handicaps,
      invalidMatches: saved.invalidMatches || [],
      testMatches: saved.testMatches,
    };

    setSession(gameSession);
    setIsLoading(false);

    // 테스트 모드: testMatches가 있고 matches가 비어있으면 자동으로 추가
    if (saved.testMatches && saved.testMatches.length > 0 && (!saved.matches || saved.matches.length === 0)) {
      console.log('[Game Page] 테스트 매치 감지, 1초 후 자동 추가...', saved.testMatches);
      setTimeout(() => {
        console.log('[Game Page] 테스트 매치 추가 중...');
        
        const updatedSession: GameSession = {
          ...gameSession,
          matches: saved.testMatches!,
        };

        setSession(updatedSession);
        saveSession(updatedSession);
        console.log('[Game Page] 테스트 매치 추가 완료!');
      }, 1000); // 1초 후 자동 추가
    }
  }, [router]);

  const handleRefresh = () => {
    if (!session) return;

    // 최대 판수 체크
    if (session.maxMatches && session.matches.length >= session.maxMatches) {
      alert(`최대 판수(${session.maxMatches}판)에 도달했습니다.`);
      return;
    }

    // 더미 매치 데이터 추가 (실제로는 API 호출)
    // 같은 매치의 모든 플레이어는 같은 timestamp와 같은 승패를 가져야 함
    const matchTimestamp = Date.now() - (session.matches.length * 1000 * 60 * 30);
    const matchWin = Math.random() > 0.5; // 같은 매치의 모든 플레이어는 같은 승패
    const newMatches: MatchStats[] = session.summoners.map((summoner, index) => {
      const match = generateDummyMatch(summoner.name, session.matches.length + 1);
      // 같은 매치의 모든 플레이어는 같은 timestamp와 같은 승패를 가짐
      match.timestamp = matchTimestamp;
      match.win = matchWin;
      return match;
    });

    const updatedSession: GameSession = {
      ...session,
      matches: [...session.matches, ...newMatches],
    };

    setSession(updatedSession);
    saveSession(updatedSession);
  };

  const handleEndGame = () => {
    router.push("/result");
  };

  if (isLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-black dark:text-zinc-50">로딩 중...</div>
      </div>
    );
  }

  const handleToggleInvalid = (matchId: string) => {
    if (!session) return;
    
    const invalidMatches = session.invalidMatches || [];
    const isInvalid = invalidMatches.includes(matchId);
    
    const updatedInvalidMatches = isInvalid
      ? invalidMatches.filter(id => id !== matchId)
      : [...invalidMatches, matchId];
    
    const updatedSession: GameSession = {
      ...session,
      invalidMatches: updatedInvalidMatches,
    };
    
    setSession(updatedSession);
    saveSession(updatedSession);
  };

  // 리더보드 조회 (리팩토링된 함수 사용)
  const leaderboard = generateLeaderboard(session);

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-7xl flex-col md:py-16 px-4 sm:px-8 md:px-16 relative">
        {/* 헤더 */}
        <Header />
        
        {/* 페이지 헤더 */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-2">
            게임 진행 중
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            매치 수: {(() => {
              const invalidMatches = session.invalidMatches || [];
              const validMatches = new Set(
                session.matches
                  .filter(m => !invalidMatches.includes(m.matchId))
                  .map(m => m.timestamp)
              );
              return validMatches.size;
            })()} / 참가자: {session.summoners.length}명
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 mb-6 sm:mb-8">
          <Button onClick={handleRefresh} variant="secondary" size="md" className="flex-1">
            새로고침 (더미 매치 추가)
          </Button>
          <Button onClick={handleEndGame} variant="primary" size="md" className="flex-1">
            게임 종료
          </Button>
        </div>

        {/* 챌린지 리더보드 */}
        {session.challengeOptions && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-medium text-black dark:text-zinc-50 mb-3 sm:mb-4">
              챌린지 리더보드
            </h2>
            <div className="p-3 sm:p-4 md:p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-base sm:text-lg font-semibold text-black dark:text-zinc-50 mb-3 sm:mb-4">
                {CHALLENGE_LABELS[session.challengeOptions]}
              </h3>
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                {leaderboard.map((stat, index) => {
                  const firstPlaceValue = leaderboard[0]?.total || 0;
                  const gap = index > 0 && firstPlaceValue > 0 ? firstPlaceValue - stat.total : 0;
                  
                  return (
                    <div
                      key={stat.summoner.name}
                      className="flex items-center justify-between p-2 sm:p-0"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <span
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
                            index === 0
                              ? "bg-yellow-500 text-white"
                              : index === 1
                              ? "bg-zinc-400 text-white"
                              : index === 2
                              ? "bg-orange-600 text-white"
                              : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="text-sm sm:text-base text-black dark:text-zinc-50 truncate">
                          {stat.summoner.name}
                        </span>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className="text-sm sm:text-base font-semibold text-black dark:text-zinc-50">
                          {session.challengeOptions === "kda"
                            ? stat.total.toFixed(2)
                            : stat.total.toLocaleString()}
                        </span>
                        {gap > 0 && (
                          <span className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">
                            {session.challengeOptions === "kda"
                              ? `(-${gap.toFixed(2)})`
                              : `(-${gap.toLocaleString()})`}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* 미니 그래프 */}
              {session.matches.length > 0 && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  <StatChart
                    data={leaderboard.map((stat) => ({
                      name: stat.summoner.name.length > 6 
                        ? stat.summoner.name.substring(0, 6) + "..." 
                        : stat.summoner.name,
                      value: session.challengeOptions === "kda" 
                        ? parseFloat(stat.total.toFixed(2)) 
                        : stat.total,
                    }))}
                    type="bar"
                    dataKey="value"
                    color={
                      session.challengeOptions === "damage" ? "#ef4444" :
                      session.challengeOptions === "gold" ? "#f59e0b" :
                      session.challengeOptions === "score" ? "#a855f7" :
                      "#3b82f6"
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 매치 히스토리 */}
        <div>
          <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-4">
            매치 히스토리
          </h2>
          {session.matches.length === 0 ? (
            <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">
              아직 매치가 없습니다. 새로고침 버튼을 눌러 매치를 추가하세요.
            </div>
          ) : (
            <div>
              {(() => {
                // 매치를 그룹화 (같은 timestamp를 가진 매치들을 하나로 묶음)
                const matchGroups = new Map<number, MatchStats[]>();
                session.matches
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .forEach((match) => {
                    const key = match.timestamp;
                    if (!matchGroups.has(key)) {
                      matchGroups.set(key, []);
                    }
                    matchGroups.get(key)!.push(match);
                  });

                const sortedGroups = Array.from(matchGroups.entries())
                  .sort((a, b) => b[0] - a[0]); // 최신 매치가 먼저

                return sortedGroups.map(([timestamp, matches], index) => {
                  const matchId = matches[0]?.matchId || '';
                  const isInvalid = session.invalidMatches?.includes(matchId) || false;
                  
                  return (
                    <MatchRow
                      key={timestamp}
                      matches={matches}
                      challengeOptions={[session.challengeOptions]}
                      matchNumber={sortedGroups.length - index}
                      isInvalid={isInvalid}
                      onToggleInvalid={() => handleToggleInvalid(matchId)}
                    />
                  );
                });
              })()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

