import type { Piece as PieceType, Direction } from '../types/game';
import { Handle } from './Handle';
import { cn } from '../lib/utils';

interface PieceProps {
  piece: PieceType;
  movableDirections: Direction[];
  selectedDirections: Direction[];
  onMove: (direction: Direction) => void;
  cellSize: number;
}

const PIECE_COLORS = {
  // Main character - bright accent color
  daughter: { backgroundColor: '#fef3c7', color: 'black', borderColor: 'black' },
  
  // Family members - light warm tones
  father: { backgroundColor: '#e0e7ff', color: 'black', borderColor: 'black' },
  mother: { backgroundColor: '#f3e8ff', color: 'black', borderColor: 'black' },
  
  // Servants - light cool tones
  servant: { backgroundColor: '#ccfbf1', color: 'black', borderColor: 'black' },
  maid: { backgroundColor: '#cffafe', color: 'black', borderColor: 'black' },
  manager: { backgroundColor: '#dbeafe', color: 'black', borderColor: 'black' },
  
  // Apprentices - light neutral tone
  apprentice: { backgroundColor: '#f5f5f4', color: 'black', borderColor: 'black' }
};

export function Piece({ piece, movableDirections, selectedDirections, onMove, cellSize }: PieceProps) {
  const { position, size, name } = piece;
  
  const colorStyle = PIECE_COLORS[piece.type];
  
  const gap = 1; // 1px gap between pieces
  const leftOffset = -3; // Move pieces left slightly
  const topOffset = -3; // Move pieces up slightly
  const style = {
    left: position.x * cellSize + leftOffset,
    top: position.y * cellSize + topOffset,
    width: size.width * cellSize - gap,
    height: size.height * cellSize - gap,
    backgroundColor: colorStyle.backgroundColor,
    color: colorStyle.color,
    borderColor: colorStyle.borderColor,
    zIndex: 10
  };

  // Calculate font size based on piece type
  const getFontSize = () => {
    switch (piece.type) {
      case 'daughter':
        return Math.min(cellSize * 1.2, 64); // Much larger for daughter
      case 'manager':
        return Math.min(cellSize * 1.0, 48); // Large for manager
      case 'apprentice':
        return Math.min(cellSize * 0.4, 18); // Keep apprentice size as is
      default:
        return Math.min(cellSize * 0.9, 40); // Double size for others
    }
  };

  const fontSize = getFontSize();
  const isVertical = size.height > size.width;

  // For vertical pieces, split the name into individual characters
  const renderText = () => {
    if (isVertical && name.length > 1) {
      return (
        <div className="flex flex-col items-center justify-center">
          {name.split('').map((char, index) => (
            <span key={index} style={{ fontSize }}>{char}</span>
          ))}
        </div>
      );
    }
    return <span style={{ fontSize }}>{name}</span>;
  };

  return (
    <div
      className={cn(
        'absolute border-2 shadow-md',
        'flex items-center justify-center font-bold',
        'transition-all duration-200 ease-in-out'
      )}
      style={{
        ...style,
        fontFamily: 'serif, "Hiragino Mincho Pro", "Yu Mincho", "MS Mincho", serif',
        borderRadius: '12px'
      }}
    >
      {renderText()}
      
      {movableDirections.map((direction) => (
        <Handle
          key={direction}
          direction={direction}
          isSelected={selectedDirections.includes(direction)}
          onClick={() => onMove(direction)}
        />
      ))}
    </div>
  );
}