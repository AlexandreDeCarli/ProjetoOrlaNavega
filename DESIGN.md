---
name: Painel Costeiro Premium
description: Sistema de design altamente interativo e refinado para o monitoramento costeiro do PGI Orla de Navegantes - SC.
colors:
  primary: "#2c8ebb" # Accent Costal (Sea Blue)
  primary-light: "#ebf4f8" # Accent Costal Light
  secondary: "#2eb37f" # Accent Eco (Restinga Green)
  secondary-light: "#edf8f4" # Accent Eco Light
  tertiary: "#d1a843" # Accent Sun (Sand Gold)
  tertiary-light: "#fbf6e7" # Accent Sun Light
  neutral-bg: "#f7fafb" # Fundo Principal (Coastal Off-White)
  neutral-surface: "#ffffff" # Superfície Opaca
  text-primary: "#0d1e28" # Primary Navy Text
  text-secondary: "#4b5e6b" # Secondary Slate Text
  text-muted: "#6e808e" # Muted Text
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontWeight: 700
    fontSize: "2.5rem"
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontWeight: 400
    fontSize: "1rem"
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.25rem"
  button-primary-hover:
    backgroundColor: "#1f6f96"
  card-explorer:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
---

# Design System: Painel Costeiro Premium

Visual identity guidelines and components for the Plano de Gestão Integrada da Orla (PGI Orla) de Navegantes - SC.

## 1. Overview

**Creative North Star: "The Maritime Ledger"**

"The Maritime Ledger" é um sistema de design concebido sob uma ótica de extrema precisão, sobriedade e transparência pública. Ele serve como o registro oficial e confiável das 87 ações de gestão integrada da orla de Navegantes, aproximando a municipalidade do cidadão. Ele rejeita veementemente as tendências corporativas genéricas de SaaS (como tons saturados artificiais, excesso de caixas soltas em grids e sombras pretas duras tridimensionais), abraçando em vez disso uma linguagem visual purificada, costeira e plana.

**Key Characteristics:**
- **Coastal Off-White Canvas**: Uso de fundos marinhos purificados e dessaturados para descanso visual.
- **Immediate Structural Density**: Apresentação de dados de alta densidade no formato tabular original, evitando blocos inflados.
- **Refined Interactivity**: Transições calmas baseadas em estados de micro-movimento para reações ao cursor e toques.

---

## 2. Colors

O sistema de cores é inteiramente derivado das paisagens naturais e marinhas de Navegantes (SC), traduzido no espaço de cores OKLCH para controle preciso de luminosidade e acessibilidade WCAG 2.1 AA (contraste > 4.5:1 para dados e > 7:1 para cabeçalhos).

### Primary
- **Deep Marine Blue** (`#2c8ebb` / `oklch(0.55 0.16 220)`): O azul marítimo é o vetor primário de interatividade. Usado estritamente para destacar itens ativos, termos do glossário costeiro e botões de chamada primários.
  - Variação clara (`#ebf4f8` / `oklch(0.94 0.02 220)`): Usado como plano de fundo de destaque tátil.

### Secondary
- **Restinga Flora Green** (`#2eb37f` / `oklch(0.60 0.14 165)`): Representa a preservação ecológica e a flora costeira. Utilizado para o status "Concluído / Superado" e indicadores de monitoramento ambiental de sucesso.
  - Variação clara (`#edf8f4` / `oklch(0.95 0.02 165)`): Fundo de destaque ecológico.

### Tertiary
- **Sandy Beach Gold** (`#d1a843` / `oklch(0.72 0.12 70)`): Representa a faixa de areia da praia urbana. Empregado para o status "Previsto / Planejado".
  - Variação clara (`#fbf6e7` / `oklch(0.96 0.02 70)`): Fundo de destaque arenoso.

### Neutral
- **Coastal Off-White** (`#f7fafb` / `oklch(0.985 0.004 220)`): Fundo principal da aplicação. Um tom frio marinho extremamente leve que reduz a emissão de luz azul.
- **Ocean Deep Navy** (`#0d1e28` / `oklch(0.18 0.02 240)`): Tinta tipográfica principal, oferecendo legibilidade superior.
- **Soft Slate Blue** (`#4b5e6b` / `oklch(0.42 0.02 240)`): Tinta secundária para legendas, rótulos e bordas neutras.
- **Muted Ink** (`#6e808e` / `oklch(0.55 0.015 240)`): Metadados sutis e descrições.

### Named Rules
**The Rarity Rule.** O azul primário e o verde ecológico aparecem apenas em componentes de destaque e ação. A sua parcimônia é o que orienta a atenção do usuário para o que de fato importa.

---

## 3. Typography

A tipografia estabelece hierarquia rígida por meio de contrastes nítidos de pesos e tamanhos, utilizando fontes premium hospedadas no Google Fonts.

