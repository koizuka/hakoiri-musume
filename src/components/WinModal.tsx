import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { cn } from '../lib/utils';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  onReset: () => void;
  onClose: () => void;
}

export function WinModal({ isOpen, moves, onReset, onClose }: WinModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-md" 
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <DialogTitle className="text-2xl font-bold text-green-600 mb-4">
              おめでとうございます！
            </DialogTitle>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              箱入り娘を{moves}手でクリアしました！
            </p>
          </div>
        </DialogHeader>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={onReset}
            className={cn(
              'px-6 py-3 rounded-lg font-medium transition-colors',
              'bg-blue-500 text-white hover:bg-blue-600',
              'border-2 border-blue-600'
            )}
          >
            もう一度プレイ
          </button>
          
          <button
            onClick={onClose}
            autoFocus
            className={cn(
              'px-6 py-3 rounded-lg font-medium transition-colors',
              'bg-gray-500 text-white hover:bg-gray-600',
              'border-2 border-gray-600'
            )}
          >
            閉じる
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}