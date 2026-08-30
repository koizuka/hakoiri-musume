# Repository guidance

## Project

`hakoiri-musume` is a React and TypeScript implementation of the classic 4×5 Japanese sliding puzzle. It uses Vite, Tailwind CSS, shadcn/ui, and Vitest.

- Use Node.js 22.12 or newer and npm.
- Keep user-facing game behavior documented in `README.md`; keep this file focused on agent instructions and non-obvious implementation constraints.

## Commands

```bash
npm ci                  # Install the locked dependency set
npm run typecheck       # TypeScript checks
npm run lint            # ESLint
npm test -- --run       # Run the test suite once (non-watch mode)
npm run build           # Production build
```

Run all four checks (`typecheck`, `lint`, `test -- --run`, and `build`) before committing or opening a pull request.

Do not run `npm run dev` from a coding agent. The user starts the development server separately when interactive testing is needed.

## Architecture

- `src/hooks/useGameEngine.ts`: state orchestration, moves, undo/reset, keyboard actions, and win state.
- `src/lib/gameLogic.ts`: pure board movement, collision, and win-condition rules.
- `src/lib/gameData.ts`: initial piece layout and keyboard mapping.
- `src/lib/keyboardMapping.ts`: assigns movable pieces to keyboard directions and cycles selection.
- `src/lib/undoLogic.ts`: normal and automatic reverse-move behavior.
- `src/types/game.ts`: shared game types and board/exit constants.
- `src/components/`: rendering and user interaction; avoid duplicating game rules here.

## Conventions and invariants

- Use `import type` for type-only TypeScript imports; `verbatimModuleSyntax` is enabled.
- Use the `@/` alias for imports from `src` when it makes imports clearer.
- Treat `BOARD_WIDTH`, `BOARD_HEIGHT`, `EXIT_POSITION`, and `EXIT_SIZE` in `src/types/game.ts` as the source of truth rather than duplicating dimensions.
- Board coordinates are zero-based. The board is 4×5, its exit begins at `(1, 4)`, and the 2×2 daughter wins at position `(1, 3)`.
- When movement, keyboard mapping, undo, or win behavior changes, update the corresponding tests under `src/lib/`.
