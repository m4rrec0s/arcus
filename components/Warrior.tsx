"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INK = "#EDEDF2";
const BRONZE = "#C9B896";

/**
 * Espartano em esboço vazado — mesmo traço do lettering do rodapé:
 * só stroke, sem preenchimento. Elmo coríntio DE FRENTE (simétrico:
 * cúpula + abertura em T + crista), braço estendido segurando o arco.
 * Traço se desenha com o scroll (draw-on scrub).
 */
export default function Warrior({ id = "warrior" }: { id?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-draw]",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "center 40%", scrub: true },
        }
      );
      gsap.to("[data-wdepth]", {
        y: (i) => (i === 0 ? -30 : 30),
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const draw = {
    fill: "none",
    stroke: INK,
    strokeWidth: 3.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
  };

  return (
    <div ref={ref} id={id} className="relative mx-auto w-full max-w-md" aria-hidden>
      <svg viewBox="0 0 600 720" className="h-auto w-full" role="img" aria-label="Esboço de elmo espartano com arco na mão">
        {/* guias de construção */}
        <g data-wdepth stroke={INK} opacity={0.12} fill="none" strokeWidth={1.5}>
          <circle cx={300} cy={330} r={210} />
          <line x1={300} y1={80} x2={300} y2={620} />
          <line x1={90} y1={330} x2={510} y2={330} />
          <line x1={80} y1={662} x2={520} y2={662} />
        </g>

        <g data-wdepth>
          {/* cúpula */}
          <path data-draw {...draw} d="M205 505 C200 330 250 225 300 220 C350 225 400 330 395 505" />
          {/* sobrancelha */}
          <path data-draw {...draw} d="M246 332 L354 332" strokeWidth={4.5} />
          {/* nasal */}
          <path data-draw {...draw} d="M300 332 L300 470" strokeWidth={4} />
          {/* olhos */}
          <path data-draw {...draw} d="M254 362 L286 360" strokeWidth={4} />
          <path data-draw {...draw} d="M314 360 L346 362" strokeWidth={4} />
          {/* bochechas até o queixo */}
          <path data-draw {...draw} d="M246 332 C240 415 252 465 300 482" />
          <path data-draw {...draw} d="M354 332 C360 415 348 465 300 482" />
          {/* pescoço */}
          <path data-draw {...draw} d="M275 482 L270 512" />
          <path data-draw {...draw} d="M325 482 L330 512" />
          {/* trapézio */}
          <path data-draw {...draw} d="M270 512 C230 520 200 537 185 562" />
          <path data-draw {...draw} d="M330 512 C370 520 400 537 415 562" />
          {/* peito */}
          <path data-draw {...draw} d="M300 512 L300 580" opacity={0.5} />
          {/* pteruges */}
          <path data-draw {...draw} d="M265 586 L258 626" />
          <path data-draw {...draw} d="M300 588 L300 630" />
          <path data-draw {...draw} d="M335 586 L342 626" />
          {/* braço estendido */}
          <path data-draw {...draw} d="M415 562 L540 497" strokeWidth={5} />
          <path data-draw {...draw} d="M418 587 L535 522" opacity={0.55} />
          {/* mão */}
          <circle data-draw {...draw} cx={543} cy={509} r={14} />
          {/* arco na mão: barriga à direita, corda à esquerda */}
          <path data-draw {...draw} d="M556 414 C516 454 516 554 561 597" strokeWidth={4} />
          <path data-draw {...draw} d="M556 414 L561 597" strokeWidth={1.5} opacity={0.8} />
          {/* flecha nockada apontando à esquerda */}
          <path data-draw {...draw} d="M560 507 L470 507" strokeWidth={2.5} />
          <path data-draw {...draw} d="M470 501 L470 513 L456 507 Z" fill={INK} stroke="none" />
        </g>

        {/* crista bronze: barbatana sobre a cúpula */}
        <g data-wdepth stroke={BRONZE} fill="none" strokeWidth={5} strokeLinecap="round">
          <path data-draw {...draw} stroke={BRONZE} d="M272 220 C268 118 332 118 328 220" />
          <path data-draw {...draw} stroke={BRONZE} d="M286 218 C284 145 316 145 314 218" strokeWidth={2.5} />
          <path data-draw {...draw} stroke={BRONZE} d="M258 220 L342 220" />
        </g>
      </svg>
    </div>
  );
}
