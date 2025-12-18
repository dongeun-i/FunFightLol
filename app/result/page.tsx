"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import StatChart from "@/components/StatChart";
import ComparisonChart from "@/components/ComparisonChart";
import Header from "@/components/Header";
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
      challengeOptions: saved.challengeOptions || "",
      matches: saved.matches || [],
      startTime: saved.startTime || Date.now(),
      maxMatches: saved.maxMatches,
      scoreConfig: saved.scoreConfig,
      handicaps: saved.handicaps,
    };

    setSession(gameSession);
    setIsLoading(false);
  }, [router]);

  const getLeaderboard = () => {
    if (!session || !session.challengeOptions) return [];
    
    const invalidMatches = session.invalidMatches || [];
    const optionId = session.challengeOptions;
    const stats = session.summoners.map((summoner) => {
      const summonerMatches = session.matches.filter(
        (m) => m.summonerName === summoner.name && !invalidMatches.includes(m.matchId)
      );
      let total = 0;
      let average = 0;

      switch (optionId) {
        case "damage":
          total = summonerMatches.reduce((sum, m) => sum + m.damage, 0);
          average = summonerMatches.length > 0 ? total / summonerMatches.length : 0;
          break;
        case "gold":
          total = summonerMatches.reduce((sum, m) => sum + m.gold, 0);
          average = summonerMatches.length > 0 ? total / summonerMatches.length : 0;
          break;
        case "score":
          const scoreConfig = session.scoreConfig || { kill: 300, death: -100, assist: 150, cs: 1, csPerPoint: 10 };
          total = summonerMatches.reduce((sum, m) => {
            const kdaScore = (m.kills * scoreConfig.kill) + (m.deaths * scoreConfig.death) + (m.assists * scoreConfig.assist);
            const csScore = Math.floor(m.cs / scoreConfig.csPerPoint) * scoreConfig.cs;
            return sum + kdaScore + csScore;
          }, 0);
          average = summonerMatches.length > 0 ? total / summonerMatches.length : 0;
          break;
        case "kda":
          const kills = summonerMatches.reduce((sum, m) => sum + m.kills, 0);
          const deaths = summonerMatches.reduce((sum, m) => sum + m.deaths, 0);
          const assists = summonerMatches.reduce((sum, m) => sum + m.assists, 0);
          const kdaValue = deaths === 0 ? kills + assists : (kills + assists) / deaths;
          total = parseFloat(kdaValue.toFixed(2));
          average = total;
          break;
      }

      // 핸디캡 적용
      const handicap = session.handicaps?.find(
        (h) => h.optionId === optionId && h.summonerName === summoner.name
      );
      if (handicap) {
        if (optionId === "damage" || optionId === "gold") {
          // 딜량/골드는 %로 적용 (예: 10% = 1.1배)
          total = total * (1 + handicap.value / 100);
          average = summonerMatches.length > 0 ? total / summonerMatches.length : 0;
        } else if (optionId === "kda") {
          // KDA는 직접 더하기
          total = total + handicap.value;
          total = parseFloat(total.toFixed(2));
          average = total;
        } else {
          // 점수는 직접 더하기
          total += handicap.value;
          average = summonerMatches.length > 0 ? total / summonerMatches.length : 0;
        }
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
    if (!session || !session.challengeOptions) return null;

    const leaderboard = getLeaderboard();
    if (leaderboard.length === 0) return null;
    
    return { name: leaderboard[0].summoner.name, score: leaderboard[0].total };
  };

  const handleNewGame = () => {
    clearSession();
    router.push("/");
  };

  if (isLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-black dark:text-zinc-50">로딩 중...</div>
      </div>
    );
  }

  const overallWinner = getOverallWinner();
  const challengeLabels: Record<string, string> = {
    damage: "딜량",
    gold: "골드 획득량",
    score: "점수",
    kda: "KDA",
  };

  const gameDuration = Math.floor((Date.now() - session.startTime) / 1000 / 60);

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-7xl flex-col py-8 sm:py-16 px-4 sm:px-8 relative">
        {/* 헤더 */}
        <Header />
        
        <div className="mt-20 sm:mt-24">
        {/* 페이지 헤더 */}
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            🏆 게임 결과
          </h2>
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

        {/* 챌린지 결과 */}
        {session.challengeOptions && (
          <div className="mb-8 sm:mb-10">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
              챌린지 결과
            </h2>
            <div className="p-4 sm:p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
                {challengeLabels[session.challengeOptions]}
              </h3>
              <div className="space-y-3 mb-4">
                {getLeaderboard().map((stat, index) => {
                  const leaderboard = getLeaderboard();
                  const firstPlaceValue = leaderboard[0]?.total || 0;
                  const gap = index > 0 && firstPlaceValue > 0 ? firstPlaceValue - stat.total : 0;
                  
                  return (
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
                          {session.challengeOptions === "kda"
                            ? stat.average.toFixed(2)
                            : stat.total.toLocaleString()}
                        </div>
                        {gap > 0 && (
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {session.challengeOptions === "kda"
                              ? `(-${gap.toFixed(2)})`
                              : `(-${gap.toLocaleString()})`}
                          </div>
                        )}
                        {session.challengeOptions !== "kda" && session.challengeOptions !== "score" && gap === 0 && (
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            평균: {stat.average.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* 결과 그래프 */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <StatChart
                  data={getLeaderboard().map((stat) => ({
                    name: stat.summoner.name.length > 6 
                      ? stat.summoner.name.substring(0, 6) + "..." 
                      : stat.summoner.name,
                    value: session.challengeOptions === "kda" 
                      ? parseFloat(stat.average.toFixed(2)) 
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
            </div>
          </div>
        )}

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
        </div>
      </main>
    </div>
  );
}

