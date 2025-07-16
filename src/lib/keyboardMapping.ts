import type { Piece, KeyboardMapping, Direction } from '../types/game';
import { getAllMovableDirections, getNewPosition, getOppositeDirection } from './gameLogic';

function findFillerPiece(pieces: Piece[], lastMovedPieceId: string, lastMoveDirection: Direction, currentDirection: Direction): string | null {
  const lastMovedPiece = pieces.find(p => p.id === lastMovedPieceId);
  if (!lastMovedPiece) return null;
  
  // Calculate the original position of the last moved piece (before it moved)
  const oppositeDirection = getOppositeDirection(lastMoveDirection);
  const originalPosition = getNewPosition(lastMovedPiece.position, oppositeDirection);
  
  // Find pieces that can move into the space left by the last moved piece
  for (const piece of pieces) {
    if (piece.id === lastMovedPieceId) continue;
    
    // Check if this piece can move in the current direction and would end up in the original position
    const newPosition = getNewPosition(piece.position, currentDirection);
    
    // Check if the new position overlaps with the original position of the moved piece
    if (isPositionOverlap(newPosition, piece.size, originalPosition, lastMovedPiece.size)) {
      return piece.id;
    }
  }
  
  return null;
}

function isPositionOverlap(pos1: { x: number; y: number }, size1: { width: number; height: number }, 
                          pos2: { x: number; y: number }, size2: { width: number; height: number }): boolean {
  return pos1.x < pos2.x + size2.width && 
         pos1.x + size1.width > pos2.x && 
         pos1.y < pos2.y + size2.height && 
         pos1.y + size1.height > pos2.y;
}

export function updateKeyboardMapping(pieces: Piece[], lastMovedPieceId?: string, lastMoveDirection?: Direction): KeyboardMapping {
  const movableDirections = getAllMovableDirections(pieces);
  
  const mapping: KeyboardMapping = {
    up: [],
    down: [],
    left: [],
    right: [],
    selectedIndex: {
      up: 0,
      down: 0,
      left: 0,
      right: 0
    }
  };

  // Group movable directions by direction
  movableDirections.forEach(({ direction, pieceId }) => {
    if (!mapping[direction].includes(pieceId)) {
      mapping[direction].push(pieceId);
    }
  });

  // If a piece was just moved, prioritize pieces for intelligent selection
  if (lastMovedPieceId && lastMoveDirection) {
    Object.keys(mapping).forEach(direction => {
      if (direction !== 'selectedIndex') {
        const directionKey = direction as Direction;
        const piecesInDirection = mapping[directionKey];
        
        if (piecesInDirection.length > 1) {
          // Check if the last moved piece can move in the current direction
          const movedPieceIndex = piecesInDirection.indexOf(lastMovedPieceId);
          
          if (movedPieceIndex >= 0) {
            // Prioritize the last moved piece if it can move in the current direction
            if (movedPieceIndex > 0) {
              piecesInDirection.splice(movedPieceIndex, 1);
              piecesInDirection.unshift(lastMovedPieceId);
            }
            mapping.selectedIndex[directionKey] = 0;
          } else {
            // If the last moved piece cannot move in this direction, find the filler piece
            const fillerPiece = findFillerPiece(pieces, lastMovedPieceId, lastMoveDirection, directionKey);
            
            if (fillerPiece) {
              // Move the filler piece to the front
              const fillerIndex = piecesInDirection.indexOf(fillerPiece);
              if (fillerIndex > 0) {
                piecesInDirection.splice(fillerIndex, 1);
                piecesInDirection.unshift(fillerPiece);
                mapping.selectedIndex[directionKey] = 0;
              }
            }
          }
        }
      }
    });
  }

  return mapping;
}

export function getSelectedPieceForDirection(
  keyboardMapping: KeyboardMapping,
  direction: Direction
): string | null {
  const pieces = keyboardMapping[direction];
  const selectedIndex = keyboardMapping.selectedIndex[direction];
  
  if (pieces.length === 0 || selectedIndex >= pieces.length) {
    return null;
  }
  
  return pieces[selectedIndex];
}

export function cycleSelectedPiece(
  keyboardMapping: KeyboardMapping,
  direction: Direction
): KeyboardMapping {
  const pieces = keyboardMapping[direction];
  
  if (pieces.length <= 1) {
    return keyboardMapping;
  }
  
  const currentIndex = keyboardMapping.selectedIndex[direction];
  const nextIndex = (currentIndex + 1) % pieces.length;
  
  return {
    ...keyboardMapping,
    selectedIndex: {
      ...keyboardMapping.selectedIndex,
      [direction]: nextIndex
    }
  };
}

export function cycleAllDirections(keyboardMapping: KeyboardMapping): KeyboardMapping {
  const directions: Direction[] = ['up', 'down', 'left', 'right'];
  const newSelectedIndex = { ...keyboardMapping.selectedIndex };
  
  // Find the maximum number of pieces in any direction to determine cycling
  const maxPieces = Math.max(
    keyboardMapping.up.length,
    keyboardMapping.down.length,
    keyboardMapping.left.length,
    keyboardMapping.right.length
  );
  
  // If no direction has more than 1 piece, no cycling needed
  if (maxPieces <= 1) {
    return keyboardMapping;
  }
  
  // Cycle all directions simultaneously
  directions.forEach(direction => {
    const pieces = keyboardMapping[direction];
    if (pieces.length > 1) {
      const currentIndex = keyboardMapping.selectedIndex[direction];
      newSelectedIndex[direction] = (currentIndex + 1) % pieces.length;
    }
  });
  
  return {
    ...keyboardMapping,
    selectedIndex: newSelectedIndex
  };
}

export function resetKeyboardSelection(keyboardMapping: KeyboardMapping): KeyboardMapping {
  return {
    ...keyboardMapping,
    selectedIndex: {
      up: 0,
      down: 0,
      left: 0,
      right: 0
    }
  };
}

export function getKeyboardMappingForPiece(
  keyboardMapping: KeyboardMapping,
  pieceId: string
): Direction[] {
  const directions: Direction[] = [];
  
  Object.entries(keyboardMapping).forEach(([direction, pieces]) => {
    if (direction !== 'selectedIndex' && Array.isArray(pieces)) {
      const typedDirection = direction as Direction;
      const selectedPiece = getSelectedPieceForDirection(keyboardMapping, typedDirection);
      if (selectedPiece === pieceId) {
        directions.push(typedDirection);
      }
    }
  });
  
  return directions;
}