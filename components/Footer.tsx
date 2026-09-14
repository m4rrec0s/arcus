import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0A0A0C] pt-12 pb-5" aria-label="Rodapé">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/arcus-logo.svg" alt="ARCUS Tecnologia" width={45} height={36} className="invert h-9 w-auto" />
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-zinc-100">ARCUS TECNOLOGIA</p>
            <p className="text-xs text-zinc-400">Precisão em cada linha de código · Campina Grande/PB — Brasil</p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400" aria-label="Links">
          <a className="hover:text-zinc-100" href="#manifesto">Manifesto</a>
          <a className="hover:text-zinc-100" href="#servicos">Serviços</a>
          <a className="hover:text-zinc-100" href="#processo">Processo</a>
          <a className="hover:text-zinc-100" href="#cases">Cases</a>
          <a className="hover:text-zinc-100" href="#contato">Contato</a>
        </nav>
        <p className="text-xs text-zinc-400">© {new Date().getFullYear()} ARCUS Tecnologia. Todos os direitos reservados.</p>
      </div>
      <p aria-hidden className="text-outline pointer-events-none mt-8 text-center font-display text-[22vw] leading-[0.8] tracking-tight select-none md:text-[16vw]">
        ARCUS
      </p>
    </footer>
  );
}
