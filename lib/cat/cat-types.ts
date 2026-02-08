import type { CatBreed, CatBreedConfig, CatSize, CatSizeConfig } from '@/types/cat';

/** 猫の種類設定（無料5種） */
const CAT_BREEDS: CatBreedConfig[] = [
  {
    breed: 'tabby',
    displayName: 'Tabby',
    displayNameJa: 'キジトラ',
    spriteBasePath: '/assets/cats/sprites/tabby',
    isFree: true,
  },
  {
    breed: 'black',
    displayName: 'Black',
    displayNameJa: '黒猫',
    spriteBasePath: '/assets/cats/sprites/black',
    isFree: true,
  },
  {
    breed: 'white',
    displayName: 'White',
    displayNameJa: '白猫',
    spriteBasePath: '/assets/cats/sprites/white',
    isFree: true,
  },
  {
    breed: 'calico',
    displayName: 'Calico',
    displayNameJa: '三毛猫',
    spriteBasePath: '/assets/cats/sprites/calico',
    isFree: true,
  },
  {
    breed: 'orange',
    displayName: 'Orange',
    displayNameJa: '茶トラ',
    spriteBasePath: '/assets/cats/sprites/orange',
    isFree: true,
  },
];

/** サイズ別設定 */
const CAT_SIZE_CONFIGS: Record<CatSize, CatSizeConfig> = {
  small: { px: 32, speed: 2.5, spawnRate: 0.3 },
  medium: { px: 64, speed: 1.5, spawnRate: 0.5 },
  large: { px: 96, speed: 1.0, spawnRate: 0.2 },
};

/**
 * 種類IDから設定を取得する
 */
function getBreedConfig(breed: CatBreed): CatBreedConfig {
  return CAT_BREEDS.find((b) => b.breed === breed)!;
}

export { CAT_BREEDS, CAT_SIZE_CONFIGS, getBreedConfig };
