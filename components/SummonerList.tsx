"use client";

import { useState } from "react";
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
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const emptySlots = maxSummoners - summoners.length;

  const handleRemove = (index: number) => {
    setRemovingIndex(index);
    setTimeout(() => {
      if (onRemove) {
        onRemove(index);
      }
      setRemovingIndex(null);
    }, 300); // 애니메이션 시간과 동일
  };

  return (
    <div className=" py-2 box-sizing: content-box flex justify-center">
      <ul className="flex flex-row items-start justify-center gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-hide px-1">
        {summoners.map((summoner, index) => (
          <SummonerCard
            key={`${summoner.name}-${index}`}
            name={summoner.name}
            avatar={summoner.avatar}
            onRemove={onRemove ? () => handleRemove(index) : undefined}
            index={index}
            isRemoving={removingIndex === index}
          />
        ))}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <li 
            key={`empty-${index}`}
            className="flex flex-col gap-2 items-center justify-center flex-shrink-0 w-[80px] sm:w-[100px] md:w-[120px]"
          >
            <div className="relative w-full flex justify-center items-center" style={{ paddingTop: '12px', paddingRight: '12px', paddingBottom: '8px', paddingLeft: '12px' }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center flex-shrink-0">
                <span className="text-zinc-400 dark:text-zinc-600 text-2xl sm:text-3xl md:text-4xl">+</span>
              </div>
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

