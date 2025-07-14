import { describe, it, expect } from 'vitest'
import type { Piece, KeyboardMapping } from '../types/game'
import {
  updateKeyboardMapping,
  getSelectedPieceForDirection,
  cycleSelectedPiece,
  cycleAllDirections,
  resetKeyboardSelection,
  getKeyboardMappingForPiece
} from './keyboardMapping'

describe('Keyboard Mapping', () => {
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
      type: 'apprentice',
      position: { x: 1, y: 0 },
      size: { width: 1, height: 1 },
      name: 'apprentice2'
    },
    {
      id: 'piece3',
      type: 'father',
      position: { x: 0, y: 1 },
      size: { width: 1, height: 2 },
      name: 'father'
    }
  ]

  const mockMapping: KeyboardMapping = {
    up: ['piece1', 'piece2'],
    down: ['piece3'],
    left: [],
    right: ['piece1'],
    selectedIndex: {
      up: 0,
      down: 0,
      left: 0,
      right: 0
    }
  }

  describe('updateKeyboardMapping', () => {
    it('should create keyboard mapping from pieces', () => {
      const mapping = updateKeyboardMapping(mockPieces)
      
      expect(mapping).toHaveProperty('up')
      expect(mapping).toHaveProperty('down')
      expect(mapping).toHaveProperty('left')
      expect(mapping).toHaveProperty('right')
      expect(mapping).toHaveProperty('selectedIndex')
    })

    it('should prioritize last moved piece', () => {
      const mapping = updateKeyboardMapping(mockPieces, 'piece2')
      
      // If piece2 is in the up direction, it should be first
      if (mapping.up.includes('piece2')) {
        expect(mapping.up[0]).toBe('piece2')
        expect(mapping.selectedIndex.up).toBe(0)
      }
    })

    it('should not duplicate pieces in same direction', () => {
      const mapping = updateKeyboardMapping(mockPieces)
      
      Object.values(mapping).forEach(value => {
        if (Array.isArray(value)) {
          const unique = [...new Set(value)]
          expect(value).toEqual(unique)
        }
      })
    })
  })

  describe('getSelectedPieceForDirection', () => {
    it('should return selected piece for direction', () => {
      const selected = getSelectedPieceForDirection(mockMapping, 'up')
      expect(selected).toBe('piece1')
    })

    it('should return null for empty direction', () => {
      const selected = getSelectedPieceForDirection(mockMapping, 'left')
      expect(selected).toBeNull()
    })

    it('should return null for invalid index', () => {
      const invalidMapping = {
        ...mockMapping,
        selectedIndex: { ...mockMapping.selectedIndex, up: 10 }
      }
      const selected = getSelectedPieceForDirection(invalidMapping, 'up')
      expect(selected).toBeNull()
    })
  })

  describe('cycleSelectedPiece', () => {
    it('should cycle to next piece', () => {
      const cycled = cycleSelectedPiece(mockMapping, 'up')
      expect(cycled.selectedIndex.up).toBe(1)
    })

    it('should wrap around to first piece', () => {
      const wrappedMapping = {
        ...mockMapping,
        selectedIndex: { ...mockMapping.selectedIndex, up: 1 }
      }
      const cycled = cycleSelectedPiece(wrappedMapping, 'up')
      expect(cycled.selectedIndex.up).toBe(0)
    })

    it('should not change mapping with single piece', () => {
      const cycled = cycleSelectedPiece(mockMapping, 'down')
      expect(cycled.selectedIndex.down).toBe(0)
    })

    it('should not change mapping with no pieces', () => {
      const cycled = cycleSelectedPiece(mockMapping, 'left')
      expect(cycled.selectedIndex.left).toBe(0)
    })
  })

  describe('cycleAllDirections', () => {
    it('should cycle all directions with multiple pieces', () => {
      const cycled = cycleAllDirections(mockMapping)
      expect(cycled.selectedIndex.up).toBe(1) // Has 2 pieces, should cycle
      expect(cycled.selectedIndex.down).toBe(0) // Has 1 piece, should not cycle
      expect(cycled.selectedIndex.right).toBe(0) // Has 1 piece, should not cycle
    })

    it('should not change mapping when no direction has multiple pieces', () => {
      const singlePieceMapping = {
        ...mockMapping,
        up: ['piece1'],
        right: []
      }
      const cycled = cycleAllDirections(singlePieceMapping)
      expect(cycled.selectedIndex).toEqual(singlePieceMapping.selectedIndex)
    })
  })

  describe('resetKeyboardSelection', () => {
    it('should reset all selected indices to 0', () => {
      const modifiedMapping = {
        ...mockMapping,
        selectedIndex: { up: 1, down: 1, left: 1, right: 1 }
      }
      const reset = resetKeyboardSelection(modifiedMapping)
      
      expect(reset.selectedIndex).toEqual({
        up: 0,
        down: 0,
        left: 0,
        right: 0
      })
    })
  })

  describe('getKeyboardMappingForPiece', () => {
    it('should return directions for selected piece', () => {
      const directions = getKeyboardMappingForPiece(mockMapping, 'piece1')
      expect(directions).toContain('up')
      expect(directions).toContain('right')
    })

    it('should return empty array for unselected piece', () => {
      const directions = getKeyboardMappingForPiece(mockMapping, 'piece2')
      expect(directions).toEqual([])
    })

    it('should return empty array for non-existent piece', () => {
      const directions = getKeyboardMappingForPiece(mockMapping, 'nonexistent')
      expect(directions).toEqual([])
    })
  })
})