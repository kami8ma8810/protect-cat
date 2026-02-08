import { describe, it, expect, beforeEach } from 'vitest';
import { fakeBrowser } from '@webext-core/fake-browser';
import {
  loadSettings,
  saveSettings,
  updateSettings,
} from '@/lib/storage/settings-storage';
import { DEFAULT_SETTINGS } from '@/types/settings';
import type { UserSettings } from '@/types/settings';

describe('settings-storage', () => {
  beforeEach(() => {
    fakeBrowser.reset();
  });

  describe('loadSettings', () => {
    it('デフォルト設定を返す（初回起動時）', async () => {
      const settings = await loadSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    it('保存された設定を返す', async () => {
      const customSettings: UserSettings = {
        enabled: false,
        spawnIntervalMinutes: 5,
        maxCats: 30,
      };
      await chrome.storage.local.set({ settings: customSettings });
      const settings = await loadSettings();
      expect(settings).toEqual(customSettings);
    });
  });

  describe('saveSettings', () => {
    it('設定を保存する', async () => {
      const settings: UserSettings = {
        enabled: false,
        spawnIntervalMinutes: 1,
        maxCats: 20,
      };
      await saveSettings(settings);
      const result = await chrome.storage.local.get(['settings']);
      expect(result['settings']).toEqual(settings);
    });
  });

  describe('updateSettings', () => {
    it('一部の設定だけ更新できる', async () => {
      await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
      await updateSettings({ enabled: false });
      const settings = await loadSettings();
      expect(settings.enabled).toBe(false);
      expect(settings.spawnIntervalMinutes).toBe(
        DEFAULT_SETTINGS.spawnIntervalMinutes
      );
      expect(settings.maxCats).toBe(DEFAULT_SETTINGS.maxCats);
    });

    it('保存データがない状態でもデフォルトとマージする', async () => {
      await updateSettings({ spawnIntervalMinutes: 5 });
      const settings = await loadSettings();
      expect(settings.spawnIntervalMinutes).toBe(5);
      expect(settings.enabled).toBe(DEFAULT_SETTINGS.enabled);
    });
  });
});
