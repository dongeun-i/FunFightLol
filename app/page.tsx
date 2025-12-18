"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SummonerList from "@/components/SummonerList";
import Button from "@/components/Button";
import { Summoner } from "@/lib/types";
import { saveSummoners, getSummoners } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const [summoners, setSummoners] = useState<Summoner[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // SessionStorage에서 기존 소환사 목록 불러오기
    const saved = getSummoners();
    if (saved.length > 0) {
      setSummoners(saved);
    }
  }, []);

  const handleSearch = (summonerName: string) => {
    if (summoners.length >= 5) {
      alert("최대 5명까지만 등록할 수 있습니다.");
      return;
    }
    
    const newSummoner: Summoner = { name: summonerName };
    const updated = [...summoners, newSummoner];
    setSummoners(updated);
    saveSummoners(updated);
  };

  const handleRemove = (index: number) => {
    const updated = summoners.filter((_, i) => i !== index);
    setSummoners(updated);
    saveSummoners(updated);
  };

  const handleNext = () => {
    if (summoners.length < 2) {
      alert("최소 2명 이상의 소환사를 등록해주세요.");
      return;
    }
    // 설정 페이지로 이동
    router.push("/settings");
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-4xl flex-col md:py-16 px-4 sm:px-8 md:px-16 relative">
        {/* 헤더 */}
        <Header />
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 mt-10 sm:mt-12 md:mt-16">
          {/* 큰 로고 */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-3 relative">
              <h1 className="relative inline-block">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
                  FunFight
                </span>
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-amber-500 ml-3 drop-shadow-lg">
                  LoL
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
              </h1>
              
              {/* 물음표 아이콘 버튼 */}
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group z-30"
                aria-label="앱 설명 보기"
              >
                <span className="text-amber-600 dark:text-amber-400 font-bold text-base sm:text-lg">?</span>
                
                {/* 말풍선 툴팁 */}
                {showTooltip && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 sm:w-80 z-[100] animate-fade-in">
                    <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 border-2 border-amber-500/50 rounded-lg p-4 shadow-2xl">
                      {/* 말풍선 꼬리 */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 dark:bg-zinc-800 border-l-2 border-t-2 border-amber-500/50 rotate-45"></div>
                      
                      <p className="text-sm sm:text-base text-zinc-100 leading-relaxed">
                        친구들과 함께 리그 오브 레전드를 더욱 재미있게 즐길 수 있도록 만들어진 보조 도구입니다.
                      </p>
                      <p className="text-xs sm:text-sm text-amber-400/80 mt-2">
                        최대 5명의 소환사를 등록하고 다양한 지표로 친선 경쟁을 즐겨보세요!
                      </p>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* 소환사 검색 */}
          <SearchBar onSearch={handleSearch} />

          {/* 소환사 리스트 */}
          <SummonerList 
            summoners={summoners} 
            onRemove={handleRemove}
            maxSummoners={5}
          />

          {/* 다음 단계 버튼 */}
            <Button 
              onClick={handleNext}
              variant="primary"
              size="lg"
              fullWidth
              className="animate-fade-in mt-6 sm:mt-8 md:mt-10"
              disabled={summoners.length < 2}
            >
              {summoners.length >= 2 ? "설정하기" : "최소 2명 이상 등록해주세요"}
            </Button>
        </div>
      </main>
    </div>
  );
}
