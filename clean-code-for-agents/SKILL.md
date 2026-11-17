---
name: clean-code-for-agents
description: Apply a Clean Code discipline re-ranked for AI coding agents (the primary reader of code is now the agent, not a human) — vertical slices with tool-checked boundaries and testable modules, plus a targeted verification loop (tests as specification, not TDD ceremony) — and persist ONLY non-inferable project facts into AGENTS.md (the cross-tool standard, with a CLAUDE.md bridge), turning every enforceable rule into a check. Use this WHENEVER writing, implementing, refactoring, or reviewing code in a real project; when setting up or bootstrapping a new repo; when the user asks to "work in this pattern", mentions Clean Code, XP, TDD, vertical slices, feature folders, module boundaries, agent-friendly code, greppable names, small functions, or wants coding standards / agent rules installed. Trigger even if the user does not say "Clean Code". Do NOT use for one-off throwaway snippets where no project context exists.
---

# Clean Code for AI Agents

## Premise

In 2008 *Clean Code* optimized code for the next human reader. The primary
reader is now the **AI agent** that greps, reads in truncated ranges, edits,
and tests the code. Same principles, re-ranked; one inverts (comments), one is
demoted with a nuance (DRY), and structure moves to **vertical slices**: one
feature, one folder, one working set. Clean code buys the agent *cost and
navigation*, not correctness, and prose rules do not hold — so every rule a
tool can enforce becomes a check, and every line an agent re-reads each
session must earn its tokens.

## Evidence base

Calibrated against measured results (status: November 2026), not taste:

- **Context files**: they do not generally raise task success and add
  **+20% inference cost**; instructions ARE followed and pay off for
  **non-standard practices** (Gloaguen et al., arXiv:2602.11988). A
  two-agent ablation bounds the correctness effect to ≤10–15pp: agents fail
  on implementation skill, not on missing repo knowledge (Khatri,
  arXiv:2607.27250). With source readable, compact documentation does not
  beat the issue alone (Arman & Molybog, arXiv:2609.31587). Curated,
  non-redundant AGENTS.md still cuts runtime −28.6% (Lulla et al.,
  arXiv:2601.20404). Curation wins, redundancy costs.
- **Prose rules are not enforcement**: executable checks reach 88.3%
  constraint compliance vs 67.0% prompt-only and 50.3% with LLM
  self-reflection (ContextCov, arXiv:2603.00822). Layering violations kept
  landing in a production repo *after* its AGENTS.md stated the rule; naming
  the forbidden module paths in context made one model violate *more*
  (90%→62% compliance) (GYROCOMPASS, GroundLM 2026).
- **Cleanliness buys cost, not correctness**: on minimal-pair repos the pass
  rate does not move, but clean code uses 7–8% fewer tokens and 34% fewer
  file revisits (arXiv:2605.20049); code health correlates negatively with
  input tokens (arXiv:2608.18645).
- **Agents erode code**: structural erosion rises in 77% and verbosity in
  75.5% of iterative trajectories; agent code is 2.3× more verbose than
  human code, and quality guidance in the prompt lowers the starting level
  but not the degradation rate (SlopCodeBench, arXiv:2603.24755). Agents
  resolve up to 13.1% fewer tasks on top of agent-written code; the signal
  is changed input validation and error handling, not classic metrics
  (arXiv:2606.21804).
- **Locality**: agents resolve 65% on SWE-bench Verified but 21% on
  sustained multi-file evolution (SWE-EVO, arXiv:2512.18470); one-sided
  edits of cross-file contracts are a top drift family (GYROCOMPASS).
  *No controlled study yet compares vertical slices with layers for agents;
  the slice rule is inferred from this locality and working-set evidence.*
- **Contracts**: code-proximate specs (typed interfaces, OpenAPI) recover
  most of the capability gap for weaker models (arXiv:2608.21747).
- **Verification**: a prescribed test-first ritual raised regressions
  6.08% → **9.94%**; targeted test context cut them **−70%** (TDAD,
  arXiv:2603.17973). Human tests as spec: 94.3% vs 68% with self-generated
  ones (TDFlow, EACL 2026). Writing pre/post-conditions before generating
  tests: +9.8pp bug detection on Google production bugs (arXiv:2608.17177).
  Refactors tangled into a fix lower compilability with no correctness gain
  (arXiv:2605.22526).
- **Rules-file size**: practitioner consensus is ≤~100 lines with
  progressive disclosure; instruction-following degrades past ~150–200
  instructions (arXiv:2507.11538). Expert consensus, not a benchmark.
