<!-- clean-code-agents:start -->
## Coding standard (read before writing or editing code)

You are the primary reader of this code. Optimize for how an agent reads,
greps, edits, and tests it — not just for a human skimming an editor.

### Workflow (XP loop — this is the heartbeat, not optional)
- Work in small steps. One behavior change per commit.
- Write or update a test for the behavior, then implement, then run the test.
  Read the output, adjust, run again. Do not declare work done before the
  relevant tests pass.
- Every new function gets a test. Every bug fix gets a regression test.
- Tests run headless with a single command: `<TEST_COMMAND>`.
  No manual DB seeding, no missing config, no secret credential required.
- Keep CI green. Treat a red test as a stop-the-line event.
- Do not trust plausible-looking code. The test suite is the safety net for
  your next change as much as this one.

### Code style
- Functions: 4-20 lines. Split if longer.
- Files: under 500 lines, ideally 200-300. Split by responsibility.
- One thing per function, one responsibility per module (SRP).
- Names: specific and unique. Avoid `data`, `process`, `handler`, `Manager`,
  `Service`. Prefer names that return under ~5 grep hits in the codebase —
  grep is your primary navigation API, so greppable names are load-bearing.
- Types: explicit. No untyped public functions, no `any`, no bare `Dict`.
  Explicit signatures save you from inferring types from usage.
- No duplication (DRY). Extract shared logic into a function/module — a forked
  copy is a copy you will forget to update on the next refactor.
- Early returns and guard clauses over nesting. Max ~2 levels of indentation.
- Exception messages must include the offending value and the expected shape,
  e.g. `f"invalid input: received {x!r}, expected non-empty digit string"`.

### Comments
- Write WHY, not WHAT. Skip `// increment counter` above `i++`.
- Capture provenance: the bug that motivated odd logic, the upstream issue
  (`#1234`), the business constraint, the commit/PR that introduced a decision.
  This is the context that only lives in a human's head or a comment.
- Docstrings on public functions: intent + one usage example.
- Do NOT strip comments on refactor — including ones you wrote yourself. They
  carry intent and provenance you will want on the next edit. The only comment
  worth deleting is the redundant-obvious kind.

### Dependencies & structure
- Inject dependencies via constructor/parameter, not global import. It lets you
  swap a real `EmailSender` for a `FakeEmailSender` in tests without monkey-patching.
- Centralize config (model names, endpoints, limits) behind named constants /
  env vars. Hardcoded values scattered across files become a multi-file refactor.
- Follow the framework's convention (Rails, Django, Next.js, Laravel, etc.) so
  paths are predictable and you can anticipate them without listing directories.

### Formatting
- Use the language default formatter (`cargo fmt`, `gofmt`, `prettier`, `black`
  / `ruff`, `rubocop -A`). Do not discuss style beyond that. The formatter
  decides; you accept.

### Logging & observability
- Structured JSON (named fields) when logging for debugging/observability.
  Plain text only for user-facing CLI output.
- Keep validation commands one-shot and discoverable: `<TEST_COMMAND>`,
  `<LINT_COMMAND>`, `<TYPECHECK_COMMAND>`, `<BUILD_COMMAND>`.

### Defensive programming (apply when the project needs it)
- Implement retry-with-backoff, timeouts, circuit breakers, rate limiting, and
  graceful degradation for these failure points: `<FAILURE_POINTS>`.
  Do not invent defensive code where it is not needed, but do cover the points
  listed here without waiting to be told each time.
<!-- clean-code-agents:end -->
