#!/usr/bin/env bash
# Install all Persona Builder skills into .agent/skills/ for local agent discovery.
# Usage: ./install-skills.sh [target-dir]
#   target-dir defaults to .agent/skills in the current directory.

set -euo pipefail

TARGET="${1:-.agent/skills}"
SOURCE="$(cd "$(dirname "$0")" && pwd)/skills"

if [ ! -d "$SOURCE" ]; then
  echo "Error: skills/ directory not found at $SOURCE" >&2
  exit 1
fi

mkdir -p "$TARGET"

for skill_dir in "$SOURCE"/*/; do
  skill_name="$(basename "$skill_dir")"
  dest="$TARGET/$skill_name"

  if [ -d "$dest" ]; then
    echo "  update  $skill_name"
    rm -rf "$dest"
  else
    echo "  install $skill_name"
  fi

  cp -r "$skill_dir" "$dest"
done

echo ""
echo "Installed $(ls -1d "$TARGET"/*/ 2>/dev/null | wc -l) skills into $TARGET"
echo "Agents will auto-discover SKILL.md files in this directory."
