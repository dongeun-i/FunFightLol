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
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-base font-medium mb-6 sm:mb-8 md:mb-10"
    >
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full border border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 sm:p-3 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 transition-all duration-200"
        placeholder={placeholder}
      />
      <button 
        type="submit"
        className="shrink-0 grow-0 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg p-2.5 sm:p-3 hover:bg-zinc-800 dark:hover:bg-zinc-200 cursor-pointer transition-all duration-200 font-medium hover:scale-105 active:scale-95"
      >
        찾기
      </button>
    </form>
  );
}

