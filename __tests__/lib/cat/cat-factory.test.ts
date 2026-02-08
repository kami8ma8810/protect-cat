import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRandomCat } from '@/lib/cat/cat-factory';
import type { CatBreed, CatSize } from '@/types/cat';

describe('cat-factory', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createRandomCat', () => {
    const viewportWidth = 1920;
    const viewportHeight = 1080;

    it('有効な猫インスタンスを生成する', () => {
      const cat = createRandomCat(viewportWidth, viewportHeight);
      expect(cat.id).toBeTruthy();
      expect(cat.state).toBe('idle');
      expect(cat.element).toBeNull();
    });

    it('IDが一意である', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const cat = createRandomCat(viewportWidth, viewportHeight);
        ids.add(cat.id);
      }
      expect(ids.size).toBe(100);
    });

    it('有効な種類を持つ', () => {
      const validBreeds: CatBreed[] = [
        'tabby',
        'black',
        'white',
        'calico',
        'orange',
      ];
      for (let i = 0; i < 50; i++) {
        const cat = createRandomCat(viewportWidth, viewportHeight);
        expect(validBreeds).toContain(cat.breed);
      }
    });

    it('有効なサイズを持つ', () => {
      const validSizes: CatSize[] = ['small', 'medium', 'large'];
      for (let i = 0; i < 50; i++) {
        const cat = createRandomCat(viewportWidth, viewportHeight);
        expect(validSizes).toContain(cat.size);
      }
    });

    it('方向はleftかrightのどちらか', () => {
      for (let i = 0; i < 50; i++) {
        const cat = createRandomCat(viewportWidth, viewportHeight);
        expect(['left', 'right']).toContain(cat.direction);
      }
    });

    it('画面内の位置に生成される', () => {
      for (let i = 0; i < 50; i++) {
        const cat = createRandomCat(viewportWidth, viewportHeight);
        expect(cat.position.x).toBeGreaterThanOrEqual(0);
        expect(cat.position.x).toBeLessThanOrEqual(viewportWidth);
        expect(cat.position.y).toBeGreaterThanOrEqual(0);
        expect(cat.position.y).toBeLessThanOrEqual(viewportHeight);
      }
    });
  });
});
