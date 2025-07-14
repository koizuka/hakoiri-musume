export type PieceType = 'father' | 'daughter' | 'mother' | 'servant' | 'manager' | 'maid' | 'apprentice';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Piece {
  id: string;
  type: PieceType;
  position: Position;
  size: Size;
  name: string;
}

export interface Move {
  pieceId: string;
  from: Position;
  to: Position;
  direction: Direction;
}

export interface KeyboardMapping {
  up: string[];
  down: string[];
  left: string[];
  right: string[];
  selectedIndex: { [key in Direction]: number };
}

export interface GameState {
  pieces: Piece[];
  moves: number;
  moveHistory: Move[];
  keyboardMapping: KeyboardMapping;
  isWon: boolean;
}

export interface MovableDirection {
  direction: Direction;
  pieceId: string;
}

export const BOARD_WIDTH = 4;
export const BOARD_HEIGHT = 5;
export const EXIT_POSITION = { x: 1, y: 4 };
export const EXIT_SIZE = { width: 2, height: 1 };