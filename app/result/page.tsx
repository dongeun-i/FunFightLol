"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import StatChart from "@/components/StatChart";
import ComparisonChart from "@/components/ComparisonChart";
import { GameSession } from "@/lib/types";
import { getSession, clearSession } from "@/lib/storage";

export default function ResultPage() {
  const router = useRouter();
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = getSession();
    if (!saved || !saved.summoners || saved.summoners.length === 0) {
      router.push("/");
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

  const getLeaderboard = (optionId: string) => {
    if (!session) return [];

    const stats = session.summoners.map((summoner) => {
      const summonerMatches = session.matches.filter(
        (m) => m.summonerName === summoner.name
      );
      let total = 0;
      let average = 0;

      switch (optionId) {
        case "damage":
          total = summonerMatches.reduce((sum, m) => sum + m.damage, 0);
          average = summonerMatches.length > 0 ? total / summonerMatches.length : 0;
          break;
        case "damageTaken":
          total = summonerMatches.reduce((sum, m) => sum + m.damageTaken, 0);
          average = summonerMatches.length > 0 ? total / summonerMatches.length : 0;
          break;
        case "cs":
          total = summonerMatches.reduce((sum, m) => sum + m.cs, 0);
          average = summonerMatches.length > 0 ? total / summonerMatches.length : 0;
          break;
        case "turretDamage":
          total = summonerMatches.reduce((sum, m) => sum + m.turretDamage, 0);
          average = summonerMatches.length > 0 ? total / summonerMatches.length : 0;
          break;
        case "kda":
          const kills = summonerMatches.reduce((sum, m) => sum + m.kills, 0);
          const deaths = summonerMatches.reduce((sum, m) => sum + m.deaths, 0);
          const assists = summonerMatches.reduce((sum, m) => sum + m.assists, 0);
          total = deaths === 0 ? kills + assists : (kills + assists) / deaths;
          average = total;
          break;
      }

      const wins = summonerMatches.filter((m) => m.win).length;
      const winRate = summonerMatches.length > 0 ? (wins / summonerMatches.length) * 100 : 0;

      return {
        summoner,
        total,
        average,
        matches: summonerMatches.length,
        wins,
        winRate,
      };
    });

    return stats.sort((a, b) => b.total - a.total);
  };

  const getOverallWinner = () => {
    if (!session) return null;

    const scores: Record<string, number> = {};
    session.challengeOptions.forEach((optionId) => {
      const leaderboard = getLeaderboard(optionId);
      leaderboard.forEach((stat, index) => {
        const points = session.challengeOptions.length - index;
        scores[stat.summoner.name] = (scores[stat.summoner.name] || 0) + points;
      });
    });

    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return winner ? { name: winner[0], score: winner[1] } : null;
  };

  const handleNewGame = () => {
    clearSession();
    router.push("/");
  };

  if (isLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-black dark:text-zinc-50">로딩 중...</div>
      </div>
    );
  }

  const overallWinner = getOverallWinner();
  const challengeLabels: Record<string, string> = {
    damage: "딜량",
    damageTaken: "받은 피해량",
    cs: "CS",
    turretDamage: "포탑 기여도",
    kda: "KDA",
  };

  const gameDuration = Math.floor((Date.now() - session.startTime) / 1000 / 60);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-50 font-sans dark:from-black dark:via-zinc-950 dark:to-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col py-8 sm:py-16 px-4 sm:px-8 bg-white dark:bg-black relative shadow-xl dark:shadow-zinc-900/50">
        {/* 다크모드 토글 버튼 */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
          <ThemeToggle />
        </div>

        {/* 헤더 */}
        <div className="mb-8 sm:mb-10 mt-12 sm:mt-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-zinc-50 mb-4">
            🏆 게임 결과
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>총 매치: {session.matches.length}판</span>
            <span>•</span>
            <span>참가자: {session.summoners.length}명</span>
            <span>•</span>
            <span>진행 시간: {gameDuration}분</span>
          </div>
        </div>

        {/* 종합 우승자 */}
        {overallWinner && (
          <div className="mb-8 sm:mb-10 p-6 bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-600 dark:to-orange-700 rounded-lg text-center animate-fade-in">
            <div className="text-4xl mb-2">👑</div>
            <h2 className="text-2xl font-bold text-white mb-1">종합 우승</h2>
            <p className="text-xl text-white/90 mb-2">{overallWinner.name}</p>
            <p className="text-sm text-white/80">총점: {overallWinner.score}점</p>
          </div>
        )}

        {/* 챌린지별 결과 */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
            챌린지별 결과
          </h2>
          <div className="space-y-6">
            {session.challengeOptions.map((optionId) => {
              const leaderboard = getLeaderboard(optionId);
              return (
                <div
                  key={optionId}
                  className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                >
                  <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
                    {challengeLabels[optionId]}
                  </h3>
                  <div className="space-y-3 mb-4">
                    {leaderboard.map((stat, index) => (
                      <div
                        key={stat.summoner.name}
                        className={`p-3 rounded-lg flex items-center justify-between ${
                          index === 0
                            ? "bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400"
                            : "bg-white dark:bg-zinc-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
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
                          </div>
                          <div>
                            <div className="font-semibold text-black dark:text-zinc-50">
                              {stat.summoner.name}
                            </div>
                            <div className="text-xs text-zinc-600 dark:text-zinc-400">
                              {stat.matches}판 • 승률 {stat.winRate.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-black dark:text-zinc-50">
                            {optionId === "kda"
                              ? stat.average.toFixed(2)
                              : stat.total.toLocaleString()}
                          </div>
                          {optionId !== "kda" && (
                            <div className="text-xs text-zinc-600 dark:text-zinc-400">
                              평균: {stat.average.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* 결과 그래프 */}
                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <StatChart
                      data={leaderboard.map((stat) => ({
                        name: stat.summoner.name.length > 6 
                          ? stat.summoner.name.substring(0, 6) + "..." 
                          : stat.summoner.name,
                        value: optionId === "kda" 
                          ? parseFloat(stat.average.toFixed(2)) 
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
                </div>
              );
            })}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-auto pt-4">
          <Button
            onClick={handleNewGame}
            variant="primary"
            size="lg"
            fullWidth
          >
            새 게임 시작하기
          </Button>
        </div>
      </main>
    </div>
  );
}

