---
name: work-report
description: Generates concise human-readable Markdown work reports as root-level .md files from the current session, code changes, and relevant Git commits, with business rules first and light technical detail. Use when the user asks for a Jira, Linear, card, ticket, delivery, implementation, feature, bug-fix, or work-summary report.
---

# Work Report

## Quick start

1. Use the current conversation as the primary scope.
2. Inspect Git directly when needed: `git status --short --branch`, `git log --oneline --decorate --max-count=12`, `git diff --stat`, `git diff --cached --stat`.
3. Inspect only the files, diffs, commits, tests, and docs needed to understand the delivered behavior.
4. If any commit may or may not belong to the current card, ask before including it.
5. Create a concise `.md` report in the project root and reply with the file path.

## Default scope

- Prioritize the current session, current diff, staged changes, and commits clearly tied to the session.
- Include branch commits when they explain the same feature or bug fix.
- Do not include unrelated refactors, chores, experiments, or old branch work unless the user confirms.
- If the user names a card, ticket, branch, PR, commit range, or file list, use that as the scope.

## Output file

- Always write the report to a `.md` file in the project root; do not only paste rendered Markdown in chat.
- Use a meaningful filesystem-safe name: `<CARD-ID>-work-report.md` when a card/ticket exists, otherwise `work-report-YYYY-MM-DD-<short-topic>.md`.
- Build `<short-topic>` from the feature or bug in kebab-case, without accents, spaces, or punctuation.
- If the same-scope report already exists, update it. If the name collides with a different report, add `-2`, `-3`, etc.
- Final chat response should include the file path and one-sentence summary, not the full report unless asked.

## Report shape

Use this structure unless the user asks otherwise:

```md
# Relatório de entrega — [card or topic]

**Contexto:** [Problem, feature, bug fix, or motivation in plain language.]

**Destaque:** [Most important business outcome delivered.]

## O que foi feito
- [Business-facing behavior delivered.]
- [Important rule, state, validation, exception, or outcome.]
- [Light technical detail only when useful to explain impact.]

## Regras de negócio impactadas
- [Rule in human terms, including limits and exceptions.]

## Commits relacionados
- `abc1234` — [commit subject]: [what it contributed]

## Validação
- [Tests, build, manual check, or observed verification.]

## Observações
- [Only unresolved ambiguity, risk, follow-up, or deployment note. Omit if empty.]
```

## Writing style

- Match the user's language; default to Português do Brasil when the user writes in Portuguese.
- Keep the default report around 300-600 words.
- Use copyable raw Markdown syntax in the file: `#`, `##`, `**bold**`, lists, and backticked commands/commits.
- Sound like a human teammate, not a changelog generator.
- Prefer simple business language over framework or architecture terms.
- Mention technical files, services, migrations, or commands only when they help explain the result.
- Be precise about what was verified. Never claim tests or behavior that were not observed.

## Commit policy

- Include short hashes and subjects for commits that directly support the reported work.
- For each included commit, explain the business or delivery contribution in one clause.
- If a commit is ambiguous, ask: "O commit `<hash>` — `<subject>` faz parte deste card? Devo incluir?"
- If the user says no, omit it silently from the report.
- If no commits exist yet, say the work is uncommitted instead of inventing a commit list.

## Workflow

1. Collect session facts: user request, decisions, completed changes, validations, and unresolved points.
2. Collect Git facts with targeted Git commands when needed.
3. Inspect relevant diffs/files to translate implementation into user-visible behavior and business rules.
4. Ask only about ambiguous scope, especially commits that may belong to another card.
5. Create or update the Markdown report file in the project root.
6. Reply with the file path and a short summary.
