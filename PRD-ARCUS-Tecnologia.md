# PRD — Site Institucional ARCUS Tecnologia

**Versão:** 1.0
**Documento destinado a:** guiar um agente de IA (ou dev) na construção completa do site
**Empresa:** ARCUS Tecnologia — soluções de TI (sites, apps, automações, atendimento com IA, n8n)

---

## 1. Visão Geral

ARCUS vem do latim "arco". O site deve traduzir isso em uma experiência: **tensão → precisão → impacto**. A flecha é a metáfora central: um projeto de software é planejado (arco armado), executado com precisão (flecha em voo) e entrega resultado (acerto no alvo). Toda a narrativa de scroll do site deve reforçar essa jornada.

**Tom visual:** minimalista, escuro, preciso, quase "arquitetura grega moderna" — colunas, proporção áurea, linhas finas, muito espaço negativo, tipografia com serifas geométricas ou sans-serif de alto contraste (igual ao logo já enviado).

**Objetivo do site:** posicionar a ARCUS como uma empresa técnica de alto padrão (não uma agência genérica), gerar leads qualificados (formulário/WhatsApp) e demonstrar capacidade técnica através da própria experiência do site (o site *é* o portfólio).

---

## 2. Stack Tecnológica Recomendada

A escolha da stack é o ponto mais importante do PRD: o site precisa parecer "AAA" mas carregar rápido em 4G. A regra de ouro é **separar o que é decorativo (3D/WebGL) do que é conteúdo (HTML/DOM)**, carregando o pesado sob demanda.

| Camada | Tecnologia | Por quê |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Já é o stack que você domina; SSR/SSG para SEO, code-splitting automático por rota, `next/image` para otimização de imagens |
| Estilo | **Tailwind CSS** | Consistente com seu fluxo atual, zero CSS morto em produção |
| Scroll suave | **Lenis** (ex-`studio-freight/lenis`) | Smooth scroll leve (~3kb), substitui soluções pesadas tipo Locomotive Scroll |
| Animação 2D/scroll | **GSAP + ScrollTrigger** | Padrão de mercado para animações "scrollytelling" cinematográficas, timelines precisas e performáticas (usa transform/opacity, não reflow) |
| Animação de UI/entrada | **Framer Motion (motion/react)** | Ótimo para microinterações de componentes React (hover, entrada de cards) — usar GSAP só para as sequências "orquestradas" de scroll |
| 3D | **React Three Fiber (R3F) + drei** | Abstração React sobre Three.js; `drei` já traz helpers (`useGLTF`, `Environment`, `ScrollControls`, `Preload`) |
| Otimização de assets 3D | **Draco / Meshopt compression** via `gltf-transform` | Reduz modelos glTF em até 90% de tamanho |
| Estado global leve | **Zustand** | Para controlar estágio da animação de intro (`loading` → `arrow-flying` → `snap` → `revealed`) e progresso de loading compartilhado entre componentes |
| Fontes | **next/font** (self-hosted) | Evita layout shift e chamada externa ao Google Fonts |
| Ícones | **Lucide React** | Leve, SVG puro |
| Deploy | **Docker + Easypanel (Swarm)**, seu setup atual na Contabo | Next.js em modo `standalone` gera imagem Docker mínima |

### Por que não usar só CSS/Framer Motion para tudo?
Dá para simular parte disso sem 3D real (ver seção 4), mas como você quer "efeito 3D com parallax dependendo do scroll" de verdade (profundidade, rotação de câmera, luz), R3F é a ferramenta certa. O segredo de performance não é evitar 3D, é:
1. Carregar o `<Canvas>` só depois que a intro precisa dele (lazy/dynamic import, `ssr: false`).
2. Modelos low-poly (poucos milhares de triângulos), texturas até 1-2K, comprimidos.
3. Um único `<Canvas>` reaproveitado para todas as seções 3D (trocar objetos dentro dele em vez de criar vários canvas — cada `<canvas>` WebGL novo é caro).
4. Pausar o render loop (`invalidateFrameloop`) quando a seção 3D não está visível (`IntersectionObserver`).
5. Renderizar em `frameloop="demand"` no R3F, disparando frames só quando o scroll muda — praticamente zero custo de GPU quando o usuário está parado lendo texto.

---

## 3. Sequência de Abertura (Hero Intro) — o coração do site

Esta é a parte mais delicada tecnicamente porque **a animação de loading precisa estar genuinamente atrelada ao carregamento real dos assets**, não ser só decorativa (senão trava ou parece falsa).

### 3.1 Fluxo passo a passo

