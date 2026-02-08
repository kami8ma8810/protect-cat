import { fakeBrowser } from '@webext-core/fake-browser';

// chrome APIをfake-browserでモック
Object.assign(globalThis, {
  chrome: fakeBrowser,
  browser: fakeBrowser,
});
