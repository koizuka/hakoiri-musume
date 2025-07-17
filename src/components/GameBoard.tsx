import { useEffect, useRef } from 'react';
import type { GameState, Direction } from '../types/game';
import { BOARD_WIDTH, BOARD_HEIGHT, EXIT_POSITION, EXIT_SIZE } from '../types/game';
import { Piece } from './Piece';
import { getAllMovableDirections } from '../lib/gameLogic';
import { getKeyboardMappingForPiece } from '../lib/keyboardMapping';
import { cn } from '../lib/utils';

interface GameBoardProps {
  gameState: GameState;
  onMove: (pieceId: string, direction: Direction) => void;
  onKeyboardMove: (direction: Direction) => void;
  onCycleSelection: () => void;
  onUndo: () => void;
  onReset: () => void;
  showHandles: boolean;
  onHideHandles: () => void;
  onShowHandles: () => void;
  onToggleHandles: () => void;
  cellSize?: number;
}

export function GameBoard({ 
  gameState, 
  onMove, 
  onKeyboardMove, 
  onCycleSelection, 
  onUndo,
  onReset,
  showHandles,
  onHideHandles,
  onShowHandles,
  onToggleHandles,
  cellSize = 80 
}: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const movableDirections = getAllMovableDirections(gameState.pieces);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.isWon) return;
      
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onKeyboardMove('up');
          break;
        case 'ArrowDown':
          event.preventDefault();
          onKeyboardMove('down');
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onKeyboardMove('left');
          break;
        case 'ArrowRight':
          event.preventDefault();
          onKeyboardMove('right');
          break;
        case ' ':
          event.preventDefault();
          onCycleSelection();
          break;
        case 'u':
        case 'U':
          event.preventDefault();
          onUndo();
          break;
        case 'Escape':
          event.preventDefault();
          onReset();
          break;
        case 'h':
        case 'H':
          event.preventDefault();
          onToggleHandles();
          break;
      }
    };

    // Focus the board to capture keyboard events
    if (boardRef.current) {
      boardRef.current.focus();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.isWon, onKeyboardMove, onCycleSelection, onUndo, onReset, onToggleHandles]);

  const boardStyle = {
    width: BOARD_WIDTH * cellSize,
    height: BOARD_HEIGHT * cellSize,
  };

  const leftOffset = -3; // Move elements left slightly
  const topOffset = -3; // Move elements up slightly
  const exitStyle = {
    left: EXIT_POSITION.x * cellSize + leftOffset,
    top: EXIT_POSITION.y * cellSize + topOffset,
    width: EXIT_SIZE.width * cellSize,
    height: EXIT_SIZE.height * cellSize,
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={boardRef}
        className={cn(
          'relative bg-stone-100 border-4 border-black',
          'focus:outline-none',
          'cursor-pointer'
        )}
        style={{
          ...boardStyle,
          borderTop: '4px solid #374151',
          borderLeft: '4px solid #374151', 
          borderRight: '4px solid #374151',
          borderBottom: 'none',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px'
        }}
        tabIndex={0}
        role="grid"
        aria-label="Game board"
      >

        {/* Bottom border sections */}
        {/* Left section of bottom border - thick */}
        <div
          className="absolute"
          style={{
            left: -4 + 12,
            bottom: -4,
            width: EXIT_POSITION.x * cellSize + leftOffset + 4 - 12,
            height: '4px',
            backgroundColor: '#374151',
            borderBottomLeftRadius: '12px'
          }}
        />
        
        {/* Exit section of bottom border - thin */}
        <div
          className="absolute"
          style={{
            left: EXIT_POSITION.x * cellSize + leftOffset,
            bottom: -1,
            width: EXIT_SIZE.width * cellSize,
            height: '1px',
            backgroundColor: '#374151'
          }}
        />
        
        {/* Right section of bottom border - thick */}
        <div
          className="absolute"
          style={{
            left: (EXIT_POSITION.x + EXIT_SIZE.width) * cellSize + leftOffset,
            bottom: -4,
            width: BOARD_WIDTH * cellSize - (EXIT_POSITION.x + EXIT_SIZE.width) * cellSize - leftOffset + 4 - 12,
            height: '4px',
            backgroundColor: '#374151',
            borderBottomRightRadius: '12px'
          }}
        />
        
        {/* Exit area */}
        <div
          className="absolute flex items-center justify-center z-0"
          style={exitStyle}
        >
          <span className="text-emerald-800 font-bold text-sm">出口</span>
        </div>

        {/* Pieces */}
        {gameState.pieces.map((piece) => {
          const pieceMovableDirections = movableDirections
            .filter(md => md.pieceId === piece.id)
            .map(md => md.direction);
          
          const selectedDirections = getKeyboardMappingForPiece(
            gameState.keyboardMapping,
            piece.id
          );

          return (
            <Piece
              key={piece.id}
              piece={piece}
              movableDirections={pieceMovableDirections}
              selectedDirections={selectedDirections}
              onMove={(direction) => onMove(piece.id, direction)}
              cellSize={cellSize}
              showHandles={showHandles}
              onHideHandles={onHideHandles}
              onShowHandles={onShowHandles}
            />
          );
        })}
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 text-center max-w-2xl">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>矢印キー: 駒を移動</span>
          <span>スペース: 候補切り替え</span>
          <span>U: アンドゥ</span>
          <span>ESC: リセット</span>
        </div>
        <p className="mt-2">または、駒の矢印をクリックして移動</p>
      </div>
    </div>
  );
}