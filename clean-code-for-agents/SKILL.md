---
name: clean-code-for-agents
description: Apply a re-ranked Clean Code discipline tuned for AI coding agents (the primary reader of code is now the agent, not a human) together with an Extreme Programming / TDD loop, and persist those rules into the project's AGENTS.md (the cross-tool standard, with a CLAUDE.md bridge so Claude Code reads it too) so they survive across sessions and tools. Use this WHENEVER writing, implementing, refactoring, or reviewing code in a real project; when setting up or bootstrapping a new repo; when the user asks to "work in this pattern", mentions Clean Code, XP, TDD, agent-friendly code, greppable names, small functions, or wants coding standards / agent rules installed. Trigger even if the user does not say "Clean Code" — any request to make a codebase agent-friendly, enforce a coding standard, or set up a CLAUDE.md/AGENTS.md rules file qualifies. Do NOT use for one-off throwaway snippets where no project context exists.
---

# Clean Code for AI Agents (+ XP loop)

## Premise

In 2008 *Clean Code* optimized code for the next human to read it. The primary
reader is now the **AI agent** that reads, greps, edits, and tests the code. The
agent has different constraints than a human, so the same principles get
**re-ranked**, a few invert, and some new ones appear. This skill makes the
agent write code that way AND installs the rules where they persist.

The single most important fact to internalize: **no LLM does these things by
default.** Asked to "implement feature X", a model produces middling code —
80-line functions, no DI, duplicated logic, weak or wrong tests. The discipline
only happens when the rules are written down and re-read every iteration. That
is why this skill has two jobs, not one.

## The two jobs

1. **Behave** — write/edit code right now according to the re-ranked principles
   and the XP loop below.
2. **Persist** — make sure the project carries the rules in `AGENTS.md` (the
   cross-tool standard, with a minimal `CLAUDE.md` that imports it so Claude Code
   reads it too), idempotent and marker-delimited, so the discipline survives the
   next session and works across tools (Claude Code, Cursor, Codex, Copilot).

Do both whenever you touch a real project. If the user only wants one (e.g.
"just set up the rules file" or "just write this the right way"), do that one.

## Why agents need this (the constraints)

These are *why* the ranking is what it is — keep them in mind, don't recite them.

- **File reads are truncated.** Agent CLIs read code in small ranges (Claude
  Code ~2000 lines at a time). A small file fits in one read; a giant file gets
  paginated into a fragmented mental model.
- **Attention degrades before the context limit.** Stuffing the window lowers
  detail accuracy, and your code shares that window with the system prompt,
  CLAUDE.md, conversation history, tool output, and test logs.
- **Grep is cheaper than read.** The agent prefers `rg "name"` to loading a
  file. Unique, distinctive names make that targeted; generic names return 50
  matches and force reading each. Greppable names are the navigation API.
- **Tool calls cost tokens and latency.** Short files, small test output, and
  lean logs keep the agent fast and the API bill low.

## The re-ranked principles (apply while coding)

Ordered most-impactful first. Lower items still matter; the top ones just
matter *much* more now.

1. **Small functions and files.** Functions 4-20 lines; files under 500,
   ideally 200-300. A unit that fits one tool call gets reasoned about with full
   attention. This is the single highest-leverage rule.
2. **Single Responsibility (SRP).** One reason to change. Lets the agent isolate
   a unit, test it focused, and edit it without fear of side effects. Three
   250-line classes beat one 800-line class doing three things.
3. **Meaningful, unique, greppable names.** "Searchable" is now the top property.
   Heuristic: if grepping the name returns lots of irrelevant hits, the name is
   bad for the agent; if it returns only what matters, it's right. Avoid `data`,
   `handler`, `Manager`, `Service`.
4. **Comments carry context and provenance** *(this one inverts)*. The agent has
   perfect syntax fluency but does not know *why* you chose this approach, which
   prod bug motivated this logic, which upstream issue forces this workaround.
   That "why" is provenance and the comment is the most accessible place for it
   during a tool call. Docstrings with intent + a usage example are a strong
   signal. **Never strip comments on refactor — including the agent's own.** A
   model writes a comment because it judged that info worth preserving for the
   next edit; deleting it removes context the agent will want next time.
