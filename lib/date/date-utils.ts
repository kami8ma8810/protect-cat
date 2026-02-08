/**
 * 今日の日付をYYYY-MM-DD形式の文字列で返す
 */
function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 2つの日付文字列が同じ日かどうか比較する
 */
function isSameDate(dateA: string, dateB: string): boolean {
  return dateA === dateB;
}

/**
 * 保存された日付が今日と異なるかどうか判定する
 * 初回起動（空文字列）の場合もtrueを返す
 */
function isNewDay(lastSavedDate: string): boolean {
  if (lastSavedDate === '') return true;
  return !isSameDate(lastSavedDate, getTodayDateString());
}

export { getTodayDateString, isSameDate, isNewDay };
