"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { MotionProfile } from "@/lib/motion-profile";

gsap.registerPlugin(ScrollTrigger);

type BowTransform = { x: number; y: number; z: number; rotateX: number; rotateY: number; rotateZ: number; scale: number };

const INITIAL_TRANSFORM: BowTransform = { x: 2.5, y: 1.1, z: -0.45, rotateX: 74, rotateY: -124, rotateZ: 15, scale: 1.83 };
const MANIFESTO_TRANSFORM: BowTransform = { x: -0.95, y: 0.6, z: 1.4, rotateX: 94, rotateY: 2, rotateZ: 39, scale: 0.79 };
const bowProgressRef = { current: 0 };
const bowInvalidateRef: { current: () => void } = { current: () => undefined };

function LocalBow() {
  const ref = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/arcus-bow-no-arrow.glb");
  const { invalidate } = useThree();
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      if (node.name.includes("Cylinder.002") || materials.some((material) => material.name === "uç.001" || material.name === "öncü.001")) node.visible = false;
      materials.forEach((material) => {
        if (material.name === "metal.001") {
          material.color.set("#7a4b2b");
          material.metalness = 0.08;
          material.roughness = 0.42;
        }
      });
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    const onScroll = () => invalidate();
    bowInvalidateRef.current = invalidate;
    window.addEventListener("scroll", onScroll, { passive: true });
    invalidate();
    return () => {
      window.removeEventListener("scroll", onScroll);
      bowInvalidateRef.current = () => undefined;
    };
  }, [invalidate]);

  useFrame(() => {
    if (!ref.current) return;
    const progress = THREE.MathUtils.clamp(bowProgressRef.current, 0, 1);
    const facingProgress = THREE.MathUtils.smoothstep(progress, 0, 0.28);
    const spinProgress = THREE.MathUtils.smoothstep(progress, 0.12, 1);
    ref.current.scale.setScalar(THREE.MathUtils.lerp(INITIAL_TRANSFORM.scale, MANIFESTO_TRANSFORM.scale, progress));
    ref.current.position.set(THREE.MathUtils.lerp(INITIAL_TRANSFORM.x, MANIFESTO_TRANSFORM.x, progress), THREE.MathUtils.lerp(INITIAL_TRANSFORM.y, MANIFESTO_TRANSFORM.y, progress), THREE.MathUtils.lerp(INITIAL_TRANSFORM.z, MANIFESTO_TRANSFORM.z, progress));
    ref.current.rotation.set(THREE.MathUtils.lerp(THREE.MathUtils.degToRad(INITIAL_TRANSFORM.rotateX), THREE.MathUtils.degToRad(MANIFESTO_TRANSFORM.rotateX), facingProgress), THREE.MathUtils.lerp(THREE.MathUtils.degToRad(INITIAL_TRANSFORM.rotateY), THREE.MathUtils.degToRad(MANIFESTO_TRANSFORM.rotateY), facingProgress), 0);
    if (spinRef.current) spinRef.current.rotation.z = THREE.MathUtils.lerp(THREE.MathUtils.degToRad(INITIAL_TRANSFORM.rotateZ), THREE.MathUtils.degToRad(MANIFESTO_TRANSFORM.rotateZ - 360), spinProgress);
  });

  return <group ref={ref}><group ref={spinRef}><primitive object={model} position={[-68.45, 0, 3.2]} /></group></group>;
}

export default function ParallaxHeroCanvas({ profile }: { profile: Exclude<MotionProfile, "static"> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);
  const isActiveRef = useRef(true);

  useEffect(() => {
    const services = document.getElementById("servicos");
    if (!services) return;

    const updateActivity = () => {
      const nextActive = services.getBoundingClientRect().top > 0;
      if (nextActive === isActiveRef.current) return;
      isActiveRef.current = nextActive;
      setIsActive(nextActive);
    };

    updateActivity();
    window.addEventListener("scroll", updateActivity, { passive: true });
    window.addEventListener("resize", updateActivity);
    return () => {
      window.removeEventListener("scroll", updateActivity);
      window.removeEventListener("resize", updateActivity);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const hero = document.getElementById("top");
      const manifesto = document.getElementById("manifesto");
      const services = document.getElementById("servicos");
      if (!hero || !manifesto) return;
      ScrollTrigger.create({ trigger: hero, start: "top top", endTrigger: manifesto, end: "top top", scrub: profile === "full" ? 1.1 : 0.4, onUpdate: (self) => { bowProgressRef.current = self.progress; bowInvalidateRef.current(); } });
      gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", endTrigger: manifesto, end: "top top", scrub: profile === "full" ? 1.1 : 0.4 } })
        .to("[data-pl='media']", { yPercent: -4, ease: "none", duration: 1 }, 0)
        .to("[data-pl='arch']", { xPercent: -34, yPercent: 8, ease: "none", duration: 1 }, 0)
        .to("[data-pl='backdrop']", { opacity: 0, ease: "none", duration: 0.8 }, 0.1)
        .to("[data-pl='manifesto-backdrop']", { opacity: 1, ease: "none", duration: 0.35 }, 0.65);
      if (services) ScrollTrigger.create({ trigger: services, start: "top bottom", end: "top top", onUpdate: (self) => gsap.set(ref.current, { visibility: self.progress >= 0.999 ? "hidden" : "visible" }) });
    }, ref);
    return () => ctx.revert();
  }, [profile]);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden>
      <div data-pl="backdrop" className="absolute inset-0 bg-[#0A0A0C]" />
      <div data-pl="backdrop" className="absolute -right-[20%] top-[-20%] size-[80vw] rounded-full bg-[radial-gradient(circle,rgba(201,184,150,.18),transparent_65%)] opacity-50" />
      <div data-pl="manifesto-backdrop" className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(201,184,150,.16),transparent_28%),linear-gradient(#0A0A0C,transparent_45%,#0A0A0C)] opacity-0" />
      <div data-pl="arch" className="absolute inset-0 [transform-style:preserve-3d]"><div data-pl="media" className="absolute inset-0 will-change-transform"><Canvas frameloop={isActive ? "demand" : "never"} dpr={[1, 1.25]} gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 7.8], fov: 50 }}><ambientLight intensity={0.65} color="#5a3824" /><directionalLight position={[5, 7, 4]} intensity={3.8} color="#ffd49b" /><directionalLight position={[-4, 2, 5]} intensity={0.9} color="#9a5d30" /><Suspense fallback={null}><LocalBow /></Suspense></Canvas></div></div>
      <div data-pl="backdrop" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,12,.5)_0%,rgba(10,10,12,.12)_58%,rgba(10,10,12,.2)_100%)]" />
    </div>
  );
}