5. **Explicit types.** Type hints / TypeScript / RBS give the agent a free
   ground truth instead of forcing type inference from usage (slow, error-prone).
   Migrating an untyped codebase often beats any logic refactor for agent
   productivity.
6. **DRY.** Duplication is worse for agents: when a replicated thing changes, the
   agent may update one copy and miss the others — its attention has no gravity
   pulling it to the other copies. Factoring out is refactor *safety*, not style.
7. **Tests the agent can run headless.** F.I.R.S.T still holds, plus: one command,
   no human setup, parseable output. The write→test→read→adjust→commit loop is
   the foundation. TDD is now a technical requirement, not a philosophy — without
   tests the agent ships plausible code that silently breaks yesterday's working
   behavior. (See the XP loop section.)
8. **Predictable directory structure.** Strong framework conventions let the
   agent anticipate paths without `find`. Idiosyncratic flat layouts waste tokens.
9. **Dependency Injection / testability.** Injected deps let the agent swap a
   real collaborator for a named fake in tests without monkey-patching servers.
   Centralized config turns a provider swap into a one-line change instead of a
   24-file hunt.
10. **Avoid deep nesting.** Each indentation level is state the model must track.
    Guard clauses, early returns, pattern matching, flattened logic. Aim for ≤2
    levels.
11. **Errors with context.** `raise ValueError("invalid input")` is useless in a
    stack trace; include the offending value and the expected shape. The agent
    uses the message as a debug signal.
12. **Formatting: don't bikeshed.** Use the language default formatter, wire it
    into pre-commit / format-on-save, move on. Style debates are noise.
13. **No obvious comments.** `// increment i` above `i++` wasted human patience
    in 2008; in 2026 it wastes real tokens. Still the worst kind of comment.

## What Uncle Bob couldn't foresee (set these up too)

- **Agent meta-docs.** `AGENTS.md` is the cross-tool standard (read by Codex,
  Cursor, Windsurf, and others); Claude Code reads `CLAUDE.md`, so a one-line
  `@AGENTS.md` import keeps a single source of truth. Also `.cursor/rules`,
  `.github/copilot-instructions.md` where a tool needs its own. Short, imperative,
  action-oriented bullets of what the agent must know — not prose. The agent reads
  them before tool calls (Claude Code re-reads CLAUDE.md every query), so density
  matters.
- **README with high-level architecture.** A simple ASCII or Mermaid diagram of
  the project shape shortcuts the agent's ramp-up.
- **Structured logging.** JSON with named fields is trivially parseable;
  free-text `printf` forces heuristic parsing.
- **Accessible observability commands.** Predictable `make test`, `pnpm test`,
  `cargo check`, `mypy` that the agent can invoke to validate changes.
- **Idempotent setup scripts.** `bin/setup` / `scripts/bootstrap.sh` that take a
  clean machine to a working state. If onboarding lives in a human's head, the
  agent is locked out.

## The XP loop (how to actually work)

This is the working rhythm, not a phase:

1. Make the change small — one behavior per commit.
2. Write or update the test for that behavior first (or alongside).
3. Implement the minimum to satisfy it.
4. Run tests **headless, one command**. Read the output.
5. Adjust and re-run until green. Never declare done with red tests.
6. Commit small with a message that records the *why*. Bug fix → regression test.
7. Keep CI tight and coverage high on business logic. A red build stops the line.

The payoff is a virtuous loop: the agent writes a test, the test validates the
code it wrote, and that test becomes the safety net for the next change. Cowboy
mode without tests isn't faster — the agent guesses, and guesses must be
hand-reviewed, which kills the speed the agent was supposed to bring.

## Workflow when this skill triggers

### Step 1 — Read the project before changing anything
Detect language, framework, and conventions. Find the real values that the rules
template needs as placeholders:
- **Test command** (`package.json` scripts, `Makefile`, `pyproject.toml`,
  `Cargo.toml`, `mix.exs`, etc.). If there is no headless test command, that is
  the first thing to fix — flag it.
- **Lint / typecheck / build commands.**
- **Formatter** already in use (or the language default if none).
- **Failure points** that may need defensive code (external APIs, payment, DB,
  queues, third-party rate limits).
