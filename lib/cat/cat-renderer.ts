import type { CatInstance, CatState } from '@/types/cat';

const CAT_STATE_CLASSES: CatState[] = [
  'idle',
  'walking',
  'sitting',
  'sleeping',
  'turning',
];

/**
 * transformスタイル文字列を生成する
 */
function getTransformStyle(cat: CatInstance): string {
  const scaleX = cat.direction === 'left' ? 'scaleX(-1)' : '';
  return `translate3d(${cat.position.x}px, ${cat.position.y}px, 0) ${scaleX}`.trim();
}

/**
 * 猫のDOM要素を生成してコンテナに追加する
 */
function createCatElement(
  cat: CatInstance,
  container: HTMLElement
): HTMLElement {
  const el = document.createElement('div');
  el.classList.add(
    'protect-cat',
    `cat-${cat.breed}`,
    `cat-${cat.size}`,
    `cat-${cat.state}`
  );
  el.dataset['catId'] = cat.id;
  el.style.position = 'absolute';
  el.style.top = '0';
  el.style.left = '0';
  el.style.willChange = 'transform';
  el.style.transform = getTransformStyle(cat);
  el.style.pointerEvents = 'none';

  container.appendChild(el);
  return el;
}

/**
 * 猫のDOM要素を更新する
 */
function updateCatElement(cat: CatInstance): void {
  const el = cat.element;
  if (!el) return;

  // 位置と方向の更新
  el.style.transform = getTransformStyle(cat);

  // 状態クラスの更新
  for (const state of CAT_STATE_CLASSES) {
    el.classList.remove(`cat-${state}`);
  }
  el.classList.add(`cat-${cat.state}`);
}

/**
 * 猫のDOM要素をDOMから削除する
 */
function removeCatElement(element: HTMLElement): void {
  element.remove();
}

export { createCatElement, updateCatElement, removeCatElement };
