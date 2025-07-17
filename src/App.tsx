import { useState, useEffect, useRef } from 'react'
import { useGameEngine } from './hooks/useGameEngine'
import { GameBoard } from './components/GameBoard'
import { GameControls } from './components/GameControls'
import { WinModal } from './components/WinModal'

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
    toggleHandles
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
          <GameControls
            moves={gameState.moves}
            canUndo={gameState.moveHistory.length > 0}
            isWon={gameState.isWon}
            onUndo={undoMove}
            onReset={handleReset}
          />
          
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
        </div>
      </div>

      <WinModal
        isOpen={showWinModal}
        moves={gameState.moves}
        onReset={handleReset}
        onClose={() => setShowWinModal(false)}
      />
    </div>
  )
}

export default App
