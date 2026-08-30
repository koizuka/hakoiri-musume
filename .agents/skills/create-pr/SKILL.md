---
name: create-pr
description: Validate the current repository changes, create a branch and commit, push it, and open a GitHub pull request when the user asks to create or open a PR.
---

# Create a pull request

Use this workflow only when the user has explicitly asked to create or open a pull request. The request authorizes the branch, commit, push, and PR creation described below. Do not pause for confirmation between successful steps.

1. Inspect `git status`, the staged and unstaged diff against `HEAD`, the current branch, and recent commits. Ensure the working tree changes are the intended PR scope; preserve unrelated user changes.
2. Run these checks in parallel from the current branch:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test -- --run`
   - `npm run build`
3. If any check fails, report the failure and stop before creating a branch or commit.
4. Generate a concise branch name based on the changes and create the branch. If already on an appropriate non-default branch, keep it.
5. Stage the intended changes and review the staged diff. Do not include unrelated files.
6. Generate a concise commit message that captures the purpose, then commit the staged changes.
7. Push the branch to `origin` and set its upstream.
8. Create a pull request targeting `main` with a concise title and body containing:
   - a summary of the changes
   - the checks that passed
9. Report the pull request URL.

If a step fails, stop before later mutations and report the error. Never rewrite existing commits or force-push unless the user separately requests it.
