import type { Piece, Position, Direction, MovableDirection } from '../types/game';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../types/game';

export function isPieceAt(pieces: Piece[], x: number, y: number): boolean {
  return pieces.some(piece => {
    const { position, size } = piece;
    return x >= position.x && 
           x < position.x + size.width && 
           y >= position.y && 
           y < position.y + size.height;
  });
}

export function isPositionOccupied(pieces: Piece[], position: Position, excludePieceId?: string): boolean {
  return pieces.some(piece => {
    if (excludePieceId && piece.id === excludePieceId) return false;
    const { position: piecePos, size } = piece;
    return position.x >= piecePos.x && 
           position.x < piecePos.x + size.width && 
           position.y >= piecePos.y && 
           position.y < piecePos.y + size.height;
  });
}

export function isValidPosition(position: Position, size: { width: number; height: number }): boolean {
  return position.x >= 0 && 
         position.y >= 0 && 
         position.x + size.width <= BOARD_WIDTH && 
         position.y + size.height <= BOARD_HEIGHT;
}

export function canMovePiece(pieces: Piece[], pieceId: string, direction: Direction): boolean {
  const piece = pieces.find(p => p.id === pieceId);
  if (!piece) return false;

  const newPosition = getNewPosition(piece.position, direction);
  
  if (!isValidPosition(newPosition, piece.size)) {
    return false;
  }

  // Check if all cells in the new position are free
  for (let x = newPosition.x; x < newPosition.x + piece.size.width; x++) {
    for (let y = newPosition.y; y < newPosition.y + piece.size.height; y++) {
      if (isPositionOccupied(pieces, { x, y }, pieceId)) {
        return false;
      }
    }
  }

  return true;
}

export function getNewPosition(position: Position, direction: Direction): Position {
  switch (direction) {
    case 'up':
      return { x: position.x, y: position.y - 1 };
    case 'down':
      return { x: position.x, y: position.y + 1 };
    case 'left':
      return { x: position.x - 1, y: position.y };
    case 'right':
      return { x: position.x + 1, y: position.y };
  }
}

export function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case 'up': return 'down';
    case 'down': return 'up';
    case 'left': return 'right';
    case 'right': return 'left';
  }
}

export function getAllMovableDirections(pieces: Piece[]): MovableDirection[] {
  const movableDirections: MovableDirection[] = [];
  
  for (const piece of pieces) {
    const directions: Direction[] = ['up', 'down', 'left', 'right'];
    
    for (const direction of directions) {
      if (canMovePiece(pieces, piece.id, direction)) {
        movableDirections.push({ direction, pieceId: piece.id });
      }
    }
  }
  
  return movableDirections;
}

export function movePiece(pieces: Piece[], pieceId: string, direction: Direction): Piece[] {
  if (!canMovePiece(pieces, pieceId, direction)) {
    return pieces;
  }

  return pieces.map(piece => {
    if (piece.id === pieceId) {
      return {
        ...piece,
        position: getNewPosition(piece.position, direction)
      };
    }
    return piece;
  });
}

export function checkWinCondition(pieces: Piece[]): boolean {
  const daughter = pieces.find(p => p.type === 'daughter');
  if (!daughter) return false;

  // Check if the daughter (2x2) can "exit" through the bottom center
  // The daughter's bottom edge should align with the exit position
  // Exit is at (1,4) with size (2,1), so daughter should be at (1,3)
  return daughter.position.x === 1 && 
         daughter.position.y === 3;
}

export function isEmptyCell(pieces: Piece[], x: number, y: number): boolean {
  return !isPieceAt(pieces, x, y);
}

export function getEmptyCells(pieces: Piece[]): Position[] {
  const emptyCells: Position[] = [];
  
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (isEmptyCell(pieces, x, y)) {
        emptyCells.push({ x, y });
      }
    }
  }
  
  return emptyCells;
}