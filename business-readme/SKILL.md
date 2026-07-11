---
name: business-readme
description: Identifies business rules from project context and maintains a concise README with human-readable business rules first, then technical run instructions, plus `docs/LLM_CONTEXT.md` for future agents. Use when the user asks to update a README from project context, extract business rules, document product behavior, maintain LLM project context, or when a feature/debug fix changes business rules.
---

# Business README

## Quick start

1. Ask the output language before writing docs: `1. Português do Brasil`, `2. English`, or custom typed language. If the user already answered in this conversation, use that.
2. Inspect the project context: README, docs, tests, routes/controllers/use-cases/domain models, schemas/migrations/seeds, config, examples, integration clients, real endpoints/operation names, and recent task context relevant to business behavior.
3. Update `README.md` so business rules come first in human language, then technical execution instructions.
4. Create or update `docs/LLM_CONTEXT.md` with only non-inferable context: rule pointers, real endpoints/operations, uncertainties, and durable gotchas. If the root-level `docs/` directory does not exist, create it first.
5. Run the validator script if available: `node <skill>/scripts/validate-business-readme.cjs <project-root>`.

## Source-of-truth policy

- Code and tests beat old docs when they disagree.
- Existing README text is evidence, not authority, unless the user says it is the contract.
- When code/tests/docs conflict, document observed behavior and record the conflict in `docs/LLM_CONTEXT.md`.
- Ask the user only when a rule is ambiguous, dangerous to infer, or requires choosing product intent instead of observed behavior.
- Never invent business rules. Mark unresolved items as explicit unknowns.

## README structure

Use a concise human-first structure:

```md
# Project name

<!-- business-readme:business-rules:start -->
## Business rules

[Complete product rules in plain human language. Explain actors, decisions, states, limits, exceptions, outcomes, and the real source for each backend/integration-backed rule. Label the source type clearly: `Endpoint interno: /api/intelipost/orders`, `Operação externa: MILLENNIUM!MGRENDENE.INTELIPOST.LISTA_PEDIDOS`, `Evento interno: order.created`, or `Job interno: sync-orders`.]
<!-- business-readme:business-rules:end -->

<!-- business-readme:technical:start -->
## Technical guide

[How to install, configure, run, test, and deploy. Preserve useful commands from the previous README.]
<!-- business-readme:technical:end -->
```

Rules for the README:

- Business rules must appear before technical instructions.
- For rules validated or triggered by a backend/API/integration, show the real entrypoint beside the rule and label whether it is internal or external: `Endpoint interno: <route>`, `Operação externa: <system.operation>`, `Evento interno/externo: <event>`, or `Job interno/externo: <job>`.
- Prefer domain terms a non-engineer would understand.
- Keep technical detail out of the business section unless it changes the business outcome or identifies the real source of a rule.
- If the existing README is mostly technical or weak on business rules, replace its structure once, preserving useful technical commands under `Technical guide`.
- If marker blocks already exist, update only those generated blocks and preserve manual content outside them.

## `docs/LLM_CONTEXT.md` structure

Create or update this file inside a root-level `docs/` directory. If `docs/` does not exist, create it before writing the file; if it already exists, place `LLM_CONTEXT.md` inside it. Do not write a root-level `LLM_CONTEXT.md`.

```md
<!-- business-readme:context:start -->
# LLM Context

<!-- Admission filter: if an agent can discover a fact by reading the code, it
     does NOT belong here (redundant context adds ~20% inference cost for no
     gain — arXiv:2602.11988). Keep this whole file under ~100 lines. -->

## Current business rule map
[Pointers only: rule name → file/test where it lives, with labeled real sources: internal endpoints/events/jobs vs external APIs/operations. Never copy rule text from the README.]

## Non-inferable technical facts
[Only what reading the code cannot reveal: external operation names and their quirks, environment/credential gotchas, rate limits, sandbox vs production differences, non-standard tooling. No directory maps, no entrypoint lists, no command lists — those are discoverable in the code or live in the README technical guide.]

## Conflicts and unknowns
[Only unresolved ambiguity or divergence between code/tests/docs. Write `None observed.` when there are no active conflicts or unknowns.]

## Durable decisions and gotchas
[Only decisions, caveats, or past context that still affects future code changes. Do not keep execution logs here.]
<!-- business-readme:context:end -->
```

Rules for `docs/LLM_CONTEXT.md`:

- Keep this file as a current-state map of non-inferable context, not a changelog and not an architecture overview.
- Do not append one entry per skill run; git history, PRs, issues, session logs, and ai-memory are the historical record.
- Remove or rewrite obsolete context instead of preserving it for history.
- Keep durable decisions or gotchas only when they still constrain future implementation.
- Apply the admission filter before writing any line: discoverable by reading the code → it does not belong here. Repository overviews measurably do not help agents (arXiv:2602.11988).
- Point, never copy: reference README sections, files, and tests instead of duplicating their content. Duplicates drift.
- Keep the whole file under ~100 lines; if it grows past that, cut inferable content first.
- If a feature or bug fix changes business behavior, update `README.md` and the current-state sections of `docs/LLM_CONTEXT.md` in the same work.

## Workflow

1. Locate project entrypoints and docs without broad blind reads.
2. Build a rule inventory: actors/permissions, visible workflows, state transitions, calculations, limits, eligibility, validations, user-facing exceptions, and labeled sources that change outcomes: internal endpoints/events/jobs vs external APIs/operations.
3. Compare inventory with current `README.md` and `docs/LLM_CONTEXT.md` marker blocks.
4. Write the README business section as the canonical human explanation.
5. Write the technical guide from observed project commands and preserved README commands.
6. Create or write/update `docs/LLM_CONTEXT.md`, applying the admission filter to every line.
7. Validate required files, markers, section order, and current-state context.

## Quality bar

- Complete business rules are more important than exhaustive architecture prose.
- Concise does not mean shallow: include edge cases and exceptions that affect users.
- Do not create parallel terminology; reuse domain words already present in code, tests, UI, and docs.
- Do not add changelog-style noise to README or `docs/LLM_CONTEXT.md`; keep `docs/LLM_CONTEXT.md` focused on current implementation context and durable constraints.
- Do not ship placeholders like `TODO`, `TBD`, or generic boilerplate as if complete.
