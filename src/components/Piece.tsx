import { useState, useRef } from 'react';
import type { Piece as PieceType, Direction } from '../types/game';
import { Handle } from './Handle';
import { cn } from '../lib/utils';

interface PieceProps {
  piece: PieceType;
  movableDirections: Direction[];
  selectedDirections: Direction[];
  onMove: (direction: Direction) => void;
  cellSize: number;
  showHandles: boolean;
  onHideHandles: () => void;
  onShowHandles: () => void;
}

// 和の伝統色 - Japanese Traditional Colors for pieces
const PIECE_COLORS = {
  // 娘 - 紅緋（べにひ）主役は華やかな紅色
  daughter: {
    backgroundColor: 'var(--color-benihi)',
    color: '#FFF8F0',
    borderColor: 'var(--color-benihi-dark)',
    isSpecial: true
  },

  // 父 - 藍鉄（あいてつ）落ち着いた藍色
  father: {
    backgroundColor: 'var(--color-aitetsu)',
    color: '#F5F1EB',
    borderColor: '#2A3547'
  },

  // 母 - 紅藤（べにふじ）柔らかい藤色
  mother: {
    backgroundColor: 'var(--color-benifuji)',
    color: '#2D2A2E',
    borderColor: '#9A7A95'
  },

  // 下男 - 若竹色（わかたけいろ）清々しい竹の緑
  servant: {
    backgroundColor: 'var(--color-wakatake)',
    color: '#1A2E24',
    borderColor: '#3D8B69'
  },

  // 女中 - 浅葱色（あさぎいろ）涼しげな青緑
  maid: {
    backgroundColor: 'var(--color-asagi)',
    color: '#F5F1EB',
    borderColor: '#306A72'
  },

  // 番頭 - 紺青（こんじょう）重厚な紺色
  manager: {
    backgroundColor: 'var(--color-konjo)',
    color: '#F5F1EB',
    borderColor: '#0F2840'
  },

  // 小僧 - 白練（しろねり）素朴な白
  apprentice: {
    backgroundColor: 'var(--color-shironeri)',
    color: '#3A3535',
    borderColor: '#C5C0B5'
  }
} as const;

export function Piece({ piece, movableDirections, selectedDirections, onMove, cellSize, showHandles, onHideHandles, onShowHandles }: PieceProps) {
  const { position, size, name } = piece;
  
  const colorStyle = PIECE_COLORS[piece.type];
  
  // Touch event state for swipe detection
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [lastMoveDirection, setLastMoveDirection] = useState<Direction | null>(null);
  const isDragging = useRef(false);
  
  const gap = 0; // No gap between pieces
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

  // Touch event handlers for swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    isDragging.current = false;
    onHideHandles(); // Hide handles on touch
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Minimum swipe distance threshold
    const minSwipeDistance = 30;
    const repeatSwipeDistance = 60; // Distance needed to repeat same direction
    
    // Determine swipe direction based on current position relative to start
    let direction: Direction | null = null;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX > minSwipeDistance || absY > minSwipeDistance) {
      if (absX > absY) {
        // Horizontal swipe
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        // Vertical swipe
        direction = deltaY > 0 ? 'down' : 'up';
      }
      
      const isNewDirection = direction !== lastMoveDirection;
      const isSameDirectionRepeat = direction === lastMoveDirection && 
        (absX > repeatSwipeDistance || absY > repeatSwipeDistance);
      
      // Allow move if: new direction OR same direction with enough distance
      if (direction && movableDirections.includes(direction) && (isNewDirection || isSameDirectionRepeat)) {
        onMove(direction);
        setLastMoveDirection(direction);
        
        // Update touch start position for continuous swipe
        setTouchStart({ x: touch.clientX, y: touch.clientY });
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setLastMoveDirection(null);
    isDragging.current = false;
  };

  // Mouse down handler to show handles (avoids touch device conflicts)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowHandles();
  };


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

  // 娘の駒には特別な金箔グロー効果を適用
  const isSpecialPiece = 'isSpecial' in colorStyle && colorStyle.isSpecial;

  return (
    <div
      className={cn(
        'absolute border-[3px]',
        'flex items-center justify-center font-bold',
        'transition-all duration-200 ease-in-out',
        'touch-none', // Prevent default touch behaviors
        isSpecialPiece && 'kinpaku-glow'
      )}
      style={{
        ...style,
        fontFamily: 'var(--font-mincho)',
        borderRadius: '8px',
        // 漆塗り風の光沢感
        boxShadow: isSpecialPiece
          ? '0 0 20px rgba(199, 128, 45, 0.3), 0 0 40px rgba(199, 128, 45, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3)'
          : 'inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 3px 8px rgba(0, 0, 0, 0.25)',
        // 微かなグラデーションで立体感
        backgroundImage: isSpecialPiece
          ? 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)'
          : 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
        backgroundBlendMode: 'overlay'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* 駒の文字 */}
      <span
        style={{
          textShadow: isSpecialPiece
            ? '0 1px 2px rgba(0,0,0,0.3), 0 0 8px rgba(199, 128, 45, 0.3)'
            : '0 1px 1px rgba(0,0,0,0.2)',
          letterSpacing: '0.05em'
        }}
      >
        {renderText()}
      </span>

      {showHandles && movableDirections.map((direction) => (
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