# Security Policy

## Supported versions

hakoiri-musume is a single-page web app deployed continuously from `main` to
GitHub Pages. Only the current deployment is supported:

- **Live**: https://koizuka.github.io/hakoiri-musume/

There are no released versions or branches to back-port fixes to — the fix lands
on `main` and ships on the next deploy.

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Use GitHub's **private vulnerability reporting** instead:

1. Go to the repository's **Security** tab.
2. Click **Report a vulnerability**.
3. Describe the issue, affected area, and reproduction steps.

If private reporting is unavailable, email the maintainer at koizuka@gmail.com.

You can expect an initial response within about a week. Once a fix is verified it
is merged to `main` and deployed automatically.

## Scope

This app runs entirely in the browser — a sliding-puzzle game with no server,
no API keys, and no user accounts. There is no remote data to compromise.

Reports about supply-chain integrity (dependencies, GitHub Actions, CI) are
in scope. The cross-repository hardening checklist lives in a sibling repository:
https://github.com/koizuka/drawing-practice/blob/main/docs/supply-chain-hardening.md
