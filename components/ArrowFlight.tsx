"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ArrowMesh, BRONZE } from "@/components/Bow3D";

const TARGET_X = 4.6;

/** Alvo: anéis concêntricos + centro emissivo + anel de choque do impacto. */
function Target({
  centerRef,
  shockRef,
  centerMaterial,
  shockMaterial,
}: {
  centerRef: React.RefObject<THREE.Mesh | null>;
  shockRef: React.RefObject<THREE.Mesh | null>;
  centerMaterial: THREE.Material;
  shockMaterial: THREE.Material;
}) {
  return (
    <group position={[TARGET_X, 0.4, -0.5]}>
      {[
        { r: 0.62, c: "#3f3f4b" },
        { r: 0.44, c: "#8E8E99" },
        { r: 0.27, c: BRONZE },
      ].map((ring) => (
        <mesh key={ring.r}>
          <torusGeometry args={[ring.r, 0.045, 10, 48]} />
          <meshStandardMaterial color={ring.c} roughness={0.5} metalness={0.6} />
        </mesh>
      ))}
      <mesh ref={centerRef} material={centerMaterial}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>
      <mesh ref={shockRef} material={shockMaterial} scale={0.5} visible={false}>
        <torusGeometry args={[0.7, 0.03, 8, 48]} />
      </mesh>
    </group>
  );
}

/**
 * Flecha percorre a faixa conforme o scroll e crava no alvo.
 * Progresso medido pelo retângulo do próprio container (#mira-flight).
 */
function Flight({
  shaftMaterial,
  headMaterial,
  centerMaterial,
  shockMaterial,
}: {
  shaftMaterial: THREE.Material;
  headMaterial: THREE.Material;
  centerMaterial: THREE.Material;
  shockMaterial: THREE.Material;
}) {
  const arrow = useRef<THREE.Group>(null);
  const center = useRef<THREE.Mesh>(null);
  const shock = useRef<THREE.Mesh>(null);
  const { invalidate } = useThree();

  useEffect(() => {
    const onScroll = () => invalidate();
    window.addEventListener("scroll", onScroll, { passive: true });
    invalidate();
    return () => window.removeEventListener("scroll", onScroll);
  }, [invalidate]);

  useFrame(() => {
    const el = document.getElementById("mira-flight");
    const vh = window.innerHeight;
    const rect = el?.getBoundingClientRect();
    const raw = rect ? (vh * 0.85 - rect.top) / (vh * 0.5 + rect.height * 0.6) : 0;
    const t = THREE.MathUtils.clamp(raw, 0, 1);
    const e = t * t * (3 - 2 * t);
    const k = THREE.MathUtils.smoothstep(t, 0.9, 1); // impacto

    if (arrow.current) {
      arrow.current.position.set(
        THREE.MathUtils.lerp(-7.2, TARGET_X - 1.7, e),
        0.4 + Math.sin(e * Math.PI) * 0.7,
        -0.5
      );
      arrow.current.rotation.z = Math.cos(e * Math.PI) * 0.1;
    }
    if (shock.current) {
      shock.current.scale.setScalar(0.5 + k * 2.6);
      (shock.current.material as THREE.MeshStandardMaterial).opacity = k * 0.9;
      shock.current.visible = k > 0.01;
    }
    if (center.current) {
      (center.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.7 + k * 4;
    }
  });

  return (
    <>
      <group ref={arrow} position={[-7.2, 0.4, -0.5]}>
        <ArrowMesh material={shaftMaterial} headMaterial={headMaterial} scale={1.15} />
      </group>
      <Target
        centerRef={center}
        shockRef={shock}
        centerMaterial={centerMaterial}
        shockMaterial={shockMaterial}
      />
    </>
  );
}

/**
 * Faixa de voo 3D da Mira. Canvas próprio, demand + DPR baixo,
 * fallback sem WebGL / reduced-motion.
 */
export default function ArrowFlight() {
  // Só monta no cliente (dynamic ssr:false), detecção direta no estado inicial.
  const [gl] = useState<boolean>(() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  });
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mats = useMemo(
    () => ({
      shaft: new THREE.MeshStandardMaterial({ color: "#8E8E99", roughness: 0.4, metalness: 0.8 }),
      bronze: new THREE.MeshStandardMaterial({
        color: BRONZE,
        roughness: 0.28,
        metalness: 0.9,
        emissive: "#2a1e08",
        emissiveIntensity: 0.7,
      }),
      center: new THREE.MeshStandardMaterial({
        color: BRONZE,
        roughness: 0.3,
        metalness: 0.7,
        emissive: "#c9b896",
        emissiveIntensity: 0.7,
      }),
      shock: new THREE.MeshStandardMaterial({
        color: BRONZE,
        roughness: 0.3,
        metalness: 0.7,
        emissive: "#c9b896",
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0,
      }),
    }),
    []
  );
  useEffect(
    () => () => {
      mats.shaft.dispose();
      mats.bronze.dispose();
      mats.center.dispose();
      mats.shock.dispose();
    },
    [mats]
  );

  if (reduced || gl === false)
    return (
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,184,150,0.1),transparent_65%)]"
        aria-hidden
      />
    );

  return (
    <div className="absolute inset-0">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0.5, 9], fov: 42 }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 4]} intensity={1.3} color="#f2e8d5" />
        <Flight
          shaftMaterial={mats.shaft}
          headMaterial={mats.bronze}
          centerMaterial={mats.center}
          shockMaterial={mats.shock}
        />
      </Canvas>
    </div>
  );
}
