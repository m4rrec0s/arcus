"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, Smartphone, Workflow, Bot, Plug } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { icon: Globe, title: "Sites de alto padrão", desc: "Institucionais e landing pages rápidas, com SEO técnico e copy que posiciona — não template genérico." },
  { icon: Smartphone, title: "Apps & sistemas", desc: "Web apps e apps sob medida com Next.js/Node: painéis, portais e integrações com seu ERP." },
  { icon: Workflow, title: "Automações & n8n", desc: "Pipelines que eliminam trabalho manual: CRM, planilhas, notificações e rotinas operando sozinhas." },
  { icon: Bot, title: "Atendimento com IA", desc: "Agentes de IA no WhatsApp/site que qualificam, agendam e resolvem — com fallback humano." },
  { icon: Plug, title: "Integrações & APIs", desc: "Conectamos pagamentos, mapas, estoque e provedores legados numa arquitetura limpa e observável." },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-services-title]", {
        yPercent: -24,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-service]").forEach((row) => {
        gsap.fromTo(row, { opacity: 0, x: 72, clipPath: "inset(0 0 100% 0)" }, {
          opacity: 1,
          x: 0,
          clipPath: "inset(0 0 0% 0)",
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 88%", end: "top 56%", scrub: 0.45 },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="servicos" className="relative z-30 mt-[100svh] bg-[#0D0D10] py-28 md:py-36" aria-labelledby="servicos-title">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <p className="font-data mb-4 text-[11px] tracking-[0.4em] text-[#C9B896]">02 — SERVIÇOS</p>
        <div className="grid gap-14 lg:grid-cols-[.78fr_1.22fr] lg:gap-24">
          <div data-services-title className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="servicos-title" className="font-display text-4xl leading-[.95] text-zinc-50 md:text-6xl">Uma mira.<br /><span className="text-[#C9B896]">Vários impactos.</span></h2>
            <p className="mt-7 max-w-sm text-sm leading-6 text-zinc-400">A escolha certa de tecnologia vem depois do alvo definido. Cada frente existe para resolver uma parte real da operação.</p>
          </div>
          <ol className="border-t border-white/10">
          {SERVICES.map((s) => (
            <li key={s.title} data-service className="group grid grid-cols-[auto_1fr] gap-x-5 border-b border-white/10 py-7 md:grid-cols-[3rem_1fr_1.2fr] md:gap-x-8 md:py-9">
              <span className="font-data text-[11px] tracking-[.2em] text-[#C9B896]">0{SERVICES.indexOf(s) + 1}</span>
              <div>
                <s.icon className="mb-5 size-5 text-[#C9B896] transition-transform duration-500 group-hover:rotate-12" aria-hidden />
                <h3 className="font-display text-2xl text-zinc-100 md:text-3xl">{s.title}</h3>
              </div>
              <p className="col-start-2 mt-3 text-sm leading-6 text-zinc-400 md:col-start-auto md:mt-8">{s.desc}</p>
            </li>
          ))}
          <li data-service className="border-b border-white/10 py-7 md:py-9">
            <a href="#contato" className="group inline-flex items-center gap-3 text-lg font-semibold text-zinc-100">
              Tem um alvo? <span className="text-[#C9B896] transition-transform duration-300 group-hover:translate-x-2">Vamos mirar →</span>
            </a>
          </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
