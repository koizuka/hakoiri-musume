import { cn } from '../lib/utils';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  onReset: () => void;
  onClose: () => void;
}

export function WinModal({ isOpen, moves, onReset, onClose }: WinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            おめでとうございます！
          </h2>
          <p className="text-gray-700 mb-6">
            箱入り娘を{moves}手でクリアしました！
          </p>
          
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
              className={cn(
                'px-6 py-3 rounded-lg font-medium transition-colors',
                'bg-gray-500 text-white hover:bg-gray-600',
                'border-2 border-gray-600'
              )}
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}