import { describe, it, expect } from 'vitest'
import { canMovePiece, movePiece, checkWinCondition, getNewPosition } from './gameLogic'
import { initialPieces } from './gameData'

describe('Game Logic', () => {
  it('should calculate new position correctly', () => {
    expect(getNewPosition({ x: 1, y: 1 }, 'up')).toEqual({ x: 1, y: 0 })
    expect(getNewPosition({ x: 1, y: 1 }, 'down')).toEqual({ x: 1, y: 2 })
    expect(getNewPosition({ x: 1, y: 1 }, 'left')).toEqual({ x: 0, y: 1 })
    expect(getNewPosition({ x: 1, y: 1 }, 'right')).toEqual({ x: 2, y: 1 })
  })

  it('should detect valid moves', () => {
    // In initial position, apprentice2 at (1,3) can move down to (1,4)
    expect(canMovePiece(initialPieces, 'apprentice2', 'down')).toBe(true)
    
    // Father cannot move right (blocked by daughter)
    expect(canMovePiece(initialPieces, 'father', 'right')).toBe(false)
    
    // Daughter cannot move up (out of bounds)
    expect(canMovePiece(initialPieces, 'daughter', 'up')).toBe(false)
  })

  it('should move pieces correctly', () => {
    const newPieces = movePiece(initialPieces, 'apprentice2', 'down')
    const movedPiece = newPieces.find(p => p.id === 'apprentice2')
    
    expect(movedPiece?.position).toEqual({ x: 1, y: 4 })
  })

  it('should detect win condition', () => {
    // Initial position should not be won
    expect(checkWinCondition(initialPieces)).toBe(false)
    
    // Move daughter to winning position
    const winningPieces = initialPieces.map(piece => 
      piece.id === 'daughter' 
        ? { ...piece, position: { x: 1, y: 3 } }
        : piece
    )
    
    expect(checkWinCondition(winningPieces)).toBe(true)
  })
})