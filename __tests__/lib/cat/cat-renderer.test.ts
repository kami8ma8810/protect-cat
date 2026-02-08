import { describe, it, expect, beforeEach } from 'vitest';
import { createCatElement, updateCatElement, removeCatElement } from '@/lib/cat/cat-renderer';
import type { CatInstance } from '@/types/cat';

describe('cat-renderer', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  const mockCat: CatInstance = {
    id: 'cat-1',
    breed: 'tabby',
    size: 'medium',
    position: { x: 100, y: 200 },
    direction: 'right',
    state: 'idle',
    spawnedAt: Date.now(),
    stateEnteredAt: Date.now(),
    stateDuration: 3000,
    currentFrame: 0,
    element: null,
  };

  describe('createCatElement', () => {
    it('DOM要素を生成する', () => {
      const element = createCatElement(mockCat, container);
      expect(element).toBeInstanceOf(HTMLElement);
      expect(container.children).toHaveLength(1);
    });

    it('適切なCSSクラスを設定する', () => {
      const element = createCatElement(mockCat, container);
      expect(element.classList.contains('protect-cat')).toBe(true);
      expect(element.classList.contains('cat-tabby')).toBe(true);
      expect(element.classList.contains('cat-medium')).toBe(true);
      expect(element.classList.contains('cat-idle')).toBe(true);
    });

    it('data-cat-idを設定する', () => {
      const element = createCatElement(mockCat, container);
      expect(element.dataset['catId']).toBe('cat-1');
    });

    it('位置をtransformで設定する', () => {
      const element = createCatElement(mockCat, container);
      expect(element.style.transform).toContain('translate3d');
    });

    it('左向きの場合scaleX(-1)が適用される', () => {
      const leftCat = { ...mockCat, direction: 'left' as const };
      const element = createCatElement(leftCat, container);
      expect(element.style.transform).toContain('scaleX(-1)');
    });
  });

  describe('updateCatElement', () => {
    it('位置を更新する', () => {
      const element = createCatElement(mockCat, container);
      const updatedCat: CatInstance = {
        ...mockCat,
        position: { x: 300, y: 400 },
        element,
      };
      updateCatElement(updatedCat);
      expect(element.style.transform).toContain('300');
      expect(element.style.transform).toContain('400');
    });

    it('状態のCSSクラスを更新する', () => {
      const element = createCatElement(mockCat, container);
      const updatedCat: CatInstance = {
        ...mockCat,
        state: 'walking',
        element,
      };
      updateCatElement(updatedCat);
      expect(element.classList.contains('cat-walking')).toBe(true);
      expect(element.classList.contains('cat-idle')).toBe(false);
    });

    it('方向転換時にscaleXが変わる', () => {
      const element = createCatElement(mockCat, container);
      const updatedCat: CatInstance = {
        ...mockCat,
        direction: 'left',
        element,
      };
      updateCatElement(updatedCat);
      expect(element.style.transform).toContain('scaleX(-1)');
    });
  });

  describe('removeCatElement', () => {
    it('DOM要素を削除する', () => {
      const element = createCatElement(mockCat, container);
      expect(container.children).toHaveLength(1);
      removeCatElement(element);
      expect(container.children).toHaveLength(0);
    });
  });
});
