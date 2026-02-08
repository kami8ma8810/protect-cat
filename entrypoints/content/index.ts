import { CatManager } from '@/lib/cat/cat-manager';
import { SpawnTimer } from '@/lib/timer/spawn-timer';
import { loadSettings } from '@/lib/storage/settings-storage';
import { loadCats } from '@/lib/storage/cat-storage';
import { isNewDay } from '@/lib/date/date-utils';
import './style.css';

export default defineContentScript({
  matches: [
    '*://*.facebook.com/*',
    '*://*.youtube.com/*',
    '*://web.whatsapp.com/*',
    '*://*.instagram.com/*',
    '*://*.tiktok.com/*',
    '*://web.wechat.com/*',
    '*://web.telegram.org/*',
    '*://*.t.me/*',
    '*://*.x.com/*',
    '*://*.twitter.com/*',
    '*://*.snapchat.com/*',
    '*://*.reddit.com/*',
  ],
  runAt: 'document_idle',
  cssInjectionMode: 'ui',

  async main(ctx) {
    const settings = await loadSettings();
    if (!settings.enabled) return;

    // Shadow DOM UIを作成
    const ui = await createShadowRootUi(ctx, {
      name: 'protect-cat',
      position: 'overlay',
      onMount(container) {
        container.classList.add('protect-cat-container');
        return container;
      },
    });

    ui.mount();

    const container = ui.shadow.querySelector(
      '.protect-cat-container'
    ) as HTMLElement;
    if (!container) return;

    // CatManagerを初期化
    const catManager = new CatManager(container);
    await catManager.init();

    // スポーンタイマーを開始
    const spawnTimer = new SpawnTimer(
      () => catManager.spawnCat(),
      settings.spawnIntervalSeconds
    );
    spawnTimer.start();

    // Service Workerからのメッセージリスナー
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'SPAWN_CAT') {
        catManager.spawnCat();
      } else if (message.type === 'RESET_CATS') {
        catManager.reset();
      } else if (message.type === 'UPDATE_SETTINGS') {
        if (message.settings?.enabled === false) {
          spawnTimer.stop();
          catManager.destroy();
        } else if (message.settings?.enabled === true) {
          spawnTimer.start();
          catManager.init();
        }
        if (message.settings?.spawnIntervalSeconds) {
          spawnTimer.updateInterval(message.settings.spawnIntervalSeconds);
        }
        if (message.settings?.maxCats) {
          catManager.updateMaxCats(message.settings.maxCats);
        }
      }
    });

    // タブ復帰時の日付チェック
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        const result = await chrome.storage.local.get(['lastSavedDate']);
        const lastSavedDate =
          (result['lastSavedDate'] as string | undefined) ?? '';
        if (isNewDay(lastSavedDate)) {
          await catManager.reset();
        }
      }
    });

    // クリーンアップ
    ctx.onInvalidated(() => {
      spawnTimer.stop();
      catManager.destroy();
    });
  },
});
