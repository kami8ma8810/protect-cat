import type { UserSettings } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';

/**
 * ユーザー設定をストレージから読み込む
 * 保存されていない場合はデフォルト設定を返す
 */
async function loadSettings(): Promise<UserSettings> {
  const result = await chrome.storage.local.get(['settings']);
  return (result['settings'] as UserSettings | undefined) ?? { ...DEFAULT_SETTINGS };
}

/**
 * ユーザー設定をストレージに保存する
 */
async function saveSettings(settings: UserSettings): Promise<void> {
  await chrome.storage.local.set({ settings });
}

/**
 * 設定の一部だけ更新する
 */
async function updateSettings(
  partial: Partial<UserSettings>
): Promise<void> {
  const current = await loadSettings();
  const updated: UserSettings = { ...current, ...partial };
  await saveSettings(updated);
}

export { loadSettings, saveSettings, updateSettings };
