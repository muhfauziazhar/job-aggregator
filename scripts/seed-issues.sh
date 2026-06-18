#!/usr/bin/env bash
# Idempotent seeder for issues from user stories.
# EDIT the create_issue calls below per project.
# Usage: REPO=owner/repo bash scripts/seed-issues.sh
set -euo pipefail

REPO="${REPO:?REPO env var required}"

# Map milestones by title -> number
declare -A MS
while IFS=$'\t' read -r num title; do
  MS["$title"]="$num"
done < <(gh api "repos/$REPO/milestones?state=all&per_page=100" -q '.[] | "\(.number)\t\(.title)"')

existing_titles="$(gh issue list --repo "$REPO" --state all --limit 500 --json title -q '.[].title' || true)"

create_issue() {
  local title="$1"; shift
  local milestone_title="$1"; shift
  local body="$1"; shift
  local labels="$1"; shift

  if echo "$existing_titles" | grep -Fxq "$title"; then
    echo "   ~ $title"
    return
  fi

  local ms_num="${MS[$milestone_title]:-}"
  if [[ -z "$ms_num" ]]; then
    echo "   ! milestone '$milestone_title' not found, skipping: $title"
    return
  fi

  gh issue create --repo "$REPO" \
    --title "$title" \
    --body "$body" \
    --milestone "$milestone_title" \
    --label "$labels" >/dev/null
  echo "   + $title"
}

echo "==> Creating issues (edit this script per project)"

# ============= EXAMPLE (replace with real stories from docs/06) =============

create_issue "US-01 — <user-story-title>" "M1 — Core MVP" \
"As a <persona>, I want to <action>, so that <outcome>.

### Acceptance criteria
- [ ] <criterion 1>
- [ ] <criterion 2>
- [ ] <criterion 3>

### References
[docs/06-user-stories.md → US-01](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:M"

# Patterns:
# - User stories from docs/06 → labels: type:user-story + area:* + priority:* + effort:*
# - Chores from M0 → labels: type:chore + area:devops + priority:p0
# - Risks from docs/09 → labels: type:risk + area:* + priority:*
# - ADRs from docs/18 → labels: type:adr + area:*

echo ""
echo "Done. Open the project board:"
echo "  https://github.com/$REPO/issues"
