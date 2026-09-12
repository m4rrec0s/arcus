"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, Smartphone, Workflow, Bot, Plug } from "lucide-react";
import { Reveal } from "@/components/Reveal";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { icon: Globe, title: "Sites de alto padrão", desc: "Institucionais e landing pages rápidas, com SEO técnico e copy que posiciona — não template genérico.", depth: 1 },
  { icon: Smartphone, title: "Apps & sistemas", desc: "Web apps e apps sob medida com Next.js/Node: painéis, portais e integrações com seu ERP.", depth: 0.6 },
  { icon: Workflow, title: "Automações & n8n", desc: "Pipelines que eliminam trabalho manual: CRM, planilhas, notificações e rotinas operando sozinhas.", depth: 0.35 },
  { icon: Bot, title: "Atendimento com IA", desc: "Agentes de IA no WhatsApp/site que qualificam, agendam e resolvem — com fallback humano.", depth: 0.8 },
  { icon: Plug, title: "Integrações & APIs", desc: "Conectamos pagamentos, mapas, estoque e provedores legados numa arquitetura limpa e observável.", depth: 0.5 },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((card) => {
        const d = parseFloat(card.dataset.depth || "0.5");
        gsap.to(card, {
          y: () => -60 * d,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="servicos" className="relative bg-[#0D0D10] py-28 md:py-36" aria-labelledby="servicos-title">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-data mb-4 text-[11px] tracking-[0.4em] text-[#C9B896]">02 — SERVIÇOS</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="servicos-title" className="font-display max-w-xl text-3xl text-zinc-50 md:text-5xl">Camadas de profundidade, uma mira.</h2>
          <p className="max-w-sm text-sm leading-6 text-zinc-400">Cards flutuam em profundidades diferentes — o mais próximo move mais rápido, como parallax real de câmera.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Reveal key={s.title}>
              <article
                data-depth={s.depth}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur transition-colors hover:border-[#C9B896]/50"
                style={{ transform: "translate3d(0,0,0)" }}
              >
                <s.icon className="size-6 text-[#C9B896]" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-zinc-100">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{s.desc}</p>
              </article>
            </Reveal>
          ))}
          <Reveal>
            <a href="#contato" data-depth={0.9} className="flex h-full min-h-44 flex-col justify-between rounded-2xl bg-zinc-100 p-7 text-black transition hover:bg-white" style={{ transform: "translate3d(0,0,0)" }}>
              <p className="font-display text-2xl leading-tight">Tem um alvo? Vamos mirar juntos.</p>
              <span className="mt-4 text-sm font-semibold">Pedir diagnóstico →</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
