import { cn } from '../lib/utils';

interface GameControlsProps {
  moves: number;
  canUndo: boolean;
  isWon: boolean;
  onUndo: () => void;
  onReset: () => void;
}

export function GameControls({ moves, canUndo, isWon, onUndo, onReset }: GameControlsProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      {/* 手数表示 - 筆文字風 */}
      <div
        className="flex items-baseline gap-3"
        style={{ fontFamily: 'var(--font-mincho)' }}
      >
        <span className="text-nibiiro dark:text-ginnezu text-base tracking-wide">
          手数
        </span>
        <span
          className="text-konjo dark:text-kincha"
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}
        >
          {moves}
        </span>
        <span className="text-nibiiro dark:text-ginnezu text-sm">
          手
        </span>

        {isWon && (
          <span
            className="ml-4 text-wakatake"
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              letterSpacing: '0.15em'
            }}
          >
            成功！
          </span>
        )}
      </div>

      {/* ボタン */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onReset}
          disabled={!canUndo}
          className={cn(
            'flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium tracking-wide transition-all',
            canUndo
              ? 'bg-kinari dark:bg-kogecha text-sumi dark:text-kinari border-2 border-kokutan dark:border-kincha shadow-md hover:opacity-90 active:translate-y-px'
              : 'bg-shironeri dark:bg-kogecha/50 text-ginnezu border-2 border-ginnezu dark:border-ginnezu/50 opacity-50 cursor-not-allowed'
          )}
          style={{ fontFamily: 'var(--font-mincho)' }}
        >
          <span style={{ fontSize: '1.1rem' }}>⟲</span>
          <span>最初から</span>
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            'flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium tracking-wide transition-all',
            canUndo
              ? 'bg-kinari dark:bg-kogecha text-sumi dark:text-kinari border-2 border-kokutan dark:border-kincha shadow-md hover:opacity-90 active:translate-y-px'
              : 'bg-shironeri dark:bg-kogecha/50 text-ginnezu border-2 border-ginnezu dark:border-ginnezu/50 opacity-50 cursor-not-allowed'
          )}
          style={{ fontFamily: 'var(--font-mincho)' }}
        >
          <span style={{ fontSize: '1.1rem' }}>↶</span>
          <span>一手戻す</span>
        </button>
      </div>
    </div>
  );
}