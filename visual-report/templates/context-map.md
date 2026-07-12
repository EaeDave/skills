# Context map report

An overview of a project or domain. The reader's question: *what does this
system do, in what parts, and how do the parts relate?*

## Sections, in order

1. **Visão geral** — one paragraph: what the system is for and who uses it.
2. **Mapa** — one Mermaid `flowchart` (or `graph LR`) of business modules and
   their relations. Nodes are capabilities ("Cobrança", "Cadastro de
   clientes"), edges are labeled with what flows between them (dados, eventos,
   decisões). 5-12 nodes; beyond that, group into subgraphs.
3. **Módulos** — one card per node in the map: name, responsibility in 1-2
   sentences, key business rules it owns (bullets), and what it depends on.
4. **Regras transversais** — bullets for rules that cut across modules
   (permissões, limites globais, auditoria). Omit if none.
5. **Pontos de atenção** — bullets for gaps, overlaps, or ambiguities the
   mapping exposed. Omit if none.

## Guidance

- Node names in the map must match card titles in section 3 exactly — the map
  is the index, the cards are the detail.
- Name modules by business capability, never by deployment or repository
  layout.
