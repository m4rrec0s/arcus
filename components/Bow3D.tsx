"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const BRONZE = "#C9B896";
export const PARCHMENT = "#EDEDF2";
export const ASH = "#8E8E99";

/** Haste cilíndrica entre dois pontos. */
export function Strut({
  from,
  to,
  r = 0.015,
  material,
}: {
  from: [number, number, number];
  to: [number, number, number];
  r?: number;
  material: THREE.Material;
}) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const len = dir.length();
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize()
    );
    const pos = a.add(b).multiplyScalar(0.5);
    return { pos, quat, len };
  }, [from, to]);
  return (
    <mesh position={pos} quaternion={quat} material={material}>
      <cylinderGeometry args={[r, r, len, 6]} />
    </mesh>
  );
}

/** Flecha 3D: haste + ponta cônica + empenas cruzadas. Aponta +X. */
export function ArrowMesh({
  material,
  headMaterial,
  scale = 1,
}: {
  material: THREE.Material;
  headMaterial: THREE.Material;
  scale?: number;
}) {
  return (
    <group scale={scale}>
      <mesh material={material} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 2.4, 10]} />
      </mesh>
      <mesh material={headMaterial} position={[1.45, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.11, 0.5, 10]} />
      </mesh>
      <mesh material={material} position={[-1.05, 0.09, 0]}>
        <boxGeometry args={[0.42, 0.18, 0.015]} />
      </mesh>
      <mesh material={material} position={[-1.05, 0, 0.09]}>
        <boxGeometry args={[0.42, 0.015, 0.18]} />
      </mesh>
    </group>
  );
}

const BOW_R = 1.6;
const BOW_ARC = 3.9;
const GAP_MID = BOW_ARC + (Math.PI * 2 - BOW_ARC) / 2;
const ROT_Z = Math.PI - GAP_MID; // abertura voltada para -X
const TIP_A: [number, number, number] = [BOW_R, 0, 0];
const TIP_B: [number, number, number] = [Math.cos(BOW_ARC) * BOW_R, Math.sin(BOW_ARC) * BOW_R, 0];
// Ponto médio da corda no espaço do grupo (cai sobre o eixo -X por simetria).
const STRING_MID_X = (TIP_A[0] + TIP_B[0]) / 2;

/** Arco 3D: limbs em torus (barriga +X, abertura -X) + corda + flecha nockada. */
export function BowGroup({
  limbMaterial,
  stringMaterial,
  shaftMaterial,
  headMaterial,
  scale = 1.4,
}: {
  limbMaterial: THREE.Material;
  stringMaterial: THREE.Material;
  shaftMaterial: THREE.Material;
  headMaterial: THREE.Material;
  scale?: number;
}) {
  return (
    <group scale={scale}>
      <group rotation={[0, 0, ROT_Z]}>
        <mesh material={limbMaterial}>
          <torusGeometry args={[BOW_R, 0.09, 12, 48, BOW_ARC]} />
        </mesh>
        <Strut from={TIP_A} to={TIP_B} r={0.016} material={stringMaterial} />
      </group>
      {/* flecha nockada: empenas na corda, ponta estendida ao alvo (-X) */}
      <group position={[STRING_MID_X - 1.05, 0, 0]} rotation={[0, Math.PI, 0]}>
        <ArrowMesh material={shaftMaterial} headMaterial={headMaterial} />
      </group>
    </group>
  );
}

/**
 * Arco do hero: começa grande à direita, meio escondido;
 * conforme desce, vem ao centro, gira de frente e mergulha.
 */
export function HeroBow({
  limbMaterial,
  stringMaterial,
  shaftMaterial,
  headMaterial,
}: {
  limbMaterial: THREE.Material;
  stringMaterial: THREE.Material;
  shaftMaterial: THREE.Material;
  headMaterial: THREE.Material;
}) {
  const group = useRef<THREE.Group>(null);
  const { invalidate } = useThree();

  useEffect(() => {
    const onScroll = () => invalidate();
    window.addEventListener("scroll", onScroll, { passive: true });
    invalidate();
    return () => window.removeEventListener("scroll", onScroll);
  }, [invalidate]);

  useFrame(() => {
    const hero = document.getElementById("top");
    const heroH = hero?.offsetHeight || window.innerHeight;
    const t = THREE.MathUtils.clamp(window.scrollY / heroH, 0, 1);
    const e = t * t * (3 - 2 * t);
    if (!group.current) return;
    group.current.position.set(
      THREE.MathUtils.lerp(4.6, 0.9, e),
      THREE.MathUtils.lerp(0.5, -0.5, e),
      0.4
    );
    group.current.rotation.set(0, THREE.MathUtils.lerp(0.55, -0.1, e), THREE.MathUtils.lerp(0, 0.06, e));
  });

  return (
    <group ref={group} position={[4.6, 0.5, 0.4]} rotation={[0, 0.55, 0]}>
      <BowGroup
        limbMaterial={limbMaterial}
        stringMaterial={stringMaterial}
        shaftMaterial={shaftMaterial}
        headMaterial={headMaterial}
      />
    </group>
  );
}
