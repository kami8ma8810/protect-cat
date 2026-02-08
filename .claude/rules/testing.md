---
globs:
  - "__tests__/**/*.ts"
  - "lib/**/*.ts"
---

# Testing Rules

- テストファイルは `__tests__/lib/<module>/<name>.test.ts` に配置
- `@webext-core/fake-browser` で chrome API をモック
- `vi.useFakeTimers()` 使用後は `afterEach` で `vi.useRealTimers()` を呼ぶ
- `fakeBrowser.reset()` を `beforeEach` で呼んでストレージをリセット
- テストは日本語の `it('〜する')` 形式で記述
