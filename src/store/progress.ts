import { useState, useEffect } from "react";

export type Progress = {
  subjectsExplored: number;
  quizzesTaken: number;
  quizzesPassed: number;
  conversationMessages: number;
};

const DEFAULT_PROGRESS: Progress = {
  subjectsExplored: 0,
  quizzesTaken: 0,
  quizzesPassed: 0,
  conversationMessages: 0,
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    const saved = localStorage.getItem("german_progress");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem("german_progress", JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (updates: Partial<Progress>) => {
    setProgress((prev) => ({ ...prev, ...updates }));
  };

  const increment = (key: keyof Progress, amount = 1) => {
    setProgress((prev) => ({ ...prev, [key]: (prev[key] || 0) + amount }));
  };

  return { progress, updateProgress, increment };
}
