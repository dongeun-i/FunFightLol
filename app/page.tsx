"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SummonerList from "@/components/SummonerList";
import Button from "@/components/Button";
import { Summoner } from "@/lib/types";
import { saveSummoners, getSummoners } from "@/lib/storage";
import { MAX_SUMMONERS } from "@/lib/constants";
import { canAddSummoner, canStartGame } from "@/lib/validators";
import { searchSummonerClient, getRecentPlayersClient } from "@/lib/client-api";

export default function Home() {
  const router = useRouter();
  const [summoners, setSummoners] = useState<Summoner[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // SessionStorage에서 기존 소환사 목록 불러오기
    const saved = getSummoners();
    if (saved.length > 0) {
      setSummoners(saved);
    }
  }, []);

  const handleSearch = async (riotId: string) => {
    // 입력값 검증
    if (!riotId.trim()) {
      setError("소환사명을 입력해주세요.");
      return;
    }

    // 최대 인원 확인
    const validation = canAddSummoner(summoners);
    if (!validation.isValid) {
      setError(validation.message || "소환사를 추가할 수 없습니다.");
      return;
    }
    
    // 중복 확인
    const isDuplicate = summoners.some(s => s.name === riotId);
    if (isDuplicate) {
      setError("이미 등록된 소환사입니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // API로 소환사 검색 (서버 라우트를 통해)
      const result = await searchSummonerClient(riotId);
      
      const newSummoner: Summoner = { 
        name: result.summoner.name,
        puuid: result.summoner.puuid,
        profileIconId: result.profileIconId,
        summonerLevel: result.summonerLevel,
      };
      
      const updated = [...summoners, newSummoner];
      setSummoners(updated);
      saveSummoners(updated);
      
    } catch (err: any) {
      console.error("Failed to search summoner:", err);
      
      // 에러 메시지 처리
      if (err.message.includes("소환사를 찾을 수 없습니다")) {
        setError("소환사를 찾을 수 없습니다. Riot ID를 확인해주세요. (예: 소환사명#KR1)");
      } else if (err.message.includes("API 키가 유효하지 않습니다")) {
        setError("API 키 오류입니다. 관리자에게 문의해주세요.");
      } else if (err.message.includes("요청이 너무 많습니다")) {
        setError("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError("소환사 검색 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (index: number) => {
    const updated = summoners.filter((_, i) => i !== index);
    setSummoners(updated);
    saveSummoners(updated);
  };

  const handleLoadRecentPlayers = async () => {
    if (summoners.length === 0) {
      setError("먼저 소환사를 한 명 이상 등록해주세요.");
      return;
    }

    setIsLoadingRecent(true);
    setError(null);

    try {
      // 첫 번째 소환사의 최근 함께한 플레이어 조회
      const firstSummoner = summoners[0];
      if (!firstSummoner.puuid) {
        setError("소환사 정보가 올바르지 않습니다.");
        return;
      }

      const recentPlayers = await getRecentPlayersClient(firstSummoner.puuid, 3);

      if (recentPlayers.length === 0) {
        setError("최근 함께한 플레이어를 찾을 수 없습니다.");
        return;
      }

      // 이미 등록된 소환사와 최대 인원 체크
      const availableSlots = MAX_SUMMONERS - summoners.length;
      const playersToAdd = recentPlayers
        .filter(player => !summoners.some(s => s.puuid === player.puuid))
        .slice(0, availableSlots);

      if (playersToAdd.length === 0) {
        setError("추가할 수 있는 새로운 플레이어가 없습니다.");
        return;
      }

      // 소환사 목록에 추가
      const newSummoners: Summoner[] = playersToAdd.map(player => ({
        name: player.name,
        puuid: player.puuid,
        profileIconId: player.profileIconId,
        summonerLevel: player.summonerLevel,
      }));

      const updated = [...summoners, ...newSummoners];
      setSummoners(updated);
      saveSummoners(updated);

      setError(null);
    } catch (err: any) {
      console.error("Failed to load recent players:", err);
      setError("최근 플레이어를 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoadingRecent(false);
    }
  };

  const handleNext = () => {
    const validation = canStartGame(summoners);
    if (!validation.isValid) {
      alert(validation.message);
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
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          {/* 최근 함께한 친구 불러오기 버튼 */}
          {summoners.length > 0 && summoners.length < MAX_SUMMONERS && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadRecentPlayers}
                disabled={isLoadingRecent}
                className="px-4 py-2 text-sm sm:text-base bg-amber-500/10 hover:bg-amber-500/20 border-2 border-amber-500/50 hover:border-amber-500 rounded-lg text-amber-600 dark:text-amber-400 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                {isLoadingRecent ? '불러오는 중...' : '최근 함께한 친구 불러오기'}
              </button>
            </div>
          )}
          
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 animate-fade-in">
              <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">{error}</p>
            </div>
          )}

          {/* 소환사 리스트 */}
          <SummonerList 
            summoners={summoners} 
            onRemove={handleRemove}
            maxSummoners={MAX_SUMMONERS}
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
