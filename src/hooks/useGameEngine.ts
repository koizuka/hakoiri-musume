import { useState, useCallback } from 'react';
import type { GameState, Direction, KeyboardMapping } from '../types/game';
import { initialPieces } from '../lib/gameData';
import { canMovePiece, checkWinCondition } from '../lib/gameLogic';
import { updateKeyboardMapping, getSelectedPieceForDirection, cycleAllDirections, resetKeyboardSelection } from '../lib/keyboardMapping';
import { executeMoveWithUndo, executeUndo } from '../lib/undoLogic';

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialMapping = resetKeyboardSelection(updateKeyboardMapping(initialPieces));
    return {
      pieces: initialPieces,
      moves: 0,
      moveHistory: [],
      keyboardMapping: initialMapping,
      isWon: false
    };
  });

  const [showHandles, setShowHandles] = useState(true);


  const movePiece = useCallback((pieceId: string, direction: Direction) => {
    if (!canMovePiece(gameState.pieces, pieceId, direction)) {
      return;
    }

    const result = executeMoveWithUndo(
      gameState.pieces,
      gameState.moveHistory,
      pieceId,
      direction,
      gameState.keyboardMapping
    );

    const isWon = checkWinCondition(result.pieces);
    
    // If auto-undo occurred, restore the saved keyboard mapping
    // Otherwise, generate a new mapping with filler piece prioritization
    let newKeyboardMapping: KeyboardMapping;
    if (result.wasAutoUndo && result.keyboardMapping) {
      newKeyboardMapping = result.keyboardMapping;
    } else {
      newKeyboardMapping = updateKeyboardMapping(result.pieces, pieceId, direction);
    }

    setGameState({
      pieces: result.pieces,
      moves: result.moves,
      moveHistory: result.moveHistory,
      keyboardMapping: resetKeyboardSelection(newKeyboardMapping),
      isWon
    });
  }, [gameState.pieces, gameState.moveHistory, gameState.keyboardMapping]);

  const undoMove = useCallback(() => {
    if (gameState.moveHistory.length === 0) {
      return;
    }

    const result = executeUndo(gameState.pieces, gameState.moveHistory);
    
    // For manual undo, restore the saved keyboard mapping or create a clean one
    let newKeyboardMapping: KeyboardMapping;
    if (result.keyboardMapping) {
      newKeyboardMapping = result.keyboardMapping;
    } else {
      // If no saved mapping, create a clean mapping without prioritization
      newKeyboardMapping = updateKeyboardMapping(result.pieces);
    }

    setGameState({
      pieces: result.pieces,
      moves: result.moves,
      moveHistory: result.moveHistory,
      keyboardMapping: resetKeyboardSelection(newKeyboardMapping),
      isWon: false
    });
    setShowHandles(true); // Show handles on undo
  }, [gameState.pieces, gameState.moveHistory]);

  const resetGame = useCallback(() => {
    setGameState({
      pieces: initialPieces,
      moves: 0,
      moveHistory: [],
      keyboardMapping: resetKeyboardSelection(updateKeyboardMapping(initialPieces)),
      isWon: false
    });
    setShowHandles(true); // Show handles on reset
  }, []);

  const moveSelectedPiece = useCallback((direction: Direction) => {
    const selectedPieceId = getSelectedPieceForDirection(gameState.keyboardMapping, direction);
    if (selectedPieceId) {
      movePiece(selectedPieceId, direction);
    }
    setShowHandles(true); // Show handles on keyboard move
  }, [gameState.keyboardMapping, movePiece]);

  const cycleSelection = useCallback(() => {
    // Cycle all directions simultaneously
    const newMapping = cycleAllDirections(gameState.keyboardMapping);
    
    setGameState(prev => ({
      ...prev,
      keyboardMapping: newMapping
    }));
    setShowHandles(true); // Show handles on keyboard cycle
  }, [gameState.keyboardMapping]);

  const hideHandles = useCallback(() => {
    setShowHandles(false);
  }, []);

  const showHandlesFunc = useCallback(() => {
    setShowHandles(true);
  }, []);

  const toggleHandles = useCallback(() => {
    setShowHandles(prev => !prev);
  }, []);

  const clearWinState = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isWon: false
    }));
  }, []);

  return {
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
  };
}