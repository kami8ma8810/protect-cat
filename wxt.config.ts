import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Protect Cat',
    description:
      'SNSの見過ぎを防ぐ猫たち。時間経過とともにピクセルアートの猫が画面に増殖します。',
    version: '1.0.0',
    permissions: ['storage', 'alarms', 'tabs'],
  },
});