- **Unit size**: the binding limit is the *total context a task assembles*.
  Successful trajectories cluster at 20–30k tokens; by 64k the resolve rate
  falls to 0–7% even with perfect retrieval (arXiv:2602.16069); length alone
  costs 13.9–85% accuracy within the claimed window (Du et al., EMNLP 2025).
  Per-line defect density is **higher** in small modules (Koru et al., IEEE
  TSE 2009; Basili & Perricone 1984) and the 200-line "optimum" is a binning
  artifact (Jones, 2023). Only Java methods ≲24 SLOC have modern backing
  (Chowdhury et al., MSR 2022).

## The two jobs

1. **Behave** — write/edit code right now per the principles and the
   verification loop below.
2. **Persist** — keep a lean, marker-delimited rules block in `AGENTS.md`
   (cross-tool standard) with a minimal `CLAUDE.md` bridge, admitting ONLY
   non-inferable facts, and wire enforceable rules into checks. Idempotent.

Do both on any real project; if the user wants just one, do that one.

## The admission filter (what may be persisted)

> Can a tool enforce it? Make it a check (linter rule, architecture test,
> hook, CI step), not a line. Can the agent discover it by reading the code?
> Delete it.

Only four things belong in the rules block: **commands** (test/lint/
typecheck/build/boundary check), the **architecture rule** in one line,
**non-standard practices** (facts an agent gets wrong by assuming defaults),
and **known failure points**. Generic style rules, repository overviews, and
restated conventions are the measured +20%-cost noise. State a boundary as a
rule, never as a list of forbidden module paths. Keep the block ≤40 lines
and the whole rules file ≤~100 lines — if the project's file is already
bigger, flag it and move detail into `docs/*` referenced on demand.

## Re-ranked principles (apply while coding)

Ordered most-impactful first.

1. **Vertical slices with tool-checked boundaries — the default.** Organize
   by feature, not by technical layer: one folder per feature
   (`features/<feature>/`) holding its entry point (route, command, UI),
   domain logic, data access, and tests. A task then loads one folder, and a
   cross-file contract lives inside one slice instead of across layers.
   - A slice exposes one public entry (`index`, `mod`, package API); other
     slices import only that, never its internals.
   - Shared code lives in a small domain kernel / platform module that never
     imports from a slice. Share there only logic that must change together
     across features; otherwise keep it in the slice.
   - Enforce the boundary with the ecosystem's tool (import-linter,
     ArchUnit, eslint-plugin-boundaries / dependency-cruiser, Nx module
     boundaries, Go `internal/`, Rust visibility), run in CI. A boundary
     written only in AGENTS.md will be crossed.
   - **Exception — strongly opinionated frameworks.** When the framework
     dictates the layout (Rails, Laravel, Django, Phoenix, Angular, …),
     follow its conventions; the agent anticipates those paths for free.
     Group by feature only where the framework itself offers a unit for it
     (Django apps, Rails engines/namespaces, Phoenix contexts).
   - **Existing layered repo:** never restructure it wholesale. New features
     go in a slice; migrate an old feature only when you are working in it,
     one slice per refactor-only commit.
2. **Testable modules.** Each slice is tested through its public entry, with
   tests next to the code. External I/O (DB, HTTP, clock, queue) enters at
   the slice edge by dependency injection, so a test swaps in a named fake
   without monkey-patching; config lives behind named constants/env vars.
3. **Right-sized units — measured by context, never by a line quota.**
   Files have **no line budget**. Split a file when it has two reasons to
   change, not when it crosses a number; splitting on arbitrary boundaries
   measurably hurts (3.57–5.64pp EM, never Pareto-optimal, arXiv:2605.04763)
   and every extra fragment is another hop. Functions: one whole idea,
   ~≤25 SLOC as a soft signal — a longer straight-line function beats an
   indirection the agent has to chase. **Never refactor solely to hit a line
   count.** The real test: *can the agent finish a task by grepping a symbol
   and reading one region?* Yes → fine at any length. No → the defect is
   cohesion or naming. Budget the working set (~20–30k tokens), not the file.
4. **Single Responsibility.** One reason to change; lets the agent isolate,
   test, and edit without side effects.
5. **Meaningful, unique, greppable names.** Grep is the navigation API. If a
   name returns 50 irrelevant hits, it is a bad name. Avoid `data`,
   `handler`, `Manager`, `Service`.
6. **Comments carry context and provenance** *(inverts)*. The agent has
   perfect syntax fluency but no idea WHY — the prod bug, the upstream issue,
   the business constraint. Docstrings with intent + a usage example. **Never
   strip comments on refactor — including the agent's own.**
7. **Explicit types and contracts at slice boundaries.** Free ground truth
   instead of inferring from usage; typed interfaces / schemas at a slice's
   public entry are the specification other slices and tests code against.
8. **Locality over reflexive DRY — but reuse before adding** *(revised)*.
   Tolerate small duplication when extracting it would add an indirection
   layer or couple two slices. But before writing a helper, component, or
   dependency, search for an existing one: agents add where they should
   reuse, and verbosity compounds across turns.
