"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Header from "@/components/Header";
import { Handicap, MatchStats } from "@/lib/types";
import { getSummoners, saveSession } from "@/lib/storage";
import { CHALLENGE_OPTIONS, DEFAULT_SCORE_CONFIG } from "@/lib/constants";
import {
  getHandicapUnit,
  getHandicapPlaceholder,
  getHandicapDescription,
  getHandicapStep,
} from "@/lib/handicap";
import { isChallengeSelected } from "@/lib/validators";
import { getTestMatchClient } from "@/lib/client-api";
import { convertRiotMatchesToMatchStats } from "@/lib/api/riot-adapter";

export default function SettingsPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [summoners, setSummoners] = useState<any[]>([]);
  const [maxMatches, setMaxMatches] = useState<number>(0); // 0이면 무제한
  const [scoreConfig, setScoreConfig] = useState(DEFAULT_SCORE_CONFIG);
  const [handicaps, setHandicaps] = useState<Record<string, number>>({}); // { summonerName: value }
  const [showHandicap, setShowHandicap] = useState<boolean>(false);
  const [isScoreConfigVisible, setIsScoreConfigVisible] = useState<boolean>(false);
  const [isHandicapVisible, setIsHandicapVisible] = useState<boolean>(false);
  const [isHandicapPanelVisible, setIsHandicapPanelVisible] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipStep, setTooltipStep] = useState<number>(1);
  const [isLoadingTest, setIsLoadingTest] = useState<boolean>(false);
  const scoreConfigRef = useRef<HTMLDivElement>(null);
  const handicapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = getSummoners();
    if (saved.length === 0) {
      router.push("/");
      return;
    }
    setSummoners(saved);
  }, [router]);

  // 바깥 클릭 시 툴팁 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  const toggleOption = (optionId: string) => {
    const wasSelected = selectedOption === optionId;
    
    // 점수 설정이 사라질 때 애니메이션
    if (wasSelected && optionId === "score") {
      setIsScoreConfigVisible(false);
      setTimeout(() => {
        setSelectedOption("");
      }, 300);
      return;
    }
    
    // 다른 항목 선택 시 점수 설정이 사라질 때 애니메이션
    if (selectedOption === "score" && optionId !== "score") {
      setIsScoreConfigVisible(false);
      setTimeout(() => {
        setSelectedOption(optionId);
        setIsScoreConfigVisible(false);
      }, 300);
      return;
    }
    
    setSelectedOption(prev => prev === optionId ? "" : optionId);
    
    // 점수를 선택했을 때 자동 스크롤
    if (optionId === "score" && !wasSelected) {
      setIsScoreConfigVisible(true);
      if (scoreConfigRef.current) {
        setTimeout(() => {
          const element = scoreConfigRef.current;
          if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px 위에 위치하도록
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }, 150);
      }
    }
  };

  // 챌린지 항목이 선택되면 핸디캡 설정 섹션으로 스크롤
  useEffect(() => {
    if (selectedOption && selectedOption !== "score") {
      setIsHandicapVisible(true);
      if (handicapRef.current) {
        setTimeout(() => {
          const element = handicapRef.current;
          if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 100;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }, 200);
      }
    } else if (!selectedOption && isHandicapVisible) {
      setIsHandicapVisible(false);
      setTimeout(() => {
        setIsHandicapVisible(false);
      }, 300);
    }
  }, [selectedOption]);

  const updateHandicap = (summonerName: string, value: number) => {
    setHandicaps((prev) => ({
      ...prev,
      [summonerName]: value || 0,
    }));
  };

  const toggleHandicapPanel = () => {
    const willShow = !showHandicap;
    
    if (willShow) {
      setShowHandicap(true);
      setIsHandicapPanelVisible(true);
      // 핸디캡 설정을 열 때 자동 스크롤
      if (handicapRef.current) {
        setTimeout(() => {
          const element = handicapRef.current;
          if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px 위에 위치하도록
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }, 150);
      }
    } else {
      setIsHandicapPanelVisible(false);
      setTimeout(() => {
        setShowHandicap(false);
      }, 300);
    }
  };

  const tooltipSteps = [
    {
      title: "1/4 참가 소환사 확인",
      content: "등록한 소환사 목록을 확인할 수 있습니다. 최대 5명까지 등록 가능합니다."
    },
    {
      title: "2/4 판수 설정",
      content: "최대 판수를 설정할 수 있습니다. 0으로 설정하면 무제한으로 진행됩니다."
    },
    {
      title: "3/4 챌린지 항목 선택",
      content: "비교할 지표를 선택하세요. 딜량, 골드, 점수, KDA 중 하나를 선택할 수 있습니다. 점수를 선택하면 점수 계산 방식을 세부 설정할 수 있습니다."
    },
    {
      title: "4/4 핸디캡 설정",
      content: "각 소환사에게 핸디캡을 부여할 수 있습니다. 딜량/골드는 %로, KDA는 직접 더하기, 점수는 직접 더하기 형식으로 적용됩니다."
    }
  ];

  const handleStart = () => {
    // 유효성 검사
    const validation = isChallengeSelected(selectedOption);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // 핸디캡을 배열 형태로 변환
    const handicapArray: Handicap[] = [];
    Object.entries(handicaps).forEach(([summonerName, value]) => {
      if (value !== 0) {
        handicapArray.push({ optionId: selectedOption, summonerName, value });
      }
    });

    saveSession({
      challengeOptions: selectedOption,
      startTime: Date.now(),
      matches: [],
      maxMatches: maxMatches > 0 ? maxMatches : undefined,
      scoreConfig: selectedOption === "score" ? scoreConfig : undefined,
      handicaps: handicapArray.length > 0 ? handicapArray : undefined,
    });

    router.push("/game");
  };

  const handleTestStart = async () => {
    // 유효성 검사
    const validation = isChallengeSelected(selectedOption);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // 모든 소환사가 PUUID를 가지고 있는지 확인
    const allHavePuuid = summoners.every(s => s.puuid);
    if (!allHavePuuid) {
      alert("일부 소환사의 정보가 올바르지 않습니다. 다시 등록해주세요.");
      return;
    }

    setIsLoadingTest(true);

    try {
      // 모든 소환사가 함께한 최근 매치 조회
      const puuids = summoners.map(s => s.puuid);
      const match = await getTestMatchClient(puuids);

      // 각 소환사별로 매치 데이터 변환
      const allMatchStats: MatchStats[] = [];
      for (const puuid of puuids) {
        const stats = convertRiotMatchesToMatchStats([match], puuid);
        if (stats.length > 0) {
          allMatchStats.push(stats[0]);
        }
      }

      if (allMatchStats.length === 0) {
        alert("매치 데이터를 변환하는데 실패했습니다.");
        setIsLoadingTest(false);
        return;
      }

      console.log('[Settings] 변환된 매치 데이터:', allMatchStats);

      // 핸디캡을 배열 형태로 변환
      const handicapArray: Handicap[] = [];
      Object.entries(handicaps).forEach(([summonerName, value]) => {
        if (value !== 0) {
          handicapArray.push({ optionId: selectedOption, summonerName, value });
        }
      });

      // 세션에 빈 매치 배열로 시작 (게임 페이지에서 보여주기 위해)
      saveSession({
        challengeOptions: selectedOption,
        startTime: Date.now(),
        matches: [], // 빈 배열로 시작
        maxMatches: 1, // 테스트 모드는 1경기만
        scoreConfig: selectedOption === "score" ? scoreConfig : undefined,
        handicaps: handicapArray.length > 0 ? handicapArray : undefined,
        testMatches: allMatchStats, // 모든 소환사의 매치 데이터 저장
      });

      // 게임 진행 페이지로 이동 (진행 상황 보기)
      router.push("/game");
    } catch (error: any) {
      console.error("Test match load error:", error);
      alert(error.message || "테스트 매치를 불러오는데 실패했습니다.");
    } finally {
      setIsLoadingTest(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-5xl flex-col md:py-16 px-4 sm:px-8 md:px-16 relative">
        {/* 헤더 */}
        <Header />
        {/* 페이지 헤더 */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              챌린지 설정
            </h2>
            {/* 물음표 아이콘 버튼 */}
            <div className="relative" ref={tooltipRef}>
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95 group z-30"
                aria-label="사용 설명 보기"
              >
                <span className="text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm">?</span>
              </button>
              
              {/* 말풍선 툴팁 */}
              {showTooltip && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-96 z-[100] animate-fade-in">
                  <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 border-2 border-amber-500/50 rounded-lg p-4 shadow-2xl">
                    {/* 말풍선 꼬리 */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 dark:bg-zinc-800 border-l-2 border-t-2 border-amber-500/50 rotate-45"></div>
                    
                    {/* 닫기 버튼 */}
                    <button
                      onClick={() => setShowTooltip(false)}
                      className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center transition-colors z-10 hover:opacity-70"
                      aria-label="닫기"
                    >
                      <svg
                        className="w-4 h-4 text-zinc-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    
                    {/* 단계 네비게이션 */}
                    <div className="flex items-center justify-between mb-3 pr-6">
                      <h3 className="text-sm sm:text-base font-semibold text-amber-400">
                        {tooltipSteps[tooltipStep - 1].title}
                      </h3>
                    </div>
                    
                    <p className="text-sm sm:text-base text-zinc-100 leading-relaxed">
                      {tooltipSteps[tooltipStep - 1].content}
                    </p>
                    
                    {/* 이전/다음 버튼 */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTooltipStep(prev => prev > 1 ? prev - 1 : tooltipSteps.length);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded transition-colors"
                      >
                        이전
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTooltipStep(prev => prev < tooltipSteps.length ? prev + 1 : 1);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
                      >
                        다음
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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

        {/* 판수 설정 */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-3">
            최대 판수 (0 = 무제한)
          </h2>
          <input
            type="number"
            min="0"
            value={maxMatches}
            onChange={(e) => setMaxMatches(parseInt(e.target.value) || 0)}
            onFocus={(e) => e.target.select()}
            className="w-full sm:w-48 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 sm:p-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all duration-150 text-left"
            placeholder="0"
          />
        </div>

        {/* 챌린지 옵션 선택 */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-4">
            챌린지 항목 선택
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl">
            {CHALLENGE_OPTIONS.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <div key={option.id} className="space-y-2">
                  <button
                    onClick={() => toggleOption(option.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-150 text-left ${
                      isSelected
                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800"
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
                </div>
              );
            })}
          </div>
        </div>

        {/* 점수 계산 설정 - 점수를 선택했을 때만 표시 */}
        {(selectedOption === "score" || isScoreConfigVisible) && (
          <div 
            ref={scoreConfigRef} 
            className={`mb-6 sm:mb-8 ${
              selectedOption === "score" && isScoreConfigVisible
                ? "animate-fade-in-slide-down" 
                : selectedOption !== "score" && isScoreConfigVisible
                ? "animate-fade-out-slide-up"
                : ""
            }`}
          >
            <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-3">
              점수 계산 설정
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2">킬 점수</label>
                <input
                  type="number"
                  value={scoreConfig.kill}
                  onChange={(e) => setScoreConfig({ ...scoreConfig, kill: parseInt(e.target.value) || 0 })}
                  onFocus={(e) => e.target.select()}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-left"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2">데스 점수</label>
                <input
                  type="number"
                  value={scoreConfig.death}
                  onChange={(e) => setScoreConfig({ ...scoreConfig, death: parseInt(e.target.value) || 0 })}
                  onFocus={(e) => e.target.select()}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-left"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2">어시스트 점수</label>
                <input
                  type="number"
                  value={scoreConfig.assist}
                  onChange={(e) => setScoreConfig({ ...scoreConfig, assist: parseInt(e.target.value) || 0 })}
                  onFocus={(e) => e.target.select()}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-left"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2">CS 점수</label>
                <input
                  type="number"
                  value={scoreConfig.cs}
                  onChange={(e) => setScoreConfig({ ...scoreConfig, cs: parseInt(e.target.value) || 0 })}
                  onFocus={(e) => e.target.select()}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-left"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-600 dark:text-zinc-400 mb-2">CS 몇 개당 1점</label>
                <input
                  type="number"
                  min="1"
                  value={scoreConfig.csPerPoint}
                  onChange={(e) => setScoreConfig({ ...scoreConfig, csPerPoint: parseInt(e.target.value) || 1 })}
                  onFocus={(e) => e.target.select()}
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-left"
                />
              </div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
              예: CS 점수 1, CS 몇 개당 1점 10 → CS 10개당 1점
            </p>
          </div>
        )}

        {/* 핸디캡 설정 - 항목 선택 시 표시 */}
        {(selectedOption || isHandicapVisible) && (
          <div 
            ref={handicapRef} 
            className={`mb-8 sm:mb-10 ${
              selectedOption && isHandicapVisible
                ? "animate-fade-in-slide-down" 
                : !selectedOption && isHandicapVisible
                ? "animate-fade-out-slide-up"
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium text-black dark:text-zinc-50">
                핸디캡 설정
              </h2>
              <button
                onClick={toggleHandicapPanel}
                className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
              >
                {showHandicap ? "숨기기" : "설정하기"}
              </button>
            </div>
            {(showHandicap || isHandicapPanelVisible) && (
              <div className={`p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-3 ${
                showHandicap && isHandicapPanelVisible
                  ? "animate-fade-in-slide-down"
                  : !showHandicap && isHandicapPanelVisible
                  ? "animate-fade-out-slide-up"
                  : ""
              }`}>
                {summoners.map((summoner) => {
                  const unit = getHandicapUnit(selectedOption);
                  const placeholder = getHandicapPlaceholder(selectedOption);
                  const description = getHandicapDescription(selectedOption);
                  const step = getHandicapStep(selectedOption);
                  
                  return (
                    <div key={summoner.name} className="space-y-1">
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-black dark:text-zinc-50 w-24 truncate">
                          {summoner.name}
                        </label>
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="number"
                            step={step}
                            value={handicaps[summoner.name] || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "") {
                                updateHandicap(summoner.name, 0);
                              } else {
                                const numVal = step === "0.01" ? parseFloat(val) : parseInt(val);
                                if (!isNaN(numVal)) {
                                  updateHandicap(summoner.name, numVal);
                                }
                              }
                            }}
                            onFocus={(e) => e.target.select()}
                            className="flex-1 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-left"
                            placeholder={placeholder}
                          />
                          {unit && (
                            <span className="text-sm text-zinc-600 dark:text-zinc-400 min-w-[2.5rem]">
                              {unit}
                            </span>
                          )}
                        </div>
                      </div>
                      {description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 ml-28">
                          {description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="pt-4 space-y-3">
          {/* 테스트 모드 안내 */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400">
              💡 <strong>테스트 모드:</strong> 실제 게임 없이 최근 함께한 매치 데이터로 바로 결과를 확인할 수 있습니다.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              size="md"
              className="flex-1"
            >
              뒤로가기
            </Button>
            <Button
              onClick={handleTestStart}
              variant="outline"
              size="md"
              className="flex-1"
              disabled={!selectedOption || isLoadingTest}
            >
              {isLoadingTest ? '로딩 중...' : '테스트 모드'}
            </Button>
            <Button
              onClick={handleStart}
              variant="primary"
              size="md"
              className="flex-1"
              disabled={!selectedOption}
            >
              게임 시작
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}


