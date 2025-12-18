"use client";

import { MatchStats } from "@/lib/types";
import { getChampionIconUrl, getItemIconUrl } from "@/lib/api/data-dragon";

interface PlayerCardProps {
  match: MatchStats;
  challengeOptions: string[];
  isCompact?: boolean;
  maxDamage?: number; // 팀 내 최대 딜량 (게이지바용)
  maxGold?: number; // 팀 내 최대 골드 (게이지바용)
}

export default function PlayerCard({ 
  match, 
  challengeOptions, 
  isCompact = false,
  maxDamage = match.damage,
  maxGold = match.gold
}: PlayerCardProps) {
  const getStatValue = (optionId: string) => {
    switch (optionId) {
      case "damage":
        return (match.damage / 1000).toFixed(1) + "k";
      case "gold":
        return (match.gold / 1000).toFixed(1) + "k";
      case "kda":
        const kda = ((match.kills + match.assists) / (match.deaths || 1));
        return kda.toFixed(2);
      case "score":
        return "-";
      default:
        return "-";
    }
  };

  const getStatLabel = (optionId: string) => {
    const labels: Record<string, string> = {
      damage: "딜량",
      gold: "골드",
      kda: "KDA",
      score: "점수",
    };
    return labels[optionId] || optionId;
  };

  // KDA 색상
  const kdaValue = (match.kills + match.assists) / (match.deaths || 1);
  const getKdaColor = () => {
    if (kdaValue >= 5) return "text-amber-500 dark:text-amber-400";
    if (kdaValue >= 3) return "text-green-500 dark:text-green-400";
    if (kdaValue >= 2) return "text-blue-500 dark:text-blue-400";
    return "text-zinc-600 dark:text-zinc-400";
  };

  // 게이지 퍼센트 계산
  const damagePercent = Math.min((match.damage / maxDamage) * 100, 100);
  const goldPercent = Math.min((match.gold / maxGold) * 100, 100);

  // 킬관여율
  const killParticipation = Math.min(Math.round(((match.kills + match.assists) / Math.max(match.kills + match.assists + 5, 10)) * 100), 100);

  // 임시 아이템 데이터 (실제로는 API에서 가져와야 함)
  const items = [3153, 3006, 3031, 3094, 3033, 3036]; // 예시 아이템 ID

  return (
    <div
      className={`flex-1 min-w-[220px] max-w-[320px] rounded-xl border-2 transition-all duration-200 overflow-hidden shadow-lg ${
        match.win
          ? "border-blue-500 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20"
          : "border-red-500 dark:border-red-400 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20"
      }`}
    >
      {/* 승패 헤더 바 */}
      <div className={`px-3 py-2 text-center text-sm font-bold ${
        match.win 
          ? "bg-blue-500 text-white" 
          : "bg-red-500 text-white"
      }`}>
        {match.win ? "승리" : "패배"}
      </div>

      <div className="p-4">
        {/* 챔피언 & 소환사 정보 */}
        <div className="flex items-center gap-3 mb-4">
          {/* 챔피언 이미지 */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-800">
              {match.champion ? (
                <img 
                  src={getChampionIconUrl(match.champion)} 
                  alt={match.champion}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className="hidden w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                {match.champion?.charAt(0) || '?'}
              </div>
            </div>
            {/* 레벨 뱃지 */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-zinc-900 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-zinc-700">
              18
            </div>
          </div>

          {/* 소환사 정보 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-black dark:text-zinc-50 text-base truncate mb-1">
              {match.summonerName}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
              {match.champion}
            </p>
          </div>
        </div>

        {/* KDA - 크게 */}
        <div className="mb-4 bg-white/60 dark:bg-zinc-800/60 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">KDA</span>
            <span className={`text-lg font-bold ${getKdaColor()}`}>
              {kdaValue.toFixed(2)}:1
            </span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-black dark:text-zinc-50">
              <span className="text-blue-600 dark:text-blue-400">{match.kills}</span>
              {" / "}
              <span className="text-red-600 dark:text-red-400">{match.deaths}</span>
              {" / "}
              <span className="text-green-600 dark:text-green-400">{match.assists}</span>
            </span>
          </div>
        </div>

        {/* 아이템 */}
        <div className="mb-4">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">아이템</div>
          <div className="flex gap-1">
            {items.map((itemId, idx) => (
              <div key={idx} className="w-8 h-8 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-800 overflow-hidden">
                <img 
                  src={getItemIconUrl(itemId)} 
                  alt={`Item ${itemId}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
            {/* 와드 (장신구) */}
            <div className="w-8 h-8 rounded border border-amber-500/50 bg-amber-500/20 flex items-center justify-center">
              <span className="text-xs">🔮</span>
            </div>
          </div>
        </div>

        {/* 챌린지 지표 - 크게 강조 */}
        {challengeOptions.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">📊 챌린지 지표</div>
            <div className="space-y-2">
              {challengeOptions.slice(0, 1).map((optionId) => (
                <div
                  key={optionId}
                  className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-2 border-amber-500 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                      {getStatLabel(optionId)}
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-300">
                      {getStatValue(optionId)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 딜량 게이지 바 */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">딜량</span>
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {(match.damage / 1000).toFixed(1)}k
            </span>
          </div>
          <div className="relative h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${damagePercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-end pr-2">
              <span className="text-[10px] font-bold text-white drop-shadow">
                {damagePercent.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* 골드 게이지 바 */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">골드 획득</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {(match.gold / 1000).toFixed(1)}k
            </span>
          </div>
          <div className="relative h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-500"
              style={{ width: `${goldPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-end pr-2">
              <span className="text-[10px] font-bold text-white drop-shadow">
                {goldPercent.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* CS & 킬관여 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-2 text-center">
            <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5">CS</div>
            <div className="text-base font-bold text-black dark:text-zinc-50">
              {match.cs}
            </div>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-500">
              ({(match.cs / 25).toFixed(1)}/분)
            </div>
          </div>
          <div className="bg-white/50 dark:bg-zinc-800/50 rounded-lg p-2 text-center">
            <div className="text-[10px] text-zinc-600 dark:text-zinc-400 mb-0.5">킬관여</div>
            <div className="text-base font-bold text-red-600 dark:text-red-400">
              {killParticipation}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
