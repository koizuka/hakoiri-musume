import type { Move, Piece, Direction, KeyboardMapping } from '../types/game';
import { movePiece, getOppositeDirection } from './gameLogic';

export function isAutoUndo(lastMove: Move | undefined, currentMove: Move): boolean {
  if (!lastMove) return false;
  
  return lastMove.pieceId === currentMove.pieceId &&
         lastMove.direction === getOppositeDirection(currentMove.direction) &&
         lastMove.to.x === currentMove.from.x &&
         lastMove.to.y === currentMove.from.y;
}

export function executeUndo(pieces: Piece[], moveHistory: Move[]): {
  pieces: Piece[];
  moveHistory: Move[];
  moves: number;
  keyboardMapping: KeyboardMapping | null;
} {
  if (moveHistory.length === 0) {
    return { pieces, moveHistory, moves: 0, keyboardMapping: null };
  }

  const lastMove = moveHistory[moveHistory.length - 1];
  const oppositeDirection = getOppositeDirection(lastMove.direction);
  
  const newPieces = movePiece(pieces, lastMove.pieceId, oppositeDirection);
  const newMoveHistory = moveHistory.slice(0, -1);
  
  return {
    pieces: newPieces,
    moveHistory: newMoveHistory,
    moves: newMoveHistory.length,
    keyboardMapping: lastMove.keyboardMappingBefore
  };
}

export function addMoveToHistory(
  moveHistory: Move[],
  pieceId: string,
  from: { x: number; y: number },
  to: { x: number; y: number },
  direction: Direction,
  keyboardMappingBefore: KeyboardMapping
): Move[] {
  const newMove: Move = {
    pieceId,
    from,
    to,
    direction,
    keyboardMappingBefore
  };
  
  return [...moveHistory, newMove];
}

export function executeMoveWithUndo(
  pieces: Piece[],
  moveHistory: Move[],
  pieceId: string,
  direction: Direction,
  currentKeyboardMapping: KeyboardMapping
): {
  pieces: Piece[];
  moveHistory: Move[];
  moves: number;
  wasAutoUndo: boolean;
  keyboardMapping: KeyboardMapping | null;
} {
  const piece = pieces.find(p => p.id === pieceId);
  if (!piece) {
    return { pieces, moveHistory, moves: moveHistory.length, wasAutoUndo: false, keyboardMapping: null };
  }

  const newPieces = movePiece(pieces, pieceId, direction);
  const newPosition = newPieces.find(p => p.id === pieceId)!.position;
  
  const proposedMove: Move = {
    pieceId,
    from: piece.position,
    to: newPosition,
    direction,
    keyboardMappingBefore: currentKeyboardMapping
  };

  const lastMove = moveHistory[moveHistory.length - 1];
  const isUndo = isAutoUndo(lastMove, proposedMove);
  
  if (isUndo) {
    // Auto-undo: remove the last move from history and restore its keyboard mapping
    const newMoveHistory = moveHistory.slice(0, -1);
    return {
      pieces: newPieces,
      moveHistory: newMoveHistory,
      moves: newMoveHistory.length,
      wasAutoUndo: true,
      keyboardMapping: lastMove.keyboardMappingBefore
    };
  } else {
    // Normal move: add to history
    const newMoveHistory = addMoveToHistory(
      moveHistory,
      pieceId,
      piece.position,
      newPosition,
      direction,
      currentKeyboardMapping
    );
    return {
      pieces: newPieces,
      moveHistory: newMoveHistory,
      moves: newMoveHistory.length,
      wasAutoUndo: false,
      keyboardMapping: null
    };
  }
}