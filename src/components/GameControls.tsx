import { cn } from '../lib/utils';
import Button from './ui/button';

interface GameControlsProps {
  moves: number;
  canUndo: boolean;
  isWon: boolean;
  onUndo: () => void;
  onReset: () => void;
}

export function GameControls({ moves, canUndo, isWon, onUndo, onReset }: GameControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <div className="text-lg font-semibold text-stone-800 dark:text-stone-200">
          手数: <span className="text-blue-700 dark:text-blue-400 font-bold">{moves}</span>
        </div>
        
        {isWon && (
          <div className="text-green-600 dark:text-green-400 font-bold text-lg">
            🎉 クリア！
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-8">
        <Button
          onClick={onReset}
          disabled={!canUndo}
          variant={canUndo ? "default" : "outline"}
          size="lg"
          className={cn(
            canUndo ? "border-2 border-black dark:border-gray-300 bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600" : "dark:border-gray-600 dark:text-gray-400"
          )}
        >
          <span>⟲</span>
          リセット
        </Button>

        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant={canUndo ? "default" : "outline"}
          size="lg"
          className={cn(
            canUndo ? "border-2 border-black dark:border-gray-300 bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600" : "dark:border-gray-600 dark:text-gray-400"
          )}
        >
          <span>↶</span>
          アンドゥ (U)
        </Button>
      </div>
    </div>
  );
}