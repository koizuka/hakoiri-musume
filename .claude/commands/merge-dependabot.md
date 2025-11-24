---
description: Merge safe dependabot PRs one by one efficiently
allowed-tools: Bash(gh pr list:*), Bash(gh pr view:*), Bash(gh pr merge:*), Bash(gh pr comment:*), Bash(gh pr checks:*), Bash(gh pr update-branch:*)
---

Merge all safe dependabot PRs efficiently and automatically:

## Process

1. **List PRs**: Get all dependabot PRs with `gh pr list --author app/dependabot`

2. **Create todo list**: Create a todo list with all PRs to track progress

3. **For each PR** (process one at a time, in order):
   - Set auto-merge: `gh pr merge <PR#> --squash --auto`
   - Update branch: Try `gh pr update-branch <PR#>`
     - If conflicts occur, use `gh pr comment <PR#> --body "@dependabot recreate"`
   - Watch CI: `gh pr checks <PR#> --watch` until all checks pass
   - Wait for auto-merge to complete
   - Mark todo as completed and move to next PR

4. **Verify completion**: `gh pr list --author app/dependabot` should show no results

## Safety criteria

Focus on npm dependency updates with patch/minor version bumps. These are generally safe:

- @tailwindcss packages, tailwind-merge, tailwindcss
- @radix-ui packages (react-dialog, react-slot, etc.)
- lucide-react, clsx, class-variance-authority
- vite, vitest, @vitejs packages
- typescript-eslint, eslint packages
- @types packages

Skip or ask user about:

- Major version updates (e.g., 1.x → 2.x)
- React version updates (requires testing)
- Updates with failing CI

## Notes

- Repository requires PRs to be up-to-date with main before merging
- Use `gh pr update-branch` instead of asking dependabot to rebase (faster)
- Process PRs sequentially - each merge invalidates other PRs
- Use `gh pr checks --watch` to efficiently wait for CI completion
