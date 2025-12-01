"use client";

import { MatchStats } from "@/lib/types";

interface MatchCardProps {
  match: MatchStats;
  challengeOptions: string[];
}

export default function MatchCard({ match, challengeOptions }: MatchCardProps) {
  const getStatValue = (optionId: string) => {
    switch (optionId) {
      case "damage":
        return match.damage.toLocaleString();
      case "damageTaken":
        return match.damageTaken.toLocaleString();
      case "cs":
        return match.cs;
      case "turretDamage":
        return match.turretDamage.toLocaleString();
      case "kda":
        return ((match.kills + match.assists) / (match.deaths || 1)).toFixed(2);
      default:
        return "-";
    }
  };

  const getStatLabel = (optionId: string) => {
    const labels: Record<string, string> = {
      damage: "딜량",
      damageTaken: "받은 피해",
      cs: "CS",
      turretDamage: "포탑 피해",
      kda: "KDA",
    };
    return labels[optionId] || optionId;
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
        match.win
          ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-950/20"
          : "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-950/20"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {match.champion.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-black dark:text-zinc-50">
              {match.summonerName}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {match.champion}
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            match.win
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {match.win ? "승리" : "패배"}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
        <div className="text-center">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
            K/D/A
          </div>
          <div className="text-sm font-semibold text-black dark:text-zinc-50">
            {match.kills} / {match.deaths} / {match.assists}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
            CS
          </div>
          <div className="text-sm font-semibold text-black dark:text-zinc-50">
            {match.cs}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
            딜량
          </div>
          <div className="text-sm font-semibold text-black dark:text-zinc-50">
            {match.damage.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
        <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
          챌린지 지표
        </div>
        <div className="flex flex-wrap gap-2">
          {challengeOptions.map((optionId) => (
            <div
              key={optionId}
              className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs"
            >
              <span className="text-zinc-600 dark:text-zinc-400">
                {getStatLabel(optionId)}:
              </span>{" "}
              <span className="font-semibold text-black dark:text-zinc-50">
                {getStatValue(optionId)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

