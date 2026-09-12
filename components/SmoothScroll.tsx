"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIntroStore } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Suave e rápido: lerp alto = resposta imediata e cauda curta.
    // Roda com leve multiplicador pra não parecer lenta. Nada anda sozinho.
    const lenis = new Lenis({ lerp: 0.25, smoothWheel: true, wheelMultiplier: 1.15 });
    lenis.on("scroll", ScrollTrigger.update);
    // GSAP ticker roda em SEGUNDOS, Lenis espera MILISSEGUINDOS.
    // Sem o *1000 a animação anda 1000x devagar (deriva sem fim / trava).
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Trava o scroll durante a intro: usuário nunca rola atrás do overlay.
    const release = () => {
      lenis.start();
      ScrollTrigger.refresh();
    };
    lenis.stop();
    let unsub: (() => void) | undefined;
    if (useIntroStore.getState().stage === "revealed") {
      release();
    } else {
      unsub = useIntroStore.subscribe((s) => {
        if (s.stage === "revealed") {
          release();
          unsub?.();
        }
      });
    }
    // Safety: nunca prender o usuário com scroll travado.
    const safety = window.setTimeout(() => lenis.start(), 8000);

    return () => {
      window.clearTimeout(safety);
      unsub?.();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
