---
description: Merge safe dependabot PRs efficiently with auto-merge
allowed-tools: Bash(gh pr list:*), Bash(gh pr view:*), Bash(gh pr merge:*), Bash(gh pr comment:*), Bash(gh pr checks:*), Bash(gh pr update-branch:*)
---

Merge all safe dependabot PRs efficiently and automatically:

## Process

1. **List PRs**: Get all dependabot PRs with `gh pr list --author app/dependabot --json number,title`

2. **Categorize PRs**:
   - **Safe**: Patch/minor updates of known safe packages (see Safety criteria below)
   - **Needs review**: Major version updates, React updates, unknown packages

3. **Ask user about non-safe PRs**: If there are major version updates or other risky PRs, ask user whether to include them

4. **Create todo list**: Create a todo list with approved PRs to track progress

5. **Set auto-merge on approved PRs**:
   ```bash
   for pr in <approved PR numbers>; do
     gh pr merge $pr --squash --auto
   done
   ```

6. **Kick off the first PR**: Run `gh pr update-branch` on one PR to start the chain

7. **Monitor until all PRs are processed**:
   - Periodically check: `gh pr list --author app/dependabot --json number,state,mergeable`
   - For each remaining PR, check status with `gh pr view <PR#> --json state,mergeStateStatus`
   - Handle issues as they arise:
     - **Conflicts**: `gh pr comment <PR#> --body "@dependabot recreate"`
     - **CI failures**: Report to user for manual review
     - **Blocked**: May need manual `gh pr update-branch`
   - Continue until no open PRs remain

8. **Verify completion**: `gh pr list --author app/dependabot` should show no results (or only skipped PRs)

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
- Use `gh pr update-branch` instead of asking dependabot to rebase (faster for initial kick-off)

## Optimization rationale

- **Pre-setting auto-merge on approved PRs**: Once auto-merge is enabled, GitHub automatically merges each PR when CI passes and the branch is up-to-date. Dependabot automatically rebases remaining PRs after each merge, creating a chain reaction.
- **Minimal intervention**: After kicking off the first PR, we only need to monitor and handle exceptions (conflicts, CI failures). The rest is automatic.
