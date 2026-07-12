# Flow report

The journey through one business rule or process. The reader's question:
*what happens, step by step, and where does it branch?*

## Sections, in order

1. **Resumo** — one paragraph: what triggers the flow and what it produces.
2. **Diagrama** — one Mermaid diagram, picked by shape:
   - `flowchart TD` — decision-heavy flows (branches, validations, limits).
   - `sequenceDiagram` — multiple actors exchanging requests/responses.
   - `stateDiagram-v2` — an entity moving through statuses.
   Decision nodes phrase the business question ("Valor acima do limite?"),
   edges carry the answer.
3. **Passos** — a numbered list mirroring the diagram: each step in one
   sentence, plus conditions and outcomes where the flow branches.
4. **Casos de exceção** — bullets: what happens on each failure or edge path
   (rejeição, estorno, timeout de negócio). Omit if the flow has none.
5. **Envolvidos** — a short table of actors/roles and what each decides or
   provides. Omit for single-actor flows.

## Guidance

- Diagram and step list must agree: every branch in the diagram has a
  numbered step, every numbered step appears in the diagram.
- Keep one flow per report; a second flow the user asked to contrast belongs
  in the comparison template instead.
