"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import StatChart from "@/components/StatChart";
import ComparisonChart from "@/components/ComparisonChart";
import Header from "@/components/Header";
import { GameSession } from "@/lib/types";
import { getSession, clearSession } from "@/lib/storage";
import {
  generateLeaderboard,
  getOverallWinner as getWinner,
  calculateGameDuration,
} from "@/lib/calculations";
import { CHALLENGE_LABELS } from "@/lib/constants";

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

  // 리팩토링된 함수 사용
  const leaderboard = session ? generateLeaderboard(session) : [];
  const overallWinner = session ? getWinner(session) : null;
  const gameDuration = session ? calculateGameDuration(session.startTime) : 0;

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

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-7xl flex-col py-8 sm:py-16 px-4 sm:px-8 relative">
        {/* 헤더 */}
        <Header />
        
        <div className="mt-20 sm:mt-24">
        {/* 페이지 헤더 */}
        <div className="mb-8 sm:mb-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
            게임 결과
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
            {/* <div className="text-4xl mb-2">👑</div> */}
            <h2 className="text-2xl font-bold text-white mb-1">종합 우승</h2>
            <p className="text-xl text-white/90 mb-2">{overallWinner.name}</p>
            <p className="text-sm text-white/80">총점: {overallWinner.score}점</p>
          </div>
        )}

        {/* 챌린지 결과 */}
        {session.challengeOptions && (
          <div className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-zinc-50 mb-3 sm:mb-4">
              챌린지 결과
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
                      className={`p-2 sm:p-3 rounded-lg flex items-center justify-between ${
                        index === 0
                          ? "bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400"
                          : "bg-white dark:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
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
                        <div className="min-w-0">
                          <div className="text-sm sm:text-base font-semibold text-black dark:text-zinc-50 truncate">
                            {stat.summoner.name}
                          </div>
                          <div className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400">
                            {stat.matches}판 • 승률 {stat.winRate.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm sm:text-base font-bold text-black dark:text-zinc-50">
                          {session.challengeOptions === "kda"
                            ? stat.average.toFixed(2)
                            : stat.total.toLocaleString()}
                        </div>
                        {gap > 0 && (
                          <div className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">
                            {session.challengeOptions === "kda"
                              ? `(-${gap.toFixed(2)})`
                              : `(-${gap.toLocaleString()})`}
                          </div>
                        )}
                        {session.challengeOptions !== "kda" && session.challengeOptions !== "score" && gap === 0 && (
                          <div className="text-[10px] sm:text-xs text-zinc-600 dark:text-zinc-400">
                            평균: {stat.average.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* 결과 그래프 */}
              <div className="pt-3 sm:pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <StatChart
                  data={leaderboard.map((stat) => ({
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