1. **Tela preta (`#0A0A0C`)** — nada visível, talvez um leve ruído/grão de fundo (efeito "film grain" via shader CSS, custo zero de asset).
2. **Flecha aparece na lateral esquerda**, fina, em SVG (não 3D nessa etapa — SVG carrega instantaneamente, sem esperar bundle de Three.js).
3. A flecha se move da esquerda para a direita da tela usando GSAP, e **a posição X da flecha é controlada pelo progresso real de carregamento** (0% a 100%), não por tempo fixo:
   - Use um `LoadingManager` (Three.js) ou uma Promise.all customizada que rastreia: fontes, imagens críticas, o(s) modelo(s) glTF, o bundle do R3F.
   - Cada asset resolvido dispara `setProgress(x)` no Zustand → GSAP interpola a posição da flecha com `gsap.to(arrow, { x: progress * screenWidth })`.
   - Isso significa: numa conexão rápida a flecha "voa" quase instantaneamente; numa conexão lenta ela se move mais devagar — mas nunca trava esperando algo invisível, porque ela está fisicamente amarrada ao progresso.
4. Ao chegar a 100%, a flecha desacelera (`ease: "power3.out"`) e **se encaixa no arco** — o arco (também SVG, já posicionado, invisível/opaco 0 até esse momento) faz um "snap": pequena escala (1.05 → 1) + leve tensão nas cordas (path morph SVG) simulando o impacto.
5. No exato frame do encaixe: **flash sutil de luz** (glow radial atrás do arco) + a logo completa (arco + texto "ARCUS") faz fade/scale-in.
6. Tagline aparece logo depois (`stagger` de 0.15s por palavra) — algo como *"Precisão em cada linha de código."*
7. Um indicador de "scroll para explorar" aparece (seta para baixo com bounce sutil), e só agora o `<Canvas>` R3F é montado em background para a próxima seção (lazy-loaded durante essa pausa, para o usuário nunca ver um "pop" de 3D carregando).

### 3.2 Detalhe técnico do "encaixe"
Recomendo fazer arco e flecha como **um único SVG modular** com paths separados (`<path id="bow">`, `<path id="arrow">`, `<path id="string">`), animados via GSAP (`gsap.to("#arrow", {...})`) em vez de duas imagens soltas — assim as proporções nunca desalinham entre dispositivos. Como você já tem o logo (arco+flecha preto/branco), a forma mais rápida de produzir isso é:
- Abrir o logo original (se estiver em vetor) no Illustrator/Figma/Inkscape.
- Separar arco, flecha e corda em 3 objetos/paths distintos.
- Exportar como SVG otimizado (SVGO) com os IDs preservados.

Se você só tem o PNG (como o enviado), a rota é: recriar o ícone em vetor (rápido, é uma forma geométrica simples — um Bezier para o arco, uma linha+triângulo para a flecha) ou usar uma IA de vetorização (Recraft, Adobe Illustrator "Image Trace", ou pedir para uma IA de geração recriar em SVG description).

---

## 4. Estrutura de Seções (scroll storytelling)

Ordem sugerida — cada seção com uma "cena" própria de parallax/3D:

