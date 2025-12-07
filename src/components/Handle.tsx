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
        'flex items-center justify-center',
        'font-bold',
        'z-20',
        'rounded-full',
        className
      )}
      style={{
        ...getPositionStyle(),
        // 選択時は金茶、通常時は銀鼠
        backgroundColor: isSelected ? 'var(--color-kincha)' : 'var(--color-ginnezu)',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isSelected ? '#9A6520' : '#6B7280',
        color: isSelected ? '#FFF8F0' : '#F5F5F5',
        // 和風の柔らかい影
        boxShadow: isSelected
          ? '0 0 12px rgba(199, 128, 45, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          : '0 2px 6px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        opacity: isSelected ? 1 : 0.85
      }}
      onClick={onClick}
      onTouchStart={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget;
        target.style.transform = getPositionStyle().transform + ' scale(1.1)';
        target.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.transform = getPositionStyle().transform || '';
        target.style.opacity = isSelected ? '1' : '0.85';
      }}
      aria-label={`Move ${direction}`}
    >
      <span
        style={{
          fontWeight: '700',
          textShadow: isSelected
            ? '0 1px 2px rgba(0, 0, 0, 0.4)'
            : '0 1px 1px rgba(0, 0, 0, 0.3)',
          fontSize: '1.1rem',
          opacity: isSelected ? 1 : 0.7
        }}
      >
        {ARROW_ICONS[direction]}
      </span>
    </button>
  );
}