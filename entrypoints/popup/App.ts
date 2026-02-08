import { loadSettings, updateSettings } from '@/lib/storage/settings-storage';
import { getTodayCatCount } from '@/lib/storage/cat-storage';
import { CAT_BREEDS } from '@/lib/cat/cat-types';
import {
  FREE_INTERVAL_PRESETS,
  SPAWN_INTERVAL_RANGE,
  PREMIUM_MAX_CATS,
  FREE_MAX_CATS,
} from '@/types/settings';
import type { UserSettings } from '@/types/settings';

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

    const intervalSeconds = this.settings.spawnIntervalSeconds;
    const isPremium = this.settings.isPremium;
    const maxCats = isPremium ? PREMIUM_MAX_CATS : FREE_MAX_CATS;

    this.root.innerHTML = `
      <div class="popup">
        <header class="header">
          <div class="header-icon">🐱</div>
          <h1 class="header-title">Protect Cat</h1>
          ${isPremium ? '<span class="premium-badge">Premium</span>' : ''}
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
          ${
            isPremium
              ? `
            <div class="slider-row">
              <input type="range" id="interval-slider" class="slider"
                min="${SPAWN_INTERVAL_RANGE.min}" max="${SPAWN_INTERVAL_RANGE.max}"
                value="${intervalSeconds}" step="10">
              <span class="slider-value" id="interval-value">${this.formatInterval(intervalSeconds)}</span>
            </div>
          `
              : `
            <div class="segment-control" id="interval-selector">
              ${FREE_INTERVAL_PRESETS.map(
                (sec) => `
                <button class="segment-btn ${intervalSeconds === sec ? 'active' : ''}" data-interval="${sec}">
                  ${this.formatInterval(sec)}
                </button>
              `
              ).join('')}
            </div>
          `
          }
        </div>

        <div class="control-section">
          <span class="control-label">Cat Collection</span>
          <div class="cat-grid">
            ${CAT_BREEDS.map(
              (breed) => `
              <div class="cat-card ${!breed.isFree && !isPremium ? 'locked' : ''}">
                <div class="cat-thumbnail cat-thumb-${breed.breed}">
                  ${!breed.isFree && !isPremium ? '<span class="lock-icon">🔒</span>' : ''}
                </div>
                <span class="cat-name">${breed.displayNameJa}</span>
              </div>
            `
            ).join('')}
          </div>
        </div>

        ${
          !isPremium
            ? `
          <button class="upgrade-btn" id="upgrade-btn">
            Upgrade to Premium
          </button>
        `
            : `
          <div class="premium-info">
            Max cats: ${maxCats}
          </div>
        `
        }
      </div>
    `;
  }

  private formatInterval(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.round(seconds / 60)} min`;
  }

  private bindEvents(): void {
    // ON/OFF toggle
    const toggle = this.root.querySelector(
      '#toggle-enabled'
    ) as HTMLInputElement;
    toggle?.addEventListener('change', async () => {
      await updateSettings({ enabled: toggle.checked });
      this.sendSettingsUpdate({ enabled: toggle.checked });
    });

    if (this.settings?.isPremium) {
      // Premium: slider
      const slider = this.root.querySelector(
        '#interval-slider'
      ) as HTMLInputElement;
      const valueDisplay = this.root.querySelector('#interval-value');
      slider?.addEventListener('input', () => {
        const seconds = Number(slider.value);
        if (valueDisplay) {
          valueDisplay.textContent = this.formatInterval(seconds);
        }
      });
      slider?.addEventListener('change', async () => {
        const seconds = Number(slider.value);
        await updateSettings({ spawnIntervalSeconds: seconds });
        this.sendSettingsUpdate({ spawnIntervalSeconds: seconds });
      });
    } else {
      // Free: segment buttons
      const intervalBtns = this.root.querySelectorAll('.segment-btn');
      intervalBtns.forEach((btn) => {
        btn.addEventListener('click', async () => {
          const seconds = Number((btn as HTMLElement).dataset['interval']);
          intervalBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          await updateSettings({ spawnIntervalSeconds: seconds });
          this.sendSettingsUpdate({ spawnIntervalSeconds: seconds });
        });
      });
    }

    // Upgrade button
    const upgradeBtn = this.root.querySelector('#upgrade-btn');
    upgradeBtn?.addEventListener('click', () => {
      // Phase 2: ExtensionPay統合時にここを実装
      // 今はPremiumフラグを直接切り替え（開発用）
    });
  }

  private sendSettingsUpdate(settings: Partial<UserSettings>): void {
    chrome.runtime.sendMessage({
      type: 'UPDATE_SETTINGS',
      settings,
    });
  }
}

export { App };
