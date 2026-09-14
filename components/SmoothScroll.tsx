"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionConfig } from "framer-motion";
import { useIntroStore } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Inércia curta deixa roda/trackpad contínuos sem perder precisão de input.
    const lenis = new Lenis({ lerp: 0.075, smoothWheel: true, wheelMultiplier: 0.8 });
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

  // reducedMotion="user": desliga movimento p/ quem prefere, sem ramificar render (SSR-safe).
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
