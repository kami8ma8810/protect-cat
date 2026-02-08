import { isSnsUrl } from '@/lib/sns/sns-detector';
import { loadCats } from '@/lib/storage/cat-storage';

/** 日付リセット用アラーム名 */
const DAILY_RESET_ALARM = 'daily-reset';

export default defineBackground(() => {
  // 日付リセット用アラームを設定（毎日0:00）
  setupDailyResetAlarm();

  // アラームリスナー
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === DAILY_RESET_ALARM) {
      await notifyAllSnsTabs('RESET_CATS');
      // 次の日のアラームを再設定
      setupDailyResetAlarm();
    }
  });

  // タブ更新時にSNSサイトを検出
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && isSnsUrl(tab.url)) {
      // コンテンツスクリプトは自動的にマッチするので追加の処理は不要
      // ただし将来的にここでSNS滞在時間の追跡などを行う
    }
  });

  // ポップアップや他のコンポーネントからのメッセージ処理
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_CAT_COUNT') {
      loadCats().then((cats) => {
        sendResponse({ count: cats.length });
      });
      return true; // 非同期レスポンスを示す
    }

    if (message.type === 'UPDATE_SETTINGS') {
      // 全SNSタブに設定更新を通知
      notifyAllSnsTabs('UPDATE_SETTINGS', { settings: message.settings });
    }
  });
});

/**
 * 次の0:00にアラームを設定する
 */
function setupDailyResetAlarm(): void {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0
  );
  const delayMinutes = (tomorrow.getTime() - now.getTime()) / 60000;

  chrome.alarms.create(DAILY_RESET_ALARM, {
    delayInMinutes: delayMinutes,
  });
}

/**
 * 全SNSタブにメッセージを送信する
 */
async function notifyAllSnsTabs(
  type: string,
  data?: Record<string, unknown>
): Promise<void> {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id && tab.url && isSnsUrl(tab.url)) {
      chrome.tabs.sendMessage(tab.id, { type, ...data }).catch(() => {
        // コンテンツスクリプトがまだロードされていない場合は無視
      });
    }
  }
}
