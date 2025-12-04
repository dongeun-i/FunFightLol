"use client";

import { MatchStats } from "@/lib/types";
import PlayerCard from "./PlayerCard";

interface MatchRowProps {
  matches: MatchStats[]; // 같은 매치의 모든 플레이어 데이터
  challengeOptions: string[];
  matchNumber: number;
  isInvalid?: boolean;
  onToggleInvalid?: () => void;
}

export default function MatchRow({ matches, challengeOptions, matchNumber, isInvalid = false, onToggleInvalid }: MatchRowProps) {
  // 승리팀과 패배팀으로 구분
  const winners = matches.filter(m => m.win);
  const losers = matches.filter(m => !m.win);

  // 최대 5명까지 표시 (5명이 풀 사이즈)
  const maxPlayers = 5;
  const totalPlayers = matches.length;
  const isFullSize = totalPlayers >= maxPlayers;

  return (
    <div className={`mb-4 sm:mb-6 ${isInvalid ? 'opacity-50' : ''}`}>
      {/* 매치 헤더 */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm sm:text-base font-semibold ${isInvalid ? 'text-zinc-400 dark:text-zinc-600 line-through' : 'text-black dark:text-zinc-50'}`}>
            매치 #{matchNumber}
          </span>
          {isInvalid && (
            <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
              무효
            </span>
          )}
          <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
            ({winners.length}승 vs {losers.length}패)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onToggleInvalid && (
            <button
              onClick={onToggleInvalid}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                isInvalid
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {isInvalid ? '유효로 변경' : '무효로 설정'}
            </button>
          )}
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            {new Date(matches[0]?.timestamp || Date.now()).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* 플레이어 카드들 */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
        {matches.slice(0, maxPlayers).map((match, index) => (
          <PlayerCard
            key={`${match.matchId}-${match.summonerName}`}
            match={match}
            challengeOptions={challengeOptions}
            isCompact={!isFullSize}
          />
        ))}
        {totalPlayers > maxPlayers && (
          <div className="flex-1 min-w-0 p-3 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
            <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              +{totalPlayers - maxPlayers}명
            </span>
          </div>
        )}
      </div>
    </div>
  );
}


