import type { CatInstance, CatPersistState } from '@/types/cat';
import { createRandomCat } from './cat-factory';
import { getNextState, getStateDuration, STATE_CONFIGS } from './cat-behavior';
import { updatePosition, isAtBoundary } from './cat-movement';
import { createCatElement, updateCatElement, removeCatElement } from './cat-renderer';
import { CAT_SIZE_CONFIGS } from './cat-types';
import { saveCats, loadCats, incrementTodayCatCount } from '@/lib/storage/cat-storage';
import { loadSettings } from '@/lib/storage/settings-storage';

/** 保存デバウンス間隔（ミリ秒） */
const SAVE_DEBOUNCE_MS = 5000;

/**
 * 猫の全体管理クラス
 * 猫の生成・状態更新・描画・保存を一元管理する
 */
class CatManager {
  private cats: CatInstance[] = [];
  private container: HTMLElement;
  private animationFrameId: number | null = null;
  private saveTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private maxCats = 50;
  private isPremium = false;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * ストレージから猫データを復元して初期化する
   */
  async init(): Promise<void> {
    const settings = await loadSettings();
    this.maxCats = settings.maxCats;
    this.isPremium = settings.isPremium;

    const persisted = await loadCats();
    for (const data of persisted) {
      const cat = this.restoreCat(data);
      this.cats.push(cat);
    }

    this.startAnimationLoop();
  }

  /**
   * 永続化データからCatInstanceを復元する
   */
  private restoreCat(data: CatPersistState): CatInstance {
    const now = Date.now();
    const cat: CatInstance = {
      ...data,
      stateEnteredAt: now,
      stateDuration: getStateDuration(data.state),
      currentFrame: 0,
      element: null,
    };
    cat.element = createCatElement(cat, this.container);
    return cat;
  }

  /**
   * 新しい猫をスポーンする
   */
  async spawnCat(): Promise<void> {
    if (this.cats.length >= this.maxCats) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cat = createRandomCat(viewportWidth, viewportHeight, this.isPremium);
    cat.element = createCatElement(cat, this.container);
    this.cats.push(cat);

    await incrementTodayCatCount();
    this.scheduleSave();
  }

  /**
   * アニメーションループを開始する
   */
  private startAnimationLoop(): void {
    const loop = () => {
      this.update();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  /**
   * 全猫の状態を更新する
   */
  private update(): void {
    const now = Date.now();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    for (const cat of this.cats) {
      const elapsed = now - cat.stateEnteredAt;

      // 状態の持続時間が終了したら遷移
      if (elapsed >= cat.stateDuration) {
        this.transitionState(cat);
      }

      // walkingの場合のみ移動
      if (cat.state === 'walking') {
        const sizeConfig = CAT_SIZE_CONFIGS[cat.size];

        // 画面端に到達したら方向転換
        if (isAtBoundary(cat.position, cat.direction, viewportWidth, sizeConfig.px)) {
          cat.state = 'turning';
          cat.stateEnteredAt = now;
          cat.stateDuration = getStateDuration('turning');
        } else {
          cat.position = updatePosition(
            cat.position,
            cat.direction,
            sizeConfig.speed,
            viewportWidth,
            viewportHeight,
            sizeConfig.px
          );
        }
      }

      updateCatElement(cat);
    }
  }

  /**
   * 猫の状態を遷移させる
   */
  private transitionState(cat: CatInstance): void {
    const nextState = getNextState(cat.state);

    // turning終了時に方向を反転
    if (cat.state === 'turning') {
      cat.direction = cat.direction === 'left' ? 'right' : 'left';
    }

    cat.state = nextState;
    cat.stateEnteredAt = Date.now();
    cat.stateDuration = getStateDuration(nextState);
    cat.currentFrame = 0;
  }

  /**
   * デバウンスして猫データを保存する
   */
  private scheduleSave(): void {
    if (this.saveTimeoutId !== null) {
      clearTimeout(this.saveTimeoutId);
    }
    this.saveTimeoutId = setTimeout(() => {
      this.save();
      this.saveTimeoutId = null;
    }, SAVE_DEBOUNCE_MS);
  }

  /**
   * 現在の猫データをストレージに保存する
   */
  private async save(): Promise<void> {
    const persistData: CatPersistState[] = this.cats.map((cat) => ({
      id: cat.id,
      breed: cat.breed,
      size: cat.size,
      position: cat.position,
      direction: cat.direction,
      state: cat.state,
      spawnedAt: cat.spawnedAt,
    }));
    await saveCats(persistData);
  }

  /**
   * 全猫を削除してリセットする
   */
  async reset(): Promise<void> {
    for (const cat of this.cats) {
      if (cat.element) {
        removeCatElement(cat.element);
      }
    }
    this.cats = [];
    await this.save();
  }

  /**
   * アニメーションループを停止してクリーンアップする
   */
  destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.saveTimeoutId !== null) {
      clearTimeout(this.saveTimeoutId);
      this.saveTimeoutId = null;
    }
    // 保存してからDOM要素を削除
    this.save();
    for (const cat of this.cats) {
      if (cat.element) {
        removeCatElement(cat.element);
      }
    }
    this.cats = [];
  }

  /**
   * 現在の猫の数を返す
   */
  get catCount(): number {
    return this.cats.length;
  }

  /**
   * 最大猫数を更新する
   */
  updateMaxCats(max: number): void {
    this.maxCats = max;
  }

  /**
   * Premium状態を更新する
   */
  updatePremium(isPremium: boolean): void {
    this.isPremium = isPremium;
  }
}

export { CatManager };
