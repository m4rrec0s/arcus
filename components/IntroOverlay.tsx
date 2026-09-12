"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useIntroStore } from "@/lib/store";
import { startRealLoading } from "@/lib/loader";
import ArcusMark from "@/components/ArcusMark";

/**
 * Intro: voo da flecha dirigido pelo progresso REAL de loading (dolly-in
 * junto), encaixe com flash + onda de choque + shake, logo em grande,
 * saída em fade. Zero poluição: só marca, logo e um filete de progresso.
 */
export default function IntroOverlay() {
  const progress = useIntroStore((s) => s.progress);
  const stage = useIntroStore((s) => s.stage);
  const setStage = useIntroStore((s) => s.setStage);
  const arrowRef = useRef<{ x: number }>({ x: 0 });
  const arrowGRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const cleanup = startRealLoading(4);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      useIntroStore.getState().setProgress(1);
    }
    return cleanup;
  }, []);

  // Flecha segue o progresso real + dolly-in do palco (transform-only)
  useEffect(() => {
    const maxX = Math.min(window.innerWidth * 0.62, 560);
    gsap.to(arrowRef.current, {
      x: progress * maxX,
      duration: 0.45,
      ease: "power2.out",
      overwrite: true,
      onUpdate: () => {
        if (arrowGRef.current)
          arrowGRef.current.style.transform = `translateX(${-maxX + arrowRef.current.x}px)`;
      },
    });
    if (stageRef.current)
      stageRef.current.style.transform = `scale(${0.92 + progress * 0.08})`;
    if (progress >= 1 && !doneRef.current) {
      doneRef.current = true;
      setStage("snapping");
    }
  }, [progress, setStage]);

  // Encaixe: tensão → estalo elástico + flash + shockwave + shake → logo → fade
  useEffect(() => {
    if (stage !== "snapping" || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setStage("revealed"),
      });
      tl.to("[data-bow]", { scale: 1.06, duration: 0.16, transformOrigin: "470px 180px" }, 0)
        .to("[data-string]", { attr: { d: "M470 40 L452 180 L470 320" }, duration: 0.16 }, 0)
        .to("[data-bow]", { scale: 1, duration: 0.6, ease: "elastic.out(1,0.4)" }, 0.16)
        .to("[data-string]", { attr: { d: "M470 40 L470 180 L470 320" }, duration: 0.6 }, 0.16)
        // impacto
        .to("[data-flash]", { opacity: 1, duration: 0.15 }, 0.16)
        .to("[data-flash]", { opacity: 0, duration: 0.7 }, 0.31)
        .fromTo(
          "[data-shockwave]",
          { attr: { r: 10 }, opacity: 0.9 },
          { attr: { r: 140 }, opacity: 0, duration: 0.85, ease: "power2.out" },
          0.16
        )
        .to("[data-screen-flash]", { opacity: 0.5, duration: 0.1 }, 0.16)
        .to("[data-screen-flash]", { opacity: 0, duration: 0.55 }, 0.26)
        .fromTo("[data-stage]", { x: 0 }, { x: 7, duration: 0.05, repeat: 3, yoyo: true }, 0.16)
        .to("[data-stage]", { x: 0, duration: 0.1 }, 0.36)
        // logo em grande
        .fromTo(
          "[data-logo]",
          { opacity: 0, y: 26, scale: 0.96, letterSpacing: "0.4em" },
          { opacity: 1, y: 0, scale: 1, letterSpacing: "0.18em", duration: 0.8 },
          0.35
        )
        .fromTo(
          "[data-sub]",
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          0.8
        )
        // saída em fade: a página nunca parece se mover sozinha
        .to(rootRef.current, { autoAlpha: 0, duration: 0.6, ease: "power2.out", delay: 1.0 });
    }, rootRef);
    return () => ctx.revert();
  }, [stage, setStage]);

  if (stage === "revealed") return null;
  const pct = Math.round(progress * 100);

  return (
    <div ref={rootRef} role="dialog" aria-modal="true" aria-label="Carregando site ARCUS" className="fixed inset-0 z-[90] bg-[#0A0A0C]">
      <div className="grain absolute inset-0" />
      <div data-screen-flash className="absolute inset-0 bg-[#FFF6E3] opacity-0" aria-hidden />
      <p className="sr-only" aria-live="polite">Carregando {pct}%</p>

      <div data-stage className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6">
        <div ref={stageRef} className="w-full" style={{ transform: "scale(0.92)" }}>
          <ArcusMark arrowRef={arrowGRef} className="h-[42vh] w-full" />
        </div>

        <p data-logo className="mt-4 text-center text-3xl font-semibold tracking-[0.18em] text-zinc-100 opacity-0 md:text-5xl">
          ARCUS <span className="text-[#C9B896]">TECNOLOGIA</span>
        </p>
        <p data-sub className="font-data mt-4 text-[11px] tracking-[0.45em] text-zinc-500 opacity-0">
          TENSÃO → PRECISÃO → IMPACTO
        </p>
      </div>

      {/* filete de progresso, sem números na tela */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5" aria-hidden>
        <div className="h-full bg-[#C9B896] transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
