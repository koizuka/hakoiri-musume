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
        <div className="text-lg font-semibold text-stone-800">
          手数: <span className="text-blue-700 font-bold">{moves}</span>
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
          disabled={!canUndo}
          variant={canUndo ? "default" : "outline"}
          size="lg"
          className={cn(
            "mr-4",
            canUndo ? "border-2 border-black" : ""
          )}
        >
          <span>↶</span>
          アンドゥ (U)
        </Button>

        <Button
          onClick={onReset}
          variant="default"
          size="lg"
          className="border-2 border-black"
        >
          <span>⟲</span>
          リセット
        </Button>
      </div>
    </div>
  );
}