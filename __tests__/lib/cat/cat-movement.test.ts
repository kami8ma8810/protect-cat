import { describe, it, expect } from 'vitest';
import {
  updatePosition,
  isAtBoundary,
  getRandomPosition,
} from '@/lib/cat/cat-movement';
import type { Position, CatDirection } from '@/types/cat';

describe('cat-movement', () => {
  const viewportWidth = 1920;
  const viewportHeight = 1080;

  describe('updatePosition', () => {
    it('右方向に移動する', () => {
      const pos: Position = { x: 100, y: 500 };
      const newPos = updatePosition(pos, 'right', 2, viewportWidth, viewportHeight, 64);
      expect(newPos.x).toBeGreaterThan(pos.x);
    });

    it('左方向に移動する', () => {
      const pos: Position = { x: 500, y: 500 };
      const newPos = updatePosition(pos, 'left', 2, viewportWidth, viewportHeight, 64);
      expect(newPos.x).toBeLessThan(pos.x);
    });

    it('画面右端を超えない', () => {
      const pos: Position = { x: viewportWidth - 10, y: 500 };
      const newPos = updatePosition(pos, 'right', 100, viewportWidth, viewportHeight, 64);
      expect(newPos.x).toBeLessThanOrEqual(viewportWidth - 64);
    });

    it('画面左端を下回らない', () => {
      const pos: Position = { x: 10, y: 500 };
      const newPos = updatePosition(pos, 'left', 100, viewportWidth, viewportHeight, 64);
      expect(newPos.x).toBeGreaterThanOrEqual(0);
    });
  });

  describe('isAtBoundary', () => {
    it('右端付近でtrueを返す', () => {
      const pos: Position = { x: viewportWidth - 64, y: 500 };
      expect(isAtBoundary(pos, 'right', viewportWidth, 64)).toBe(true);
    });

    it('左端でtrueを返す', () => {
      const pos: Position = { x: 0, y: 500 };
      expect(isAtBoundary(pos, 'left', viewportWidth, 64)).toBe(true);
    });

    it('中央ではfalseを返す', () => {
      const pos: Position = { x: 500, y: 500 };
      expect(isAtBoundary(pos, 'right', viewportWidth, 64)).toBe(false);
      expect(isAtBoundary(pos, 'left', viewportWidth, 64)).toBe(false);
    });
  });

  describe('getRandomPosition', () => {
    it('画面内のランダムな位置を返す', () => {
      for (let i = 0; i < 50; i++) {
        const pos = getRandomPosition(viewportWidth, viewportHeight, 64);
        expect(pos.x).toBeGreaterThanOrEqual(0);
        expect(pos.x).toBeLessThanOrEqual(viewportWidth - 64);
        expect(pos.y).toBeGreaterThanOrEqual(viewportHeight * 0.5);
        expect(pos.y).toBeLessThanOrEqual(viewportHeight - 64);
      }
    });
  });
});
