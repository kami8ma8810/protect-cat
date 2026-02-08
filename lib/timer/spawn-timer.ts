/**
 * 猫スポーン用タイマー
 * 指定間隔（秒）でコールバックを実行する
 */
class SpawnTimer {
  private timerId: ReturnType<typeof setInterval> | null = null;
  private callback: () => void;
  private intervalSeconds: number;

  constructor(callback: () => void, intervalSeconds: number) {
    this.callback = callback;
    this.intervalSeconds = intervalSeconds;
  }

  get isRunning(): boolean {
    return this.timerId !== null;
  }

  start(): void {
    if (this.timerId !== null) return;
    this.timerId = setInterval(
      this.callback,
      this.intervalSeconds * 1000
    );
  }

  stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  updateInterval(seconds: number): void {
    this.intervalSeconds = seconds;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

export { SpawnTimer };
