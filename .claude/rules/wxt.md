---
globs:
  - "entrypoints/**/*.ts"
  - "wxt.config.ts"
---

# WXT Rules

- `defineBackground`, `defineContentScript`, `createShadowRootUi` はWXTのグローバル関数（importなし）
- コンテンツスクリプトのCSSは Shadow DOM 内に閉じ込める（`cssInjectionMode: 'ui'`）
- `wxt.config.ts` の modules に `@wxt-dev/module-typescript` を書かない（WXT v0.20 では不要）
- エントリーポイント追加/変更後は `npx wxt prepare` で型を再生成
