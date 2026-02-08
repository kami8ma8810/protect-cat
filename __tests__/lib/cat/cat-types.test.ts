import { describe, it, expect } from 'vitest';
import {
  CAT_BREEDS,
  CAT_SIZE_CONFIGS,
  getBreedConfig,
  getAvailableBreeds,
} from '@/lib/cat/cat-types';

describe('cat-types', () => {
  describe('CAT_BREEDS', () => {
    it('10種類の猫が定義されている', () => {
      expect(CAT_BREEDS).toHaveLength(10);
    });

    it('無料猫が5種類', () => {
      const free = CAT_BREEDS.filter((b) => b.isFree);
      expect(free).toHaveLength(5);
    });

    it('有料猫が5種類', () => {
      const premium = CAT_BREEDS.filter((b) => !b.isFree);
      expect(premium).toHaveLength(5);
    });

    it('無料猫の種類が含まれている', () => {
      const breeds = CAT_BREEDS.map((b) => b.breed);
      expect(breeds).toContain('tabby');
      expect(breeds).toContain('black');
      expect(breeds).toContain('white');
      expect(breeds).toContain('calico');
      expect(breeds).toContain('orange');
    });

    it('有料猫の種類が含まれている', () => {
      const breeds = CAT_BREEDS.map((b) => b.breed);
      expect(breeds).toContain('siamese');
      expect(breeds).toContain('persian');
      expect(breeds).toContain('scottish-fold');
      expect(breeds).toContain('munchkin');
      expect(breeds).toContain('russian-blue');
    });
  });

  describe('CAT_SIZE_CONFIGS', () => {
    it('3つのサイズが定義されている', () => {
      expect(Object.keys(CAT_SIZE_CONFIGS)).toHaveLength(3);
    });

    it('smallが最も速い', () => {
      expect(CAT_SIZE_CONFIGS.small.speed).toBeGreaterThan(
        CAT_SIZE_CONFIGS.medium.speed
      );
    });

    it('largeが最も遅い', () => {
      expect(CAT_SIZE_CONFIGS.large.speed).toBeLessThan(
        CAT_SIZE_CONFIGS.medium.speed
      );
    });

    it('出現率の合計が1になる', () => {
      const total =
        CAT_SIZE_CONFIGS.small.spawnRate +
        CAT_SIZE_CONFIGS.medium.spawnRate +
        CAT_SIZE_CONFIGS.large.spawnRate;
      expect(total).toBeCloseTo(1);
    });
  });

  describe('getBreedConfig', () => {
    it('指定した種類の設定を返す', () => {
      const config = getBreedConfig('tabby');
      expect(config.breed).toBe('tabby');
      expect(config.displayName).toBeDefined();
    });

    it('有料猫の設定も取得できる', () => {
      const config = getBreedConfig('siamese');
      expect(config.breed).toBe('siamese');
      expect(config.isFree).toBe(false);
    });

    it('存在しない種類はundefinedを返す', () => {
      // @ts-expect-error テスト用に不正な値を渡す
      const config = getBreedConfig('unicorn');
      expect(config).toBeUndefined();
    });
  });

  describe('getAvailableBreeds', () => {
    it('Free版では無料猫のみ返す', () => {
      const breeds = getAvailableBreeds(false);
      expect(breeds).toHaveLength(5);
      expect(breeds.every((b) => b.isFree)).toBe(true);
    });

    it('Premium版では全種類返す', () => {
      const breeds = getAvailableBreeds(true);
      expect(breeds).toHaveLength(10);
    });
  });
});
