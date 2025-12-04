"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white font-bold shadow-lg shadow-amber-700/40 hover:from-amber-500 hover:via-amber-600 hover:to-amber-700 hover:shadow-amber-600/50",
    secondary: "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700",
    outline: "border-2 border-amber-600 text-amber-700 dark:text-amber-500 hover:bg-amber-600 hover:text-white dark:hover:text-white"
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 sm:py-3 text-base",
    lg: "px-6 py-3 sm:py-4 text-base sm:text-lg"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}


