"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Instance, Instances } from "@react-three/drei";
import * as THREE from "three";
import { HeroBow } from "@/components/Bow3D";

const BRONZE = "#C9B896";
const STONE = "#3b3b46";
const STONE_DARK = "#232329";

/** Coluna dórica procedural: perfil em Lathe + plinto e ábaco em caixa. */
function Column({
  position,
  height = 3.6,
  rotationY = 0,
  material,
}: {
  position: [number, number, number];
  height?: number;
  rotationY?: number;
  material: THREE.Material;
}) {
  const geometry = useMemo(() => {
    const v = (r: number, y: number) => new THREE.Vector2(Math.max(r, 0.001), y);
    const pts = [
      v(0.55, 0),
      v(0.55, 0.12),
      v(0.42, 0.2),
      v(0.36, 0.36),
      v(0.33, height * 0.45), // éntase: leve barriga no fuste
      v(0.29, height - 0.55),
      v(0.3, height - 0.38),
      v(0.44, height - 0.24), // equino
      v(0.48, height - 0.14),
      v(0.48, height - 0.1),
    ];
    const geo = new THREE.LatheGeometry(pts, 14);
    return geo;
  }, [height]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* plinto */}
      <mesh position={[0, -0.09, 0]} material={material}>
        <boxGeometry args={[1.3, 0.18, 1.3]} />
      </mesh>
      {/* fuste + capitel (lathe) */}
      <mesh material={material} geometry={geometry} />
      {/* ábaco */}
      <mesh position={[0, height - 0.01, 0]} material={material}>
        <boxGeometry args={[1.15, 0.18, 1.15]} />
      </mesh>
    </group>
  );
}

function Colonnade({ stone, stoneDark }: { stone: THREE.Material; stoneDark: THREE.Material }) {
  const group = useRef<THREE.Group>(null);
  const { invalidate } = useThree();

  useEffect(() => {
    const onScroll = () => invalidate();
    window.addEventListener("scroll", onScroll, { passive: true });
    invalidate();
    return () => window.removeEventListener("scroll", onScroll);
  }, [invalidate]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const y = window.scrollY;
    // Parallax de profundidade: fileiras giram/deslocam em taxas distintas.
    group.current.rotation.y = y * 0.00035 + clock.elapsedTime * 0.008;
    group.current.position.y = Math.sin(y * 0.0009) * 0.25;
  });

  const cols: { p: [number, number, number]; h: number; r: number }[] = [
    { p: [-6.2, -1.2, -4.5], h: 4.1, r: 0.4 },
    { p: [-3.1, -1.2, -3.4], h: 3.6, r: 0 },
    { p: [0, -1.2, -4.8], h: 4.4, r: 0.7 },
    { p: [3.1, -1.2, -3.4], h: 3.6, r: 0.2 },
    { p: [6.2, -1.2, -4.5], h: 4.1, r: 0.9 },
  ];

  return (
    <group ref={group}>
      {cols.map((c, i) => (
        <Column key={i} position={c.p} height={c.h} rotationY={c.r} material={i % 2 ? stoneDark : stone} />
      ))}
    </group>
  );
}

function Dust({ count }: { count: number }) {
  // Pseudo-aleatório puro por índice: determinístico, sem mutação.
  const items = useMemo(() => {
    const hash01 = (n: number) => {
      const x = Math.sin(n * 127.1 + count * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    return Array.from({ length: count }, (_, i) => ({
      p: [(hash01(i * 3 + 1) - 0.5) * 15, hash01(i * 3 + 2) * 5 - 1.2, -2 - hash01(i * 3 + 3) * 6] as [
        number,
        number,
        number,
      ],
      r: [hash01(i + 101) * 3, hash01(i + 202) * 3, 0] as [number, number, number],
      gold: i % 6 === 0,
      s: 0.6 + hash01(i + 303) * 0.9,
    }));
  }, [count]);

  return (
    <Instances limit={count} frustumCulled={false}>
      <icosahedronGeometry args={[0.07, 0]} />
      <meshBasicMaterial wireframe transparent opacity={0.55} />
      {items.map((it, i) => (
        <Instance
          key={i}
          position={it.p}
          rotation={it.r}
          scale={it.s}
          color={it.gold ? BRONZE : "#3f3f4b"}
        />
      ))}
    </Instances>
  );
}

/**
 * Cena hero: colunata dórica + flecha bronze em voo scroll-driven.
 * Skill 3d-web-experience: sem OrbitControls (bloquearia o scroll),
 * DPR baixo, frameloop demand, fallback sem WebGL, poeira instanciada.
 */
export default function Scene3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Detecção WebGL no inicializador (sem effect): este componente só monta no cliente.
  const [gl] = useState<boolean>(() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  });
  const isMobile =
    typeof window !== "undefined" &&
    (/iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

  const mats = useMemo(
    () => ({
      stone: new THREE.MeshStandardMaterial({ color: STONE, roughness: 0.85, metalness: 0.05, flatShading: true }),
      stoneDark: new THREE.MeshStandardMaterial({ color: STONE_DARK, roughness: 0.9, metalness: 0.05, flatShading: true }),
      shaft: new THREE.MeshStandardMaterial({ color: "#8E8E99", roughness: 0.4, metalness: 0.8 }),
      string: new THREE.MeshBasicMaterial({ color: "#8E8E99" }),
      bronze: new THREE.MeshStandardMaterial({
        color: BRONZE,
        roughness: 0.28,
        metalness: 0.9,
        emissive: "#2a1e08",
        emissiveIntensity: 0.7,
      }),
    }),
    []
  );
  useEffect(
    () => () => {
      mats.stone.dispose();
      mats.stoneDark.dispose();
      mats.shaft.dispose();
      mats.string.dispose();
      mats.bronze.dispose();
    },
    [mats]
  );

  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return null;
  if (gl === false)
    return (
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,184,150,0.12),transparent_65%)]"
        aria-hidden
      />
    );

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        frameloop="demand"
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 1.1, 8.2], fov: 40 }}
      >
        <fog attach="fog" args={["#0A0A0C", 9, 19]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 3]} intensity={1.5} color="#f2e8d5" />
        <directionalLight position={[-5, 3, -4]} intensity={0.65} color="#6a7bd6" />
        <Colonnade stone={mats.stone} stoneDark={mats.stoneDark} />
        <HeroBow
          limbMaterial={mats.bronze}
          stringMaterial={mats.string}
          shaftMaterial={mats.shaft}
          headMaterial={mats.bronze}
        />
        <Dust count={isMobile ? 20 : 60} />
        <ContactShadows position={[0, -1.35, -2]} opacity={0.6} blur={2.4} far={5} color="#000000" />
      </Canvas>
    </div>
  );
}
