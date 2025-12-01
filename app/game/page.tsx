"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import MatchRow from "@/components/MatchRow";
import StatChart from "@/components/StatChart";
import { GameSession, MatchStats } from "@/lib/types";
import { getSession, saveSession } from "@/lib/storage";

// 더미 매치 데이터 생성 함수
function generateDummyMatch(summonerName: string, matchNumber: number): MatchStats {
  return {
    matchId: `match-${Date.now()}-${matchNumber}`,
    summonerName,
    champion: ["Aatrox", "Ahri", "Yasuo", "Jinx", "Thresh"][Math.floor(Math.random() * 5)],
    damage: Math.floor(Math.random() * 50000) + 10000,
    damageTaken: Math.floor(Math.random() * 30000) + 10000,
    cs: Math.floor(Math.random() * 200) + 100,
    turretDamage: Math.floor(Math.random() * 5000) + 1000,
    kills: Math.floor(Math.random() * 15),
    deaths: Math.floor(Math.random() * 10),
    assists: Math.floor(Math.random() * 20),
    win: Math.random() > 0.5,
    timestamp: Date.now() - (matchNumber * 1000 * 60 * 30), // 30분 간격
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
    if (!saved.challengeOptions || saved.challengeOptions.length === 0) {
      router.push("/settings");
      return;
    }

    const gameSession: GameSession = {
      summoners: saved.summoners || [],
      challengeOptions: saved.challengeOptions || [],
      matches: saved.matches || [],
      startTime: saved.startTime || Date.now(),
    };

    setSession(gameSession);
    setIsLoading(false);
  }, [router]);

  const handleRefresh = () => {
    if (!session) return;

    // 더미 매치 데이터 추가 (실제로는 API 호출)
    // 같은 매치의 모든 플레이어는 같은 timestamp를 가져야 함
    const matchTimestamp = Date.now() - (session.matches.length * 1000 * 60 * 30);
    const newMatches: MatchStats[] = session.summoners.map((summoner, index) => {
      const match = generateDummyMatch(summoner.name, session.matches.length + 1);
      // 같은 매치의 모든 플레이어는 같은 timestamp를 가짐
      match.timestamp = matchTimestamp;
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-black dark:text-zinc-50">로딩 중...</div>
      </div>
    );
  }

  // 챌린지별 통계 계산
  const getLeaderboard = (optionId: string) => {
    const stats = session.summoners.map((summoner) => {
      const summonerMatches = session.matches.filter(
        (m) => m.summonerName === summoner.name
      );
      let total = 0;

      switch (optionId) {
        case "damage":
          total = summonerMatches.reduce((sum, m) => sum + m.damage, 0);
          break;
        case "damageTaken":
          total = summonerMatches.reduce((sum, m) => sum + m.damageTaken, 0);
          break;
        case "cs":
          total = summonerMatches.reduce((sum, m) => sum + m.cs, 0);
          break;
        case "turretDamage":
          total = summonerMatches.reduce((sum, m) => sum + m.turretDamage, 0);
          break;
        case "kda":
          const kills = summonerMatches.reduce((sum, m) => sum + m.kills, 0);
          const deaths = summonerMatches.reduce((sum, m) => sum + m.deaths, 0);
          const assists = summonerMatches.reduce((sum, m) => sum + m.assists, 0);
          total = deaths === 0 ? kills + assists : (kills + assists) / deaths;
          break;
      }

      return { summoner, total, matches: summonerMatches.length };
    });

    return stats.sort((a, b) => b.total - a.total);
  };

  const challengeLabels: Record<string, string> = {
    damage: "딜량",
    damageTaken: "받은 피해량",
    cs: "CS",
    turretDamage: "포탑 기여도",
    kda: "KDA",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-50 font-sans dark:from-black dark:via-zinc-950 dark:to-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col py-8 sm:py-16 px-4 sm:px-8 bg-white dark:bg-black relative shadow-xl dark:shadow-zinc-900/50">
        {/* 다크모드 토글 버튼 */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
          <ThemeToggle />
        </div>

        {/* 헤더 */}
        <div className="mb-6 sm:mb-8 mt-12 sm:mt-16">
          <h1 className="text-2xl sm:text-3xl font-semibold text-black dark:text-zinc-50 mb-2">
            게임 진행 중
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            매치 수: {session.matches.length} / 참가자: {session.summoners.length}명
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 mb-6 sm:mb-8">
          <Button onClick={handleRefresh} variant="secondary" className="flex-1">
            새로고침 (더미 매치 추가)
          </Button>
          <Button onClick={handleEndGame} variant="primary" className="flex-1">
            게임 종료
          </Button>
        </div>

        {/* 챌린지별 리더보드 */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-4">
            챌린지 리더보드
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {session.challengeOptions.map((optionId) => {
              const leaderboard = getLeaderboard(optionId);
              return (
                <div
                  key={optionId}
                  className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                >
                  <h3 className="font-semibold text-black dark:text-zinc-50 mb-3">
                    {challengeLabels[optionId]}
                  </h3>
                  <div className="space-y-2 mb-3">
                    {leaderboard.map((stat, index) => (
                      <div
                        key={stat.summoner.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
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
                          <span className="text-black dark:text-zinc-50">
                            {stat.summoner.name}
                          </span>
                        </div>
                        <span className="font-semibold text-black dark:text-zinc-50">
                          {optionId === "kda"
                            ? stat.total.toFixed(2)
                            : stat.total.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* 미니 그래프 */}
                  {session.matches.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                      <StatChart
                        data={leaderboard.map((stat) => ({
                          name: stat.summoner.name.length > 6 
                            ? stat.summoner.name.substring(0, 6) + "..." 
                            : stat.summoner.name,
                          value: optionId === "kda" 
                            ? parseFloat(stat.total.toFixed(2)) 
                            : stat.total,
                        }))}
                        type="bar"
                        dataKey="value"
                        color={
                          optionId === "damage" ? "#ef4444" :
                          optionId === "damageTaken" ? "#3b82f6" :
                          optionId === "cs" ? "#10b981" :
                          optionId === "turretDamage" ? "#f59e0b" :
                          "#a855f7"
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

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

                return sortedGroups.map(([timestamp, matches], index) => (
                  <MatchRow
                    key={timestamp}
                    matches={matches}
                    challengeOptions={session.challengeOptions}
                    matchNumber={sortedGroups.length - index}
                  />
                ));
              })()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

