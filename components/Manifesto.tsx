"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const services = document.getElementById("servicos");
      if (!services) return;
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        endTrigger: services,
        end: "top top",
        pin: true,
        pinSpacing: false,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="manifesto" className="relative z-20 mt-[55svh] overflow-hidden bg-transparent py-24 motion-reduce:bg-[#0A0A0C] md:mt-[90svh] md:py-40" aria-labelledby="manifesto-title">
      <div className="relative mx-auto max-w-4xl px-6">
        <p className="font-data mb-6 text-[11px] tracking-[0.4em] text-[#C9B896]">01 — MANIFESTO</p>
        <h2 id="manifesto-title" className="sr-only">Manifesto ARCUS</h2>
        <div className="max-w-3xl">
          <blockquote className="font-display text-3xl leading-[1.15] text-zinc-100 md:text-5xl">
            &ldquo;A simplicidade é pré-requisito para a confiabilidade.&rdquo;
          </blockquote>
          <p className="font-data mt-5 text-xs leading-6 tracking-[0.12em] text-[#C9B896] md:text-sm">
            — Edsger W. Dijkstra, pioneiro da ciência da computação
          </p>
          <p className="mt-10 text-base leading-8 text-zinc-300 md:text-lg">
            Todo sistema construído pela Arcus nasce de uma pergunta simples: o que, de fato, precisa existir no seu sistema? Evitamos funcionalidades inúteis que atrasam a entrega e não geram retorno.
          </p>
        </div>
      </div>
    </section>
  );
}
