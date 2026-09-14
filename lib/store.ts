import { create } from "zustand";

export type IntroStage = "loading" | "snapping" | "revealed";

type IntroState = {
  progress: number; // 0..1 real asset progress
  stage: IntroStage;
  setProgress: (p: number) => void;
  setStage: (s: IntroStage) => void;
};

export const useIntroStore = create<IntroState>((set) => ({
  progress: 1,
  stage: "revealed",
  setProgress: (p) =>
    set({ progress: Math.min(1, Math.max(0, Math.round(p * 100) / 100)) }),
  setStage: (stage) => set({ stage }),
}));
