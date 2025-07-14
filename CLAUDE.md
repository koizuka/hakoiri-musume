# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a "hakoiri-musume" (箱入り娘) sliding puzzle game built with React, TypeScript, Vite, and Tailwind CSS. The game implements the classic Japanese sliding puzzle where the goal is to move the daughter (2x2 piece) to the exit at the bottom center of the board.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Game Architecture

### Core Components

- **GameBoard**: Main game interface with keyboard and mouse interaction
- **Piece**: Individual game pieces with handles for movement
- **Handle**: Movement controls that appear on movable pieces
- **GameControls**: Move counter, undo button, and reset functionality
- **WinModal**: Victory celebration modal

### Game Logic Structure

- **Types** (`src/types/game.ts`): Core type definitions for pieces, positions, moves
- **Game Engine** (`src/hooks/useGameEngine.ts`): Main game state management
- **Game Logic** (`src/lib/gameLogic.ts`): Movement validation, collision detection, win conditions
- **Keyboard Mapping** (`src/lib/keyboardMapping.ts`): Arrow key assignment and cycling
- **Undo Logic** (`src/lib/undoLogic.ts`): Move history and auto-undo functionality

### Key Features

#### Controls

- **Mouse/Touch**: Click directional handles on pieces to move
- **Keyboard**: Arrow keys move selected pieces, Space cycles selection, U for undo
- **Undo System**: Normal undo (U key/button) and auto-undo (reverse of last move)

#### Game Mechanics

- **Smart Keyboard Mapping**: Arrow keys dynamically assigned to movable pieces
- **Visual Feedback**: Selected pieces highlighted with yellow handles
- **Move Counter**: Tracks total moves with undo reducing count
- **Win Detection**: Checks if daughter reaches exit position

### Technical Details

#### State Management

- Uses React hooks for local state management
- Game state includes pieces, moves, move history, keyboard mapping, and win status
- Real-time keyboard mapping updates after each move

#### Styling

- Tailwind CSS for responsive design
- Different colors for each piece type
- Grid-based layout with smooth animations

#### Testing

- Vitest for unit testing
- Tests cover game logic, movement validation, and win conditions
- Setup in `src/test/setup.ts` with global test configuration

## Development Notes

- Use `type` imports for TypeScript types to avoid build issues
- Tailwind CSS v4 requires `@tailwindcss/postcss` plugin
- Game board is 4x5 grid with exit at bottom center (position 1,4)
- Pieces have different sizes: 1x1 (apprentices), 1x2 (father, mother, servants), 2x1 (manager), 2x2 (daughter)
- **IMPORTANT**: Do NOT run `npm run dev` from Claude Code. Users will start the development server in a separate process when needed.

## File Structure

```
src/
  components/
    GameBoard.tsx       # Main game interface
    Piece.tsx          # Individual game pieces
    Handle.tsx         # Movement handles
    GameControls.tsx   # UI controls
    WinModal.tsx       # Victory modal
  hooks/
    useGameEngine.ts   # Game state management
  lib/
    gameLogic.ts       # Core game mechanics
    gameData.ts        # Initial game setup
    keyboardMapping.ts # Keyboard controls
    undoLogic.ts       # Undo functionality
    utils.ts           # Utility functions
  types/
    game.ts            # Type definitions
  test/
    setup.ts           # Test configuration
```
