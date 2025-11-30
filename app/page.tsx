"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col py-8 sm:py-16 md:py-32 px-4 sm:px-8 md:px-16 bg-white dark:bg-black relative">
        {/* 다크모드 토글 버튼 */}
        <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors duration-200"
            aria-label="다크모드 토글"
          >
            {mounted && (
              <>
                {theme === "dark" ? (
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-800 dark:text-zinc-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-800 dark:text-zinc-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col mb-6 sm:mb-8 md:mb-10 items-center gap-4 sm:gap-6 text-center sm:items-start sm:text-left mt-12 sm:mt-16 md:mt-0">
          <h1 className="max-w-xs text-2xl sm:text-3xl font-semibold leading-8 sm:leading-10 tracking-tight text-black dark:text-zinc-50">
            FunFight LoL
          </h1>
          <p className="max-w-md text-base sm:text-lg leading-6 text-zinc-600 dark:text-zinc-400">
            친구들과 함께 리그 오브 레전드를 더욱 재미있게 즐길 수 있도록 만들어진 보조 도구입니다.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-base font-medium mb-6 sm:mb-8 md:mb-10">
          <input
            type="text"
            className="w-full border border-zinc-300 dark:border-zinc-700 rounded-md p-2.5 sm:p-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
            placeholder="소환사명을 입력하세요"
          />
          <button className="shrink-0 grow-0 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md p-2.5 sm:p-3 hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer transition-colors duration-200 font-medium">
            찾기
          </button>
        </div>
        {/* summer list */}
        <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10 overflow-x-auto pb-2">
          <ul className="flex flex-row h-full w-full items-center justify-between min-w-full sm:min-w-0">
            <li className="flex flex-col gap-2 items-center justify-center flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
              <span className="text-sm sm:text-base text-black dark:text-zinc-50">Aatrox1</span>
            </li>
            <li className="flex flex-col gap-2 items-center justify-center flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
              <span className="text-sm sm:text-base text-black dark:text-zinc-50">Aatrox2</span>
            </li>
            <li className="flex flex-col gap-2 items-center justify-center flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
              <span className="text-sm sm:text-base text-black dark:text-zinc-50">Aatrox3</span>
            </li>
            <li className="flex flex-col gap-2 items-center justify-center flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
              <span className="text-sm sm:text-base text-black dark:text-zinc-50">Aatrox4</span>
            </li>
            <li className="flex flex-col gap-2 items-center justify-center flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
              <span className="text-sm sm:text-base text-black dark:text-zinc-50">Aatrox5</span>
            </li>
          </ul>
        </div>
        <button className="shrink-0 grow-0 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md p-2.5 sm:p-3 md:p-4 hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer transition-colors duration-200 font-medium text-base sm:text-lg">
          시작하기
        </button>
      </main>
    </div>
  );
}
