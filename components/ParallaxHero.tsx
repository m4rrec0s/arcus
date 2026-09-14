"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type BowTransform = {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
};

const INITIAL_TRANSFORM: BowTransform = {
  x: 2.5,
  y: 1.1,
  z: -0.45,
  rotateX: 74,
  rotateY: -124,
  rotateZ: 15,
  scale: 1.83,
};

const MANIFESTO_TRANSFORM: BowTransform = {
  x: -0.95,
  y: 0.6,
  z: 1.4,
  rotateX: 94,
  rotateY: 2,
  rotateZ: 39,
  scale: 0.79,
};

const bowProgressRef = { current: 0 };
const bowInvalidateRef: { current: () => void } = { current: () => undefined };

function LocalBow({ transform, endTransform }: { transform: BowTransform; endTransform: BowTransform }) {
  const ref = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/arcus-bow-no-arrow.glb");
  const { invalidate } = useThree();
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      const materialNames = materials.map((material) => material.name);
      if (node.name.includes("Cylinder.002") || materialNames.some((name) => name === "uç.001" || name === "öncü.001")) {
        node.visible = false;
      }
      materials.forEach((material) => {
        if (material.name === "metal.001") {
          material.color.set("#7a4b2b");
          material.metalness = 0.08;
          material.roughness = 0.42;
        }
      });
      if (node.name.includes("Cylinder.003")) {
        node.material = new THREE.MeshStandardMaterial({
          color: "#f3dfb6",
          emissive: "#75451d",
          emissiveIntensity: 0.55,
          roughness: 0.25,
          metalness: 0.35,
        });
      }
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
    ref.current.scale.setScalar(THREE.MathUtils.lerp(transform.scale, endTransform.scale, progress));
    ref.current.position.set(
      THREE.MathUtils.lerp(transform.x, endTransform.x, progress),
      THREE.MathUtils.lerp(transform.y, endTransform.y, progress),
      THREE.MathUtils.lerp(transform.z, endTransform.z, progress)
    );
    ref.current.rotation.set(
      THREE.MathUtils.lerp(THREE.MathUtils.degToRad(transform.rotateX), THREE.MathUtils.degToRad(endTransform.rotateX), facingProgress),
      THREE.MathUtils.lerp(THREE.MathUtils.degToRad(transform.rotateY), THREE.MathUtils.degToRad(endTransform.rotateY), facingProgress),
      0
    );
    if (spinRef.current) {
      spinRef.current.rotation.z = THREE.MathUtils.lerp(
        THREE.MathUtils.degToRad(transform.rotateZ),
        THREE.MathUtils.degToRad(endTransform.rotateZ - 360),
        spinProgress
      );
    }
  });

  return <group ref={ref}><group ref={spinRef}><primitive object={model} position={[-68.45, 0, 3.2]} /></group></group>;
}

function BowCanvas({ transform, endTransform }: { transform: BowTransform; endTransform: BowTransform }) {
  return (
    <Canvas frameloop="demand" dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} camera={{ position: [0, 0, 7.8], fov: 50 }}>
      <ambientLight intensity={0.65} color="#5a3824" />
      <directionalLight position={[5, 7, 4]} intensity={3.8} color="#ffd49b" />
      <directionalLight position={[-4, 2, 5]} intensity={0.9} color="#9a5d30" />
      <pointLight position={[0, -2, 3]} intensity={1.5} color="#c67c35" distance={8} />
      <Suspense fallback={null}><LocalBow transform={transform} endTransform={endTransform} /></Suspense>
    </Canvas>
  );
}

export default function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const hero = document.getElementById("top");
      const manifesto = document.getElementById("manifesto");
      if (!hero || !manifesto) return;

      // Trajetória 3D dirigida pelo scroll real: 0 no topo do Hero, 1 quando o
      // Manifesto encosta no topo (início do pin). Durante o pin o progresso
      // fica em 1 e o arco segura a posição final exata.
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        endTrigger: manifesto,
        end: "top top",
        scrub: 1.1,
        onUpdate: (self) => {
          bowProgressRef.current = self.progress;
          bowInvalidateRef.current();
        },
      });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          endTrigger: manifesto,
          end: "top top",
          scrub: 1.1,
        },
      });
      tl.to("[data-pl='media']", { yPercent: -4, ease: "none", duration: 1 }, 0);
      tl.to("[data-pl='arch']", { xPercent: -34, yPercent: 8, ease: "none", duration: 1 }, 0);
      tl.fromTo("[data-pl='smoke-a']", { opacity: 0, xPercent: -12 }, { opacity: 0.5, xPercent: 26, ease: "none", duration: 1 }, 0);
      tl.fromTo("[data-pl='smoke-b']", { opacity: 0, yPercent: 14 }, { opacity: 0.32, yPercent: -18, ease: "none", duration: 1 }, 0.12);
      tl.to("[data-pl='backdrop']", { opacity: 0, ease: "none", duration: 0.8 }, 0.1);
      // Camada fixa sai de cena quando Serviços encosta no topo (já cobriu o
      // Manifesto com fundo opaco). Sem fade no arco: cobertura é geométrica.
      const services = document.getElementById("servicos");
      if (services) {
        ScrollTrigger.create({
          trigger: services,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => gsap.set(ref.current, { visibility: self.progress >= 0.999 ? "hidden" : "visible" }),
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden data-parallax-hero>
      <div data-pl="backdrop" className="absolute inset-0 bg-[#0A0A0C]" />
      <div data-pl="backdrop" className="absolute -right-[20%] top-[-20%] size-[80vw] rounded-full bg-[radial-gradient(circle,rgba(201,184,150,.18),transparent_65%)] opacity-50" />
      <div data-pl="smoke-a" className="absolute -left-[22vw] bottom-[-30vh] size-[85vw] rounded-full bg-[radial-gradient(circle,rgba(151,89,42,.28),transparent_42%,transparent_72%)] blur-[90px] mix-blend-screen" />
      <div data-pl="smoke-b" className="absolute right-[-24vw] top-[24vh] size-[64vw] rounded-full bg-[radial-gradient(circle,rgba(207,157,94,.15),transparent_48%,transparent_72%)] blur-[110px] mix-blend-screen" />
      <div data-pl="arch" className="absolute inset-0 [transform-style:preserve-3d]">
        <div data-pl="media" className="absolute inset-0 will-change-transform">
          <BowCanvas transform={INITIAL_TRANSFORM} endTransform={MANIFESTO_TRANSFORM} />
        </div>
      </div>
      <div data-pl="backdrop" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,12,.5)_0%,rgba(10,10,12,.12)_58%,rgba(10,10,12,.2)_100%)]" />
      <div data-pl="backdrop" className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0A0A0C] to-transparent" />
    </div>
  );
}
