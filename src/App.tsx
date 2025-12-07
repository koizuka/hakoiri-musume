import { useState, useEffect, useRef } from 'react'
import { useGameEngine } from './hooks/useGameEngine'
import { GameBoard } from './components/GameBoard'
import { GameControls } from './components/GameControls'
import { WinModal } from './components/WinModal'
import { Kbd } from './components/Kbd'
import { Github } from 'lucide-react'

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowWinModal(true)
    }

    prevIsWonRef.current = gameState.isWon
  }, [gameState.isWon])

  return (
    <div className="min-h-screen washi-bg py-8 transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        {/* タイトル - 書道風 */}
        <h1
          className="text-center mb-10 text-sumi dark:text-kinari"
          style={{
            fontFamily: 'var(--font-mincho)',
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <span
            className="inline-block pb-2"
            style={{
              borderBottom: '3px solid var(--color-kincha)',
              paddingLeft: '0.5em',
              paddingRight: '0.5em'
            }}
          >
            箱入り娘
          </span>
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
          
          {/* Instructions - 操作説明 */}
          <div
            className="text-center max-w-2xl text-nibiiro dark:text-ginnezu"
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '0.875rem'
            }}
          >
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
              <span className="flex items-center gap-2">
                <Kbd>↑</Kbd><Kbd>↓</Kbd><Kbd>←</Kbd><Kbd>→</Kbd>
                <span>駒を移動</span>
              </span>
              <span className="flex items-center gap-2">
                <Kbd>Space</Kbd>
                <span>候補切替</span>
              </span>
              <span className="flex items-center gap-2">
                <Kbd>U</Kbd>
                <span>一手戻す</span>
              </span>
              <span className="flex items-center gap-2">
                <Kbd>ESC</Kbd>
                <span>最初から</span>
              </span>
            </div>
            <p className="mt-3 opacity-80">または、駒の矢印をクリック</p>
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

      {/* GitHub Link - 和風スタイル */}
      <footer className="fixed bottom-4 right-4">
        <a
          href="https://github.com/koizuka/hakoiri-musume"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs transition-colors opacity-60 hover:opacity-100 text-nibiiro dark:text-ginnezu"
          style={{
            fontFamily: 'var(--font-mincho)'
          }}
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </a>
      </footer>
    </div>
  )
}

export default App
