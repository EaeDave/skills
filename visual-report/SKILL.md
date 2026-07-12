---
name: visual-report
description: Generates stakeholder-facing, self-contained HTML reports with diagrams for comparing business rules, mapping project context, and visualizing flows or timelines.
disable-model-invocation: true
---

# Visual Report

Produces a single `.html` file the user opens in a browser to *see* project
context: side-by-side comparisons, context maps, flows, timelines. The report
is **stakeholder-facing** — written for a reader who has never seen the
codebase and never will.

## Audience contract

The one rule everything else serves: **every term in the report must be
traceable** — either the user named it in the request, or it is a business
concept (rule, actor, capability, outcome, limit).

- Identifiers the user asked about (endpoints, parameters, feature names) are
  the *subject* of the report: include them, verbatim and exact.
- Everything else speaks business language. A rule is described by what it
  decides, not by where it lives.
- Research is unrestricted: read any code, file, or history needed to get the
  facts right. The contract binds the *output*, not the legwork.

## Workflow

1. **Scope.** Identify what the user wants to see and pick the branch below.
   Read that branch's template before building. Done when: branch chosen,
   template read, and every item the user asked about is listed.
2. **Legwork.** Dig through code, docs, and session context until each listed
   item has grounded facts — actual behavior, actual parameters, actual
   differences. Done when: no item rests on assumption.
3. **Build.** Start from `assets/base.html`, fill it following the branch
   template. Done when: the file opens standalone in a browser with every
   section populated and every diagram rendering.
4. **Audit.** Re-read the finished HTML top to bottom hunting untraceable
   terms: file paths, code identifiers (CamelCase / snake_case names), class
   and function names, person names, framework jargon. Each hit either traces
   to the user's request or gets rewritten in business terms. Done when: zero
   untraceable terms remain.
5. **Deliver.** Reply with the file path and a one-sentence summary — not the
   report content.

## Branches

| Branch | Use when the user wants | Template |
|---|---|---|
| Comparison | 2+ rules/endpoints/versions side by side, with diffs | [templates/comparison.md](templates/comparison.md) |
| Context map | An overview: business modules, capabilities, relations | [templates/context-map.md](templates/context-map.md) |
| Flow | A journey through one rule: steps, decisions, actors | [templates/flow.md](templates/flow.md) |
| Timeline | How something evolved over time | [templates/timeline.md](templates/timeline.md) |

Mixed request → one report, primary branch's template, borrowing sections
from the others.

## Output conventions

- One self-contained `.html` file in the project root:
  `report-<topic>-YYYY-MM-DD.html`, `<topic>` in kebab-case, no accents.
  Same-scope report already exists → update it in place.
- Diagrams use Mermaid, styling uses Tailwind — both via CDN, already wired
  in `assets/base.html`. Keep its head block intact; write content inside
  `<main>`. The file needs internet access when opened; if the user says the
  report must work offline, warn about this before building.
- Report language matches the user's; default to Português do Brasil when
  the user writes in Portuguese.
- Reports are presentation artifacts for humans, not agent context: never
  reference them from `AGENTS.md`, `CLAUDE.md`, or docs indexes, and never
  treat an old report as a source of truth about current behavior.
