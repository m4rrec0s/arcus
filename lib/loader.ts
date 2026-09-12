import { useIntroStore } from "@/lib/store";

/**
 * Tracks REAL loading milestones (fonts, window load, R3F bundle, images).
 * Each resolved task bumps progress. No fake timers as primary driver —
 * a safety timeout only guarantees completion if something hangs.
 */
export function startRealLoading(totalTasks = 4) {
  const { setProgress, progress } = useIntroStore.getState();
  if (progress > 0) return () => {};
  let done = 0;
  const bump = () => {
    done += 1;
    setProgress(done / totalTasks);
  };

  const tasks: Promise<unknown>[] = [];

  // 1. Fonts
  tasks.push(
    ("fonts" in document ? document.fonts.ready : Promise.resolve()).then(bump, bump)
  );

  // 2. Window load (critical images/CSS)
  tasks.push(
    new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    }).then(bump, bump)
  );

  // 3. R3F bundle parse (dynamic import, ssr:false elsewhere — warm the chunk)
  tasks.push(import("@react-three/fiber").then(bump, bump));

  // 4. Logo/hero paint: wait 2 frames so first paint is counted
  tasks.push(
    new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    ).then(bump, bump)
  );

  // Safety: never trap user behind loader
  const safety = window.setTimeout(() => {
    useIntroStore.getState().setProgress(1);
  }, 6000);

  Promise.allSettled(tasks).then(() => window.clearTimeout(safety));
  return () => window.clearTimeout(safety);
}
