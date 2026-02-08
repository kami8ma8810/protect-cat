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
        spawnIntervalSeconds: 300,
        maxCats: 30,
        isPremium: false,
      };
      await chrome.storage.local.set({ settings: customSettings });
      const settings = await loadSettings();
      expect(settings).toEqual(customSettings);
    });

    it('Premium設定を正しく読み込む', async () => {
      const premiumSettings: UserSettings = {
        enabled: true,
        spawnIntervalSeconds: 45,
        maxCats: 100,
        isPremium: true,
      };
      await chrome.storage.local.set({ settings: premiumSettings });
      const settings = await loadSettings();
      expect(settings.isPremium).toBe(true);
      expect(settings.maxCats).toBe(100);
      expect(settings.spawnIntervalSeconds).toBe(45);
    });
  });

  describe('saveSettings', () => {
    it('設定を保存する', async () => {
      const settings: UserSettings = {
        enabled: false,
        spawnIntervalSeconds: 60,
        maxCats: 20,
        isPremium: false,
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
      expect(settings.spawnIntervalSeconds).toBe(
        DEFAULT_SETTINGS.spawnIntervalSeconds
      );
      expect(settings.maxCats).toBe(DEFAULT_SETTINGS.maxCats);
    });

    it('保存データがない状態でもデフォルトとマージする', async () => {
      await updateSettings({ spawnIntervalSeconds: 300 });
      const settings = await loadSettings();
      expect(settings.spawnIntervalSeconds).toBe(300);
      expect(settings.enabled).toBe(DEFAULT_SETTINGS.enabled);
    });

    it('isPremiumを更新できる', async () => {
      await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
      await updateSettings({ isPremium: true });
      const settings = await loadSettings();
      expect(settings.isPremium).toBe(true);
    });
  });
});
