"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const WHATSAPP = "https://wa.me/5583999999999?text=Ol%C3%A1%2C%20quero%20mirar%20meu%20pr%C3%B3ximo%20projeto%20com%20a%20ARCUS.";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nome = String(data.get("nome") || "");
    const msg = String(data.get("mensagem") || "");
    const url = `https://wa.me/5583999999999?text=${encodeURIComponent(`Olá, sou ${nome}. ${msg}`)}`;
    window.open(url, "_blank", "noopener");
    setSent(true);
  };

  return (
    <section id="contato" className="relative overflow-hidden bg-black py-28 md:py-40" aria-labelledby="contato-title">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
        <Reveal>
          <p className="font-data mb-4 text-[11px] tracking-[0.4em] text-[#C9B896]">07 — CONTATO</p>
          <h2 id="contato-title" className="font-display text-4xl leading-tight text-zinc-50 md:text-6xl">
            Vamos mirar no seu <span className="text-[#C9B896]">próximo projeto?</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-zinc-400 md:text-base">
            Resposta rápida no WhatsApp. Conte o alvo — devolvemos diagnóstico,
            arquitetura e prazo, sem enrolação de agência.
          </p>
          <a href={WHATSAPP} target="_blank" rel="noopener" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1FA855] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110">
            <MessageCircle className="size-4" /> Chamar no WhatsApp
          </a>
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur" aria-label="Formulário de contato">
            <label className="block text-xs tracking-widest text-zinc-400 uppercase" htmlFor="nome">Nome
              <input id="nome" name="nome" required autoComplete="name" className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-[#C9B896]/60" placeholder="Seu nome" />
            </label>
            <label className="mt-4 block text-xs tracking-widest text-zinc-400 uppercase" htmlFor="email">E-mail
              <input id="email" name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-[#C9B896]/60" placeholder="voce@empresa.com" />
            </label>
            <label className="mt-4 block text-xs tracking-widest text-zinc-400 uppercase" htmlFor="mensagem">Alvo
              <textarea id="mensagem" name="mensagem" required rows={4} className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-[#C9B896]/60" placeholder="Ex: preciso de um site + IA no WhatsApp para qualificar leads…" />
            </label>
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-100 px-6 py-3 text-sm font-semibold text-black transition hover:bg-white">
              <Send className="size-4" /> {sent ? "Aberto no WhatsApp — até já!" : "Enviar e abrir WhatsApp"}
            </button>
            <p className="mt-3 text-center text-xs text-zinc-400">Sem spam. Só diagnóstico.</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
