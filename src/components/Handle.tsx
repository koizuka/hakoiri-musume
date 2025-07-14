import type { Direction } from '../types/game';
import { cn } from '../lib/utils';

interface HandleProps {
  direction: Direction;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

const HANDLE_STYLES = {
  up: 'absolute w-8 h-8',
  down: 'absolute w-8 h-8', 
  left: 'absolute w-8 h-8',
  right: 'absolute w-8 h-8'
};

const ARROW_ICONS = {
  up: '▲',
  down: '▼',
  left: '◀',
  right: '▶'
};

export function Handle({ direction, isSelected, onClick, className }: HandleProps) {
  const getPositionStyle = () => {
    switch (direction) {
      case 'up':
        return { 
          top: '-12px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: '32px',
          height: '32px'
        };
      case 'down':
        return { 
          bottom: '-12px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: '32px',
          height: '32px'
        };
      case 'left':
        return { 
          left: '-12px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          width: '32px',
          height: '32px'
        };
      case 'right':
        return { 
          right: '-12px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          width: '32px',
          height: '32px'
        };
    }
  };

  return (
    <button
      className={cn(
        HANDLE_STYLES[direction],
        'cursor-pointer transition-all duration-200 ease-in-out',
        'shadow-lg',
        isSelected ? 'border-2 border-amber-600' : 'border-2 border-stone-400',
        'flex items-center justify-center',
        'font-black text-lg',
        isSelected ? 'text-stone-700' : 'text-stone-600',
        'z-20',
        isSelected 
          ? 'bg-amber-200 hover:bg-amber-300 opacity-100'
          : 'bg-stone-200 hover:bg-stone-300 active:bg-stone-400 opacity-100',
        className
      )}
      style={getPositionStyle()}
      onClick={onClick}
      onTouchStart={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={`Move ${direction}`}
    >
      <span 
        className={cn(
          'transition-opacity duration-200',
          isSelected ? 'opacity-100' : 'opacity-40'
        )}
        style={{
          fontWeight: '900',
          textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
          fontSize: '1.25rem'
        }}
      >
        {ARROW_ICONS[direction]}
      </span>
    </button>
  );
}