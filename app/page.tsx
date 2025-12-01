"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SummonerList from "@/components/SummonerList";
import Button from "@/components/Button";
import { Summoner } from "@/lib/types";
import { saveSummoners, getSummoners } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const [summoners, setSummoners] = useState<Summoner[]>([]);

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-50 font-sans dark:from-black dark:via-zinc-950 dark:to-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col py-8 sm:py-16 md:py-32 px-4 sm:px-8 md:px-16 bg-white dark:bg-black relative shadow-xl dark:shadow-zinc-900/50">
        {/* 다크모드 토글 버튼 */}
        <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-10">
          <ThemeToggle />
        </div>

        {/* 헤더 */}
        <Header />

        {/* 소환사 검색 */}
        <SearchBar onSearch={handleSearch} />

        {/* 소환사 리스트 */}
        <SummonerList 
          summoners={summoners} 
          onRemove={handleRemove}
          maxSummoners={5}
        />

        {/* 다음 단계 버튼 */}
        <div className="mt-auto pt-4">
          <Button 
            onClick={handleNext}
            variant="primary"
            size="lg"
            fullWidth
            className="animate-fade-in"
            disabled={summoners.length < 2}
          >
            {summoners.length >= 2 ? "설정하기" : "최소 2명 이상 등록해주세요"}
          </Button>
        </div>
      </main>
    </div>
  );
}
