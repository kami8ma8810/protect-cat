import { describe, it, expect, vi, afterEach } from 'vitest';
import { getTodayDateString, isSameDate, isNewDay } from '@/lib/date/date-utils';

describe('date-utils', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getTodayDateString', () => {
    it('今日の日付をYYYY-MM-DD形式で返す', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 0, 15)); // 2025-01-15
      expect(getTodayDateString()).toBe('2025-01-15');
    });

    it('月・日が1桁の場合ゼロ埋めする', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 5)); // 2025-03-05
      expect(getTodayDateString()).toBe('2025-03-05');
    });

    it('年末の日付を正しく返す', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 11, 31)); // 2025-12-31
      expect(getTodayDateString()).toBe('2025-12-31');
    });
  });

  describe('isSameDate', () => {
    it('同じ日付文字列ならtrueを返す', () => {
      expect(isSameDate('2025-01-15', '2025-01-15')).toBe(true);
    });

    it('異なる日付文字列ならfalseを返す', () => {
      expect(isSameDate('2025-01-15', '2025-01-16')).toBe(false);
    });

    it('空文字列と日付文字列はfalseを返す', () => {
      expect(isSameDate('', '2025-01-15')).toBe(false);
    });

    it('両方空文字列はtrueを返す', () => {
      expect(isSameDate('', '')).toBe(true);
    });
  });

  describe('isNewDay', () => {
    it('保存日付が今日と異なればtrueを返す', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 0, 16));
      expect(isNewDay('2025-01-15')).toBe(true);
    });

    it('保存日付が今日と同じならfalseを返す', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 0, 15));
      expect(isNewDay('2025-01-15')).toBe(false);
    });

    it('保存日付が空文字列ならtrueを返す（初回起動）', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 0, 15));
      expect(isNewDay('')).toBe(true);
    });
  });
});
