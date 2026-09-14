"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    number: "I",
    name: "Cesto d'Amore",
    segment: "E-commerce editorial",
    result: "Catálogo, pedidos e operação sob medida para presentes memoráveis.",
    image: "/parallax/hero-bg.webp",
  },
  {
    number: "II",
    name: "Concessionária Honda",
    segment: "Captação automotiva",
    result: "Presença digital com jornada de lead pensada para velocidade comercial.",
    image: "/parallax/hero-columns.webp",
  },
  {
    number: "III",
    name: "Nexus Operations",
    segment: "Operação conectada",
    result: "Painel privado para unificar rotina, dados e decisões de time.",
    image: "/parallax/hero-bow.webp",
  },
  {
    number: "IV",
    name: "Orla Studio",
    segment: "Marca e conversão",
    result: "Site institucional concebido como primeira conversa de uma marca premium.",
    image: "/parallax/mira-archer.webp",
  },
  {
    number: "V",
    name: "Vértice Logística",
    segment: "Automação de fluxo",
    result: "Integrações que removem trabalho manual entre comercial, operação e entrega.",
    image: "/parallax/cta-arrow.webp",
  },
  {
    number: "VI",
    name: "Seu próximo alvo",
    segment: "Em construção",
    result: "Espaço reservado para projeto que merece uma execução de precisão.",
    image: "/parallax/texture-marble.webp",
  },
];

export default function Cases() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current;
    if (!track) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      return gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={ref} id="cases" className="relative z-10 overflow-hidden bg-[#17120b] py-20 md:h-svh md:py-0" aria-labelledby="cases-title">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(23,18,11,.2),rgba(23,18,11,.8))]" />
      <div ref={trackRef} className="relative flex w-max items-center gap-7 px-6 md:h-full md:gap-12 md:px-[12vw]">
        <header className="w-[min(78vw,600px)] shrink-0 text-[#f2e7cb]">
          <p className="font-data mb-5 text-[11px] tracking-[.4em] text-[#c9b896]">05 — ACERTOS</p>
          <h2 id="cases-title" className="font-display text-5xl leading-[.92] md:text-7xl">Projetos em<br />forma de <span className="text-[#c9b896]">legado.</span></h2>
          <p className="mt-7 max-w-sm text-sm leading-6 text-[#d2c4a7]/75">Deslize para atravessar seis capítulos de trabalho. Cada um começa com um alvo claro.</p>
        </header>
        {PROJECTS.map((project) => (
          <article key={project.number} className="relative flex h-[min(72svh,680px)] w-[min(76vw,760px)] shrink-0 flex-col overflow-hidden rounded-[2px] bg-[#d4c091] p-5 text-[#21180d] shadow-2xl shadow-black/30 md:p-8">
            <div className="relative min-h-0 flex-1 overflow-hidden border border-[#4c391f]/35">
              <Image src={project.image} alt="" fill sizes="(max-width: 768px) 76vw, 760px" className="object-cover sepia-[.35] saturate-[.65]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(33,24,13,.55))]" />
            </div>
            <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 border-t border-[#4c391f]/35 pt-5">
              <p className="font-display text-3xl text-[#8c6935]">{project.number}</p>
              <div>
                <p className="font-data text-[10px] tracking-[.28em] text-[#5f4827]">{project.segment}</p>
                <h3 className="font-display mt-1 text-2xl leading-tight">{project.name}</h3>
                <p className="mt-2 max-w-md text-sm leading-5 text-[#48371f]">{project.result}</p>
              </div>
            </div>
            <span className="absolute top-5 right-5 inline-flex size-9 items-center justify-center rounded-full border border-[#4c391f]/35 bg-[#d4c091]/80"><ArrowUpRight className="size-4" /></span>
          </article>
        ))}
        <div className="w-[12vw] shrink-0" aria-hidden />
        </div>
    </section>
  );
}
