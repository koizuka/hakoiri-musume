import { describe, it, expect } from 'vitest'
import type { Move, Piece, KeyboardMapping } from '../types/game'
import {
  isAutoUndo,
  executeUndo,
  addMoveToHistory,
  executeMoveWithUndo
} from './undoLogic'

describe('Undo Logic', () => {
  const mockPieces: Piece[] = [
    {
      id: 'piece1',
      type: 'apprentice',
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 },
      name: 'apprentice1'
    },
    {
      id: 'piece2',
      type: 'father',
      position: { x: 1, y: 1 },
      size: { width: 1, height: 2 },
      name: 'father'
    }
  ]

  const mockKeyboardMapping: KeyboardMapping = {
    up: [],
    down: [],
    left: [],
    right: ['piece1'],
    selectedIndex: {
      up: 0,
      down: 0,
      left: 0,
      right: 0
    }
  }

  const mockMove: Move = {
    pieceId: 'piece1',
    from: { x: 0, y: 0 },
    to: { x: 1, y: 0 },
    direction: 'right',
    keyboardMappingBefore: mockKeyboardMapping
  }

  const mockMoveHistory: Move[] = [mockMove]

  describe('isAutoUndo', () => {
    it('should detect auto-undo move', () => {
      const reverseMove: Move = {
        pieceId: 'piece1',
        from: { x: 1, y: 0 },
        to: { x: 0, y: 0 },
        direction: 'left',
        keyboardMappingBefore: mockKeyboardMapping
      }

      expect(isAutoUndo(mockMove, reverseMove)).toBe(true)
    })

    it('should not detect auto-undo for different piece', () => {
      const differentPieceMove: Move = {
        pieceId: 'piece2',
        from: { x: 1, y: 0 },
        to: { x: 0, y: 0 },
        direction: 'left',
        keyboardMappingBefore: mockKeyboardMapping
      }

      expect(isAutoUndo(mockMove, differentPieceMove)).toBe(false)
    })

    it('should not detect auto-undo for same direction', () => {
      const sameDirectionMove: Move = {
        pieceId: 'piece1',
        from: { x: 1, y: 0 },
        to: { x: 2, y: 0 },
        direction: 'right',
        keyboardMappingBefore: mockKeyboardMapping
      }

      expect(isAutoUndo(mockMove, sameDirectionMove)).toBe(false)
    })

    it('should not detect auto-undo for different positions', () => {
      const differentPositionMove: Move = {
        pieceId: 'piece1',
        from: { x: 2, y: 0 },
        to: { x: 1, y: 0 },
        direction: 'left',
        keyboardMappingBefore: mockKeyboardMapping
      }

      expect(isAutoUndo(mockMove, differentPositionMove)).toBe(false)
    })

    it('should return false when no last move', () => {
      const anyMove: Move = {
        pieceId: 'piece1',
        from: { x: 0, y: 0 },
        to: { x: 1, y: 0 },
        direction: 'right',
        keyboardMappingBefore: mockKeyboardMapping
      }

      expect(isAutoUndo(undefined, anyMove)).toBe(false)
    })
  })

  describe('executeUndo', () => {
    it('should undo last move', () => {
      const pieces = [
        {
          id: 'piece1',
          type: 'apprentice',
          position: { x: 1, y: 0 },
          size: { width: 1, height: 1 },
          name: 'apprentice1'
        }
      ] as Piece[]

      const result = executeUndo(pieces, mockMoveHistory)

      expect(result.moveHistory).toHaveLength(0)
      expect(result.moves).toBe(0)
      expect(result.pieces.find(p => p.id === 'piece1')?.position).toEqual({ x: 0, y: 0 })
    })

    it('should handle empty move history', () => {
      const result = executeUndo(mockPieces, [])

      expect(result.pieces).toEqual(mockPieces)
      expect(result.moveHistory).toEqual([])
      expect(result.moves).toBe(0)
    })

    it('should update move count correctly', () => {
      const multiMoveHistory = [mockMove, { ...mockMove, pieceId: 'piece2' }]
      const result = executeUndo(mockPieces, multiMoveHistory)

      expect(result.moves).toBe(1)
      expect(result.moveHistory).toHaveLength(1)
    })
  })

  describe('addMoveToHistory', () => {
    it('should add move to history', () => {
      const newHistory = addMoveToHistory(
        [],
        'piece1',
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        'right',
        mockKeyboardMapping
      )

      expect(newHistory).toHaveLength(1)
      expect(newHistory[0]).toEqual({
        pieceId: 'piece1',
        from: { x: 0, y: 0 },
        to: { x: 1, y: 0 },
        direction: 'right',
        keyboardMappingBefore: mockKeyboardMapping
      })
    })

    it('should preserve existing history', () => {
      const newHistory = addMoveToHistory(
        mockMoveHistory,
        'piece2',
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        'down',
        mockKeyboardMapping
      )

      expect(newHistory).toHaveLength(2)
      expect(newHistory[0]).toEqual(mockMove)
      expect(newHistory[1].pieceId).toBe('piece2')
    })
  })

  describe('executeMoveWithUndo', () => {
    it('should execute normal move', () => {
      const result = executeMoveWithUndo(mockPieces, [], 'piece1', 'right', mockKeyboardMapping)

      expect(result.wasAutoUndo).toBe(false)
      expect(result.moveHistory).toHaveLength(1)
      expect(result.moves).toBe(1)
      expect(result.pieces.find(p => p.id === 'piece1')?.position.x).toBe(1)
    })

    it('should execute auto-undo', () => {
      const piecesAfterMove = [
        {
          id: 'piece1',
          type: 'apprentice',
          position: { x: 1, y: 0 },
          size: { width: 1, height: 1 },
          name: 'apprentice1'
        },
        mockPieces[1]
      ] as Piece[]

      const result = executeMoveWithUndo(piecesAfterMove, mockMoveHistory, 'piece1', 'left', mockKeyboardMapping)

      expect(result.wasAutoUndo).toBe(true)
      expect(result.moveHistory).toHaveLength(0)
      expect(result.moves).toBe(0)
      expect(result.pieces.find(p => p.id === 'piece1')?.position).toEqual({ x: 0, y: 0 })
    })

    it('should handle invalid piece id', () => {
      const result = executeMoveWithUndo(mockPieces, [], 'nonexistent', 'right', mockKeyboardMapping)

      expect(result.pieces).toEqual(mockPieces)
      expect(result.moveHistory).toEqual([])
      expect(result.moves).toBe(0)
      expect(result.wasAutoUndo).toBe(false)
    })

    it('should update move count correctly for normal moves', () => {
      const initialHistory = [mockMove]
      const result = executeMoveWithUndo(mockPieces, initialHistory, 'piece2', 'down', mockKeyboardMapping)

      expect(result.moves).toBe(2)
      expect(result.moveHistory).toHaveLength(2)
    })
  })
})