1. **Hero / Intro** (seção 3 acima)
2. **Manifesto / Sobre** — texto curto, forte, com efeito de "reveal" de linhas (cada linha do parágrafo ilumina conforme entra no viewport — clássico efeito GSAP `ScrollTrigger` com `scrub`). Fundo com colunas gregas estilizadas em wireframe 3D, rotacionando muito sutilmente com o scroll (parallax de profundidade: colunas ao fundo se movem mais devagar que o texto).
3. **Serviços** (Sites, Apps, Automações, Atendimento com IA, n8n) — cards que "flutuam" em profundidades diferentes (parallax de camadas: card mais próximo da câmera se move mais rápido que o card atrás — 3-4 camadas de `translateZ`/`translateY` proporcionais à velocidade de scroll).
4. **Como Trabalhamos / Processo** — linha do tempo horizontal ou vertical, estilo "trajetória da flecha": uma trilha (path SVG curvo) onde um ponto de luz percorre conforme o usuário rola, marcando etapas (Diagnóstico → Arquitetura → Desenvolvimento → Entrega/Suporte). Pode usar `gsap.to(pointOnPath, { motionPath: {...}, scrollTrigger: { scrub: true } })`.
5. **Tecnologias** — grid de ícones/stack (Next.js, Node, Python, n8n, IA, Docker, AWS) com leve efeito de profundidade no mouse (parallax de cursor, opcional, `useMousePosition` + transform).
6. **Cases/Portfólio** — (mesmo com poucos cases hoje, deixar a seção pronta para 2-3 destaques: Cesto d'Amore, concessionária Honda). Cards com hover 3D (tilt sutil ao passar o mouse, `react-tilt` ou manual com `onMouseMove`).
7. **CTA final / Contato** — repetir o motivo do arco: "Vamos mirar no seu próximo projeto" + formulário/WhatsApp direto. Fundo volta ao preto absoluto, fechando o ciclo visual com o início.
8. **Footer** — minimalista, links, redes, CNPJ/dados quando formalizado.

**Regra de ouro de parallax:** nunca mais de 3-4 camadas de profundidade por seção, e sempre usar `transform: translate3d()`/`scale` (GPU-accelerated) — nunca animar `top`/`left`/`width` (causa reflow e engasga o scroll).

---

## 5. Onde Encontrar Modelos 3D Compatíveis

Como o estilo é minimalista/geométrico grego + tech, você não precisa de modelos realistas pesados — o ideal são **formas low-poly ou wireframe estilizadas**, que são leves e combinam com a estética.

**Bancos de modelos (gratuitos, licença permissiva):**
- **Poly Pizza** (poly.pizza) — modelos low-poly gratuitos, exatamente o estilo que combina, formato GLB pronto para web.
- **Sketchfab** (filtrar por "Downloadable" + licença CC0/CC-BY) — busque termos como "greek column low poly", "laurel wreath low poly", "bow and arrow low poly".
- **Kenney.nl** — assets low-poly gratuitos (não tem colunas gregas, mas tem formas geométricas úteis para fundo abstrato).
- **Quaternius** (quaternius.com) — pacotes low-poly gratuitos de altíssima qualidade visual.

**O que buscar especificamente:**
- Coluna grega / coluna dórica (low poly)
- Laurel wreath (coroa de louros) — remete a vitória/precisão
- Formas geométricas abstratas (icosaedro, esfera facetada) para usar como partículas de fundo
- Se não achar um arco/flecha 3D bom o suficiente, **vale mais a pena modelar você mesmo em Blender** (é uma forma simples, poucas horas de trabalho) do que forçar um asset genérico que não bate com o logo.

**Fluxo de otimização depois de baixar:**
1. Importar no **Blender**, decimar a malha se tiver excesso de polígonos (`Decimate Modifier`).
2. Exportar como `.glb` (binário, já embute texturas).
3. Rodar no **gltf.report** (https://gltf.report) para inspecionar tamanho/triângulos.
4. Comprimir com `gltf-transform`:
   ```
   npx @gltf-transform/cli optimize input.glb output.glb --compress draco
   ```
5. Meta: cada modelo de seção **abaixo de 300-500KB** já comprimido.

**Alternativa sem modelos externos:** boa parte do efeito "3D" pode ser feito só com **geometrias primitivas do Three.js** (linhas, planos, esferas de wireframe) geradas por código — zero download de asset, 100% leve, e combina muito bem com o estilo minimalista/técnico da marca. Recomendo essa abordagem para o fundo das seções, reservando modelos importados só para 1-2 "hero moments" (ex: a coluna grega na seção Sobre).

---

## 6. Performance & Acessibilidade

- Respeitar `prefers-reduced-motion`: usuários com essa preferência recebem fade-ins simples, sem parallax/3D.
- 3D desabilitado ou simplificado (menos partículas, sem sombra dinâmica) em mobile — detectar via `navigator.hardwareConcurrency` ou simplesmente breakpoint de largura.
- `next/dynamic` com `ssr:false` para todo componente que usa `@react-three/fiber`.
- Precarregar apenas fontes/CSS crítico; modelos 3D carregam em paralelo mas não bloqueiam o LCP (Largest Contentful Paint) — o texto/logo do hero deve aparecer mesmo se o 3D ainda estiver processando.
- Meta de performance: Lighthouse mobile ≥ 85 mesmo com as animações (realista com essa stack se os cuidados acima forem seguidos).

---

## 7. Conteúdo (segunda camada, após o esqueleto visual estar pronto)

Uma vez que a estrutura/animações estiverem validadas com conteúdo placeholder, refinar:
- Copy do manifesto (tom: preciso, confiante, sem jargão vazio de agência)
- Descrição de cada serviço com 2-3 linhas + benefício de negócio, não só a tecnologia
- Estudos de caso reais (Cesto d'Amore, concessionária) com métrica de impacto quando possível
- SEO: metadata por seção, `sitemap.xml`, dados estruturados (Organization schema) para aparecer bem em buscas locais (Campina Grande/PB e Brasil)

---

## 8. Fases de Entrega Sugeridas

1. **Fase 1 — Esqueleto & Intro:** setup Next.js/Tailwind/Lenis, animação de abertura completa e funcional (flecha→arco→logo), scroll base com Lucide/placeholder de seções.
2. **Fase 2 — Cenas 3D/Parallax:** implementar as camadas de profundidade e os modelos 3D em cada seção.
3. **Fase 3 — Conteúdo real + SEO + polish de microinterações + deploy no Easypanel/Docker.**

---

## 9. Resumo para o Agente de IA (prompt-guia)

> Construa um site Next.js (App Router) + Tailwind para a ARCUS Tecnologia. A abertura é uma animação em SVG (arco/flecha do logo) controlada pelo progresso real de carregamento dos assets via GSAP + Zustand; ao completar, a flecha se encaixa no arco e a logo/tagline aparecem. Abaixo do hero, use Lenis para smooth scroll e GSAP ScrollTrigger (com `scrub`) para orquestrar entradas de texto e camadas de parallax (`translate3d`) em cada seção de serviço/processo/tecnologia. Use React Three Fiber apenas onde houver modelo 3D real (ex: coluna grega estilizada), sempre com `dynamic import ssr:false`, `frameloop="demand"` e modelos `.glb` comprimidos com Draco abaixo de 500KB. Respeite `prefers-reduced-motion` e simplifique 3D em mobile.
