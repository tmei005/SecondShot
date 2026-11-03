# Prompt driven app changes

From the repository root, provide the Git branch name first and the task prompt second:

```bash
scripts/run-prompt-workflow.sh fix-history-empty-state "Fix the interview history page so it handles an empty result"
```

Run without arguments to enter both values interactively. The runner creates the exact branch name you provide, asks Codex CLI to implement the request using `AGENTS.md` and `secondshot-full-stack.agent.md`, and checks the app after the agent finishes. Choose a new branch name for each run.

## Automatic checks

- `frontend`: Jest tests in CI mode, then a production build.
- `backend`: syntax checks for every backend JavaScript file. The current backend has no usable test command; its `npm test` script is a placeholder that exits with an error.
- `auth-app`: production build.

When a check fails, Codex gets one repair pass and the full check set runs again. A missing dependency, unresolved user decision, or persistent check failure stops the workflow with the branch and available output. Frontend tests may report that no tests exist; the production builds still verify compilation, not live service integrations.

The runner leaves work uncommitted and unstaged for review. Existing uncommitted files remain in the working tree when the branch is created; review them alongside the task diff before committing. No credentials are requested or written by the runner.
