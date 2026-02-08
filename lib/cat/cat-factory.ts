import type { CatBreed, CatSize, CatInstance } from '@/types/cat';
import { CAT_BREEDS, CAT_SIZE_CONFIGS } from './cat-types';
import { getRandomPosition } from './cat-movement';
import { getStateDuration } from './cat-behavior';

/** ユニークIDカウンター */
let idCounter = 0;

/**
 * ユニークな猫IDを生成する
 */
function generateCatId(): string {
  idCounter++;
  return `cat-${Date.now()}-${idCounter}`;
}

/**
 * ランダムな猫の種類を選択する
 */
function getRandomBreed(): CatBreed {
  const freeBreeds = CAT_BREEDS.filter((b) => b.isFree);
  const index = Math.floor(Math.random() * freeBreeds.length);
  return freeBreeds[index]!.breed;
}

/**
 * 確率に基づいてランダムなサイズを選択する
 */
function getRandomSize(): CatSize {
  const roll = Math.random();
  let cumulative = 0;

  const sizes = Object.entries(CAT_SIZE_CONFIGS) as [
    CatSize,
    (typeof CAT_SIZE_CONFIGS)[CatSize],
  ][];

  for (const [size, config] of sizes) {
    cumulative += config.spawnRate;
    if (roll < cumulative) {
      return size;
    }
  }

  return 'medium';
}

/**
 * ランダムな猫インスタンスを生成する
 */
function createRandomCat(
  viewportWidth: number,
  viewportHeight: number
): CatInstance {
  const size = getRandomSize();
  const catPx = CAT_SIZE_CONFIGS[size].px;
  const now = Date.now();

  return {
    id: generateCatId(),
    breed: getRandomBreed(),
    size,
    position: getRandomPosition(viewportWidth, viewportHeight, catPx),
    direction: Math.random() < 0.5 ? 'left' : 'right',
    state: 'idle',
    spawnedAt: now,
    stateEnteredAt: now,
    stateDuration: getStateDuration('idle'),
    currentFrame: 0,
    element: null,
  };
}

export { createRandomCat, generateCatId };
