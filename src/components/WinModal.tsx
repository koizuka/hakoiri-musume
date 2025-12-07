import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { cn } from '../lib/utils';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  onReset: () => void;
  onClose: () => void;
}

export function WinModal({ isOpen, moves, onReset, onClose }: WinModalProps) {
  // 和風ボタンスタイル
  const buttonStyle = {
    fontFamily: 'var(--font-mincho)',
    borderRadius: '6px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: 500,
    letterSpacing: '0.08em',
    transition: 'all 0.2s ease',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-md bg-kinari dark:bg-kogecha"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.stopPropagation()}
        style={{
          fontFamily: 'var(--font-mincho)',
          border: '4px solid var(--color-kincha)',
          borderRadius: '12px',
          boxShadow: '0 0 30px rgba(199, 128, 45, 0.2), 0 10px 40px rgba(0, 0, 0, 0.3)',
          padding: '2rem'
        }}
      >
        <DialogHeader>
          <div className="text-center">
            {/* 祝の文字 - 装飾的な和風表現 */}
            <div
              className="mb-4"
              style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                color: 'var(--color-benihi)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.15), 0 0 20px rgba(197, 61, 67, 0.2)',
                letterSpacing: '0.1em'
              }}
            >
              祝
            </div>

            <DialogTitle
              className="mb-4 text-sumi dark:text-kinari"
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '0.15em'
              }}
            >
              成功でございます
            </DialogTitle>

            <p
              className="mb-6 text-nibiiro dark:text-ginnezu"
              style={{
                fontSize: '1rem',
                lineHeight: 1.8
              }}
            >
              箱入り娘を
              <span
                className="text-konjo dark:text-kincha"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  margin: '0 0.25rem'
                }}
              >
                {moves}
              </span>
              手にてお救い致しました
            </p>

            {/* 装飾線 */}
            <div
              className="mx-auto mb-6"
              style={{
                width: '60%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--color-kincha), transparent)'
              }}
            />
          </div>
        </DialogHeader>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onReset}
            style={{
              ...buttonStyle,
              backgroundColor: 'var(--color-benihi)',
              color: '#FFF8F0',
              border: '2px solid var(--color-benihi-dark)',
              boxShadow: '0 3px 8px rgba(197, 61, 67, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            className={cn('hover:opacity-90 active:translate-y-px')}
          >
            再挑戦
          </button>

          <button
            onClick={onClose}
            autoFocus
            className={cn(
              'hover:opacity-90 active:translate-y-px',
              'bg-kinari dark:bg-kogecha-light text-sumi dark:text-kinari',
              'border-2 border-kokutan dark:border-kincha'
            )}
            style={{
              ...buttonStyle,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
            }}
          >
            閉じる
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}