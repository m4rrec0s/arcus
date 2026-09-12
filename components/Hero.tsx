"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Single shared Canvas, lazy + ssr:false per PRD §6
const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-parallax]", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <header ref={ref} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0A0A0C]">
      {/* Colunata + flecha bronze: Canvas único, lazy, sob demanda */}
      <div className="absolute inset-0 opacity-80" aria-hidden>
        <Scene3D />
      </div>
      <div className="grain absolute inset-0" aria-hidden />
      {/* marca d'água: tese do hero */}
      <p aria-hidden className="text-outline pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[24vw] leading-none tracking-tight select-none md:text-[19vw]">
        ARCUS
      </p>

      <div data-hero-parallax className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
        <p className="font-data mb-6 text-[11px] tracking-[0.4em] text-[#C9B896]">ARCO · PRECISÃO · IMPACTO</p>
        <h1 className="mt-2 max-w-3xl font-display text-4xl leading-[1.05] text-zinc-50 md:text-6xl">
          Tensão, precisão <span className="text-[#C9B896]">e impacto</span> em cada entrega.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
          Sites, apps, automações e atendimento com IA — engenharia de software
          de alto padrão, não agência genérica.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#contato" className="rounded-full bg-zinc-100 px-6 py-3 text-sm font-semibold text-black transition hover:bg-white">
            Mirar meu projeto
          </a>
          <a href="#processo" className="rounded-full border border-white/15 px-6 py-3 text-sm text-zinc-200 transition hover:border-white/40">
            Ver trajetória
          </a>
        </div>
        <dl className="font-data mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[11px] tracking-[0.2em] text-zinc-400">
          <div className="flex gap-2"><dt className="sr-only">Base</dt><dd>7.23°S 35.88°W — CG/PB</dd></div>
          <div className="flex gap-2"><dt className="sr-only">Render</dt><dd>R3F · DEMAND · DPR≤1.5</dd></div>
          <div className="flex gap-2"><dt className="sr-only">Meta</dt><dd>LIGHTHOUSE ≥ 85</dd></div>
        </dl>
        <a href="#manifesto" className="font-data mt-12 inline-flex items-center gap-2 text-[11px] tracking-[0.3em] text-zinc-400 transition hover:text-zinc-200" aria-label="Rolar para manifesto">
          SCROLL <ArrowDown className="size-4 animate-bounce" />
        </a>
      </div>
    </header>
  );
}
