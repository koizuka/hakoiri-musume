import type { Piece, KeyboardMapping, Direction } from '../types/game';
import { getAllMovableDirections } from './gameLogic';

export function updateKeyboardMapping(pieces: Piece[], lastMovedPieceId?: string): KeyboardMapping {
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

  // If a piece was just moved, prioritize it for auto-undo
  if (lastMovedPieceId) {
    Object.keys(mapping).forEach(direction => {
      if (direction !== 'selectedIndex') {
        const directionKey = direction as Direction;
        const pieces = mapping[directionKey];
        const movedPieceIndex = pieces.indexOf(lastMovedPieceId);
        
        if (movedPieceIndex > 0) {
          // Move the last moved piece to the front
          pieces.splice(movedPieceIndex, 1);
          pieces.unshift(lastMovedPieceId);
          mapping.selectedIndex[directionKey] = 0;
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