import { describe, it, expect } from 'vitest';
import {
  CAT_BREEDS,
  CAT_SIZE_CONFIGS,
  getBreedConfig,
} from '@/lib/cat/cat-types';

describe('cat-types', () => {
  describe('CAT_BREEDS', () => {
    it('5種類の猫が定義されている', () => {
      expect(CAT_BREEDS).toHaveLength(5);
    });

    it('全種類が無料', () => {
      expect(CAT_BREEDS.every((b) => b.isFree)).toBe(true);
    });

    it('必要な種類が含まれている', () => {
      const breeds = CAT_BREEDS.map((b) => b.breed);
      expect(breeds).toContain('tabby');
      expect(breeds).toContain('black');
      expect(breeds).toContain('white');
      expect(breeds).toContain('calico');
      expect(breeds).toContain('orange');
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

    it('存在しない種類はundefinedを返す', () => {
      // @ts-expect-error テスト用に不正な値を渡す
      const config = getBreedConfig('unicorn');
      expect(config).toBeUndefined();
    });
  });
});
