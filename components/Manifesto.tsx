"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "Software não é sobre excesso.",
  "É sobre tensão certa, mira certa,",
  "corte preciso — e impacto mensurável.",
  "ARCUS projeta cada sistema como um arco:",
  "armado com arquitetura, disparado com precisão.",
];

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-manifesto-line]");
      const services = document.getElementById("servicos");
      if (!services) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          endTrigger: services,
          end: "top top",
          pin: true,
          pinSpacing: false,
          scrub: true,
        },
      });

      tl.fromTo("[data-manifesto-color]", { opacity: 0, scale: 0.72 }, { opacity: 1, scale: 1, ease: "none", duration: 0.12 }, 0);
      tl.fromTo(
        lines,
        { opacity: 0, y: 44, clipPath: "inset(0 0 100% 0)", color: "#a99b80" },
        { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", color: "#f4efe5", stagger: 0.035, ease: "none", duration: 0.16 },
        0.06
      );
      tl.to("[data-manifesto-color]", { opacity: 1, scale: 1, duration: 0.7, ease: "none" });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="manifesto" className="relative mt-[90svh] overflow-hidden bg-[#0A0A0C] py-28 md:py-40" aria-labelledby="manifesto-title">
      <div aria-hidden className="absolute inset-0 opacity-[0.16]">
        <Image
          src="/parallax/texture-marble.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C] via-transparent to-[#0A0A0C]" />
      </div>
      <div data-manifesto-color aria-hidden className="absolute -inset-[30%] bg-[radial-gradient(circle_at_58%_42%,rgba(201,184,150,.2),transparent_28%),radial-gradient(circle_at_25%_72%,rgba(80,101,190,.18),transparent_30%)]" />
      <div className="relative z-20 mx-auto max-w-4xl px-6">
        <p className="font-data mb-6 text-[11px] tracking-[0.4em] text-[#C9B896]">01 — MANIFESTO</p>
        <h2 id="manifesto-title" className="sr-only">Manifesto ARCUS</h2>
        <div className="font-display space-y-3 text-3xl leading-[1.15] text-zinc-100 md:text-5xl">
          {LINES.map((l) => (
            <p key={l} data-manifesto-line>{l}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
