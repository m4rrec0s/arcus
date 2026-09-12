"use client";

const ITEMS = ["SITES", "APPS", "AUTOMAÇÕES", "IA NO WHATSAPP", "N8N", "INTEGRAÇÕES"];

export default function Marquee() {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {ITEMS.map((it) => (
        <span key={it + (hidden ? "-b" : "-a")} className="flex items-center">
          <span className="font-data px-8 text-sm tracking-[0.35em] text-zinc-400">{it}</span>
          <span className="text-[#C9B896]" aria-hidden>→</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#0A0A0C] py-5" aria-label="Serviços em destaque">
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
