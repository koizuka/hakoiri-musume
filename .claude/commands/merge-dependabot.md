---
description: Merge safe dependabot PRs efficiently with auto-merge
allowed-tools: Bash(gh pr list:*), Bash(gh pr view:*), Bash(gh pr merge:*), Bash(gh pr comment:*), Bash(gh pr checks:*), Bash(gh pr update-branch:*), Bash(git pull)
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
   echo "<approved PR numbers>" | xargs -n1 gh pr merge --squash --auto
   ```

6. **Kick off the merge chain**:
   - Check remaining open PRs: `gh pr list --author app/dependabot --json number,state`
   - If PRs remain, update the oldest open PR's branch: `gh pr update-branch <oldest-PR-number>`
   - Note: Some PRs may merge immediately after auto-merge is set if already up-to-date

7. **Monitor until all PRs are processed**:
   - Check every 30-60 seconds: `gh pr list --author app/dependabot --json number,state,mergeable,mergeStateStatus,statusCheckRollup`
   - Handle issues as they arise:
     - **Conflicts**: `gh pr comment <PR#> --body "@dependabot recreate"`
     - **CI failures**: Disable auto-merge on that PR (`gh pr merge --disable-auto <PR#>`), report to user, continue with remaining PRs
     - **Blocked**: May need manual `gh pr update-branch`
   - When a PR merges, update the next oldest open PR's branch if it shows `mergeStateStatus: "BEHIND"`
   - If a PR is stuck for >10 minutes, investigate manually
   - Continue until no open PRs remain

8. **Verify completion**: `gh pr list --author app/dependabot` should show no results (or only skipped PRs)

9. **Sync local repository**: If on main branch, run `git pull` to update with merged changes

## Safety criteria

Focus on dependency updates with patch/minor version bumps. Use your knowledge of common packages to determine safety.

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
