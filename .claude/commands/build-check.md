---
description: ビルドとテストの一括チェック
allowed-tools: Bash(npx wxt*, npx vitest*)
---

プロジェクトの健全性を一括チェックする。

## 並列実行
以下を並列で実行:
1. `npx vitest run` - 全テスト実行
2. `npx wxt build` - 本番ビルド

## 確認項目
- テスト: 全パスか
- ビルド: エラーなしか
- ビルドサイズ: 200KB以下か

結果をサマリーとして報告。
