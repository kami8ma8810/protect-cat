/** 猫の一意識別子 */
type CatId = string;

/** 無料猫の種類（5種） */
type FreeCatBreed = 'tabby' | 'black' | 'white' | 'calico' | 'orange';

/** 有料猫の種類（5種） */
type PremiumCatBreed =
  | 'siamese'
  | 'persian'
  | 'scottish-fold'
  | 'munchkin'
  | 'russian-blue';

/** 猫の種類（全10種） */
type CatBreed = FreeCatBreed | PremiumCatBreed;

/** 猫のFSM状態 */
type CatState = 'idle' | 'walking' | 'sitting' | 'sleeping' | 'turning';

/** 猫のサイズバリエーション */
type CatSize = 'small' | 'medium' | 'large';

/** 猫の向き */
type CatDirection = 'left' | 'right';

/** 2D座標 */
interface Position {
  x: number;
  y: number;
}

/** 猫のサイズ設定 */
interface CatSizeConfig {
  /** CSSピクセルサイズ */
  px: number;
  /** 移動速度（px/frame） */
  speed: number;
  /** 出現確率（0-1） */
  spawnRate: number;
}

/** FSM状態遷移の確率テーブル */
interface StateTransition {
  /** 遷移先の状態 */
  to: CatState;
  /** 遷移確率（0-1） */
  probability: number;
}

/** 各状態の設定 */
interface StateConfig {
  /** 状態の持続時間範囲（ミリ秒） */
  duration: { min: number; max: number };
  /** 遷移先の確率テーブル */
  transitions: StateTransition[];
  /** アニメーションフレーム数 */
  frameCount: number;
}

/** 猫の永続化用データ */
interface CatPersistState {
  id: CatId;
  breed: CatBreed;
  size: CatSize;
  position: Position;
  direction: CatDirection;
  state: CatState;
  /** スポーンした時刻（ms） */
  spawnedAt: number;
}

/** ランタイムでの猫インスタンス */
interface CatInstance {
  id: CatId;
  breed: CatBreed;
  size: CatSize;
  position: Position;
  direction: CatDirection;
  state: CatState;
  spawnedAt: number;
  /** 現在の状態に入った時刻（ms） */
  stateEnteredAt: number;
  /** 現在の状態の持続時間（ms） */
  stateDuration: number;
  /** アニメーションフレームインデックス */
  currentFrame: number;
  /** DOM要素への参照 */
  element: HTMLElement | null;
}

/** 猫の種類ごとの設定 */
interface CatBreedConfig {
  /** 種類ID */
  breed: CatBreed;
  /** 表示名 */
  displayName: string;
  /** 日本語名 */
  displayNameJa: string;
  /** スプライトシートのベースパス */
  spriteBasePath: string;
  /** 無料か有料か */
  isFree: boolean;
}

export type {
  CatId,
  FreeCatBreed,
  PremiumCatBreed,
  CatBreed,
  CatState,
  CatSize,
  CatDirection,
  Position,
  CatSizeConfig,
  StateTransition,
  StateConfig,
  CatPersistState,
  CatInstance,
  CatBreedConfig,
};
