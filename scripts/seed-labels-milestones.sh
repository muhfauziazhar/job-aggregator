#!/usr/bin/env bash
# Idempotent seeder for labels + milestones.
# Usage: REPO=owner/repo bash scripts/seed-labels-milestones.sh
set -euo pipefail

REPO="${REPO:?REPO env var required, e.g. REPO=muhfauziazhar/foo}"

label() {
  local name="$1" color="$2" desc="$3"
  if gh label list --repo "$REPO" --limit 200 --json name -q '.[].name' | grep -qx "$name"; then
    gh label edit "$name" --repo "$REPO" --color "$color" --description "$desc" >/dev/null
    echo "   ~ $name"
  else
    gh label create "$name" --repo "$REPO" --color "$color" --description "$desc" >/dev/null
    echo "   + $name"
  fi
}

echo "==> Labels"
# Type
label "type:feature"    "0E8A16" "New user-facing capability"
label "type:bug"        "D73A4A" "Defect or regression"
label "type:chore"      "BFD4F2" "Tooling, config, infra"
label "type:doc"        "5319E7" "Documentation only"
label "type:risk"       "B60205" "Risk identified — needs mitigation"
label "type:user-story" "1D76DB" "User story (promoted from docs/06)"
label "type:adr"        "FBCA04" "Architectural decision record"

# Area (extend per project)
label "area:devops"   "C5DEF5" "CI/CD, Docker, deploy"
label "area:db"       "C5DEF5" "Database schema"
label "area:api"      "C5DEF5" "Backend / API routes"
label "area:docs"     "C5DEF5" "Project docs (docs/*)"
label "area:a11y"     "C5DEF5" "Accessibility"
label "area:perf"     "C5DEF5" "Performance"
label "area:security" "C5DEF5" "Security & privacy"

# Area — AI add-on (only relevant when shipping LLM features; harmless otherwise)
label "area:ai-prompt"     "BFE5BF" "Prompt change — requires eval delta"
label "area:ai-agent"      "BFE5BF" "Agent loop / tool registry"
label "area:ai-retrieval"  "BFE5BF" "Embedding / retrieval / reranker"
label "area:ai-eval"       "BFE5BF" "Eval harness, golden dataset, metrics"
label "area:ai-cost"       "BFE5BF" "LLM cost tracking / routing / caching"
label "area:ai-validation" "BFE5BF" "Domain expert review and sign-off"

# Status — AI add-on (gate prompt / model changes through eval before merge)
label "status:eval-required" "FFD580" "PR must run eval before merge (AI add-on)"
label "status:expert-review" "FFD580" "Awaiting domain expert validation (AI add-on)"

# Priority
label "priority:p0" "B60205" "Must-have for MVP"
label "priority:p1" "D93F0B" "Important but not blocking MVP"
label "priority:p2" "FBCA04" "Nice-to-have / post-MVP"

# Status
label "status:blocked"    "000000" "Blocked by another issue"
label "status:needs-spec" "EEEEEE" "Acceptance criteria unclear"
label "status:good-first" "7057FF" "Good first issue"

# Effort (t-shirt)
label "effort:S" "C2E0C6" "<= 1 day"
label "effort:M" "FEF2C0" "2-3 days"
label "effort:L" "F9D0C4" "1 week"

milestone() {
  local title="$1" desc="$2" due="${3:-}"
  if gh api "repos/$REPO/milestones?state=all&per_page=100" -q '.[].title' | grep -qx "$title"; then
    echo "   ~ $title (exists)"
    return
  fi
  if [[ -n "$due" ]]; then
    gh api -X POST "repos/$REPO/milestones" -f title="$title" -f description="$desc" -f due_on="$due" >/dev/null
  else
    gh api -X POST "repos/$REPO/milestones" -f title="$title" -f description="$desc" >/dev/null
  fi
  echo "   + $title"
}

# Edit per project before running
echo "==> Milestones"
milestone "M0 — Project Setup" \
  "Repo, CI, deploy pipeline, blueprint docs filled in. Exit: green pipeline + scaffolding live." \
  ""
milestone "M1 — Core MVP" \
  "Primary feature loop end-to-end. Exit: user can complete the critical journey." \
  ""
milestone "M2 — Polish & Launch" \
  "Accessibility, performance, telemetry, share/social. Exit: launch-ready beta." \
  ""
milestone "M3 — Post-MVP" \
  "Improvements based on early feedback." \
  ""

echo ""
echo "Done. Next: edit and run scripts/seed-issues.sh"
