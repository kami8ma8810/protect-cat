import type { CatPersistState } from './cat';
import type { UserSettings } from './settings';

/** ストレージに保存するデータのスキーマ */
interface StorageSchema {
  /** 猫の永続化データ配列 */
  cats: CatPersistState[];
  /** 最後に猫データを保存した日付（YYYY-MM-DD） */
  lastSavedDate: string;
  /** ユーザー設定 */
  settings: UserSettings;
  /** SNSサイトごとの累計滞在時間（ミリ秒） key: hostname */
  snsTimeSpent: Record<string, number>;
  /** 今日スポーンした猫の総数 */
  todayCatCount: number;
}

/** ストレージのデフォルト値 */
const DEFAULT_STORAGE: StorageSchema = {
  cats: [],
  lastSavedDate: '',
  settings: {
    enabled: true,
    spawnIntervalMinutes: 2,
    maxCats: 50,
  },
  snsTimeSpent: {},
  todayCatCount: 0,
};

export type { StorageSchema };
export { DEFAULT_STORAGE };
