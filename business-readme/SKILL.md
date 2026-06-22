---
name: business-readme
description: Identifies business rules from project context and maintains a concise README with human-readable business rules first, then technical run instructions, plus `Docs/LLM_CONTEXT.md` for future agents. Use when the user asks to update a README from project context, extract business rules, document product behavior, maintain LLM project context, or when a feature/debug fix changes business rules.
---

# Business README

## Quick start

1. Ask the output language before writing docs: `1. Português do Brasil`, `2. English`, or custom typed language. If the user already answered in this conversation, use that.
2. Inspect the project context: README, docs, tests, routes/controllers/use-cases/domain models, schemas/migrations/seeds, config, examples, integration clients, real endpoints/operation names, and recent task context relevant to business behavior.
3. Update `README.md` so business rules come first in human language, then technical execution instructions.
4. Create or update `Docs/LLM_CONTEXT.md` with implementation-facing context, source map, real endpoints/operations, uncertainties, and history. If the root-level `Docs/` directory does not exist, create it first.
5. Run the validator script if available: `node <skill>/scripts/validate-business-readme.cjs <project-root>`.

## Source-of-truth policy

- Code and tests beat old docs when they disagree.
- Existing README text is evidence, not authority, unless the user says it is the contract.
- When code/tests/docs conflict, document observed behavior and record the conflict in `Docs/LLM_CONTEXT.md`.
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

## `Docs/LLM_CONTEXT.md` structure

Create or update this file inside a root-level `Docs/` directory. If `Docs/` does not exist, create it before writing the file; if it already exists, place `LLM_CONTEXT.md` inside it. Do not write a root-level `LLM_CONTEXT.md`.

```md
<!-- business-readme:context:start -->
# LLM Context

## Current business rule map
[Short index of rules, where they are implemented/tested, and their labeled real sources: internal endpoints/events/jobs vs external APIs/operations.]

## Technical map for future LLMs
[Entrypoints, important directories, commands, data model, integrations, external operation names, internal route names, gotchas.]

## Conflicts and unknowns
[Only unresolved ambiguity or divergence between code/tests/docs.]

## History
- YYYY-MM-DD: [What changed, why, and sources inspected.]
<!-- business-readme:context:end -->
```

Rules for history:

- Append one history entry per skill run that changes or validates business rules.
- Never delete previous history entries unless the user explicitly asks.
- Each entry should name the main sources inspected and the rule changes made.
- If a feature or bug fix changes business behavior, update `README.md` and `Docs/LLM_CONTEXT.md` in the same work.

## Workflow

1. Locate project entrypoints and docs without broad blind reads.
2. Build a rule inventory: actors/permissions, visible workflows, state transitions, calculations, limits, eligibility, validations, user-facing exceptions, and labeled sources that change outcomes: internal endpoints/events/jobs vs external APIs/operations.
3. Compare inventory with current `README.md` and `Docs/LLM_CONTEXT.md` marker blocks.
4. Write the README business section as the canonical human explanation.
5. Write the technical guide from observed project commands and preserved README commands.
6. Create or write/update `Docs/LLM_CONTEXT.md` for future implementation/debugging context.
7. Validate required files, markers, section order, and history.

## Quality bar

- Complete business rules are more important than exhaustive architecture prose.
- Concise does not mean shallow: include edge cases and exceptions that affect users.
- Do not create parallel terminology; reuse domain words already present in code, tests, UI, and docs.
- Do not add changelog-style noise to README. Keep run history in `Docs/LLM_CONTEXT.md`.
- Do not ship placeholders like `TODO`, `TBD`, or generic boilerplate as if complete.
