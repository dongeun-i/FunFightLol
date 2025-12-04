"use client";

import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  className?: string;
  showDescription?: boolean;
}

export default function Header({ className = "", showDescription = false }: HeaderProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`fixed top-4 right-4 sm:top-5 sm:right-5 z-50 ${className}`}>
      {/* 다크모드 토글 버튼 */}
      <ThemeToggle />
    </div>
  );
}


