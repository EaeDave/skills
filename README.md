# Personal Agent Skills

[![skills.sh](https://skills.sh/b/EaeDave/skills)](https://skills.sh/EaeDave/skills)

Agent skills for documenting and maintaining software projects with business context first.

These skills are designed to be small, practical, and easy to adapt. They encode repeatable workflows for agents so project knowledge stays readable for humans and useful for future LLM sessions.

## Quickstart

Install from GitHub with the skills installer:

```bash
npx skills@latest add EaeDave/skills
```

Or with Bun:

```bash
bunx skills@latest add EaeDave/skills
```

Pick the skills you want to install and the coding agents you want to use them with.

For local development, from this repository:

```bash
bunx skills@latest add .
```

## Why These Skills Exist

Most project documentation starts with commands, frameworks, and setup details. Those are useful, but they are not the hardest thing for humans or agents to recover later.

The hard part is usually the business behavior:

- what the system does for users;
- which rules drive decisions;
- which states, validations, and exceptions matter;
- where the implementation proves those rules;
- what future agents need to know before changing behavior.

These skills keep that context close to the code, explicit, and maintainable.

## Current Skills

### Coding standards

- **[clean-code-for-agents](./clean-code-for-agents/SKILL.md)** — Applies a Clean Code discipline tuned for AI agents, follows an XP/TDD loop, and installs persistent `AGENTS.md` / `CLAUDE.md` rules from a marker-delimited template.

### Documentation

- **[business-readme](./business-readme/SKILL.md)** — Identifies business rules from project context and maintains a concise `README.md` with human-readable rules first, including labeled internal endpoints and external APIs/operations when relevant. Also maintains `docs/LLM_CONTEXT.md` for future agents. User-invoked only.
- **[work-report](./work-report/SKILL.md)** — Generates concise Markdown work reports for Jira, Linear, or similar cards from the current session, relevant code changes, and related commits.
- **[visual-report](./visual-report/SKILL.md)** — Generates stakeholder-facing, self-contained HTML reports with Mermaid diagrams for comparing business rules, mapping project context, and visualizing flows or timelines. User-invoked only.

## Repository Structure

```txt
skills/
  business-readme/
    SKILL.md
    scripts/
      validate-business-readme.cjs
  clean-code-for-agents/
    SKILL.md
    assets/
      agent-rules.md
    clean-code-for-agents.skill
  work-report/
    SKILL.md
  visual-report/
    SKILL.md
    assets/
      base.html
    templates/
      comparison.md
      context-map.md
      flow.md
      timeline.md
```

Each skill lives in its own directory and includes a `SKILL.md` file with frontmatter:

```md
---
name: skill-name
description: Use when...
---

Skill instructions here.
```

## Using `business-readme`

After installing, invoke the skill explicitly (e.g. `/business-readme`) when you want to create or refresh project documentation from actual project context. The agent will not trigger it on its own.

The skill will:

1. ask which language the docs should use;
2. inspect relevant project sources;
3. update `README.md` with business rules before technical instructions;
4. create or update `docs/LLM_CONTEXT.md` with current implementation context, labeled internal/external endpoints and operations, uncertainties, and durable gotchas;
5. validate the generated documentation when the validator script is available.

Validator command:

```bash
node business-readme/scripts/validate-business-readme.cjs <project-root>
```

## Using `work-report`

After installing, run the skill when you need a concise Markdown delivery report file for a card or ticket.

The skill will:

1. use the current conversation as the primary scope;
2. collect Git context from status, diffs, branch commits, and recent commits;
3. ask before including ambiguous commits;
4. create a natural root-level Markdown report file with context, completed work, business rules, related commits, validation, and observations.

## Development

Add new skills by creating another directory with a `SKILL.md` file:

```txt
new-skill-name/
  SKILL.md
```

Then test the repository locally:

```bash
bunx skills@latest add .
```

## Safety

Review every skill before installing or running it. Agent skills execute with the permissions of the agent using them, so instructions should stay explicit, auditable, and scoped to the intended workflow.
