/** スポーン間隔のプリセット（分） */
type SpawnIntervalPreset = 1 | 2 | 5;

/** Premium版で使えるスポーン間隔の範囲（秒） */
interface SpawnIntervalRange {
  min: 30;
  max: 600;
}

/** ユーザー設定 */
interface UserSettings {
  /** 拡張機能のON/OFF */
  enabled: boolean;
  /** 猫のスポーン間隔（秒）。Free版はプリセット値×60のみ */
  spawnIntervalSeconds: number;
  /** 最大猫数 */
  maxCats: number;
  /** Premium版かどうか */
  isPremium: boolean;
}

/** Free版のデフォルト設定値 */
const DEFAULT_SETTINGS: UserSettings = {
  enabled: true,
  spawnIntervalSeconds: 120,
  maxCats: 50,
  isPremium: false,
};

/** Premium版の上限値 */
const PREMIUM_MAX_CATS = 100;
/** Free版の上限値 */
const FREE_MAX_CATS = 50;

/** Free版のスポーン間隔プリセット（秒） */
const FREE_INTERVAL_PRESETS: readonly number[] = [60, 120, 300];

/** Premium版のスポーン間隔範囲（秒） */
const SPAWN_INTERVAL_RANGE: SpawnIntervalRange = { min: 30, max: 600 };

export type { SpawnIntervalPreset, SpawnIntervalRange, UserSettings };
export {
  DEFAULT_SETTINGS,
  PREMIUM_MAX_CATS,
  FREE_MAX_CATS,
  FREE_INTERVAL_PRESETS,
  SPAWN_INTERVAL_RANGE,
};
