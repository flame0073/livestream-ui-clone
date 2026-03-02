import { useState, useEffect, useCallback } from "react";

interface HistoryEntry {
  channelName: string;
  watchedAt: string;
}

const STORAGE_KEY = "livetube-watch-history";
const MAX_HISTORY = 50;

export function useWatchHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const addToHistory = useCallback((channelName: string) => {
    setHistory((prev) => {
      // Remove existing entry for same channel
      const filtered = prev.filter((h) => h.channelName !== channelName);
      const updated = [{ channelName, watchedAt: new Date().toISOString() }, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
