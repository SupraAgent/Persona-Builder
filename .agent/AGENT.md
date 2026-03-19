# Agent Skills Directory

This `.agent/` directory is where locally-installed skills live. AI coding agents (Claude Code, Codex, etc.) automatically scan `.agent/skills/` for SKILL.md files and make them available during sessions.

## Install skills

```bash
# Install all Persona Builder skills into this project
asm install github:SupraAgent/Persona-Builder --all --scope project

# Install a single skill
asm install github:SupraAgent/Persona-Builder --path skills/write-a-persona --scope project
```

## How agents discover skills

Agents look for `SKILL.md` files inside `.agent/skills/*/`. Each skill's YAML frontmatter provides:
- `name` — human-readable skill name
- `description` — when to use this skill
- `dependencies` — which skills must run first
- `outputs` — files or artifacts the skill produces
- `license` and `metadata.version` — for updates and compliance

The markdown body contains the full executable instructions, including `[ASK]`/`[AGENT]` markers and `>>> GATE` checkpoints.

## Manual install (no ASM)

If you don't have ASM, copy skills directly:

```bash
cp -r skills/* .agent/skills/
```
