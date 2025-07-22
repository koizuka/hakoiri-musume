import { useState, useEffect, useRef } from 'react'
import { useGameEngine } from './hooks/useGameEngine'
import { GameBoard } from './components/GameBoard'
import { GameControls } from './components/GameControls'
import { WinModal } from './components/WinModal'
import { Kbd } from './components/Kbd'

function App() {
  const [showWinModal, setShowWinModal] = useState(false)
  const {
    gameState,
    movePiece,
    undoMove,
    resetGame,
    moveSelectedPiece,
    cycleSelection,
    showHandles,
    hideHandles,
    showHandlesFunc,
    toggleHandles,
    clearWinState
  } = useGameEngine()

  const handleReset = () => {
    resetGame()
    setShowWinModal(false)
  }

  // Show win modal when game is won
  const prevIsWonRef = useRef(false)
  
  useEffect(() => {
    if (gameState.isWon && !prevIsWonRef.current) {
      setShowWinModal(true)
    }
    
    prevIsWonRef.current = gameState.isWon
  }, [gameState.isWon])

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          箱入り娘
        </h1>
        
        <div className="flex flex-col items-center gap-8">
          <GameBoard
            gameState={gameState}
            onMove={movePiece}
            onKeyboardMove={moveSelectedPiece}
            onCycleSelection={cycleSelection}
            onUndo={undoMove}
            onReset={handleReset}
            showHandles={showHandles}
            onHideHandles={hideHandles}
            onShowHandles={showHandlesFunc}
            onToggleHandles={toggleHandles}
          />
          
          <GameControls
            moves={gameState.moves}
            canUndo={gameState.moveHistory.length > 0}
            isWon={gameState.isWon}
            onUndo={undoMove}
            onReset={handleReset}
          />
          
          {/* Instructions */}
          <div className="text-sm text-gray-600 text-center max-w-2xl">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
              <span className="flex items-center gap-2">
                <Kbd>↑</Kbd><Kbd>↓</Kbd><Kbd>←</Kbd><Kbd>→</Kbd>
                <span>駒を移動</span>
              </span>
              <span className="flex items-center gap-2">
                <Kbd>Space</Kbd>
                <span>候補切り替え</span>
              </span>
              <span className="flex items-center gap-2">
                <Kbd>U</Kbd>
                <span>アンドゥ</span>
              </span>
              <span className="flex items-center gap-2">
                <Kbd>ESC</Kbd>
                <span>リセット</span>
              </span>
            </div>
            <p className="mt-2">または、駒の矢印をクリックして移動</p>
          </div>
        </div>
      </div>

      <WinModal
        isOpen={showWinModal}
        moves={gameState.moves}
        onReset={handleReset}
        onClose={() => {
          setShowWinModal(false);
          clearWinState();
        }}
      />
    </div>
  )
}

export default App
