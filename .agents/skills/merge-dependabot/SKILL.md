---
name: merge-dependabot
description: Review open Dependabot pull requests, enable auto-merge for safe dependency updates, and monitor the merge chain when the user asks to process Dependabot PRs.
---

# Merge Dependabot pull requests

Use this workflow only when the user explicitly asks to process or merge Dependabot pull requests.

1. List open Dependabot PRs with their numbers and titles.
2. Categorize patch and minor updates of known packages as safe. Treat major updates, React updates, unknown packages, and PRs with failing checks as needing review.
3. Ask the user before including any PR that needs review. Continue with the safe PRs and any additional PRs the user approves.
4. Enable squash auto-merge on the approved PRs.
5. List the remaining Dependabot PRs and update the oldest open branch to start the merge chain when needed.
6. Monitor the approved PRs every 30–60 seconds until they merge or require intervention:
   - For conflicts, comment `@dependabot recreate` once, then monitor the recreated PR.
   - For CI failures, disable auto-merge on that PR, report it, and continue with the others.
   - For a branch behind `main`, use `gh pr update-branch`.
   - If a PR makes no progress for ten minutes, inspect its checks and merge state, report the cause, and stop monitoring that PR when user action is required.
7. Verify no approved open Dependabot PRs remain.
8. If the local branch is `main`, pull `origin/main` after the merges complete.

Do not merge PRs outside the approved set. Summarize merged, skipped, and failed PRs.
