# protect-cat Project Standards

## Overview
SNSの見過ぎを防ぐChrome拡張機能。ピクセルアートの猫が画面に増殖する。

## Tech Stack
- **Framework**: WXT v0.20 (Vite-based browser extension framework)
- **Language**: TypeScript (strict mode)
- **Test**: Vitest + @webext-core/fake-browser + jsdom
- **UI**: Vanilla TypeScript + CSS (no React/Vue)

## Commands
- `npx wxt dev` - 開発サーバー起動
- `npx wxt build` - 本番ビルド
- `npx wxt prepare` - WXT型定義生成
- `npx vitest run` - テスト実行
- `npx vitest --watch` - テストウォッチモード

## Architecture
- `entrypoints/` - WXTエントリーポイント (background, content, popup)
- `lib/` - ビジネスロジック (cat/, storage/, sns/, timer/, date/)
- `types/` - TypeScript型定義
- `__tests__/` - テストファイル（lib/と同じ構造）

## Key Patterns
- **TDD**: テストを先に書いてから実装
- **FSM**: 猫の行動は有限状態マシン (idle/walking/sitting/sleeping/turning)
- **Shadow DOM**: コンテンツスクリプトはShadow DOM内で動作
- **Debounced Save**: 猫データの保存は5秒デバウンス
- **Daily Reset**: 日付が変わると猫はリセット

## Testing Rules
- fake-browserでchrome APIをモック（__tests__/setup.tsで設定済み）
- パスエイリアス `@/` はプロジェクトルートを指す
- テストファイルは `__tests__/lib/<module>/<name>.test.ts`

## Type Rules
- `interface` をオブジェクト形状に使う（`type` は union/tuple/mapped のみ）
- `any` / `unknown` 禁止
- キャスト最小限、ダブルキャスト禁止

## Commit Rules
- こまめにコミット（機能単位）
- コミット前に全テストパス確認
