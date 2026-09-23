"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useMotionProfile } from "@/lib/motion-profile";

const ParallaxHeroCanvas = dynamic(() => import("./ParallaxHeroCanvas"), { ssr: false });

function Fallback() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibility = () => {
      const services = document.getElementById("servicos");
      if (ref.current && services) ref.current.style.visibility = services.getBoundingClientRect().top <= 0 ? "hidden" : "visible";
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return <div ref={ref} className="pointer-events-none fixed inset-0 z-10 overflow-hidden bg-[radial-gradient(circle_at_75%_24%,rgba(201,184,150,.2),transparent_24%),linear-gradient(140deg,#0A0A0C_22%,#18120f_55%,#0A0A0C_86%)]" aria-hidden><div className="absolute inset-0 bg-[url('/parallax/hero-bow.webp')] bg-cover bg-[70%_center] opacity-35 mix-blend-screen" /><div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0A0C_0%,rgba(10,10,12,.38)_58%,#0A0A0C_100%)]" /></div>;
}

export default function ParallaxHero() {
  const profile = useMotionProfile();
  const [loadCanvas, setLoadCanvas] = useState(false);

  useEffect(() => {
    if (profile === "static") return;
    const start = () => setLoadCanvas(true);
    const idle = window.requestIdleCallback?.(start, { timeout: 1200 });
    const timeout = window.setTimeout(start, 1200);
    return () => {
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(timeout);
    };
  }, [profile]);

  if (profile === "static" || !loadCanvas) return <Fallback />;
  return <ParallaxHeroCanvas profile={profile} />;
}
