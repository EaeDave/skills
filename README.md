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

### Documentation

- **[business-readme](./business-readme/SKILL.md)** — Identifies business rules from project context and maintains a concise `README.md` with human-readable business rules first, then technical run instructions. Also maintains `LLM_CONTEXT.md` for future agents.


## Repository Structure

```txt
skills/
  business-readme/
    SKILL.md
    scripts/
      validate-business-readme.js
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

After installing, run the skill from your agent when you want to create or refresh project documentation from actual project context.

The skill will:

1. ask which language the docs should use;
2. inspect relevant project sources;
3. update `README.md` with business rules before technical instructions;
4. update `LLM_CONTEXT.md` with implementation-facing context;
5. validate the generated documentation when the validator script is available.

Validator command:

```bash
node business-readme/scripts/validate-business-readme.js <project-root>
```

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
