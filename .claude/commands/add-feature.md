---
description: TDDで新機能を追加。テスト先行で実装する
allowed-tools: Bash(npx vitest*), Read, Edit, Write, Glob, Grep
---

TDDで $ARGUMENTS の機能を追加する。

## 手順
1. 機能の要件を整理
2. テストファイルを先に作成（__tests__/lib/ 配下）
3. テスト実行 → RED確認（失敗すること）
4. 最小限の実装コード作成
5. テスト実行 → GREEN確認（パスすること）
6. リファクタリング（必要なら）
7. 全テスト実行して既存テストが壊れていないことを確認
8. コミット

型定義が必要なら types/ に追加。interface優先、any禁止。