**Display Font:** Outfit (Weights: 300, 400, 500, 600, 700)
**Body Font:** Plus Jakarta Sans (Weights: 300, 400, 500, 600, 700)

**Character:** A Outfit confere uma estrutura geométrica sofisticada para títulos e números, enquanto a Plus Jakarta Sans atua como o motor de leitura denso e altamente espaçado para dados analíticos.

### Hierarchy
- **Display** (Bold (700), `2.5rem`, `1.15`): Usado exclusivamente para logotipos, títulos de páginas de alto nível e números de KPIs.
- **Headline** (Semi-Bold (600), `1.5rem`, `1.3`): Títulos de seções principais como o explorador de ações.
- **Title** (Semi-Bold (600), `1.1rem`, `1.4`): Títulos de cartões e cabeçalhos de grupos de filtros.
- **Body** (Regular (400), `0.95rem`, `1.6`): Textos corridos de descrição das ações e metas (comprimento de linha restrito a `75ch` para leitura otimizada).
- **Label** (Bold (700), `0.75rem`, `1.2`, ALL-CAPS): Siglas, tags de status e termos do glossário.

---

## 4. Elevation

O sistema rejeita elevações volumétricas exageradas baseadas em sombras pretas duras. Profundidade e foco visual são criados prioritariamente por meio de camadas neutras e transparências sutis (glassmorphism), garantindo um visual limpo e refinado.

### Shadow Vocabulary
- **Interactive Sm** (`box-shadow: 0 4px 12px rgba(0, 30, 60, 0.03)`): Usado em cartões de resumo estático.
- **Overlay Lg** (`box-shadow: 0 16px 48px rgba(0, 30, 60, 0.08)`): Usado exclusivamente para painéis sobrepostos móveis (drawer de filtros e slide-over).

### Named Rules
**The Tonal Flat Rule.** Superfícies permanecem estritamente planas em seu estado de repouso. Sombras discretas surgem apenas em resposta a interações de hover ou em estados flutuantes (overlays).

---

## 5. Components

Os componentes visuais seguem uma lógica de design "Refinado e Restrito", focados em clareza extrema.

### Buttons
- **Shape:** Bordas suavemente arredondadas (`8px` de raio).
- **Primary:** Fundo azul mar (`#2c8ebb`), tipografia Plus Jakarta Sans Bold, cor branca, preenchimento (`10px 20px`).
- **Hover / Focus:** Transição de fundo para azul escuro (`#1f6f96`) em `200ms` com atenuação linear suave.

### Explorer Table
- **Shape:** Bordas arredondadas externas no contêiner (`12px` de raio).
- **Row States:** Hover aciona transição de fundo suave para um azul marinho diluído (`rgba(0, 160, 220, 0.015)`) para manter o foco na linha selecionada.
- **Mobile Viewport:** Transforma-se em tabela nativa horizontalmente rolável (`min-width: 720px`) com células extra compactas (`padding: 0.75rem 0.5rem`) para visualização de mais de 10 ações simultâneas.

### Detail Slide-Over
- **Transition:** Desliza suavemente a partir do canto direito (`transform: translateX(0)`) com curva de aceleração exponencial (`cubic-bezier(0.16, 1, 0.3, 1)`) em `300ms`.
- **Overlay:** Fundo com desfoque de vidro (`backdrop-filter: blur(4px)`) para foco total nas informações.

### Collapsible Accordions
- **State:** Filtros colapsados por padrão no carregamento inicial (`open` ausente).
- **Chevron:** Chevron vetorial rotaciona suavemente (`180deg`) ao expandir.

### Smart Glossary Tooltips
- **Interaction:** Apresentação dinâmica disparada ao pairar o cursor (hover) ou focar pelo teclado (`tabindex="0"`).
- **Rendering:** Centralizado e projetado fora de qualquer contêiner com `overflow: hidden`, eliminando cortes visuais.

---

## 6. Do's and Don'ts

Guardrails e limites estritos do design system para garantir integridade contínua:

### Do:
- **Do** manter a tabela nativa responsiva horizontal em celulares para visualização densa de dados.
- **Do** manter todos os grupos de filtros laterais colapsados por padrão para economizar espaço vertical.
- **Do** garantir contraste tipográfico mínimo de 4.5:1 em todos os rótulos secundários e badges de status.
- **Do** utilizar exclusivamente os pesos e fontes oficiais *Outfit* e *Plus Jakarta Sans*.

### Don't:
- **Don't** utilizar bordas decorativas grossas unilaterais coloridas (side-stripe borders) maior que 1px em cards ou alertas.
- **Don't** aplicar gradientes multicoloridos de fundo ou em recortes de texto (gradient text).
- **Don't** forçar a listagem mobile a se empilhar em cards isolados de rolagem vertical infinita.
- **Don't** utilizar sombras escuras saturadas tridimensionais (shadows com opacidade maior que 8% em tom preto puro).
