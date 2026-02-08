import type { CatPersistState } from '@/types/cat';
import { getTodayDateString, isNewDay } from '@/lib/date/date-utils';

/**
 * 猫データをストレージに保存する
 */
async function saveCats(cats: CatPersistState[]): Promise<void> {
  await chrome.storage.local.set({
    cats,
    lastSavedDate: getTodayDateString(),
  });
}

/**
 * 猫データをストレージから読み込む
 * 日付が変わっていたらリセットして空配列を返す
 */
async function loadCats(): Promise<CatPersistState[]> {
  const result = await chrome.storage.local.get([
    'cats',
    'lastSavedDate',
  ]);

  const lastSavedDate = (result['lastSavedDate'] as string | undefined) ?? '';

  if (isNewDay(lastSavedDate)) {
    await chrome.storage.local.set({
      cats: [],
      lastSavedDate: getTodayDateString(),
      todayCatCount: 0,
    });
    return [];
  }

  return (result['cats'] as CatPersistState[] | undefined) ?? [];
}

/**
 * 猫データをクリアする
 */
async function clearCats(): Promise<void> {
  await chrome.storage.local.set({ cats: [] });
}

/**
 * 今日のスポーン数をインクリメントする
 */
async function incrementTodayCatCount(): Promise<void> {
  const result = await chrome.storage.local.get(['todayCatCount']);
  const current = (result['todayCatCount'] as number | undefined) ?? 0;
  await chrome.storage.local.set({ todayCatCount: current + 1 });
}

/**
 * 今日のスポーン数を取得する
 */
async function getTodayCatCount(): Promise<number> {
  const result = await chrome.storage.local.get(['todayCatCount']);
  return (result['todayCatCount'] as number | undefined) ?? 0;
}

export { saveCats, loadCats, clearCats, incrementTodayCatCount, getTodayCatCount };
