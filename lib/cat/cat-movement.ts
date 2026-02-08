import type { Position, CatDirection } from '@/types/cat';

/**
 * 猫の位置を更新する
 * sin合成ノイズで自然な動きを実現
 */
function updatePosition(
  current: Position,
  direction: CatDirection,
  speed: number,
  viewportWidth: number,
  viewportHeight: number,
  catSize: number
): Position {
  const dx = direction === 'right' ? speed : -speed;
  // sin合成で軽い上下揺れ
  const dy = Math.sin(Date.now() / 500) * 0.3;

  const newX = Math.max(0, Math.min(viewportWidth - catSize, current.x + dx));
  const newY = Math.max(
    viewportHeight * 0.5,
    Math.min(viewportHeight - catSize, current.y + dy)
  );

  return { x: newX, y: newY };
}

/**
 * 猫が画面端に到達しているか判定する
 */
function isAtBoundary(
  position: Position,
  direction: CatDirection,
  viewportWidth: number,
  catSize: number
): boolean {
  if (direction === 'right') {
    return position.x >= viewportWidth - catSize;
  }
  return position.x <= 0;
}

/**
 * 画面下半分のランダムな位置を返す
 * 猫は画面の下半分にのみスポーンする
 */
function getRandomPosition(
  viewportWidth: number,
  viewportHeight: number,
  catSize: number
): Position {
  const x = Math.random() * (viewportWidth - catSize);
  const minY = viewportHeight * 0.5;
  const maxY = viewportHeight - catSize;
  const y = minY + Math.random() * (maxY - minY);
  return { x, y };
}

export { updatePosition, isAtBoundary, getRandomPosition };
