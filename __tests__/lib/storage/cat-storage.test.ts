import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fakeBrowser } from '@webext-core/fake-browser';
import {
  saveCats,
  loadCats,
  clearCats,
  incrementTodayCatCount,
  getTodayCatCount,
} from '@/lib/storage/cat-storage';
import type { CatPersistState } from '@/types/cat';

describe('cat-storage', () => {
  beforeEach(() => {
    fakeBrowser.reset();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 0, 15)); // 2025-01-15
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockCat: CatPersistState = {
    id: 'cat-1',
    breed: 'tabby',
    size: 'medium',
    position: { x: 100, y: 200 },
    direction: 'right',
    state: 'idle',
    spawnedAt: Date.now(),
  };

  describe('saveCats', () => {
    it('猫データを保存する', async () => {
      await saveCats([mockCat]);
      const result = await chrome.storage.local.get(['cats', 'lastSavedDate']);
      expect(result['cats']).toEqual([mockCat]);
      expect(result['lastSavedDate']).toBe('2025-01-15');
    });

    it('空配列でも保存できる', async () => {
      await saveCats([]);
      const result = await chrome.storage.local.get(['cats']);
      expect(result['cats']).toEqual([]);
    });
  });

  describe('loadCats', () => {
    it('保存された猫データを読み込む', async () => {
      await chrome.storage.local.set({
        cats: [mockCat],
        lastSavedDate: '2025-01-15',
      });
      const cats = await loadCats();
      expect(cats).toEqual([mockCat]);
    });

    it('データがない場合は空配列を返す', async () => {
      const cats = await loadCats();
      expect(cats).toEqual([]);
    });

    it('日付が変わっていたらリセットして空配列を返す', async () => {
      await chrome.storage.local.set({
        cats: [mockCat],
        lastSavedDate: '2025-01-14', // 昨日
      });
      const cats = await loadCats();
      expect(cats).toEqual([]);
    });

    it('日付リセット時にtodayCatCountもリセットする', async () => {
      await chrome.storage.local.set({
        cats: [mockCat],
        lastSavedDate: '2025-01-14',
        todayCatCount: 10,
      });
      await loadCats();
      const result = await chrome.storage.local.get(['todayCatCount']);
      expect(result['todayCatCount']).toBe(0);
    });
  });

  describe('clearCats', () => {
    it('猫データをクリアする', async () => {
      await chrome.storage.local.set({ cats: [mockCat] });
      await clearCats();
      const result = await chrome.storage.local.get(['cats']);
      expect(result['cats']).toEqual([]);
    });
  });

  describe('incrementTodayCatCount', () => {
    it('カウントをインクリメントする', async () => {
      await incrementTodayCatCount();
      const result = await chrome.storage.local.get(['todayCatCount']);
      expect(result['todayCatCount']).toBe(1);
    });

    it('複数回インクリメントできる', async () => {
      await incrementTodayCatCount();
      await incrementTodayCatCount();
      await incrementTodayCatCount();
      const result = await chrome.storage.local.get(['todayCatCount']);
      expect(result['todayCatCount']).toBe(3);
    });
  });

  describe('getTodayCatCount', () => {
    it('今日のカウントを取得する', async () => {
      await chrome.storage.local.set({ todayCatCount: 5 });
      const count = await getTodayCatCount();
      expect(count).toBe(5);
    });

    it('データがない場合は0を返す', async () => {
      const count = await getTodayCatCount();
      expect(count).toBe(0);
    });
  });
});
