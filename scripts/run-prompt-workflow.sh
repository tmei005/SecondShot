#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "Run this workflow from inside the SecondShot Git repository." >&2
  exit 2
}
cd "$ROOT_DIR"

if ! command -v codex >/dev/null 2>&1; then
  echo "NEEDS_USER_INPUT: Codex CLI is not installed or is not on PATH." >&2
  exit 2
fi

if [[ $# -eq 2 ]]; then
  TASK_BRANCH="$1"
  USER_TASK="$2"
elif [[ $# -eq 0 ]]; then
  printf 'Git branch name to create:\n> '
  IFS= read -r TASK_BRANCH || true
  printf 'What should I change in SecondShot?\n> '
  IFS= read -r USER_TASK || true
else
  echo 'Usage: scripts/run-prompt-workflow.sh <branch-name> "<prompt>"' >&2
  echo 'Run with no arguments to enter both values interactively.' >&2
  exit 2
fi
if [[ -z "${TASK_BRANCH//[[:space:]]/}" ]]; then
  echo "No branch name supplied; stopping without changes." >&2
  exit 2
fi
if [[ -z "${USER_TASK//[[:space:]]/}" ]]; then
  echo "No prompt supplied; stopping without changes." >&2
  exit 2
fi

if ! git check-ref-format --branch "$TASK_BRANCH" >/dev/null; then
  echo "Invalid Git branch name: $TASK_BRANCH" >&2
  exit 2
fi
if ! git switch -c "$TASK_BRANCH"; then
  echo "Could not create task branch $TASK_BRANCH; stopping." >&2
  exit 2
fi

RUN_DIR="$(mktemp -d "${TMPDIR:-/tmp}/secondshot-agent.XXXXXX")"
trap 'rm -rf "$RUN_DIR"' EXIT
PROMPT_FILE="$RUN_DIR/prompt.txt"
LAST_MESSAGE="$RUN_DIR/last-message.txt"
CHECK_LOG="$RUN_DIR/checks.log"

cat > "$PROMPT_FILE" <<EOF
You are the SecondShot Full-Stack Engineer. Follow the repository's AGENTS.md and secondshot-full-stack.agent.md instructions.

User request:
$USER_TASK

Work autonomously only while the request is clear and safe. Inspect the whole relevant app first: the React frontend, Express backend, and auth-app, including how their contracts and configuration connect. Preserve unrelated pre-existing working-tree changes. Implement the requested behavior, then review your diff.

If a missing product decision, credential, external service, or destructive action blocks safe progress, make no speculative change for that decision. Finish any independent safe work, then make your final response begin with exactly `NEEDS_USER_INPUT:` followed by concise questions. Otherwise, report implementation and checks. Do not claim checks passed unless their output supports that.
EOF

echo "Task branch: $TASK_BRANCH"
echo "Agent working on the request..."
codex exec --cd "$ROOT_DIR" --sandbox workspace-write -o "$LAST_MESSAGE" - < "$PROMPT_FILE"

if rg -q '^NEEDS_USER_INPUT:' "$LAST_MESSAGE"; then
  cat "$LAST_MESSAGE"
  echo "Workflow stopped for your input. Branch: $TASK_BRANCH"
  exit 3
fi

run_checks() {
  : > "$CHECK_LOG"
  local failed=0
  run_check() {
    local label="$1"; shift
    echo "== $label ==" | tee -a "$CHECK_LOG"
    if "$@" 2>&1 | tee -a "$CHECK_LOG"; then
      echo "PASS: $label"
    else
      echo "FAIL: $label"
      failed=1
    fi
  }

  if [[ -d frontend/node_modules ]]; then
    run_check "Frontend tests" env CI=true npm --prefix frontend test -- --watchAll=false --runInBand
    run_check "Frontend production build" npm --prefix frontend run build
  else
    echo "NEEDS_USER_INPUT: frontend dependencies are missing; run npm install in frontend/." | tee -a "$CHECK_LOG"
    return 2
  fi

  if [[ -d backend/node_modules ]]; then
    run_check "Backend JavaScript syntax" bash -c 'find backend -path "*/node_modules" -prune -o -name "*.js" -type f -print0 | xargs -0 -r -n1 node --check'
  else
    echo "NEEDS_USER_INPUT: backend dependencies are missing; run npm install in backend/." | tee -a "$CHECK_LOG"
    return 2
  fi

  if [[ -d auth-app/node_modules ]]; then
    run_check "Auth app production build" npm --prefix auth-app run build
  else
    echo "NEEDS_USER_INPUT: auth app dependencies are missing; run npm install in auth-app/." | tee -a "$CHECK_LOG"
    return 2
  fi

  return "$failed"
}

for attempt in 1 2; do
  if run_checks; then
    echo "All configured checks passed."
    break
  else
    result=$?
    if [[ $result -eq 2 ]]; then
      cat "$CHECK_LOG"
      echo "Workflow stopped because a required dependency is missing. Branch: $TASK_BRANCH"
      exit 3
    fi
    if [[ $attempt -eq 2 ]]; then
      cat "$CHECK_LOG"
      echo "Checks still fail after the repair pass. Review the output above. Branch: $TASK_BRANCH"
      exit 1
    fi
    cat > "$PROMPT_FILE" <<EOF
The requested implementation is complete, but the automatic checks failed. Inspect the output below, fix the underlying issue if it is within the original scope, and review the whole relevant app again. If a decision from the user is needed, stop and make your final response begin with exactly NEEDS_USER_INPUT: followed by concise questions.

Original request:
$USER_TASK

Check output:
$(cat "$CHECK_LOG")
EOF
    echo "Checks failed; asking the agent for one repair pass..."
    codex exec --cd "$ROOT_DIR" --sandbox workspace-write -o "$LAST_MESSAGE" - < "$PROMPT_FILE"
    if rg -q '^NEEDS_USER_INPUT:' "$LAST_MESSAGE"; then
      cat "$LAST_MESSAGE"
      echo "Workflow stopped for your input. Branch: $TASK_BRANCH"
      exit 3
    fi
  fi
done

echo "Git status:"
git status --short
echo "Branch: $TASK_BRANCH"
echo "No files were staged or committed automatically."