9. **Never loosen validation or error handling as a side effect.** Changed
   input validation and error paths are what makes agent code hard to build
   on. If a change must relax one, say so in the commit and cover it with a
   test.
10. **Errors with context.** Include the offending value and expected shape —
    the message is the agent's debug signal.
11. **Tests runnable headless, one command, parseable output.** Prefer JSON
    reporters. See the verification loop.
12. **Shallow nesting.** Guard clauses, early returns; aim ≤2 levels.
13. **Limits are checks, not suggestions.** Formatter, linter, nesting caps,
    boundary check, and a complexity/duplication ratchet (fail when a touched
    file gets worse, not on an absolute number) run in CI. Prompted quality
    fades over iterations; a gate does not. A repo MAY add a file-size cap —
    as a *review trigger* for a cohesion check, never a mandate to split.

## The verification loop (replaces the XP ritual)

Prescribing red-green ceremony measurably hurts; targeted verification
measurably helps. Work like this:

1. Before editing, find the tests that cover what you touch (grep the
   symbol's usages and test files). Run them for a baseline.
2. Make the change small — one behavior per commit. **Refactors go in their
   own commit**, never tangled into a fix or feature.
3. Re-run the targeted tests, then the relevant suite and the boundary
   check. Never done on red.
4. **Existing human-written tests are the specification.** Never weaken,
   skip, or delete one to make a patch pass.
5. New tests: first state the contract — pre-conditions, post-conditions,
   invalid inputs — then write tests against it. A generated test only
   becomes a safety net after confirming it fails on the unfixed code.
6. Bug fix → regression test. Commit message records the *why*.

## Project scaffolding (set up once)

- Slice layout (`features/<feature>/` or the framework's convention) and a
  boundary check wired into CI.
- `AGENTS.md` as a lean index; details live in `docs/*`, loaded on demand.
- Machine-readable tool output: linter/test JSON flags where available.
- Nesting caps and a complexity/duplication ratchet enforced by CI; any size
  cap wired as a warning that prompts a cohesion review, not a failure.
- Docs in-repo and versioned — agents cannot see wikis or Google Docs.
- Idempotent setup script (`bin/setup`) taking a clean machine to working.
- Structured JSON logs for services; plain text only for user-facing CLI.

## Workflow when this skill triggers

### Step 1 — Read the project before changing anything
Detect language, framework, conventions, and the real values for the
template: test / lint / typecheck / build commands, the formatter, the
architecture (slices, an opinionated framework's layout, or legacy layers)
and any boundary tool already present, non-standard practices, failure
points. **Never invent a command.** No headless test command? That is the
first thing to fix — flag it.

### Step 2 — Apply the discipline to the work at hand
Follow the principles and the verification loop. New feature → new slice
(or the framework's place for it). Prefer small test-backed steps over a big
rewrite.

### Step 3 — Install / update the rules block and checks (persistence)
1. Pick the canonical file: `AGENTS.md` exists → write there; only
   `CLAUDE.md` exists → respect it and offer (don't force) migration;
   neither → create `AGENTS.md`.
2. Read `assets/agent-rules.md` (sibling to this file) — the canonical block,
   delimited by `<!-- clean-code-agents:start/end -->` markers.
3. Fill placeholders with real values from Step 1; delete sections that
   genuinely don't apply. Never leave an unfilled placeholder.
4. Insert idempotently: replace between markers if present, else append.
5. **Bridge for Claude Code**: a minimal `CLAUDE.md` containing `@AGENTS.md`
   (preferred over a symlink — Windows-safe). If `CLAUDE.md` has unrelated
   content, append the import line instead of overwriting.
6. Run the admission filter over the result: anything a tool can enforce
   becomes a check (propose it if the user hasn't asked for CI changes);
   anything inferable from the code gets cut. Whole file ≤~100 lines or
   flag it.

### Step 4 — Summarize
What changed and that its tests pass; where the block landed and whether a
bridge was added; which rules became checks; any TODO placeholder
(especially a missing test or boundary command); anything the admission
filter removed and why.

## Principles

- **The agent is the reader.** Optimize for grep, truncated reads, and
  one-folder working sets.
- **Checks over prose.** A rule a tool can enforce is a check; prose is for
  what no tool can see.
- **Every persisted line must earn its tokens.** Redundant context is a
  measured cost, not a style preference.
- **Context beats ceremony.** Tell the agent which tests to run, not which
  ritual to perform.
- **Idempotent.** Re-running the skill improves code and rules without
  duplicating anything.
- **Adapt, don't dogmatize.** No number here is a target, and an
  opinionated framework's layout beats the slice default. Cohesion,
  greppability, and the size of the working set decide. Tune per
  language/team and say what you changed.
