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
  main() {
    console.log('Protect Cat content script loaded');
  },
});
