"use client";

interface SummonerCardProps {
  name: string;
  avatar?: string;
  onRemove?: () => void;
  index: number;
}

export default function SummonerCard({ 
  name, 
  avatar, 
  onRemove,
  index 
}: SummonerCardProps) {
  return (
    <li className="flex flex-col gap-2 items-center justify-center flex-shrink-0 group relative animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="relative p-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800 rounded-full flex items-center justify-center overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
          {avatar ? (
            <img 
              src={avatar} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl md:text-2xl">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs sm:text-sm"
            aria-label={`${name} 제거`}
          >
            ×
          </button>
        )}
      </div>
      <span className="text-sm sm:text-base text-black dark:text-zinc-50 font-medium max-w-[80px] sm:max-w-[100px] truncate">
        {name}
      </span>
    </li>
  );
}

