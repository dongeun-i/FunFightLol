import { GameSession, Summoner } from "./types";

const STORAGE_KEY = "funfight-lol-session";

export function saveSession(session: Partial<GameSession>) {
  if (typeof window === "undefined") return;
  
  const existing = getSession();
  const updated = { ...existing, ...session };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getSession(): Partial<GameSession> | null {
  if (typeof window === "undefined") return null;
  
  const data = sessionStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function saveSummoners(summoners: Summoner[]) {
  saveSession({ summoners });
}

export function getSummoners(): Summoner[] {
  const session = getSession();
  return session?.summoners || [];
}


