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
        <div className="text-lg font-semibold">
          手数: <span className="text-blue-600">{moves}</span>
        </div>
        
        {isWon && (
          <div className="text-green-600 font-bold text-lg">
            🎉 クリア！
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-8">
        <Button
          onClick={onUndo}
          disabled={!canUndo || isWon}
          variant={canUndo && !isWon ? "default" : "outline"}
          size="lg"
          className={cn(
            "mr-4",
            canUndo && !isWon 
              ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600" 
              : "bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-100"
          )}
        >
          <span>↶</span>
          アンドゥ (U)
        </Button>

        <Button
          onClick={onReset}
          variant="destructive"
          size="lg"
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <span>⟲</span>
          リセット
        </Button>
      </div>
    </div>
  );
}