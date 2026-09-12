"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const CASES = [
  {
    name: "Cesto d'Amore",
    segment: "E-commerce · Cestas e presentes",
    result: "Catálogo, pedidos e operação sob medida.",
    href: "#contato",
  },
  {
    name: "Concessionária Honda",
    segment: "Automotivo · Campina Grande/PB",
    result: "Presença digital + captação de leads qualificados.",
    href: "#contato",
  },
  {
    name: "Seu projeto",
    segment: "Próximo alvo",
    result: "Espaço reservado para o terceiro destaque do portfólio.",
    href: "#contato",
  },
];

export default function Cases() {
  const onTilt = (e: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translate3d(0,0,0)`;
  };
  const reset = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <section id="cases" className="bg-[#0A0A0C] py-28 md:py-36" aria-labelledby="cases-title">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-data mb-4 text-[11px] tracking-[0.4em] text-[#C9B896]">05 — ACERTOS</p>
        <h2 id="cases-title" className="font-display max-w-2xl text-3xl text-zinc-50 md:text-5xl">Alvos atingidos.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {CASES.map((c) => (
            <Reveal key={c.name}>
              <a
                href={c.href}
                onMouseMove={onTilt}
                onMouseLeave={reset}
                className="group flex min-h-64 flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-7 transition-colors hover:border-[#C9B896]/50 will-change-transform"
              >
                <div>
                  <p className="text-xs tracking-widest text-zinc-400 uppercase">{c.segment}</p>
                  <p className="font-display mt-3 text-2xl text-zinc-50">{c.name}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{c.result}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#C9B896]">
                  Ver case <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
