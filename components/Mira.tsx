"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/Reveal";

gsap.registerPlugin(ScrollTrigger);

/**
 * 06 — DIFERENCIAL: vídeo do arqueiro com parallax dirigido pelo scroll.
 */
export default function Mira() {
  const flightRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-mira-media]", { scale: 1.18, clipPath: "inset(10% 6% round 20px)" }, {
        scale: 1,
        clipPath: "inset(0% 0% round 16px)",
        ease: "none",
        scrollTrigger: { trigger: flightRef.current, start: "top 85%", end: "center center", scrub: 0.6 },
      });
      const video = videoRef.current;
      if (video) {
        ScrollTrigger.create({
          trigger: flightRef.current,
          start: "top 85%",
          end: "bottom 15%",
          onEnter: () => void video.play(),
          onEnterBack: () => void video.play(),
          onLeave: () => video.pause(),
          onLeaveBack: () => video.pause(),
        });
      }
    }, flightRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="diferencial" className="chapter relative overflow-hidden py-28 md:py-36" aria-labelledby="mira-title">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-data mb-4 text-[11px] tracking-[0.4em] text-[#C9B896]">06 — DIFERENCIAL</p>
        <h2 id="mira-title" className="font-display max-w-2xl text-3xl text-zinc-50 md:text-5xl">
          Um problema por vez, <span className="text-[#C9B896]">resolvido de verdade.</span>
        </h2>

        <div className="mt-12 max-w-2xl">
          <Reveal>
            <p className="mt-4 text-base leading-7 text-zinc-400 md:text-lg">
              A maioria dos projetos de software falha por escopo inchado, não por falta de tecnologia. Por isso cada projeto ARCUS começa com um objetivo escrito e mensurável — e termina quando esse objetivo é entregue, não quando o orçamento acaba.
            </p>
          </Reveal>
        </div>
      </div>

      {/* faixa do arqueiro: foto com parallax dirigido pelo scroll */}
      <div className="mx-auto mt-6 max-w-6xl px-6">
        <div ref={flightRef} id="mira-flight" className="chapter-frame relative h-[62vh] min-h-[420px] overflow-hidden border-y border-white/10 bg-black/40">
          <div data-mira-media className="absolute -inset-[8%] overflow-hidden will-change-transform">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              poster="/parallax/mira-archer.webp"
              className="h-full w-full object-cover object-[68%_center]"
            >
              <source src="/video_arqueiro_espartano.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C]/60 via-transparent to-transparent" />
          <div className="grain absolute inset-0" aria-hidden />
        </div>
      </div>

      {/* parágrafo associado: assertividade */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-end">
          <Reveal>
            <h3 className="font-display text-3xl text-zinc-50 md:text-4xl">Como isso aparece no seu projeto</h3>
            <ul className="font-data mt-4 space-y-3 text-[11px] leading-5 tracking-[0.12em] text-[#C9B896]">
              <li>Escopo fechado antes de começar — sem &quot;enquanto isso, dá pra...&quot;</li>
              <li>Prazo combinado e cumprido, com atualizações no caminho</li>
              <li>Métrica de sucesso definida junto com você, não depois</li>
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
              Isso significa menos reunião de alinhamento, menos retrabalho e um sistema que resolve o que precisava resolver — nem mais, nem menos.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
