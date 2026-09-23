"use client";

import { useEffect, useState } from "react";

export type MotionProfile = "static" | "light" | "full";

type ConnectionInfo = {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  saveData?: boolean;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function useMotionProfile() {
  const [profile, setProfile] = useState<MotionProfile>("static");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const connection = (navigator as Navigator & { connection?: ConnectionInfo }).connection;
      const avoidMotion =
        reduced ||
        connection?.saveData ||
        connection?.effectiveType === "slow-2g" ||
        connection?.effectiveType === "2g" ||
        !supportsWebGL();
      const constrained =
        connection?.effectiveType === "3g" ||
        navigator.hardwareConcurrency <= 4;

      if (!avoidMotion) setProfile(constrained ? "light" : "full");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return profile;
}
