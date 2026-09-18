"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { useIntroStore } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

// Parallax em camadas (foto, sem WebGL)

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const stage = useIntroStore((s) => s.stage);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-parallax]", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  // Entrada coreografada: dispara quando a intro revela (overlay cobre antes, sem FOUC)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (stage !== "revealed") return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-in]",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09 },
      );
    }, ref);
    return () => ctx.revert();
  }, [stage]);

  return (
    <header
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] overflow-hidden bg-[#0A0A0C]"
    >
      <div className="grain absolute inset-0" aria-hidden />

      <div
        data-hero-parallax
        className="relative z-20 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-start justify-end px-6 pt-28 pb-20 text-left md:justify-center md:pb-16"
      >
        <p
          data-hero-in
          className="font-data mb-6 text-[11px] tracking-[0.4em] text-[#C9B896]"
        >
          ARCUS TECNOLOGIA
        </p>
        <h1
          data-hero-in
          className="mt-2 max-w-3xl font-display text-5xl leading-[.94] text-zinc-50 md:text-7xl"
        >
          Software com alvo definido,{" "}
          <span className="text-[#C9B896]">prazo real</span> e resultado medido.
        </h1>
        <p
          data-hero-in
          className="mt-5 max-w-xl text-base leading-7 text-zinc-400 md:text-lg"
        >
          Sites, aplicações web e automações com IA para empresas que precisam
          de engenharia de verdade!
        </p>
        <div data-hero-in className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#contato"
            className="rounded-full bg-zinc-100 px-6 py-3 text-sm font-semibold text-black transition hover:bg-white"
          >
            Falar sobre meu projeto
          </a>
          <a
            href="#processo"
            className="rounded-full border border-white/15 px-6 py-3 text-sm text-zinc-200 transition hover:border-white/40"
          >
            Ver como trabalhamos
          </a>
        </div>
        <a
          data-hero-in
          href="#manifesto"
          className="font-data mt-12 inline-flex min-h-11 items-center gap-2 text-[11px] tracking-[0.3em] text-zinc-400 transition hover:text-zinc-200"
          aria-label="Rolar para manifesto"
        >
          SCROLL <ArrowDown className="size-4 animate-bounce" />
        </a>
      </div>
    </header>
  );
}
