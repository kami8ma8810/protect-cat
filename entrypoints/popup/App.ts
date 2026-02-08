import { loadSettings, updateSettings } from '@/lib/storage/settings-storage';
import { getTodayCatCount } from '@/lib/storage/cat-storage';
import { CAT_BREEDS } from '@/lib/cat/cat-types';
import type { SpawnInterval, UserSettings } from '@/types/settings';

/**
 * ポップアップアプリケーションクラス
 * Vanilla TSでDOM構築・イベントハンドリングを管理
 */
class App {
  private root: HTMLElement;
  private settings: UserSettings | null = null;
  private catCount = 0;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  async init(): Promise<void> {
    this.settings = await loadSettings();
    this.catCount = await getTodayCatCount();
    this.render();
    this.bindEvents();
  }

  private render(): void {
    if (!this.settings) return;

    this.root.innerHTML = `
      <div class="popup">
        <header class="header">
          <div class="header-icon">🐱</div>
          <h1 class="header-title">Protect Cat</h1>
        </header>

        <div class="stats-card">
          <div class="stat">
            <span class="stat-value" id="cat-count">${this.catCount}</span>
            <span class="stat-label">cats today</span>
          </div>
        </div>

        <div class="control-section">
          <div class="control-row">
            <span class="control-label">Enable</span>
            <label class="toggle">
              <input type="checkbox" id="toggle-enabled" ${this.settings.enabled ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="control-section">
          <span class="control-label">Spawn interval</span>
          <div class="segment-control" id="interval-selector">
            <button class="segment-btn ${this.settings.spawnIntervalMinutes === 1 ? 'active' : ''}" data-interval="1">1 min</button>
            <button class="segment-btn ${this.settings.spawnIntervalMinutes === 2 ? 'active' : ''}" data-interval="2">2 min</button>
            <button class="segment-btn ${this.settings.spawnIntervalMinutes === 5 ? 'active' : ''}" data-interval="5">5 min</button>
          </div>
        </div>

        <div class="control-section">
          <span class="control-label">Cat Collection</span>
          <div class="cat-grid">
            ${CAT_BREEDS.map(
              (breed) => `
              <div class="cat-card ${breed.isFree ? '' : 'locked'}">
                <div class="cat-thumbnail cat-thumb-${breed.breed}"></div>
                <span class="cat-name">${breed.displayNameJa}</span>
              </div>
            `
            ).join('')}
          </div>
        </div>

        <button class="upgrade-btn" disabled>
          More Cats Coming Soon
        </button>
      </div>
    `;
  }

  private bindEvents(): void {
    // ON/OFF toggle
    const toggle = this.root.querySelector('#toggle-enabled') as HTMLInputElement;
    toggle?.addEventListener('change', async () => {
      await updateSettings({ enabled: toggle.checked });
      chrome.runtime.sendMessage({
        type: 'UPDATE_SETTINGS',
        settings: { enabled: toggle.checked },
      });
    });

    // Interval selector
    const intervalBtns = this.root.querySelectorAll('.segment-btn');
    intervalBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const interval = Number(
          (btn as HTMLElement).dataset['interval']
        ) as SpawnInterval;

        intervalBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        await updateSettings({ spawnIntervalMinutes: interval });
        chrome.runtime.sendMessage({
          type: 'UPDATE_SETTINGS',
          settings: { spawnIntervalMinutes: interval },
        });
      });
    });
  }
}

export { App };
