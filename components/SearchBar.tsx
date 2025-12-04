"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch?: (summonerName: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "소환사명을 입력하세요" 
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim());
      setSearchValue(""); // 검색 후 텍스트 초기화
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative text-base font-medium"
    >
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full border-2 border-zinc-300 dark:border-zinc-700 rounded-xl pl-11 pr-4 py-3 sm:py-3.5 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-500/20 shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200"
          placeholder={placeholder}
        />
        <button 
          type="submit"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-200"
          aria-label="검색"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

