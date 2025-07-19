import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'
import { useGameEngine } from './hooks/useGameEngine'
import type { GameState } from './types/game'

// Mock useGameEngine hook
vi.mock('./hooks/useGameEngine')

const mockUseGameEngine = vi.mocked(useGameEngine)

describe('App WinModal Display Logic', () => {
  const mockGameState: GameState = {
    pieces: [],
    moves: 10,
    moveHistory: [],
    keyboardMapping: {
      up: [],
      down: [],
      left: [],
      right: [],
      selectedIndex: { up: 0, down: 0, left: 0, right: 0 }
    },
    isWon: false
  }

  const mockGameEngine = {
    gameState: mockGameState,
    movePiece: vi.fn(),
    undoMove: vi.fn(),
    resetGame: vi.fn(),
    moveSelectedPiece: vi.fn(),
    cycleSelection: vi.fn(),
    showHandles: true,
    hideHandles: vi.fn(),
    showHandlesFunc: vi.fn(),
    toggleHandles: vi.fn(),
    clearWinState: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGameEngine.mockReturnValue(mockGameEngine)
  })

  it('should handle WinModal display logic correctly', async () => {
    const { rerender } = render(<App />)
    
    // Initial state: isWon = false, modal should not be visible
    expect(screen.queryByText('おめでとうございます！')).not.toBeInTheDocument()

    // First win: isWon = false -> true, modal should appear
    mockUseGameEngine.mockReturnValue({
      ...mockGameEngine,
      gameState: {
        ...mockGameState,
        isWon: true
      }
    })
    
    rerender(<App />)
    expect(screen.getByText('おめでとうございます！')).toBeInTheDocument()
    expect(screen.getByText('閉じる')).toBeInTheDocument()
    expect(screen.getByText('もう一度プレイ')).toBeInTheDocument()
    
    // Close modal: isWon remains true but modal should be hidden
    fireEvent.click(screen.getByText('閉じる'))
    await waitFor(() => {
      expect(screen.queryByText('おめでとうございます！')).not.toBeInTheDocument()
    }, { timeout: 500 })
    
    // Game continues: isWon = true -> false, modal should stay hidden
    mockUseGameEngine.mockReturnValue({
      ...mockGameEngine,
      gameState: {
        ...mockGameState,
        isWon: false
      }
    })
    
    rerender(<App />)
    expect(screen.queryByText('おめでとうございます！')).not.toBeInTheDocument()
    
    // Second win: isWon = false -> true, modal should appear again
    mockUseGameEngine.mockReturnValue({
      ...mockGameEngine,
      gameState: {
        ...mockGameState,
        isWon: true
      }
    })
    
    rerender(<App />)
    expect(screen.getByText('おめでとうございます！')).toBeInTheDocument()
  })

  it('should show WinModal when isWon is true on initial render', () => {
    // Initial render with isWon already true
    // Since prevIsWonRef starts as false, this should trigger modal display
    mockUseGameEngine.mockReturnValue({
      ...mockGameEngine,
      gameState: {
        ...mockGameState,
        isWon: true
      }
    })

    render(<App />)
    
    // Should show modal because prevIsWonRef.current starts as false
    expect(screen.getByText('おめでとうございます！')).toBeInTheDocument()
  })

  it('should call resetGame when "もう一度プレイ" button is clicked', () => {
    mockUseGameEngine.mockReturnValue({
      ...mockGameEngine,
      gameState: {
        ...mockGameState,
        isWon: true
      }
    })

    render(<App />)
    
    fireEvent.click(screen.getByText('もう一度プレイ'))
    
    expect(mockGameEngine.resetGame).toHaveBeenCalled()
  })
})