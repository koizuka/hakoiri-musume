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
          // WinModalが表示中の場合はESCキー処理をスキップ
          if (gameState.isWon) return;
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
          'relative wood-texture',
          'focus:outline-none focus:ring-2 focus:ring-kincha/50',
          'cursor-pointer'
        )}
        style={{
          ...boardStyle,
          // 漆塗り風の黒枠
          borderTop: '5px solid',
          borderLeft: '5px solid',
          borderRight: '5px solid',
          borderBottom: 'none',
          borderImage: 'linear-gradient(180deg, #2A1810 0%, #0D0500 40%, #1A0F00 70%, #2A1810 100%) 1',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
          // 深みのある影
          boxShadow: `
            inset 0 2px 4px rgba(255, 255, 255, 0.05),
            inset 0 -2px 4px rgba(0, 0, 0, 0.1),
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.2)
          `
        }}
        tabIndex={0}
        role="grid"
        aria-label="Game board"
      >

        {/* Bottom border sections - 漆塗り風 */}
        {/* Left section of bottom border */}
        <div
          className="absolute"
          style={{
            left: -5 + 10,
            bottom: -5,
            width: EXIT_POSITION.x * cellSize + leftOffset + 5 - 10,
            height: '5px',
            background: 'linear-gradient(180deg, #2A1810 0%, #0D0500 50%, #1A0F00 100%)',
            borderBottomLeftRadius: '10px'
          }}
        />

        {/* Exit section - 暖簾（のれん）風の出口 */}
        <div
          className="absolute"
          style={{
            left: EXIT_POSITION.x * cellSize + leftOffset,
            bottom: -2,
            width: EXIT_SIZE.width * cellSize,
            height: '2px',
            background: 'linear-gradient(90deg, var(--color-kincha) 0%, #D4A04A 50%, var(--color-kincha) 100%)',
            opacity: 0.6
          }}
        />

        {/* Right section of bottom border */}
        <div
          className="absolute"
          style={{
            left: (EXIT_POSITION.x + EXIT_SIZE.width) * cellSize + leftOffset,
            bottom: -5,
            width: BOARD_WIDTH * cellSize - (EXIT_POSITION.x + EXIT_SIZE.width) * cellSize - leftOffset + 5 - 10,
            height: '5px',
            background: 'linear-gradient(180deg, #2A1810 0%, #0D0500 50%, #1A0F00 100%)',
            borderBottomRightRadius: '10px'
          }}
        />

        {/* Exit area - 出口エリア */}
        <div
          className="absolute flex items-center justify-center z-0"
          style={exitStyle}
        >
          <span
            className="font-bold tracking-widest"
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '0.85rem',
              color: 'var(--color-kincha)',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              letterSpacing: '0.2em'
            }}
          >
            出口
          </span>
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
    </div>
  );
}