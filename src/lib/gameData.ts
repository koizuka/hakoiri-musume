import type { Piece, KeyboardMapping } from '../types/game';

export const initialPieces: Piece[] = [
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
    position: { x: 3, y: 4 },
    size: { width: 1, height: 1 },
    name: '小僧'
  }
];

export const initialKeyboardMapping: KeyboardMapping = {
  up: [],
  down: [],
  left: [],
  right: [],
  selectedIndex: {
    up: 0,
    down: 0,
    left: 0,
    right: 0
  }
};