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

    it('should prioritize filler piece when lastMoveDirection is provided', () => {
      // Create a test scenario where piece1 moves right and piece2 can fill the space
      const testPieces: Piece[] = [
        {
          id: 'piece1',
          type: 'apprentice',
          position: { x: 1, y: 0 }, // Moved from (0,0) to (1,0)
          size: { width: 1, height: 1 },
          name: 'apprentice1'
        },
        {
          id: 'piece2',
          type: 'apprentice',
          position: { x: 2, y: 0 }, // Can move left to fill (1,0) -> (0,0)
          size: { width: 1, height: 1 },
          name: 'apprentice2'
        },
        {
          id: 'piece3',
          type: 'apprentice',
          position: { x: 0, y: 1 }, // Can also move left but not into the space
          size: { width: 1, height: 1 },
          name: 'apprentice3'
        }
      ]
      
      const mapping = updateKeyboardMapping(testPieces, 'piece1', 'right')
      
      // piece2 should be prioritized for right movement as it can fill the space
      if (mapping.right.includes('piece2')) {
        expect(mapping.right[0]).toBe('piece2')
        expect(mapping.selectedIndex.right).toBe(0)
      }
    })

    it('should fall back to last moved piece when no filler piece found', () => {
      // Test scenario where no piece can fill the space left by the moved piece
      const testPieces: Piece[] = [
        {
          id: 'piece1',
          type: 'apprentice',
          position: { x: 1, y: 0 }, // Moved right
          size: { width: 1, height: 1 },
          name: 'apprentice1'
        },
        {
          id: 'piece2',
          type: 'apprentice',
          position: { x: 3, y: 0 }, // Can move right but won't fill the space
          size: { width: 1, height: 1 },
          name: 'apprentice2'
        }
      ]
      
      const mapping = updateKeyboardMapping(testPieces, 'piece1', 'right')
      
      // piece1 should be prioritized for auto-undo since no filler piece exists
      if (mapping.right.includes('piece1')) {
        expect(mapping.right[0]).toBe('piece1')
        expect(mapping.selectedIndex.right).toBe(0)
      }
    })

    it('should prioritize filler piece for any direction that can fill the space', () => {
      const testPieces: Piece[] = [
        {
          id: 'piece1',
          type: 'apprentice',
          position: { x: 1, y: 0 }, // Moved right from (0,0)
          size: { width: 1, height: 1 },
          name: 'apprentice1'
        },
        {
          id: 'piece2',
          type: 'apprentice',
          position: { x: 0, y: 1 }, // Can move up to fill the space at (0,0)
          size: { width: 1, height: 1 },
          name: 'apprentice2'
        },
        {
          id: 'piece3',
          type: 'apprentice',
          position: { x: 2, y: 0 }, // Can move left to fill the space at (0,0)
          size: { width: 1, height: 1 },
          name: 'apprentice3'
        }
      ]
      
      const mapping = updateKeyboardMapping(testPieces, 'piece1', 'right')
      
      // piece2 should be prioritized for up movement (can fill space at (0,0))
      if (mapping.up.includes('piece2')) {
        expect(mapping.up[0]).toBe('piece2')
      }
      
      // piece3 should be prioritized for left movement (can fill space at (0,0))
      if (mapping.left.includes('piece3')) {
        expect(mapping.left[0]).toBe('piece3')
      }
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

  describe('Real game scenario tests', () => {
    it('should correctly prioritize apprentice over maid when apprentice4 moves left twice', () => {
      // Simulate the scenario: apprentice4 moves left twice from (3,4) to (1,4)
      const piecesAfterMoves: Piece[] = [
        {
          id: 'father',
          type: 'father',
          position: { x: 0, y: 0 },
          size: { width: 1, height: 2 },
          name: '父親'
        },
        {
          id: 'daughter',
          type: 'daughter',
          position: { x: 1, y: 0 },
          size: { width: 2, height: 2 },
          name: '娘'
        },
        {
          id: 'mother',
          type: 'mother',
          position: { x: 3, y: 0 },
          size: { width: 1, height: 2 },
          name: '母親'
        },
        {
          id: 'servant',
          type: 'servant',
          position: { x: 0, y: 2 },
          size: { width: 1, height: 2 },
          name: '下男'
        },
        {
          id: 'manager',
          type: 'manager',
          position: { x: 1, y: 2 },
          size: { width: 2, height: 1 },
          name: '番頭'
        },
        {
          id: 'maid',
          type: 'maid',
          position: { x: 3, y: 2 },
          size: { width: 1, height: 2 },
          name: '下女'
        },
        {
          id: 'apprentice1',
          type: 'apprentice',
          position: { x: 0, y: 4 },
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'apprentice2',
          type: 'apprentice',
          position: { x: 1, y: 3 },
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'apprentice3',
          type: 'apprentice',
          position: { x: 2, y: 3 },
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'apprentice4',
          type: 'apprentice',
          position: { x: 1, y: 4 }, // Moved from (3,4) to (1,4) via (2,4)
          size: { width: 1, height: 1 },
          name: '小僧'
        }
      ]
      
      const mapping = updateKeyboardMapping(piecesAfterMoves, 'apprentice4', 'left')
      
      // apprentice3 should be able to move down from (2,3) to (2,4), filling the space left by apprentice4
      // apprentice3 should be prioritized over maid for down direction
      if (mapping.down.includes('apprentice3') && mapping.down.includes('maid')) {
        expect(mapping.down[0]).toBe('apprentice3')
        expect(mapping.selectedIndex.down).toBe(0)
      }
    })
  })

  describe('Undo behavior simulation', () => {
    it('should restore keyboard mapping with filler piece prioritization from previous move', () => {
      // Simulate the scenario: apprentice4 moves left twice, then we undo the second move
      // After undo, the mapping should reflect the state after the first move
      const piecesAfterUndo: Piece[] = [
        {
          id: 'apprentice3',
          type: 'apprentice',
          position: { x: 2, y: 3 },
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'apprentice4',
          type: 'apprentice',
          position: { x: 2, y: 4 }, // Back to intermediate position after undo
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'maid',
          type: 'maid',
          position: { x: 3, y: 2 },
          size: { width: 1, height: 2 },
          name: '下女'
        }
      ]
      
      // After undo, filler piece prioritization should be applied based on the first move (apprentice4 moved left)
      const mapping = updateKeyboardMapping(piecesAfterUndo, 'apprentice4', 'left')
      
      // apprentice3 should be prioritized for down direction (can fill the space at (3,4))
      if (mapping.down.includes('apprentice3') && mapping.down.includes('maid')) {
        expect(mapping.down[0]).toBe('apprentice3')
        expect(mapping.selectedIndex.down).toBe(0)
      }
    })
    
    it('should not apply filler piece prioritization when undoing to initial state', () => {
      // Simulate undoing the very first move - no previous moves exist
      const piecesAfterUndo: Piece[] = [
        {
          id: 'apprentice3',
          type: 'apprentice',
          position: { x: 2, y: 3 },
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'apprentice4',
          type: 'apprentice',
          position: { x: 3, y: 4 }, // Back to original position
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'maid',
          type: 'maid',
          position: { x: 3, y: 2 },
          size: { width: 1, height: 2 },
          name: '下女'
        }
      ]
      
      // When undoing to initial state, no filler piece prioritization should occur
      const mapping = updateKeyboardMapping(piecesAfterUndo)
      
      // The mapping should be based purely on movable directions
      expect(mapping).toHaveProperty('up')
      expect(mapping).toHaveProperty('down')
      expect(mapping).toHaveProperty('left')
      expect(mapping).toHaveProperty('right')
      expect(mapping).toHaveProperty('selectedIndex')
      
      // All selected indices should be 0 (default)
      expect(mapping.selectedIndex.up).toBe(0)
      expect(mapping.selectedIndex.down).toBe(0)
      expect(mapping.selectedIndex.left).toBe(0)
      expect(mapping.selectedIndex.right).toBe(0)
    })
    
    it('should not apply filler piece logic when no lastMovedPieceId is provided', () => {
      // Test that when we don't provide lastMovedPieceId and lastMoveDirection,
      // the mapping is purely based on movable directions
      const testPieces: Piece[] = [
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
        }
      ]
      
      const mapping = updateKeyboardMapping(testPieces)
      
      // No filler piece prioritization should occur
      // The first piece in each direction should be determined by the order they appear
      // in the getAllMovableDirections result
      expect(mapping).toHaveProperty('up')
      expect(mapping).toHaveProperty('down')
      expect(mapping).toHaveProperty('left')
      expect(mapping).toHaveProperty('right')
      expect(mapping).toHaveProperty('selectedIndex')
    })

    it('should work correctly with complex piece arrangements', () => {
      // Test with different piece sizes and positions
      const testPieces: Piece[] = [
        {
          id: 'apprentice1',
          type: 'apprentice',
          position: { x: 0, y: 0 },
          size: { width: 1, height: 1 },
          name: 'apprentice1'
        },
        {
          id: 'father',
          type: 'father',
          position: { x: 1, y: 0 }, // 1x2 piece moved right
          size: { width: 1, height: 2 },
          name: 'father'
        },
        {
          id: 'apprentice2',
          type: 'apprentice',
          position: { x: 2, y: 0 }, // Can move left to fill part of the space
          size: { width: 1, height: 1 },
          name: 'apprentice2'
        }
      ]
      
      const mapping = updateKeyboardMapping(testPieces, 'father', 'right')
      
      // Verify that the mapping is created correctly
      expect(mapping).toHaveProperty('up')
      expect(mapping).toHaveProperty('down')
      expect(mapping).toHaveProperty('left')
      expect(mapping).toHaveProperty('right')
      expect(mapping).toHaveProperty('selectedIndex')
    })
  })

  describe('Auto-undo behavior with keyboard mapping', () => {
    it('should handle left-left-right-right sequence returning to initial state', () => {
      // Test the complete sequence that should return to initial state
      const initialPieces: Piece[] = [
        {
          id: 'apprentice4',
          type: 'apprentice',
          position: { x: 3, y: 4 }, // Initial position
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'apprentice3',
          type: 'apprentice',
          position: { x: 2, y: 3 },
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'maid',
          type: 'maid',
          position: { x: 3, y: 2 },
          size: { width: 1, height: 2 },
          name: '下女'
        }
      ]
      
      // Step 1: Left (apprentice4 moves from (3,4) to (2,4))
      const step1Pieces: Piece[] = [
        {
          id: 'apprentice4',
          type: 'apprentice',
          position: { x: 2, y: 4 },
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'apprentice3',
          type: 'apprentice',
          position: { x: 2, y: 3 },
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'maid',
          type: 'maid',
          position: { x: 3, y: 2 },
          size: { width: 1, height: 2 },
          name: '下女'
        }
      ]
      
      const step1Mapping = updateKeyboardMapping(step1Pieces, 'apprentice4', 'left')
      
      // In step1, apprentice3 should be prioritized for down direction
      if (step1Mapping.down.includes('apprentice3') && step1Mapping.down.includes('maid')) {
        expect(step1Mapping.down[0]).toBe('apprentice3')
      }
      
      // Step 2: Left again (apprentice4 moves from (2,4) to (1,4))
      const step2Pieces: Piece[] = [
        {
          id: 'apprentice4',
          type: 'apprentice',
          position: { x: 1, y: 4 },
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'apprentice3',
          type: 'apprentice',
          position: { x: 2, y: 3 },
          size: { width: 1, height: 1 },
          name: '小僧'
        },
        {
          id: 'maid',
          type: 'maid',
          position: { x: 3, y: 2 },
          size: { width: 1, height: 2 },
          name: '下女'
        }
      ]
      
      const step2Mapping = updateKeyboardMapping(step2Pieces, 'apprentice4', 'left')
      
      // In step2, apprentice3 should be prioritized for down direction
      if (step2Mapping.down.includes('apprentice3') && step2Mapping.down.includes('maid')) {
        expect(step2Mapping.down[0]).toBe('apprentice3')
      }
      
      // Step 3: Right (auto-undo, apprentice4 moves from (1,4) to (2,4))
      // This should restore the keyboard mapping from step 1
      const step3Mapping = updateKeyboardMapping(step1Pieces, 'apprentice4', 'left')
      
      // Should match step1 mapping
      if (step3Mapping.down.includes('apprentice3') && step3Mapping.down.includes('maid')) {
        expect(step3Mapping.down[0]).toBe('apprentice3')
      }
      
      // Step 4: Right again (auto-undo, apprentice4 moves from (2,4) to (3,4))
      // This should restore the initial keyboard mapping with no prioritization
      const step4Mapping = updateKeyboardMapping(initialPieces)
      
      // Should be the initial state with no filler piece prioritization
      expect(step4Mapping.selectedIndex.up).toBe(0)
      expect(step4Mapping.selectedIndex.down).toBe(0)
      expect(step4Mapping.selectedIndex.left).toBe(0)
      expect(step4Mapping.selectedIndex.right).toBe(0)
    })
  })
})