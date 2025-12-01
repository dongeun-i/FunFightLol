"use client";

import SummonerCard from "./SummonerCard";

interface Summoner {
  name: string;
  avatar?: string;
}

interface SummonerListProps {
  summoners: Summoner[];
  onRemove?: (index: number) => void;
  maxSummoners?: number;
}

export default function SummonerList({ 
  summoners, 
  onRemove,
  maxSummoners = 5 
}: SummonerListProps) {
  const emptySlots = maxSummoners - summoners.length;

  return (
    <div className="mb-6 sm:mb-8 md:mb-10 py-2">
      <ul className="flex flex-row items-center justify-start gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {summoners.map((summoner, index) => (
          <SummonerCard
            key={index}
            name={summoner.name}
            avatar={summoner.avatar}
            onRemove={onRemove ? () => onRemove(index) : undefined}
            index={index}
          />
        ))}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <li 
            key={`empty-${index}`}
            className="flex flex-col gap-2 items-center justify-center flex-shrink-0 min-w-[80px] sm:min-w-[100px] md:min-w-[120px]"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] bg-zinc-200 dark:bg-zinc-800 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
              <span className="text-zinc-400 dark:text-zinc-600 text-2xl sm:text-3xl md:text-4xl">+</span>
            </div>
            <span className="text-sm sm:text-base text-zinc-400 dark:text-zinc-600 w-full text-center truncate px-1">
              빈 슬롯
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

