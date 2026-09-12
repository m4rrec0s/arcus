"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "Software não é sobre excesso.",
  "É sobre tensão certa, mira certa,",
  "corte preciso — e impacto mensurável.",
  "ARCUS projeta cada sistema como um arco:",
  "armado com arquitetura, disparado com precisão.",
];

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-manifesto-line]").forEach((line) => {
        gsap.fromTo(
          line,
          { opacity: 0.55 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: line, start: "top 85%", end: "top 45%", scrub: true },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="manifesto" className="relative bg-[#0A0A0C] py-28 md:py-40" aria-labelledby="manifesto-title">
      <div className="mx-auto max-w-4xl px-6">
        <p className="font-data mb-6 text-[11px] tracking-[0.4em] text-[#C9B896]">01 — MANIFESTO</p>
        <h2 id="manifesto-title" className="sr-only">Manifesto ARCUS</h2>
        <div className="font-display space-y-3 text-3xl leading-[1.15] text-zinc-100 md:text-5xl">
          {LINES.map((l) => (
            <p key={l} data-manifesto-line>{l}</p>
          ))}
        </div>
        <div className="mt-10 grid gap-6 text-sm leading-6 text-zinc-400 md:grid-cols-3">
          <div><p className="text-2xl text-zinc-100">φ 1.618</p><p className="mt-1">Proporção e espaço negativo em cada interface.</p></div>
          <div><p className="text-2xl text-zinc-100">0 reflow</p><p className="mt-1">Só transform/opacity no scroll. GPU, nunca layout.</p></div>
          <div><p className="text-2xl text-zinc-100">≤ 500KB</p><p className="mt-1">3D comprimido, lazy e sob demanda.</p></div>
        </div>
      </div>
    </section>
  );
}
