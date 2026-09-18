"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Manifesto", "#manifesto"],
  ["Serviços", "#servicos"],
  ["Processo", "#processo"],
  ["Cases", "#cases"],
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] border-b border-white/[0.08] bg-[#0A0A0C]/70 backdrop-blur-md">
      <nav
        className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-6"
        aria-label="Navegação principal"
      >
        <a
          href="#top"
          className="inline-flex min-h-11 items-center gap-2"
          aria-label="ARCUS Tecnologia, voltar ao início"
        >
          <Image
            src="/arcus-logo.svg"
            alt=""
            width={38}
            height={31}
            className="h-8 w-auto"
            priority
          />
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-xs text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {label}
            </a>
          ))}
          <a
            href="#contato"
            className="rounded-full border border-[#C9B896]/60 px-4 py-2 text-xs font-medium text-[#EDEDF2] transition-colors hover:bg-[#C9B896] hover:text-[#0A0A0C]"
          >
            Iniciar projeto
          </a>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center text-zinc-100 md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/[0.08] bg-[#0A0A0C]/95 px-6 py-4 md:hidden">
          <div className="mx-auto grid max-w-6xl gap-1">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className="flex min-h-11 items-center text-sm text-zinc-300"
              >
                {label}
              </a>
            ))}
            <a
              href="#contato"
              onClick={closeMenu}
              className="mt-2 flex min-h-11 items-center text-sm font-medium text-[#C9B896]"
            >
              Iniciar projeto
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
