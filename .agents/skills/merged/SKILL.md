---
name: merged
description: Clean up a local Git repository after its pull request was merged by returning to main, updating it, and removing the merged topic branch.
---

# Clean up after a merged pull request

Use this workflow only when the user says the current or named pull request has been merged and asks for cleanup.

1. Determine the topic branch from the user's argument or the current branch. Stop if it resolves to `main`, is ambiguous, or has uncommitted changes that would be disrupted.
2. Switch to `main`.
3. Pull the latest `origin/main` with `git pull --ff-only origin main`.
4. Delete the saved local topic branch with `git branch -d`.
5. If Git reports that the branch is not fully merged, do not force-delete it without separate user confirmation.
6. Prune stale `origin` remote-tracking branches with `git fetch --prune origin`.
7. Report the branch removed and the updated `main` revision.

Do not delete a remote branch unless the user separately requests it.
