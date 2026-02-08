/**
 * 猫スポーン用タイマー
 * 指定間隔（分）でコールバックを実行する
 */
class SpawnTimer {
  private timerId: ReturnType<typeof setInterval> | null = null;
  private callback: () => void;
  private intervalMinutes: number;

  constructor(callback: () => void, intervalMinutes: number) {
    this.callback = callback;
    this.intervalMinutes = intervalMinutes;
  }

  get isRunning(): boolean {
    return this.timerId !== null;
  }

  start(): void {
    if (this.timerId !== null) return;
    this.timerId = setInterval(
      this.callback,
      this.intervalMinutes * 60_000
    );
  }

  stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  updateInterval(minutes: number): void {
    this.intervalMinutes = minutes;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

export { SpawnTimer };
