"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import { ChallengeOption } from "@/lib/types";
import { getSummoners, saveSession } from "@/lib/storage";

const CHALLENGE_OPTIONS: ChallengeOption[] = [
  {
    id: "damage",
    name: "딜량",
    description: "가장 높은 딜량을 기록한 소환사",
    icon: "⚔️",
  },
  {
    id: "damageTaken",
    name: "받은 피해량",
    description: "가장 많은 피해를 받은 소환사",
    icon: "🛡️",
  },
  {
    id: "cs",
    name: "CS",
    description: "가장 많은 CS를 획득한 소환사",
    icon: "💰",
  },
  {
    id: "turretDamage",
    name: "포탑 기여도",
    description: "가장 많은 포탑 피해를 입힌 소환사",
    icon: "🏰",
  },
  {
    id: "kda",
    name: "KDA",
    description: "가장 높은 KDA를 기록한 소환사",
    icon: "⭐",
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [summoners, setSummoners] = useState<any[]>([]);

  useEffect(() => {
    const saved = getSummoners();
    if (saved.length === 0) {
      router.push("/");
      return;
    }
    setSummoners(saved);
  }, [router]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleStart = () => {
    if (selectedOptions.length === 0) {
      alert("최소 1개 이상의 챌린지를 선택해주세요.");
      return;
    }

    saveSession({
      challengeOptions: selectedOptions,
      startTime: Date.now(),
      matches: [],
    });

    router.push("/game");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-50 font-sans dark:from-black dark:via-zinc-950 dark:to-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col py-8 sm:py-16 md:py-32 px-4 sm:px-8 md:px-16 bg-white dark:bg-black relative shadow-xl dark:shadow-zinc-900/50">
        {/* 다크모드 토글 버튼 */}
        <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-10">
          <ThemeToggle />
        </div>

        {/* 헤더 */}
        <div className="mb-8 sm:mb-10 mt-12 sm:mt-16 md:mt-0">
          <h1 className="text-2xl sm:text-3xl font-semibold text-black dark:text-zinc-50 mb-2">
            챌린지 설정
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            비교할 지표를 선택해주세요
          </p>
        </div>

        {/* 참가 소환사 미리보기 */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-3">
            참가 소환사 ({summoners.length}명)
          </h2>
          <div className="flex flex-wrap gap-2">
            {summoners.map((summoner, index) => (
              <div
                key={index}
                className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-black dark:text-zinc-50"
              >
                {summoner.name}
              </div>
            ))}
          </div>
        </div>

        {/* 챌린지 옵션 선택 */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-4">
            챌린지 항목 선택
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {CHALLENGE_OPTIONS.map((option) => {
              const isSelected = selectedOptions.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    isSelected
                      ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 scale-105"
                      : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-black dark:text-zinc-50 mb-1">
                        {option.name}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white dark:text-zinc-900"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-auto pt-4 flex gap-3">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            뒤로가기
          </Button>
          <Button
            onClick={handleStart}
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={selectedOptions.length === 0}
          >
            게임 시작
          </Button>
        </div>
      </main>
    </div>
  );
}

