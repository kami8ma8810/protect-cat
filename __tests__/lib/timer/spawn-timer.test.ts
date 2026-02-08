import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SpawnTimer } from '@/lib/timer/spawn-timer';

describe('SpawnTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('指定間隔でコールバックを実行する', () => {
    const callback = vi.fn();
    const timer = new SpawnTimer(callback, 1);

    timer.start();

    // 1分後
    vi.advanceTimersByTime(60_000);
    expect(callback).toHaveBeenCalledTimes(1);

    // 2分後
    vi.advanceTimersByTime(60_000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('stopでタイマーを停止する', () => {
    const callback = vi.fn();
    const timer = new SpawnTimer(callback, 1);

    timer.start();
    vi.advanceTimersByTime(60_000);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.stop();
    vi.advanceTimersByTime(120_000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('間隔を変更できる', () => {
    const callback = vi.fn();
    const timer = new SpawnTimer(callback, 2);

    timer.start();

    // 1分では呼ばれない
    vi.advanceTimersByTime(60_000);
    expect(callback).toHaveBeenCalledTimes(0);

    // 2分で呼ばれる
    vi.advanceTimersByTime(60_000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('updateIntervalで間隔を更新する', () => {
    const callback = vi.fn();
    const timer = new SpawnTimer(callback, 2);

    timer.start();
    timer.updateInterval(1);

    // 1分で呼ばれる
    vi.advanceTimersByTime(60_000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('isRunningが正しい状態を返す', () => {
    const timer = new SpawnTimer(vi.fn(), 1);

    expect(timer.isRunning).toBe(false);
    timer.start();
    expect(timer.isRunning).toBe(true);
    timer.stop();
    expect(timer.isRunning).toBe(false);
  });

  it('二重startしても一つのタイマーしか動かない', () => {
    const callback = vi.fn();
    const timer = new SpawnTimer(callback, 1);

    timer.start();
    timer.start();

    vi.advanceTimersByTime(60_000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
