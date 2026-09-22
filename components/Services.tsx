"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, Smartphone, Workflow, Bot, Plug } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { icon: Globe, title: "Sites de alto padrão", desc: "Sites institucionais e landing pages que carregam rápido, aparecem no Google e convertem visita em contato — pensada para o seu público." },
  { icon: Smartphone, title: "Aplicações & sistemas web", desc: "Aplicativos mobile, painéis internos, portais de cliente e sistemas sob medida, integrados ao seu ERP ou planilha atual." },
  { icon: Workflow, title: "Automações com n8n", desc: "Eliminamos tarefas manuais repetitivas: atualização de CRM, geração de relatórios, notificações e rotinas que hoje dependem de alguém." },
  { icon: Bot, title: "Atendimento com IA no WhatsApp", desc: "Agentes de IA que qualificam leads, agendam horários e respondem dúvidas frequentes 24h — com transferência automática para um humano quando o caso exige." },
  { icon: Plug, title: "Integrações & APIs", desc: "Conectamos meios de pagamento, mapas, controle de estoque e sistemas legados em uma arquitetura moderna." },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const select = gsap.utils.selector(ref);
      const title = select("[data-services-title]")[0];
      const rows = select("[data-service]");

      if (title) gsap.to(title, {
        yPercent: -24,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      });
      rows.forEach((row) => {
        gsap.fromTo(row, { opacity: 0, x: 72, clipPath: "inset(0 0 100% 0)" }, {
          opacity: 1,
          x: 0,
          clipPath: "inset(0 0 0% 0)",
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 88%", end: "top 56%", scrub: 0.45, invalidateOnRefresh: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="servicos" className="relative z-30 mt-[45svh] overflow-hidden bg-[#0D0D10] py-24 md:mt-[100svh] md:py-36" aria-labelledby="servicos-title">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <p className="font-data mb-4 text-[11px] tracking-[0.4em] text-[#C9B896]">02 — SERVIÇOS</p>
        <div className="grid gap-14 lg:grid-cols-[.78fr_1.22fr] lg:gap-24">
          <div data-services-title className="lg:sticky lg:top-28 lg:self-start">
            <h2 id="servicos-title" className="font-display text-4xl leading-[.95] text-zinc-50 md:text-6xl">Cinco frentes.<br /><span className="text-[#C9B896]">Um objetivo:</span> resolver sua necessidade.</h2>
    
          </div>
          <ol className="border-t border-white/10">
          {SERVICES.map((s) => (
            <li key={s.title} data-service className="group grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-b border-white/10 py-7 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.2fr)] md:gap-x-8 md:py-9">
              <span className="font-data text-[11px] tracking-[.2em] text-[#C9B896]">0{SERVICES.indexOf(s) + 1}</span>
              <div className="min-w-0">
                <s.icon className="mb-5 size-5 text-[#C9B896] transition-transform duration-500 group-hover:rotate-12" aria-hidden />
                <h3 className="font-display text-2xl text-zinc-100 md:text-3xl">{s.title}</h3>
              </div>
              <p className="col-start-2 mt-3 min-w-0 text-sm leading-6 text-zinc-400 md:col-start-auto md:mt-8">{s.desc}</p>
            </li>
          ))}
          <li data-service className="border-b border-white/10 py-7 md:py-9">
            <a href="#contato" className="group inline-flex min-h-11 items-center gap-3 text-lg font-semibold text-zinc-100">
              Quer resolver um desses problemas? <span className="text-[#C9B896] transition-transform duration-300 group-hover:translate-x-2">Vamos conversar →</span>
            </a>
          </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
