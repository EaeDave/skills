# Comparison report

Two or more business rules, endpoints, or versions, side by side. The reader's
question: *what is the same, what differs, and does the difference matter?*

## Sections, in order

1. **Resumo** — one paragraph: what is being compared and the single most
   important difference, in business terms.
2. **Lado a lado** — one card per subject in a side-by-side grid. Each card:
   subject name, purpose in one sentence, then the same attribute list in the
   same order across all cards (endpoint, parameters, conditions, limits,
   outcomes — whichever apply). Identical structure across cards is what makes
   the comparison scannable.
3. **Tabela de diferenças** — one row per attribute, one column per subject,
   plus a final column stating the practical impact of the difference. Badge
   each row `igual` / `difere`. Rows where everything is equal can collapse
   into a single "idênticos em: …" line above the table.
4. **Diagrama** (when behavior branches differ) — one Mermaid `flowchart`
   showing where the subjects' paths diverge, or two small flowcharts side by
   side when a merged one gets tangled.
5. **Conclusão** — 2-4 bullets: which subject applies when, and any risk or
   inconsistency the comparison exposed.

## Guidance

- Attribute order is a contract: fix it in section 2 and reuse it in section 3.
- "Difere" rows carry the report's value — give each an impact statement, not
  just the raw values.
- Parameters the user asked about appear verbatim; their *meaning* is
  explained in business terms next to them.
