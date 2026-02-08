import type { CatBreed, CatBreedConfig, CatSize, CatSizeConfig } from '@/types/cat';

/** 猫の種類設定（全10種） */
const CAT_BREEDS: CatBreedConfig[] = [
  // 無料5種
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
  // 有料5種
  {
    breed: 'siamese',
    displayName: 'Siamese',
    displayNameJa: 'シャム',
    spriteBasePath: '/assets/cats/sprites/siamese',
    isFree: false,
  },
  {
    breed: 'persian',
    displayName: 'Persian',
    displayNameJa: 'ペルシャ',
    spriteBasePath: '/assets/cats/sprites/persian',
    isFree: false,
  },
  {
    breed: 'scottish-fold',
    displayName: 'Scottish Fold',
    displayNameJa: 'スコティッシュ',
    spriteBasePath: '/assets/cats/sprites/scottish-fold',
    isFree: false,
  },
  {
    breed: 'munchkin',
    displayName: 'Munchkin',
    displayNameJa: 'マンチカン',
    spriteBasePath: '/assets/cats/sprites/munchkin',
    isFree: false,
  },
  {
    breed: 'russian-blue',
    displayName: 'Russian Blue',
    displayNameJa: 'ロシアンブルー',
    spriteBasePath: '/assets/cats/sprites/russian-blue',
    isFree: false,
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

/**
 * 利用可能な猫の種類を返す
 */
function getAvailableBreeds(isPremium: boolean): CatBreedConfig[] {
  if (isPremium) return CAT_BREEDS;
  return CAT_BREEDS.filter((b) => b.isFree);
}

export { CAT_BREEDS, CAT_SIZE_CONFIGS, getBreedConfig, getAvailableBreeds };
