"use client";

import { useRef } from "react";
import { Reveal } from "@/components/Reveal";

const STACK = [
  { name: "Next.js", tag: "Web" },
  { name: "Node.js", tag: "API" },
  { name: "Python", tag: "Dados/IA" },
  { name: "n8n", tag: "Automação" },
  { name: "IA / LLMs", tag: "Agentes" },
  { name: "Docker", tag: "Deploy" },
  { name: "PostgreSQL", tag: "Dados" },
  { name: "AWS / Contabo", tag: "Cloud" },
];

export default function TechGrid() {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.querySelectorAll<HTMLElement>("[data-tilt]").forEach((c) => {
      const depth = parseFloat(c.dataset.tilt || "1");
      c.style.transform = `translate3d(${x * 14 * depth}px, ${y * 14 * depth}px, 0)`;
    });
  };

  const onLeave = () => {
    ref.current?.querySelectorAll<HTMLElement>("[data-tilt]").forEach((c) => {
      c.style.transform = "translate3d(0,0,0)";
    });
  };

  return (
    <section ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} id="tecnologias" className="bg-[#0D0D10] py-28 md:py-36" aria-labelledby="tech-title">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-data mb-4 text-[11px] tracking-[0.4em] text-[#C9B896]">04 — ARSENAL</p>
        <h2 id="tech-title" className="font-display max-w-2xl text-3xl text-zinc-50 md:text-5xl">Stack afiada, sem peso morto.</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {STACK.map((t, i) => (
            <Reveal key={t.name} delay={(i % 4) * 0.06}>
              <div data-tilt={(i % 3) + 1} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-transform duration-200 will-change-transform" style={{ transform: "translate3d(0,0,0)" }}>
                <p className="text-base font-semibold text-zinc-100">{t.name}</p>
                <p className="mt-1 text-xs tracking-widest text-zinc-400 uppercase">{t.tag}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
