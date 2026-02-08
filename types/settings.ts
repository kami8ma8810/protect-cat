/** スポーン間隔の選択肢（分） */
type SpawnInterval = 1 | 2 | 5;

/** ユーザー設定 */
interface UserSettings {
  /** 拡張機能のON/OFF */
  enabled: boolean;
  /** 猫のスポーン間隔（分） */
  spawnIntervalMinutes: SpawnInterval;
  /** 最大猫数 */
  maxCats: number;
}

/** デフォルト設定値 */
const DEFAULT_SETTINGS: UserSettings = {
  enabled: true,
  spawnIntervalMinutes: 2,
  maxCats: 50,
} as const;

export type { SpawnInterval, UserSettings };
export { DEFAULT_SETTINGS };