Never invent a command. If you can't find one, ask or leave a clearly-marked TODO.

### Step 2 — Apply the discipline to the work at hand
Write or refactor the code following the re-ranked principles and the XP loop.
When editing existing code, prefer small, test-backed steps over a big rewrite.
If the task is itself "write feature X", run the loop: test → implement → run →
adjust → commit.

### Step 3 — Install / update the rules block (persistence)
The rules live in the repo's agent instruction file, not in the README.

**Target: AGENTS.md as the single source of truth.** AGENTS.md is the
tool-agnostic standard (Codex, Cursor, Windsurf, OpenCode, Continue, etc. read
it natively). Claude Code, however, reads CLAUDE.md and does NOT auto-load
AGENTS.md (an open feature request as of mid-2026, no native fallback). So to
serve *every* agent including Claude Code, keep one canonical file and bridge.

1. Pick the canonical file and ensure the bridge, by what already exists:
   - **AGENTS.md exists** → write the block to `AGENTS.md`. Ensure a bridge so
     Claude Code reads it too (see step 5).
   - **Only CLAUDE.md exists** → respect the existing setup: write the block to
     `CLAUDE.md`. Mention that migrating to AGENTS.md (canonical) + a CLAUDE.md
     bridge would make it cross-tool, and offer to do it — don't force it.
   - **Neither exists** → create `AGENTS.md` at the repo root with the block
     (the source of truth), then create the bridge (step 5).
   - Also respect any tool-specific file the project already uses
     (`.cursor/rules`, `.github/copilot-instructions.md`) — AGENTS.md covers
     those tools, so usually no extra file is needed.
2. Read `assets/agent-rules.md` (sibling to this file) — it is the canonical
   block, delimited by `<!-- clean-code-agents:start -->` /
   `<!-- clean-code-agents:end -->` markers for idempotency.
3. Fill the placeholders with the real values from Step 1:
   `<TEST_COMMAND>`, `<LINT_COMMAND>`, `<TYPECHECK_COMMAND>`, `<BUILD_COMMAND>`,
   `<FAILURE_POINTS>`. Drop a line only if it genuinely doesn't apply; don't
   leave a placeholder unfilled.
4. Insert idempotently: if the markers already exist in the target file, replace
   everything between them; if not, append the block. Never duplicate it.
5. **Bridge for Claude Code.** When the canonical file is AGENTS.md, make sure
   Claude Code picks it up without duplicating content:
   - Preferred: a minimal `CLAUDE.md` whose entire content imports AGENTS.md:
     `@AGENTS.md` (Claude Code's import syntax). Don't paste the rules into it.
   - Alternative (single inode, both names read the same file): a symlink —
     `ln -s AGENTS.md CLAUDE.md`. Note the Windows caveat (symlinks may need
     developer mode / may land as plain text on clone); prefer the `@AGENTS.md`
     import for portability.
   - If CLAUDE.md already has real, unrelated content, append the `@AGENTS.md`
     import line rather than overwriting it.
6. Adapt thresholds to the language/team where the defaults don't fit (the
   numbers are a strong default, not dogma — say so if you change them).

### Step 4 — Summarize
Briefly state: what code changed and that its tests pass; whether the rules block
was created or updated and in which file (AGENTS.md), and whether a CLAUDE.md
bridge was added; any placeholder left as a TODO (especially a missing headless
test command); thresholds you adapted and why.

## Principles

- **The agent is the reader.** Every choice optimizes for grep, truncated reads,
  full-attention units, and parseable output.
- **Opinion became measurement.** "Files should be ~N lines" used to be taste;
  now it's measurable cost — tokens, tool-call latency, output quality.
- **Rules must be re-read, not remembered.** The agent forgets between sessions;
  the AGENTS.md block (bridged to CLAUDE.md) is what makes the discipline stick.
  Persisting it is half the job.
- **Tests are the safety net, TDD is a habit.** Especially post-deploy, where
  every fix is a chance to break something that worked yesterday.
- **Idempotent.** Running this skill again should improve the code and the rules
  block without duplicating anything.
- **Adapt, don't dogmatize.** The template is a starting point; tune it to the
  project and say what you changed. Clean code here isn't fashion — it's
  infrastructure that lowers the bill and the hallucination rate.
