"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const STEPS = [
  { title: "Diagnóstico", desc: "Conversamos para entender o que você precisa, o que é prioridade e qual vai ser a arquitetura usada." },
  { title: "Arquitetura", desc: "Transformamos essa conversa em um plano simples: o que será feito, como vai funcionar e quanto tempo deve levar." },
  { title: "Desenvolvimento", desc: "Construímos por etapas e mostramos versões funcionando ao longo do caminho, para você acompanhar tudo antes da entrega final." },
  { title: "Entrega e suporte", desc: "Colocamos o sistema no ar, explicamos como usar e acompanhamos os primeiros ajustes para garantir que tudo funcione bem." },
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-arrow-point]", {
        ease: "none",
        motionPath: { path: "[data-arrow-path]", align: "[data-arrow-path]", alignOrigin: [0.5, 0.5] },
        scrollTrigger: { trigger: "[data-track]", start: "top 75%", end: "bottom 40%", scrub: true },
      });
      gsap.fromTo("[data-process-fill]", { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: "[data-track]", start: "top 70%", end: "bottom 55%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el, i) => {
        gsap.fromTo(el, { x: 44, scale: 0.96 }, {
          x: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 82%", end: "top 48%", scrub: 0.55 },
        });
        gsap.to(el.querySelector("[data-step-index]"), {
          rotation: 360,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 48%", scrub: true },
        });
        void i;
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="processo" className="chapter overflow-hidden py-24 md:py-36" aria-labelledby="processo-title">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-data mb-4 text-[11px] tracking-[0.4em] text-[#C9B896]">03 — COMO TRABALHAMOS</p>
        <h2 id="processo-title" className="font-display max-w-2xl text-3xl text-zinc-50 md:text-5xl">Do diagnóstico à entrega.</h2>

        <div data-track className="relative mt-14 grid gap-10 md:grid-cols-[120px_1fr]">
          {/* curved SVG trajectory */}
          <div className="relative hidden md:block" aria-hidden>
            <svg viewBox="0 0 120 640" className="h-[640px] w-[120px]">
              <path data-arrow-path d="M60 10 C 100 180, 20 320, 60 470 C 80 560, 70 600, 60 630" stroke="#2c2c33" strokeWidth="2" fill="none" strokeDasharray="6 8" />
              <circle data-arrow-point cx="0" cy="0" r="7" fill="#C9B896" />
              <circle data-arrow-point cx="0" cy="0" r="14" fill="none" stroke="#C9B896" opacity="0.4" />
            </svg>
          </div>
          <ol className="relative space-y-8 pl-6">
            {/* trilho + preenchimento que acompanha o scroll */}
            <div className="absolute top-2 bottom-2 left-0 w-px bg-white/10" aria-hidden>
              <div data-process-fill className="h-full w-full origin-top scale-y-0 bg-[#C9B896]" />
            </div>
            {STEPS.map((s, i) => (
              <li key={s.title} data-step className="border-l border-white/10 bg-gradient-to-r from-white/[0.045] to-transparent p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span data-step-index className="font-data grid size-7 place-items-center rounded-full border border-[#C9B896]/50 text-[10px] text-[#C9B896]">0{i + 1}</span>
                  <p className="text-xs tracking-[0.3em] text-[#C9B896]">ETAPA</p>
                </div>
                <h3 className="font-display mt-2 text-2xl text-zinc-50">{s.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
