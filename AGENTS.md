# SecondShot agent workflow

For app changes, follow `secondshot-full-stack.agent.md` as the project-specific engineering guide. Inspect how the React frontend, Express backend, and `auth-app` fit together before making cross-cutting changes. Preserve existing user edits and avoid claiming end-to-end behavior based only on a frontend build.

Run prompt-driven changes with `scripts/run-prompt-workflow.sh <branch-name> "your request"`, or run it without arguments to enter both values interactively. It creates the named task branch, invokes Codex in this repository, runs frontend tests and builds plus backend JavaScript syntax checks, and builds the auth app. It allows one automatic repair pass. It stops when user input or missing dependencies block progress. Changes remain uncommitted for review.
