"use client";

import dynamic from "next/dynamic";
import { Reveal } from "@/components/Reveal";
import Warrior from "@/components/Warrior";

const ArrowFlight = dynamic(() => import("@/components/ArrowFlight"), {
  ssr: false,
  loading: () => null,
});

/**
 * 06 — MIRA: o arco encontra a mão do espartano (esboço vazado),
 * a flecha percorre a faixa com o scroll e crava no alvo.
 * Parágrafo associado: assertividade.
 */
export default function Mira() {
  return (
    <section id="mira" className="relative overflow-hidden bg-[#0A0A0C] py-28 md:py-36" aria-labelledby="mira-title">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-data mb-4 text-[11px] tracking-[0.4em] text-[#C9B896]">06 — MIRA</p>
        <h2 id="mira-title" className="font-display max-w-2xl text-3xl text-zinc-50 md:text-5xl">
          O arco encontra <span className="text-[#C9B896]">a mão.</span>
        </h2>

        <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <Warrior />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-data text-xs tracking-[0.3em] text-zinc-500">O ARQUEIRO</p>
            <p className="mt-4 text-base leading-7 text-zinc-400 md:text-lg">
              Ferramenta sem mão é enfeite. O arco da ARCUS só existe armado:
              diagnóstico na corda, arquitetura na mira, código em voo.
              O espartano não atira duas vezes no mesmo alvo —
              <span className="text-zinc-100"> nem a gente.</span>
            </p>
          </Reveal>
        </div>
      </div>

      {/* faixa de voo: 3D dirigido pelo scroll */}
      <div className="mx-auto mt-6 max-w-6xl px-6">
        <div id="mira-flight" className="relative h-[62vh] min-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <div className="grain absolute inset-0" aria-hidden />
          <ArrowFlight />
          <p className="font-data pointer-events-none absolute top-4 left-5 text-[11px] tracking-[0.35em] text-zinc-500">
            VOO · SCROLL DIRIGE
          </p>
          <p className="font-data pointer-events-none absolute top-4 right-5 text-[11px] tracking-[0.35em] text-[#C9B896]">
            ALVO →
          </p>
        </div>
      </div>

      {/* parágrafo associado: assertividade */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.4fr] md:items-end">
          <Reveal>
            <h3 className="font-display text-3xl text-zinc-50 md:text-4xl">Assertividade.</h3>
            <p className="font-data mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[11px] tracking-[0.25em] text-[#C9B896]">
              <span>1 FLECHA</span><span>1 ALVO</span><span>0 DESPERDÍCIO</span>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
              Assertividade é economia de movimento: mirar uma vez, acertar uma vez.
              Cada projeto ARCUS carrega alvo definido, métrica de acerto e prazo —
              sem features órfãs, sem sprint perdida, sem chute. O que entra no arco,
              sai cravado onde dói: receita, tempo, operação.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
