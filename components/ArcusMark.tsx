"use client";

import type { Ref } from "react";

/**
 * Marca ARCUS regulada: geometria simétrica em torno do eixo y=180.
 * - Arco à direita: pontas em x=470, barriga para a DIREITA (longe da flecha).
 * - Corda vertical em x=470 encara a flecha que vem da esquerda;
 *   `stringPull` puxa o nock para a esquerda (direção da flecha).
 * - Flecha: haste y=180, ponta a 4px da corda, empenas em linhas paralelas.
 * Um único módulo — intro e hero usam o mesmo, nunca desalinham.
 */
export default function ArcusMark({
  arrowX = 0,
  stringPull = 0,
  glow = 0,
  className = "",
  arrowRef,
  bowRef,
  stringRef,
  flashRef,
}: {
  arrowX?: number;
  stringPull?: number;
  glow?: number;
  className?: string;
  arrowRef?: Ref<SVGGElement>;
  bowRef?: Ref<SVGGElement>;
  stringRef?: Ref<SVGPathElement>;
  flashRef?: Ref<SVGEllipseElement>;
}) {
  const nockX = 470 - stringPull;
  return (
    <svg
      viewBox="0 0 640 360"
      className={className}
      role="img"
      aria-label="Arco e flecha ARCUS"
      fill="none"
    >
      <defs>
        <radialGradient id="arcus-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.85 * glow} />
          <stop offset="45%" stopColor="#c9b896" stopOpacity={0.35 * glow} />
          <stop offset="100%" stopColor="#c9b896" stopOpacity={0} />
        </radialGradient>
      </defs>

      <ellipse ref={flashRef} data-flash cx="470" cy="180" rx="150" ry="130" fill="url(#arcus-glow)" opacity={glow > 0 ? 1 : 0} />

      {/* arco: barriga para a direita, corda à esquerda encarando a flecha */}
      <g ref={bowRef} data-bow style={{ transformOrigin: "470px 180px" }}>
        <path
          d="M470 40 C 548 108, 548 252, 470 320"
          stroke="#EDEDF2"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          ref={stringRef}
          data-string
          d={`M470 40 L${nockX} 180 L470 320`}
          stroke="#8E8E99"
          strokeWidth="1.5"
        />
      </g>

      {/* flecha: haste + ponta à direita + empenas (linhas paralelas, nunca confundem com ponta) */}
      <g ref={arrowRef} data-arrow style={{ transform: `translateX(${arrowX}px)` }}>
        <line x1={96} y1={180} x2={428} y2={180} stroke="#EDEDF2" strokeWidth="3.5" />
        <path d="M428 166 L428 194 L466 180 Z" fill="#EDEDF2" />
        <line x1={100} y1={173} x2={134} y2={173} stroke="#8E8E99" strokeWidth="2" strokeLinecap="round" />
        <line x1={100} y1={187} x2={134} y2={187} stroke="#8E8E99" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* nock */}
      <circle cx="470" cy="180" r="3.5" fill="#C9B896" />

      {/* onda de choque do encaixe (intro anima r + opacity) */}
      <circle data-shockwave cx="470" cy="180" r="10" stroke="#C9B896" strokeWidth="2" opacity="0" />
    </svg>
  );
}
